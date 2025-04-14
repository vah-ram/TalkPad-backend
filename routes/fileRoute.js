import express from 'express';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();

// Ստուգում ենք՝ գոյություն ունի՞ uploads պանակը
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer-ի պահեստավորման կոնֆիգ
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// Ֆայլի upload ռաութ
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Այստեղ ենք կառուցում նկարի URL-ն
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

export default router;
