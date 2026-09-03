/**
 * Add an IP to the MongoDB Atlas Network Access (IP Access List) using the Admin API.
 *
 * Requires Atlas API credentials (public + private key) with a Project Owner
 * role on the target project. These must be provided via environment variables
 * (NEVER hard-code them, never commit them):
 *
 *   ATLAS_PUBLIC_KEY=
 *   ATLAS_PRIVATE_KEY=
 *   ATLAS_PROJECT_ID=          (e.g. the hex id of your Cluster0 project)
 *
 * The script also auto-detects the current public IP and will add it, plus
 * optionally 0.0.0.0/0 for "Allow Access from Anywhere".
 *
 * Run:  node scripts/atlas-whitelist.js
 */
require('dotenv').config();

const API_BASE = 'https://cloud.mongodb.com/api/atlas/v1.0';

const PUB = process.env.ATLAS_PUBLIC_KEY;
const PRIV = process.env.ATLAS_PRIVATE_KEY;
const PROJECT = process.env.ATLAS_PROJECT_ID;
const ADD_ANYWHERE = String(process.env.ATLAS_ADD_ANYWHERE || 'false').toLowerCase() === 'true';

if (!PUB || !PRIV || !PROJECT) {
  console.error('Missing required env: ATLAS_PUBLIC_KEY, ATLAS_PRIVATE_KEY, ATLAS_PROJECT_ID');
  process.exit(1);
}

async function currentPublicIp() {
  const res = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(15000) });
  const json = await res.json();
  return json.ip;
}

async function api(method, path, body) {
  const auth = Buffer.from(`${PUB}:${PRIV}`).toString('base64');
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/vnd.atlas.2024-08-05+json',
      Authorization: `Basic ${auth}`
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(60000)
  });
  const text = await res.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch (_) {}
  if (!res.ok) {
    throw new Error(`Atlas API ${res.status}: ${text || res.statusText}`);
  }
  return json;
}

async function projectIdToProjectName() {
  const me = await api('GET', `/api/atlas/v1.0/users`).then(() => null).catch(() => null);
  return me;
}

async function main() {
  console.log('Checking Atlas API access...');

  const projects = await api('GET', '/groups');
  const project = (projects && projects.results || []).find((p) => p.id === PROJECT);
  if (!project) {
    console.error(`✗ Project id "${PROJECT}" not found or key lacks access.`);
    process.exit(1);
  }
  console.log(`✓ Project found: ${project.name} (${project.id})`);

  const entries = [];

  if (ADD_ANYWHERE) {
    entries.push({ ipAddress: '0.0.0.0/0', comment: 'Allow Access from Anywhere' });
  } else {
    const ip = await currentPublicIp();
    entries.push({ ipAddress: ip, comment: 'Local dev IP' });
  }

  console.log('\nAdding IP access list entries:');
  for (const e of entries) {
    console.log(`  - ${e.ipAddress} (${e.comment})`);
    try {
      const created = await api('POST', `/groups/${PROJECT}/accessList`, { items: [e] });
      console.log(`  ✓ Added: ${created.results?.[0]?.ipAddress ?? e.ipAddress}`);
    } catch (err) {
      console.error(`  ✗ ${err.message}`);
    }
  }

  console.log('\nFetching current whitelist:');
  const list = await api('GET', `/groups/${PROJECT}/accessList`);
  for (const it of list.results || []) {
    console.log(`  - ${it.ipAddress} "${it.comment || ''}"`);
  }

  console.log('\nDone. Wait 1-2 minutes for the access list to propagate, then reconnect.');
}

main().catch((e) => {
  console.error('✗ Fatal:', e.message);
  process.exit(1);
});
