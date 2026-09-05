const mongoose = require('mongoose');
const User = require('../models/User');
const { MESSAGES, HTTP_STATUS } = require('../config/constants');
const { logAction } = require('../utils/audit');

const VALID_ROLES = ['customer', 'kitchen', 'admin', 'delivery'];
const ADMIN_ROLES = ['admin'];

const normalizeUserRole = (role) => {
  const value = String(role ?? '').trim();
  if (!value) return 'customer';

  const key = value.toLowerCase();
  const roleMap = {
    customer: 'customer',
    kitchen: 'kitchen',
    foodmaker: 'kitchen',
    'kitchen staff': 'kitchen',
    kitchen_staff: 'kitchen',
    staff: 'kitchen',
    admin: 'admin',
    delivery: 'delivery',
    delivery_staff: 'delivery',
    'delivery staff': 'delivery',
    driver: 'delivery',
    rider: 'delivery'
  };

  return roleMap[key] || value;
};

const isAdminRole = (role) => ADMIN_ROLES.includes(String(role ?? '').trim()) || String(role ?? '').toLowerCase() === 'admin';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const phoneRegex = /^(\+251[0-9]{9}|(09|07)[0-9]{8})$/;

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: normalizeUserRole(user.role),
    balance: user.balance,
    status: user.status,
    isActive: user.isActive,
    avatar: user.avatar,
    createdAt: user.createdAt
  };
}

/**
 * Count active administrators (admin / ADMIN) with status ACTIVE and isActive true.
 */
const countActiveAdmins = () =>
  User.countDocuments({ role: { $in: ADMIN_ROLES }, status: 'ACTIVE', isActive: true });

/**
 * @desc    Get all users (Admin only) - paginated & filterable
 * @route   GET /api/v1/admin/users  (also /api/v1/users)
 * @access  Private/Admin
 * Query Params: page, limit, search, role, status
 * Response: { success, count, total, page, pages, users: [...] }
 */
exports.getAllUsers = async (req, res) => {
  try {
    const { search, role, status, page = 1, limit = 20 } = req.query;
    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    if (role && role !== 'all') {
      filter.role = normalizeUserRole(role);
    }
    if (status && status !== 'all') filter.status = status.toUpperCase();

    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    const total = await User.countDocuments(filter);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: users.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      users: users.map(sanitizeUser)
    });
  } catch (error) {
    console.error('❌ Get All Users Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: MESSAGES.SERVER_ERROR });
  }
};

/**
 * @desc    Get single user by ID (Admin only)
 * @route   GET /api/v1/admin/users/:id
 * @access  Private/Admin
 */
exports.getUserById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, error: 'Invalid user id' });
    }
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, error: 'User not found' });
    }
    res.status(HTTP_STATUS.OK).json({ success: true, user: sanitizeUser(user) });
  } catch (error) {
    console.error('❌ Get User By ID Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: MESSAGES.SERVER_ERROR });
  }
};

/**
 * @desc    Create new user (Admin only)
 * @route   POST /api/v1/admin/users
 * @access  Private/Admin
 * Body: { name, email, phone, role, balance, password }
 * Flow: validate input -> check duplicate email -> hash password (bcrypt pre-save) -> validate role -> save
 */
exports.createUser = async (req, res) => {
  try {
    const { name, email, phone, username, role, status, balance, password } = req.body;

    if (!name || !email || !phone || !role || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Name, email, phone, role, and password are required'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, error: 'Please provide a valid email address' });
    }
    if (!phoneRegex.test(phone)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Enter a valid phone number (09XXXXXXXX or 07XXXXXXXX)'
      });
    }
    if (typeof password !== 'string' || password.length < 6) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, error: 'Password must be at least 6 characters' });
    }
    const normalizedRole = normalizeUserRole(role);
    if (!VALID_ROLES.includes(normalizedRole)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, error: `Invalid role. Allowed: ${VALID_ROLES.join(', ')}` });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { phone }]
    });
    if (existingUser) {
      const conflict = existingUser.email === email.toLowerCase() ? 'User with this email already exists' : 'User with this phone already exists';
      return res.status(HTTP_STATUS.CONFLICT).json({ success: false, error: conflict });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      phone,
      username: username || undefined,
      password,
      role: normalizedRole,
      balance: balance || 0,
      status: status || 'ACTIVE',
      isActive: status ? status === 'ACTIVE' : true
    });

    await logAction({
      req,
      action: 'USER_CREATED',
      entityType: 'User',
      entityId: String(user._id),
      description: `Created ${role} user "${name.trim()}" (${email.toLowerCase()})`
    });

    res.status(HTTP_STATUS.CREATED).json({ success: true, user: sanitizeUser(user) });
  } catch (error) {
    console.error('❌ Create User Error:', error);
    if (error.code === 11000) {
      return res.status(HTTP_STATUS.CONFLICT).json({ success: false, error: 'User with this email or phone already exists' });
    }
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: MESSAGES.SERVER_ERROR });
  }
};

/**
 * Validate that a role change is allowed (admin self-protection).
 * Throws an Error with .statusCode on violation.
 */
async function assertRoleChangeAllowed(user, newRole) {
  if (!VALID_ROLES.includes(newRole)) {
    const error = new Error(`Invalid role. Allowed: ${VALID_ROLES.join(', ')}`);
    error.statusCode = HTTP_STATUS.BAD_REQUEST;
    throw error;
  }

  const wasAdmin = isAdminRole(user.role);
  const willBeAdmin = isAdminRole(newRole);

  if (wasAdmin && !willBeAdmin) {
    const activeAdminCount = await countActiveAdmins();
    if (activeAdminCount <= 1) {
      const error = new Error('Cannot remove the role of or deactivate the last active administrator');
      error.statusCode = HTTP_STATUS.BAD_REQUEST;
      throw error;
    }
  }
}

/**
 * @desc    Update user (Admin only)
 * @route   PUT /api/v1/admin/users/:id
 * @access  Private/Admin
 * Body: { name, email, phone, role, balance, password? }
 */
exports.updateUser = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, error: 'Invalid user id' });
    }

    const { name, email, phone, username, role, status, balance, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, error: 'User not found' });
    }

    if (name !== undefined) {
      if (String(name).trim().length < 2) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, error: 'Name must be at least 2 characters' });
      }
      user.name = name.trim();
    }

    if (email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, error: 'Please provide a valid email address' });
      }
      const existing = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } });
      if (existing) {
        return res.status(HTTP_STATUS.CONFLICT).json({ success: false, error: 'User with this email already exists' });
      }
      user.email = email.toLowerCase();
    }

    if (phone !== undefined) {
      if (!phoneRegex.test(phone)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Enter a valid phone number (09XXXXXXXX or 07XXXXXXXX)'
        });
      }
      const existing = await User.findOne({ phone, _id: { $ne: user._id } });
      if (existing) {
        return res.status(HTTP_STATUS.CONFLICT).json({ success: false, error: 'User with this phone already exists' });
      }
      user.phone = phone;
    }

    if (username !== undefined) {
      user.username = username || undefined;
    }

    if (status !== undefined) {
      const validStatuses = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'BLOCKED'];
      if (!validStatuses.includes(status)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, error: `Invalid status. Allowed: ${validStatuses.join(', ')}` });
      }
      user.status = status;
      user.isActive = status === 'ACTIVE';
    }

    let previousRole = null;
    let roleChanged = false;
    if (role !== undefined) {
      const isSelf = String(user._id) === String(req.user.id);
      if (isSelf && isAdminRole(user.role) && !isAdminRole(role)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Admins cannot remove their own administrator role'
        });
      }
      const normalizedRole = normalizeUserRole(role);
      await assertRoleChangeAllowed(user, normalizedRole);
      previousRole = String(user.role);
      roleChanged = previousRole !== String(normalizedRole);
      user.role = normalizedRole;
    }

    if (balance !== undefined) {
      const parsed = Number(balance);
      if (isNaN(parsed) || parsed < 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, error: 'Balance must be a non-negative number' });
      }
      user.balance = parsed;
    }

    if (password !== undefined && password !== '') {
      if (typeof password !== 'string' || password.length < 6) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, error: 'Password must be at least 6 characters' });
      }
      user.password = password; // hashed by User pre-save hook
    }

    await user.save();

    const changedParts = [];
    if (name !== undefined) changedParts.push('name');
    if (email !== undefined) changedParts.push('email');
    if (phone !== undefined) changedParts.push('phone');
    if (balance !== undefined) changedParts.push('balance');
    if (password !== undefined && password !== '') changedParts.push('password');

    await logAction({
      req,
      action: 'USER_UPDATED',
      entityType: 'User',
      entityId: String(user._id),
      description: `Updated user "${user.name}" - changed: ${changedParts.length ? changedParts.join(', ') : 'details'}`
    });

    if (roleChanged) {
      await logAction({
        req,
        action: 'ROLE_CHANGED',
        entityType: 'User',
        entityId: String(user._id),
        description: `Changed role of "${user.name}" from ${previousRole} to ${user.role}`
      });
    }

    res.status(HTTP_STATUS.OK).json({ success: true, user: sanitizeUser(user) });
  } catch (error) {
    console.error('❌ Update User Error:', error);
    if (error.statusCode && error.message) {
      return res.status(error.statusCode).json({ success: false, error: error.message });
    }
    if (error.code === 11000) {
      return res.status(HTTP_STATUS.CONFLICT).json({ success: false, error: 'User with this email or phone already exists' });
    }
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: MESSAGES.SERVER_ERROR });
  }
};

/**
 * @desc    Assign/change user role (Admin only)
 * @route   PATCH /api/v1/admin/users/:id/role
 * @access  Private/Admin
 * Body: { role }
 */
exports.assignUserRole = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, error: 'Invalid user id' });
    }

    const { role } = req.body;
    if (!role) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, error: 'Role is required' });
    }
    const normalizedRole = normalizeUserRole(role);
    if (!VALID_ROLES.includes(role) && !VALID_ROLES.includes(normalizedRole)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, error: `Invalid role. Allowed: ${VALID_ROLES.join(', ')}` });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, error: 'User not found' });
    }

    const isSelf = String(user._id) === String(req.user.id);
    if (isSelf && isAdminRole(user.role) && !isAdminRole(normalizedRole)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Admins cannot remove their own administrator role'
      });
    }

    const previousRole = String(user.role);
    await assertRoleChangeAllowed(user, normalizedRole);
    user.role = normalizedRole;
    await user.save();

    await logAction({
      req,
      action: 'ROLE_CHANGED',
      entityType: 'User',
      entityId: String(user._id),
      description: `Changed role of "${user.name}" from ${previousRole} to ${normalizedRole}`
    });

    res.status(HTTP_STATUS.OK).json({ success: true, user: sanitizeUser(user) });
  } catch (error) {
    console.error('❌ Assign User Role Error:', error);
    if (error.statusCode && error.message) {
      return res.status(error.statusCode).json({ success: false, error: error.message });
    }
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: MESSAGES.SERVER_ERROR });
  }
};

/**
 * @desc    Delete/deactivate user (Admin only) - soft delete by deactivating
 * @route   DELETE /api/v1/admin/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, error: 'Invalid user id' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, error: 'User not found' });
    }

    if (isAdminRole(user.role) && user.status === 'ACTIVE' && user.isActive !== false) {
      const activeAdminCount = await countActiveAdmins();
      if (activeAdminCount <= 1) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Cannot delete the last active administrator'
        });
      }
    }

    user.status = 'BLOCKED';
    user.isActive = false;
    await user.save();

    await logAction({
      req,
      action: 'USER_DELETED',
      entityType: 'User',
      entityId: String(user._id),
      description: `Deactivated user "${user.name}" (${user.email}) - role: ${user.role}`
    });

    res.status(HTTP_STATUS.OK).json({ success: true, user: sanitizeUser(user), message: 'User deactivated successfully' });
  } catch (error) {
    console.error('❌ Delete User Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: MESSAGES.SERVER_ERROR });
  }
};

/**
 * @desc    Toggle user status / activate-deactivate-suspend (Admin only)
 * @route   PATCH /api/v1/admin/users/:id/status
 * @access  Private/Admin
 * Body: { status: 'ACTIVE' | 'BLOCKED' | 'SUSPENDED' }
 */
exports.toggleUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['ACTIVE', 'BLOCKED', 'SUSPENDED'];
    if (!status || !validStatuses.includes(String(status).toUpperCase())) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Invalid status. Must be ACTIVE, BLOCKED, or SUSPENDED'
      });
    }
    if (!isValidObjectId(req.params.id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, error: 'Invalid user id' });
    }

    const normalizedStatus = String(status).toUpperCase();
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, error: 'User not found' });
    }

    if (normalizedStatus !== 'ACTIVE' && isAdminRole(user.role)) {
      if (String(user._id) === String(req.user.id)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Admins cannot deactivate or suspend their own account'
        });
      }
      if (user.status === 'ACTIVE') {
        const activeAdminCount = await countActiveAdmins();
        if (activeAdminCount <= 1) {
          return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: 'Cannot deactivate or suspend the last active administrator'
          });
        }
      }
    }

    user.status = normalizedStatus;
    user.isActive = normalizedStatus === 'ACTIVE';
    await user.save();

    let actionLabel = 'USER_ACTIVATED';
    let description = `Activated user "${user.name}" (${user.email})`;
    if (normalizedStatus === 'BLOCKED') {
      actionLabel = 'USER_DEACTIVATED';
      description = `Deactivated user "${user.name}" (${user.email})`;
    } else if (normalizedStatus === 'SUSPENDED') {
      actionLabel = 'USER_SUSPENDED';
      description = `Suspended user "${user.name}" (${user.email})`;
    }

    await logAction({
      req,
      action: actionLabel,
      entityType: 'User',
      entityId: String(user._id),
      description
    });

    res.status(HTTP_STATUS.OK).json({ success: true, user: sanitizeUser(user) });
  } catch (error) {
    console.error('❌ Toggle User Status Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: MESSAGES.SERVER_ERROR });
  }
};

/**
 * @desc    Get user statistics (Admin only)
 * @route   GET /api/v1/admin/users/stats
 * @access  Private/Admin
 */
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeCustomers = await User.countDocuments({
      role: 'customer',
      status: 'ACTIVE',
      isActive: true
    });
    const staffCount = await User.countDocuments({
      role: { $in: ['kitchen', 'admin'] }
    });
    const blockedCount = await User.countDocuments({
      status: 'BLOCKED',
      isActive: false
    });
    const suspendedCount = await User.countDocuments({
      status: 'SUSPENDED'
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      stats: { totalUsers, activeCustomers, staffCount, blockedCount, suspendedCount }
    });
  } catch (error) {
    console.error('❌ Get User Stats Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: MESSAGES.SERVER_ERROR });
  }
};

/**
 * @desc    Reset a user's password (Admin only)
 * @route   PATCH /api/v1/admin/users/:id/password
 * @access  Private/Admin
 * Body: { password }
 */
exports.resetUserPassword = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, error: 'Invalid user id' });
    }

    const { password } = req.body;
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Password must be at least 6 characters'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, error: 'User not found' });
    }

    user.password = password;
    await user.save();

    await logAction({
      req,
      action: 'PASSWORD_RESET',
      entityType: 'User',
      entityId: String(user._id),
      description: `Admin reset password for user "${user.name}" (${user.email})`
    });

    res.status(HTTP_STATUS.OK).json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('❌ Reset User Password Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: MESSAGES.SERVER_ERROR });
  }
};