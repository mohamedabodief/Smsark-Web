# 🏠 Smsark-Alaqary - Real Estate Platform

A comprehensive real estate platform built with React, Firebase, Material-UI, and Bootstrap, designed to connect clients, developers, and financing organizations in the Egyptian real estate market. The platform supports multi-role access, real-time communication, analytics, and a seamless property listing experience for buying, selling, and renting.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Key Components](#key-components)
- [Analytics & Reports](#analytics--reports)
- [User Types & Roles](#user-types--roles)
- [Database Structure](#database-structure)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Mobile App](#mobile-app)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

---

## 🎯 Overview

Smsark-Alaqary is a full-featured real estate platform that facilitates:
- **Property Listings:** Client and developer advertisements for sale, rent, or buying.
- **Financing Services:** Mortgage and financing solutions for individuals and organizations.
- **User Management:** Multi-role user system (clients, organizations(developers/funders), admins).
- **Analytics Dashboard:** Comprehensive reporting and insights.
- **Real-time Communication:** Chat and notification system.
- **Responsive UI:** Optimized for all devices, with RTL and Arabic support.

---

## ✨ Features

### 🏘️ Property Management
- **Client Advertisements:** List individual properties (apartment, villa, commercial, land).
- **Developer Projects:** Large-scale real estate developments.
- **Ad Categories:** For Sale, For Rent, For Buying.
- **Location Services:** City and governorate-based filtering; map integration.
- **Image Management:** Multiple property images with thumbnail support.
- **Status Tracking:** Pending, Approved, Rejected workflow; admin approval required.
- **Edit/Delete Ads:** Full CRUD for property ads (with role-based permissions).
- **Ad Details View:** Full property info, images, and contact options.

### 💰 Financing Services
- **Financing Advertisements:** Bank and organization offers.
- **Interest Rate Categories:** Up to 5%, 10%, and above 10%.
- **Financing Requests:** Client application system, request tracking.
- **Approval Workflow:** Organization approval for requests.
- **Financial Analytics:** Approval rates and performance metrics.

### 👥 User Management
- **Multi-Role System:** Clients, Organizations(Developers/Funders), Admins.
- **Profile Management:** Complete user profiles with preferences and verification.
- **Authentication:** Firebase Auth with email/password.
- **Role-based Access:** Dashboards and permissions per role.
- **User Analytics:** Activity tracking and engagement metrics.

### 📊 Analytics & Reporting
- **Dashboard Overview:** Key metrics and KPIs for admins and organizations.
- **Real-time Data:** Live statistics from Firestore.
- **Interactive Charts:** Bar, Pie, Area charts using Recharts.
- **Filtering Options:** Date range, city, status, ad type.
- **Export Functionality:** CSV report generation.
- **Performance Metrics:** Ad views, favorites, engagement.

### 💬 Communication
- **Real-time Chat:** Private messaging between users.
- **Notifications:** Push notifications for updates, ad status, and chat.
- **Inbox Management:** Message organization and history.
- **FCM Integration:** Firebase Cloud Messaging for push notifications.

### 🔍 Search & Discovery
- **Advanced Search:** Multiple criteria filtering.
- **Location-based Search:** City and governorate filtering.
- **Category Filtering:** Property type and status.
- **Price Range:** Min/max price filtering.
- **Search Results:** Paginated and sorted results.

### 🎨 User Interface
- **Responsive Design:** Mobile-first approach using Bootstrap and Material-UI.
- **RTL Support:** Arabic language support.
- **Theme System:** Customizable purple-based theme.
- **Material-UI & Bootstrap:** Modern component libraries.
- **Loading States:** Smooth user experience with loaders and skeletons.

### 🛡️ Security & Moderation
- **Ad Approval/Rejection:** Admin panel for moderating ads.
- **User Management:** Ban, approve, or reject users.

---

## 🛠️ Technology Stack

### Frontend
- **React 19.1.0**: Modern React with hooks.
- **Material-UI 7.2.0**: UI component library.
- **Bootstrap 5.x**: Responsive design and layout.
- **Recharts**: Data visualization.
- **React Router DOM**: Client-side routing.
- **Redux Toolkit**: State management.
- **React Hook Form**: Form handling.
- **Yup**: Form validation.
- **React Icons**: Icon library.
- **Leaflet & React Leaflet**: Map integration.

### Backend & Services
- **Firebase 11.10.0**: Backend-as-a-Service.
  - **Firestore**: NoSQL database.
  - **Firebase Auth**: Authentication (email/password, Google).
  - **Firebase Storage**: File/image uploads.
  - **Firebase Functions**: Serverless backend.
  - **Firebase Cloud Messaging**: Push notifications.

### Development Tools
- **Vite**: Build tool and dev server.
- **ESLint**: Code linting.

---

## 📁 Project Structure

```
Smsark-Alaqary/
├── src/
│   ├── components/           # Reusable UI components
│   ├── pages/                # Main application pages
│   ├── Dashboard/            # Dashboard components
│   ├── FireBase/             # Firebase configuration and services
│   ├── services/             # Business logic services
│   ├── reduxToolkit/         # Redux store and slices
│   ├── hooks/                # Custom React hooks
│   ├── context/              # React context providers
│   ├── styles/               # CSS and Bootstrap overrides
│   ├── assets/               # Static assets (images, icons)
│   ├── theme.js              # Material-UI theme configuration
│   └── App.jsx / main.jsx    # Entry points
├── public/                   # Public assets
├── functions/                # Firebase Cloud Functions
├── packages/                 # Additional package configurations
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project setup

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Smsark-Alaqary
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Configuration**
   - Create a Firebase project.
   - Enable Firestore, Auth, Storage, and Functions.
   - Update `src/FireBase/firebaseConfig.js` with your config.

4. **Environment Variables**
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

---

## 🧩 Key Components

- **Authentication System:** Multi-step registration, role selection, profile completion, password reset.
- **Dashboards:** Role-based dashboards for admin, client, developer, and organization.
- **Property Forms:** Ad forms for clients and developers, financing ad forms, modern real estate forms.
- **Analytics:** Overview widgets, interactive charts, filter controls, time series analysis.
- **Chat & Notifications:** Real-time chat, push notifications, inbox management.
- **Search & Filter:** Advanced and location-based search, paginated results.
- **Admin Tools:** User and ad moderation, audit logs, system configuration.

---

## 📈 Analytics & Reports

- **Dashboard Overview:** Total ads, financing ads, active/inactive ads, registered users.
- **Performance Metrics:** Ad status, category breakdown, city distribution, engagement.
- **Financial Insights:** Financing requests, approval rates, interest rate analysis, revenue tracking.
- **Time-based Reports:** Daily trends, monthly growth, seasonal analysis, user growth.

---

## 👤 User Types & Roles

- **Clients:** List properties, favorites, financing requests, personal dashboard.
- **Organizations (Developers):** Manage projects, analytics, property portfolio, dashboard.
- **Organizations (Funders):** Financing ads, request management, analytics, dashboard.
- **Administrators:** Manage users, content moderation, analytics, system configuration.

---

## 🗄️ Database Structure

### Users
```js
{
  uid: string,
  type_of_user: 'client' | 'developer' | 'organization' | 'admin',
  profile_data: object,
  created_at: timestamp,
  profile_completed: boolean
}
```
### Client Advertisements
```js
{
  title: string,
  type: 'apartment' | 'villa' | 'commercial',
  price: number,
  area: number,
  location: object,
  reviewStatus: 'pending' | 'approved' | 'rejected',
  ads: boolean,
  userId: string
}
```
### Developer Advertisements
```js
{
  developer_name: string,
  project_types: array,
  price_range: object,
  location: object,
  reviewStatus: 'pending' | 'approved' | 'rejected',
  userId: string
}
```
### Financing Advertisements
```js
{
  title: string,
  financing_model: string,
  interest_rates: object,
  limits: object,
  reviewStatus: 'pending' | 'approved' | 'rejected',
  userId: string
}
```
### Financing Requests
```js
{
  clientId: string,
  financingAdId: string,
  status: 'pending' | 'approved' | 'rejected',
  amount: number,
  created_at: timestamp
}
```

---

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/reset-password` - Password reset

### Advertisements
- `GET /ads/client` - Get client advertisements
- `GET /ads/developer` - Get developer advertisements
- `GET /ads/financing` - Get financing advertisements
- `POST /ads/create` - Create new advertisement
- `PUT /ads/:id` - Update advertisement
- `DELETE /ads/:id` - Delete advertisement

### Analytics
- `GET /analytics/overview` - Dashboard overview
- `GET /analytics/performance` - Performance metrics
- `GET /analytics/financial` - Financial insights
- `GET /analytics/export` - Export reports

---

## 🚀 Deployment

### Firebase Deployment
```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

### Build for Production
```bash
npm run build
npm run preview
```

---

## 📱 Mobile App

The project includes a React Native mobile application in the `Smsark-App/` directory with:
- Cross-platform compatibility
- Native performance
- Push notifications
- Offline support
- Camera integration

---

## 🔧 Configuration

- **Theme Customization:** Edit `src/theme.js` for palette, typography, and RTL.
- **Firebase Config:** Update `src/FireBase/firebaseConfig.js`.
- **Env Variables:** Use `.env` for deployment settings.

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Add tests if applicable.
5. Submit a pull request.

- Follow ESLint configuration.
- Use TypeScript for new components (if applicable).
- Follow Material-UI and Bootstrap design patterns.
- Maintain RTL support for Arabic.

### Testing
```bash
npm run lint
npm test
```

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 📞 Support

For support and questions:
- Email: support@smsark-alaqary.com
- Documentation: [Project Wiki]
- Issues: [GitHub Issues]

---

**Smsark-Alaqary** – Connecting Egypt's Real Estate Market 🏠✨
