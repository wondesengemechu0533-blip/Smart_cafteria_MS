/**
 * ================================================================
 * SEED ALL SETTINGS DIRECTLY INTO MONGODB
 * ================================================================
 * Run: node scripts/seed-settings.js
 * ================================================================
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Setting = require('../src/models/Setting');
const { DEFAULT_SETTINGS } = require('../src/utils/settings');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_cafeteria';

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to:', MONGO_URI);

    let inserted = 0;
    let updated = 0;
    let skipped = 0;

    for (const def of DEFAULT_SETTINGS) {
      const existing = await Setting.findOne({ key: def.key });
      if (existing) {
        // Update type/group/label if missing
        const changes = {};
        if (!existing.type) changes.type = def.type;
        if (!existing.group) changes.group = def.group;
        if (!existing.label) changes.label = def.label;
        if (Object.keys(changes).length > 0) {
          await Setting.updateOne({ key: def.key }, { $set: changes });
          updated++;
        } else {
          skipped++;
        }
      } else {
        await Setting.create({
          key: def.key,
          value: def.value,
          type: def.type,
          group: def.group,
          label: def.label,
          protected: false
        });
        inserted++;
      }
    }

    console.log('\n=== Settings Seed Complete ===');
    console.log('Inserted:', inserted);
    console.log('Updated:', updated);
    console.log('Skipped (already exist):', skipped);
    console.log('Total DEFAULT_SETTINGS:', DEFAULT_SETTINGS.length);

    // List all settings
    const all = await Setting.find().sort({ group: 1, key: 1 }).lean();
    console.log('\nAll settings in DB:', all.length);
    console.log('\nBy group:');
    const groups = {};
    for (const s of all) {
      if (!groups[s.group]) groups[s.group] = [];
      groups[s.group].push(s.key);
    }
    for (const [g, keys] of Object.entries(groups)) {
      console.log(`  ${g}: ${keys.join(', ')}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
}

seed();
