require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const Plan = require('../models/Plan');
const Record = require('../models/Record');

const defaultPermissions = [
  { name: 'users.view', description: 'View user list and user profiles', module: 'Users' },
  { name: 'users.create', description: 'Create new users and team members', module: 'Users' },
  { name: 'users.update', description: 'Update user profiles, status, or role', module: 'Users' },
  { name: 'users.delete', description: 'Deactivate or delete users', module: 'Users' },
  { name: 'roles.manage', description: 'Create, update, and manage roles', module: 'Roles & Permissions' },
  { name: 'permissions.manage', description: 'Create and configure permissions', module: 'Roles & Permissions' },
  { name: 'plans.manage', description: 'Create, update, and configure subscription plans', module: 'Subscriptions' },
  { name: 'transactions.view', description: 'View payment transactions and reports', module: 'Billing' },
  { name: 'reports.view', description: 'View analytics and activity reports', module: 'Reports' },
  { name: 'records.manage', description: 'View and manage assigned client records', module: 'Records' },
];

const defaultPlans = [
  {
    name: 'Basic',
    description: 'Perfect for starters and individual developers exploring essential tools.',
    price: 199,
    durationInDays: 30,
    features: [
      'Access to core dashboard features',
      'Standard customer support',
      '1 Workspace connection',
      'Basic analytics reporting',
    ],
    isActive: true,
  },
  {
    name: 'Pro',
    description: 'Best for growing teams and professionals who require elevated capabilities.',
    price: 499,
    durationInDays: 30,
    features: [
      'All Basic features included',
      'Priority 24/7 email & chat support',
      'Up to 5 Workspace connections',
      'Advanced reporting and exports',
      'Audit log inspection',
    ],
    isActive: true,
  },
  {
    name: 'Premium',
    description: 'Enterprise-grade speed, dedicated manager assistance, and unlimited capacity.',
    price: 999,
    durationInDays: 30,
    features: [
      'Everything in Pro plan',
      'Dedicated manager assigned',
      'Unlimited workspace connections',
      'Real-time webhook notifications',
      'Custom invoice branding and PDF downloads',
      '99.9% Uptime SLA',
    ],
    isActive: true,
  },
];

const seed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rbac_subscription_db';
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.');

    // 1. Seed Permissions
    console.log('Seeding Permissions...');
    for (const perm of defaultPermissions) {
      await Permission.findOneAndUpdate(
        { name: perm.name },
        perm,
        { upsert: true, new: true }
      );
    }
    console.log(`Synced ${defaultPermissions.length} permissions.`);

    // 2. Seed Roles
    console.log('Seeding Roles...');
    const allPermNames = defaultPermissions.map((p) => p.name);

    // Admin Role
    const adminRole = await Role.findOneAndUpdate(
      { name: 'Admin' },
      {
        name: 'Admin',
        description: 'Super administrator with unrestricted system-wide access and management controls.',
        permissions: allPermNames,
        isSystem: true,
      },
      { upsert: true, new: true }
    );

    // Manager Role
    const managerRole = await Role.findOneAndUpdate(
      { name: 'Manager' },
      {
        name: 'Manager',
        description: 'Operations manager managing assigned client accounts, records, and reports.',
        permissions: ['records.manage', 'reports.view', 'users.view'],
        isSystem: true,
      },
      { upsert: true, new: true }
    );

    // Customer Role
    const customerRole = await Role.findOneAndUpdate(
      { name: 'Customer' },
      {
        name: 'Customer',
        description: 'Registered customer with self-service subscription and payment history access.',
        permissions: [],
        isSystem: true,
      },
      { upsert: true, new: true }
    );

    console.log('Synced Roles: Admin, Manager, Customer.');

    // 3. Seed Users
    console.log('Seeding Initial Users...');

    // First Admin Account
    let adminUser = await User.findOne({ email: 'admin@rbac.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'System Administrator',
        email: 'admin@rbac.com',
        password: 'Admin@12345',
        role: adminRole._id,
        isActive: true,
      });
      console.log('Created Admin user: admin@rbac.com / Admin@12345');
    } else {
      adminUser.role = adminRole._id;
      adminUser.isActive = true;
      await adminUser.save();
      console.log('Verified existing Admin account: admin@rbac.com');
    }

    // Manager Account
    let managerUser = await User.findOne({ email: 'manager@rbac.com' });
    if (!managerUser) {
      managerUser = await User.create({
        name: 'Operations Manager',
        email: 'manager@rbac.com',
        password: 'Manager@12345',
        role: managerRole._id,
        isActive: true,
      });
      console.log('Created Manager user: manager@rbac.com / Manager@12345');
    } else {
      managerUser.role = managerRole._id;
      managerUser.isActive = true;
      await managerUser.save();
      console.log('Verified existing Manager account: manager@rbac.com');
    }

    // Customer Account
    let customerUser = await User.findOne({ email: 'customer@rbac.com' });
    if (!customerUser) {
      customerUser = await User.create({
        name: 'Alex Rivera',
        email: 'customer@rbac.com',
        password: 'Customer@12345',
        role: customerRole._id,
        assignedManager: managerUser._id,
        isActive: true,
      });
      console.log('Created Customer user: customer@rbac.com / Customer@12345');
    } else {
      customerUser.role = customerRole._id;
      customerUser.assignedManager = managerUser._id;
      await customerUser.save();
      console.log('Verified existing Customer account: customer@rbac.com');
    }

    // 4. Seed Plans
    console.log('Seeding Sample Subscription Plans...');
    for (const planData of defaultPlans) {
      await Plan.findOneAndUpdate(
        { name: planData.name },
        planData,
        { upsert: true, new: true }
      );
    }
    console.log(`Synced ${defaultPlans.length} sample subscription plans.`);

    // 5. Seed Sample Records for Manager
    const recordCount = await Record.countDocuments();
    if (recordCount === 0) {
      console.log('Seeding sample assigned records for Manager...');
      await Record.create([
        {
          title: 'Enterprise Plan Custom Invoice Request',
          description: 'Client requesting GST invoice and bank payment terms for 25 annual seats.',
          clientName: 'Alex Rivera',
          clientEmail: 'customer@rbac.com',
          category: 'Enterprise Plan Inquiry',
          status: 'In Progress',
          priority: 'High',
          assignedManager: managerUser._id,
          notes: [
            {
              note: 'Contacted customer via email to schedule discovery call.',
              authorName: 'Operations Manager',
            },
          ],
        },
        {
          title: 'Workspace Onboarding Assistance',
          description: 'Help needed setting up multi-team authorization policies and webhook alerts.',
          clientName: 'Sarah Jenkins',
          clientEmail: 'sarah.j@acme.org',
          category: 'Onboarding',
          status: 'Open',
          priority: 'Medium',
          assignedManager: managerUser._id,
        },
        {
          title: 'Payment Reconciliation & Receipt Query',
          description: 'Verification of transaction order receipt INV-892110 for audit reporting.',
          clientName: 'Marcus Vance',
          clientEmail: 'm.vance@techcorp.io',
          category: 'Billing',
          status: 'Resolved',
          priority: 'Low',
          assignedManager: managerUser._id,
          notes: [
            {
              note: 'Receipt PDF generated and emailed to client accounting team.',
              authorName: 'Operations Manager',
            },
          ],
        },
      ]);
      console.log('Sample manager records created.');
    }

    console.log('\n==========================================');
    console.log('Seed completed successfully!');
    console.log('==========================================');
    console.log('Login credentials:');
    console.log('  Admin:    admin@rbac.com    / Admin@12345');
    console.log('  Manager:  manager@rbac.com  / Manager@12345');
    console.log('  Customer: customer@rbac.com / Customer@12345');
    console.log('==========================================\n');

    process.exit(0);
  } catch (err) {
    console.error('Seed script error:', err);
    process.exit(1);
  }
};

seed();
