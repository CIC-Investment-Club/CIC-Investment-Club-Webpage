# CIC Investment Club Webpage

The official webpage for the Columbia International College (CIC) Investment Club. This platform provides members and prospective students with resources, market insights, and tools to build financial literacy.

## 📊 Project Progress Overview

The project has transitioned from a static informational landing page to an **interactive educational platform**. We have established a professional, high-performance foundation that prioritizes user engagement and mobile accessibility.

### 1. Core Infrastructure & Performance
- **Modular Architecture:** Refactored JavaScript into a robust, event-driven system.
- **Improved Connectivity:** Replaced page-reloading forms with **AJAX submissions**, providing instant feedback.
- **Optimized Loading:** Integrated **Lazy Loading** for all images and fine-tuned scroll animations to minimize browser overhead.

### 2. Functional & Interactive Layers
- **Interactive Charts:** Integrated **Chart.js** to provide visual growth curves for the Compound Interest Calculator.
- **Persistent Stock Watchlist:** Implemented a member watchlist using `LocalStorage` with real-time price updates.
- **Theme Switcher:** Added a **Dark Mode toggle** with preference persistence for a professional "finance terminal" aesthetic.
- **Investment Tools:** Launched a custom **Compound Interest Calculator** for real-time financial projections.
- **Enhanced UX:** Implemented a **mobile-responsive menu**, a "Back to Top" utility, and an intelligent **ScrollSpy** system for better orientation.

### 3. Visual & Aesthetic Polish
- **Dynamic Theming:** Built a CSS variable-based theming system for seamless light/dark mode transitions.
- **Brand Identity:** Refined the "Executive Team" and "Activities" sections with branded gradients, elevated shadows, and smooth micro-animations.
- **Live Data:** Enhanced the market ticker with robust error handling and seamless infinite looping.

## 🚀 Recommended Next Steps (High Priority)

To further elevate the platform and increase student engagement, the following updates are recommended:

1. **Dynamic Market News Feed:** Integrate a financial news API to pull the latest headlines directly into the "Insights" section.
2. **SVG Illustrations:** Replace generic icons with custom-branded SVG illustrations for the club's key activities.
3. **Member Dashboard:** Build a secure area for exclusive curriculum materials and club resources.

## 🛠️ Backend Development Plan

To support dynamic features like member dashboards and secure data fetching, we are transitioning to a **Node.js/Express** backend architecture.

### 1. Phase 1: Infrastructure & API Proxying
- **Server Setup:** Initialize a Node.js environment with Express.
- **Secure Proxy:** Move all financial data fetching (Yahoo Finance) to a server-side proxy to bypass CORS issues and improve reliability without relying on third-party proxies like AllOrigins.
- **Static Serving:** Configure the server to serve the existing frontend assets from a `/public` directory.

### 2. Phase 2: Data Persistence & News Integration
- **Database:** Integrate a lightweight database (e.g., MongoDB or SQLite) to store "Market Insights" and club resources.
- **News API:** Implement a server-side service to fetch and cache financial news, providing a single endpoint for the frontend.

### 3. Phase 3: Member Authentication
- **User Accounts:** Implement JWT-based authentication for club members.
- **Member-Only Content:** Create protected routes for exclusive curriculum materials and club-specific tools.

---

## 🗺️ Multi-Page Expansion Roadmap

As the CIC Investment Club grows, transitioning from a Single-Page Application (SPA) to a multi-page architecture will improve SEO, shareability, and content depth.

### 1. Proposed Page Structure
- **Home (`index.html`):** A high-level dashboard featuring the live ticker, hero mission, and "latest" snippets from other sections.
- **Market Insights (`/insights.html`):** A dedicated blog-style archive for member writing. This allows for individual article pages (e.g., `/insights/oil-and-stocks.html`) which are easier to share on social media.
- **Education Hub (`/resources.html`):** A structured learning center with categorized guides (Beginner, Intermediate, Advanced) and downloadable templates.
- **Investment Tools (`/tools.html`):** A full-screen "Terminal" experience featuring the Compound Interest Calculator alongside new tools like a DCF Valuation model and a Currency Converter.
- **About & Team (`/about.html`):** Detailed history of the club, our mission, and comprehensive biographies for the Executive Team.

### 2. Architectural Recommendations
- **Shared Component Strategy:** Since the site currently uses a JS-based component loader, we should migrate to a **Static Site Generator (SSG)** like Jekyll or Eleventy, or implement a backend (Node/Express) with a templating engine (EJS/Pug) to handle shared Headers, Footers, and the Market Ticker across all pages.
- **Navigation Update:** Replace internal anchor links (`#tools`) with absolute paths (`/tools.html`) and implement an "Active" state in the CSS to show users which page they are currently on.
- **URL Structure:** Implement a clean URL structure (e.g., `cic.com/insights` instead of `cic.com/insights.html`) using server-side redirects or a frontend routing library.

---

## Current Features

- **Real-time Market Ticker:** Live data for major U.S. indices.
- **Investment Tools:** Interactive compound interest calculator with **Chart.js visualization**.
- **Personalized Watchlist:** Save and track your favorite stocks across sessions.
- **Dark Mode:** Seamless theme switching for better accessibility and style.
- **Market Insights:** A platform for members to share financial analysis and perspectives.
- **Resource Hub:** Curated guides, templates, and learning materials.
- **Recruitment Portal:** Streamlined application process with AJAX feedback.

## Future Improvements & TODO List

### Functional Enhancements
- [x] **Stock Watchlist:** Personalized stock watchlist using LocalStorage.
- [ ] **Dynamic Events Calendar:** Google Calendar API integration.
- [ ] **Member Dashboard:** Secure area for exclusive curriculum materials.
- [ ] **Market News Feed:** Real-time financial news API integration.

### UI/UX Refinement
- [x] **Dark/Light Mode Toggle:** Theme switcher for accessibility.
- [ ] **Skeleton Loading States:** Better perceived performance during data fetching.
- [x] **Interactive Charts:** Chart.js visualization for calculator results.
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
