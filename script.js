const CART_KEY = 'radoCart';
const WISHLIST_KEY = 'radoWishlist';

document.addEventListener('DOMContentLoaded', () => {
    initCart();
    initWishlist();
    initForms();
    initRevealAnimation();
    initSmoothScroll();
});

function initCart() {
    updateCartCount();
    bindAddToCartButtons();

    if (window.location.pathname.endsWith('cart.html')) {
        displayCart();
    }
}

function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function bindAddToCartButtons() {
    const buttons = document.querySelectorAll('.add-to-cart-btn');

    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.product-card');
            if (!card) return;

            const product = {
                model: card.querySelector('.model')?.textContent?.trim() || 'Rado Watch',
                price: card.querySelector('.price')?.textContent?.trim() || '₹0',
                image: card.querySelector('img')?.getAttribute('src') || 'img/RADO_LOGO.jpg'
            };

            addToCart(product);
        });
    });
}

function addToCart(product) {
    const cart = getCart();
    cart.push(product);
    saveCart(cart);
    updateCartCount();
    showToast(`${product.model} added to cart`);
}

function updateCartCount() {
    const cart = getCart();
    const countElements = document.querySelectorAll('.cart-count');

    countElements.forEach((el) => {
        el.innerText = cart.length;
    });
}

function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total-price');
    if (!cartItemsContainer) return;

    const cart = getCart();
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<tr><td colspan="5" class="empty-cart-msg">Your cart is empty.</td></tr>';
        if (cartTotalElement) cartTotalElement.innerText = '₹0';
        return;
    }

    let total = 0;
    cart.forEach((item, index) => {
        const price = parseInt(String(item.price).replace(/[^0-9]/g, ''), 10) || 0;
        total += price;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${item.image}" alt="${item.model}" class="cart-item-img"></td>
            <td>${item.model}</td>
            <td>${item.price}</td>
            <td>1</td>
            <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Remove</button></td>
        `;
        cartItemsContainer.appendChild(row);
    });

    if (cartTotalElement) {
        cartTotalElement.innerText = `₹${total.toLocaleString('en-IN')}`;
    }
}

window.removeFromCart = function (index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    displayCart();
    updateCartCount();
};

function initWishlist() {
    const hearts = document.querySelectorAll('.heart');
    if (!hearts.length) return;

    const saved = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];

    hearts.forEach((heart, index) => {
        const icon = heart.querySelector('i');
        if (!icon) return;

        if (saved.includes(index)) {
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
            icon.style.color = '#d11a2a';
        }

        heart.addEventListener('click', () => {
            let wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
            const exists = wishlist.includes(index);

            if (exists) {
                wishlist = wishlist.filter((i) => i !== index);
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
                icon.style.color = '';
            } else {
                wishlist.push(index);
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
                icon.style.color = '#d11a2a';
            }

            localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
        });
    });
}

function initForms() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            contactForm.reset();
            showToast('Message sent successfully');
        });
    }

    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (event) => {
            event.preventDefault();
            newsletterForm.reset();
            showToast('Thanks for subscribing');
        });
    }
}

function initRevealAnimation() {
    const sections = document.querySelectorAll('.section-wrap, .about-section, .product-grid, .contact-section, .cart-container');
    if (!sections.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    sections.forEach((section) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(section);
    });
}

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
        link.addEventListener('click', (event) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.right = '20px';
    toast.style.bottom = '20px';
    toast.style.background = '#111';
    toast.style.color = '#fff';
    toast.style.padding = '10px 14px';
    toast.style.borderRadius = '5px';
    toast.style.zIndex = '9999';
    toast.style.fontSize = '14px';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 250);
    }, 1800);
}
