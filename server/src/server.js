// server/src/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const authRoutes = require('./routes/auth');
const cvRoutes = require('./routes/cv');
const uploadRoutes = require('./routes/upload'); // ⟵ CommonJS

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middlewares de sécurité
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Routes statiques (uploads)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/upload', uploadRoutes);

// Routes de santé
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'AfricaCV Pro API is running',
    timestamp: new Date().toISOString()
  });
});

// Routes templates
app.get('/api/templates', async (req, res) => {
  try {
    const templates = await prisma.template.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        previewUrl: true,
        createdAt: true
      }
    });
    res.json({ success: true, data: templates });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Route mock stats
app.get('/api/stats', async (_req, res) => {
  try {
    const stats = {
      totalUsers: 1247,
      activeToday: 43,
      previewsToday: 287,
      whatsappClicks: 89,
      paidOrders: 34
    };
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 404 API
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API route not found: ${req.method} ${req.path}`
  });
});

// Global error handler
app.use((error, _req, res, _next) => {
  console.error('Global error handler:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
  console.log(`📝 Templates API: http://localhost:${PORT}/api/templates`);
  console.log(`📈 Stats API: http://localhost:${PORT}/api/stats`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
