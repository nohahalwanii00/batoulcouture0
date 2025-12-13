const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/health', (req, res) => {
  const status = mongoose.connection.readyState === 1 ? 'ok' : 'degraded';
  res.status(200).json({ status, mongoConnected: mongoose.connection.readyState === 1 });
});

const dressRoutes = require('./routes/dresses');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const dressRoutesMock = require('./routes/dresses-mock');
const contactRoutes = require('./routes/contact');

// Always mount auth and contact routes so login and contact work immediately
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);

// Attempt MongoDB connection (do not bind routes here)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/batoul-couture', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.log('Mock mode active until DB is available...');
});

// Dynamically route to real or mock dresses based on Mongo connection state
app.use('/api/dresses', (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return dressRoutes(req, res, next);
  }
  return dressRoutesMock(req, res, next);
});

// Orders: use real when DB is connected, otherwise mock minimal handlers
const mockOrders = [
  {
    _id: '1',
    customerName: 'Demo Customer',
    email: 'demo@example.com',
    phone: '123-456-7890',
    dressId: '1',
    size: 'M',
    color: 'Navy Blue',
    quantity: 1,
    totalPrice: 299,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
const mockOrdersRouter = express.Router();
mockOrdersRouter.get('/', (req, res) => res.json(mockOrders));
mockOrdersRouter.post('/', (req, res) => {
  const newOrder = {
    _id: String(mockOrders.length + 1),
    ...req.body,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  mockOrders.push(newOrder);
  res.status(201).json(newOrder);
});

app.use('/api/orders', (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return orderRoutes(req, res, next);
  }
  return mockOrdersRouter(req, res, next);
});

// Serve built frontend
const clientBuildPath = path.join(__dirname, '..', 'client', 'build');
app.use(express.static(clientBuildPath));

// SPA fallback: send index.html for non-API routes (exclude API paths)
// This ensures API endpoints are not intercepted by the fallback.
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
