const KitchenSetting = require('../models/KitchenSetting');
const { MESSAGES, HTTP_STATUS } = require('../config/constants');

/**
 * @desc    Get the current user's kitchen settings
 * @route   GET /api/v1/kitchen/settings
 * @access  Private/Kitchen or Admin
 *
 * Creates a settings document with defaults if none exists.
 * Response: { success, settings }
 */
exports.getKitchenSettings = async (req, res) => {
  try {
    let settings = await KitchenSetting.findOne({ userId: req.user.id });

    if (!settings) {
      settings = await KitchenSetting.create({ userId: req.user.id });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('❌ Get Kitchen Settings Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: MESSAGES.SERVER_ERROR,
    });
  }
};

/**
 * @desc    Update the current user's kitchen settings
 * @route   PUT /api/v1/kitchen/settings
 * @access  Private/Kitchen or Admin
 *
 * Creates a settings document with defaults if none exists, then
 * merges the provided body fields into it.
 * Response: { success, settings }
 */
exports.updateKitchenSettings = async (req, res) => {
  try {
    let settings = await KitchenSetting.findOne({ userId: req.user.id });

    if (!settings) {
      settings = new KitchenSetting({ userId: req.user.id });
    }

    const allowedFields = [
      'station',
      'notificationSound',
      'orderAlertSound',
      'preparationTimerAlert',
      'autoRefresh',
      'refreshInterval',
      'showCompletedOrders',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    });

    await settings.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('❌ Update Kitchen Settings Error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: MESSAGES.SERVER_ERROR,
    });
  }
};
