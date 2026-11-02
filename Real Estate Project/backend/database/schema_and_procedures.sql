-- Real Estate Database Schema and Stored Procedures
-- Compatible with MySQL 8.0+

CREATE DATABASE IF NOT EXISTS realestate_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE realestate_db;

-- 1. Admin Users Table
CREATE TABLE IF NOT EXISTS AdminUsers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Customer Users Table
CREATE TABLE IF NOT EXISTS Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NULL,
  avatar VARCHAR(255) NULL,
  role VARCHAR(50) DEFAULT 'customer',
  resetToken VARCHAR(255) NULL,
  resetTokenExpiry DATETIME NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS Categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(191) NOT NULL UNIQUE,
  description TEXT NULL,
  image VARCHAR(500) NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. Locations Table
CREATE TABLE IF NOT EXISTS Locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  city VARCHAR(100) NULL,
  state VARCHAR(100) NULL,
  country VARCHAR(100) DEFAULT 'USA',
  image VARCHAR(500) NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 5. Amenities Table
CREATE TABLE IF NOT EXISTS Amenities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  icon VARCHAR(100) DEFAULT 'check',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 6. Properties Table
CREATE TABLE IF NOT EXISTS Properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NULL,
  description LONGTEXT NULL,
  price DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
  type VARCHAR(50) DEFAULT 'Villa', -- Villa, Apartment, House, Commercial, Penthouse
  purpose VARCHAR(50) DEFAULT 'For Sale', -- For Sale, For Rent
  status ENUM('Active', 'Pending', 'Sold') DEFAULT 'Active',
  bedrooms INT DEFAULT 1,
  bathrooms INT DEFAULT 1,
  areaSqFt INT DEFAULT 1000,
  address VARCHAR(255) NULL,
  latitude DECIMAL(10, 8) NULL,
  longitude DECIMAL(11, 8) NULL,
  featured BOOLEAN DEFAULT FALSE,
  CategoryId INT NULL,
  LocationId INT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_prop_cat FOREIGN KEY (CategoryId) REFERENCES Categories(id) ON DELETE SET NULL,
  CONSTRAINT fk_prop_loc FOREIGN KEY (LocationId) REFERENCES Locations(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 7. Property Images Table
CREATE TABLE IF NOT EXISTS PropertyImages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  PropertyId INT NOT NULL,
  url VARCHAR(500) NOT NULL,
  isPrimary BOOLEAN DEFAULT FALSE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_img_prop FOREIGN KEY (PropertyId) REFERENCES Properties(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Property Amenities Junction Table
CREATE TABLE IF NOT EXISTS PropertyAmenities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  PropertyId INT NOT NULL,
  AmenityId INT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_prop_amenity (PropertyId, AmenityId),
  CONSTRAINT fk_pa_prop FOREIGN KEY (PropertyId) REFERENCES Properties(id) ON DELETE CASCADE,
  CONSTRAINT fk_pa_amenity FOREIGN KEY (AmenityId) REFERENCES Amenities(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. Inquiries Table
CREATE TABLE IF NOT EXISTS Inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  PropertyId INT NULL,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(191) NOT NULL,
  phone VARCHAR(50) NULL,
  message TEXT NULL,
  status ENUM('New', 'Contacted', 'Closed') DEFAULT 'New',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_inq_prop FOREIGN KEY (PropertyId) REFERENCES Properties(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 10. Saved / Favorite Properties
CREATE TABLE IF NOT EXISTS Favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  UserId INT NOT NULL,
  PropertyId INT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_fav (UserId, PropertyId),
  CONSTRAINT fk_fav_user FOREIGN KEY (UserId) REFERENCES Users(id) ON DELETE CASCADE,
  CONSTRAINT fk_fav_prop FOREIGN KEY (PropertyId) REFERENCES Properties(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 11. Testimonials Table
CREATE TABLE IF NOT EXISTS Testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  role VARCHAR(100) NULL,
  company VARCHAR(100) NULL,
  text TEXT NOT NULL,
  rating INT DEFAULT 5,
  avatar VARCHAR(500) NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 12. Sliders / Banners Table
CREATE TABLE IF NOT EXISTS Sliders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NULL,
  subtitle VARCHAR(300) NULL,
  image VARCHAR(500) NOT NULL,
  link VARCHAR(255) DEFAULT '/properties',
  sortOrder INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'Active',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 13. CMS Pages Table
CREATE TABLE IF NOT EXISTS CMS (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT NULL,
  metaTitle VARCHAR(255) NULL,
  metaDescription TEXT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 14. Settings Table
CREATE TABLE IF NOT EXISTS Settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(100) NOT NULL UNIQUE,
  value LONGTEXT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =======================================================
-- MYSQL STORED PROCEDURES
-- =======================================================

-- Procedure 1: Get Dashboard Statistics
DROP PROCEDURE IF EXISTS sp_get_dashboard_stats;
DELIMITER $$
CREATE PROCEDURE sp_get_dashboard_stats()
BEGIN
  SELECT 
    (SELECT COUNT(*) FROM Properties) AS total_properties,
    (SELECT COUNT(*) FROM Properties WHERE status = 'Active') AS active_properties,
    (SELECT COUNT(*) FROM Inquiries) AS total_inquiries,
    (SELECT COUNT(*) FROM Inquiries WHERE status = 'New') AS new_inquiries,
    (SELECT COUNT(*) FROM Users) AS total_customers,
    (SELECT COUNT(*) FROM AdminUsers) AS total_admins,
    (SELECT COUNT(*) FROM Categories) AS total_categories,
    (SELECT COUNT(*) FROM Locations) AS total_locations;
END$$
DELIMITER ;

-- Procedure 2: Get Filtered Properties
DROP PROCEDURE IF EXISTS sp_get_properties;
DELIMITER $$
CREATE PROCEDURE sp_get_properties(
  IN p_category_id INT,
  IN p_location_id INT,
  IN p_purpose VARCHAR(50),
  IN p_min_price DECIMAL(14,2),
  IN p_max_price DECIMAL(14,2),
  IN p_search VARCHAR(255),
  IN p_sort VARCHAR(50),
  IN p_limit INT,
  IN p_offset INT
)
BEGIN
  SELECT 
    p.id,
    p.title,
    p.slug,
    p.description,
    p.price,
    p.type,
    p.purpose,
    p.status,
    p.bedrooms,
    p.bathrooms,
    p.areaSqFt,
    p.address,
    p.latitude,
    p.longitude,
    p.featured,
    p.CategoryId,
    c.name AS category_name,
    p.LocationId,
    l.name AS location_name,
    l.city AS location_city,
    (SELECT pi.url FROM PropertyImages pi WHERE pi.PropertyId = p.id ORDER BY pi.isPrimary DESC, pi.id ASC LIMIT 1) AS primary_image,
    p.createdAt,
    p.updatedAt
  FROM Properties p
  LEFT JOIN Categories c ON p.CategoryId = c.id
  LEFT JOIN Locations l ON p.LocationId = l.id
  WHERE (p_category_id IS NULL OR p.CategoryId = p_category_id)
    AND (p_location_id IS NULL OR p.LocationId = p_location_id)
    AND (p_purpose IS NULL OR p_purpose = '' OR p.purpose = p_purpose)
    AND (p_min_price IS NULL OR p.price >= p_min_price)
    AND (p_max_price IS NULL OR p.price <= p_max_price)
    AND (p_search IS NULL OR p_search = '' OR p.title LIKE CONCAT('%', p_search, '%') OR p.address LIKE CONCAT('%', p_search, '%'))
  ORDER BY 
    CASE WHEN p_sort = 'price_asc' THEN p.price END ASC,
    CASE WHEN p_sort = 'price_desc' THEN p.price END DESC,
    CASE WHEN p_sort = 'featured' THEN p.featured END DESC,
    p.createdAt DESC
  LIMIT p_limit OFFSET p_offset;
END$$
DELIMITER ;

-- Procedure 3: Get Property By ID
DROP PROCEDURE IF EXISTS sp_get_property_by_id;
DELIMITER $$
CREATE PROCEDURE sp_get_property_by_id(IN p_id INT)
BEGIN
  -- Property Main Info
  SELECT 
    p.*,
    c.name AS category_name,
    c.slug AS category_slug,
    l.name AS location_name,
    l.city AS location_city,
    l.country AS location_country
  FROM Properties p
  LEFT JOIN Categories c ON p.CategoryId = c.id
  LEFT JOIN Locations l ON p.LocationId = l.id
  WHERE p.id = p_id;

  -- Property Images
  SELECT id, url, isPrimary 
  FROM PropertyImages 
  WHERE PropertyId = p_id 
  ORDER BY isPrimary DESC, id ASC;

  -- Property Amenities
  SELECT a.id, a.name, a.icon
  FROM PropertyAmenities pa
  JOIN Amenities a ON pa.AmenityId = a.id
  WHERE pa.PropertyId = p_id;
END$$
DELIMITER ;

-- Procedure 4: Create Property
DROP PROCEDURE IF EXISTS sp_create_property;
DELIMITER $$
CREATE PROCEDURE sp_create_property(
  IN p_title VARCHAR(255),
  IN p_slug VARCHAR(255),
  IN p_description LONGTEXT,
  IN p_price DECIMAL(14,2),
  IN p_type VARCHAR(50),
  IN p_purpose VARCHAR(50),
  IN p_status VARCHAR(50),
  IN p_bedrooms INT,
  IN p_bathrooms INT,
  IN p_area_sqft INT,
  IN p_address VARCHAR(255),
  IN p_featured BOOLEAN,
  IN p_category_id INT,
  IN p_location_id INT,
  IN p_image_url VARCHAR(500),
  OUT p_new_id INT
)
BEGIN
  INSERT INTO Properties (
    title, slug, description, price, type, purpose, status,
    bedrooms, bathrooms, areaSqFt, address, featured,
    CategoryId, LocationId, createdAt, updatedAt
  ) VALUES (
    p_title, p_slug, p_description, p_price, p_type, p_purpose, p_status,
    p_bedrooms, p_bathrooms, p_area_sqft, p_address, p_featured,
    p_category_id, p_location_id, NOW(), NOW()
  );
  
  SET p_new_id = LAST_INSERT_ID();

  IF p_image_url IS NOT NULL AND p_image_url != '' THEN
    INSERT INTO PropertyImages (PropertyId, url, isPrimary, createdAt, updatedAt)
    VALUES (p_new_id, p_image_url, 1, NOW(), NOW());
  END IF;

  SELECT p_new_id AS id;
END$$
DELIMITER ;

-- Procedure 5: Update Property
DROP PROCEDURE IF EXISTS sp_update_property;
DELIMITER $$
CREATE PROCEDURE sp_update_property(
  IN p_id INT,
  IN p_title VARCHAR(255),
  IN p_description LONGTEXT,
  IN p_price DECIMAL(14,2),
  IN p_type VARCHAR(50),
  IN p_purpose VARCHAR(50),
  IN p_status VARCHAR(50),
  IN p_bedrooms INT,
  IN p_bathrooms INT,
  IN p_area_sqft INT,
  IN p_address VARCHAR(255),
  IN p_featured BOOLEAN,
  IN p_category_id INT,
  IN p_location_id INT
)
BEGIN
  UPDATE Properties SET
    title = p_title,
    description = p_description,
    price = p_price,
    type = p_type,
    purpose = p_purpose,
    status = p_status,
    bedrooms = p_bedrooms,
    bathrooms = p_bathrooms,
    areaSqFt = p_area_sqft,
    address = p_address,
    featured = p_featured,
    CategoryId = p_category_id,
    LocationId = p_location_id,
    updatedAt = NOW()
  WHERE id = p_id;

  SELECT * FROM Properties WHERE id = p_id;
END$$
DELIMITER ;

-- Procedure 6: Delete Property
DROP PROCEDURE IF EXISTS sp_delete_property;
DELIMITER $$
CREATE PROCEDURE sp_delete_property(IN p_id INT)
BEGIN
  DELETE FROM Properties WHERE id = p_id;
  SELECT p_id AS deleted_id;
END$$
DELIMITER ;

-- Procedure 7: Create Inquiry
DROP PROCEDURE IF EXISTS sp_create_inquiry;
DELIMITER $$
CREATE PROCEDURE sp_create_inquiry(
  IN p_property_id INT,
  IN p_name VARCHAR(150),
  IN p_email VARCHAR(191),
  IN p_phone VARCHAR(50),
  IN p_message TEXT
)
BEGIN
  INSERT INTO Inquiries (PropertyId, name, email, phone, message, status, createdAt, updatedAt)
  VALUES (p_property_id, p_name, p_email, p_phone, p_message, 'New', NOW(), NOW());

  SELECT 
    i.*,
    p.title AS property_title,
    p.price AS property_price
  FROM Inquiries i
  LEFT JOIN Properties p ON i.PropertyId = p.id
  WHERE i.id = LAST_INSERT_ID();
END$$
DELIMITER ;

-- Procedure 8: Toggle Favorite
DROP PROCEDURE IF EXISTS sp_toggle_favorite;
DELIMITER $$
CREATE PROCEDURE sp_toggle_favorite(
  IN p_user_id INT,
  IN p_property_id INT
)
BEGIN
  DECLARE fav_count INT;
  SELECT COUNT(*) INTO fav_count FROM Favorites WHERE UserId = p_user_id AND PropertyId = p_property_id;

  IF fav_count > 0 THEN
    DELETE FROM Favorites WHERE UserId = p_user_id AND PropertyId = p_property_id;
    SELECT FALSE AS is_favorite, 'Removed from favorites' AS message;
  ELSE
    INSERT INTO Favorites (UserId, PropertyId, createdAt, updatedAt) VALUES (p_user_id, p_property_id, NOW(), NOW());
    SELECT TRUE AS is_favorite, 'Added to favorites' AS message;
  END IF;
END$$
DELIMITER ;

-- Procedure 9: Get User Favorites
DROP PROCEDURE IF EXISTS sp_get_user_favorites;
DELIMITER $$
CREATE PROCEDURE sp_get_user_favorites(IN p_user_id INT)
BEGIN
  SELECT 
    p.id,
    p.title,
    p.slug,
    p.price,
    p.type,
    p.purpose,
    p.bedrooms,
    p.bathrooms,
    p.areaSqFt,
    p.address,
    c.name AS category_name,
    l.name AS location_name,
    (SELECT pi.url FROM PropertyImages pi WHERE pi.PropertyId = p.id ORDER BY pi.isPrimary DESC, pi.id ASC LIMIT 1) AS primary_image,
    f.createdAt AS savedAt
  FROM Favorites f
  JOIN Properties p ON f.PropertyId = p.id
  LEFT JOIN Categories c ON p.CategoryId = c.id
  LEFT JOIN Locations l ON p.LocationId = l.id
  WHERE f.UserId = p_user_id
  ORDER BY f.createdAt DESC;
END$$
DELIMITER ;

-- Procedure 10: Upsert Setting
DROP PROCEDURE IF EXISTS sp_save_setting;
DELIMITER $$
CREATE PROCEDURE sp_save_setting(
  IN p_key VARCHAR(100),
  IN p_value LONGTEXT
)
BEGIN
  INSERT INTO Settings (`key`, value, createdAt, updatedAt)
  VALUES (p_key, p_value, NOW(), NOW())
  ON DUPLICATE KEY UPDATE value = p_value, updatedAt = NOW();

  SELECT * FROM Settings WHERE `key` = p_key;
END$$
DELIMITER ;
