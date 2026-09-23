# LukuApp

A full-stack e-commerce mobile app built with React Native (Expo) and a Node.js/Express backend — built as a hands-on project to practice mobile development, authentication, and API integration end to end.

## 📲 Try the Live Demo (Android)

Install the app directly on an Android device — no Play Store required:

**[Download & Install LukuApp](https://expo.dev/accounts/fredmunyao/projects/client/builds/62ee88b0-54a2-46d2-b422-6f4b507a7f3d)**

Scan the QR code on that page with your phone's camera, or open the link directly on an Android device to download and install the `.apk`. Android will prompt you to allow installs from this source — that's expected for a direct install outside the Play Store.

## Features

- Browse products by category, with pagination
- Product detail pages with image carousels and size selection
- Shopping cart with quantity management
- Wishlist (add/remove favorites)
- Address book with default address selection
- Order placement and order history
- Email/password authentication with two-factor support (via Clerk)
- Admin dashboard: manage products, view orders, update order status, view stats
- Image uploads to Cloudinary for product photos

## Tech Stack

**Client (mobile app)**
- React Native + Expo (Expo Router for navigation)
- TypeScript
- NativeWind (Tailwind CSS for React Native)
- Clerk for authentication
- Axios for API requests

**Server (backend API)**
- Node.js + Express (TypeScript)
- MongoDB with Mongoose
- Clerk (server-side) for auth verification
- Cloudinary for image storage
- Deployed on Vercel

## Project Structure

```
LukuApp/
├── client/          # React Native / Expo app
│   ├── src/app/     # Expo Router screens
│   ├── components/  # Reusable UI components
│   ├── context/      # Cart & Wishlist context providers
│   └── constants/   # Types, API config, shared constants
└── server/          # Express API
    ├── controllers/ # Route handlers
    ├── models/      # Mongoose schemas
    ├── routes/      # Express routers
    └── middleware/  # Auth middleware
```

## Running Locally

### Backend
```bash
cd server
npm install
# Add a .env file with MONGODB_URI, CLERK_SECRET_KEY, CLOUDINARY_* keys, ADMIN_EMAIL
npm run dev
```

### Client
```bash
cd client
npm install
# Add a .env file with EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
npx expo start
```

## Author

Fred (Fredrick) Munyao — [GitHub](https://github.com/FREDRICKMUMU)
