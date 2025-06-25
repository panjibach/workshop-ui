
        // Cart data
        let cartData = [
            {
                id: 1,
                name: "Lemari Pakaian Multifungsi",
                price: 6500000,
                quantity: 1,
                image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=120&h=120&fit=crop"
            },
            {
                id: 2,
                name: "Meja Kopi Marmer",
                price: 7800000,
                originalPrice: 8500000,
                quantity: 1,
                image: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=120&h=120&fit=crop"
            },
            {
                id: 3,
                name: "Kursi Ergonomis Premium",
                price: 3500000,
                quantity: 1,
                image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=120&h=120&fit=crop"
            }
        ];

        // Initialize cart
        document.addEventListener('DOMContentLoaded', function() {
            updateCartDisplay();
            updateCartSummary();
        });

        // Update quantity
        function updateQuantity(itemId, change) {
            const item = cartData.find(item => item.id === itemId);
            if (item) {
                const newQuantity = item.quantity + change;
                if (newQuantity >= 1 && newQuantity <= 99) {
                    item.quantity = newQuantity;
                    updateQuantityDisplay(itemId, newQuantity);
                    updateCartSummary();
                    showNotification(`Jumlah ${item.name} diperbarui`);
                }
            }
        }

        // Update quantity from input
        function updateQuantityInput(itemId, value) {
            const quantity = parseInt(value);
            if (quantity >= 1 && quantity <= 99) {
                const item = cartData.find(item => item.id === itemId);
                if (item) {
                    item.quantity = quantity;
                    updateCartSummary();
                    showNotification(`Jumlah ${item.name} diperbarui`);
                }
            }
        }

        // Update quantity display
        function updateQuantityDisplay(itemId, quantity) {
            const cartItem = document.querySelector(`[data-id="${itemId}"]`);
            if (cartItem) {
                const quantityInput = cartItem.querySelector('.quantity-input');
                quantityInput.value = quantity;
            }
        }

        // Remove item from cart
        function removeItem(itemId) {
            const itemIndex = cartData.findIndex(item => item.id === itemId);
            if (itemIndex > -1) {
                const itemName = cartData[itemIndex].name;
                cartData.splice(itemIndex, 1);
                
                // Remove from DOM with animation
                const cartItem = document.querySelector(`[data-id="${itemId}"]`);
                if (cartItem) {
                    cartItem.style.animation = 'fadeOut 0.3s ease';
                    setTimeout(() => {
                        cartItem.remove();
                        updateCartDisplay();
                        updateCartSummary();
                        showNotification(`${itemName} dihapus dari keranjang`, 'error');
                    }, 300);
                }
            }
        }

        // Clear entire cart
        function clearCart() {
            if (confirm('Apakah Anda yakin ingin mengosongkan keranjang?')) {
                cartData = [];
                updateCartDisplay();
                updateCartSummary();
                showNotification('Keranjang berhasil dikosongkan', 'error');
            }
        }

        // Update cart display
        function updateCartDisplay() {
            const cartContent = document.getElementById('cartContent');
            const emptyCart = document.getElementById('emptyCart');
            const itemCount = document.getElementById('itemCount');
            const cartCount = document.getElementById('cartCount');

            if (cartData.length === 0) {
                cartContent.style.display = 'none';
                emptyCart.style.display = 'flex';
            } else {
                cartContent.style.display = 'block';
                emptyCart.style.display = 'none';
                
                const totalItems = cartData.reduce((sum, item) => sum + item.quantity, 0);
                itemCount.textContent = `${totalItems} item${totalItems > 1 ? 's' : ''}`;
                cartCount.textContent = totalItems;
            }
        }

        // Update cart summary
        function updateCartSummary() {
            const subtotalElement = document.getElementById('subtotal');
            const discountElement = document.getElementById('discount');
            const totalElement = document.getElementById('total');

            let subtotal = 0;
            cartData.forEach(item => {
                subtotal += item.price * item.quantity;
            });

            const discount = 700000; // Fixed discount for demo
            const total = subtotal - discount;

            subtotalElement.textContent = formatCurrency(subtotal);
            discountElement.textContent = `-${formatCurrency(discount)}`;
            totalElement.textContent = formatCurrency(total);
        }

        // Apply promo code
        function applyPromo() {
            const promoInput = document.getElementById('promoInput');
            const promoCode = promoInput.value.trim().toLowerCase();
            
            const validPromos = {
                'welcome10': { discount: 0.1, message: 'Diskon 10% berhasil diterapkan!' },
                'furniture20': { discount: 0.2, message: 'Diskon 20% berhasil diterapkan!' },
                'newuser': { discount: 0.15, message: 'Diskon 15% untuk pengguna baru!' }
            };

            if (validPromos[promoCode]) {
                showNotification(validPromos[promoCode].message);
                promoInput.value = '';
                // Apply discount logic here
            } else if (promoCode) {
                showNotification('Kode promo tidak valid', 'error');
            } else {
                showNotification('Masukkan kode promo', 'error');
            }
        }

        // Format currency
        function formatCurrency(amount) {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(amount).replace('IDR', 'Rp');
        }

        // Show notification
        function showNotification(message, type = 'success') {
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

        // Add fadeOut animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeOut {
                from {
                    opacity: 1;
                    transform: translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateY(-20px);
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
        `;
        document.head.appendChild(style);
