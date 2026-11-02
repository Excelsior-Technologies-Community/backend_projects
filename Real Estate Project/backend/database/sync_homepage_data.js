const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function syncHomepageData() {
  console.log('--- Syncing Header Categories and Homepage Properties with MySQL ---');
  
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'Jashu@2005',
    database: process.env.DB_NAME || 'realestate_db'
  });

  try {
    // 1. Sync Categories matching Shop dropdown and Main Page
    const categories = [
      {
        name: 'Bestseller',
        slug: 'bestseller',
        description: 'Top-selling luxury properties and fast-closing real estate opportunities.',
        image: 'http://localhost:5000/uploads/shop_img1.png'
      },
      {
        name: 'Farm Vila',
        slug: 'farm-vila',
        description: 'Scenic countryside retreats, sprawling equestrian estates, and farm villas.',
        image: 'http://localhost:5000/uploads/shop_img2.png'
      },
      {
        name: 'Luxury Properties',
        slug: 'luxury-properties',
        description: 'Ultra-modern architectural masterpieces situated in premier enclaves.',
        image: 'http://localhost:5000/uploads/shop_img3.png'
      },
      {
        name: 'Royal House',
        slug: 'royal-house',
        description: 'Grand historic and modern estate manors crafted with timeless elegance.',
        image: 'http://localhost:5000/uploads/shop_img4.png'
      },
      {
        name: 'Villa',
        slug: 'villa',
        description: 'Standalone multi-story modern luxury villas with private gardens and pools.',
        image: 'http://localhost:5000/uploads/hero_house2.png'
      },
      {
        name: 'Home',
        slug: 'home',
        description: 'Family residential houses and custom suburban architecture.',
        image: 'http://localhost:5000/uploads/banner-card1_08a7e141-2c15-4e05-98e7-18d0888fdf94.png'
      },
      {
        name: 'Apartment',
        slug: 'apartment',
        description: 'City lofts, high-rise condominiums, and skyline penthouses.',
        image: 'http://localhost:5000/uploads/banner-card2_c436bfab-fa3a-42a9-bd00-425e6978c299.png'
      }
    ];

    for (const cat of categories) {
      const [existing] = await conn.query('SELECT id FROM Categories WHERE name = ? OR slug = ?', [cat.name, cat.slug]);
      if (existing.length === 0) {
        await conn.query(
          'INSERT INTO Categories (name, slug, description, image, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
          [cat.name, cat.slug, cat.description, cat.image]
        );
        console.log(`Added category: ${cat.name}`);
      } else {
        await conn.query(
          'UPDATE Categories SET name = ?, slug = ?, description = ?, image = ?, updatedAt = NOW() WHERE id = ?',
          [cat.name, cat.slug, cat.description, cat.image, existing[0].id]
        );
        console.log(`Updated category: ${cat.name}`);
      }
    }

    // 2. Fetch default location
    const [locations] = await conn.query('SELECT id, name FROM Locations LIMIT 1');
    const defaultLocationId = locations.length > 0 ? locations[0].id : null;

    // 3. Homepage Properties to Sync
    const homepageProperties = [
      {
        title: 'The Never-Ending Story C-80',
        slug: 'the-never-ending-story-c-80',
        description: 'Stunning luxury residence featuring open-concept architectural lines, premium marble flooring, panoramic views, and private entertainment lounge.',
        price: 8500.00,
        type: 'Villa',
        purpose: 'For Sale',
        status: 'Active',
        bedrooms: 4,
        bathrooms: 3,
        areaSqFt: 1600,
        address: '80 Horizon Ridge, Beverly Hills, CA',
        categoryName: 'Bestseller',
        featured: 1,
        image: 'http://localhost:5000/uploads/1_3704aed9-4ae6-414a-b0ed-95ec47e19a0b_600x600.png'
      },
      {
        title: 'MiniPalais D-703',
        slug: 'minipalais-d-703',
        description: 'Chic modern urban loft offering double-height ceilings, smart kitchen automation, floor-to-ceiling glass windows, and private concierge.',
        price: 10000.00,
        type: 'Apartment',
        purpose: 'For Rent',
        status: 'Active',
        bedrooms: 3,
        bathrooms: 2,
        areaSqFt: 1800,
        address: '703 Palais Boulevard, Manhattan, NY',
        categoryName: 'Apartment',
        featured: 1,
        image: 'http://localhost:5000/uploads/1_600x600.png'
      },
      {
        title: 'Wheelwright Cottage B-11',
        slug: 'wheelwright-cottage-b-11',
        description: 'Equestrian country estate blending authentic stone craftsmanship with high-end contemporary comforts, horse stables, and serene tree-lined acreage.',
        price: 9090.00,
        type: 'Farm Vila',
        purpose: 'For Sale',
        status: 'Active',
        bedrooms: 4,
        bathrooms: 4,
        areaSqFt: 2600,
        address: '11 Wheelwright Lane, Austin Hills, Austin, TX',
        categoryName: 'Farm Vila',
        featured: 1,
        image: 'http://localhost:5000/uploads/1_2366d2e8-e3d8-40cd-b6c9-c6a92538670e_600x600.png'
      },
      {
        title: 'The White House J-54',
        slug: 'the-white-house-j-54',
        description: 'Iconic neoclassical grand manor featuring majestic white columned portico, Olympic swimming pool, tennis court, and manicured hedge labyrinths.',
        price: 3600000.00,
        type: 'Royal House',
        purpose: 'For Sale',
        status: 'Active',
        bedrooms: 6,
        bathrooms: 7,
        areaSqFt: 7200,
        address: '54 Presidential Way, Pacific Heights, San Francisco, CA',
        categoryName: 'Royal House',
        featured: 1,
        image: 'http://localhost:5000/uploads/1_37a9cf7c-0609-4e7a-9358-c00ba0bb57e7_600x600.png'
      },
      {
        title: 'Luxury Seaside Villa',
        slug: 'luxury-seaside-villa',
        description: 'Breathtaking coastal oceanfront sanctuary with infinity edge pool, private dock, expansive teak sundeck, and panoramic sunset terraces.',
        price: 15200.00,
        type: 'Luxury Properties',
        purpose: 'For Sale',
        status: 'Active',
        bedrooms: 5,
        bathrooms: 6,
        areaSqFt: 3200,
        address: '10 Ocean Crest, South Beach, Miami, FL',
        categoryName: 'Luxury Properties',
        featured: 1,
        image: 'http://localhost:5000/uploads/1_fcb7d6ba-48c9-49b5-b5fa-65fbe6576bfd_600x600.png'
      },
      {
        title: 'Meadow View D - 205',
        slug: 'meadow-view-d-205',
        description: 'Expansive modern farm villa surrounded by rolling meadows. Features energy-positive solar infrastructure, floor-to-ceiling glass, and tranquil stone fireplaces.',
        price: 940000.00,
        type: 'Farm Vila',
        purpose: 'For Sale',
        status: 'Active',
        bedrooms: 4,
        bathrooms: 3,
        areaSqFt: 3600,
        address: '205 Meadow Ridge Road, Austin Hills, Austin, TX',
        categoryName: 'Farm Vila',
        featured: 1,
        image: 'http://localhost:5000/uploads/1_8c387548-6a1e-4930-890a-cec2491c0d60_600x600.png'
      },
      {
        title: 'Family Villas C-92',
        slug: 'family-villas-c-92',
        description: 'Spacious luxury family compound designed for multi-generational living with chef-grade indoor/outdoor kitchen, heated spa, and kids recreation pavilion.',
        price: 1250000.00,
        type: 'Villa',
        purpose: 'For Sale',
        status: 'Active',
        bedrooms: 5,
        bathrooms: 5,
        areaSqFt: 4200,
        address: '92 Palm Avenue, South Beach, Miami, FL',
        categoryName: 'Villa',
        featured: 1,
        image: 'http://localhost:5000/uploads/1_f26220d0-23df-49cc-8ab9-2ef5f66b891a_600x600.png'
      },
      {
        title: 'Darth Vader House A- 24',
        slug: 'darth-vader-house-a-24',
        description: 'An internationally celebrated architectural marvel with futuristic aerodynamic silhouette, stealth dark obsidian finishes, and glass-encased courtyard.',
        price: 1850000.00,
        type: 'Villa',
        purpose: 'For Sale',
        status: 'Active',
        bedrooms: 5,
        bathrooms: 6,
        areaSqFt: 5800,
        address: '24 Skyline Ridge, Beverly Hills, CA',
        categoryName: 'Villa',
        featured: 1,
        image: 'http://localhost:5000/uploads/1_f4b79814-9043-4021-bae2-9fdb152c6064_600x600.png'
      },
      {
        title: 'Noble Park B-106',
        slug: 'noble-park-b-106',
        description: 'Prestigious corner penthouse in downtown Manhattan with 360-degree skyline views, private elevator vestibule, and customized Italian marble bathrooms.',
        price: 2400000.00,
        type: 'Apartment',
        purpose: 'For Sale',
        status: 'Active',
        bedrooms: 3,
        bathrooms: 3,
        areaSqFt: 2950,
        address: '106 Madison Avenue, Manhattan, NY',
        categoryName: 'Apartment',
        featured: 1,
        image: 'http://localhost:5000/uploads/2_a1c84790-b42a-4248-9c4f-e3206e8c8989_600x600.png'
      }
    ];

    for (const p of homepageProperties) {
      // Find category
      const [catRows] = await conn.query('SELECT id FROM Categories WHERE name = ? LIMIT 1', [p.categoryName]);
      const categoryId = catRows.length > 0 ? catRows[0].id : null;

      const [existing] = await conn.query('SELECT id FROM Properties WHERE title = ? OR slug = ?', [p.title, p.slug]);
      let propId;

      if (existing.length === 0) {
        const [insertRes] = await conn.query(
          `INSERT INTO Properties (
            title, slug, description, price, type, purpose, status,
            bedrooms, bathrooms, areaSqFt, address, featured,
            CategoryId, LocationId, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            p.title, p.slug, p.description, p.price, p.type, p.purpose, p.status,
            p.bedrooms, p.bathrooms, p.areaSqFt, p.address, p.featured,
            categoryId, defaultLocationId
          ]
        );
        propId = insertRes.insertId;
        console.log(`Created property: ${p.title} (ID: ${propId})`);
      } else {
        propId = existing[0].id;
        await conn.query(
          `UPDATE Properties SET
            title = ?, slug = ?, description = ?, price = ?, type = ?, purpose = ?, status = ?,
            bedrooms = ?, bathrooms = ?, areaSqFt = ?, address = ?, featured = ?,
            CategoryId = ?, LocationId = ?, updatedAt = NOW()
          WHERE id = ?`,
          [
            p.title, p.slug, p.description, p.price, p.type, p.purpose, p.status,
            p.bedrooms, p.bathrooms, p.areaSqFt, p.address, p.featured,
            categoryId, defaultLocationId, propId
          ]
        );
        console.log(`Updated property: ${p.title} (ID: ${propId})`);
      }

      // Ensure primary image in PropertyImages table
      const [imgExisting] = await conn.query('SELECT id FROM PropertyImages WHERE PropertyId = ?', [propId]);
      if (imgExisting.length === 0) {
        await conn.query(
          'INSERT INTO PropertyImages (PropertyId, url, isPrimary, createdAt, updatedAt) VALUES (?, ?, 1, NOW(), NOW())',
          [propId, p.image]
        );
      } else {
        await conn.query(
          'UPDATE PropertyImages SET url = ?, isPrimary = 1 WHERE PropertyId = ? ORDER BY id ASC LIMIT 1',
          [p.image, propId]
        );
      }
    }

    console.log('--- Homepage Properties and Header Categories Successfully Synced! ---');
  } catch (err) {
    console.error('Sync error:', err);
    throw err;
  } finally {
    await conn.end();
  }
}

if (require.main === module) {
  syncHomepageData().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = syncHomepageData;
