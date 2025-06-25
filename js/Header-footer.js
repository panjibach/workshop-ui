// Mobile Header Functionality
class MobileHeader {
  constructor() {
    this.mobileMenuBtn = document.querySelector(".mobile-menu-btn")
    this.mainNav = document.querySelector(".main-nav")
    this.searchContainer = document.querySelector(".search-container")
    this.body = document.body
    this.html = document.documentElement // Tambahkan ini untuk elemen html

    this.init()
  }

  init() {
    this.createOverlay()
    this.bindEvents()
    this.bindDropdownEvents() // New method for dropdowns
  }

  createOverlay() {
    // Create mobile navigation overlay
    const overlay = document.createElement("div")
    overlay.className = "mobile-nav-overlay"
    overlay.id = "mobileOverlay"
    overlay.addEventListener("click", () => this.closeMobileMenu())
    document.body.appendChild(overlay)
  }

  bindEvents() {
    // Mobile menu button click
    this.mobileMenuBtn.addEventListener("click", () => this.toggleMobileMenu())

    // Close menu when clicking nav links (exclude dropdown toggles)
    const navLinks = this.mainNav.querySelectorAll("a:not(.dropdown-toggle)")
    navLinks.forEach((link) => {
      link.addEventListener("click", () => this.closeMobileMenu())
    })

    // Handle window resize
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        this.closeMobileMenu()
        this.closeSearch() // Keep this if search results can be toggled
      }
    })

    // Close search results when clicking outside search container
    document.addEventListener("click", (event) => {
      if (!this.searchContainer.contains(event.target)) {
        this.closeSearch()
      }
    })

    // Header scroll effect
    window.addEventListener("scroll", () => {
      const header = document.querySelector(".main-header")
      if (window.scrollY > 50) {
        header.classList.add("header-scrolled")
      } else {
        header.classList.remove("header-scrolled")
      }
    })
  }

  bindDropdownEvents() {
    const dropdownToggles = this.mainNav.querySelectorAll(".has-dropdown > a.dropdown-toggle")

    dropdownToggles.forEach((toggle) => {
      toggle.addEventListener("click", (event) => {
        // Only handle click for dropdown toggle on mobile
        if (window.innerWidth <= 768) {
          event.preventDefault() // Prevent default navigation for the parent link on mobile
          event.stopPropagation() // Prevent click from bubbling up and potentially interfering

          const parentLi = toggle.closest(".has-dropdown")
          if (parentLi) {
            // Close other open dropdowns in mobile menu
            this.mainNav.querySelectorAll(".has-dropdown.mobile-dropdown-open").forEach((openDropdown) => {
              if (openDropdown !== parentLi) {
                openDropdown.classList.remove("mobile-dropdown-open")
              }
            })
            parentLi.classList.toggle("mobile-dropdown-open")
          }
        }
        // For desktop, the default link behavior (if href is present) and CSS hover will handle it.
        // If the user clicks the "Product" text on desktop, it will navigate to ProductPage.html.
        // If they hover, the dropdown appears.
      })
    })
  }

  toggleMobileMenu() {
    const overlay = document.getElementById("mobileOverlay")

    this.mainNav.classList.toggle("mobile-open")
    overlay.classList.toggle("active")
    this.mobileMenuBtn.classList.toggle("open")
    this.body.classList.toggle("no-scroll")
    this.html.classList.toggle("no-scroll") // Tambahkan ini
  }

  closeMobileMenu() {
    const overlay = document.getElementById("mobileOverlay")

    this.mainNav.classList.remove("mobile-open")
    overlay.classList.remove("active")
    this.mobileMenuBtn.classList.remove("open")
    this.body.classList.remove("no-scroll")
    this.html.classList.remove("no-scroll") // Tambahkan ini

    // Close all mobile dropdowns when the main menu closes
    this.mainNav.querySelectorAll(".has-dropdown.mobile-dropdown-open").forEach((dropdown) => {
      dropdown.classList.remove("mobile-dropdown-open")
    })
  }

  toggleSearch() {
    this.searchContainer.classList.toggle("active")
  }

  closeSearch() {
    this.searchContainer.classList.remove("active")
  }
}

// Function to highlight the active navigation link
function highlightActiveLink() {
  const currentPath = window.location.pathname.split("/").pop() // Get just the filename, e.g., "Artikel.html"
  const navLinks = document.querySelectorAll(".main-nav a")

  navLinks.forEach((link) => {
    const linkPath = link.href.split("/").pop()

    // Remove active class from all links first
    link.classList.remove("active")

    // Check for direct match
    if (linkPath === currentPath) {
      link.classList.add("active")
      // If this is a sub-dropdown item, also activate its parent
      const parentDropdown = link.closest(".dropdown-menu")
      if (parentDropdown) {
        const parentToggle = parentDropdown.previousElementSibling // This should be the a.dropdown-toggle
        if (parentToggle && parentToggle.classList.contains("dropdown-toggle")) {
          parentToggle.classList.add("active")
        }
      }
    }
  })
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new MobileHeader()
  highlightActiveLink() // Call the new function to highlight active link
})

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = MobileHeader
}
