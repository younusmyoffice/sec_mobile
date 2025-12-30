/**
 * Standardized Image Handling Utility
 * 
 * SUPPORTED IMAGE FORMATS:
 * 1. Base64 Data URI (API format): "data:image/jpeg;base64,..." - Works in DEV & PRODUCTION
 * 2. Base64 Data URI (PNG/GIF): "data:image/png;base64,..." - Works in DEV & PRODUCTION  
 * 3. Raw Base64 Data: "iVBORw0KGgoAAAANSUhEUg..." - Auto-converted to data URI
 * 4. S3 Bucket URLs: "https://bucket.s3.amazonaws.com/..." - Production URLs
 * 5. Static Fallbacks: require('../assets/images/CardDoctor1.png') - Local assets
 * 
 * NOTE: Base64 images from APIs work perfectly in both development and production environments.
 * React Native's Image component handles data URIs natively across all platforms.
 */

/**
 * Get image source for React Native Image component
 * @param {string|null|undefined} imageData - Image data from API (Base64, S3 URL, or null)
 * @param {string} fallbackImage - Static image path for fallback (optional)
 * @returns {object} Image source object for React Native Image component
 */
export const getImageSource = (imageData, fallbackImage = null) => {
  console.log('🖼️ Processing image:', imageData ? 'present' : 'missing');
  
  // If no image data provided, use fallback
  if (!imageData) {
    console.log('🖼️ No image data, using fallback');
    return fallbackImage || require('../assets/images/CardDoctor1.png');
  }
  
  // SECURITY: Ensure imageData is a string before calling string methods
  // Handle case where imageData might be a number (require() result) or object
  if (typeof imageData !== 'string') {
    console.log('🖼️ Image data is not a string, using fallback');
    return fallbackImage || require('../assets/images/CardDoctor1.png');
  }
  
  // Check if it's a base64 image with data URI format (API format - works in both dev and production)
  if (imageData.startsWith('data:image/jpeg;base64,')) {
    console.log('🖼️ JPEG base64 data URI detected (API format - dev & production)');
    return { uri: imageData };
  }
  
  // Check if it's any other base64 image format (PNG, GIF, etc.)
  if (imageData.startsWith('data:image/')) {
    console.log('🖼️ Base64 image detected (other format - dev & production)');
    return { uri: imageData };
  }
  
  // Check if it's a regular URL (S3 bucket or other HTTP URLs)
  if (imageData.startsWith('http')) {
    console.log('🖼️ HTTP URL detected (S3 bucket or other)');
    return { uri: imageData };
  }
  
  // Check if it's just base64 data without data:image prefix
  if (imageData.length > 100 && !imageData.includes(' ') && !imageData.includes('http')) {
    console.log('🖼️ Raw base64 data detected, adding data URI prefix (dev & production)');
    return { uri: `data:image/jpeg;base64,${imageData}` };
  }
  
  console.log('🖼️ Unknown format, using fallback image');
  console.log('🖼️ Format details:', {
    length: imageData.length,
    startsWithData: imageData.startsWith('data:'),
    startsWithHttp: imageData.startsWith('http'),
    hasSpaces: imageData.includes(' ')
  });
  
  return fallbackImage || require('../assets/images/CardDoctor1.png');
};

/**
 * Get default image source for empty states
 * @returns {object} Default image source
 */
export const getDefaultImageSource = () => {
  return require('../assets/images/CardDoctor1.png');
};

/**
 * Get profile image source with proper fallback
 * Handles Base64 images (API format) and S3 URLs in both dev and production
 * @param {string|null|undefined} profilePicture - Profile picture from API
 * @returns {object} Profile image source
 */
export const getProfileImageSource = (profilePicture) => {
  return getImageSource(profilePicture, require('../assets/images/CardDoctor1.png'));
};

/**
 * Get empty state image source
 * @returns {object} Empty state image source
 */
export const getEmptyStateImageSource = () => {
  return require('../assets/images/CardDoctor1.png');
};

/**
 * Image error handler for React Native Image component
 * @param {object} error - Error object from onError
 * @param {function} setImageError - State setter for image error
 * @param {object} fallbackSource - Fallback image source
 */
export const handleImageError = (error, setImageError, fallbackSource = null) => {
  console.log('🖼️ Image failed to load:', error.nativeEvent.error);
  console.log('🖼️ Attempted source:', error.nativeEvent.source);
  
  if (setImageError) {
    setImageError(true);
  }
  
  return fallbackSource || getDefaultImageSource();
};

/**
 * Image load success handler
 * @param {object} event - Load event from onLoad
 */
export const handleImageLoad = (event) => {
  console.log('🖼️ Image loaded successfully');
  console.log('🖼️ Image dimensions:', {
    width: event.nativeEvent.source.width,
    height: event.nativeEvent.source.height
  });
};
