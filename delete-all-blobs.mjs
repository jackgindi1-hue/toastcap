// Script to delete all Netlify Blob stores
const NETLIFY_ACCESS_TOKEN = process.env.NETLIFY_ACCESS_TOKEN;
const SITE_ID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;

if (!NETLIFY_ACCESS_TOKEN || !SITE_ID) {
  console.log('Need NETLIFY_ACCESS_TOKEN and SITE_ID');
  console.log('NETLIFY_ACCESS_TOKEN:', NETLIFY_ACCESS_TOKEN ? 'set' : 'missing');
  console.log('SITE_ID:', SITE_ID ? 'set' : 'missing');
  process.exit(1);
}

async function listStores() {
  const res = await fetch(`https://api.netlify.com/api/v1/blobs/${SITE_ID}`, {
    headers: { 'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}` }
  });
  return res.json();
}

async function deleteStore(storeName) {
  const res = await fetch(`https://api.netlify.com/api/v1/blobs/${SITE_ID}/${storeName}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}` }
  });
  return res.ok;
}

async function main() {
  console.log('🔍 Fetching all blob stores...');
  const stores = await listStores();
  console.log(`Found ${stores.stores?.length || 0} stores`);
  
  if (!stores.stores || stores.stores.length === 0) {
    console.log('✅ No stores to delete!');
    return;
  }

  for (const store of stores.stores) {
    console.log(`🗑️ Deleting store: ${store.name}...`);
    const success = await deleteStore(store.name);
    console.log(success ? `   ✅ Deleted` : `   ❌ Failed`);
  }
  
  console.log('🎉 Done!');
}

main().catch(console.error);
