require('dotenv').config();
const fs = require('fs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const connectDatabase = require('../src/config/database');
const User = require('../src/models/User');

(async () => {
  try {
    await connectDatabase();
    const emails = {
      admin: 'e2e-admin@test.local',
      customer: 'e2e-customer@test.local',
      rider: 'e2e-rider@test.local'
    };
    const out = {};
    for (const [key, email] of Object.entries(emails)) {
      const u = await User.findOne({ email });
      if (!u) throw new Error('missing user ' + email);
      out[key] = jwt.sign({ id: u._id.toString(), role: u.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
    }
    const target = process.env.E2E_TOKENS_FILE || 'C:\\Users\\HP\\AppData\\Local\\Temp\\opencode\\e2e-tokens.json';
    fs.writeFileSync(target, JSON.stringify(out, null, 2));
    console.log('tokens written to', target);
    mongoose.disconnect();
    process.exit(0);
  } catch (e) { console.error(e); process.exit(1); }
})();