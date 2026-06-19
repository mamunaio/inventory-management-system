# IG-Inventory Pro - Complete Feature Summary

**Project Name:** IG-Inventory Pro (Enterprise Point of Sale & Inventory Management System)
**Tech Stack:** Laravel 11, React.js (Inertia), Tailwind CSS, MongoDB (Laravel Eloquent)

---

## 1. Dynamic Dashboard & Real-Time Analytics
- **Live Sales Tracking:** Real-time calculation of total revenue, total orders, and total registered customers.
- **Visual Charts:** Animated bar charts displaying the last 7 days of actual sales data dynamically.
- **Low Stock Alerts:** Automatic warnings for products running low in inventory (less than 10 units).
- **Recent Transactions:** Quick view of the latest 5 orders directly from the dashboard.

## 2. Product & Inventory Management
- **Centralized Catalog:** Add, edit, and view all products with details like SKU, category, cost price, and selling price.
- **Auto Barcode Generation:** Automatically generates a 12-digit EAN standard barcode if one isn't manually provided.
- **Barcode Printing (Hardware Ready):** Ability to export and print 21-grid physical barcode sticker labels (A4 size PDF) for any product.
- **Stock Tracking:** Real-time stock calculation that automatically deducts stock during sales and restores stock upon order cancellations.

## 3. Customer Management
- **Customer CRM:** Manage customer details including Name, Phone, Email, and Address.
- **Fast Entry:** Quickly add new customers during the checkout process without leaving the POS interface.

## 4. Orders / Point of Sale (POS)
- **Seamless Checkout:** Select customers and add multiple products to the cart dynamically.
- **Cart Management:** Adjust quantities and view real-time calculations of subtotals and total amounts.
- **Order Status:** Manage order lifecycles with statuses like Pending, Completed, Cancelled, and Refunded.
- **PDF Invoicing:** Generate professional, downloadable PDF invoices/receipts for every completed order.

## 5. Supply Chain & Purchasing (Restock)
- **Supplier Directory:** Register and manage wholesale suppliers and vendors.
- **Purchase Orders:** Create purchase records to buy new stock from suppliers.
- **Automatic Restocking:** Creating a purchase order automatically increases the available stock for those specific products in the main inventory.

## 6. Business Reporting & Exports
- **Date Filtering:** Generate reports based on specific start and end dates.
- **Excel Exports:** Export detailed "Sales Reports" and "Inventory Status Reports" directly into Excel/CSV format for accounting.

## 7. Global Store Settings
- **Dynamic Store Info:** Manage global configurations like Store Name, Address, Phone, Support Email, and Tax Rates.
- **Universal Application:** The store name and details automatically reflect on the Sidebar, UI headers, and printed PDF Invoices.

## 8. Role-Based Access Control (Security)
- **Multi-level User Roles:** Two primary roles implemented: `Admin` and `Cashier`.
- **Admin Privileges:** Full access to all modules, settings, financial reports, and product modification.
- **Cashier Restrictions:** 
  - Cannot access Settings, Reports, Purchases, or Suppliers.
  - Cannot Add, Edit, or Delete products (Read-only access for scanning).
  - Restricted via both Frontend UI hiding and Backend Middleware protection.

## 9. Production & Performance Optimization
- **Secure Environment:** Debugging disabled for live production to ensure data security.
- **Lightning Fast UI:** Frontend assets (React/Tailwind) minified and built via Vite for instant page loads.
- **Backend Caching:** Laravel routes, views, and configurations heavily cached to maximize server response times.
