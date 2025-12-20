const mongoose = require('mongoose');

const CATEGORY_OPTIONS = [
  'Abaya underdresses',
  'Black abayas Kuwaiti',
  '2024 Winter Collection',
  '2025 Summer Collection',
  'Chemise',
  'Set',
  'Scarfs',
  'Gloves',
  'evening',
  'wedding',
  'casual',
  'formal',
  'cocktail',
  'prom',
];

const dressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: CATEGORY_OPTIONS
  },
  size: {
    type: [String],
    required: true,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  color: {
    type: [String],
    required: true
  },
  images: [{
    url: String,
    alt: String,
    isMain: { type: Boolean, default: false }
  }],
  material: {
    type: String,
    required: true
  },
  careInstructions: String,
  availability: {
    type: String,
    enum: ['in-stock', 'limited', 'out-of-stock'],
    default: 'in-stock'
  },
  stockQuantity: {
    type: Number,
    default: 1,
    min: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

dressSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Dress', dressSchema);
