# SwiftAid Frontend

The SwiftAid frontend is a modern, responsive web application built to connect hospitals, blood banks, and donors. It provides a seamless user interface for inventory management, transaction tracking, and facility onboarding.

## Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 + Framer Motion (Animations)
- **State Management & Data Fetching**: React Query (@tanstack/react-query), Axios
- **Routing**: React Router DOM v7
- **Forms**: React Hook Form
- **Data Visualization**: Chart.js & Recharts
- **Payments**: React Paystack

## Prerequisites

- **Node.js**: v18 or higher recommended
- **npm** or **yarn** or **pnpm**

## Local Setup

1. **Navigate to the frontend directory**
   ```bash
   cd app/frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root of the `frontend` directory based on the provided `.env.example`.
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   *The app will be accessible at `http://localhost:5173` (or the port specified by Vite).*

## Build for Production

To create an optimized production build:

```bash
npm run build
```

This will generate the built assets in the `dist/` directory, which can be deployed to Vercel, Netlify, or any static hosting service.

## Project Structure

- `/src/components`: Reusable UI components (buttons, inputs, cards).
- `/src/pages`: Main application views (Dashboard, Login, Inventory).
- `/src/services`: API service layers built with Axios to communicate with the Django backend.
- `/src/hooks`: Custom React hooks, heavily utilizing React Query for server state.
- `/src/utils`: Helper functions, formatting, and constants.
