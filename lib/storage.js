/**
 * Image Storage Module
 * Handles image uploads, previews, and deletions
 * Supports multiple providers: Cloudinary, AWS S3, Vercel Blob
 */

const cloudinary = require('cloudinary').v2;
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Storage provider selection
const STORAGE_PROVIDER = process.env.STORAGE_PROVIDER || 'cloudinary'; // cloudinary | s3 | local

// ===== CLOUDINARY STORAGE =====

const cloudinaryStorage = {
  /**
   * Upload image to Cloudinary
   */
  upload: async (filePath, folder = 'pixelmind') => {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto',
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
        size: result.bytes,
        format: result.format,
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image');
    }
  },

  /**
   * Delete image from Cloudinary
   */
  delete: async (publicId) => {
    try {
      await cloudinary.uploader.destroy(publicId);
      return true;
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new Error('Failed to delete image');
    }
  },

  /**
   * Get optimized preview URL
   */
  getPreviewUrl: (publicId, width = 300, height = 300) => {
    return cloudinary.url(publicId, {
      width,
      height,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto',
    });
  },

  /**
   * Get thumbnail URL
   */
  getThumbnailUrl: (publicId) => {
    return cloudinary.url(publicId, {
      width: 150,
      height: 150,
      crop: 'thumb',
      gravity: 'face',
      quality: 'auto',
    });
  },

  /**
   * Transform image (resize, format, etc.)
   */
  transform: (publicId, options = {}) => {
    const defaults = {
      quality: 'auto',
      fetch_format: 'auto',
      flags: 'progressive',
    };
    return cloudinary.url(publicId, { ...defaults, ...options });
  },
};

// ===== AWS S3 STORAGE =====

const s3Storage = {
  /**
   * Upload image to S3
   */
  upload: async (filePath, folder = 'pixelmind') => {
    try {
      const fileContent = fs.readFileSync(filePath);
      const fileName = `${folder}/${Date.now()}-${path.basename(filePath)}`;

      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName,
        Body: fileContent,
        ContentType: 'image/jpeg',
        ACL: 'public-read',
      };

      const result = await s3.upload(params).promise();

      return {
        url: result.Location,
        key: result.Key,
        size: fileContent.length,
      };
    } catch (error) {
      console.error('S3 upload error:', error);
      throw new Error('Failed to upload image');
    }
  },

  /**
   * Delete image from S3
   */
  delete: async (key) => {
    try {
      await s3.deleteObject({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
      }).promise();
      return true;
    } catch (error) {
      console.error('S3 delete error:', error);
      throw new Error('Failed to delete image');
    }
  },

  /**
   * Get preview URL (S3 doesn't transform, return original)
   */
  getPreviewUrl: (url) => url,

  /**
   * Get thumbnail URL (would need CloudFront or custom processing)
   */
  getThumbnailUrl: (url) => url,
};

// ===== LOCAL STORAGE =====

const localStorage = {
  /**
   * Save image locally
   */
  upload: async (filePath, folder = 'pixelmind') => {
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${path.basename(filePath)}`;
      const destPath = path.join(uploadDir, fileName);
      
      fs.copyFileSync(filePath, destPath);

      const stats = fs.statSync(destPath);

      return {
        url: `/uploads/${folder}/${fileName}`,
        path: destPath,
        size: stats.size,
      };
    } catch (error) {
      console.error('Local storage upload error:', error);
      throw new Error('Failed to upload image');
    }
  },

  /**
   * Delete local image
   */
  delete: async (filePath) => {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return true;
    } catch (error) {
      console.error('Local storage delete error:', error);
      throw new Error('Failed to delete image');
    }
  },

  getPreviewUrl: (url) => url,
  getThumbnailUrl: (url) => url,
};

// ===== STORAGE FACTORY =====

const getStorageProvider = () => {
  switch (STORAGE_PROVIDER) {
    case 's3':
      return s3Storage;
    case 'local':
      return localStorage;
    case 'cloudinary':
    default:
      return cloudinaryStorage;
  }
};

// ===== PUBLIC API =====

const storage = {
  /**
   * Upload file and return storage object
   */
  upload: async (filePath, folder = 'pixelmind') => {
    const provider = getStorageProvider();
    return provider.upload(filePath, folder);
  },

  /**
   * Delete stored file
   */
  delete: async (fileId) => {
    const provider = getStorageProvider();
    return provider.delete(fileId);
  },

  /**
   * Get optimized preview URL
   */
  getPreviewUrl: (fileId, options = {}) => {
    const provider = getStorageProvider();
    
    if (provider === cloudinaryStorage) {
      return cloudinaryStorage.getPreviewUrl(
        fileId,
        options.width || 300,
        options.height || 300
      );
    }
    return provider.getPreviewUrl(fileId);
  },

  /**
   * Get thumbnail URL
   */
  getThumbnailUrl: (fileId) => {
    const provider = getStorageProvider();
    return provider.getThumbnailUrl(fileId);
  },

  /**
   * Upload from URL (for external images)
   */
  uploadFromUrl: async (imageUrl, folder = 'pixelmind') => {
    try {
      if (STORAGE_PROVIDER === 'cloudinary') {
        const result = await cloudinary.uploader.upload(imageUrl, {
          folder,
          resource_type: 'auto',
          quality: 'auto',
          fetch_format: 'auto',
        });

        return {
          url: result.secure_url,
          publicId: result.public_id,
        };
      }

      // For other providers, you would download the image first
      console.warn('uploadFromUrl only supports Cloudinary');
      return null;
    } catch (error) {
      console.error('Upload from URL error:', error);
      throw new Error('Failed to upload image from URL');
    }
  },

  /**
   * Batch delete files
   */
  batchDelete: async (fileIds) => {
    const provider = getStorageProvider();
    
    if (provider === cloudinaryStorage) {
      try {
        await cloudinary.api.delete_resources(fileIds);
        return true;
      } catch (error) {
        console.error('Batch delete error:', error);
        throw new Error('Failed to delete images');
      }
    }

    // For other providers, delete one by one
    for (const fileId of fileIds) {
      await provider.delete(fileId);
    }
    return true;
  },

  /**
   * Generate signed URL (for private images)
   */
  getSignedUrl: async (fileId, expiresIn = 3600) => {
    if (STORAGE_PROVIDER === 's3') {
      try {
        const url = s3.getSignedUrl('getObject', {
          Bucket: process.env.AWS_S3_BUCKET,
          Key: fileId,
          Expires: expiresIn,
        });
        return url;
      } catch (error) {
        console.error('Signed URL error:', error);
        throw new Error('Failed to generate signed URL');
      }
    }

    // Cloudinary doesn't need signed URLs for public resources
    return fileId;
  },

  /**
   * Get storage stats (size used, file count, etc.)
   */
  getStats: async () => {
    if (STORAGE_PROVIDER === 'cloudinary') {
      try {
        const usage = await cloudinary.api.usage();
        return {
          storageUsed: usage.resources.usage[0],
          storageLimit: usage.resources.quota,
          transformations: usage.transformations,
        };
      } catch (error) {
        console.error('Stats error:', error);
        return null;
      }
    }

    return null;
  },
};

module.exports = storage;
