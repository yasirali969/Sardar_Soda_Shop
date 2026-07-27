# 🥤 SARDAR SODA — Intelligent Soda Menu & Pre-Ordering App

Welcome to the official repository of **Sardar Soda**, a custom-tailored, high-performance web application designed for **Sardar Chill & Grill**. This app solves choice overload and makes pre-ordering delicious local craft sodas easier than ever!

---

## 🔗 Live Deployment URL
👉 **[Click Here to Visit the Deployed App!](https://sardar-soda-shop-ivzs.vercel.app/)**

---

## 📐 The Problem & Our Solution
**The Problem:** Walk-in customers at Sardar Chill & Grill often face choice paralysis when standing at the physical counter. With over 25+ specialty craft sodas and premium milk sodas across multiple sizes, long ordering queues form simply because users cannot decide what they want.

**The Solution:** Sardar Soda solves this by providing:
1. A **beautifully responsive, mobile-first digital menu** allowing customers to browse and customize their drinks before arrival.
2. An **offline-resilient, intelligent AI Drink Assistant** that cuts decision fatigue by asking exactly two quick questions and outputting a single, confident flavor recommendation.
3. A **hassle-free pre-ordering checkout engine** that works for both registered accounts and guest walk-ins with no friction.

---

## ✨ Features List

### 1. 🧠 Client-Side AI Drink Assistant
* Uses a custom lightweight, two-step wizard to understand the user's current **craving** (Fruity, Tangy, Creamy, Refreshing) and **budget/size preference**.
* Powered by Google's state-of-the-art **Gemini API** running fully in-browser for instant, zero-latency recommendations with zero server-side middleware overhead.
* Incorporates a robust, beautifully illustrated **fallback handler** so the app remains fully functional with delicious recommendations even if network connections fail.

### 2. 🔥 Real-Time Firestore Popular Drinks Panel
* Calculates the "Top 3 Most-Recommended" drinks dynamically by querying the global Firestore recommendations logs collection.
* Reflects real-time community taste and demand on the fly without relying on artificial hard-coded lists.

### 3. 🍦 Live, Custom-Seeded Menu (Firestore)
* Automatically seeds the official menu into Firestore on first load.
* Syncs category tabs (**Craft Sodas** vs **Milk Sodas**), size variations (Regular, Medium, Large), and dynamic pricing instantly across all page sections.

### 4. 🛒 Quick Pre-Order & Guest Checkout
* Fully supportive of standard and guest checkouts. **No login required** to pre-order!
* Customers simply pick a name and a chosen pickup time slot to reserve their bubbling drink.
* Outputs a unique, shareable reference code (`SDR-XXXXXX`) that they can copy and present at the physical counter.

### 5. 🔐 Firebase Auth & Order History
* Clean, non-intrusive email/password sign-up and login portal.
* Automatically attaches the user's profile ID (`uid`) to orders when signed in, allowing them to track their historic orders instantly inside the **History Modal**.

---

## 🤖 The AI Feature & System Instructions

The AI Mixologist is built directly inside `src/lib/gemini.ts` utilizing the advanced `@google/genai` TypeScript SDK. It coordinates with the live database menu and operates on the following strict system prompt:

```text
You are the Sardar Soda Drink Assistant, built for a real soda shop's ordering app.
You will be given: (1) a customer's answers to two questions — their craving/mood
and their budget tier — and (2) the shop's full menu as JSON (name, category, prices
by size).

Your job: recommend exactly ONE primary drink and ONE backup drink from the provided
menu only. Never invent a drink that isn't in the menu JSON.

Rules:
- Base the primary pick tightly on the stated craving (fruity/tangy/creamy/refreshing)
  and respect the stated budget tier for pricing (Regular = priceRegular, Medium = priceMedium, Large = priceLarge). Note that milkSoda items only have priceMedium and priceLarge.
- Give a one-sentence reason for the primary pick, written like a friendly counter
  staff member, not a marketing bot. No exclamation-point overload.
- The backup should be a genuinely different flavor profile, not a near-duplicate
  of the primary.
- If the craving is ambiguous, default to the shop's most commonly ordered category
  for that budget tier rather than asking another question.
- Output strict JSON only, in this shape, with no extra text:
  {
    "primary": {"name": "...", "size": "...", "price": ..., "reason": "..."},
    "backup":  {"name": "...", "size": "...", "price": ..., "reason": "..."}
  }
```

---

## 🛠️ Stack, Services & AI Models Used
- **Frontend Framework**: React 19 + TypeScript (Vite static compilation)
- **Styling**: Tailwind CSS v4 (Deep plum `#251520` brand palette, gold `#e0a84a` accents)
- **Animations**: `motion` for fluid transitions, wizards, and modals
- **Icons**: `lucide-react`
- **Database & Auth**: Firebase Firestore & Firebase Authentication
- **AI Model**: `gemini-3.6-flash` (via client-side Google GenAI SDK)

---

## 📸 App in Action (Gallery & Screens)

We have pre-defined the following mock asset paths in the repository representing the key user interfaces:

1. **The Hero & Interactive Assistant**:
   ![Hero & AI Assistant](https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600)
   *The stunning plum-violet workspace featuring our golden logo branding and live AI Flavor Matcher card.*

2. **The Dynamic Tastebook (Craft & Milk Sodas)**:
   ![Full Menu Interface](https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=600)
   *Slick card panels showing live database-fetched menu items with sizes, counter increments, and add-to-cart buttons.*

3. **Secure Checkout & Order Confirmations**:
   ![Checkout Panel](https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=600)
   *Our sliding cart panel with instant reference ID generation and time slot selectors for our lovely customers.*

---

## 💻 How to Run the Project Locally

### 1. Prerequisites
Ensure you have **Node.js** installed on your workstation.

### 2. Setup Environment Variables
Create a `.env` file in the root folder (modeled after `.env.example`) and fill in your keys:
```env
FIREBASE_API_KEY="your_api_key_here"
FIREBASE_AUTH_DOMAIN="your_auth_domain_here"
FIREBASE_PROJECT_ID="your_project_id_here"
GEMINI_API_KEY="your_gemini_api_key_here"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Boot Up Dev Server
```bash
npm run dev
```
Open your browser to `http://localhost:3000` to enjoy the app!
