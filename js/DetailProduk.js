// Product data
const currentProduct = {
  id: 1,
  name: "Lemari Pakaian Multifungsi",
  price: 6500000,
  originalPrice: 7200000,
  selectedColor: "natural",
  selectedSize: "standard",
  quantity: 1,
  inWishlist: false,
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  initializeAnimations()
})

// Change main image
function changeMainImage(thumbnail, imageSrc) {
  // Remove active class from all thumbnails
  document.querySelectorAll(".thumbnail").forEach((thumb) => {
    thumb.classList.remove("active")
  })

  // Add active class to clicked thumbnail
  thumbnail.classList.add("active")

  // Change main image
  const mainImage = document.getElementById("mainImage")
  mainImage.style.opacity = "0"

  setTimeout(() => {
    mainImage.src = imageSrc
    mainImage.style.opacity = "1"
  }, 150)
}

// Select color option
function selectColor(colorOption) {
  document.querySelectorAll(".color-option").forEach((option) => {
    option.classList.remove("active")
  })
  colorOption.classList.add("active")
  currentProduct.selectedColor = colorOption.dataset.color

  showNotification(`Warna ${colorOption.dataset.color} dipilih`)
}

// Select size option
function selectSize(sizeOption) {
  document.querySelectorAll(".size-option").forEach((option) => {
    option.classList.remove("active")
  })
  sizeOption.classList.add("active")
  currentProduct.selectedSize = sizeOption.dataset.size

  showNotification(`Ukuran ${sizeOption.dataset.size} dipilih`)
}

// Update quantity
function updateQuantity(change) {
  const quantityInput = document.getElementById("quantityInput")
  const newQuantity = Number.parseInt(quantityInput.value) + change

  if (newQuantity >= 1 && newQuantity <= 99) {
    currentProduct.quantity = newQuantity
    quantityInput.value = newQuantity
  }
}

// Add to cart
function addToCart() {
  const button = document.querySelector(".add-to-cart")
  const originalText = button.innerHTML

  // Animation
  button.style.transform = "scale(0.95)"
  button.style.background = "#10B981"
  button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
                Ditambahkan!
            `
  button.disabled = true

  // Update cart count
  const cartCount = document.querySelector(".cart-count")
  const currentCount = Number.parseInt(cartCount.textContent)
  cartCount.textContent = currentCount + currentProduct.quantity

  // Show notification
  showNotification(`${currentProduct.name} berhasil ditambahkan ke keranjang!`)

  // Reset button
  setTimeout(() => {
    button.style.transform = "scale(1)"
    button.style.background = ""
    button.innerHTML = originalText
    button.disabled = false
  }, 2000)
}

// Buy now
function buyNow() {
  // Add to cart first
  addToCart()

  // Redirect to cart after a short delay
  setTimeout(() => {
    window.location.href = "cart.html"
  }, 1000)
}

// Toggle wishlist
function toggleWishlist() {
  const button = document.querySelector(".wishlist-btn")
  const svg = button.querySelector("svg path")

  currentProduct.inWishlist = !currentProduct.inWishlist

  if (currentProduct.inWishlist) {
    svg.setAttribute("fill", "currentColor")
    button.style.color = "#EF4444"
    showNotification("Ditambahkan ke wishlist")
  } else {
    svg.setAttribute("fill", "none")
    button.style.color = ""
    showNotification("Dihapus dari wishlist")
  }
}

// Share product
function shareProduct() {
  if (navigator.share) {
    navigator.share({
      title: currentProduct.name,
      text: `Lihat produk ${currentProduct.name} di TheMar`,
      url: window.location.href,
    })
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(window.location.href).then(() => {
      showNotification("Link produk berhasil disalin!")
    })
  }
}

// Show tab
function showTab(tabName) {
  // Remove active class from all tabs and panels
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active")
  })
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.remove("active")
  })

  // Add active class to clicked tab and corresponding panel
  document
    .querySelector(
      `.tab-btn:nth-child(${["description", "specifications", "reviews", "shipping"].indexOf(tabName) + 1})`,
    )
    .classList.add("active")
  document.getElementById(tabName).classList.add("active")

  // Scroll to reviews if reviews tab is clicked
  if (tabName === "reviews") {
    document.getElementById("reviews").scrollIntoView({ behavior: "smooth" })
  }
}

// Load more reviews
function loadMoreReviews() {
  showNotification("Memuat ulasan tambahan...")
  // Simulate loading more reviews
  setTimeout(() => {
    showNotification("Semua ulasan telah dimuat")
  }, 1500)
}

// Check shipping cost
function checkShipping() {
  const postalCode = document.getElementById("postalCode").value

  if (!postalCode) {
    showNotification("Masukkan kode pos terlebih dahulu", "error")
    return
  }

  showNotification("Mengecek ongkos kirim...")

  // Simulate API call
  setTimeout(() => {
    const shippingCost = Math.floor(Math.random() * 100000) + 50000
    showNotification(`Ongkos kirim ke ${postalCode}: Rp ${formatCurrency(shippingCost)}`)
  }, 1500)
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID").format(amount)
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

// Add slideOut animation
const style = document.createElement("style")
style.textContent = `
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `
document.head.appendChild(style)
