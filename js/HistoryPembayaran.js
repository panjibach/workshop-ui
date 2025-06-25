// Transaction data
let allTransactions = []
let filteredTransactions = []
let currentPage = 1
const itemsPerPage = 5

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  loadTransactions()
  initializeAnimations()
})

// Load transactions (in real app, this would fetch from API)
function loadTransactions() {
  allTransactions = [
    {
      id: "TM25050001",
      date: "2024-05-14",
      status: "pending",
      total: 6980000,
      items: [
        { name: "Sofa Minimalis", quantity: 1, price: 4500000 },
        { name: "Meja Kopi Marmer", quantity: 1, price: 1800000 },
      ],
    },
    {
      id: "TM25040015",
      date: "2024-04-25",
      status: "shipped",
      total: 4840000,
      items: [{ name: "Kursi Ergonomis", quantity: 2, price: 2200000 }],
    },
    {
      id: "TM25030042",
      date: "2024-03-15",
      status: "completed",
      total: 9020000,
      items: [
        { name: "Lemari Pakaian Multifungsi", quantity: 1, price: 5800000 },
        { name: "Nakas Vintage", quantity: 2, price: 1200000 },
      ],
    },
  ]

  filteredTransactions = [...allTransactions]
  updateDisplay()
}

// Filter transactions
function filterTransactions() {
  const statusFilter = document.getElementById("status-filter").value
  const dateFilter = document.getElementById("date-filter").value

  filteredTransactions = allTransactions.filter((transaction) => {
    // Status filter
    if (statusFilter !== "all" && transaction.status !== statusFilter) {
      return false
    }

    // Date filter
    if (dateFilter !== "all") {
      const transactionDate = new Date(transaction.date)
      const now = new Date()
      const daysDiff = Math.floor((now - transactionDate) / (1000 * 60 * 60 * 24))

      switch (dateFilter) {
        case "last-week":
          if (daysDiff > 7) return false
          break
        case "last-month":
          if (daysDiff > 30) return false
          break
        case "last-3months":
          if (daysDiff > 90) return false
          break
        case "last-year":
          if (daysDiff > 365) return false
          break
      }
    }

    return true
  })

  currentPage = 1
  updateDisplay()
}

// Search transactions
function searchTransactions() {
  const searchTerm = document.getElementById("order-search").value.toLowerCase()

  if (searchTerm.trim() === "") {
    filterTransactions()
    return
  }

  filteredTransactions = allTransactions.filter((transaction) => transaction.id.toLowerCase().includes(searchTerm))

  currentPage = 1
  updateDisplay()
}

// Update display
function updateDisplay() {
  const transactionList = document.getElementById("transactionList")
  const emptyState = document.getElementById("emptyState")
  const pagination = document.getElementById("pagination")

  if (filteredTransactions.length === 0) {
    transactionList.style.display = "none"
    emptyState.style.display = "block"
    pagination.style.display = "none"
  } else {
    transactionList.style.display = "grid"
    emptyState.style.display = "none"
    pagination.style.display = "flex"

    // Show only current page items
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentItems = filteredTransactions.slice(startIndex, endIndex)

    // Update transaction cards visibility
    const allCards = document.querySelectorAll(".transaction-card")
    allCards.forEach((card) => (card.style.display = "none"))

    currentItems.forEach((transaction, index) => {
      const card = document.querySelector(`[data-status="${transaction.status}"]`)
      if (card) {
        card.style.display = "block"
      }
    })

    updatePagination()
  }
}

// Update pagination
function updatePagination() {
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const prevBtn = document.querySelector(".pagination-prev")
  const nextBtn = document.querySelector(".pagination-next")

  prevBtn.disabled = currentPage === 1
  nextBtn.disabled = currentPage === totalPages

  // Update page numbers (simplified)
  const pageNumbers = document.querySelector(".pagination-numbers")
  pageNumbers.innerHTML = ""

  for (let i = 1; i <= Math.min(totalPages, 5); i++) {
    const button = document.createElement("button")
    button.className = `pagination-number ${i === currentPage ? "active" : ""}`
    button.textContent = i
    button.onclick = () => goToPage(i)
    pageNumbers.appendChild(button)
  }
}

// Change page
function changePage(direction) {
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const newPage = currentPage + direction

  if (newPage >= 1 && newPage <= totalPages) {
    currentPage = newPage
    updateDisplay()
  }
}

// Go to specific page
function goToPage(page) {
  currentPage = page
  updateDisplay()
}

// Toggle transaction detail
function toggleDetail(button) {
  const card = button.closest(".transaction-card")
  const detail = card.querySelector(".transaction-detail")

  if (detail.style.display === "none") {
    detail.style.display = "block"
    button.textContent = "Sembunyikan Detail"
    detail.scrollIntoView({ behavior: "smooth", block: "nearest" })
  } else {
    detail.style.display = "none"
    button.textContent = "Lihat Detail"
  }
}

// Pay now
function payNow(orderNumber) {
  showNotification(`Mengarahkan ke halaman pembayaran untuk pesanan ${orderNumber}...`)
  setTimeout(() => {
    window.location.href = "pembayaran.html"
  }, 1500)
}

// Track order
function trackOrder(orderNumber) {
  showNotification(`Melacak pesanan ${orderNumber}...`)
  // In real app, this would open tracking modal or page
}

// Write review
function writeReview(orderNumber) {
  showNotification(`Membuka form ulasan untuk pesanan ${orderNumber}...`)
  // In real app, this would open review modal or page
}

// Reorder
function reorder(orderNumber) {
  showNotification(`Menambahkan produk dari pesanan ${orderNumber} ke keranjang...`)
  setTimeout(() => {
    window.location.href = "keranjang.html"
  }, 1500)
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
