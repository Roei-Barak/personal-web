import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const password = 'password123';
  const hashed = await bcrypt.hash(password, 8);

  // Clear existing
  await prisma.userRole.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      email: 'admin@local.test',
      password: hashed,
      roles: {
        create: [{ role: 'admin' }],
      },
    },
  });

  const friend = await prisma.user.create({
    data: {
      email: 'friend@local.test',
      password: hashed,
      roles: {
        create: [{ role: 'approved_friend' }],
      },
    },
  });

  console.log('Seed complete. Admin credentials: admin@local.test /', password);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
