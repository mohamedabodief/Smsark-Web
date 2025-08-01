# 🏠 Smsark-Alaqary - Real Estate Platform

A comprehensive real estate platform built with React, Firebase, and Material-UI, designed to connect clients, developers, and financing organizations in the Egyptian real estate market.

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
- [Contributing](#contributing)

## 🎯 Overview

Smsark-Alaqary is a full-featured real estate platform that facilitates:
- **Property Listings**: Client and developer advertisements
- **Financing Services**: Mortgage and financing solutions
- **User Management**: Multi-role user system
- **Analytics Dashboard**: Comprehensive reporting and insights
- **Real-time Communication**: Chat and notification system

## ✨ Features

### 🏘️ Property Management
- **Client Advertisements**: Individual property listings (apartments, villas, commercial)
- **Developer Projects**: Large-scale real estate developments
- **Property Categories**: Apartment, Villa, Commercial, Land
- **Location Services**: City and governorate-based filtering
- **Image Management**: Multiple property images with thumbnail support
- **Status Tracking**: Pending, Approved, Rejected workflow

### 💰 Financing Services
- **Financing Advertisements**: Bank and organization financing offers
- **Interest Rate Categories**: Up to 5%, 10%, and above 10% terms
- **Financing Requests**: Client application system
- **Approval Workflow**: Request processing and status tracking
- **Financial Analytics**: Approval rates and performance metrics

### 👥 User Management
- **Multi-Role System**: Clients, Developers, Organizations, Admins
- **Profile Management**: Complete user profiles with preferences
- **Authentication**: Firebase Auth with email/password
- **Role-based Access**: Different dashboards and permissions
- **User Analytics**: Activity tracking and engagement metrics

### 📊 Analytics & Reporting
- **Dashboard Overview**: Key metrics and KPIs
- **Real-time Data**: Live statistics from Firestore
- **Interactive Charts**: Bar, Pie, Area charts using Recharts
- **Filtering Options**: Date range, city, status, ad type
- **Export Functionality**: CSV report generation
- **Performance Metrics**: Ad views, favorites, engagement

### 💬 Communication
- **Real-time Chat**: Private messaging between users
- **Notifications**: Push notifications for updates
- **Inbox Management**: Message organization and history
- **FCM Integration**: Firebase Cloud Messaging

### 🔍 Search & Discovery
- **Advanced Search**: Multiple criteria filtering
- **Location-based Search**: City and governorate filtering
- **Category Filtering**: Property type and status
- **Price Range**: Min/max price filtering
- **Search Results**: Paginated and sorted results

### 🎨 User Interface
- **Responsive Design**: Mobile-first approach
- **RTL Support**: Arabic language support
- **Theme System**: Customizable purple-based theme
- **Material-UI**: Modern component library
- **Loading States**: Smooth user experience

## 🛠️ Technology Stack

### Frontend
- **React 19.1.0**: Modern React with hooks
- **Material-UI 7.2.0**: UI component library
- **Recharts**: Data visualization library
- **React Router DOM**: Client-side routing
- **Redux Toolkit**: State management
- **React Hook Form**: Form handling
- **Yup**: Form validation

### Backend & Services
- **Firebase 11.10.0**: Backend-as-a-Service
- **Firestore**: NoSQL database
- **Firebase Auth**: Authentication service
- **Firebase Storage**: File storage
- **Firebase Functions**: Serverless functions
- **Firebase Cloud Messaging**: Push notifications

### Development Tools
- **Vite**: Build tool and dev server
- **ESLint**: Code linting
- **React Icons**: Icon library
- **Leaflet**: Maps integration
- **React Leaflet**: React map components

## 📁 Project Structure

```
Smsark-Alaqary/
├── src/
│   ├── components/           # Reusable UI components
│   ├── pages/               # Main application pages
│   ├── Dashboard/           # Dashboard components
│   ├── FireBase/            # Firebase configuration and services
│   ├── services/            # Business logic services
│   ├── reduxToolkit/        # Redux store and slices
│   ├── hooks/               # Custom React hooks
│   ├── context/             # React context providers
│   ├── styles/              # CSS and styling files
│   ├── assets/              # Static assets
│   └── theme.js             # Material-UI theme configuration
├── public/                  # Public assets
├── functions/               # Firebase Cloud Functions
└── packages/                # Additional package configurations
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project setup

### Installation Steps

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
   - Create a Firebase project
   - Enable Firestore, Auth, Storage, and Functions
   - Update `src/FireBase/firebaseConfig.js` with your config

4. **Environment Variables**
   ```bash
   # Create .env file
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🧩 Key Components

### Authentication System
- **Login/Register Forms**: Multi-step registration process
- **Role Selection**: Client, Developer, Organization
- **Profile Completion**: Required information collection
- **Password Reset**: Email-based password recovery

### Dashboard Components
- **Admin Dashboard**: Platform management and oversight
- **Client Dashboard**: Personal ads and favorites
- **Developer Dashboard**: Project management and analytics
- **Organization Dashboard**: Financing services management

### Property Forms
- **Client Ad Form**: Individual property listing
- **Developer Project Form**: Large-scale development
- **Financing Ad Form**: Financial service offering
- **Modern Real Estate Form**: Enhanced property submission

### Analytics Components
- **Overview Widgets**: Key metrics display
- **Chart Components**: Interactive data visualization
- **Filter Controls**: Data filtering and export
- **Time Series Analysis**: Trend tracking

## 📈 Analytics & Reports

### Dashboard Overview
- **Total Real Estate Ads**: Client + Developer advertisements
- **Total Financing Ads**: Financial service offerings
- **Active vs. Inactive Ads**: Status distribution
- **Registered Users**: User count by type

### Performance Metrics
- **Ad Status Distribution**: Pending, Approved, Rejected
- **Category Breakdown**: Property type analysis
- **City Distribution**: Geographic performance
- **User Engagement**: Activity and interaction metrics

### Financial Insights
- **Financing Requests**: Total applications
- **Approval Rates**: Success metrics
- **Interest Rate Analysis**: Category performance
- **Revenue Tracking**: Financial performance

### Time-based Reports
- **Daily Trends**: Ad creation patterns
- **Monthly Growth**: Platform expansion
- **Seasonal Analysis**: Market trends
- **User Growth**: Registration patterns

## 👤 User Types & Roles

### 🏠 Clients
- **Profile**: Personal information and preferences
- **Advertisements**: Individual property listings
- **Favorites**: Saved property bookmarks
- **Financing Requests**: Mortgage applications
- **Dashboard**: Personal activity overview

### 🏢 Developers
- **Profile**: Company information and credentials
- **Projects**: Large-scale developments
- **Analytics**: Project performance metrics
- **Management**: Property portfolio oversight
- **Dashboard**: Development project tracking

### 🏦 Organizations (Funders)
- **Profile**: Financial institution details
- **Financing Ads**: Loan and mortgage offers
- **Request Management**: Application processing
- **Analytics**: Financial performance metrics
- **Dashboard**: Financing service management

### 👨‍💼 Administrators
- **Platform Management**: Overall system oversight
- **User Management**: User approval and moderation
- **Content Moderation**: Ad review and approval
- **Analytics**: Platform-wide metrics
- **System Configuration**: Platform settings

## 🗄️ Database Structure

### Collections

#### Users
```javascript
{
  uid: string,
  type_of_user: 'client' | 'developer' | 'organization' | 'admin',
  profile_data: object,
  created_at: timestamp,
  profile_completed: boolean
}
```

#### Client Advertisements
```javascript
{
  title: string,
  type: 'apartment' | 'villa' | 'commercial',
  price: number,
  area: number,
  location: object,
  reviewStatus: 'pending' | 'approved' | 'rejected',
  ads: boolean, // paid promotion
  userId: string
}
```

#### Developer Advertisements
```javascript
{
  developer_name: string,
  project_types: array,
  price_range: object,
  location: object,
  reviewStatus: 'pending' | 'approved' | 'rejected',
  userId: string
}
```

#### Financing Advertisements
```javascript
{
  title: string,
  financing_model: string,
  interest_rates: object,
  limits: object,
  reviewStatus: 'pending' | 'approved' | 'rejected',
  userId: string
}
```

#### Financing Requests
```javascript
{
  clientId: string,
  financingAdId: string,
  status: 'pending' | 'approved' | 'rejected',
  amount: number,
  created_at: timestamp
}
```

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

## 🚀 Deployment

### Firebase Deployment
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase
firebase init

# Deploy to Firebase
firebase deploy
```

### Build for Production
```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards
- Follow ESLint configuration
- Use TypeScript for new components
- Follow Material-UI design patterns
- Maintain RTL support for Arabic

### Testing
```bash
# Run linting
npm run lint

# Run tests (when implemented)
npm test
```

## 📱 Mobile App

The project includes a React Native mobile application in the `Smsark-App/` directory with:
- Cross-platform compatibility
- Native performance
- Push notifications
- Offline support
- Camera integration

## 🔧 Configuration

### Theme Customization
Edit `src/theme.js` to customize:
- Color palette
- Typography
- Component styling
- RTL support

### Firebase Configuration
Update `src/FireBase/firebaseConfig.js` with your Firebase project settings.

### Environment Variables
Configure environment variables in `.env` file for different deployment environments.

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For support and questions:
- Email: support@smsark-alaqary.com
- Documentation: [Project Wiki]
- Issues: [GitHub Issues]

---

**Smsark-Alaqary** - Connecting Egypt's Real Estate Market 🏠✨
