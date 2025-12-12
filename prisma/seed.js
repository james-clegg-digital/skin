const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);
  const clinician = await prisma.clinician.upsert({
    where: { email: 'clinician@example.com' },
    update: {},
    create: {
      email: 'clinician@example.com',
      name: 'Dr. Demo',
      passwordHash
    }
  });

  const patient = await prisma.patient.create({
    data: {
      name: 'Alex Patient',
      dateOfBirth: new Date('1990-01-01')
    }
  });

  await prisma.submission.create({
    data: {
      patientId: patient.id,
      reference: 'DEMO1234',
      moleLocation: 'Left arm',
      changes: 'Growing over 3 months',
      symptoms: 'Itching',
      notes: 'No bleeding',
      status: 'IN_REVIEW',
      statusHistory: {
        create: [
          { status: 'DRAFT', note: 'Seed data' },
          { status: 'SUBMITTED', note: 'Seed data' },
          { status: 'IN_REVIEW', note: 'Seed data' }
        ]
      }
    }
  });
  console.log('Seeded clinician', clinician.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
