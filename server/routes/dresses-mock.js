const express = require('express');
const router = express.Router();
const mockDresses = require('../data/mockDresses');

const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');


function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Configure multer for image uploads (disk storage like real route)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

// Helper to map uploaded files to local URLs
async function mapImagesToUrls(files, name) {
  if (!files || files.length === 0) return [];
  return files.map(file => ({ url: `/uploads/${file.filename}`, alt: name || file.originalname, isMain: false }));
}

// GET all dresses with optional filtering
router.get('/', async (req, res) => {
  try {
    const { category, featured, search } = req.query;
    let filteredDresses = [...mockDresses];

    if (category) {
      filteredDresses = filteredDresses.filter(dress => dress.category === category);
    }

    if (featured === 'true') {
      filteredDresses = filteredDresses.filter(dress => dress.featured === true);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredDresses = filteredDresses.filter(dress => 
        dress.name.toLowerCase().includes(searchLower) ||
        dress.description.toLowerCase().includes(searchLower)
      );
    }

    // Sort by createdAt date (newest first)
    filteredDresses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(filteredDresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET featured dresses
router.get('/featured', async (req, res) => {
  try {
    const featuredDresses = mockDresses.filter(dress => dress.featured === true).slice(0, 6);
    res.json(featuredDresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single dress by ID
router.get('/:id', async (req, res) => {
  try {
    const dress = mockDresses.find(dress => dress._id === req.params.id);
    if (!dress) {
      return res.status(404).json({ message: 'Dress not found' });
    }
    res.json(dress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new dress (accept multipart/form-data during development)
router.post('/', requireAuth, upload.array('images', 5), async (req, res) => {
  try {
    // Extract arrays from body (support comma-separated or repeated fields)
    const rawSize = req.body.size ?? req.body['size[]'] ?? req.body.sizes ?? req.body['sizes[]'];
    const rawColor = req.body.color ?? req.body['color[]'] ?? req.body.colors ?? req.body['colors[]'];
    const size = Array.isArray(rawSize)
      ? rawSize.filter(Boolean)
      : (typeof rawSize === 'string' ? rawSize.split(',').map(s => s.trim()).filter(Boolean) : []);
    const color = Array.isArray(rawColor)
      ? rawColor.filter(Boolean)
      : (typeof rawColor === 'string' ? rawColor.split(',').map(c => c.trim()).filter(Boolean) : []);

    const images = await mapImagesToUrls(req.files, req.body.name);

    const newDress = {
      _id: String(mockDresses.length + 1),
      name: req.body.name || '',
      description: req.body.description || '',
      price: parseFloat(req.body.price ?? '0') || 0,
      category: req.body.category || 'evening',
      size,
      color,
      images,
      material: req.body.material || '',
      careInstructions: req.body.careInstructions || '',
      availability: req.body.availability || 'in-stock',
      stockQuantity: parseInt(req.body.stockQuantity ?? '1', 10) || 1,
      featured: String(req.body.featured).toLowerCase() === 'true',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Set first image as main if present
    if (newDress.images && newDress.images.length > 0) {
      newDress.images[0].isMain = true;
    }

    mockDresses.unshift(newDress); // newest first
    res.status(201).json(newDress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update dress (accept multipart/form-data)
router.put('/:id', requireAuth, upload.array('images', 5), async (req, res) => {
  try {
    const idx = mockDresses.findIndex(dress => dress._id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ message: 'Dress not found' });
    }

    // Prepare arrays from body
    const rawSize = req.body.size ?? req.body['size[]'] ?? req.body.sizes ?? req.body['sizes[]'];
    const rawColor = req.body.color ?? req.body['color[]'] ?? req.body.colors ?? req.body['colors[]'];
    const size = Array.isArray(rawSize)
      ? rawSize.filter(Boolean)
      : (typeof rawSize === 'string' ? rawSize.split(',').map(s => s.trim()).filter(Boolean) : mockDresses[idx].size);
    const color = Array.isArray(rawColor)
      ? rawColor.filter(Boolean)
      : (typeof rawColor === 'string' ? rawColor.split(',').map(c => c.trim()).filter(Boolean) : mockDresses[idx].color);

    // Handle new images if uploaded
    let images = mockDresses[idx].images;
    if (req.files && req.files.length > 0) {
      const newImages = await mapImagesToUrls(req.files, req.body.name || mockDresses[idx].name);
      images = [...images, ...newImages];
    }

    mockDresses[idx] = {
      ...mockDresses[idx],
      name: req.body.name ?? mockDresses[idx].name,
      description: req.body.description ?? mockDresses[idx].description,
      price: req.body.price !== undefined ? (parseFloat(req.body.price) || mockDresses[idx].price) : mockDresses[idx].price,
      category: req.body.category ?? mockDresses[idx].category,
      size,
      color,
      images,
      material: req.body.material ?? mockDresses[idx].material,
      careInstructions: req.body.careInstructions ?? mockDresses[idx].careInstructions,
      availability: req.body.availability ?? mockDresses[idx].availability,
      stockQuantity: req.body.stockQuantity !== undefined ? (parseInt(req.body.stockQuantity, 10) || mockDresses[idx].stockQuantity) : mockDresses[idx].stockQuantity,
      featured: req.body.featured !== undefined ? (String(req.body.featured).toLowerCase() === 'true') : mockDresses[idx].featured,
      updatedAt: new Date()
    };

    res.json(mockDresses[idx]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE dress (protected in mock mode)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const idx = mockDresses.findIndex(dress => dress._id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ message: 'Dress not found' });
    }

    mockDresses.splice(idx, 1);
    res.json({ message: 'Dress deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;