import admin from 'firebase-admin';
import * as fs from 'fs';

// Initialize Firebase Admin (Requires GOOGLE_APPLICATION_CREDENTIALS or serviceAccount.json)
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

async function seedDatabase() {
  console.log('🌱 Starting Society ERP Firestore Seed Script...');

  const societyRef = db.collection('societies').doc('soc_1');
  await societyRef.set({
    id: 'soc_1',
    name: 'Royal Heights Co-Op Housing Society',
    address: 'Plot 42, Sector 18, Palm Beach Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400706',
    totalBlocks: 3,
    totalUnits: 120,
    registrationNumber: 'HSG/MUM/2021/8849',
    billingConfig: {
      maintenancePerSqFt: 3.5,
      fixedMonthlyFee: 500,
      dueDayOfMonth: 10,
      lateFeePercentage: 5,
      gracePeriodDays: 5,
    },
    createdAt: new Date().toISOString(),
  });
  console.log('✅ Created Society Record');

  // Seed Admin User
  await db.collection('users').doc('admin_1').set({
    uid: 'admin_1',
    name: 'Rajesh Sharma',
    email: 'admin@society.com',
    phone: '+91 9876543210',
    role: 'SOCIETY_ADMIN',
    societyId: 'soc_1',
    block: 'A',
    unitNumber: 'A-402',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Seed Resident User
  await db.collection('users').doc('resident_1').set({
    uid: 'resident_1',
    name: 'Priya Patel',
    email: 'resident@society.com',
    phone: '+91 9876543211',
    role: 'RESIDENT',
    societyId: 'soc_1',
    block: 'B',
    unitNumber: 'B-201',
    occupancyType: 'OWNER',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Seed Security User
  await db.collection('users').doc('security_1').set({
    uid: 'security_1',
    name: 'Ramesh Singh',
    email: 'security@society.com',
    phone: '+91 9876543212',
    role: 'SECURITY',
    societyId: 'soc_1',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  console.log('✅ Created Users (Admin, Resident, Security)');

  // Seed Bills
  await db.collection('bills').doc('bill_101').set({
    id: 'bill_101',
    societyId: 'soc_1',
    unitId: 'unit_b201',
    unitNumber: 'B-201',
    block: 'B',
    residentId: 'resident_1',
    residentName: 'Priya Patel',
    month: 'August 2026',
    year: 2026,
    dueDate: '2026-08-10',
    breakdown: [
      { name: 'Maintenance (1000 sq ft @ 3.5)', amount: 3500 },
      { name: 'Sinking Fund', amount: 350 },
    ],
    subtotal: 3850,
    lateFee: 0,
    totalAmount: 3850,
    status: 'UNPAID',
    createdAt: new Date().toISOString(),
  });
  console.log('✅ Seeded Sample Bills');

  console.log('🎉 Firestore Seed Completed Successfully!');
}

seedDatabase().catch(console.error);
