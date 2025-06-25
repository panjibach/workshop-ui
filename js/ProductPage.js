// Global variables
let cartCount = 0
let currentCategory = "all"
let currentSort = "newest"
let searchQuery = ""

// DOM elements - with null checks
const cartCountElement = document.getElementById("cart-count")
const searchInput = document.getElementById("searchInput")
const categoryTags = document.querySelectorAll(".category-tag")
const sortSelect = document.getElementById("sortSelect")
const resultsCount = document.getElementById("resultsCount")
const productCards = document.querySelectorAll(".product-card")
const lightbox = document.getElementById("lightbox")
const lightboxImage = document.getElementById("lightboxImage")
const lightboxClose = document.getElementById("lightboxClose")
const emptyState = document.getElementById("emptyState")
const resetFiltersBtn = document.getElementById("resetFilters")
const loadingState = document.getElementById("loadingState")

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  initializeEventListeners()
  initializeAnimations()
  updateCartCount()
  updateResultsCount()
})

// Initialize event listeners with null checks
function initializeEventListeners() {
  // Search functionality
  if (searchInput) {
    searchInput.addEventListener("input", handleSearch)
  }

  // Category filtering
  categoryTags.forEach((tag) => {
    tag.addEventListener("click", () => handleCategoryFilter(tag))
  })

  // Sorting
  if (sortSelect) {
    sortSelect.addEventListener("change", handleSort)
  }

  // Product interactions
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", handleAddToCart)
  })

  document.querySelectorAll(".view-details").forEach((btn) => {
    btn.addEventListener("click", handleViewDetails)
  })

  // Lightbox functionality
  document.querySelectorAll(".product-image").forEach((img) => {
    img.addEventListener("click", handleImageClick)
  })

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox)
  }

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox()
    })
  }

  // Newsletter form - check if exists
  const newsletterForm = document.getElementById("newsletterForm")
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", handleNewsletterSubmit)
  }

  // Footer newsletter form
  const footerNewsletterForm = document.getElementById("newsletter-form-footer")
  if (footerNewsletterForm) {
    footerNewsletterForm.addEventListener("submit", handleNewsletterSubmit)
  }

  // Reset filters
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener("click", resetFilters)
  }

  // Keyboard navigation
  document.addEventListener("keydown", handleKeyboard)
}

// Search functionality
function handleSearch() {
  if (!searchInput) return
  searchQuery = searchInput.value.toLowerCase().trim()
  filterProducts()
}

// Category filtering
function handleCategoryFilter(clickedTag) {
  // Update active category
  categoryTags.forEach((tag) => tag.classList.remove("active"))
  clickedTag.classList.add("active")

  currentCategory = clickedTag.dataset.category
  filterProducts()
}

// Sorting functionality
function handleSort() {
  if (!sortSelect) return
  currentSort = sortSelect.value
  sortProducts()
}

// Filter products based on search and category
function filterProducts() {
  showLoading()

  setTimeout(() => {
    let visibleCount = 0

    productCards.forEach((card) => {
      const cardCategory = card.dataset.category
      const cardTitle = card.querySelector(".product-title")?.textContent.toLowerCase() || ""
      const cardTags = Array.from(card.querySelectorAll(".tag")).map((tag) => tag.textContent.toLowerCase())

      let showCard = true

      // Category filter
      if (currentCategory !== "all" && cardCategory !== currentCategory) {
        showCard = false
      }

      // Search filter
      if (searchQuery) {
        const matchesTitle = cardTitle.includes(searchQuery)
        const matchesTags = cardTags.some((tag) => tag.includes(searchQuery))
        const matchesCategory = cardCategory.includes(searchQuery)

        if (!matchesTitle && !matchesTags && !matchesCategory) {
          showCard = false
        }
      }

      // Show/hide card with animation
      if (showCard) {
        card.style.display = "block"
        setTimeout(() => {
          card.classList.add("visible")
        }, 50)
        visibleCount++
      } else {
        card.classList.remove("visible")
        setTimeout(() => {
          card.style.display = "none"
        }, 300)
      }
    })

    // Show/hide empty state
    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.style.display = "block"
      } else {
        emptyState.style.display = "none"
      }
    }

    // Update category sections visibility
    updateCategorySections()
    updateResultsCount(visibleCount)
    hideLoading()
  }, 500)
}

// Sort products
function sortProducts() {
  const container = document.querySelector(".products-container")
  if (!container) return

  const sections = Array.from(container.querySelectorAll(".category-section"))

  sections.forEach((section) => {
    const grid = section.querySelector(".products-grid")
    if (!grid) return

    const cards = Array.from(grid.querySelectorAll(".product-card"))

    cards.sort((a, b) => {
      switch (currentSort) {
        case "price-low":
          return Number.parseInt(a.dataset.price) - Number.parseInt(b.dataset.price)
        case "price-high":
          return Number.parseInt(b.dataset.price) - Number.parseInt(a.dataset.price)
        case "rating":
          return Number.parseFloat(b.dataset.rating) - Number.parseFloat(a.dataset.rating)
        case "popular":
          return Number.parseInt(b.dataset.popularity) - Number.parseInt(a.dataset.popularity)
        case "newest":
        default:
          return 0 // Keep original order for newest
      }
    })

    // Re-append sorted cards
    cards.forEach((card) => grid.appendChild(card))
  })
}

// Update category sections visibility
function updateCategorySections() {
  const sections = document.querySelectorAll(".category-section")

  sections.forEach((section) => {
    const visibleCards = section.querySelectorAll(
      '.product-card[style*="display: block"], .product-card:not([style*="display: none"])',
    )

    if (currentCategory === "all") {
      section.style.display = visibleCards.length > 0 ? "block" : "none"
    } else {
      const sectionCategory = section.id.replace("-section", "")
      section.style.display = sectionCategory === currentCategory ? "block" : "none"
    }
  })
}

// Add to cart functionality
function handleAddToCart(e) {
  const productName = e.target.dataset.product
  const button = e.target
  const originalText = button.textContent

  // Animation
  button.style.transform = "scale(0.95)"
  button.style.background = "#10B981"
  button.textContent = "Ditambahkan!"
  button.disabled = true

  // Update cart count
  cartCount++
  updateCartCount()

  // Show notification
  showNotification(`${productName} berhasil ditambahkan ke keranjang!`)

  // Reset button
  setTimeout(() => {
    button.style.transform = "scale(1)"
    button.style.background = ""
    button.textContent = originalText
    button.disabled = false
  }, 2000)
}

// View details functionality
function handleViewDetails(e) {
  const productName = e.target.dataset.product
  showNotification(`Menampilkan detail untuk ${productName}`)
  // Here you would typically navigate to a product detail page
}

// Image lightbox functionality
function handleImageClick(e) {
  if (!lightbox || !lightboxImage) return

  const imageData = e.currentTarget.dataset
  lightboxImage.src = imageData.image
  lightboxImage.alt = imageData.title
  lightbox.classList.add("active")
  document.body.style.overflow = "hidden"
}

function closeLightbox() {
  if (!lightbox) return

  lightbox.classList.remove("active")
  document.body.style.overflow = ""
}

// Newsletter subscription
function handleNewsletterSubmit(e) {
  e.preventDefault()
  const email = e.target.querySelector('input[type="email"]')?.value
  if (email) {
    showNotification("Terima kasih! Anda telah berlangganan newsletter kami.")
    e.target.reset()
  }
}

// Reset filters
function resetFilters() {
  if (searchInput) {
    searchInput.value = ""
  }
  searchQuery = ""
  currentCategory = "all"
  currentSort = "newest"

  categoryTags.forEach((tag) => tag.classList.remove("active"))
  if (categoryTags.length > 0) {
    categoryTags[0].classList.add("active") // First tag is "Semua"
  }

  if (sortSelect) {
    sortSelect.value = "newest"
  }

  filterProducts()
}

// Update cart count display
function updateCartCount() {
  if (!cartCountElement) return

  cartCountElement.textContent = cartCount

  if (cartCount > 0) {
    cartCountElement.style.display = "flex"
    cartCountElement.classList.add("pulse")
    setTimeout(() => {
      cartCountElement.classList.remove("pulse")
    }, 1000)
  } else {
    cartCountElement.style.display = "none"
  }
}

// Update results count
function updateResultsCount(count = null) {
  if (!resultsCount) return

  if (count === null) {
    count = document.querySelectorAll(
      '.product-card[style*="display: block"], .product-card:not([style*="display: none"])',
    ).length
  }
  resultsCount.textContent = `Menampilkan ${count} produk`
}

// Show notification
function showNotification(message, type = "success") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification")
  existingNotifications.forEach((notification) => {
    notification.remove()
  })

  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 3000)
}

// Loading states
function showLoading() {
  if (loadingState) {
    loadingState.style.display = "flex"
  }
}

function hideLoading() {
  if (loadingState) {
    loadingState.style.display = "none"
  }
}

// Keyboard navigation
function handleKeyboard(e) {
  if (e.key === "Escape") {
    closeLightbox()
  }
}

// Initialize animations
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
      }
    })
  }, observerOptions)

  // Observe all fade-in elements
  document.querySelectorAll(".fade-in").forEach((element) => {
    observer.observe(element)
  })
}

// Header scroll effect
window.addEventListener("scroll", () => {
  const header = document.querySelector(".main-header")
  if (!header) return

  if (window.scrollY > 100) {
    header.style.background = "rgba(255, 255, 255, 0.98)"
    header.style.boxShadow = "0 4px 20px rgba(15, 23, 42, 0.1)"
  } else {
    header.style.background = "rgba(255, 255, 255, 0.95)"
    header.style.boxShadow = "none"
  }
})

// Performance optimization: Lazy loading for images
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        if (img.dataset.src) {
          img.src = img.dataset.src
        }
        img.classList.remove("lazy")
        imageObserver.unobserve(img)
      }
    })
  })

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img)
  })
}

// Error handling for images
document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("error", function () {
    this.alt = "Image not available"
    // Optionally set a placeholder image
    // this.src = 'path/to/placeholder.jpg';
  })
})
