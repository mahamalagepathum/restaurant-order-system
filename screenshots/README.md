# 🍽️ Restaurant Order Management System
### Group 76 | PUSL2021 Computing Group Project | Plymouth University

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Firebase-orange?style=for-the-badge&logo=firebase)](https://restaurant-order-system-60d43.web.app)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-yellow?style=for-the-badge&logo=firebase)](https://firebase.google.com)

---

## 📌 Project Overview

A web-based Restaurant Order Management System that allows small restaurant owners in Sri Lanka to manage customer orders digitally — at **zero cost**, with no hardware required.

Customers scan a **QR code** on their table to view the menu and place orders directly from their phone browser. Orders appear on the owner's dashboard **in real time**.

---

## 🚀 Live Demo

🔗 **[https://restaurant-order-system-60d43.web.app](https://restaurant-order-system-60d43.web.app)**

---

## 📸 Screenshots

### Customer Side (Mobile)
| Order Form | Order Placed | Order Confirmed |
|:---:|:---:|:---:|
| ![Customer Order Form](screenshots/customer-order-form.png) | ![Order Placed](screenshots/order-placed.png) | ![Order Confirmed](screenshots/order-confirmed.png) |

### Owner Side (Desktop)
| Login | Register | Dashboard - Orders |
|:---:|:---:|:---:|
| ![Login](screenshots/login.png) | ![Register](screenshots/register.png) | ![Orders Dashboard](screenshots/dashboard-orders.png) |

| Menu Management | Add Item | QR Code |
|:---:|:---:|:---:|
| ![Menu](screenshots/menu-management.png) | ![Add Item](screenshots/add-item.png) | ![QR Code](screenshots/qr-code.png) |

| New Order Alert | Order Confirmed |
|:---:|:---:|
| ![New Order](screenshots/new-order-notification.png) | ![Confirmed](screenshots/order-confirmed-dashboard.png) |

---

## ✨ Features

- 🔐 **Owner Authentication** — Secure registration and login via Firebase Authentication
- 🍜 **Menu Management** — Add, edit, delete items with photos, prices, and categories
- 📱 **QR Code Generation** — Unique QR code per restaurant, downloadable as PNG
- 🛒 **Customer Order Form** — No login or app download required
- ⚡ **Real-Time Notifications** — Orders appear instantly on owner dashboard with audio alert
- ✅ **Order Confirmation** — One-click confirm, status reflected on customer screen
- 🔒 **Data Isolation** — Each restaurant's data is private via Firestore security rules

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js v19 |
| Routing | React Router DOM v7 |
| Backend | Node.js + Express |
| Database | Firebase Firestore |
| Authentication | Firebase Authentication |
| File Storage | Firebase Storage |
| QR Code | qrcode.react v4 |
| Styling | Tailwind CSS v3 |
| Hosting | Firebase Hosting |

---

## 📁 Project Structure

```
src/
├── App.js                          # Root component, routing setup
├── index.js                        # Entry point
├── App.css / index.css             # Global styles
├── firebase/
│   └── firebaseConfig.js           # Firebase initialisation
├── context/
│   └── AuthContext.js              # Global authentication context
├── pages/
│   ├── LoginPage.js                # Owner login
│   ├── RegisterPage.js             # Owner registration
│   └── DashboardPage.js            # Owner dashboard (Orders + Menu tabs)
├── components/
│   ├── Navbar.js                   # Top navigation bar
│   ├── Layout.js                   # Page layout wrapper
│   ├── Footer.js                   # Footer component
│   ├── MenuTab.js                  # Menu management tab
│   ├── MenuItemCard.js             # Individual menu item card
│   ├── AddItemModal.js             # Add / Edit item modal form
│   ├── OrdersTab.js                # Real-time orders tab
│   ├── OrderCard.js                # Individual order card
│   └── QRCodeDisplay.js            # QR code generator and download
└── customer/
    └── CustomerOrderPage.js        # Customer-facing order form
```

---

## ⚙️ Setup and Installation

### Prerequisites
- Node.js v18 or later
- npm
- Firebase account (free Spark plan)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/restaurant-order-system.git
cd restaurant-order-system
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Firebase
Create a `.env` file in the project root:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 4. Start the development server
```bash
npm start
```

### 5. Build for production
```bash
npm run build
firebase deploy
```

---

## 🗄️ Database Structure (Firebase Firestore)

```
restaurants/
  └── {restaurantId}/          ← Owner's Firebase UID
        ownerName: string
        shopName: string
        email: string
        createdAt: timestamp

menuItems/
  └── {itemId}/
        restaurantId: string   ← Links to restaurant
        itemName: string
        category: string
        price: number
        description: string
        imageUrl: string
        isAvailable: boolean
        createdAt: timestamp

orders/
  └── {orderId}/
        restaurantId: string   ← Links to restaurant
        tableNumber: string
        items: array
        totalPrice: number
        status: "Pending" | "Confirmed"
        createdAt: timestamp
```

---

## 👥 Team

| Name | Student ID | Responsibilities |
|------|-----------|-----------------|
| Mahamalage Perera | 10968730 | Frontend Development, Firebase Firestore Integration, QR Code, Real-Time Notifications, Customer Order Form |
| Anjula Wijeyaratne | 10968469 | Firebase Authentication, Firebase Storage, Backend (Node.js + Express), Order Confirmation, Deployment |

---

## 📋 Module Details

| | |
|--|--|
| **Module** | PUSL2021 Computing Group Project |
| **Programme** | SE / CS / DS / TM |
| **Supervisor** | Mr. Diluka Wijesinghe |
| **Institution** | In Partnership with Plymouth University |
| **Academic Year** | 2024 / 2025 |

---

## 📄 License

This project was developed for academic purposes as part of the PUSL2021 Computing Group Project module.
