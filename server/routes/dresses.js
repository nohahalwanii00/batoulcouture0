const express = require('express');
const router = express.Router();
const Dress = require('../models/Dress');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary if env present
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Simple auth middleware
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

// Configure multer for image uploads (disk storage)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// Helper to map images to Cloudinary URLs if configured
async function mapImagesToUrls(files, name) {
  const useCloudinary = !!(cloudinary.config().cloud_name);
  if (!files || files.length === 0) return [];

  const results = [];
  for (const file of files) {
    if (useCloudinary) {
      try {
        const uploadRes = await cloudinary.uploader.upload(path.join('uploads', file.filename), {
          folder: 'batoul_couture/dresses',
          public_id: `${Date.now()}_${file.filename}`,
        });
        results.push({ url: uploadRes.secure_url, alt: name, isMain: false });
      } catch (err) {
        console.error('Cloudinary upload failed, falling back to local URL:', err.message);
        results.push({ url: `/uploads/${file.filename}`, alt: name, isMain: false });
      }
    } else {
      results.push({ url: `/uploads/${file.filename}`, alt: name, isMain: false });
    }
  }
  return results;
}

// GET all dresses with optional filtering
router.get('/', async (req, res) => {
  try {
    const { category, featured, search } = req.query;
    let query = {};
    
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const dresses = await Dress.find(query).sort({ createdAt: -1 });
    res.json(dresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET featured dresses
router.get('/featured', async (req, res) => {
  try {
    const featuredDresses = await Dress.find({ featured: true }).limit(6);
    res.json(featuredDresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single dress by ID
router.get('/:id', async (req, res) => {
  try {
    const dress = await Dress.findById(req.params.id);
    if (!dress) {
      return res.status(404).json({ message: 'Dress not found' });
    }
    res.json(dress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new dress (protected)
router.post('/', requireAuth, upload.array('images', 5), async (req, res) => {
  try {
    const images = await mapImagesToUrls(req.files, req.body.name);
    const dressData = {
      ...req.body,
      images,
    };
    
    // Set first image as main if no main image specified
    if (dressData.images.length > 0) {
      dressData.images[0].isMain = true;
    }
    
    const dress = new Dress(dressData);
    const savedDress = await dress.save();
    res.status(201).json(savedDress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update dress (protected)
router.put('/:id', requireAuth, upload.array('images', 5), async (req, res) => {
  try {
    const dress = await Dress.findById(req.params.id);
    if (!dress) {
      return res.status(404).json({ message: 'Dress not found' });
    }
    
    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImages = await mapImagesToUrls(req.files, req.body.name || dress.name);
      req.body.images = [...dress.images, ...newImages];
    }
    
    const updatedDress = await Dress.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(updatedDress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE dress (protected)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const dress = await Dress.findByIdAndDelete(req.params.id);
    if (!dress) {
      return res.status(404).json({ message: 'Dress not found' });
    }
    res.json({ message: 'Dress deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;