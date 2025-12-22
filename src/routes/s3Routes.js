const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { 
  generatePresignedUrl, 
  uploadFile, 
  listFiles, 
  deleteFile 
} = require('../config/aws');
const multer = require('multer');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Generate pre-signed URL for frontend upload
router.post('/generate-presigned-url', authMiddleware, async (req, res) => {
  try {
    const { fileName, fileType } = req.body;
    
    if (!fileName || !fileType) {
      return res.status(400).json({ 
        error: 'File name and type are required' 
      });
    }

    const { uploadUrl, fileUrl } = await generatePresignedUrl(fileName, fileType);
    
    res.json({
      success: true,
      uploadUrl,
      fileUrl
    });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    res.status(500).json({ 
      error: 'Failed to generate upload URL' 
    });
  }
});

// Upload file via server (for small files)
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No file provided' 
      });
    }

    const result = await uploadFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    res.json({
      success: true,
      fileUrl: result.Location,
      fileKey: result.Key
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ 
      error: 'Failed to upload file' 
    });
  }
});

// List uploaded files (admin only)
router.get('/files', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const data = await listFiles();
    
    const files = data.Contents.map(item => ({
      key: item.Key,
      url: `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${item.Key}`,
      size: item.Size,
      lastModified: item.LastModified
    }));

    res.json({
      success: true,
      files
    });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ 
      error: 'Failed to list files' 
    });
  }
});

// Delete file (admin only)
router.delete('/file/:key', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { key } = req.params;
    
    await deleteFile(key);
    
    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ 
      error: 'Failed to delete file' 
    });
  }
});

module.exports = router;