const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/cv - Liste des CV de l'utilisateur
router.get('/', authenticateToken, async (req, res) => {
  try {
    const cvs = await prisma.resume.findMany({
      where: { userId: req.user.id },
      include: {
        template: true,
        orders: true
      }
    });
    
    res.json({ success: true, data: cvs });
  } catch (error) {
    console.error('Get CVs error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// POST /api/cv - Créer un nouveau CV
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, template } = req.body;
    
    const cv = await prisma.resume.create({
      data: {
        title: title || 'Mon CV',
        templateId: template || 'classic',
        userId: req.user.id,
        dataJson: JSON.stringify({
          personal: {},
          profile: { summary: '' },
          education: [],
          experience: [],
          skills: [],
          languages: [],
          interests: [],
          customSections: []
        })
      },
      include: {
        template: true
      }
    });
    
    res.json({ success: true, data: cv });
  } catch (error) {
    console.error('Create CV error:', error);
    res.status(500).json({ success: false, error: 'Erreur création CV' });
  }
});

// GET /api/cv/:id - Récupérer un CV spécifique
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const cv = await prisma.resume.findFirst({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      },
      include: {
        template: true
      }
    });
    
    if (!cv) {
      return res.status(404).json({ success: false, error: 'CV non trouvé' });
    }
    
    res.json({ 
      success: true, 
      data: {
        ...cv,
        ...JSON.parse(cv.dataJson)
      }
    });
  } catch (error) {
    console.error('Get CV error:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// PUT /api/cv/:id - Mettre à jour un CV
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { personal, profile, education, experience, skills, languages, interests, customSections } = req.body;
    
    const cv = await prisma.resume.findFirst({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });
    
    if (!cv) {
      return res.status(404).json({ success: false, error: 'CV non trouvé' });
    }
    
    const updatedCv = await prisma.resume.update({
      where: { id: req.params.id },
      data: {
        dataJson: JSON.stringify({
          personal: personal || {},
          profile: profile || { summary: '' },
          education: education || [],
          experience: experience || [],
          skills: skills || [],
          languages: languages || [],
          interests: interests || [],
          customSections: customSections || []
        }),
        updatedAt: new Date()
      }
    });
    
    res.json({ success: true, data: updatedCv });
  } catch (error) {
    console.error('Update CV error:', error);
    res.status(500).json({ success: false, error: 'Erreur mise à jour CV' });
  }
});

// Mettre à jour le serveur principal pour inclure ces routes
module.exports = router;