require('dotenv').config();
const mongoose = require('mongoose');
const connectDatabase = require('../src/config/database');
const User = require('../src/models/User');

(async () => {
  try {
    await connectDatabase();
    console.log('Connected to DB.');

    const NEW_EMAIL = 'admin1221@gmail.com';
    const NEW_PASSWORD = 'Ma1221@!';

    // Find any existing role=admin OR the old admin email
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) admin = await User.findOne({ email: 'admin1221@gmail.com' });

    if (!admin) {
      console.log('No admin found. Creating new admin with requested credentials.');
      admin = await User.create({
        name: 'Admin User',
        email: NEW_EMAIL,
        phone: '0911223344',
        password: NEW_PASSWORD,
        role: 'admin',
        balance: 5000,
        status: 'ACTIVE'
      });
      console.log('Created admin:', admin.email);
    } else {
      admin.email = NEW_EMAIL;
      admin.role = 'admin';
      admin.status = 'ACTIVE';
      admin.password = NEW_PASSWORD;
      await admin.save();
      console.log('Updated admin -> email:', admin.email);
    }

    const verify = await User.findById(admin._id).select('+password');
    const match = await verify.matchPassword(NEW_PASSWORD);
    console.log('Login check -> email:', verify.email, '| role:', verify.role, '| password matches:', match);

    mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('ERROR:', err.message);
    process.exit(1);
  }
})();
