# CIC Investment Club Webpage

The official webpage for the Columbia International College (CIC) Investment Club. This platform provides members and prospective students with resources, market insights, and tools to build financial literacy.

## 📊 Project Progress Overview

The project has transitioned from a static informational landing page to an **interactive educational platform**. We have established a professional, high-performance foundation that prioritizes user engagement and mobile accessibility.

### 1. Core Infrastructure & Performance
- **Modular Architecture:** Refactored JavaScript into a robust, event-driven system.
- **Improved Connectivity:** Replaced page-reloading forms with **AJAX submissions**, providing instant feedback.
- **Optimized Loading:** Integrated **Lazy Loading** for all images and fine-tuned scroll animations to minimize browser overhead.

### 2. Functional & Interactive Layers
- **Investment Tools:** Launched a custom **Compound Interest Calculator** for real-time financial projections.
- **Enhanced UX:** Implemented a **mobile-responsive menu**, a "Back to Top" utility, and an intelligent **ScrollSpy** system for better orientation.

### 3. Visual & Aesthetic Polish
- **Brand Identity:** Refined the "Executive Team" and "Activities" sections with branded gradients, elevated shadows, and smooth micro-animations.
- **Live Data:** Enhanced the market ticker with robust error handling and seamless infinite looping.

## 🚀 Recommended Next Steps (High Priority)

To further elevate the platform and increase student engagement, the following updates are recommended:

1. **Visual Data Representation (Calculator Charts):** Integrate **Chart.js** to turn the calculator's numerical results into a dynamic growth curve.
2. **Persistent "Stock Watchlist":** Use `LocalStorage` to allow members to create a personalized watchlist that saves their favorite stocks across sessions.
3. **Dynamic Market News Feed:** Integrate a financial news API to pull the latest headlines directly into the "Insights" section.
4. **Dark Mode Toggle:** Implement a theme switcher to provide a sleek "finance terminal" aesthetic preferred by many users.

---

## Current Features

- **Real-time Market Ticker:** Live data for major U.S. indices.
- **Investment Tools:** Interactive compound interest calculator to visualize long-term growth.
- **Market Insights:** A platform for members to share financial analysis and perspectives.
- **Resource Hub:** Curated guides, templates, and learning materials.
- **Recruitment Portal:** Streamlined application process with AJAX feedback.

## Future Improvements & TODO List

### Functional Enhancements
- [ ] **Stock Watchlist:** Personalized stock watchlist using LocalStorage.
- [ ] **Dynamic Events Calendar:** Google Calendar API integration.
- [ ] **Member Dashboard:** Secure area for exclusive curriculum materials.
- [ ] **Market News Feed:** Real-time financial news API integration.

### UI/UX Refinement
- [ ] **Dark/Light Mode Toggle:** Theme switcher for accessibility.
- [ ] **Skeleton Loading States:** Better perceived performance during data fetching.
- [ ] **Interactive Charts:** Chart.js visualization for calculator results.
- [ ] **Search Functionality:** Global search bar for insights and resources.

### Visual Polish
- [ ] **SVG Illustrations:** Custom-branded SVG icons for activities.
- [ ] **Advanced Micro-animations:** Framer Motion-style entrance animations.
- [ ] **Custom Scrollbar:** Branded scrollbar styling.
- [ ] **Image Lightbox:** Better gallery viewing experience.

## Technologies Used

- **Frontend:** HTML5, CSS3 (Vanilla), JavaScript (ES6+)
- **APIs:** Yahoo Finance (via AllOrigins proxy)
- **Forms:** Formspree with AJAX integration
- **Fonts:** Google Fonts (Playfair Display, DM Sans, DM Mono)

---
*Created with purpose for the CIC Investment Club.*
