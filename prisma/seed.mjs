import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function mustEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

async function createUser(supabaseAdmin, { email, password, user_metadata }) {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata,
  });

  if (error) throw error;
  return data.user;
}

function generateAdminId(firstName, lastName) {
  return (
    (firstName?.[0] ?? 'A') +
    (lastName?.[0] ?? 'A')
  ).toUpperCase() + '-' + Date.now();
}

async function main() {
  const supabaseUrl = mustEnv('SUPABASE_URL');
  const serviceRoleKey = mustEnv('SUPABASE_SERVICE_ROLE_KEY');

  const adminEmail = mustEnv('SEED_ADMIN_EMAIL');
  const adminPassword = mustEnv('SEED_ADMIN_PASSWORD');
  const freelancerEmail = mustEnv('SEED_FREELANCER_EMAIL');
  const freelancerPassword = mustEnv('SEED_FREELANCER_PASSWORD');

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  // ✅ Clean DB tables first
  console.log('🧹 Cleaning existing data...');
  await prisma.education.deleteMany({});
  await prisma.profile.deleteMany({});

  // ✅ Clean Supabase auth users
  console.log('🗑️  Cleaning auth users...');
  const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  if (listError) throw listError;

  for (const user of users) {
    await supabaseAdmin.auth.admin.deleteUser(user.id);
    console.log(`   Deleted: ${user.email}`);
  }

  // ✅ Create auth users
  // Note: Supabase trigger will auto-insert a minimal row into profiles (id + email only)
  // We then upsert below to fill in the rest of the fields
  console.log('👤 Creating auth users...');
  const adminUser = await createUser(supabaseAdmin, {
    email: adminEmail,
    password: adminPassword,
    user_metadata: { fullName: 'Super Admin' },
  });
  console.log(`   Admin created: ${adminUser.id}`);

  const freelancerUser = await createUser(supabaseAdmin, {
    email: freelancerEmail,
    password: freelancerPassword,
    user_metadata: { fullName: 'Seeded Freelancer' },
  });
  console.log(`   Freelancer created: ${freelancerUser.id}`);

  // ✅ ADMIN PROFILE — upsert so it works whether trigger inserted a row or not
  console.log('📝 Upserting admin profile...');
  await prisma.profile.upsert({
    where: { id: adminUser.id },
    create: {
      id: adminUser.id,
      firstName: 'Super',
      lastName: 'ADMIN',
      fullName: 'Super Admin',
      email: adminEmail,
      role: 'ADMIN',
      isSuperadmin: true,
      verificationStatus: 'APPROVED',
      adminId: generateAdminId('Super', 'ADMIN'),
      region: 'BAYERN',
    },
    update: {
      firstName: 'Super',
      lastName: 'ADMIN',
      fullName: 'Super Admin',
      email: adminEmail,
      role: 'ADMIN',
      isSuperadmin: true,
      verificationStatus: 'APPROVED',
      adminId: generateAdminId('Super', 'ADMIN'),
      region: 'BAYERN',
    },
  });

  // ✅ FREELANCER PROFILE
  console.log('📝 Upserting freelancer profile...');
  await prisma.profile.upsert({
    where: { id: freelancerUser.id },
    create: {
      id: freelancerUser.id,
      firstName: 'Seeded',
      lastName: 'FREELANCER',
      fullName: 'Seeded Freelancer',
      email: freelancerEmail,
      role: 'FREELANCER',
      isSuperadmin: false,
      verificationStatus: 'APPROVED',
    },
    update: {
      firstName: 'Seeded',
      lastName: 'FREELANCER',
      fullName: 'Seeded Freelancer',
      email: freelancerEmail,
      role: 'FREELANCER',
      isSuperadmin: false,
      verificationStatus: 'APPROVED',
    },
  });

  console.log('\n✅ Seed complete.');
  console.log(`   Admin:      ${adminEmail}`);
  console.log(`   Freelancer: ${freelancerEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
