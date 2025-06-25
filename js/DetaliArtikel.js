// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  initializeAnimations()
  initializeTableOfContents()
})

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

  // Add animate class first, then observe
  document.querySelectorAll(".fade-in").forEach((element) => {
    element.classList.add("animate")
    observer.observe(element)
  })
}

// Initialize table of contents smooth scrolling
function initializeTableOfContents() {
  const tocLinks = document.querySelectorAll(".table-of-contents a")

  tocLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const targetId = link.getAttribute("href").substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

// Social sharing functions
function shareToFacebook() {
  const url = encodeURIComponent(window.location.href)
  const title = encodeURIComponent(document.title)
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank", "width=600,height=400")
}

function shareToTwitter() {
  const url = encodeURIComponent(window.location.href)
  const title = encodeURIComponent(document.title)
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, "_blank", "width=600,height=400")
}

function shareToWhatsApp() {
  const url = encodeURIComponent(window.location.href)
  const title = encodeURIComponent(document.title)
  window.open(`https://wa.me/?text=${title} ${url}`, "_blank")
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    // Show notification
    const button = event.target.closest(".share-btn")
    const originalText = button.innerHTML
    button.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                    Tersalin!
                `

    setTimeout(() => {
      button.innerHTML = originalText
    }, 2000)
  })
}

// Open related article
function openArticle(articleId) {
  window.location.href = `Artikel.html?id=${articleId}`
}

// Reading progress indicator
window.addEventListener("scroll", () => {
  const article = document.querySelector(".article-content")
  const articleTop = article.offsetTop
  const articleHeight = article.offsetHeight
  const windowHeight = window.innerHeight
  const scrollTop = window.pageYOffset

  const progress = Math.min(Math.max((scrollTop - articleTop + windowHeight) / articleHeight, 0), 1)

  // You can use this progress value to show a reading progress bar
  // For example: document.querySelector('.progress-bar').style.width = `${progress * 100}%`;
})
