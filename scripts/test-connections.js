const { PrismaClient: AuthPrisma } = require('../services/auth/node_modules/@prisma/client');
const { PrismaClient: AppointmentsPrisma } = require('../services/appointments/node_modules/@prisma/client');
const { PrismaClient: PatientsPrisma } = require('../services/patients/node_modules/@prisma/client');
const { PrismaClient: AnalyticsPrisma } = require('../services/analytics/node_modules/@prisma/client');

async function testConnections() {
  console.log('Testing database connections...\n');

  try {
    // Auth Service
    console.log('=== Auth Service ===');
    const authPrisma = new AuthPrisma();
    await authPrisma.$connect();
    console.log('✓ Connection successful');
    await authPrisma.$disconnect();

    // Appointments Service
    console.log('\n=== Appointments Service ===');
    const appointmentsPrisma = new AppointmentsPrisma();
    await appointmentsPrisma.$connect();
    console.log('✓ Connection successful');
    await appointmentsPrisma.$disconnect();

    // Patients Service
    console.log('\n=== Patients Service ===');
    const patientsPrisma = new PatientsPrisma();
    await patientsPrisma.$connect();
    console.log('✓ Connection successful');
    await patientsPrisma.$disconnect();

    // Analytics Service
    console.log('\n=== Analytics Service ===');
    const analyticsPrisma = new AnalyticsPrisma();
    await analyticsPrisma.$connect();
    console.log('✓ Connection successful');
    await analyticsPrisma.$disconnect();

    console.log('\nAll connections tested successfully!');
  } catch (error) {
    console.error('Error testing connections:', error);
    process.exit(1);
  }
}

testConnections(); 