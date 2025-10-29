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

// Track all buttons (including btn--primary, btn--ghost, and generic .btn)
document.querySelectorAll('.btn--primary, .btn--ghost, button.btn, a.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Don't track if it's a form submit button (handled separately)
        if (this.type === 'submit') {
            return;
        }
        
        const buttonText = this.textContent.trim().replace(/\s+/g, ' ') || 'Button';
        const href = this.getAttribute('href') || 'no-href';
        const dataHover = this.getAttribute('data-hover') || '';
        
        trackEvent('CTA', 'button_click', `${buttonText}${href !== 'no-href' ? ' (' + href + ')' : ''}`, 1);
        
        // Track download events separately
        if (href.includes('.pdf') || this.hasAttribute('download')) {
            trackEvent('Download', 'file_download', buttonText);
        }
        
        // Track hover text if available
        if (dataHover) {
            trackEvent('CTA', 'button_hover_text', dataHover);
        }
    });
});

// Track homepage navigation buttons (also tracked above, but with specific homepage category)
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
    
    // Track hover events for homepage buttons
    button.addEventListener('mouseenter', function() {
        const hoverText = this.getAttribute('data-hover') || '';
        if (hoverText) {
            trackEvent('Homepage', 'hero_button_hover', hoverText);
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

// Track internal link clicks (anchor links and portfolio links)
document.querySelectorAll('a[href^="#"], .portfolio-link, .intro-link-text').forEach(link => {
    link.addEventListener('click', function() {
        const linkText = this.textContent.trim() || 'Internal Link';
        const href = this.getAttribute('href');
        trackEvent('Navigation', 'internal_link_click', `${linkText} (${href})`);
    });
});

// Track portfolio page links (links between pages)
document.querySelectorAll('a[href$=".html"], a[href^="about"], a[href^="mystory"], a[href^="contact"], a[href^="index"]').forEach(link => {
    // Skip external links already tracked
    if (!link.href.startsWith('http') || link.hostname === window.location.hostname) {
        link.addEventListener('click', function() {
            const linkText = this.textContent.trim() || 'Page Link';
            const href = this.getAttribute('href');
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            trackEvent('Navigation', 'page_link_click', `From ${currentPage} to ${linkText} (${href})`);
        });
    }
});

// Track external link clicks
document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.addEventListener('click', function() {
        const linkText = this.textContent.trim() || 'External Link';
        const href = this.getAttribute('href');
        try {
            const domain = new URL(href).hostname;
            trackEvent('External', 'link_click', `${linkText} (${domain})`);
        } catch (e) {
            trackEvent('External', 'link_click', `${linkText} (${href})`);
        }
    });
});

// Track mailto and tel links
document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', function() {
        const linkText = this.textContent.trim() || 'Contact Link';
        const href = this.getAttribute('href');
        const type = href.startsWith('mailto:') ? 'Email' : 'Phone';
        trackEvent('Contact', `${type.toLowerCase()}_click`, `${linkText} (${href})`);
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
const contactForm = document.querySelector('#contactForm, form');
if (contactForm) {
    // Track form field interactions
    const fields = contactForm.querySelectorAll('input, textarea, select');
    fields.forEach(field => {
        field.addEventListener('focus', function() {
            trackEvent('Contact', 'form_field_focus', this.name || this.id || this.type);
        });
        
        field.addEventListener('blur', function() {
            if (this.value.trim().length > 0) {
                trackEvent('Contact', 'form_field_completed', this.name || this.id || this.type);
            }
        });
    });
    
    // Track form submit button click
    const submitButton = contactForm.querySelector('button[type="submit"], input[type="submit"]');
    if (submitButton) {
        submitButton.addEventListener('click', function() {
            trackEvent('Contact', 'submit_button_click', 'Contact Form Submit Button');
        });
    }
    
    // Track form submission (already in contact form handler, but adding here for redundancy)
    contactForm.addEventListener('submit', function(e) {
        trackEvent('Contact', 'form_submit', 'Contact Form Submitted');
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
// COMPREHENSIVE INTERACTION TRACKING
// ============================================

// Track image hover (photo captions appearing)
document.querySelectorAll('figure, .hero__photo, .intro-photo-container, .work-image, .cert-img').forEach(imageContainer => {
    imageContainer.addEventListener('mouseenter', function() {
        const img = this.querySelector('img');
        if (img) {
            const alt = img.getAttribute('alt') || 'Image';
            trackEvent('Interaction', 'image_hover', alt);
        }
    });
});

// Track button hover events (duration)
const buttonHoverTimes = new Map();
document.querySelectorAll('.btn, button, a.btn, .icon-btn').forEach(button => {
    button.addEventListener('mouseenter', function() {
        buttonHoverTimes.set(this, Date.now());
        const buttonText = this.textContent.trim() || this.getAttribute('aria-label') || 'Button';
        trackEvent('Interaction', 'button_hover_start', buttonText);
    });
    
    button.addEventListener('mouseleave', function() {
        const startTime = buttonHoverTimes.get(this);
        if (startTime) {
            const duration = Math.round((Date.now() - startTime) / 1000);
            const buttonText = this.textContent.trim() || this.getAttribute('aria-label') || 'Button';
            trackEvent('Interaction', 'button_hover_end', buttonText, duration);
            buttonHoverTimes.delete(this);
        }
    });
    
    // Track keyboard focus
    button.addEventListener('focus', function() {
        const buttonText = this.textContent.trim() || this.getAttribute('aria-label') || 'Button';
        trackEvent('Accessibility', 'keyboard_focus', buttonText);
    });
});

// Track link hover events
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('mouseenter', function() {
        const linkText = this.textContent.trim() || this.getAttribute('aria-label') || 'Link';
        const href = this.getAttribute('href') || '';
        trackEvent('Interaction', 'link_hover', `${linkText} (${href.substring(0, 50)})`);
    });
});

// Track form field errors (invalid submissions)
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('invalid', function(e) {
        const invalidField = e.target;
        const fieldName = invalidField.name || invalidField.id || 'Unknown Field';
        const validationMessage = invalidField.validationMessage || 'Invalid input';
        trackEvent('Form', 'validation_error', `${fieldName}: ${validationMessage}`, 1);
    }, true);
    
    // Track invalid field on blur
    form.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('invalid', function() {
            trackEvent('Form', 'field_invalid', this.name || this.id || this.type);
        });
    });
});

// Track copy events (text selection and copy)
let selectedText = '';
document.addEventListener('selectionchange', function() {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
        selectedText = selection.toString().substring(0, 100);
    }
});

document.addEventListener('copy', function() {
    if (selectedText) {
        trackEvent('Interaction', 'text_copied', selectedText.substring(0, 50));
    }
});

// Track print events
window.addEventListener('beforeprint', function() {
    trackEvent('Interaction', 'print_initiated', document.title);
});

// Track window focus/blur (tab switching)
let pageStartTime = Date.now();
let totalActiveTime = 0;
let lastActiveTime = Date.now();

window.addEventListener('focus', function() {
    lastActiveTime = Date.now();
    trackEvent('Engagement', 'tab_focused', document.title);
});

window.addEventListener('blur', function() {
    const activeTime = Math.round((Date.now() - lastActiveTime) / 1000);
    totalActiveTime += activeTime;
    trackEvent('Engagement', 'tab_unfocused', document.title, activeTime);
});

// Track page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        trackEvent('Engagement', 'page_hidden', document.title);
    } else {
        trackEvent('Engagement', 'page_visible', document.title);
    }
});

// Track viewport resize events
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        let deviceType = 'Desktop';
        if (width < 480) deviceType = 'Mobile Small';
        else if (width < 768) deviceType = 'Mobile';
        else if (width < 968) deviceType = 'Tablet';
        trackEvent('Technical', 'viewport_resize', `${deviceType} (${width}x${height})`);
    }, 500);
});

// Track keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Track Escape key
    if (e.key === 'Escape') {
        trackEvent('Interaction', 'escape_key_pressed', document.title);
    }
    
    // Track Ctrl/Cmd + key combinations
    if ((e.ctrlKey || e.metaKey)) {
        if (e.key === 's' || e.key === 'S') {
            e.preventDefault();
            trackEvent('Interaction', 'save_shortcut', document.title);
        }
        if (e.key === 'p' || e.key === 'P') {
            trackEvent('Interaction', 'print_shortcut', document.title);
        }
        if (e.key === 'f' || e.key === 'F') {
            trackEvent('Interaction', 'find_shortcut', document.title);
        }
    }
    
    // Track Enter key on focusable elements
    if (e.key === 'Enter' && (e.target.tagName === 'BUTTON' || e.target.tagName === 'A')) {
        trackEvent('Accessibility', 'keyboard_navigation', `${e.target.tagName} - Enter key`);
    }
    
    // Track Tab navigation
    if (e.key === 'Tab') {
        const focusedElement = document.activeElement;
        const elementType = focusedElement.tagName || 'Unknown';
        const elementText = focusedElement.textContent?.trim().substring(0, 30) || focusedElement.getAttribute('aria-label') || '';
        trackEvent('Accessibility', 'tab_navigation', `${elementType}${elementText ? ': ' + elementText : ''}`);
    }
});

// Track mouse/touch down events (engagement indicator)
let mouseDownTime = null;
document.addEventListener('mousedown', function() {
    mouseDownTime = Date.now();
});

document.addEventListener('mouseup', function() {
    if (mouseDownTime) {
        const duration = Date.now() - mouseDownTime;
        if (duration > 1000) {
            trackEvent('Interaction', 'long_press', `${duration}ms`, Math.round(duration / 1000));
        }
        mouseDownTime = null;
    }
});

// Track touch events (mobile)
document.addEventListener('touchstart', function() {
    trackEvent('Technical', 'touch_interaction', 'Touch Start');
});

// Track scroll direction changes
let lastScrollTop = 0;
let scrollDirection = 'down';
window.addEventListener('scroll', function() {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const newScrollDirection = currentScrollTop > lastScrollTop ? 'down' : 'up';
    
    if (newScrollDirection !== scrollDirection) {
        scrollDirection = newScrollDirection;
        trackEvent('Engagement', 'scroll_direction_change', scrollDirection);
    }
    
    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
});

// Track smooth scroll completions
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId) {
            setTimeout(function() {
                const target = document.querySelector(targetId);
                if (target) {
                    const rect = target.getBoundingClientRect();
                    if (rect.top >= 0 && rect.top <= 50) {
                        trackEvent('Navigation', 'smooth_scroll_complete', targetId);
                    }
                }
            }, 1000);
        }
    });
});

// Track image load success/failure
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
        trackEvent('Technical', 'image_loaded', this.getAttribute('src')?.split('/').pop() || 'Image');
    });
    
    img.addEventListener('error', function() {
        trackEvent('Technical', 'image_load_error', this.getAttribute('src')?.split('/').pop() || 'Image');
    });
});

// Track video interactions (if any videos are added later)
document.querySelectorAll('video').forEach(video => {
    video.addEventListener('play', function() {
        trackEvent('Media', 'video_play', this.getAttribute('src') || 'Video');
    });
    
    video.addEventListener('pause', function() {
        trackEvent('Media', 'video_pause', this.getAttribute('src') || 'Video');
    });
    
    video.addEventListener('ended', function() {
        trackEvent('Media', 'video_complete', this.getAttribute('src') || 'Video');
    });
});

// Track accordion/collapsible interactions
document.querySelectorAll('[aria-expanded]').forEach(element => {
    element.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        const elementText = this.textContent.trim().substring(0, 30) || 'Collapsible';
        trackEvent('Interaction', isExpanded ? 'accordion_close' : 'accordion_open', elementText);
    });
});

// Track download link hover (before click)
document.querySelectorAll('a[download], a[href*=".pdf"]').forEach(link => {
    link.addEventListener('mouseenter', function() {
        const fileName = this.getAttribute('download') || this.getAttribute('href')?.split('/').pop() || 'File';
        trackEvent('Download', 'download_link_hover', fileName);
    });
});

// Track portfolio card hover duration
const cardHoverTimes = new Map();
document.querySelectorAll('.work-card, .leadership-card, .about-card, .value-item, .hobby-item').forEach(card => {
    card.addEventListener('mouseenter', function() {
        cardHoverTimes.set(this, Date.now());
        const title = this.querySelector('h2, h3')?.textContent.trim() || 'Card';
        trackEvent('Portfolio', 'card_hover_start', title);
    });
    
    card.addEventListener('mouseleave', function() {
        const startTime = cardHoverTimes.get(this);
        if (startTime) {
            const duration = Math.round((Date.now() - startTime) / 1000);
            const title = this.querySelector('h2, h3')?.textContent.trim() || 'Card';
            trackEvent('Portfolio', 'card_hover_end', title, duration);
            cardHoverTimes.delete(this);
        }
    });
});

// Track skill tag hover
document.querySelectorAll('.tag, .skill-tags span').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        const tagText = this.textContent.trim();
        trackEvent('Portfolio', 'skill_tag_hover', tagText);
    });
});

// Track section title hover
document.querySelectorAll('.section-title-wrapper, h2, h3').forEach(title => {
    title.addEventListener('mouseenter', function() {
        const titleText = this.textContent.trim();
        trackEvent('Engagement', 'section_title_hover', titleText.substring(0, 50));
    });
});

// Track info card interactions
document.querySelectorAll('.info-item-card, .info-card').forEach(card => {
    card.addEventListener('click', function() {
        const title = this.querySelector('h3')?.textContent.trim() || 'Info Card';
        trackEvent('Contact', 'info_card_click', title);
    });
});

// Track back/forward button usage
window.addEventListener('popstate', function() {
    trackEvent('Navigation', 'browser_back_forward', 'Browser Navigation');
});

// Track page reload
window.addEventListener('beforeunload', function() {
    const isReload = performance.navigation.type === 1;
    if (isReload) {
        trackEvent('Technical', 'page_reload', document.title);
    }
});

// Track device orientation change (mobile)
window.addEventListener('orientationchange', function() {
    const orientation = window.orientation === 0 || window.orientation === 180 ? 'Portrait' : 'Landscape';
    trackEvent('Technical', 'orientation_change', orientation);
});

// Track window close attempt
window.addEventListener('beforeunload', function(e) {
    // Only track if there's unsaved form data
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            if (input.value.trim().length > 0) {
                trackEvent('Engagement', 'exit_with_form_data', 'User attempted to leave with form data');
            }
        });
    });
});

// Track long reading sessions (every 60 seconds after initial 30 seconds)
let readingSessionTime = 30000;
setInterval(function() {
    readingSessionTime += 60000;
    const minutes = Math.round(readingSessionTime / 60000);
    trackEvent('Engagement', 'reading_session', `${minutes} minutes on page`, minutes);
}, 60000);

// Track rapid clicks (potential issues)
let clickTimes = [];
document.addEventListener('click', function(e) {
    clickTimes.push(Date.now());
    clickTimes = clickTimes.filter(time => Date.now() - time < 1000);
    
    if (clickTimes.length > 5) {
        trackEvent('Technical', 'rapid_clicks', `${clickTimes.length} clicks in 1 second`, clickTimes.length);
    }
});

// Track PDF view attempts
document.querySelectorAll('a[href$=".pdf"], a[download*=".pdf"]').forEach(link => {
    link.addEventListener('click', function(e) {
        // Check if opening in new tab
        if (this.target === '_blank' || e.ctrlKey || e.metaKey) {
            trackEvent('Download', 'pdf_new_tab', this.getAttribute('href') || this.getAttribute('download'));
        } else {
            trackEvent('Download', 'pdf_same_tab', this.getAttribute('href') || this.getAttribute('download'));
        }
    });
});

// Track focus events on all interactive elements
document.querySelectorAll('input, textarea, select, button, a').forEach(element => {
    element.addEventListener('focus', function() {
        const elementType = this.tagName.toLowerCase();
        const elementName = this.name || this.id || this.getAttribute('aria-label') || this.textContent.trim().substring(0, 30) || 'Element';
        trackEvent('Accessibility', `${elementType}_focus`, elementName);
    });
});

// Track form field changes (not just blur)
document.querySelectorAll('input, textarea, select').forEach(field => {
    let lastValue = field.value;
    
    field.addEventListener('input', function() {
        if (this.value !== lastValue) {
            const fieldName = this.name || this.id || 'Field';
            trackEvent('Form', 'field_typing', fieldName);
            lastValue = this.value;
        }
    });
});

// Track context menu (right-click) usage
document.addEventListener('contextmenu', function(e) {
    const target = e.target.tagName.toLowerCase();
    trackEvent('Interaction', 'right_click', target);
});

// Track drag events
document.addEventListener('dragstart', function(e) {
    trackEvent('Interaction', 'drag_start', e.target.tagName.toLowerCase());
});

// Track zoom level changes (best effort)
let lastZoomLevel = window.devicePixelRatio;
window.addEventListener('resize', function() {
    setTimeout(function() {
        const currentZoom = window.devicePixelRatio;
        if (Math.abs(currentZoom - lastZoomLevel) > 0.1) {
            trackEvent('Technical', 'zoom_change', `${Math.round(currentZoom * 100)}%`);
            lastZoomLevel = currentZoom;
        }
    }, 300);
});

// ============================================
// WELCOME LETTER MODAL (First Visit Popup)
// ============================================

function showWelcomeModal() {
    const modal = document.getElementById('welcomeModal');
    const envelope = document.getElementById('letterEnvelope');
    const letterContent = document.getElementById('letterContent');
    const hasSeenWelcome = localStorage.getItem('kappyWelcomeSeen');
    
    // Only show on homepage and if not seen before
    if (modal && !hasSeenWelcome && (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/'))) {
        // Small delay to ensure page is loaded
        setTimeout(() => {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            
            // Ensure envelope is visible and letter is hidden
            if (envelope) {
                envelope.style.display = 'block';
            }
            if (letterContent) {
                letterContent.style.display = 'none';
                letterContent.classList.remove('open');
            }
            
            // Set current date
            const dateElement = document.getElementById('letterDate');
            if (dateElement) {
                const today = new Date();
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                dateElement.textContent = today.toLocaleDateString('en-US', options);
            }
            
            // Track welcome modal view
            if (typeof trackEvent !== 'undefined') {
                trackEvent('Welcome', 'letter_envelope_view', 'First Visit Envelope');
            }
        }, 500);
    }
}

function openLetter() {
    const envelope = document.getElementById('letterEnvelope');
    const letterContent = document.getElementById('letterContent');
    
    if (envelope && letterContent) {
        // Animate envelope closing
        envelope.style.animation = 'letterClose 0.4s ease-out forwards';
        
        setTimeout(() => {
            envelope.style.display = 'none';
            letterContent.style.display = 'block';
            letterContent.classList.add('open');
            
            // Track letter opened
            if (typeof trackEvent !== 'undefined') {
                trackEvent('Welcome', 'letter_opened', 'Letter Opened');
            }
        }, 200);
    }
}

function closeWelcomeModal() {
    const modal = document.getElementById('welcomeModal');
    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Reset states
        const envelope = document.getElementById('letterEnvelope');
        const letterContent = document.getElementById('letterContent');
        
        if (envelope) {
            envelope.style.display = 'block';
            envelope.style.animation = '';
        }
        if (letterContent) {
            letterContent.style.display = 'none';
            letterContent.classList.remove('open');
        }
        
        // Mark as seen (only on homepage)
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
            localStorage.setItem('kappyWelcomeSeen', 'true');
            
            // Track welcome modal close
            if (typeof trackEvent !== 'undefined') {
                trackEvent('Welcome', 'letter_closed', 'Letter Dismissed');
            }
        }
    }
}

// ============================================
// CONTACT FORM (Opens Email Client)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Create email subject
            const emailSubject = subject ? `Contact from ${name}: ${subject}` : `Contact from ${name}`;
            
            // Create email body
            const emailBody = `Hello Kappy,

${message}

---
From: ${name}
Email: ${email}
`;
            
            // Encode for mailto link
            const encodedSubject = encodeURIComponent(emailSubject);
            const encodedBody = encodeURIComponent(emailBody);
            
            // Create mailto link
            const mailtoLink = `mailto:kappabug@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;
            
            // Track form submission (this is tracked above in the form listener, but keeping for email client tracking)
            if (typeof trackEvent !== 'undefined') {
                trackEvent('Contact', 'form_email_client_opened', 'Email client opened with pre-filled message');
            }
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'form-success-message';
            successMessage.style.cssText = 'margin-top: 1.5rem; padding: 1rem; background: rgba(16, 185, 129, 0.1); color: #059669; border-radius: 8px; text-align: center; font-family: Montserrat, sans-serif;';
            successMessage.textContent = 'Opening your email client... Please send the email to complete your message.';
            
            // Remove any existing success message
            const existingMessage = contactForm.querySelector('.form-success-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            contactForm.appendChild(successMessage);
            
            // Remove message after 8 seconds
            setTimeout(() => {
                if (successMessage.parentNode) {
                    successMessage.remove();
                }
            }, 8000);
        });
    }
});

// Initialize welcome letter modal on page load
document.addEventListener('DOMContentLoaded', function() {
    showWelcomeModal();
    
    // Open letter button
    const openBtn = document.getElementById('openLetter');
    if (openBtn) {
        openBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openLetter();
        });
    }
    
    // Close buttons
    const closeBtn = document.getElementById('closeWelcome');
    const closeEnvelopeBtn = document.getElementById('closeWelcomeEnvelope');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeWelcomeModal);
    }
    
    if (closeEnvelopeBtn) {
        closeEnvelopeBtn.addEventListener('click', closeWelcomeModal);
    }
    
    // Close on overlay click (works for both envelope and letter)
    const modal = document.getElementById('welcomeModal');
    if (modal) {
        const overlay = modal.querySelector('.welcome-modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', function(e) {
                // Only close if clicking directly on overlay, not on modal content
                if (e.target === overlay) {
                    closeWelcomeModal();
                }
            });
        }
        
        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeWelcomeModal();
            }
        });
    }
    
    // Make sure close button works even if letter is dynamically shown
    // Re-query after letter opens to ensure it's attached
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'closeWelcome') {
            closeWelcomeModal();
        }
    });
});

