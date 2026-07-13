import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? 'admin@petshop.local').toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? 'Admin123!';
  const firstName = process.env.ADMIN_FIRST_NAME ?? 'System';
  const lastName = process.env.ADMIN_LAST_NAME ?? 'Admin';
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '12', 10);

  const passwordHash = await bcrypt.hash(password, saltRounds);

  await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      firstName,
      lastName,
      role: Role.ADMIN,
      isActive: true,
      deletedAt: null,
    },
    create: {
      email,
      passwordHash,
      firstName,
      lastName,
      role: Role.ADMIN,
      isActive: true,
    },
  });

  console.log(`Admin user ready: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
