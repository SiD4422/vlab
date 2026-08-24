// ============================================================
// Phase 0 - Multi-Tenant Backfill Script
// Stamps org_id: 'srm_univ' onto every existing Firestore doc.
// Safe to re-run — skips docs that already have org_id.
//
// Usage:
//   1. npm install firebase-admin
//   2. Place serviceAccountKey.json in the project root
//      (Firebase Console → Project Settings → Service Accounts → Generate New Private Key)
//   3. node phase0-backfill.js
// ============================================================

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();
const ORG_ID = 'srm_univ';
const COLLECTIONS = ['users', 'classes', 'submissions', 'groups'];

async function backfillCollection(collectionName) {
  const snapshot = await db.collection(collectionName).get();

  if (snapshot.empty) {
    console.log(`[SKIP]  ${collectionName.padEnd(12)} — empty collection.`);
    return 0;
  }

  let batch = db.batch();
  let opCount = 0;
  let skipped = 0;
  const batches = [];

  for (const docSnap of snapshot.docs) {
    if (docSnap.data().org_id) {
      skipped++;
      continue;
    }
    batch.update(docSnap.ref, { org_id: ORG_ID });
    opCount++;
    if (opCount % 499 === 0) {
      batches.push(batch);
      batch = db.batch();
    }
  }
  if (opCount % 499 !== 0) batches.push(batch);

  for (const b of batches) await b.commit();

  console.log(`[DONE]  ${collectionName.padEnd(12)} — stamped: ${opCount}, already had org_id: ${skipped}`);
  return opCount;
}

async function seedOrganizationsCollection() {
  const orgRef = db.collection('organizations').doc(ORG_ID);
  const existing = await orgRef.get();
  if (existing.exists) {
    console.log(`[SKIP]  organizations — '${ORG_ID}' document already exists.`);
    return;
  }
  await orgRef.set({
    org_id: ORG_ID,
    org_name: 'SRM University',
    logo_url: '/srm-logo-final.webp',
    dept_name: 'Dept. of Electrical Engineering',
    subscription_tier: 'campus',
    pilot_expires_at: null,
    created_at: FieldValue.serverTimestamp(),
  });
  console.log(`[DONE]  organizations  — seeded '${ORG_ID}' document.`);
}

async function main() {
  console.log(`\n🚀  Phase 0 Backfill — stamping org_id: "${ORG_ID}" on all existing documents\n`);

  // Step 1: Seed the organizations collection
  await seedOrganizationsCollection();

  // Step 2: Stamp all user/class/submission/group docs
  let total = 0;
  for (const col of COLLECTIONS) {
    total += await backfillCollection(col);
  }

  console.log(`\n✅  Phase 0 complete. Total documents updated: ${total}`);
  console.log('    You can now safely build multi-tenant features on top of this.\n');
  process.exit(0);
}

main().catch(err => {
  console.error('\n❌  Backfill failed:', err.message);
  process.exit(1);
});
