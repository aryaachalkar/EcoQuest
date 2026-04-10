// ═══════════════════════════════════════════════════════════════
//  EcoQuest — server.js (Main Entry Point)
// ═══════════════════════════════════════════════════════════════

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ─── Global Middleware ────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded proof images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve the frontend HTML files from the parent directory
app.use(express.static(path.join(__dirname, '..')));

// ─── API Routes ──────────────────────────────────────────────
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/users',   require('./routes/users'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/tasks',   require('./routes/tasks'));

// ─── Health Check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'EcoQuest API is running 🌿' });
});

// ─── 404 Handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global Error Handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ─── Database Connection & Server Start ──────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`🌿 EcoQuest server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
