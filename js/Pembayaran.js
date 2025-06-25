// Payment data
const paymentData = {
  subtotal: 17800000,
  discount: 700000,
  shippingCost: 0,
  tax: 0,
  total: 0,
  selectedShipping: "regular",
  selectedPayment: "bank-transfer",
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  calculateTotal()
  setupEventListeners()
})

// Setup event listeners
function setupEventListeners() {
  // Shipping method change
  document.querySelectorAll('input[name="shipping"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      paymentData.selectedShipping = this.value
      updateShippingCost()
      calculateTotal()
    })
  })

  // Payment method change
  document.querySelectorAll('input[name="payment"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      paymentData.selectedPayment = this.value
      showNotification(`Metode pembayaran ${this.value} dipilih`)
    })
  })

  // Form validation
  const form = document.querySelector(".payment-form")
  const inputs = form.querySelectorAll("input[required], select[required], textarea[required]")

  inputs.forEach((input) => {
    input.addEventListener("blur", validateField)
    input.addEventListener("input", clearFieldError)
  })

  // Add skip functionality
  const skipButton = document.getElementById("skipButton")
  if (skipButton) {
    skipButton.addEventListener("click", skipToNext)
  }
}

// Update shipping cost based on selected method
function updateShippingCost() {
  const shippingCosts = {
    regular: 0,
    express: 500000,
    "same-day": 1000000,
  }

  paymentData.shippingCost = shippingCosts[paymentData.selectedShipping]

  const shippingElement = document.getElementById("shipping-cost")
  if (paymentData.shippingCost === 0) {
    shippingElement.textContent = "Gratis"
  } else {
    shippingElement.textContent = formatCurrency(paymentData.shippingCost)
  }
}

// Calculate total
function calculateTotal() {
  const subtotalAfterDiscount = paymentData.subtotal - paymentData.discount
  paymentData.tax = Math.round((subtotalAfterDiscount + paymentData.shippingCost) * 0.11)
  paymentData.total = subtotalAfterDiscount + paymentData.shippingCost + paymentData.tax

  // Update display
  document.getElementById("tax").textContent = formatCurrency(paymentData.tax)
  document.getElementById("total").textContent = formatCurrency(paymentData.total)
}

// Apply promo code
function applyPromo() {
  const promoInput = document.getElementById("promoCode")
  const promoCode = promoInput.value.trim().toLowerCase()

  const validPromos = {
    welcome10: { discount: 0.1, message: "Diskon 10% berhasil diterapkan!" },
    furniture20: { discount: 0.2, message: "Diskon 20% berhasil diterapkan!" },
    newuser: { discount: 0.15, message: "Diskon 15% untuk pengguna baru!" },
    freeship: { freeShipping: true, message: "Gratis ongkir berhasil diterapkan!" },
  }

  if (validPromos[promoCode]) {
    const promo = validPromos[promoCode]

    if (promo.discount) {
      const additionalDiscount = Math.round(paymentData.subtotal * promo.discount)
      paymentData.discount += additionalDiscount
      document.getElementById("discount").textContent = `-${formatCurrency(paymentData.discount)}`
    }

    if (promo.freeShipping) {
      paymentData.shippingCost = 0
      document.getElementById("shipping-cost").textContent = "Gratis"
    }

    calculateTotal()
    showNotification(promo.message)
    promoInput.value = ""
  } else if (promoCode) {
    showNotification("Kode promo tidak valid", "error")
  } else {
    showNotification("Masukkan kode promo", "error")
  }
}

// Validate form field (modified to be more lenient)
function validateField(event) {
  const field = event.target
  const value = field.value.trim()

  // Remove existing error
  clearFieldError(event)

  // Only validate if field has content (not required to be filled)
  if (value) {
    // Email validation (only if email is provided)
    if (field.type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        showFieldError(field, "Format email tidak valid")
        return false
      }
    }

    // Phone validation (only if phone is provided)
    if (field.type === "tel") {
      const phoneRegex = /^[0-9+\-\s()]+$/
      if (!phoneRegex.test(value) || value.length < 10) {
        showFieldError(field, "Nomor telepon tidak valid")
        return false
      }
    }
  }

  return true
}

// Show field error
function showFieldError(field, message) {
  field.style.borderColor = "var(--error)"

  let errorElement = field.parentNode.querySelector(".field-error")
  if (!errorElement) {
    errorElement = document.createElement("div")
    errorElement.className = "field-error"
    errorElement.style.color = "var(--error)"
    errorElement.style.fontSize = "0.8rem"
    errorElement.style.marginTop = "0.25rem"
    field.parentNode.appendChild(errorElement)
  }
  errorElement.textContent = message
}

// Clear field error
function clearFieldError(event) {
  const field = event.target
  field.style.borderColor = ""

  const errorElement = field.parentNode.querySelector(".field-error")
  if (errorElement) {
    errorElement.remove()
  }
}

// Validate entire form (modified to allow proceeding without all required fields)
function validateForm() {
  const form = document.querySelector(".payment-form")
  const requiredFields = form.querySelectorAll("input[required], select[required], textarea[required]")
  let hasAnyData = false

  // Check if at least some basic information is provided
  requiredFields.forEach((field) => {
    if (field.value.trim()) {
      hasAnyData = true
    }
  })

  // Only require basic validation, not all fields
  return hasAnyData
}

// Process payment (modified to allow proceeding with minimal validation)
function processPayment() {
  const form = document.querySelector(".payment-form")
  const nameField = form.querySelector('input[name="name"]')
  const emailField = form.querySelector('input[name="email"]')

  // Show loading state
  const button = event.target
  const originalText = button.innerHTML
  button.disabled = false
  button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56"></path>
                </svg>
                Memproses...
            `

  // Simulate payment processing
  setTimeout(() => {
    // Generate order number
    const orderNumber = "TM" + Date.now().toString().slice(-8)

    // Store order data with available information only
    const orderData = {
      orderNumber: orderNumber,
      items: [
        { name: "Lemari Pakaian Multifungsi", quantity: 1, price: 6500000 },
        { name: "Meja Kopi Marmer", quantity: 1, price: 7800000 },
        { name: "Kursi Ergonomis Premium", quantity: 1, price: 3500000 },
      ],
      total: paymentData.total,
      paymentMethod: paymentData.selectedPayment,
      shippingMethod: paymentData.selectedShipping,
      status: "pending",
      date: new Date().toISOString(),
      customerInfo: {
        name: nameField?.value || "Guest User",
        email: emailField?.value || "guest@example.com",
      },
    }

    localStorage.setItem("lastOrder", JSON.stringify(orderData))

    // Show success message
    showNotification("Pesanan berhasil dibuat! Anda dapat melengkapi informasi nanti.")

    setTimeout(() => {
      window.location.href = "KonfirmasiPembayaran.html"
    }, 2000)
  }, 2000) // Reduced processing time
}

// Add skip functionality
function skipToNext() {
  // Generate order with minimal data
  const orderNumber = "TM" + Date.now().toString().slice(-8)

  const orderData = {
    orderNumber: orderNumber,
    items: [
      { name: "Lemari Pakaian Multifungsi", quantity: 1, price: 6500000 },
      { name: "Meja Kopi Marmer", quantity: 1, price: 7800000 },
      { name: "Kursi Ergonomis Premium", quantity: 1, price: 3500000 },
    ],
    total: paymentData.total,
    paymentMethod: paymentData.selectedPayment,
    shippingMethod: paymentData.selectedShipping,
    status: "draft", // Mark as draft
    date: new Date().toISOString(),
    customerInfo: {
      name: "Guest User",
      email: "guest@example.com",
    },
  }

  localStorage.setItem("lastOrder", JSON.stringify(orderData))
  showNotification("Pesanan disimpan sebagai draft. Anda dapat melengkapi nanti.")

  setTimeout(() => {
    window.location.href = "HistoryPembayaran.html"
  }, 1500)
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  })
    .format(amount)
    .replace("IDR", "Rp")
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
            
            .field-error {
                animation: fadeIn 0.3s ease;
            }
        `
document.head.appendChild(style)
