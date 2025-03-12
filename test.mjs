import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$queryRaw`SELECT 1;`;
    console.log('Connected successfully!');
  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
