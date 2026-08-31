/**
 * ================================================================
 * IMAGE UPLOAD HANDLER - ADMIN PANEL
 * ================================================================
 * Manages image selection, validation, preview, and upload
 * for menu item administration.
 */

(function () {
  "use strict";

  window.ImageUploadManager = window.ImageUploadManager || {};

  // Configuration
  const config = {
    maxSize: 2 * 1024 * 1024, // 2 MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    uploadEndpoint: '/api/admin/menu/upload-image',
    deleteEndpoint: '/api/admin/menu/delete-image'
  };

  // State
  let uploadState = {
    isUploading: false,
    currentFile: null,
    currentUrl: null,
    uploadProgress: 0
  };

  /**
   * Show loading state during upload
   */
  function showUploadProgress(progress) {
    const fileInput = document.getElementById('itemImageFile');
    const urlInput = document.getElementById('itemImageUrl');
    const previewRow = document.getElementById('imagePreviewRow');
    const preview = document.getElementById('itemImagePreview');

    if (!previewRow) return;

    // Add loading indicator
    let loader = previewRow.querySelector('.upload-loader');
    if (!loader) {
      loader = document.createElement('div');
      loader.className = 'upload-loader';
      loader.innerHTML = `
        <div class="spinner"></div>
        <div class="upload-status">Uploading... ${progress}%</div>
      `;
      previewRow.appendChild(loader);
    } else {
      loader.querySelector('.upload-status').textContent = `Uploading... ${progress}%`;
    }

    // Disable inputs during upload
    if (fileInput) fileInput.disabled = true;
    if (urlInput) urlInput.disabled = true;
  }

  /**
   * Hide loading state
   */
  function hideUploadProgress() {
    const fileInput = document.getElementById('itemImageFile');
    const urlInput = document.getElementById('itemImageUrl');
    const previewRow = document.getElementById('imagePreviewRow');

    if (previewRow) {
      const loader = previewRow.querySelector('.upload-loader');
      if (loader) loader.remove();
    }

    if (fileInput) fileInput.disabled = false;
    if (urlInput) urlInput.disabled = false;
  }

  /**
   * Validate file before upload
   */
  function validateFile(file) {
    if (!file) {
      return { valid: false, error: 'No file selected' };
    }

    if (!config.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Allowed: JPG, PNG, WEBP'
      };
    }

    if (file.size > config.maxSize) {
      return {
        valid: false,
        error: 'File is too large. Maximum size: 2 MB'
      };
    }

    return { valid: true };
  }

  /**
   * Show image preview
   */
  function showImagePreview(file) {
    const preview = document.getElementById('itemImagePreview');
    const previewRow = document.getElementById('imagePreviewRow');

    if (!preview || !previewRow) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      previewRow.style.display = 'flex';
    };
    reader.readAsDataURL(file);
  }

  /**
   * Upload file to server
   */
  async function uploadFile(file) {
    try {
      uploadState.isUploading = true;
      showUploadProgress(0);

      const formData = new FormData();
      formData.append('image', file);

      // Get auth token
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            uploadState.uploadProgress = progress;
            showUploadProgress(progress);
          }
        });

        xhr.addEventListener('load', () => {
          uploadState.isUploading = false;
          hideUploadProgress();

          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              uploadState.currentUrl = response.url;
              resolve(response);
            } else {
              reject(new Error(response.error || 'Upload failed'));
            }
          } else {
            const response = JSON.parse(xhr.responseText);
            reject(new Error(response.error || 'Upload failed'));
          }
        });

        xhr.addEventListener('error', () => {
          uploadState.isUploading = false;
          hideUploadProgress();
          reject(new Error('Network error during upload'));
        });

        xhr.addEventListener('abort', () => {
          uploadState.isUploading = false;
          hideUploadProgress();
          reject(new Error('Upload cancelled'));
        });

        xhr.open('POST', config.uploadEndpoint);
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
        xhr.send(formData);
      });
    } catch (error) {
      uploadState.isUploading = false;
      hideUploadProgress();
      throw error;
    }
  }

  /**
   * Delete image from server
   */
  async function deleteImage(imageUrl) {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');

      const response = await fetch(config.deleteEndpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ imageUrl })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete image');
      }

      return data;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  /**
   * Clear upload state
   */
  function clearUploadState() {
    uploadState = {
      isUploading: false,
      currentFile: null,
      currentUrl: null,
      uploadProgress: 0
    };
  }

  /**
   * Handle file input change
   */
  async function handleFileInputChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      if (window.AdminToast) {
        window.AdminToast.error(validation.error);
      }
      event.target.value = '';
      return;
    }

    // Show preview
    showImagePreview(file);

    // Clear URL input
    const urlInput = document.getElementById('itemImageUrl');
    if (urlInput) urlInput.value = '';

    // Store file for later upload
    uploadState.currentFile = file;
  }

  /**
   * Handle URL input change
   */
  function handleUrlInputChange(event) {
    const url = event.target.value.trim();
    const fileInput = document.getElementById('itemImageFile');

    if (url) {
      // Clear file input
      if (fileInput) fileInput.value = '';
      uploadState.currentFile = null;

      // Show preview
      const preview = document.getElementById('itemImagePreview');
      const previewRow = document.getElementById('imagePreviewRow');

      if (preview && previewRow) {
        preview.src = url;
        previewRow.style.display = 'flex';
      }

      uploadState.currentUrl = url;
    } else {
      uploadState.currentUrl = null;
    }
  }

  /**
   * Handle remove image button
   */
  function handleRemoveImage() {
    const fileInput = document.getElementById('itemImageFile');
    const urlInput = document.getElementById('itemImageUrl');
    const previewRow = document.getElementById('imagePreviewRow');

    if (fileInput) fileInput.value = '';
    if (urlInput) urlInput.value = '';
    if (previewRow) previewRow.style.display = 'none';

    clearUploadState();
  }

  /**
   * Get image URL for form submission
   * Returns the image URL to submit with the form
   */
  async function getImageUrlForSubmit() {
    if (uploadState.currentFile) {
      // Upload file if not already uploaded
      try {
        const result = await uploadFile(uploadState.currentFile);
        return result.url;
      } catch (error) {
        console.error('Error uploading image:', error);
        if (window.AdminToast) {
          window.AdminToast.error(error.message || 'Failed to upload image');
        }
        throw error;
      }
    } else if (uploadState.currentUrl) {
      // Return URL from input
      return uploadState.currentUrl;
    }
    return null;
  }

  /**
   * Initialize event listeners
   */
  function initializeEventListeners() {
    const fileInput = document.getElementById('itemImageFile');
    const urlInput = document.getElementById('itemImageUrl');
    const removeBtn = document.getElementById('removeImageBtn');

    if (fileInput) {
      fileInput.addEventListener('change', handleFileInputChange);
    }

    if (urlInput) {
      urlInput.addEventListener('input', handleUrlInputChange);
    }

    if (removeBtn) {
      removeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleRemoveImage();
      });
    }
  }

  /**
   * Initialize on DOM ready
   */
  function initialize() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeEventListeners);
    } else {
      initializeEventListeners();
    }
  }

  // Public API
  window.ImageUploadManager.handleFileInputChange = handleFileInputChange;
  window.ImageUploadManager.handleUrlInputChange = handleUrlInputChange;
  window.ImageUploadManager.handleRemoveImage = handleRemoveImage;
  window.ImageUploadManager.getImageUrlForSubmit = getImageUrlForSubmit;
  window.ImageUploadManager.uploadFile = uploadFile;
  window.ImageUploadManager.deleteImage = deleteImage;
  window.ImageUploadManager.validateFile = validateFile;
  window.ImageUploadManager.clearUploadState = clearUploadState;
  window.ImageUploadManager.initialize = initialize;

  // Auto-initialize
  initialize();
})();
