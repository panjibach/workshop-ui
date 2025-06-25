// Global variables
let currentCategory = "all"
let currentSort = "newest"
let searchQuery = ""

// DOM elements
const searchInput = document.getElementById("searchInput")
const categorySelect = document.getElementById("categorySelect")
const sortSelect = document.getElementById("sortSelect")
const resultsInfo = document.getElementById("resultsInfo")
const articleCards = document.querySelectorAll(".article-card")

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  initializeEventListeners()
  initializeAnimations()
  updateResultsInfo()
  filterArticles() // Ensure articles are filtered/displayed initially
})

// Initialize event listeners
function initializeEventListeners() {
  if (searchInput) {
    searchInput.addEventListener("input", handleSearch)
  } else {
    console.warn("searchInput element not found. Article search functionality may be limited.")
  }
  if (categorySelect) {
    categorySelect.addEventListener("change", handleCategoryFilter)
  } else {
    console.warn("categorySelect element not found.")
  }
  if (sortSelect) {
    sortSelect.addEventListener("change", handleSort)
  } else {
    console.warn("sortSelect element not found.")
  }
}

// Search functionality
function handleSearch() {
  searchQuery = searchInput.value.toLowerCase().trim()
  filterArticles()
}

// Category filtering
function handleCategoryFilter() {
  currentCategory = categorySelect.value
  filterArticles()
}

// Sorting functionality
function handleSort() {
  currentSort = sortSelect.value
  sortArticles()
}

// Filter articles
function filterArticles() {
  let visibleCount = 0

  articleCards.forEach((card) => {
    const cardCategory = card.dataset.category
    const cardTitle = card.querySelector(".article-title").textContent.toLowerCase()
    const cardExcerpt = card.querySelector(".article-excerpt").textContent.toLowerCase()

    let showCard = true

    // Category filter
    if (currentCategory !== "all" && cardCategory !== currentCategory) {
      showCard = false
    }

    // Search filter
    if (searchQuery) {
      const matchesTitle = cardTitle.includes(searchQuery)
      const matchesExcerpt = cardExcerpt.includes(searchQuery)

      if (!matchesTitle && !matchesExcerpt) {
        showCard = false
      }
    }

    // Show/hide card with animation
    if (showCard) {
      card.style.display = "block"
      setTimeout(() => {
        card.classList.add("visible")
      }, 100)
      visibleCount++
    } else {
      card.classList.remove("visible")
      setTimeout(() => {
        card.style.display = "none"
      }, 300)
    }
  })

  updateResultsInfo(visibleCount)
}

// Sort articles
function sortArticles() {
  const grid = document.getElementById("articlesGrid")
  const cards = Array.from(articleCards)

  cards.sort((a, b) => {
    const dateA = new Date(a.querySelector(".article-meta").textContent.match(/\d{1,2} \w+ \d{4}/)[0])
    const dateB = new Date(b.querySelector(".article-meta").textContent.match(/\d{1,2} \w+ \d{4}/)[0])

    switch (currentSort) {
      case "oldest":
        return dateA - dateB
      case "popular":
        const readTimeA = Number.parseInt(a.querySelector(".article-read-time").textContent)
        const readTimeB = Number.parseInt(b.querySelector(".article-read-time").textContent)
        return readTimeB - readTimeA
      case "newest":
      default:
        return dateB - dateA
    }
  })

  cards.forEach((card) => grid.appendChild(card))
}

// Update results info
function updateResultsInfo(count = null) {
  if (resultsInfo) {
    // Add check for resultsInfo
    if (count === null) {
      count = Array.from(articleCards).filter((card) => card.style.display !== "none").length
    }
    resultsInfo.textContent = `${count} artikel`
  }
}

// Open article
function openArticle(articleId) {
  window.location.href = `DetailArtikel.html?id=${articleId}`
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

  document.querySelectorAll(".fade-in").forEach((element) => {
    observer.observe(element)
  })
}

// Header scroll effect
window.addEventListener("scroll", () => {
  const header = document.querySelector(".main-header")

  if (header) {
    // Add check for header
    if (window.scrollY > 100) {
      header.style.background = "rgba(255, 255, 255, 0.98)"
      header.style.boxShadow = "0 4px 20px rgba(15, 23, 42, 0.1)"
    } else {
      header.style.background = "rgba(255, 255, 255, 0.95)"
      header.style.boxShadow = "none"
    }
  }
})

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})
