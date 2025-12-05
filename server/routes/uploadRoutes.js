import express from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/image', upload.single('image'), uploadImage);

export default router;

