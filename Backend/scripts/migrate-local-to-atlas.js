/**
 * Migrate data from a local MongoDB to MongoDB Atlas.
 *
 * Copies every collection from the source (local) database into the Atlas
 * database referenced by MONGODB_URI in .env. Preserves _id values.
 *
 * Run:  node scripts/migrate-local-to-atlas.js
 */
require('dotenv').config();
const { MongoClient } = require('mongodb');

const SOURCE_URI = process.env.LOCAL_MONGODB_URI || 'mongodb://localhost:27017';
const SOURCE_DB = process.env.MIGRATE_SOURCE_DB || 'smart_cafeteria';
const TARGET_URI = process.env.MONGODB_URI;
const TARGET_DB = process.env.MIGRATE_TARGET_DB || 'smart_cafeteria';

const DROP_TARGET_FIRST = String(process.env.MIGRATE_DROP_TARGET || 'true').toLowerCase() === 'true';

if (!TARGET_URI) {
  console.error('MONGODB_URI is not set in .env — nothing to migrate to.');
  process.exit(1);
}

function mask(uri) {
  return String(uri).replace(/:\/\/[^@/]+@/, '://***@');
}

async function main() {
  console.log('Local source :', SOURCE_URI, '/', SOURCE_DB);
  console.log('Atlas target  :', mask(TARGET_URI), '/', TARGET_DB);

  const source = new MongoClient(SOURCE_URI, { serverSelectionTimeoutMS: 10000 });
  const target = new MongoClient(TARGET_URI, { serverSelectionTimeoutMS: 30000 });

  try {
    console.log('\n➜ Connecting to local MongoDB...');
    await source.connect();
    console.log('   ✓ Local connected');

    console.log('➜ Connecting to MongoDB Atlas...');
    await target.connect();
    console.log('   ✓ Atlas connected');

    const srcDb = source.db(SOURCE_DB);
    const tgtDb = target.db(TARGET_DB);

    const collections = await srcDb.listCollections().toArray();
    if (collections.length === 0) {
      console.log(`\nNo collections found in ${SOURCE_DB}. Nothing to migrate.`);
      return;
    }

    console.log(`\nFound ${collections.length} collection(s).`);

    let totalDocs = 0;
    const report = [];

    for (const info of collections) {
      const name = info.name;
      if (name.startsWith('system.')) continue;

      const docs = await srcDb.collection(name).find({}).toArray();
      totalDocs += docs.length;

      if (DROP_TARGET_FIRST) {
        await tgtDb.collection(name).drop().catch(() => {});
      }

      if (docs.length === 0) {
        report.push({ name, docs: 0, status: 'skipped (empty)' });
        console.log(`   - ${name}: 0 docs (empty)`);
        continue;
      }

      try {
        await tgtDb.collection(name).insertMany(docs, { ordered: false });
        report.push({ name, docs: docs.length, status: 'OK' });
        console.log(`   ✓ ${name}: ${docs.length} docs`);
      } catch (e) {
        report.push({ name, docs: docs.length, status: 'FAILED: ' + e.message });
        console.error(`   ✗ ${name}: ${e.message}`);
      }
    }

    console.log('\n============================================');
    console.log('MIGRATION SUMMARY');
    console.log('============================================');
    console.table(report);
    console.log(`Total documents migrated: ${totalDocs}`);
    console.log('============================================');
  } catch (e) {
    console.error('\n❌ Migration failed:', e.message);
    process.exitCode = 1;
  } finally {
    await source.close().catch(() => {});
    await target.close().catch(() => {});
  }
}

main();
