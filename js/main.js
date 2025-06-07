// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Smooth scroll for navigation and footer quick links (including cross-page)
const allAnchors = document.querySelectorAll('a[href*="#"]');
allAnchors.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href.includes('#')) {
            const [page, hash] = href.split('#');
            if (!page || window.location.pathname.endsWith(page)) {
                const target = document.querySelector('#' + hash);
                if (target) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerOffset;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    if (typeof navLinks !== 'undefined' && typeof hamburger !== 'undefined') {
                        navLinks.classList.remove('active');
                        hamburger.classList.remove('active');
                    }
                }
            } else if (page === 'index.html') {
                // Cross-page scroll: store hash and redirect
                e.preventDefault();
                sessionStorage.setItem('scrollToHash', hash);
                window.location.href = href.split('#')[0];
            }
        }
    });
});

// On page load, if scrollToHash is set, scroll to that section with offset
window.addEventListener('DOMContentLoaded', () => {
    const hash = sessionStorage.getItem('scrollToHash');
    if (hash) {
        const target = document.getElementById(hash);
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
        sessionStorage.removeItem('scrollToHash');
    }
});

// Add scroll animation for elements
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Dynamic copyright year
document.querySelector('.footer-bottom p').innerHTML =
    `&copy; ${new Date().getFullYear()} AutoLensPro. Tüm hakları saklıdır.`;

// Image lazy loading
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// Prevent unwanted scroll jumps
window.addEventListener('beforeunload', function () {
    window.scrollTo(0, window.scrollY);
});

// Scroll to Top Button
const scrollToTopButton = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopButton.classList.add('visible');
    } else {
        scrollToTopButton.classList.remove('visible');
    }
});

scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Gallery Modal Functionality
const galleryItems = document.querySelectorAll('.gallery-item');
const modal = document.querySelector('.modal');
const modalImg = document.getElementById('modal-img');
const closeBtn = document.querySelector('.close');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const zoomInBtn = document.querySelector('.zoom-in-btn');
const zoomOutBtn = document.querySelector('.zoom-out-btn');

// Ensure modal is hidden by default
modal.style.display = 'none';

let currentIndex = 0;
let scale = 1;

galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentIndex = index;
        const img = item.querySelector('img');
        modal.style.display = 'flex';
        modalImg.src = img.src;
        scale = 1;
        modalImg.style.transform = `scale(${scale})`;
    });
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Close modal on ESC key press
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        modal.style.display = 'none';
    } else if (event.key === 'ArrowLeft') {
        navigateGallery(-1);
    } else if (event.key === 'ArrowRight') {
        navigateGallery(1);
    }
});

function navigateGallery(direction) {
    currentIndex = (currentIndex + direction + galleryItems.length) % galleryItems.length;
    const img = galleryItems[currentIndex].querySelector('img');
    modalImg.src = img.src;
    scale = 1;
    modalImg.style.transform = `scale(${scale})`;
}

prevBtn.addEventListener('click', () => navigateGallery(-1));
nextBtn.addEventListener('click', () => navigateGallery(1));

if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
        scale += 0.1;
        modalImg.style.transform = `scale(${scale})`;
    });
}
if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
        scale = Math.max(0.1, scale - 0.1);
        modalImg.style.transform = `scale(${scale})`;
    });
} 