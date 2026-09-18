const fs = require('fs');

const envPath = 'c:/Users/Shyam\Scholar Vault 2/ScholarVault Web App v2/.env.local';
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
for (const line of envContent.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const idx = trimmed.indexOf('=');
  if (idx !== -1) {
    const k = trimmed.slice(0, idx).trim();
    const v = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
    env[k] = v;
  }
}

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function checkTable(table, payload) {
  const res = await fetch(`${url}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    },
    body: JSON.stringify(payload)
  });
  console.log(`${table}: HTTP ${res.status}`);
  const text = await res.text();
  console.log('Response:', text);
}

async function run() {
  await checkTable('conf_subscribers', { conf_id: 'isiai-sgs-2026', email: 'test_sub_check_12345@example.com' });
}

run().catch(console.error);
