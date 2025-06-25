// JavaScript untuk menangani mobile menu - Tambahkan ke Header-footer.js atau file terpisah
document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  const mainNav = document.querySelector(".main-nav")
  const body = document.body

  // Buat overlay jika belum ada
  let overlay = document.querySelector(".mobile-nav-overlay")
  if (!overlay) {
    overlay = document.createElement("div")
    overlay.className = "mobile-nav-overlay"
    body.appendChild(overlay)
  }

  console.log("Mobile menu button:", mobileMenuBtn) // Debug log
  console.log("Main nav:", mainNav) // Debug log

  if (mobileMenuBtn && mainNav) {
    // Toggle mobile menu
    mobileMenuBtn.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()

      console.log("Mobile menu clicked") // Debug log

      // Toggle classes
      mobileMenuBtn.classList.toggle("open")
      mainNav.classList.toggle("mobile-open")
      overlay.classList.toggle("active")

      // Prevent body scroll
      if (mainNav.classList.contains("mobile-open")) {
        body.classList.add("no-scroll")
      } else {
        body.classList.remove("no-scroll")
      }
    })

    // Close menu when clicking overlay
    overlay.addEventListener("click", () => {
      closeMobileMenu()
    })

    // Close menu when clicking nav links
    const navLinks = mainNav.querySelectorAll("a")
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeMobileMenu()
      })
    })

    // Close menu on window resize
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1024) {
        closeMobileMenu()
      }
    })

    // Function to close mobile menu
    function closeMobileMenu() {
      mobileMenuBtn.classList.remove("open")
      mainNav.classList.remove("mobile-open")
      overlay.classList.remove("active")
      body.classList.remove("no-scroll")
    }

    // ESC key to close menu
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mainNav.classList.contains("mobile-open")) {
        closeMobileMenu()
      }
    })
  } else {
    console.error("Mobile menu elements not found!") // Debug log
  }

  // Debug: Force show mobile menu button
  function forceShowMobileMenu() {
    if (window.innerWidth <= 1024) {
      const btn = document.querySelector(".mobile-menu-btn")
      if (btn) {
        btn.style.display = "flex"
        btn.style.visibility = "visible"
        btn.style.opacity = "1"
        console.log("Forced mobile menu button to show")
      }
    }
  }

  // Call on load and resize
  forceShowMobileMenu()
  window.addEventListener("resize", forceShowMobileMenu)
})
