// Admin Dashboard JavaScript - Zoom-Resistant Version
class AdminDashboard {
  constructor() {
    this.sidebar = null
    this.overlay = null
    this.mobileMenuBtn = null
    this.sidebarCloseBtn = null
    this.isInitialized = false
    this.isMobile = false
    this.currentBreakpoint = "desktop"
    this.resizeTimeout = null
    this.zoomLevel = 1
    this.lastWindowWidth = window.innerWidth

    this.init()
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.initializeComponents())
    } else {
      this.initializeComponents()
    }
  }

  initializeComponents() {
    try {
      this.setupElements()
      this.createOverlay()
      this.createSidebarCloseButton()
      this.detectInitialState()
      this.bindEvents()
      this.initializeAnimations()
      this.handleResize()

      this.isInitialized = true
      console.log("Admin Dashboard initialized successfully")
    } catch (error) {
      console.error("Error initializing admin dashboard:", error)
    }
  }

  setupElements() {
    this.sidebar = document.getElementById("adminSidebar") || document.querySelector(".admin-sidebar")
    this.mobileMenuBtn = document.querySelector(".mobile-menu-btn")

    if (!this.sidebar) {
      throw new Error("Sidebar element not found")
    }
  }

  createOverlay() {
    // Create overlay for mobile
    this.overlay = document.createElement("div")
    this.overlay.className = "sidebar-overlay"
    this.overlay.id = "sidebarOverlay"
    document.body.appendChild(this.overlay)
  }

  createSidebarCloseButton() {
    // Create close button for sidebar
    const sidebarHeader = this.sidebar.querySelector(".sidebar-header")
    if (sidebarHeader && !sidebarHeader.querySelector(".sidebar-close")) {
      this.sidebarCloseBtn = document.createElement("button")
      this.sidebarCloseBtn.className = "sidebar-close"
      this.sidebarCloseBtn.innerHTML = "&times;"
      this.sidebarCloseBtn.setAttribute("aria-label", "Close sidebar")
      sidebarHeader.appendChild(this.sidebarCloseBtn)
    }
  }

  detectInitialState() {
    // Detect if we're on mobile initially
    this.updateBreakpoint()

    // Detect zoom level
    this.detectZoom()
  }

  detectZoom() {
    // Multiple methods to detect zoom
    const devicePixelRatio = window.devicePixelRatio || 1
    const screenWidth = screen.width
    const windowWidth = window.innerWidth

    // Calculate approximate zoom level
    this.zoomLevel = Math.round((screenWidth / windowWidth) * 100) / 100

    // Alternative zoom detection
    if (window.outerWidth && window.innerWidth) {
      const zoomRatio = window.outerWidth / window.innerWidth
      if (zoomRatio > 1.1 || zoomRatio < 0.9) {
        this.zoomLevel = zoomRatio
      }
    }

    console.log(`Zoom level detected: ${this.zoomLevel}`)
  }

  updateBreakpoint() {
    const width = window.innerWidth
    const previousBreakpoint = this.currentBreakpoint

    // Account for zoom when determining breakpoints
    const effectiveWidth = width * this.zoomLevel

    if (effectiveWidth <= 480) {
      this.currentBreakpoint = "mobile-small"
      this.isMobile = true
    } else if (effectiveWidth <= 768) {
      this.currentBreakpoint = "mobile"
      this.isMobile = true
    } else if (effectiveWidth <= 1024) {
      this.currentBreakpoint = "tablet"
      this.isMobile = false
    } else {
      this.currentBreakpoint = "desktop"
      this.isMobile = false
    }

    // Only trigger changes if breakpoint actually changed
    if (previousBreakpoint !== this.currentBreakpoint) {
      this.handleBreakpointChange(previousBreakpoint, this.currentBreakpoint)
    }
  }

  handleBreakpointChange(from, to) {
    console.log(`Breakpoint changed: ${from} → ${to}`)

    // Close sidebar when switching to desktop
    if (to === "desktop" || to === "tablet") {
      this.closeSidebar()
    }

    // Emit custom event
    this.emitEvent("breakpointChanged", { from, to, isMobile: this.isMobile })
  }

  bindEvents() {
    // Mobile menu button
    if (this.mobileMenuBtn) {
      this.mobileMenuBtn.addEventListener("click", (e) => {
        e.preventDefault()
        this.toggleSidebar()
      })
    }

    // Sidebar close button
    if (this.sidebarCloseBtn) {
      this.sidebarCloseBtn.addEventListener("click", (e) => {
        e.preventDefault()
        this.closeSidebar()
      })
    }

    // Overlay click
    if (this.overlay) {
      this.overlay.addEventListener("click", () => this.closeSidebar())
    }

    // Window resize with debouncing and zoom detection
    window.addEventListener("resize", () => this.handleResizeDebounced())

    // Zoom detection events
    window.addEventListener("wheel", (e) => {
      if (e.ctrlKey) {
        // User is zooming
        setTimeout(() => this.handleZoomChange(), 100)
      }
    })

    // Keyboard events
    document.addEventListener("keydown", (e) => this.handleKeyboard(e))

    // Navigation links
    this.setupNavigation()

    // Orientation change for mobile devices
    window.addEventListener("orientationchange", () => {
      setTimeout(() => {
        this.detectZoom()
        this.updateBreakpoint()
      }, 100)
    })
  }

  handleResizeDebounced() {
    // Clear existing timeout
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout)
    }

    // Set new timeout
    this.resizeTimeout = setTimeout(() => {
      this.handleResize()
    }, 150) // Debounce resize events
  }

  handleResize() {
    const currentWidth = window.innerWidth

    // Check if this is a real resize or just zoom
    const widthDifference = Math.abs(currentWidth - this.lastWindowWidth)

    if (widthDifference > 50) {
      // Significant width change, likely a real resize
      this.lastWindowWidth = currentWidth
      this.detectZoom()
      this.updateBreakpoint()
    } else {
      // Small change, likely zoom
      this.handleZoomChange()
    }
  }

  handleZoomChange() {
    const oldZoom = this.zoomLevel
    this.detectZoom()

    if (Math.abs(this.zoomLevel - oldZoom) > 0.1) {
      console.log(`Zoom changed: ${oldZoom} → ${this.zoomLevel}`)

      // Update breakpoint based on new zoom
      this.updateBreakpoint()

      // Emit zoom change event
      this.emitEvent("zoomChanged", {
        oldZoom,
        newZoom: this.zoomLevel,
        breakpoint: this.currentBreakpoint,
      })
    }
  }

  setupNavigation() {
    const navItems = this.sidebar.querySelectorAll(".nav-item")
    navItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        // Remove active class from all items
        navItems.forEach((nav) => nav.classList.remove("active"))
        // Add active class to clicked item
        item.classList.add("active")

        // Close sidebar on mobile after navigation
        if (this.isMobile) {
          setTimeout(() => this.closeSidebar(), 150)
        }
      })
    })
  }

  toggleSidebar() {
    if (this.sidebar.classList.contains("open")) {
      this.closeSidebar()
    } else {
      this.openSidebar()
    }
  }

  openSidebar() {
    // Only allow opening on mobile
    if (!this.isMobile) return

    this.sidebar.classList.add("open")
    this.overlay.classList.add("active")
    document.body.style.overflow = "hidden"

    // Focus management for accessibility
    const firstNavItem = this.sidebar.querySelector(".nav-item")
    if (firstNavItem) {
      setTimeout(() => firstNavItem.focus(), 100)
    }

    // Emit custom event
    this.emitEvent("sidebarOpened")
  }

  closeSidebar() {
    this.sidebar.classList.remove("open")
    this.overlay.classList.remove("active")
    document.body.style.overflow = ""

    // Return focus to menu button
    if (this.mobileMenuBtn && this.isMobile) {
      this.mobileMenuBtn.focus()
    }

    // Emit custom event
    this.emitEvent("sidebarClosed")
  }

  handleKeyboard(e) {
    // Close sidebar with Escape key
    if (e.key === "Escape" && this.sidebar.classList.contains("open")) {
      this.closeSidebar()
    }

    // Toggle sidebar with Ctrl+B (only on mobile)
    if (e.ctrlKey && e.key === "b" && this.isMobile) {
      e.preventDefault()
      this.toggleSidebar()
    }
  }

  initializeAnimations() {
    // Animate cards on load
    const cards = document.querySelectorAll(".stat-card, .chart-card, .activity-card")
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`
      card.classList.add("fade-in")
    })

    // Intersection Observer for scroll animations
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("fade-in")
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.1 },
      )

      // Observe elements that should animate on scroll
      document.querySelectorAll(".stat-card, .chart-card, .activity-card").forEach((el) => {
        observer.observe(el)
      })
    }
  }

  // Utility method to emit custom events
  emitEvent(eventName, data = {}) {
    const event = new CustomEvent(eventName, {
      detail: {
        ...data,
        timestamp: Date.now(),
        breakpoint: this.currentBreakpoint,
        zoomLevel: this.zoomLevel,
        isMobile: this.isMobile,
      },
    })
    document.dispatchEvent(event)
  }

  // Public method to check if sidebar is open
  isSidebarOpen() {
    return this.sidebar.classList.contains("open")
  }

  // Public method to get current state
  getState() {
    return {
      isOpen: this.isSidebarOpen(),
      isMobile: this.isMobile,
      breakpoint: this.currentBreakpoint,
      zoomLevel: this.zoomLevel,
      isInitialized: this.isInitialized,
    }
  }

  // Force refresh state (useful after zoom)
  refreshState() {
    this.detectZoom()
    this.updateBreakpoint()

    // Close sidebar if we're now on desktop
    if (!this.isMobile && this.isSidebarOpen()) {
      this.closeSidebar()
    }
  }

  // Cleanup method
  destroy() {
    // Clear timeouts
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout)
    }

    // Remove event listeners
    if (this.mobileMenuBtn) {
      this.mobileMenuBtn.removeEventListener("click", this.toggleSidebar)
    }

    if (this.overlay) {
      this.overlay.remove()
    }

    // Remove body overflow style
    document.body.style.overflow = ""

    console.log("Admin Dashboard destroyed")
  }
}

// Initialize dashboard when DOM is ready
let adminDashboard

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    adminDashboard = new AdminDashboard()
  })
} else {
  adminDashboard = new AdminDashboard()
}

// Global function for backward compatibility
function toggleSidebar() {
  if (adminDashboard) {
    adminDashboard.toggleSidebar()
  }
}

// Handle zoom events globally
window.addEventListener("zoom", () => {
  if (adminDashboard) {
    adminDashboard.refreshState()
  }
})

// Export for use in modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = AdminDashboard
}

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  if (adminDashboard) {
    adminDashboard.destroy()
  }
})

// Debug helper
window.getAdminState = () => {
  return adminDashboard ? adminDashboard.getState() : null
}
