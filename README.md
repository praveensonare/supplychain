# Battery Supply Chain Platform

A modern, mobile-first platform for managing battery supply chain operations across manufacturers, sellers, and logistics providers.

## Features

### Authentication
- **Role-based Login**: Choose from Seller, Manufacturer, or Logistics roles
- **Username/Password**: Traditional authentication
- **Google OAuth**: Quick login with Google (demo mode)
- **Persistent Sessions**: Stay logged in across app restarts

### Role-Based Dashboards

#### Seller Dashboard (`/slr`)
- View total orders, active orders, and revenue statistics
- Browse available battery inventory
- Track recent orders and their status
- Access to profile and settings

#### Logistics Dashboard (`/lgt`)
- Manage shipments and deliveries
- Track active shipments in real-time
- View origin, destination, and current location
- Monitor fleet status and drivers
- Track estimated delivery times

#### Manufacturer Dashboard (`/mfr`)
- View production inventory and stock levels
- Manage battery products and specifications
- Track pending orders and production requirements
- Monitor inventory value

### User Profiles
- View and edit account information
- Company details and contact information
- Settings and preferences
- Logout functionality

## Demo Credentials

### Seller
- **Username**: `seller1`
- **Password**: `demo123`
- **Dashboard**: `/slr`

### Manufacturer
- **Username**: `manufacturer1`
- **Password**: `demo123`
- **Dashboard**: `/mfr`

### Logistics
- **Username**: `logistics1`
- **Password**: `demo123`
- **Dashboard**: `/lgt`

## Tech Stack

- **Framework**: React Native + Expo
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Context API
- **Storage**: AsyncStorage for persistent auth
- **UI Components**: React Native + Expo Libraries
- **Icons**: Ionicons
- **Gradients**: expo-linear-gradient

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Expo CLI (optional, comes with expo)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### Running the App

#### Web
```bash
npm run dev
# Press 'w' to open in web browser
```

#### iOS Simulator (Mac only)
```bash
npm run dev
# Press 'i' to open iOS simulator
```

#### Android Emulator
```bash
npm run dev
# Press 'a' to open Android emulator
```

#### Physical Device
1. Install Expo Go app from App Store or Play Store
2. Scan the QR code shown in terminal

## Project Structure

```
supplychain/
├── app/                    # Expo Router pages
│   ├── index.tsx          # Login screen (landing page)
│   ├── slr/               # Seller routes
│   │   ├── _layout.tsx
│   │   ├── index.tsx      # Seller dashboard
│   │   └── profile.tsx    # Seller profile
│   ├── lgt/               # Logistics routes
│   │   ├── _layout.tsx
│   │   ├── index.tsx      # Logistics dashboard
│   │   └── profile.tsx    # Logistics profile
│   ├── mfr/               # Manufacturer routes
│   │   ├── _layout.tsx
│   │   ├── index.tsx      # Manufacturer dashboard
│   │   └── profile.tsx    # Manufacturer profile
│   └── _layout.tsx        # Root layout with AuthProvider
├── components/            # Reusable components
│   ├── DashboardHeader.tsx
│   └── ProfileScreen.tsx
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
├── types/                 # TypeScript types
│   └── auth.ts
├── utils/                 # Utility functions
│   └── dummyData.ts       # Demo data
└── package.json
```

## Features Overview

### Authentication Flow
1. User lands on login page (default route)
2. Selects role from dropdown (Seller, Manufacturer, Logistics)
3. Enters credentials or uses Google login
4. Redirected to role-specific dashboard
5. Session persisted across app restarts
6. Logout returns to login page

### Navigation
- **Seller**: `/slr` → Dashboard, `/slr/profile` → Profile
- **Manufacturer**: `/mfr` → Dashboard, `/mfr/profile` → Profile
- **Logistics**: `/lgt` → Dashboard, `/lgt/profile` → Profile

### Profile Access
- Click profile picture in top-right corner
- View profile or logout
- Profile shows user details, company info, and settings

## Dummy Data

The platform includes comprehensive dummy data:
- **3 Users**: One for each role
- **5 Battery Products**: Various types and specifications
- **4 Orders**: Different statuses and order details
- **3 Shipments**: Different delivery stages

## Building for Production

### Web
```bash
npm run build:web
```

### iOS/Android
Follow Expo's build documentation:
```bash
# Install EAS CLI
npm install -g eas-cli

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## Customization

### Adding New Roles
1. Add role to `types/auth.ts`
2. Create route folder in `app/`
3. Add user in `utils/dummyData.ts`
4. Update routing in `app/index.tsx`

### Modifying Theme
- Colors are defined inline in component styles
- Consider extracting to a theme file for consistency
- Gradients use `expo-linear-gradient`

### Adding Real Backend
1. Replace dummy data with API calls
2. Update `AuthContext.tsx` with real auth endpoints
3. Add error handling and loading states
4. Implement proper token management

## License

MIT

## Support

For issues and questions, please refer to the project repository.
