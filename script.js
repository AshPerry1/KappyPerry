// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Update aria-expanded
        const isExpanded = navMenu.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});


// Smooth scrolling for anchor links
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

// Add fade-in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all work cards and about cards
document.querySelectorAll('.work-card, .about-card, .credential-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Keyboard navigation for hamburger menu
if (hamburger) {
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            hamburger.click();
        }
    });
}

// ============================================
// GOOGLE ANALYTICS EVENT TRACKING
// ============================================

// Helper function to track events
function trackEvent(category, action, label, value) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value || 0
        });
    }
}

// Track page views with page title
function trackPageView(pageName) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: pageName,
            page_location: window.location.href
        });
    }
}

// Track current page on load
document.addEventListener('DOMContentLoaded', function() {
    const pageName = document.title || window.location.pathname;
    trackPageView(pageName);
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
            maxScroll = scrollPercent;
            trackEvent('Engagement', 'scroll_depth', `${scrollPercent}%`, scrollPercent);
        }
    });
});

// Track navigation menu clicks
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', function() {
        const pageName = this.textContent.trim();
        const href = this.getAttribute('href');
        trackEvent('Navigation', 'nav_click', `${pageName} (${href})`);
    });
});

// Track hamburger menu toggle
if (hamburger) {
    hamburger.addEventListener('click', function() {
        const isOpen = navMenu.classList.contains('active');
        trackEvent('Navigation', 'mobile_menu_toggle', isOpen ? 'Menu Opened' : 'Menu Closed');
    });
}

// Track CTA buttons (Download Resume, Contact Me, etc.)
document.querySelectorAll('.btn--primary, .btn--ghost').forEach(button => {
    button.addEventListener('click', function() {
        const buttonText = this.textContent.trim().replace(/\s+/g, ' ');
        const href = this.getAttribute('href') || 'no-href';
        trackEvent('CTA', 'button_click', buttonText, 1);
        
        // Track download events separately
        if (href.includes('.pdf') || this.hasAttribute('download')) {
            trackEvent('Download', 'resume_download', buttonText);
        }
    });
});

// Track homepage navigation buttons
document.querySelectorAll('.menu-stack .btn').forEach(button => {
    button.addEventListener('click', function() {
        const buttonText = this.textContent.trim();
        const hoverText = this.getAttribute('data-hover') || '';
        const href = this.getAttribute('href');
        trackEvent('Homepage', 'hero_button_click', `${buttonText} (${href})`);
        if (hoverText) {
            trackEvent('Homepage', 'hero_button_hover_shown', hoverText);
        }
    });
});

// Track social media icon clicks
document.querySelectorAll('.icon-btn, .hero__social a').forEach(icon => {
    icon.addEventListener('click', function() {
        const platform = this.getAttribute('aria-label') || 'Social Media';
        const href = this.getAttribute('href') || '';
        trackEvent('Social', 'icon_click', `${platform} (${href})`);
    });
});

// Track portfolio cards/interactions
document.querySelectorAll('.work-card, .leadership-card').forEach(card => {
    card.addEventListener('click', function(e) {
        // Only track if clicking on the card itself, not links inside
        if (e.target === this || !e.target.closest('a')) {
            const title = this.querySelector('h3')?.textContent.trim() || 'Unknown';
            trackEvent('Portfolio', 'card_view', title);
        }
    });
});

// Track certificate/image views
document.querySelectorAll('.work-image, .cert-img').forEach(image => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const alt = entry.target.getAttribute('alt') || 'Image';
                const src = entry.target.getAttribute('src') || '';
                trackEvent('Portfolio', 'certificate_view', alt);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(image);
});

// Track section visits (when sections come into view)
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.id || entry.target.className;
            const sectionName = entry.target.querySelector('h2')?.textContent.trim() || sectionId;
            if (sectionName) {
                trackEvent('Engagement', 'section_view', sectionName);
            }
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('section[id], .about-section, .work-grid').forEach(section => {
    sectionObserver.observe(section);
});

// Track internal link clicks
document.querySelectorAll('a[href^="#"], .portfolio-link, .intro-link-text').forEach(link => {
    link.addEventListener('click', function() {
        const linkText = this.textContent.trim();
        const href = this.getAttribute('href');
        trackEvent('Navigation', 'internal_link_click', `${linkText} (${href})`);
    });
});

// Track external link clicks
document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.addEventListener('click', function() {
        const linkText = this.textContent.trim() || 'External Link';
        const href = this.getAttribute('href');
        const domain = new URL(href).hostname;
        trackEvent('External', 'link_click', `${linkText} (${domain})`);
    });
});

// Track Career Impact section interactions
document.querySelectorAll('.career-impact, .transferable-skill').forEach(element => {
    element.addEventListener('mouseenter', function() {
        if (this.classList.contains('transferable-skill')) {
            const skill = this.textContent.trim();
        trackEvent('Portfolio', 'skill_hover', skill);
        }
    });
});

// Track form submissions (contact page)
const contactForm = document.querySelector('form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        trackEvent('Contact', 'form_submit', 'Contact Form Submitted');
        
        // Track form field interactions
        const fields = this.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            field.addEventListener('focus', function() {
                trackEvent('Contact', 'form_field_focus', this.name || this.type);
            });
        });
    });
}

// Track Google Form link clicks
const googleFormLink = document.querySelector('a[href*="docs.google.com/forms"]');
if (googleFormLink) {
    googleFormLink.addEventListener('click', function() {
        trackEvent('Contact', 'google_form_click', 'View Contact Form');
    });
}

// Track header navigation links (Certifications, Work Experience, etc.)
document.querySelectorAll('.header-nav .header-link').forEach(link => {
    link.addEventListener('click', function() {
        const linkText = this.textContent.trim();
        const href = this.getAttribute('href');
        trackEvent('Portfolio', 'header_nav_click', `${linkText} (${href})`);
    });
});

// Track resume downloads specifically
document.querySelectorAll('a[href*="Resume"], a[download*="Resume"], a[href$=".pdf"]').forEach(link => {
    link.addEventListener('click', function() {
        const fileName = this.getAttribute('href') || this.getAttribute('download') || 'resume.pdf';
        trackEvent('Download', 'file_download', fileName);
    });
});

// Track time on page (after 30 seconds)
setTimeout(function() {
    const pageName = document.title || window.location.pathname;
    trackEvent('Engagement', 'time_on_page', pageName, 30);
}, 30000);

// Track page exit (when user leaves)
window.addEventListener('beforeunload', function() {
    const timeOnPage = Math.round((Date.now() - performance.timing.navigationStart) / 1000);
    trackEvent('Engagement', 'page_exit', document.title, timeOnPage);
});

// ============================================
// WELCOME MODAL (First Visit Popup)
// ============================================

function showWelcomeModal() {
    const modal = document.getElementById('welcomeModal');
    const hasSeenWelcome = localStorage.getItem('kappyWelcomeSeen');
    
    // Only show on homepage and if not seen before
    if (modal && !hasSeenWelcome && (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/'))) {
        // Small delay to ensure page is loaded
        setTimeout(() => {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            
            // Track welcome modal view
            if (typeof trackEvent !== 'undefined') {
                trackEvent('Welcome', 'modal_view', 'First Visit Welcome');
            }
        }, 500);
    }
}

function closeWelcomeModal() {
    const modal = document.getElementById('welcomeModal');
    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Mark as seen (only on homepage)
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            localStorage.setItem('kappyWelcomeSeen', 'true');
            
            // Track welcome modal close
            if (typeof trackEvent !== 'undefined') {
                trackEvent('Welcome', 'modal_close', 'Welcome Dismissed');
            }
        }
    }
}

// Initialize welcome modal on page load
document.addEventListener('DOMContentLoaded', function() {
    showWelcomeModal();
    
    // Close button
    const closeBtn = document.getElementById('closeWelcome');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeWelcomeModal);
    }
    
    // Close on overlay click
    const modal = document.getElementById('welcomeModal');
    if (modal) {
        const overlay = modal.querySelector('.welcome-modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', closeWelcomeModal);
        }
        
        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeWelcomeModal();
            }
        });
    }
});

