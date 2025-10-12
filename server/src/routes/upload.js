// server/src/routes/upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { parse } = require('../services/parsers/provider');
const { ocrImageWithVision } = require('../services/ocr/vision');

const router = express.Router();

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
};
const photosDir = path.join(process.cwd(), 'uploads', 'photos');
const importsDir = path.join(process.cwd(), 'uploads', 'imports');
ensureDir(photosDir);
ensureDir(importsDir);

const storagePhoto = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, photosDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}_${safe}`);
  }
});
const storageImport = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, importsDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}_${safe}`);
  }
});
const imageFilter = (_req, file, cb) => {
  const ok = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.mimetype);
  cb(ok ? null : new Error('INVALID_IMAGE_TYPE'), ok);
};

const uploadPhoto = multer({ storage: storagePhoto, fileFilter: imageFilter, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadImport = multer({ storage: storageImport, limits: { fileSize: 12 * 1024 * 1024 } });

// --- POST /api/upload/photo ---
router.post('/photo', uploadPhoto.single('file'), (req, res) => {
  const rel = path.relative(process.cwd(), req.file.path).split(path.sep).join('/');
  const base = `${req.protocol}://${req.get('host')}`;
  const url = `${base}/${rel}`;
  res.json({ url });
});

// --- extraction texte ---
async function extractText(filePath, originalName, mime) {
  const ext = path.extname(originalName || '').toLowerCase();

  if (ext === '.pdf') {
    const buf = fs.readFileSync(filePath);
    const result = await pdfParse(buf);
    return result.text || '';
  }
  if (ext === '.docx') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value || '';
  }
  if (ext === '.txt') {
    return fs.readFileSync(filePath, 'utf-8');
  }
  // images → OCR si clé présente
  if (mime && mime.startsWith('image/')) {
    if (process.env.GOOGLE_VISION_API_KEY) {
      try {
        const text = await ocrImageWithVision(filePath);
        return text || '';
      } catch (e) {
        console.warn('[upload] OCR image échec :', e?.message || e);
        return '';
      }
    } else {
      console.log('[upload] OCR image non configuré (pas de GOOGLE_VISION_API_KEY)');
      return '';
    }
  }
  return '';
}

// --- POST /api/upload/parse ---
router.post('/parse', uploadImport.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const text = await extractText(filePath, req.file.originalname, req.file.mimetype);

    if (!text || text.length < 5) {
      console.log('[upload] Aucun texte exploitable (PDF scanné sans OCR PDF, image sans OCR, ou fichier vide)');
      return res.status(200).json({ parsed: {} });
    }

    const locale = 'fr';
    const parsed = await parse(text, locale);
    res.json({ parsed });
  } catch (e) {
    console.error('parse error:', e);
    res.status(500).json({ error: 'PARSE_FAILED' });
  }
});

module.exports = router;
