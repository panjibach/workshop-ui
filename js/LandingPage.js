// Landing Page JavaScript - Improved Version
class LandingPageManager {
    constructor() {
        this.currentSlide = 0;
        this.currentTestimonial = 0;
        this.isAnimating = false;
        this.cartCount = parseInt(localStorage.getItem('cartCount')) || 0;
        this.sliderInterval = null;
        this.testimonialInterval = null;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        // Product data
        this.products = [
            {
                id: 1,
                name: "Sofa Minimalis",
                category: "sofa",
                price: 8500000,
                rating: 4.9,
                tags: ["minimalis", "ruang-tamu", "nyaman"],
                image: "/placeholder.svg?height=300&width=400"
            },
            {
                id: 2,
                name: "Meja Makan Kayu Jati",
                category: "meja",
                price: 12500000,
                rating: 4.8,
                tags: ["kayu-jati", "ruang-makan", "klasik"],
                image: "/placeholder.svg?height=300&width=400"
            },
            {
                id: 3,
                name: "Kursi Ergonomis",
                category: "kursi",
                price: 3500000,
                rating: 4.9,
                tags: ["ergonomis", "kantor", "modern"],
                image: "/placeholder.svg?height=300&width=400"
            },
            {
                id: 4,
                name: "Lemari Pakaian Multifungsi",
                category: "lemari",
                price: 6500000,
                rating: 4.7,
                tags: ["multifungsi", "kamar-tidur", "penyimpanan"],
                image: "/placeholder.svg?height=300&width=400"
            },
            {
                id: 5,
                name: "Rak Buku Industrial",
                category: "rak",
                price: 4200000,
                rating: 4.8,
                tags: ["industrial", "ruang-kerja", "penyimpanan"],
                image: "/placeholder.svg?height=300&width=400"
            },
            {
                id: 6,
                name: "Meja Kopi Marmer",
                category: "meja",
                price: 7800000,
                rating: 4.9,
                tags: ["marmer", "ruang-tamu", "mewah"],
                image: "/placeholder.svg?height=300&width=400"
            }
        ];

        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            this.initializeSliders();
            this.initializeSearch();
            this.initializeFilters();
            this.initializeChat();
            this.initializeFAQ();
            this.initializeCart();
            this.initializeNewsletter();
            this.initializeScrollEffects();
            this.initializeMobileMenu();
            this.initializeAnimations();
            this.initializeKeyboardNavigation();
            this.initializeTouchGestures();
            
            console.log('Landing page initialized successfully');
        } catch (error) {
            console.error('Error initializing landing page:', error);
        }
    }

    // Slider functionality
    initializeSliders() {
        const sliderTrack = document.getElementById('slider-track');
        const sliderDots = document.getElementById('slider-dots');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const slides = document.querySelectorAll('.slide');

        if (!sliderTrack || !slides.length) {
            console.warn('Slider elements not found');
            return;
        }

        this.totalSlides = slides.length;
        this.sliderTrack = sliderTrack;

        // Create slider dots
        if (sliderDots) {
            sliderDots.innerHTML = '';
            for (let i = 0; i < this.totalSlides; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(i));
                sliderDots.appendChild(dot);
            }
        }

        // Navigation buttons
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());

        // Initialize testimonial slider
        this.initializeTestimonialSlider();

        // Start auto-play
        this.startSliderAutoplay();
    }

    initializeTestimonialSlider() {
        const testimonialTrack = document.getElementById('testimonial-track');
        const testimonialDots = document.getElementById('testimonial-dots');
        const testimonialSlides = document.querySelectorAll('.testimonial-slide');

        if (!testimonialTrack || !testimonialSlides.length) {
            console.warn('Testimonial slider elements not found');
            return;
        }

        this.totalTestimonials = testimonialSlides.length;
        this.testimonialTrack = testimonialTrack;

        // Create testimonial dots
        if (testimonialDots) {
            testimonialDots.innerHTML = '';
            for (let i = 0; i < this.totalTestimonials; i++) {
                const dot = document.createElement('div');
                dot.classList.add('testimonial-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToTestimonial(i));
                testimonialDots.appendChild(dot);
            }
        }

        this.startTestimonialAutoplay();
    }

    goToSlide(slideIndex) {
        if (slideIndex === this.currentSlide || this.isAnimating) return;
        
        this.isAnimating = true;
        this.currentSlide = slideIndex;
        
        if (this.sliderTrack) {
            this.sliderTrack.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        }
        
        // Update dots
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });

        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    }

    goToTestimonial(testimonialIndex) {
        this.currentTestimonial = testimonialIndex;
        
        if (this.testimonialTrack) {
            this.testimonialTrack.style.transform = `translateX(-${this.currentTestimonial * 100}%)`;
        }
        
        const testDots = document.querySelectorAll('.testimonial-dot');
        testDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentTestimonial);
        });
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(this.currentSlide);
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(this.currentSlide);
    }

    nextTestimonial() {
        this.currentTestimonial = (this.currentTestimonial + 1) % this.totalTestimonials;
        this.goToTestimonial(this.currentTestimonial);
    }

    startSliderAutoplay() {
        if (this.sliderInterval) clearInterval(this.sliderInterval);
        this.sliderInterval = setInterval(() => this.nextSlide(), 5000);

        // Pause on hover
        const sliderContainer = document.querySelector('.slider-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => {
                clearInterval(this.sliderInterval);
            });

            sliderContainer.addEventListener('mouseleave', () => {
                this.startSliderAutoplay();
            });
        }
    }

    startTestimonialAutoplay() {
        if (this.testimonialInterval) clearInterval(this.testimonialInterval);
        this.testimonialInterval = setInterval(() => this.nextTestimonial(), 4000);

        // Pause on hover
        const testimonialContainer = document.querySelector('.testimonial-slider');
        if (testimonialContainer) {
            testimonialContainer.addEventListener('mouseenter', () => {
                clearInterval(this.testimonialInterval);
            });

            testimonialContainer.addEventListener('mouseleave', () => {
                this.startTestimonialAutoplay();
            });
        }
    }

    // Search functionality
    initializeSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');

        if (!searchInput) {
            console.warn('Search input not found');
            return;
        }

        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        searchInput.addEventListener('focus', () => {
            if (searchInput.value.trim() && searchResults) {
                searchResults.classList.add('active');
            }
        });

        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (searchResults && !searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.remove('active');
            }
        });
    }

    handleSearch(query) {
        const searchResults = document.getElementById('searchResults');
        if (!searchResults) return;

        const trimmedQuery = query.toLowerCase().trim();
        
        if (trimmedQuery.length === 0) {
            searchResults.classList.remove('active');
            return;
        }

        const filteredProducts = this.products.filter(product => 
            product.name.toLowerCase().includes(trimmedQuery) ||
            product.category.toLowerCase().includes(trimmedQuery) ||
            product.tags.some(tag => tag.toLowerCase().includes(trimmedQuery))
        );

        this.displaySearchResults(filteredProducts, searchResults);
    }

    displaySearchResults(results, container) {
        container.innerHTML = '';
        
        if (results.length === 0) {
            container.innerHTML = '<div class="search-result-item">Tidak ada produk ditemukan</div>';
        } else {
            results.forEach(product => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.innerHTML = `
                    <div class="search-result-item-info">
                        <h4>${product.name}</h4>
                        <p>Rp ${product.price.toLocaleString('id-ID')} • Rating ${product.rating}</p>
                    </div>
                `;
                resultItem.addEventListener('click', () => {
                    document.getElementById('searchInput').value = product.name;
                    container.classList.remove('active');
                    this.scrollToProducts();
                });
                container.appendChild(resultItem);
            });
        }
        
        container.classList.add('active');
    }

    scrollToProducts() {
        const productsSection = document.getElementById('products') || document.querySelector('.featured-products');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Filter functionality
    initializeFilters() {
        const categoryFilter = document.getElementById('categoryFilter');
        const priceFilter = document.getElementById('priceFilter');
        const ratingFilter = document.getElementById('ratingFilter');
        const filterTags = document.querySelectorAll('.filter-tag');
        const clearFilters = document.getElementById('clearFilters');

        if (categoryFilter) categoryFilter.addEventListener('change', () => this.applyFilters());
        if (priceFilter) priceFilter.addEventListener('change', () => this.applyFilters());
        if (ratingFilter) ratingFilter.addEventListener('change', () => this.applyFilters());
        
        filterTags.forEach(tag => {
            tag.addEventListener('click', () => {
                tag.classList.toggle('active');
                this.applyFilters();
            });
        });

        if (clearFilters) {
            clearFilters.addEventListener('click', () => {
                if (categoryFilter) categoryFilter.value = '';
                if (priceFilter) priceFilter.value = '';
                if (ratingFilter) ratingFilter.value = '';
                filterTags.forEach(tag => tag.classList.remove('active'));
                this.applyFilters();
            });
        }
    }

    applyFilters() {
        const categoryFilter = document.getElementById('categoryFilter');
        const priceFilter = document.getElementById('priceFilter');
        const ratingFilter = document.getElementById('ratingFilter');
        const filterTags = document.querySelectorAll('.filter-tag');

        const category = categoryFilter ? categoryFilter.value : '';
        const priceRange = priceFilter ? priceFilter.value : '';
        const minRating = ratingFilter ? parseFloat(ratingFilter.value) || 0 : 0;
        const activeTags = Array.from(filterTags)
            .filter(tag => tag.classList.contains('active'))
            .map(tag => tag.dataset.tag);

        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const cardCategory = card.dataset.category;
            const cardPrice = parseInt(card.dataset.price);
            const cardRating = parseFloat(card.dataset.rating);
            const cardTags = card.dataset.tags ? card.dataset.tags.split(',') : [];

            let showCard = true;

            // Apply filters
            if (category && cardCategory !== category) showCard = false;
            
            if (priceRange) {
                const [minPrice, maxPrice] = priceRange.split('-').map(Number);
                if (cardPrice < minPrice || cardPrice > maxPrice) showCard = false;
            }
            
            if (cardRating < minRating) showCard = false;
            
            if (activeTags.length > 0) {
                const hasMatchingTag = activeTags.some(tag => cardTags.includes(tag));
                if (!hasMatchingTag) showCard = false;
            }

            // Show/hide with animation
            if (showCard) {
                card.style.display = 'block';
                card.classList.remove('hidden');
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                    card.classList.add('hidden');
                }, 300);
            }
        });
    }

    // Chat functionality
    initializeChat() {
        const chatButton = document.getElementById('chatButton');
        const chatWindow = document.getElementById('chatWindow');
        const chatClose = document.getElementById('chatClose');
        const chatInput = document.getElementById('chatInput');

        if (!chatButton || !chatWindow) {
            console.warn('Chat elements not found');
            return;
        }

        chatButton.addEventListener('click', () => {
            chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
        });

        if (chatClose) {
            chatClose.addEventListener('click', () => {
                chatWindow.style.display = 'none';
            });
        }

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
    }

    sendMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();
        if (!message) return;

        this.addChatMessage(message, 'user');
        chatInput.value = '';

        // Simulate bot response
        setTimeout(() => {
            const botResponse = this.getBotResponse(message);
            this.addChatMessage(botResponse, 'bot');
        }, 1000);
    }

    addChatMessage(message, sender) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    getBotResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('harga') || lowerMessage.includes('price')) {
            return 'Harga produk kami bervariasi mulai dari 3.5 juta hingga 15 juta rupiah. Apakah ada produk spesifik yang ingin Anda tanyakan?';
        } else if (lowerMessage.includes('garansi')) {
            return 'Semua produk TheMar dilengkapi garansi 5 tahun untuk kerusakan manufaktur. Garansi tidak berlaku untuk kerusakan akibat pemakaian tidak wajar.';
        } else if (lowerMessage.includes('pengiriman') || lowerMessage.includes('kirim')) {
            return 'Kami menyediakan pengiriman gratis untuk pembelian di atas 5 juta rupiah ke seluruh Indonesia. Estimasi pengiriman 3-7 hari kerja.';
        } else if (lowerMessage.includes('custom') || lowerMessage.includes('pesanan khusus')) {
            return 'Ya, kami menerima pesanan custom design. Tim desainer kami akan membantu mewujudkan furniture sesuai kebutuhan Anda. Silakan hubungi tim konsultan kami.';
        } else {
            return 'Terima kasih atas pertanyaan Anda. Tim customer service kami akan segera membantu Anda. Untuk informasi lebih detail, silakan hubungi +62 21 1234 5678.';
        }
    }

    // FAQ functionality
    initializeFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    
                    // Close all other FAQ items
                    faqItems.forEach(otherItem => {
                        otherItem.classList.remove('active');
                    });
                    
                    // Toggle current item
                    if (!isActive) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    // Cart functionality
    initializeCart() {
        this.updateCartCount();
        
        document.querySelectorAll('.add-to-cart, .btn-primary').forEach(button => {
            button.addEventListener('click', (e) => {
                if (button.textContent.toLowerCase().includes('keranjang') || 
                    button.textContent.toLowerCase().includes('cart')) {
                    e.preventDefault();
                    this.addToCart(button);
                }
            });
        });
    }

    addToCart(button) {
        const originalText = button.textContent;
        
        // Add animation effect
        button.style.transform = 'scale(0.95)';
        button.style.background = '#10B981';
        button.textContent = 'Ditambahkan!';
        button.disabled = true;
        
        // Update cart count
        this.cartCount++;
        this.updateCartCount();
        localStorage.setItem('cartCount', this.cartCount.toString());
        
        setTimeout(() => {
            button.style.transform = 'scale(1)';
            button.style.background = '';
            button.textContent = originalText;
            button.disabled = false;
        }, 2000);
        
        // Show notification
        this.showNotification('Produk berhasil ditambahkan ke keranjang!');
    }

    updateCartCount() {
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = this.cartCount;
            
            if (this.cartCount > 0) {
                cartCountElement.style.display = 'flex';
                cartCountElement.classList.add('pulse');
                setTimeout(() => {
                    cartCountElement.classList.remove('pulse');
                }, 1000);
            } else {
                cartCountElement.style.display = 'none';
            }
        }
    }

    // Newsletter functionality
    initializeNewsletter() {
        const newsletterForm = document.getElementById('newsletter-form') || 
                             document.querySelector('.newsletter-form');
        
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = newsletterForm.querySelector('input[type="email"]').value;
                const button = newsletterForm.querySelector('button');
                
                if (email) {
                    const originalText = button.textContent;
                    button.textContent = 'Mengirim...';
                    button.disabled = true;
                    
                    // Simulate API call
                    setTimeout(() => {
                        this.showNotification('Terima kasih! Anda telah berlangganan newsletter kami.');
                        newsletterForm.querySelector('input[type="email"]').value = '';
                        button.textContent = originalText;
                        button.disabled = false;
                    }, 2000);
                }
            });
        }
    }

    // Scroll effects
    initializeScrollEffects() {
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.main-header');
            const scrollToTop = document.getElementById('scrollToTop');
            
            if (window.scrollY > 100) {
                if (header) {
                    header.classList.add('header-scrolled');
                }
                if (scrollToTop) {
                    scrollToTop.classList.add('visible');
                }
            } else {
                if (header) {
                    header.classList.remove('header-scrolled');
                }
                if (scrollToTop) {
                    scrollToTop.classList.remove('visible');
                }
            }
        });

        // Scroll to top functionality
        const scrollToTop = document.getElementById('scrollToTop');
        if (scrollToTop) {
            scrollToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Mobile menu
    initializeMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mainNav = document.querySelector('.main-nav');

        if (mobileMenuBtn && mainNav) {
            mobileMenuBtn.addEventListener('click', () => {
                mainNav.classList.toggle('mobile-open');
                mobileMenuBtn.classList.toggle('open');
                document.body.classList.toggle('no-scroll');
            });

            // Close menu when clicking nav links
            mainNav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mainNav.classList.remove('mobile-open');
                    mobileMenuBtn.classList.remove('open');
                    document.body.classList.remove('no-scroll');
                });
            });
        }
    }

    // Animations
    initializeAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const elementsToObserve = [
            '.product-card',
            '.testimonial-card',
            '.article-card',
            '.service-card',
            '.faq-item'
        ];

        elementsToObserve.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                observer.observe(element);
            });
        });

        // Counter animation for stats
        this.animateCounters();
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number, .about-stat-number');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.textContent.replace(/\D/g, '')) || 
                                  parseInt(counter.getAttribute('data-target')) || 0;
                    
                    if (target > 0) {
                        this.animateCounter(counter, target);
                        counterObserver.unobserve(counter);
                    }
                }
            });
        });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    animateCounter(element, target) {
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                element.textContent = Math.ceil(current).toLocaleString('id-ID');
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString('id-ID');
            }
        };
        
        updateCounter();
    }

    // Keyboard navigation
    initializeKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            } else if (e.key === 'Escape') {
                // Close any open modals or menus
                const mainNav = document.querySelector('.main-nav');
                const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
                const chatWindow = document.getElementById('chatWindow');
                const searchResults = document.getElementById('searchResults');
                
                if (mainNav) mainNav.classList.remove('mobile-open');
                if (mobileMenuBtn) mobileMenuBtn.classList.remove('open');
                if (chatWindow) chatWindow.style.display = 'none';
                if (searchResults) searchResults.classList.remove('active');
                
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // Touch gestures
    initializeTouchGestures() {
        const sliderContainer = document.querySelector('.slider-container');
        const testimonialContainer = document.querySelector('.testimonial-slider');

        if (sliderContainer) {
            sliderContainer.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
            });

            sliderContainer.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.handleSliderSwipe();
            });
        }

        if (testimonialContainer) {
            testimonialContainer.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
            });

            testimonialContainer.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.handleTestimonialSwipe();
            });
        }
    }

    handleSliderSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }

    handleTestimonialSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.currentTestimonial = (this.currentTestimonial + 1) % this.totalTestimonials;
            } else {
                this.currentTestimonial = (this.currentTestimonial - 1 + this.totalTestimonials) % this.totalTestimonials;
            }
            this.goToTestimonial(this.currentTestimonial);
        }
    }

    // Notification system
    showNotification(message, type = 'success') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            notification.remove();
        });

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Error handling for images
    initializeImageErrorHandling() {
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', function() {
                if (!this.hasAttribute('data-error-handled')) {
                    this.setAttribute('data-error-handled', 'true');
                    this.src = '/placeholder.svg?height=300&width=400';
                    this.alt = 'Image not available';
                }
            });
        });
    }

    // Cleanup method
    destroy() {
        if (this.sliderInterval) clearInterval(this.sliderInterval);
        if (this.testimonialInterval) clearInterval(this.testimonialInterval);
    }
}

// Initialize the landing page manager
let landingPageManager;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        landingPageManager = new LandingPageManager();
    });
} else {
    landingPageManager = new LandingPageManager();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (landingPageManager) {
        landingPageManager.destroy();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LandingPageManager;
}
