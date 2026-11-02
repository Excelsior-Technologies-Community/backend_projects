const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, 'database.json');

// Default Seed Data replicating personaltrainer-workdo.myshopify.com
const defaultData = {
  users: [
    {
      id: 'usr-admin-1',
      name: 'Head Coach Marcus',
      email: 'admin@trainer.com',
      passwordHash: bcrypt.hashSync('admin123', 10),
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      phone: '+1 (555) 234-5678',
      membershipPlanId: 'plan-3',
      membershipStatus: 'active',
      status: 'active',
      createdAt: '2026-01-10T10:00:00.000Z'
    },
    {
      id: 'usr-customer-1',
      name: 'Alex Johnson',
      email: 'user@trainer.com',
      passwordHash: bcrypt.hashSync('user123', 10),
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      phone: '+1 (555) 987-6543',
      fitnessGoal: 'Hypertrophy & Strength',
      membershipPlanId: 'plan-2',
      membershipStatus: 'active',
      status: 'active',
      createdAt: '2026-02-15T14:30:00.000Z'
    },
    {
      id: 'usr-customer-2',
      name: 'Sarah Connor',
      email: 'sarah@fitness.com',
      passwordHash: bcrypt.hashSync('sarah123', 10),
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      phone: '+1 (555) 456-7890',
      fitnessGoal: 'Fat Loss & Endurance',
      membershipPlanId: null,
      membershipStatus: 'inactive',
      status: 'active',
      createdAt: '2026-03-01T09:15:00.000Z'
    }
  ],
  categories: [
    {
      id: 'cat-1',
      name: 'Workout Equipment',
      slug: 'workout-equipment',
      description: 'Heavy duty dumbbells, barbells, power racks, and resistance bands.',
      image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
      itemCount: 14,
      featured: true
    },
    {
      id: 'cat-2',
      name: 'Supplements & Nutrition',
      slug: 'supplements-nutrition',
      description: 'Premium whey protein isolates, creatine monohydrate, BCAAs, and multivitamins.',
      image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=800&q=80',
      itemCount: 18,
      featured: true
    },
    {
      id: 'cat-3',
      name: 'Gym Apparel & Gear',
      slug: 'gym-apparel',
      description: 'Sweat-wicking compression tees, lifting straps, power belts, and shoes.',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      itemCount: 22,
      featured: true
    },
    {
      id: 'cat-4',
      name: 'Training Programs',
      slug: 'training-programs',
      description: 'Custom 12-week hypertrophy, fat burner, and powerlifting workout regimes.',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
      itemCount: 8,
      featured: true
    },
    {
      id: 'cat-5',
      name: 'Accessories & Recovery',
      slug: 'accessories-recovery',
      description: 'Foam rollers, massage guns, shakers, and smart fitness trackers.',
      image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80',
      itemCount: 11,
      featured: false
    }
  ],
  products: [
    {
      id: 'prod-1',
      name: 'Pro Hex Cast Iron Dumbbell Set (5kg - 30kg)',
      slug: 'pro-hex-dumbbell-set',
      categoryId: 'cat-1',
      categoryName: 'Workout Equipment',
      price: 249.99,
      comparePrice: 299.99,
      stock: 35,
      sku: 'HEX-DB-SET',
      rating: 4.9,
      reviewsCount: 48,
      badge: 'Bestseller',
      images: [
        'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=900&q=80'
      ],
      description: 'Heavy duty rubber encased hex dumbbells engineered for commercial gym toughness and home workout precision. Ergonomic chrome knurled handles prevent slippage during intense sets.',
      specifications: {
        'Material': 'Solid Cast Iron + Virgin Rubber',
        'Handle': 'Ergonomic Chrome Knurling',
        'Weight Range': '5kg to 30kg pairs',
        'Warranty': '2 Years'
      },
      featured: true,
      createdAt: '2026-02-01T10:00:00.000Z'
    },
    {
      id: 'prod-2',
      name: 'Pure Ultra-Filtered Whey Protein Isolate (2kg)',
      slug: 'ultra-whey-isolate-2kg',
      categoryId: 'cat-2',
      categoryName: 'Supplements & Nutrition',
      price: 64.99,
      comparePrice: 79.99,
      stock: 80,
      sku: 'WHEY-ISO-VAN',
      rating: 4.8,
      reviewsCount: 112,
      badge: 'Top Rated',
      images: [
        'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=900&q=80'
      ],
      description: '27g of pure micro-filtered whey protein isolate per scoop, with 0g added sugar and 6.2g BCAAs for lightning-fast recovery and clean muscle hypertrophy.',
      specifications: {
        'Protein Per Serving': '27 Grams',
        'Flavor': 'Gourmet French Vanilla',
        'Servings': '66 Servings',
        'BCAA': '6.2g naturally occurring'
      },
      featured: true,
      createdAt: '2026-02-05T10:00:00.000Z'
    },
    {
      id: 'prod-3',
      name: 'Olympic Power Barbell (20kg / 7ft / 700lb Cap)',
      slug: 'olympic-power-barbell',
      categoryId: 'cat-1',
      categoryName: 'Workout Equipment',
      price: 189.00,
      comparePrice: 220.00,
      stock: 22,
      sku: 'OLY-BAR-20K',
      rating: 5.0,
      reviewsCount: 39,
      badge: 'Hot',
      images: [
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=900&q=80'
      ],
      description: 'Precision engineered 28mm shaft with dual knurl marks for Olympic lifting and powerlifting. 4 needle bearings per sleeve for buttery smooth spin.',
      specifications: {
        'Bar Weight': '20 kg (44 lbs)',
        'Shaft Diameter': '28 mm',
        'Max Capacity': '700 lbs',
        'Coating': 'Black Zinc Shaft / Hard Chrome Sleeves'
      },
      featured: true,
      createdAt: '2026-02-08T10:00:00.000Z'
    },
    {
      id: 'prod-4',
      name: '12-Week Shred & Athletic Transformation Program',
      slug: '12-week-shred-transformation',
      categoryId: 'cat-4',
      categoryName: 'Training Programs',
      price: 49.99,
      comparePrice: 99.99,
      stock: 999,
      sku: 'PROG-12W-SHRED',
      rating: 4.95,
      reviewsCount: 204,
      badge: 'Digital Plan',
      images: [
        'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80'
      ],
      description: 'The proven personal trainer program that transformed over 3,000+ athletes. Includes structured split routines, custom macro calculator, video exercise library, and weekly check-in protocols.',
      specifications: {
        'Format': 'Digital Video & Interactive PDF App',
        'Duration': '12 Weeks (3 Phased Blocks)',
        'Level': 'Beginner to Advanced',
        'Access': 'Lifetime'
      },
      featured: true,
      createdAt: '2026-02-12T10:00:00.000Z'
    },
    {
      id: 'prod-5',
      name: 'High Performance Seamless Compression Shirt',
      slug: 'seamless-compression-shirt',
      categoryId: 'cat-3',
      categoryName: 'Gym Apparel & Gear',
      price: 34.99,
      comparePrice: 45.00,
      stock: 65,
      sku: 'APP-COMP-TEE',
      rating: 4.7,
      reviewsCount: 56,
      badge: 'Trending',
      images: [
        'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1521804906057-1df8fdb718b7?auto=format&fit=crop&w=900&q=80'
      ],
      description: 'Second-skin athletic fit designed for maximum range of motion, muscle thermoregulation, and ultra quick-drying moisture management.',
      specifications: {
        'Material': '85% Spandex, 15% Elastane',
        'Sizes': 'S, M, L, XL, XXL',
        'Color': 'Carbon Shadow'
      },
      featured: true,
      createdAt: '2026-02-14T10:00:00.000Z'
    },
    {
      id: 'prod-6',
      name: 'Pre-Workout Explosive Energy & Pump Matrix (400g)',
      slug: 'preworkout-explosive-pump',
      categoryId: 'cat-2',
      categoryName: 'Supplements & Nutrition',
      price: 44.50,
      comparePrice: 55.00,
      stock: 45,
      sku: 'SUP-PRE-PUMP',
      rating: 4.85,
      reviewsCount: 88,
      badge: 'Top Energy',
      images: [
        'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=900&q=80'
      ],
      description: 'Loaded with 6g L-Citrulline, 3.2g Beta-Alanine, and 300mg natural caffeine anhydrous for intense laser focus, vascular pumps, and zero crash.',
      specifications: {
        'Serving Size': '1 Scoop (14g)',
        'Caffeine': '300mg',
        'L-Citrulline': '6000mg',
        'Flavors': 'Blue Raspberry Ice'
      },
      featured: false,
      createdAt: '2026-02-18T10:00:00.000Z'
    },
    {
      id: 'prod-7',
      name: 'Heavy Duty 10mm Leather Powerlifting Belt',
      slug: 'leather-powerlifting-belt',
      categoryId: 'cat-3',
      categoryName: 'Gym Apparel & Gear',
      price: 89.99,
      comparePrice: 110.00,
      stock: 28,
      sku: 'GEAR-BELT-10MM',
      rating: 4.9,
      reviewsCount: 72,
      badge: 'Pro Choice',
      images: [
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80'
      ],
      description: 'Handcrafted genuine top-grain leather with industrial stainless steel quick-release lever buckle. Certified for competitive powerlifting meets.',
      specifications: {
        'Thickness': '10 mm',
        'Buckle': 'Zinc-alloy Quick Lever',
        'Width': '4 inches consistent'
      },
      featured: false,
      createdAt: '2026-02-22T10:00:00.000Z'
    },
    {
      id: 'prod-8',
      name: 'Percussive Deep Tissue Massage Gun Pro',
      slug: 'deep-tissue-massage-gun',
      categoryId: 'cat-5',
      categoryName: 'Accessories & Recovery',
      price: 129.99,
      comparePrice: 179.99,
      stock: 19,
      sku: 'REC-MASS-GUN',
      rating: 4.92,
      reviewsCount: 63,
      badge: 'Recovery Tech',
      images: [
        'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=900&q=80'
      ],
      description: 'Ultra-quiet brushless motor delivering 3200 RPM deep muscle penetration. Includes 6 interchangeable heads and 8-hour lithium battery life.',
      specifications: {
        'Speeds': '30 Adjustable Gear Levels',
        'Battery': '2600mAh Rechargeable',
        'Noise': '< 45dB Whisper Quiet'
      },
      featured: true,
      createdAt: '2026-02-25T10:00:00.000Z'
    }
  ],
  membershipPlans: [
    {
      id: 'plan-1',
      name: 'Starter Fitness Pass',
      tagline: 'Ideal for beginners building gym discipline',
      price: 29.99,
      billingCycle: 'monthly',
      popular: false,
      badge: 'Beginner',
      features: [
        'Full Access to Gym Equipment Store Discounts (5%)',
        'Standard 3-Day Split Workout Regimes',
        'Mobile App Workout Tracker & Log',
        'Community Forum & Fitness Group Access',
        'Email Support within 48h'
      ],
      color: '#38bdf8'
    },
    {
      id: 'plan-2',
      name: 'Pro Athlete Membership',
      tagline: 'The complete training & nutrition system',
      price: 69.99,
      billingCycle: 'monthly',
      popular: true,
      badge: 'Most Popular',
      features: [
        '15% Exclusive Discount on All Store Gear & Supplements',
        'Weekly Personalized Macro & Meal Plans',
        'Complete Exercise Video Mastery Library (250+ Exercises)',
        'Bi-weekly Trainer Form Check & Video Feedback',
        'Priority 24/7 Trainer WhatsApp & Chat Support',
        'Exclusive Live Monthly Q&A Masterclasses'
      ],
      color: '#a3e635'
    },
    {
      id: 'plan-3',
      name: 'Elite 1-on-1 VIP Coaching',
      tagline: 'Direct private coaching with Head Coach Marcus',
      price: 199.99,
      billingCycle: 'monthly',
      popular: false,
      badge: 'Exclusive VIP',
      features: [
        '1-on-1 Weekly 45min Video Strategy Call with Marcus',
        'Hyper-personalized Periodized Workout & Diet Architecture',
        'Unlimited Direct 24/7 Messaging & Instant Form Feedback',
        '25% Lifetime Storewide Discount on all products',
        'Quarterly Supplement & Care Package shipped to your door',
        'VIP Access to In-Person Annual Fitness Camps'
      ],
      color: '#f59e0b'
    }
  ],
  orders: [
    {
      id: 'ORD-2026-8941',
      userId: 'usr-customer-1',
      customerName: 'Alex Johnson',
      customerEmail: 'user@trainer.com',
      shippingAddress: {
        address: '742 Evergreen Terrace',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701',
        country: 'United States'
      },
      items: [
        {
          productId: 'prod-1',
          name: 'Pro Hex Cast Iron Dumbbell Set (5kg - 30kg)',
          price: 249.99,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80'
        },
        {
          productId: 'prod-2',
          name: 'Pure Ultra-Filtered Whey Protein Isolate (2kg)',
          price: 64.99,
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=900&q=80'
        }
      ],
      subtotal: 379.97,
      discount: 20.00,
      tax: 28.80,
      total: 388.77,
      paymentMethod: 'Credit Card',
      paymentStatus: 'Paid',
      orderStatus: 'Processing',
      trackingNumber: 'TRK-8823910US',
      createdAt: '2026-03-20T11:45:00.000Z'
    },
    {
      id: 'ORD-2026-7822',
      userId: 'usr-customer-2',
      customerName: 'Sarah Connor',
      customerEmail: 'sarah@fitness.com',
      shippingAddress: {
        address: '10880 Wilshire Blvd',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90024',
        country: 'United States'
      },
      items: [
        {
          productId: 'prod-4',
          name: '12-Week Shred & Athletic Transformation Program',
          price: 49.99,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80'
        }
      ],
      subtotal: 49.99,
      discount: 0.00,
      tax: 4.00,
      total: 53.99,
      paymentMethod: 'PayPal',
      paymentStatus: 'Paid',
      orderStatus: 'Delivered',
      trackingNumber: 'DIGITAL-INSTANT',
      createdAt: '2026-03-18T16:20:00.000Z'
    }
  ],
  messages: [
    {
      id: 'msg-1',
      name: 'Daniel Craig',
      email: 'daniel@gymfan.com',
      subject: 'Inquiry about 1-on-1 VIP Coaching',
      message: 'Hello Marcus, I want to prepare for a marathon while maintaining muscle mass. Is the VIP coaching suited for hybrid training?',
      status: 'unread',
      createdAt: '2026-03-24T08:15:00.000Z'
    }
  ],
  reviews: [
    {
      id: 'rev-1',
      productId: 'prod-1',
      userName: 'David Miller',
      rating: 5,
      comment: 'Top tier quality! Rubber grip is rock solid and does not smell like cheap rubber. Delivered fast.',
      createdAt: '2026-03-12T14:00:00.000Z'
    },
    {
      id: 'rev-2',
      productId: 'prod-2',
      userName: 'Elena Rostova',
      rating: 5,
      comment: 'Dissolves instantly with no clumps! French vanilla flavor with oats is my go-to post-workout meal.',
      createdAt: '2026-03-15T18:30:00.000Z'
    }
  ]
};

// Simple Thread-safe JSON Database Handler
class JSONDatabase {
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
    }
  }

  read() {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (e) {
      return defaultData;
    }
  }

  write(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }

  get(collection) {
    const data = this.read();
    return data[collection] || [];
  }

  insert(collection, item) {
    const data = this.read();
    if (!data[collection]) data[collection] = [];
    data[collection].unshift(item);
    this.write(data);
    return item;
  }

  update(collection, id, updates) {
    const data = this.read();
    if (!data[collection]) return null;
    const idx = data[collection].findIndex(i => i.id === id);
    if (idx === -1) return null;
    data[collection][idx] = { ...data[collection][idx], ...updates, updatedAt: new Date().toISOString() };
    this.write(data);
    return data[collection][idx];
  }

  delete(collection, id) {
    const data = this.read();
    if (!data[collection]) return false;
    const initialLen = data[collection].length;
    data[collection] = data[collection].filter(i => i.id !== id);
    if (data[collection].length !== initialLen) {
      this.write(data);
      return true;
    }
    return false;
  }
}

const db = new JSONDatabase();
module.exports = db;
