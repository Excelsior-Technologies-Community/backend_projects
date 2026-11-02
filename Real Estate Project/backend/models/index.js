const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AdminUser = sequelize.define('AdminUser', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'admin' },
});

const User = sequelize.define('User', {
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'customer' },
});

const Category = sequelize.define('Category', {
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, unique: true },
});

const Location = sequelize.define('Location', {
  name: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING },
});

const Amenity = sequelize.define('Amenity', {
  name: { type: DataTypes.STRING, allowNull: false },
});

const Property = sequelize.define('Property', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  status: { type: DataTypes.ENUM('Active', 'Pending', 'Sold'), defaultValue: 'Active' },
});

const PropertyImage = sequelize.define('PropertyImage', {
  url: { type: DataTypes.STRING, allowNull: false },
});

const Inquiry = sequelize.define('Inquiry', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  message: { type: DataTypes.TEXT },
  status: { type: DataTypes.ENUM('New', 'Contacted', 'Closed'), defaultValue: 'New' },
});

const Testimonial = sequelize.define('Testimonial', {
  name: { type: DataTypes.STRING, allowNull: false },
  text: { type: DataTypes.TEXT, allowNull: false },
  rating: { type: DataTypes.INTEGER, defaultValue: 5 },
});

const Setting = sequelize.define('Setting', {
  key: { type: DataTypes.STRING, allowNull: false, unique: true },
  value: { type: DataTypes.TEXT },
});

const Slider = sequelize.define('Slider', {
  image: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING },
});

const CMS = sequelize.define('CMS', {
  page: { type: DataTypes.STRING, unique: true }, // e.g., 'about', 'terms'
  content: { type: DataTypes.TEXT },
});

// Relationships
Property.belongsTo(Category);
Category.hasMany(Property);

Property.belongsTo(Location);
Location.hasMany(Property);

Property.hasMany(PropertyImage, { as: 'images' });
PropertyImage.belongsTo(Property);

Property.belongsToMany(Amenity, { through: 'PropertyAmenities' });
Amenity.belongsToMany(Property, { through: 'PropertyAmenities' });

Inquiry.belongsTo(Property);
Property.hasMany(Inquiry);

module.exports = {
  sequelize,
  AdminUser,
  User,
  Category,
  Location,
  Amenity,
  Property,
  PropertyImage,
  Inquiry,
  Testimonial,
  Setting,
  Slider,
  CMS
};
