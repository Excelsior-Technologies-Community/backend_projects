const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function initDB() {
  console.log('--- Initializing Real Estate Database & Stored Procedures ---');
  
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASS || 'Jashu@2005';
  const dbName = process.env.DB_NAME || 'realestate_db';

  // 1. Connect without database to ensure DB exists
  let rootConn;
  try {
    rootConn = await mysql.createConnection({ host, user, password });
    await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log(`Database '${dbName}' created or already exists.`);
  } catch (err) {
    console.error('Error creating database:', err.message);
    throw err;
  } finally {
    if (rootConn) await rootConn.end();
  }

  // 2. Connect to the database with multipleStatements enabled
  const conn = await mysql.createConnection({
    host,
    user,
    password,
    database: dbName,
    multipleStatements: true
  });

  try {
    // 3. Read and execute schema and stored procedures
    const sqlPath = path.join(__dirname, 'schema_and_procedures.sql');
    const rawSql = fs.readFileSync(sqlPath, 'utf8');

    // Split raw SQL into statements handling DELIMITER $$
    console.log('Executing tables and stored procedures...');
    const chunks = rawSql.split('DELIMITER ;');
    for (const chunk of chunks) {
      if (chunk.includes('DELIMITER $$')) {
        const [preamble, procBody] = chunk.split('DELIMITER $$');
        if (preamble.trim()) {
          const preStatements = preamble.split(';').map(s => s.trim()).filter(Boolean);
          for (const s of preStatements) {
            await conn.query(s);
          }
        }
        if (procBody && procBody.trim()) {
          const cleanProc = procBody.replace(/\$\$/g, '').trim();
          if (cleanProc) {
            await conn.query(cleanProc);
          }
        }
      } else {
        const statements = chunk.split(';').map(s => s.trim()).filter(Boolean);
        for (const s of statements) {
          await conn.query(s);
        }
      }
    }
    console.log('Tables and stored procedures established successfully.');

    // 4. Seed Data
    console.log('Seeding initial data...');

    // Admin User
    const [existingAdmins] = await conn.query('SELECT id FROM AdminUsers WHERE email = ?', ['admin@realestate.com']);
    if (existingAdmins.length === 0) {
      const hashedAdminPass = await bcrypt.hash('admin123', 10);
      await conn.query(
        'INSERT INTO AdminUsers (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Master Administrator', 'admin@realestate.com', hashedAdminPass, 'admin']
      );
      console.log('Admin user seeded: admin@realestate.com / admin123');
    }

    // Customer Demo User
    const [existingUsers] = await conn.query('SELECT id FROM Users WHERE email = ?', ['user@realestate.com']);
    if (existingUsers.length === 0) {
      const hashedUserPass = await bcrypt.hash('user123', 10);
      await conn.query(
        'INSERT INTO Users (firstName, lastName, email, password, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
        ['Alex', 'Morgan', 'user@realestate.com', hashedUserPass, '+1 (555) 234-5678', 'customer']
      );
      console.log('Customer user seeded: user@realestate.com / user123');
    }

    // Categories
    const categories = [
      { name: 'Villa', slug: 'villa', description: 'Exclusive standalone luxury villas with private gardens and pools.', image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Apartment', slug: 'apartment', description: 'High-end city apartments, penthouses and condominiums.', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Farm Villa', slug: 'farm-villa', description: 'Scenic countryside retreats and expansive equestrian estates.', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Luxury Properties', slug: 'luxury-properties', description: 'Ultra-modern architectural masterpieces in premier locations.', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Royal House', slug: 'royal-house', description: 'Grand historic and modern estate manors crafted for royalty.', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Commercial', slug: 'commercial', description: 'Prime corporate offices, retail spaces and modern business centers.', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80' }
    ];

    for (const c of categories) {
      await conn.query(
        'INSERT INTO Categories (name, slug, description, image) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE description=VALUES(description), image=VALUES(image)',
        [c.name, c.slug, c.description, c.image]
      );
    }

    // Locations
    const locations = [
      { name: 'Beverly Hills', city: 'Los Angeles', state: 'California', country: 'USA', image: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?auto=format&fit=crop&w=800&q=80' },
      { name: 'Manhattan', city: 'New York', state: 'New York', country: 'USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80' },
      { name: 'South Beach', city: 'Miami', state: 'Florida', country: 'USA', image: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&w=800&q=80' },
      { name: 'Downtown Loop', city: 'Chicago', state: 'Illinois', country: 'USA', image: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80' },
      { name: 'Austin Hills', city: 'Austin', state: 'Texas', country: 'USA', image: 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?auto=format&fit=crop&w=800&q=80' },
      { name: 'Pacific Heights', city: 'San Francisco', state: 'California', country: 'USA', image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80' }
    ];

    for (const l of locations) {
      const [existingLoc] = await conn.query('SELECT id FROM Locations WHERE name = ?', [l.name]);
      if (existingLoc.length === 0) {
        await conn.query(
          'INSERT INTO Locations (name, city, state, country, image) VALUES (?, ?, ?, ?, ?)',
          [l.name, l.city, l.state, l.country, l.image]
        );
      }
    }

    // Amenities
    const amenities = [
      { name: 'Swimming Pool', icon: 'waves' },
      { name: '24/7 Security', icon: 'shield-check' },
      { name: 'Gym & Fitness Spa', icon: 'dumbbell' },
      { name: 'Private Garden & Patio', icon: 'trees' },
      { name: 'Smart Home Automation', icon: 'cpu' },
      { name: 'High-Speed Fiber Wi-Fi', icon: 'wifi' },
      { name: 'Multi-Car Garage', icon: 'car' },
      { name: 'Central Air Conditioning', icon: 'wind' },
      { name: 'Ocean / Skyline View', icon: 'eye' }
    ];

    for (const a of amenities) {
      const [existingAmenity] = await conn.query('SELECT id FROM Amenities WHERE name = ?', [a.name]);
      if (existingAmenity.length === 0) {
        await conn.query('INSERT INTO Amenities (name, icon) VALUES (?, ?)', [a.name, a.icon]);
      }
    }

    // Properties matching WorkDo Real Estate reference
    const [existingProps] = await conn.query('SELECT COUNT(*) AS cnt FROM Properties');
    if (existingProps[0].cnt === 0) {
      const sampleProperties = [
        {
          title: 'Darth Vader House A-24',
          slug: 'darth-vader-house-a-24',
          description: 'An iconic modern architectural marvel featuring sleek dark minimalist aesthetics, smart thermal control, expansive glass facades, and panoramic garden views.',
          price: 1850000.00,
          type: 'Villa',
          purpose: 'For Sale',
          status: 'Active',
          bedrooms: 5,
          bathrooms: 6,
          areaSqFt: 5800,
          address: '422 Skyline Ridge, Beverly Hills, CA',
          featured: true,
          categoryName: 'Villa',
          locationName: 'Beverly Hills',
          images: [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
          ]
        },
        {
          title: 'Family Villas C-92',
          slug: 'family-villas-c-92',
          description: 'Spacious multi-generational family villa with open concept living, high-ceiling reception rooms, a chef-grade gourmet kitchen, and private heated outdoor pool.',
          price: 1250000.00,
          type: 'Villa',
          purpose: 'For Sale',
          status: 'Active',
          bedrooms: 4,
          bathrooms: 4,
          areaSqFt: 4200,
          address: '108 Palm Avenue, South Beach, Miami, FL',
          featured: true,
          categoryName: 'Villa',
          locationName: 'South Beach',
          images: [
            'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
          ]
        },
        {
          title: 'Meadow View D-205',
          slug: 'meadow-view-d-205',
          description: 'Serene modern farm estate nestled between rolling green hills. Offers floor-to-ceiling panoramic glass, natural stone accents, and zero-carbon solar architecture.',
          price: 940000.00,
          type: 'Farm Villa',
          purpose: 'For Sale',
          status: 'Active',
          bedrooms: 4,
          bathrooms: 3,
          areaSqFt: 3600,
          address: '77 Meadow Lane, Austin Hills, Austin, TX',
          featured: true,
          categoryName: 'Farm Villa',
          locationName: 'Austin Hills',
          images: [
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
          ]
        },
        {
          title: 'Noble Park B-106',
          slug: 'noble-park-b-106',
          description: 'Ultra-luxurious corner penthouse overlooking the bustling urban skyline. Includes private wrap-around terrace, concierge service, and high-speed private elevator.',
          price: 2400000.00,
          type: 'Apartment',
          purpose: 'For Sale',
          status: 'Active',
          bedrooms: 3,
          bathrooms: 3,
          areaSqFt: 2950,
          address: '88 Madison Avenue, Manhattan, NY',
          featured: true,
          categoryName: 'Apartment',
          locationName: 'Manhattan',
          images: [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
          ]
        },
        {
          title: 'The White House J-54',
          slug: 'the-white-house-j-54',
          description: 'Commanding classical neo-Georgian estate offering timeless white columns, crystal chandeliers, marble floors, tennis court, and manicured hedge gardens.',
          price: 3600000.00,
          type: 'Royal House',
          purpose: 'For Sale',
          status: 'Active',
          bedrooms: 6,
          bathrooms: 7,
          areaSqFt: 7200,
          address: '1500 Colonial Way, Pacific Heights, San Francisco, CA',
          featured: true,
          categoryName: 'Royal House',
          locationName: 'Pacific Heights',
          images: [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80'
          ]
        },
        {
          title: 'Horizon Waterfront Penthouse',
          slug: 'horizon-waterfront-penthouse',
          description: 'Contemporary waterfront loft for rent with mesmerizing sunset views over Biscayne Bay, designer Italian furnishings, and yacht berth privileges.',
          price: 8500.00,
          type: 'Apartment',
          purpose: 'For Rent',
          status: 'Active',
          bedrooms: 2,
          bathrooms: 2,
          areaSqFt: 1800,
          address: '300 Ocean Drive, South Beach, Miami, FL',
          featured: false,
          categoryName: 'Apartment',
          locationName: 'South Beach',
          images: [
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80'
          ]
        },
        {
          title: 'Emerald Crest Modern Villa',
          slug: 'emerald-crest-modern-villa',
          description: 'Dramatic architectural cantilever residence offering seamless indoor-outdoor living, negative-edge infinity pool, and integrated Sonos sound throughout.',
          price: 2150000.00,
          type: 'Luxury Properties',
          purpose: 'For Sale',
          status: 'Active',
          bedrooms: 5,
          bathrooms: 5,
          areaSqFt: 5100,
          address: '612 Emerald Crest, Beverly Hills, CA',
          featured: true,
          categoryName: 'Luxury Properties',
          locationName: 'Beverly Hills',
          images: [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
          ]
        },
        {
          title: 'Millennium Tower Loft',
          slug: 'millennium-tower-loft',
          description: 'Urban luxury high-rise condominium in the heart of Chicago Loop. Walking distance to Millennium Park, upscale dining, and world-class theaters.',
          price: 4200.00,
          type: 'Apartment',
          purpose: 'For Rent',
          status: 'Active',
          bedrooms: 2,
          bathrooms: 2,
          areaSqFt: 1450,
          address: '200 N Michigan Ave, Downtown Loop, Chicago, IL',
          featured: false,
          categoryName: 'Apartment',
          locationName: 'Downtown Loop',
          images: [
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
          ]
        }
      ];

      for (const p of sampleProperties) {
        const [catRow] = await conn.query('SELECT id FROM Categories WHERE name = ?', [p.categoryName]);
        const [locRow] = await conn.query('SELECT id FROM Locations WHERE name = ?', [p.locationName]);
        const categoryId = catRow.length > 0 ? catRow[0].id : null;
        const locationId = locRow.length > 0 ? locRow[0].id : null;

        const [insertResult] = await conn.query(
          `INSERT INTO Properties (
            title, slug, description, price, type, purpose, status,
            bedrooms, bathrooms, areaSqFt, address, featured,
            CategoryId, LocationId, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            p.title, p.slug, p.description, p.price, p.type, p.purpose, p.status,
            p.bedrooms, p.bathrooms, p.areaSqFt, p.address, p.featured ? 1 : 0,
            categoryId, locationId
          ]
        );

        const propId = insertResult.insertId;

        // Add Images
        for (let i = 0; i < p.images.length; i++) {
          await conn.query(
            'INSERT INTO PropertyImages (PropertyId, url, isPrimary, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())',
            [propId, p.images[i], i === 0 ? 1 : 0]
          );
        }

        // Link Amenities (first 4 amenities)
        const [allAmenities] = await conn.query('SELECT id FROM Amenities LIMIT 4');
        for (const am of allAmenities) {
          await conn.query(
            'INSERT IGNORE INTO PropertyAmenities (PropertyId, AmenityId, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
            [propId, am.id]
          );
        }
      }
      console.log('Sample properties seeded successfully.');
    }

    // Seed Testimonials
    const [existingTestimonials] = await conn.query('SELECT COUNT(*) AS cnt FROM Testimonials');
    if (existingTestimonials[0].cnt === 0) {
      const testimonials = [
        {
          name: 'Sarah Jenkins',
          role: 'Luxury Property Investor',
          company: 'Acme Capital',
          text: 'The WorkDo Real Estate platform made finding our dream villa in Beverly Hills completely seamless. Their digital tour and transparent details saved us weeks of searching.',
          rating: 5,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
        },
        {
          name: 'David & Emily Vance',
          role: 'Homeowners',
          company: 'Noble Park Residents',
          text: 'We bought the Noble Park penthouse and the process was nothing short of perfection. Customer support guided every single milestone with professionalism.',
          rating: 5,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
        },
        {
          name: 'Marcus Sterling',
          role: 'Managing Director',
          company: 'Sterling Developments',
          text: 'As an agency selling high-end architecture, this platform offers the highest visual fidelity and fastest lead turnaround we have ever encountered.',
          rating: 5,
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
        }
      ];

      for (const t of testimonials) {
        await conn.query(
          'INSERT INTO Testimonials (name, role, company, text, rating, avatar) VALUES (?, ?, ?, ?, ?, ?)',
          [t.name, t.role, t.company, t.text, t.rating, t.avatar]
        );
      }
      console.log('Testimonials seeded.');
    }

    // Seed CMS Pages
    const cmsPages = [
      {
        page: 'about',
        title: 'About Realestate WorkDo',
        content: `Welcome to Realestate WorkDo, premier destination for high-end properties, luxury villas, architectural estates, and prime residential developments. Founded with a vision to redefine how buyers and sellers connect in the real estate world, we blend state-of-the-art digital technology with bespoke concierge guidance.`,
        metaTitle: 'About Us | Realestate WorkDo Luxury Properties',
        metaDescription: 'Discover our journey, our curated property portfolio, and our commitment to bringing architectural excellence to homeowners worldwide.'
      },
      {
        page: 'contact',
        title: 'Contact Our Advisory Team',
        content: `Have questions about one of our featured estates or planning to list your luxury property? Our team of certified real estate advisors and brokers are available 24/7 to assist you.`,
        metaTitle: 'Contact Us | Realestate WorkDo',
        metaDescription: 'Get in touch with our luxury real estate specialists for private tours and consultations.'
      },
      {
        page: 'faq',
        title: 'Frequently Asked Questions',
        content: `Find answers to common questions regarding property viewings, escrow processes, mortgage calculators, property management, and international buyer regulations.`,
        metaTitle: 'FAQs | Realestate WorkDo Knowledge Center',
        metaDescription: 'Explore frequently asked questions about purchasing, leasing, and listing properties on Realestate WorkDo.'
      },
      {
        page: 'terms',
        title: 'Terms & Conditions',
        content: `By accessing and browsing Realestate WorkDo, you agree to comply with our platform policies, property listing verification standards, and copyright agreements.`,
        metaTitle: 'Terms & Conditions | Realestate WorkDo',
        metaDescription: 'Review the terms and conditions governing the use of Realestate WorkDo.'
      },
      {
        page: 'privacy',
        title: 'Privacy Policy',
        content: `Your privacy is paramount. We safeguard your personal contact details, property inquiries, and saved preferences with bank-grade encryption and will never sell your information to third-party data brokers.`,
        metaTitle: 'Privacy Policy | Realestate WorkDo',
        metaDescription: 'Learn how Realestate WorkDo protects your privacy and personal data.'
      }
    ];

    for (const cp of cmsPages) {
      await conn.query(
        'INSERT INTO CMS (page, title, content, metaTitle, metaDescription) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE title=VALUES(title), content=VALUES(content)',
        [cp.page, cp.title, cp.content, cp.metaTitle, cp.metaDescription]
      );
    }
    console.log('CMS pages seeded.');

    // Seed Settings
    const defaultSettings = [
      { key: 'site_title', value: 'Realestate WorkDo' },
      { key: 'site_logo', value: '/logo.png' },
      { key: 'contact_email', value: 'support@realestate-workdo.com' },
      { key: 'contact_phone', value: '+1 (800) 456-7890' },
      { key: 'contact_address', value: '750 5th Avenue, Suite 1200, New York, NY 10019' },
      { key: 'currency', value: 'USD' },
      { key: 'currency_symbol', value: '$' },
      { key: 'facebook_url', value: 'https://facebook.com/realestateworkdo' },
      { key: 'instagram_url', value: 'https://instagram.com/realestateworkdo' },
      { key: 'twitter_url', value: 'https://twitter.com/realestateworkdo' }
    ];

    for (const s of defaultSettings) {
      await conn.query(
        'INSERT INTO Settings (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value=VALUES(value)',
        [s.key, s.value]
      );
    }
    console.log('Settings seeded.');

    // Seed Inquiries
    const [existingInquiries] = await conn.query('SELECT COUNT(*) AS cnt FROM Inquiries');
    if (existingInquiries[0].cnt === 0) {
      const [firstProp] = await conn.query('SELECT id FROM Properties LIMIT 1');
      const propId = firstProp.length > 0 ? firstProp[0].id : null;
      await conn.query(
        `INSERT INTO Inquiries (PropertyId, name, email, phone, message, status, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, 'New', NOW(), NOW())`,
        [
          propId,
          'Jonathan Archer',
          'jarcher@example.com',
          '+1 (310) 902-1244',
          'I am interested in scheduling a private private viewing of this estate this coming Saturday afternoon. Please reach out.'
        ]
      );
      console.log('Sample inquiry seeded.');
    }

    console.log('--- Database and Stored Procedures Initialization Complete! ---');
  } catch (err) {
    console.error('Initialization error:', err);
    throw err;
  } finally {
    await conn.end();
  }
}

if (require.main === module) {
  initDB().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = initDB;
