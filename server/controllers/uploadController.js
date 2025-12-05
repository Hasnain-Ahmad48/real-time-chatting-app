import { uploadToCloudinary } from '../config/cloudinary.js';

/**
 * @desc    Upload image to Cloudinary
 * @route   POST /api/upload/image
 * @access  Private
 */
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.',
      });
    }

    // Upload buffer to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer);

    if (!result || !result.secure_url) {
      return res.status(500).json({
        success: false,
        message: 'Failed to upload image to Cloudinary',
      });
    }

    res.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload image. Please check your Cloudinary configuration.',
    });
  }
};

