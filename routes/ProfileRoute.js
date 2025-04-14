import express from "express";
import multer from "multer";
import fs from "fs";
import User from "../models/signModel.js"; 

const router = express.Router();

const uploadDir = './uploadProfile';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploadProfile/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// Ֆայլի upload ռաութ
router.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imageUrl = `${req.protocol}://${req.get('host')}/uploadProfile/${req.file.filename}`;

  const { userId } = req.body;
  
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.avatarImg = imageUrl;

    await user.save();

    res.json({ url: imageUrl, message: 'Avatar updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
