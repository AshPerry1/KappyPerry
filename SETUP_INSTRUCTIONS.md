# Setup Instructions for Kappy Perry's Portfolio

## Quick Start

Your portfolio website is ready to go! Here's what you need to customize before submitting:

## 1. Update Personal Information

### index.html (Homepage)
- Line 43: Update the intro paragraph with your actual background
- Line 50-51: Replace image placeholder with your professional headshot
- Lines 68-70: Adjust educational details if needed
- Line 86: Personalize the "Bug" nickname section to match your actual story

### contact.html
- Line 82: Replace `kappy.perry@example.com` with your actual email
- Line 90: Update LinkedIn profile URL to your real LinkedIn profile
- Line 98: Add your phone number (or remove this line if you prefer not to share)
- Lines 106: Update location if needed

## 2. Add Your Images

Replace all image placeholders with your actual photos:

**For index.html:**
- Professional headshot (hero section)
- Consider adding a personal photo in the "Personal Touches" section

**For work-samples.html:**
- Screenshot or badge for Google Analytics certification
- Screenshot or badge for Digital Marketing certification  
- Screenshot from marketing simulation
- Campaign screenshots/results for class projects
- Email campaign results/images

To add images:
1. Save images in a folder called `images/`
2. Replace the `<div class="image-placeholder">` with: `<img src="images/your-image.jpg" alt="Descriptive alt text">`
3. Make sure alt text describes what the image shows

Example:
```html
<img src="images/google-analytics-badge.jpg" alt="Google Analytics Individual Qualification certification badge">
```

## 3. Update Work Samples Content

### work-samples.html

For each project, update:
- Project titles (currently placeholder)
- Dates and meta information
- Your actual role and contributions
- Real results with concrete numbers
- Add any additional projects you have

**Required Elements:**
- 2 Industry Certifications (already have placeholders)
- 1 Marketing Simulation (already have placeholder)
- Additional class projects (adjust content to match your actual work)

## 4. Contact Form Setup

The form currently uses client-side validation and will show a success message when submitted. For it to actually send emails, you have two options:

### Option A: Use Formspree (Recommended)
1. Go to https://formspree.io
2. Sign up for a free account
3. Create a new form
4. Copy your form action URL
5. In `index.html` find the `<form id="contactForm">` and add:
   `action="your-formspree-url"` and `method="POST"`

### Option B: Leave as-is for class submission
- The form will show a success message
- Include a note in your submission that email sending requires backend setup
- Or provide a mailto: link as an alternative

## 5. Resume Download Link

Update the "Download Résumé" button:
- In `index.html` line 45, change `href="#"` to:
- `href="resume.pdf"` (after you add your resume PDF to the folder)

## 6. Final Checklist

Before submitting, make sure:

✅ All contact info is updated with real information  
✅ Images are replaced (or at minimum, add alt text describing what they should be)  
✅ LinkedIn profile link goes to your actual profile  
✅ Work samples accurately reflect your projects and results  
✅ All placeholder text is personalized to you  
✅ Test the site in multiple browsers  
✅ Test responsive design on mobile device  
✅ Check for any typos or grammar errors  

## 7. SEO Optimization

Already included in the code:
- ✅ Unique title tags on each page
- ✅ Meta descriptions for search results
- ✅ Proper heading hierarchy (H1, H2, H3)
- ✅ Internal links between pages
- ✅ Alt text placeholders (update with real descriptions)

## 8. Optional Enhancements

If you want to go the extra mile:

1. **Add more personal touches:**
   - Favorite quote or Bible verse in CTA section
   - More personal photos
   - Hobbies section

2. **Extra work samples:**
   - Add more class projects
   - Include internship experiences
   - Showcase leadership roles

3. **Animations:**
   - Already included: subtle hover effects and fade-ins
   - Working perfectly as-is

## Deploying Your Site

### Upload to your web host:
1. Compress all files (index.html, contact.html, work-samples.html, styles.css, script.js, images folder)
2. Upload to your hosting service (Reclaim Hosting, GitHub Pages, etc.)
3. Make sure the site is publicly accessible
4. Test the live URL
5. Submit URL to Canvas

### Important Notes:
- Site must be publicly accessible (no password)
- Check that all pages load correctly
- Test contact form functionality
- Verify mobile responsiveness

## Current Color Scheme

The site uses:
- **Carolina Blue** (#4B9CD3) - Primary color (Kappy loves this!)
- **Rose Pink** (#D13087) - Accent color for warmth and personality
- **White backgrounds** - Clean, professional, light
- **Charcoal text** - Easy to read, accessible

This palette is feminine, friendly, and professional - perfect for your personal brand! 💙

## Questions?

If you need to make changes to the design or functionality, I can help adjust the CSS, layout, or content to better match your vision.

---

Good luck with your portfolio! It's looking great! 🌟

