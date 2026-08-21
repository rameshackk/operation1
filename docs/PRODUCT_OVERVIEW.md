# Muthaleetu Thisai (முதலீட்டு திசை) - Product Overview, Roles & Feature Guide

## 1. Product Vision & Mission

**Muthaleetu Thisai (முதலீட்டு திசை)** is a comprehensive, bilingual (Tamil & English) digital wealth platform, investor education hub, and certified financial advisor directory. 

### Core Mission:
* **Democratize Financial Literacy**: Deliver clear, actionable mutual fund, stock market, and personal finance education in native Tamil and English.
* **Empower Long-Term Wealth Creation**: Guide everyday retail investors toward financial freedom through compounding SIPs, tax planning, and risk management.
* **Connect Verified Advisors**: Provide a platform for AMFI-registered Mutual Fund Distributors (MFDs) and Certified Financial Planners (CFP®) to publish insights and connect directly with investors.

---

## 2. Target Audience

1. **Retail Investors & Beginners**: Individuals seeking structured, easy-to-understand guidance on mutual funds, SIPs, gold bonds, and retirement planning.
2. **Experienced Market Participants**: Investors looking for daily market news, SEBI regulatory updates, IPO analysis, and sector research.
3. **AMFI Certified Advisors & Wealth Planners**: Professionals who want to publish research, build an authoritative presence, and offer direct consultations.

---

## 3. User Roles & Permission Matrix

| Capability / Feature | Public Guest (Unregistered) | Registered Investor (User) | Publisher / AMFI Advisor | Administrator |
| :--- | :---: | :---: | :---: | :---: |
| **Browse Landing Page & News** | ✅ | ✅ | ✅ | ✅ |
| **Interactive SIP & Risk Tools** | ✅ | ✅ | ✅ | ✅ |
| **View 882+ Video Masterclasses** | Preview | ✅ Full Access | ✅ Full Access | ✅ Full Access |
| **Save Bookmarks & Watch History**| ❌ | ✅ | ✅ | ✅ |
| **Manage Profile & Password** | ❌ | ✅ | ✅ | ✅ |
| **AMFI Credentials & Bio Setup** | ❌ | ❌ | ✅ | ✅ |
| **Article Studio (Draft & Publish)** | ❌ | ❌ | ✅ (Own) | ✅ (All) |
| **Admin Dashboard & Sync Controls** | ❌ | ❌ | ❌ | ✅ |

### Role Details:

#### 1. **Investor (Standard User)**
* Enjoys personalized access to 882+ Masterclasses.
* Maintains a personal watch history with playback resume capabilities.
* Saves favorite articles and masterclasses to bookmarks.
* Can verify and update their security password dynamically in Profile Settings.

#### 2. **Publisher (Certified AMFI Advisor / MFD)**
* Verified identity with badge, designation, and official AMFI Registration Number (ARN).
* Dedicated public advisor profile (`#/professionals/:id`) showcasing credentials, specializations, and direct WhatsApp consultation link.
* Access to **Article Studio** to draft, preview, and publish bilingual financial research and analysis.
* Ability to edit advisor photo, specialties, and bio directly from the Profile page.

#### 3. **Administrator**
* Full system oversight including YouTube video sync cron management.
* Moderation of user accounts, publisher credentials, and published articles.
* Administrative editing and curation of all platform content.

---

## 4. Key Platform Features & Modules

### 🎬 1. 882+ Masterclasses Cinema Video Hub (`#/videos`)
* **Massive Curated Library**: 882+ high-definition financial lessons categorised by Mutual Funds, Stock Market, IPOs, Gold & SGB Bonds, Tax Planning, and YouTube Shorts.
* **Cinematic Spotlight & Rails**: Features trending masterclasses and horizontal cinema rails for smooth exploration.
* **Optimized Grid & Batch Loading**: Initial batch of 48 videos with seamless background lookahead loading, "Load Next 48", and "Show All" options.
* **Interactive Cinema Modal**: Embedded player with timestamps, key financial principles/takeaways, and a quick-launch SIP calculator.

### ✍️ 2. Article Studio & Financial Journalism (`#/articles` & `#/admin/articles`)
* **Bilingual Articles**: Full support for both Tamil and English titles, summaries, and rich content.
* **Categories & Reading Time**: Automatic reading time estimation and category badges (Markets, Personal Finance, Regulations, SIPs).
* **Publisher Attribution**: Each article displays author credentials, AMFI ARN number, and links back to the advisor profile.

### 👥 3. Certified Advisors Directory (`#/professionals`)
* **Verified Specialist Cards**: Filter specialists by Mutual Funds, Tax Planning, Equities, and Retirement.
* **Advisor Profiles (`#/professionals/:id`)**: Rich portfolio page showing advisor background, certifications, published research, and YouTube masterclasses.
* **Direct 1-Click WhatsApp Consultation**: Pre-filled consultation requests allowing investors to connect directly with certified experts.

### 🧮 4. Interactive Wealth & SIP Calculator (`#/calculator`)
* Dynamic compound interest calculator with customizable monthly SIP amounts, investment tenures (1-30 years), and expected annual return rates (%).
* Instant calculation of **Total Invested Amount**, **Estimated Compounding Wealth Growth**, and **Maturity Value**.

### 📝 5. Investor Risk Assessment Quiz (`#/quiz`)
* Interactive multi-step risk assessment widget evaluating investor time horizon, volatility tolerance, and financial goals.
* Generates a recommended asset allocation profile (Conservative, Balanced, or Aggressive).

### 🔒 6. Security & Dynamic Password Verification (`#/profile`)
* **Condition-Verified Password Change**: Prevents unauthorized password modification by requiring the user to first verify their existing password.
* **Dynamic Form Unlock**: Upon validation, the new password fields unlock with real-time length and match checks.
* **Session Persistence**: Secure token management across browser refreshes with graceful logout.

### 🌐 7. Complete Bilingual Experience (தமிழ் / English)
* Instant 1-click language switcher in the top navigation bar (`தமிழ்` / `English`).
* Context-aware dictionary translating navigation, buttons, titles, forms, and financial terms throughout the entire app without page reloading.

---

## 5. Summary & Platform Highlights

| Metric / Highlight | Value |
| :--- | :--- |
| **Total Video Masterclasses** | 882+ Curated Guides |
| **Supported Languages** | Tamil (தமிழ்) & English |
| **Key Advisory Area** | AMFI Mutual Funds & Wealth Compounding |
| **Platform Speed** | Zero-dependency standalone bundle, sub-second load times |
| **Hosting & Edge Delivery** | Global Edge CDN via Vercel |
