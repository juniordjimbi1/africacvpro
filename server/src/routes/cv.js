const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken } = require('../middleware/auth');

/* ------------------------- Helpers ------------------------- */

const initialDataJson = () => ({
  personal: {
    firstName: '',
    lastName: '',
    title: '',
    email: '',
    phone: '',
    city: '',
    linkedin: '',
    website: '',
    photoUrl: ''
  },
  profile: '',
  education: [],
  experience: [],
  languages: [],
  skills: [],
  interests: [],
  customSections: []
});

// dataJson est un STRING en DB : on sérialise à l'écriture
const toJsonString = (val) => {
  try {
    if (val == null) return JSON.stringify(initialDataJson());
    if (typeof val === 'string') return val;
    return JSON.stringify(val);
  } catch {
    return JSON.stringify(initialDataJson());
  }
};

// ...et on parse à la lecture pour renvoyer un objet au front
const parseDataJson = (val) => {
  if (!val) return initialDataJson();
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return initialDataJson();
    }
  }
  return val;
};

// id string ou number → whereUnique adapté
const asWhereUnique = (idParam) => {
  const maybeNum = Number(idParam);
  return Number.isFinite(maybeNum) && String(maybeNum) === String(idParam)
    ? { id: maybeNum }
    : { id: String(idParam) };
};

/* ------------------------- Routes ------------------------- */

// LISTE DES CV DE L'UTILISATEUR
router.get('/', authenticateToken, async (req, res) => {
  try {
    const list = await prisma.resume.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        template: true,
        orders: true,
      },
    });

    // Parser dataJson (stocké en STRING)
    const parsed = list.map((r) => ({ ...r, dataJson: parseDataJson(r.dataJson) }));
    return res.json({ success: true, data: parsed });
  } catch (err) {
    console.error('List CV error:', err);
    return res.status(500).json({ success: false, error: 'Erreur listing CV' });
  }
});

// CREATION D'UN CV (BROUILLON) — template obligatoire dans ton schéma
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title = 'Mon CV' } = req.body;

    // 1) Valider l'utilisateur (FK userId)
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Utilisateur invalide' });
    }

    // 2) Récupérer un template existant OU créer un template par défaut
    let tpl = await prisma.template.findFirst({});
    if (!tpl) {
      tpl = await prisma.template.create({
        data: {
          // Adapter ces champs à TON schema.prisma (ils existent dans le ZIP)
          name: 'Par défaut',
          category: 'general',
          tokensJson: '{}',
          isActive: true,
          // description / previewUrl sont optionnels si présents
        },
      });
    }

    // 3) Créer le CV (dataJson = STRING)
    const created = await prisma.resume.create({
      data: {
        title,
        user: { connect: { id: user.id } },
        template: { connect: { id: tpl.id } },
        dataJson: toJsonString(initialDataJson()),
      },
      include: { template: true },
    });

    const cv = { ...created, dataJson: parseDataJson(created.dataJson) };
    return res.status(201).json({ success: true, data: cv });
  } catch (err) {
    console.error('Create CV error:', err);
    return res.status(500).json({ success: false, error: 'Erreur création CV' });
  }
});

// LIRE UN CV (propriétaire uniquement)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const where = asWhereUnique(req.params.id);

    const found = await prisma.resume.findUnique({
      where,
      include: { template: true },
    });

    if (!found || found.userId !== req.user.id) {
      return res.status(404).json({ success: false, error: 'CV introuvable' });
    }

    const cv = { ...found, dataJson: parseDataJson(found.dataJson) };
    return res.json({ success: true, data: cv });
  } catch (err) {
    console.error('Get CV error:', err);
    return res.status(500).json({ success: false, error: 'Erreur lecture CV' });
  }
});

// MISE À JOUR D'UN CV (dataJson)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const where = asWhereUnique(req.params.id);

    const existing = await prisma.resume.findUnique({ where });
    if (!existing || existing.userId !== req.user.id) {
      return res.status(404).json({ success: false, error: 'CV introuvable' });
    }

    const payload = req.body || {};

    const updatedRow = await prisma.resume.update({
      where,
      data: {
        ...(payload.title ? { title: payload.title } : {}),
        ...(payload.dataJson !== undefined
          ? { dataJson: toJsonString(payload.dataJson) }
          : {}),
      },
      include: { template: true },
    });

    const updated = { ...updatedRow, dataJson: parseDataJson(updatedRow.dataJson) };
    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Update CV error:', err);
    return res.status(500).json({ success: false, error: 'Erreur mise à jour CV' });
  }
});

// GET /api/cv/:id  → charger un CV pour l’éditeur
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const cv = await prisma.resume.findUnique({
      where: { id },
      include: { template: true, orders: true },
    });

    if (!cv || cv.userId !== req.user.id) {
      return res.status(404).json({ success: false, error: 'CV introuvable' });
    }

    let parsed = null;
    try { parsed = cv.dataJson ? JSON.parse(cv.dataJson) : null; } catch (_) {}

    return res.json({ success: true, data: { ...cv, data: parsed } });
  } catch (error) {
    console.error('Get CV error:', error);
    return res.status(500).json({ success: false, error: 'Erreur chargement CV' });
  }
});

// PUT /api/cv/:id  → autosave (title / dataJson / templateId)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, dataJson, templateId } = req.body;

    // sécurité : vérifier la propriété
    const current = await prisma.resume.findUnique({ where: { id } });
    if (!current || current.userId !== req.user.id) {
      return res.status(404).json({ success: false, error: 'CV introuvable' });
    }

    const data = {};
    if (typeof title !== 'undefined') data.title = title;
    if (typeof dataJson !== 'undefined') {
      data.dataJson = typeof dataJson === 'string' ? dataJson : JSON.stringify(dataJson);
    }
    if (templateId) data.templateId = templateId;

    const updated = await prisma.resume.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
      include: { template: true, orders: true },
    });

    let parsed = null;
    try { parsed = updated.dataJson ? JSON.parse(updated.dataJson) : null; } catch (_) {}

    return res.json({ success: true, data: { ...updated, data: parsed } });
  } catch (error) {
    console.error('Update CV error:', error);
    return res.status(500).json({ success: false, error: 'Erreur sauvegarde CV' });
  }
});


module.exports = router;
