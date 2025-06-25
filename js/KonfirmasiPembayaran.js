// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  initializeConfirmationPage()
  updateCartCount()
  generateOrderDetails()
})

// Initialize confirmation page
function initializeConfirmationPage() {
  // Animate elements on load
  animateElements()

  // Set current date and time
  updateTransactionDate()

  // Initialize event listeners
  initializeEventListeners()
}

// Animate elements
function animateElements() {
  const elements = document.querySelectorAll('[class*="animation"]')
  elements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add("visible")
    }, index * 200)
  })
}

// Update transaction date
function updateTransactionDate() {
  const now = new Date()
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
    timeZoneName: "short",
  }

  const formattedDate = now.toLocaleDateString("id-ID", options)
  const dateElement = document.getElementById("transactionDate")
  if (dateElement) {
    dateElement.textContent = formattedDate
  }
}

// Generate order details
function generateOrderDetails() {
  // Generate random order number
  const orderNumber = generateOrderNumber()
  const orderNumberElement = document.getElementById("orderNumber")
  if (orderNumberElement) {
    orderNumberElement.textContent = orderNumber
  }

  // Store order details in localStorage for history
  const orderData = {
    orderNumber: orderNumber,
    date: new Date().toISOString(),
    status: "processing",
    paymentStatus: "paid",
    total: 18981000,
    items: [
      {
        name: "Lemari Pakaian Multifungsi",
        price: 6500000,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80&h=80&fit=crop",
      },
      {
        name: "Meja Kopi Marmer",
        price: 7800000,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=80&h=80&fit=crop",
      },
      {
        name: "Kursi Ergonomis Premium",
        price: 3500000,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=80&h=80&fit=crop",
      },
    ],
  }

  // Save to localStorage
  saveOrderToHistory(orderData)
}

// Generate order number
function generateOrderNumber() {
  const year = new Date().getFullYear()
  const randomNum = Math.floor(Math.random() * 900000) + 100000
  return `TM-${year}-${randomNum}`
}

// Save order to history
function saveOrderToHistory(orderData) {
  let orderHistory = JSON.parse(localStorage.getItem("orderHistory") || "[]")
  orderHistory.unshift(orderData) // Add to beginning of array

  // Keep only last 50 orders
  if (orderHistory.length > 50) {
    orderHistory = orderHistory.slice(0, 50)
  }

  localStorage.setItem("orderHistory", JSON.stringify(orderHistory))
}

// Initialize event listeners
function initializeEventListeners() {
  // Newsletter form
  const newsletterForm = document.getElementById("newsletter-form-footer")
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", handleNewsletterSubmit)
  }

  // Support items click handlers
  const supportItems = document.querySelectorAll(".support-item")
  supportItems.forEach((item) => {
    item.addEventListener("click", handleSupportClick)
  })
}

// Copy order number
function copyOrderNumber() {
  const orderNumber = document.getElementById("orderNumber").textContent

  navigator.clipboard
    .writeText(orderNumber)
    .then(() => {
      showNotification("Nomor pesanan berhasil disalin!", "success")

      // Update button temporarily
      const copyBtn = document.querySelector(".copy-btn")
      const originalHTML = copyBtn.innerHTML
      copyBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20,6 9,17 4,12"></polyline>
      </svg>
    `

      setTimeout(() => {
        copyBtn.innerHTML = originalHTML
      }, 2000)
    })
    .catch(() => {
      showNotification("Gagal menyalin nomor pesanan", "error")
    })
}

// Download invoice
function downloadInvoice() {
  showNotification("Invoice sedang dipersiapkan...", "info")

  // Simulate download delay
  setTimeout(() => {
    // In a real application, this would trigger an actual download
    showNotification("Invoice berhasil diunduh!", "success")
  }, 2000)
}

// Handle support item click
function handleSupportClick(event) {
  const supportItem = event.currentTarget
  const title = supportItem.querySelector(".support-title").textContent

  if (title.includes("Customer Service")) {
    window.open("tel:+622112345678")
  } else if (title.includes("Email")) {
    window.open("mailto:support@themar.com")
  } else if (title.includes("Live Chat")) {
    showNotification("Fitur live chat akan segera tersedia!", "info")
  }
}

// Handle newsletter submit
function handleNewsletterSubmit(e) {
  e.preventDefault()
  const email = e.target.querySelector('input[type="email"]').value

  if (email) {
    showNotification("Terima kasih! Anda telah berlangganan newsletter kami.", "success")
    e.target.reset()
  }
}

// Update cart count (should be 0 after successful payment)
function updateCartCount() {
  const cartCountElement = document.getElementById("cart-count")
  if (cartCountElement) {
    cartCountElement.textContent = "0"
    cartCountElement.style.display = "none"
  }
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

  // Style the notification
  notification.style.cssText = `
    position: fixed;
    top: 120px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    animation: slideIn 0.3s ease;
    max-width: 300px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  `

  // Set background color based on type
  switch (type) {
    case "success":
      notification.style.background = "#10b981"
      break
    case "error":
      notification.style.background = "#ef4444"
      break
    case "info":
      notification.style.background = "#3b82f6"
      break
    case "warning":
      notification.style.background = "#f59e0b"
      break
    default:
      notification.style.background = "#10b981"
  }

  document.body.appendChild(notification)

  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 3000)
}

// Add CSS animations
const style = document.createElement("style")
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
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

// Smooth scroll for anchor links
document.addEventListener("click", (e) => {
  if (e.target.tagName === "A" && e.target.getAttribute("href")?.startsWith("#")) {
    e.preventDefault()
    const targetId = e.target.getAttribute("href").substring(1)
    const targetElement = document.getElementById(targetId)

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }
})

// Handle page visibility change
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    // Refresh order status when page becomes visible
    // In a real app, you might want to check for order updates
    console.log("Page is now visible - checking for order updates...")
  }
})
