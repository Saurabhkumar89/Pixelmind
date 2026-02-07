const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image buffer to Cloudinary
 */
async function uploadImage(buffer, filename, folder = 'pixelmind/edits') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        public_id: filename.replace(/\.[^/.]+$/, ''), // Remove extension
      },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary] Upload error:', error);
          reject(error);
        } else {
          console.log('[Cloudinary] Upload successful:', result.secure_url);
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

/**
 * Upload from URL
 */
async function uploadFromUrl(imageUrl, filename, folder = 'pixelmind/edits') {
  try {
    console.log('[Cloudinary] Uploading from URL:', imageUrl);
    
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder,
      resource_type: 'auto',
      public_id: filename.replace(/\.[^/.]+$/, ''),
    });

    return result;
  } catch (error) {
    console.error('[Cloudinary] Upload from URL error:', error);
    throw error;
  }
}

/**
 * Generate thumbnail
 */
function getThumbnailUrl(publicId, width = 300, height = 300) {
  return cloudinary.url(publicId, {
    crop: 'fill',
    gravity: 'auto',
    width,
    height,
  });
}

/**
 * Generate optimized URL for different sizes
 */
function getOptimizedUrl(publicId, width, quality = 'auto', format = 'auto') {
  return cloudinary.url(publicId, {
    width,
    quality,
    fetch_format: format,
    crop: 'fill',
    gravity: 'auto',
  });
}

/**
 * Delete image
 */
async function deleteImage(publicId) {
  try {
    console.log('[Cloudinary] Deleting image:', publicId);
    
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('[Cloudinary] Delete error:', error);
    throw error;
  }
}

module.exports = {
  uploadImage,
  uploadFromUrl,
  getThumbnailUrl,
  getOptimizedUrl,
  deleteImage,
};
