/**
 * ================================================================
 * ADMIN IMAGE GALLERY UTILITY
 * ================================================================
 * List and manage available menu item images from the filesystem
 */

(function () {
  "use strict";

  window.ImageGalleryManager = window.ImageGalleryManager || {};

  // Available images by category from filesystem
  const AVAILABLE_IMAGES = {
    breakfast: [
      { name: 'Firfir', path: 'assets/images/food/breakfast/firfir.jpeg' },
      { name: 'Omelette (Enkulal Sils)', path: 'assets/images/food/breakfast/omelett(Enkulal sils).jpeg' },
      { name: 'Pasta with Bread', path: 'assets/images/food/breakfast/pasta-with-bread.jpg' },
      { name: 'Pasta with Injera', path: 'assets/images/food/breakfast/pasta-with-injera.jpg' },
      { name: 'Scrambled Eggs', path: 'assets/images/food/breakfast/scrambled-egg.jpeg' }
    ],
    'main-meals': [
      { name: 'Cabbage with Meat', path: 'assets/images/food/main-meals/cabbage-with-meat.jpeg' },
      { name: 'Cheese with Butter', path: 'assets/images/food/main-meals/cheese-with-butter.jpeg' },
      { name: 'Egg with Meat', path: 'assets/images/food/main-meals/egg-with-meat.jpg' },
      { name: 'Grilled Meat', path: 'assets/images/food/main-meals/grilled-meat.jpeg' },
      { name: 'Pasta with Vegetables', path: 'assets/images/food/main-meals/pasta-with-vegetables.jpeg' },
      { name: 'Red Stew', path: 'assets/images/food/main-meals/red-stew.jpeg' },
      { name: 'Shiro Feses', path: 'assets/images/food/main-meals/shiro-feses.jpg' },
      { name: 'Tomato Sauce', path: 'assets/images/food/main-meals/tomato-sauce.jpeg' },
      { name: 'Vegetables with Meat', path: 'assets/images/food/main-meals/vegetables-with-meat.jpeg' }
    ],
    fasting: [
      { name: 'Ful with Bread (Fasting)', path: 'assets/images/food/fasting/ful with Bread (Fasting).jpg' },
      { name: 'Ful with Bread', path: 'assets/images/food/fasting/ful-with-bread.jpg' },
      { name: 'Lentil Stew', path: 'assets/images/food/fasting/lentil-stew.jpeg' },
      { name: 'Mixed Fasting', path: 'assets/images/food/fasting/mixed-fasting(yetsom Beyaynet).jpeg' }
    ],
    beverages: [
      { name: 'Juice', path: 'assets/images/food/beverages/juice.jpeg' },
      { name: 'Soft Drink', path: 'assets/images/food/beverages/soft-drink.jpeg' },
      { name: 'Water', path: 'assets/images/food/beverages/water.jpeg' }
    ],
    snacks: [
      { name: 'Avocado with Injera', path: 'assets/images/food/snacks/Avocado with injera.jpg' },
      { name: 'Meat Sandwich', path: 'assets/images/food/snacks/meat-sandwich.jpg' }
    ]
  };

  /**
   * Get all images for a category
   */
  function getImagesByCategory(category) {
    return AVAILABLE_IMAGES[category] || [];
  }

  /**
   * Get all available categories with image count
   */
  function getCategories() {
    return Object.keys(AVAILABLE_IMAGES).map(category => ({
      id: category,
      name: category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' '),
      count: AVAILABLE_IMAGES[category].length
    }));
  }

  /**
   * Get image by path
   */
  function getImageByPath(path) {
    for (const category in AVAILABLE_IMAGES) {
      const image = AVAILABLE_IMAGES[category].find(img => img.path === path);
      if (image) return { ...image, category };
    }
    return null;
  }

  /**
   * Create image gallery modal HTML
   */
  function createGalleryHTML() {
    const categories = getCategories();
    let html = `
      <div class="gallery-container">
        <div class="gallery-tabs">
          ${categories.map(cat => `
            <button class="gallery-tab" data-category="${cat.id}">
              <span>${cat.name}</span>
              <span class="tab-badge">${cat.count}</span>
            </button>
          `).join('')}
        </div>
        
        <div class="gallery-grid" id="galleryGrid">
          <!-- Images will be loaded here -->
        </div>
      </div>
    `;
    return html;
  }

  /**
   * Render images for a category
   */
  function renderGalleryImages(category) {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    const images = getImagesByCategory(category);
    
    if (images.length === 0) {
      grid.innerHTML = '<p class="gallery-empty">No images available for this category</p>';
      return;
    }

    grid.innerHTML = images.map((image, index) => `
      <div class="gallery-item" data-path="${image.path}" data-name="${image.name}">
        <div class="gallery-item-image">
          <img src="${image.path}" alt="${image.name}" loading="lazy">
          <div class="gallery-item-overlay">
            <button class="btn-select-image" data-path="${image.path}">
              <i class="fa-solid fa-check"></i> Select
            </button>
          </div>
        </div>
        <div class="gallery-item-name">${image.name}</div>
      </div>
    `).join('');

    // Bind click handlers
    const selectBtns = grid.querySelectorAll('.btn-select-image');
    selectBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const path = btn.getAttribute('data-path');
        selectImage(path);
      });
    });
  }

  /**
   * Select an image
   */
  function selectImage(imagePath) {
    const preview = document.getElementById('itemImagePreview');
    const urlInput = document.getElementById('itemImageUrl');
    const fileInput = document.getElementById('itemImageFile');
    const previewRow = document.getElementById('imagePreviewRow');

    if (preview && urlInput && fileInput) {
      preview.src = imagePath;
      urlInput.value = imagePath;
      fileInput.value = '';
      if (previewRow) previewRow.style.display = 'flex';
    }

    // Close gallery modal
    closeGalleryModal();

    // Show toast notification
    if (window.AdminToast) {
      window.AdminToast.success('Image selected: ' + imagePath.split('/').pop());
    }
  }

  /**
   * Open image gallery modal
   */
  function openGalleryModal() {
    let modal = document.getElementById('imageGalleryModal');
    
    if (!modal) {
      // Create modal if it doesn't exist
      modal = document.createElement('div');
      modal.id = 'imageGalleryModal';
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal">
          <div class="modal-header">
            <h3>Select Image from Gallery</h3>
            <button class="modal-close" id="closeGalleryBtn">&times;</button>
          </div>
          <div class="modal-body">
            ${createGalleryHTML()}
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      // Bind close button
      document.getElementById('closeGalleryBtn').addEventListener('click', closeGalleryModal);
      
      // Bind tab clicks
      const tabs = modal.querySelectorAll('.gallery-tab');
      tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
          e.preventDefault();
          const category = tab.getAttribute('data-category');
          
          // Update active tab
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          
          // Render images
          renderGalleryImages(category);
        });
      });

      // Load first category
      if (tabs.length > 0) {
        tabs[0].click();
      }
    }

    modal.classList.add('open');
  }

  /**
   * Close image gallery modal
   */
  function closeGalleryModal() {
    const modal = document.getElementById('imageGalleryModal');
    if (modal) {
      modal.classList.remove('open');
    }
  }

  /**
   * Add gallery button to menu form
   */
  function addGalleryButton() {
    const urlInputGroup = document.querySelector('label[for="itemImageUrl"]')?.parentElement;
    
    if (urlInputGroup && !document.getElementById('openGalleryBtn')) {
      const btn = document.createElement('button');
      btn.id = 'openGalleryBtn';
      btn.type = 'button';
      btn.className = 'btn btn-secondary btn-gallery';
      btn.innerHTML = '<i class="fa-solid fa-image"></i> Browse Gallery';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openGalleryModal();
      });
      
      urlInputGroup.parentElement.appendChild(btn);
    }
  }

  /**
   * Initialize gallery
   */
  function initialize() {
    // Add gallery button when form is ready
    setTimeout(() => {
      addGalleryButton();
    }, 500);
  }

  // Public API
  window.ImageGalleryManager.getImagesByCategory = getImagesByCategory;
  window.ImageGalleryManager.getCategories = getCategories;
  window.ImageGalleryManager.selectImage = selectImage;
  window.ImageGalleryManager.openGalleryModal = openGalleryModal;
  window.ImageGalleryManager.closeGalleryModal = closeGalleryModal;
  window.ImageGalleryManager.initialize = initialize;

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();
