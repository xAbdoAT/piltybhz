// Back to top button functionality
const backToTop = document.createElement('a');
backToTop.id = 'backToTop';
backToTop.href = '#';
backToTop.setAttribute('aria-label', 'Back to top');
backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(backToTop);

// Optimized scroll handling with debouncing
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }

    scrollTimeout = window.requestAnimationFrame(() => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
});

backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Enhanced download button interactions
document.querySelectorAll('.download-button').forEach(button => {
    // Hover effect
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = '0 4px 12px rgba(255, 0, 0, 0.3)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = 'none';
    });

    // Click feedback
    button.addEventListener('click', () => {
        // Store original text
        const originalText = button.innerHTML;
        
        // Show loading state
        button.style.opacity = '0.7';
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
        
        // Haptic feedback for mobile devices if supported
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(50);
        }
        
        // Reset after 2 seconds (simulated download start)
        setTimeout(() => {
            button.style.opacity = '1';
            button.innerHTML = originalText;
        }, 2000);
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Lazy loading for sections with Intersection Observer
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            // Stop observing after animation
            sectionObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '50px'
});

// Set up sections for lazy loading
document.querySelectorAll('.game-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.5s ease-out';
    sectionObserver.observe(section);
});

// Prevent zoom on mobile devices while maintaining accessibility
document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
});

// Add touch ripple effect for mobile
document.querySelectorAll('.download-button').forEach(button => {
    button.addEventListener('touchstart', function(e) {
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('span');
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;
        
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            width: 100px;
            height: 100px;
            left: ${x - 50}px;
            top: ${y - 50}px;
            transform: scale(0);
            transition: transform 0.5s, opacity 0.5s;
            opacity: 1;
        `;
        
        button.appendChild(ripple);
        requestAnimationFrame(() => {
            ripple.style.transform = 'scale(4)';
            ripple.style.opacity = '0';
        });
        
        setTimeout(() => ripple.remove(), 500);
    });
});

// Handle network status for download buttons
window.addEventListener('online', updateDownloadButtons);
window.addEventListener('offline', updateDownloadButtons);

function updateDownloadButtons() {
    const buttons = document.querySelectorAll('.download-button');
    if (navigator.onLine) {
        buttons.forEach(button => {
            button.style.opacity = '1';
            button.style.pointerEvents = 'auto';
        });
    } else {
        buttons.forEach(button => {
            button.style.opacity = '0.5';
            button.style.pointerEvents = 'none';
        });
    }
}

// Initial check
updateDownloadButtons();
