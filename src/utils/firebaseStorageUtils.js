import { getStorage, ref, deleteObject } from 'firebase/storage';

/**
 * Utility function to delete images from Firebase Storage
 * @param {string[]} imageUrls - Array of Firebase Storage URLs to delete
 * @returns {Promise<void>}
 */
export const deleteImagesFromStorage = async (imageUrls) => {
    if (!imageUrls || imageUrls.length === 0) return;

    const storage = getStorage();
    const deletePromises = imageUrls.map(async (imageUrl) => {
        try {
            if (!imageUrl || typeof imageUrl !== 'string') return;

            // Extract the path from the Firebase Storage URL
            const url = new URL(imageUrl);
            const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
            
            if (pathMatch) {
                const imagePath = decodeURIComponent(pathMatch[1]);
                const imageRef = ref(storage, imagePath);
                await deleteObject(imageRef);
                console.log('Successfully deleted image:', imagePath);
            }
        } catch (error) {
            console.warn('Failed to delete image:', imageUrl, error);
            // Don't throw error, just log it as some images might not exist
        }
    });

    await Promise.allSettled(deletePromises);
};

/**
 * Utility function to extract Firebase Storage path from URL
 * @param {string} imageUrl - Firebase Storage URL
 * @returns {string|null} - Storage path or null if invalid
 */
export const extractStoragePath = (imageUrl) => {
    try {
        if (!imageUrl || typeof imageUrl !== 'string') return null;
        
        const url = new URL(imageUrl);
        const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
        
        return pathMatch ? decodeURIComponent(pathMatch[1]) : null;
    } catch (error) {
        console.warn('Failed to extract storage path from URL:', imageUrl, error);
        return null;
    }
};

/**
 * Utility function to delete a single image from Firebase Storage
 * @param {string} imageUrl - Firebase Storage URL to delete
 * @returns {Promise<boolean>} - Success status
 */
export const deleteImageFromStorage = async (imageUrl) => {
    try {
        if (!imageUrl || typeof imageUrl !== 'string') return false;

        const storage = getStorage();
        const storagePath = extractStoragePath(imageUrl);
        
        if (storagePath) {
            const imageRef = ref(storage, storagePath);
            await deleteObject(imageRef);
            console.log('Successfully deleted image:', storagePath);
            return true;
        }
        
        return false;
    } catch (error) {
        console.warn('Failed to delete image:', imageUrl, error);
        return false;
    }
};

/**
 * Utility function to compare image arrays and find deleted images
 * @param {string[]} oldImages - Previous image URLs
 * @param {string[]} newImages - New image URLs
 * @returns {string[]} - Array of deleted image URLs
 */
export const findDeletedImages = (oldImages = [], newImages = []) => {
    const oldSet = new Set(oldImages.filter(img => img && typeof img === 'string'));
    const newSet = new Set(newImages.filter(img => img && typeof img === 'string'));
    
    return Array.from(oldSet).filter(img => !newSet.has(img));
};

/**
 * Utility function to clean up images when updating an ad
 * @param {Object} options - Configuration object
 * @param {string[]} options.oldImages - Previous image URLs
 * @param {string[]} options.newImages - New image URLs
 * @param {string} options.oldReceiptImage - Previous receipt image URL
 * @param {string} options.newReceiptImage - New receipt image URL
 * @returns {Promise<void>}
 */
export const cleanupAdImages = async ({ 
    oldImages = [], 
    newImages = [], 
    oldReceiptImage = null, 
    newReceiptImage = null 
}) => {
    const imagesToDelete = [];

    // Find deleted property images
    const deletedImages = findDeletedImages(oldImages, newImages);
    imagesToDelete.push(...deletedImages);

    // Check if receipt image was deleted or replaced
    if (oldReceiptImage && oldReceiptImage !== newReceiptImage) {
        imagesToDelete.push(oldReceiptImage);
    }

    // Delete all identified images
    if (imagesToDelete.length > 0) {
        console.log('Cleaning up images:', imagesToDelete);
        await deleteImagesFromStorage(imagesToDelete);
    }
};

export default {
    deleteImagesFromStorage,
    deleteImageFromStorage,
    extractStoragePath,
    findDeletedImages,
    cleanupAdImages
};