import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function main() {
  console.log('🌱 Starting database seeding...');

  // Hash passwords
  const adminIndiaPassword = await hashPassword('admin123');
  const adminAmericaPassword = await hashPassword('admin123');
  const managerIndiaPassword = await hashPassword('manager123');
  const managerAmericaPassword = await hashPassword('manager123');
  const memberPassword = await hashPassword('member123');

  // Create Users (country is now an enum field, not a relation)
  console.log('👥 Creating users...');

  // India Users
  const adminIndia = await prisma.user.upsert({
    where: { email: 'admin.india@foodapp.com' },
    update: {},
    create: {
      email: 'admin.india@foodapp.com',
      password: adminIndiaPassword,
      firstName: 'Raj',
      lastName: 'Kumar',
      role: 'ADMIN',
      country: 'INDIA',
    },
  });

  const managerIndia = await prisma.user.upsert({
    where: { email: 'manager.india@foodapp.com' },
    update: {},
    create: {
      email: 'manager.india@foodapp.com',
      password: managerIndiaPassword,
      firstName: 'Priya',
      lastName: 'Sharma',
      role: 'MANAGER',
      country: 'INDIA',
    },
  });

  const memberIndia1 = await prisma.user.upsert({
    where: { email: 'member1.india@foodapp.com' },
    update: {},
    create: {
      email: 'member1.india@foodapp.com',
      password: memberPassword,
      firstName: 'Amit',
      lastName: 'Patel',
      role: 'MEMBER',
      country: 'INDIA',
    },
  });

  const memberIndia2 = await prisma.user.upsert({
    where: { email: 'member2.india@foodapp.com' },
    update: {},
    create: {
      email: 'member2.india@foodapp.com',
      password: memberPassword,
      firstName: 'Sneha',
      lastName: 'Reddy',
      role: 'MEMBER',
      country: 'INDIA',
    },
  });

  // America Users
  const adminAmerica = await prisma.user.upsert({
    where: { email: 'admin.america@foodapp.com' },
    update: {},
    create: {
      email: 'admin.america@foodapp.com',
      password: adminAmericaPassword,
      firstName: 'John',
      lastName: 'Smith',
      role: 'ADMIN',
      country: 'AMERICA',
    },
  });

  const managerAmerica = await prisma.user.upsert({
    where: { email: 'manager.america@foodapp.com' },
    update: {},
    create: {
      email: 'manager.america@foodapp.com',
      password: managerAmericaPassword,
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'MANAGER',
      country: 'AMERICA',
    },
  });

  const memberAmerica1 = await prisma.user.upsert({
    where: { email: 'member1.america@foodapp.com' },
    update: {},
    create: {
      email: 'member1.america@foodapp.com',
      password: memberPassword,
      firstName: 'Mike',
      lastName: 'Davis',
      role: 'MEMBER',
      country: 'AMERICA',
    },
  });

  const memberAmerica2 = await prisma.user.upsert({
    where: { email: 'member2.america@foodapp.com' },
    update: {},
    create: {
      email: 'member2.america@foodapp.com',
      password: memberPassword,
      firstName: 'Emily',
      lastName: 'Brown',
      role: 'MEMBER',
      country: 'AMERICA',
    },
  });

  // Create Restaurants
  console.log('🍽️ Creating restaurants...');

  // India Restaurants
  const restaurantIndia1 = await prisma.restaurant.create({
    data: {
      name: 'Spice Garden',
      description: 'Authentic Indian cuisine with traditional flavors',
      address: '123 MG Road, Connaught Place',
      city: 'New Delhi',
      rating: 4.5,
      country: 'INDIA',
    },
  });

  const restaurantIndia2 = await prisma.restaurant.create({
    data: {
      name: 'Mumbai Delights',
      description: 'Street food and coastal specialties',
      address: '45 Marine Drive, Nariman Point',
      city: 'Mumbai',
      rating: 4.3,
      country: 'INDIA',
    },
  });

  // America Restaurants
  const restaurantAmerica1 = await prisma.restaurant.create({
    data: {
      name: 'Burger Palace',
      description: 'Gourmet burgers and shakes',
      address: '456 Times Square',
      city: 'New York',
      rating: 4.6,
      country: 'AMERICA',
    },
  });

  const restaurantAmerica2 = await prisma.restaurant.create({
    data: {
      name: 'Golden Gate Grill',
      description: 'Pacific coast seafood and California cuisine',
      address: '789 Fisherman\'s Wharf',
      city: 'San Francisco',
      rating: 4.4,
      country: 'AMERICA',
    },
  });

  // Create Menu Items
  console.log('📋 Creating menu items...');

  // India - Spice Garden Menu
  await prisma.menuItem.createMany({
    data: [
      // Spice Garden
      {
        name: 'Butter Chicken',
        description: 'Creamy tomato-based curry with tender chicken pieces',
        price: 350,
        category: 'Main Course',
        isVegetarian: false,
        restaurantId: restaurantIndia1.id,
      },
      {
        name: 'Paneer Tikka Masala',
        description: 'Grilled cottage cheese in rich spicy gravy',
        price: 280,
        category: 'Main Course',
        isVegetarian: true,
        restaurantId: restaurantIndia1.id,
      },
      {
        name: 'Garlic Naan',
        description: 'Fresh baked flatbread with garlic butter',
        price: 60,
        category: 'Bread',
        isVegetarian: true,
        restaurantId: restaurantIndia1.id,
      },
      {
        name: 'Biryani',
        description: 'Aromatic basmati rice with spiced meat',
        price: 320,
        category: 'Rice',
        isVegetarian: false,
        restaurantId: restaurantIndia1.id,
      },
      {
        name: 'Gulab Jamun',
        description: 'Sweet milk dumplings in sugar syrup',
        price: 80,
        category: 'Dessert',
        isVegetarian: true,
        restaurantId: restaurantIndia1.id,
      },
      // Mumbai Delights
      {
        name: 'Vada Pav',
        description: 'Mumbai\'s famous potato fritter burger',
        price: 50,
        category: 'Street Food',
        isVegetarian: true,
        restaurantId: restaurantIndia2.id,
      },
      {
        name: 'Pav Bhaji',
        description: 'Spiced vegetable mash with buttered bread',
        price: 120,
        category: 'Street Food',
        isVegetarian: true,
        restaurantId: restaurantIndia2.id,
      },
      {
        name: 'Fish Curry',
        description: 'Coastal style fish in coconut curry',
        price: 380,
        category: 'Main Course',
        isVegetarian: false,
        restaurantId: restaurantIndia2.id,
      },
    ],
  });

  // America - Burger Palace Menu
  await prisma.menuItem.createMany({
    data: [
      // Burger Palace
      {
        name: 'Classic Cheeseburger',
        description: 'Angus beef with cheddar, lettuce, tomato',
        price: 12.99,
        category: 'Burgers',
        isVegetarian: false,
        restaurantId: restaurantAmerica1.id,
      },
      {
        name: 'BBQ Bacon Burger',
        description: 'Smoky BBQ sauce, crispy bacon, onion rings',
        price: 15.99,
        category: 'Burgers',
        isVegetarian: false,
        restaurantId: restaurantAmerica1.id,
      },
      {
        name: 'Veggie Burger',
        description: 'Plant-based patty with fresh veggies',
        price: 11.99,
        category: 'Burgers',
        isVegetarian: true,
        restaurantId: restaurantAmerica1.id,
      },
      {
        name: 'Loaded Fries',
        description: 'Crispy fries with cheese, bacon, and jalapeños',
        price: 8.99,
        category: 'Sides',
        isVegetarian: false,
        restaurantId: restaurantAmerica1.id,
      },
      {
        name: 'Chocolate Milkshake',
        description: 'Thick and creamy chocolate shake',
        price: 6.99,
        category: 'Beverages',
        isVegetarian: true,
        restaurantId: restaurantAmerica1.id,
      },
      // Golden Gate Grill
      {
        name: 'Grilled Salmon',
        description: 'Fresh Pacific salmon with lemon butter',
        price: 24.99,
        category: 'Seafood',
        isVegetarian: false,
        restaurantId: restaurantAmerica2.id,
      },
      {
        name: 'Fish Tacos',
        description: 'Baja-style fish tacos with chipotle aioli',
        price: 14.99,
        category: 'Seafood',
        isVegetarian: false,
        restaurantId: restaurantAmerica2.id,
      },
      {
        name: 'Caesar Salad',
        description: 'Classic Caesar with grilled chicken',
        price: 13.99,
        category: 'Salads',
        isVegetarian: false,
        restaurantId: restaurantAmerica2.id,
      },
    ],
  });

  // Create Payment Methods
  console.log('💳 Creating payment methods...');

  await prisma.paymentMethod.createMany({
    data: [
      // India Payment Methods
      {
        name: 'UPI',
        type: 'UPI',
        isActive: true,
        country: 'INDIA',
        config: JSON.stringify({ provider: 'Razorpay' }),
      },
      {
        name: 'Credit Card',
        type: 'CREDIT_CARD',
        isActive: true,
        country: 'INDIA',
        config: JSON.stringify({ provider: 'Razorpay' }),
      },
      {
        name: 'Cash on Delivery',
        type: 'CASH',
        isActive: true,
        country: 'INDIA',
      },
      // America Payment Methods
      {
        name: 'Credit Card',
        type: 'CREDIT_CARD',
        isActive: true,
        country: 'AMERICA',
        config: JSON.stringify({ provider: 'Stripe' }),
      },
      {
        name: 'Debit Card',
        type: 'DEBIT_CARD',
        isActive: true,
        country: 'AMERICA',
        config: JSON.stringify({ provider: 'Stripe' }),
      },
      {
        name: 'Cash on Delivery',
        type: 'CASH',
        isActive: true,
        country: 'AMERICA',
      },
    ],
  });

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log('   - 2 Countries (India, America)');
  console.log('   - 8 Users (2 Admins, 2 Managers, 4 Members)');
  console.log('   - 4 Restaurants (2 per country)');
  console.log('   - 16 Menu Items');
  console.log('   - 6 Payment Methods');
  console.log('\n🔐 Test Credentials:');
  console.log('   India Admin: admin.india@foodapp.com / admin123');
  console.log('   India Manager: manager.india@foodapp.com / manager123');
  console.log('   India Member: member1.india@foodapp.com / member123');
  console.log('   America Admin: admin.america@foodapp.com / admin123');
  console.log('   America Manager: manager.america@foodapp.com / manager123');
  console.log('   America Member: member1.america@foodapp.com / member123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
