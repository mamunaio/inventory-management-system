# IG-Inventory Pro
**Enterprise Management System by Injaazh Global**

![IG-Inventory Pro](https://via.placeholder.com/1200x600/0A0A0A/8b5cf6?text=IG-Inventory+Pro)

IG-Inventory Pro is a state-of-the-art, "Trillion-Dollar" aesthetic enterprise inventory and customer management system designed for massive scale operations (100,000+ customer base). Built with an API-driven architecture separating a powerful Laravel backend from a sleek Next.js frontend.

## 🚀 Tech Stack

### Frontend (Next.js)
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + Vanilla CSS (Custom Design System)
- **UI/UX:** Framer Motion (Smooth Apple/Vercel-like easing)
- **Icons:** Lucide React
- **Aesthetic:** Dark Mode (Deep Black `#000000` & Purple/Blue `var(--primary)` Gradients), Glassmorphism, Sub-pixel borders.

### Backend (Laravel)
- **Framework:** Laravel 11 (API Only)
- **Database:** MongoDB Atlas (via `mongodb/laravel-mongodb`)
- **Authentication:** Laravel Sanctum (Token-based API Auth)
- **Architecture:** MVC Pattern, RESTful API

---

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/mamunaio/inventory-management-system.git
cd inventory-management-system
```

### 2. Backend Setup (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```
**Configure MongoDB:** Update `.env` with your MongoDB Atlas connection string:
```env
DB_CONNECTION=mongodb
DB_DSN="mongodb+srv://<username>:<password>@cluster0...mongodb.net/?appName=Cluster0"
DB_DATABASE=ig_inventory_pro
```
Start the server:
```bash
php artisan serve
```

### 3. Frontend Setup (Next.js)
```bash
cd ../frontend
npm install
npm run dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000).

---

## 🎨 Design Philosophy
The UI was meticulously crafted to avoid the "playful" app-like feel. Instead, it utilizes:
- **Subtle Gradients & Grids:** A minimal linear grid background with ultra-soft spotlight effects.
- **Micro-interactions:** Non-bouncy, `easeOut` bezier curves `[0.16, 1, 0.3, 1]` for ultra-smooth transitions.
- **Thin Borders:** High-end `border-white/10` borders paired with dark backdrop blurs.

---
*Developed for Injaazh Global. Handling multi-billion dollar business operations with ease.*
