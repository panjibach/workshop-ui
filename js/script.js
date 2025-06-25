// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const backToTop = document.getElementById('backToTop');
const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots = document.querySelectorAll('.hero-dot');
const heroNavBtns = document.querySelectorAll('.hero-nav-btn');
const tabBtns = document.querySelectorAll('.tab-btn');
const productCards = document.querySelectorAll('.product-card');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialDots = document.querySelectorAll('.testimonial-dot');
const testimonialNavBtns = document.querySelectorAll('.testimonial-prev, .testimonial-next');
const newsletterForm = document.querySelector('.newsletter-form');
const cartBtn = document.querySelector('.cart-btn');
const cartCount = document.querySelector('.cart-count');
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

// State
let currentHeroSlide = 0;
let currentTestimonialSlide = 0;
let heroInterval;
let testimonialInterval;
let cart = [];
let visibleProducts = 6;

// Loading Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 1500);
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Back to Top Button
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

// Mobile Menu Toggle
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Close mobile menu when clicking on nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Hero Slider
function initHeroSlider() {
    function showHeroSlide(index) {
        heroSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        heroDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentHeroSlide = index;
    }
    
    function nextHeroSlide() {
        const nextIndex = (currentHeroSlide + 1) % heroSlides.length;
        showHeroSlide(nextIndex);
    }
    
    function prevHeroSlide() {
        const prevIndex = (currentHeroSlide - 1 + heroSlides.length) % heroSlides.length;
        showHeroSlide(prevIndex);
    }
    
    // Auto-play
    function startHeroAutoplay() {
        heroInterval = setInterval(nextHeroSlide, 5000);
    }
    
    function stopHeroAutoplay() {
        clearInterval(heroInterval);
    }
    
    // Event Listeners
    heroDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showHeroSlide(index);
            stopHeroAutoplay();
            startHeroAutoplay();
        });
    });
    
    heroNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('next')) {
                nextHeroSlide();
            } else {
                prevHeroSlide();
            }
            stopHeroAutoplay();
            startHeroAutoplay();
        });
    });
    
    // Pause on hover
    const heroSection = document.querySelector('.hero');
    heroSection.addEventListener('mouseenter', stopHeroAutoplay);
    heroSection.addEventListener('mouseleave', startHeroAutoplay);
    
    // Start autoplay
    startHeroAutoplay();
}

// Product Filtering
function initProductFiltering() {
    function filterProducts(category) {
        productCards.forEach(card => {
            const cardCategory = card.dataset.category;
            if (category === 'all' || cardCategory === category) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
        
        // Reset visible products count
        visibleProducts = 6;
        updateProductVisibility();
    }
    
    function updateProductVisibility() {
        const visibleCards = Array.from(productCards).filter(card => !card.classList.contains('hidden'));
        
        visibleCards.forEach((card, index) => {
            if (index < visibleProducts) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show/hide load more button
        if (visibleCards.length > visibleProducts) {
            loadMoreBtn.style.display = 'inline-flex';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }
    
    // Tab button event listeners
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(tab => tab.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            filterProducts(category);
        });
    });
    
    // Load more button
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            visibleProducts += 6;
            updateProductVisibility();
        });
    }
    
    // Initial setup
    updateProductVisibility();
}

// Testimonial Slider
function initTestimonialSlider() {
    function showTestimonialSlide(index) {
        testimonialCards.forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });
        
        testimonialDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentTestimonialSlide = index;
    }
    
    function nextTestimonialSlide() {
        const nextIndex = (currentTestimonialSlide + 1) % testimonialCards.length;
        showTestimonialSlide(nextIndex);
    }
    
    function prevTestimonialSlide() {
        const prevIndex = (currentTestimonialSlide - 1 + testimonialCards.length) % testimonialCards.length;
        showTestimonialSlide(prevIndex);
    }
    
    // Auto-play
    function startTestimonialAutoplay() {
        testimonialInterval = setInterval(nextTestimonialSlide, 6000);
    }
    
    function stopTestimonialAutoplay() {
        clearInterval(testimonialInterval);
    }
    
    // Event Listeners
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonialSlide(index);
            stopTestimonialAutoplay();
            startTestimonialAutoplay();
        });
    });
    
    testimonialNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('testimonial-next')) {
                nextTestimonialSlide();
            } else {
                prevTestimonialSlide();
            }
            stopTestimonialAutoplay();
            startTestimonialAutoplay();
        });
    });
    
    // Pause on hover
    const testimonialsSection = document.querySelector('.testimonials');
    testimonialsSection.addEventListener('mouseenter', stopTestimonialAutoplay);
    testimonialsSection.addEventListener('mouseleave', startTestimonialAutoplay);
    
    // Start autoplay
    startTestimonialAutoplay();
}

// Shopping Cart Functionality
function initShoppingCart() {
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        if (totalItems > 0) {
            cartCount.style.display = 'block';
        } else {
            cartCount.style.display = 'none';
        }
    }
    
    function addToCart(productName) {
        const existingItem = cart.find(item => item.name === productName);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: productName,
                quantity: 1
            });
        }
        
        updateCartCount();
        showNotification(`${productName} ditambahkan ke keranjang!`);
    }
    
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--accent-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Add to cart button event listeners
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = btn.closest('.product-card');
            const productName = productCard.querySelector('.product-title').textContent;
            addToCart(productName);
        });
    });
    
    // Initialize cart count
    updateCartCount();
}

// Newsletter Form
function initNewsletterForm() {
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            if (email) {
                // Simulate API call
                const submitBtn = newsletterForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<span>Berlangganan...</span>';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    submitBtn.innerHTML = '<span>Berhasil!</span>';
                    newsletterForm.querySelector('input[type="email"]').value = '';
                    
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }, 2000);
                }, 1500);
            }
        });
    }
}

// Back to Top Button
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Intersection Observer for Navigation Active States
function initNavigationActiveStates() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-100px 0px -100px 0px'
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Performance Optimization
function initPerformanceOptimizations() {
    // Preload critical resources
    const preloadLinks = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap'
    ];
    
    preloadLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
    });
    
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            // Scroll-dependent operations
        }, 10);
    }, { passive: true });
}

// Error Handling
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
});

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initHeroSlider();
    initProductFiltering();
    initTestimonialSlider();
    initShoppingCart();
    initNewsletterForm();
    initNavigationActiveStates();
    initLazyLoading();
    initPerformanceOptimizations();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations and intervals when page is not visible
        clearInterval(heroInterval);
        clearInterval(testimonialInterval);
    } else {
        // Resume when page becomes visible
        if (typeof initHeroSlider === 'function') {
            initHeroSlider();
        }
        if (typeof initTestimonialSlider === 'function') {
            initTestimonialSlider();
        }
    }
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}