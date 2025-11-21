# Testing Guide for Student Wallet Wise

This guide will help you test the complete authentication flow and expense management features.

## Prerequisites

1. **MongoDB Database**: You need a MongoDB database. You can:
   - Use MongoDB Atlas (free tier): https://www.mongodb.com/cloud/atlas
   - Use a local MongoDB instance
   - Use a Docker container with MongoDB

2. **Environment Setup**: Update your MongoDB URI in `server/.env`:
   ```
   MONGODB_URI=your_actual_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   PORT=3000
   ```

## Installation

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

## Running the Application

### Option 1: Run Both Frontend and Backend Together
```bash
npm run dev:full
```

### Option 2: Run Separately
Terminal 1 (Backend):
```bash
npm run server
# Server will start at http://localhost:3000
```

Terminal 2 (Frontend):
```bash
npm run dev
# Frontend will start at http://localhost:5173
```

## Testing the Complete Flow

### 1. Home Page
- Open your browser to http://localhost:5173
- You should see the landing page with:
  - Student Wallet Wise branding
  - Feature cards showing Track Expenses, Set Budgets, Visual Analytics, and Recurring Expenses
  - "Login" and "Sign Up" buttons in the header
  - "Get Started Free" button in the hero section

### 2. Sign Up Flow
- Click on "Sign Up" button
- Fill in the registration form:
  - Name: Your name
  - Email: A valid email address
  - Password: At least 6 characters
- Click "Create account"
- Upon successful registration:
  - You should see a success toast notification
  - You will be automatically logged in
  - You will be redirected to the dashboard

### 3. Dashboard (Authenticated)
- After login, you should see:
  - Header with "Welcome, [Your Name]"
  - "Logout" button in the header
  - Overview section with stats (Total Expenses, Budget, Savings)
  - Analytics section with expense chart
  - Recent Transactions section
- The dashboard fetches your expenses from the backend

### 4. Add Expense
- Click on "Add Expense" button in the header
- Fill in the expense details:
  - Description: e.g., "Lunch"
  - Category: e.g., "Food"
  - Amount: e.g., 250
  - Date: Select a date
- Click "Add Expense"
- The new expense should appear in your transactions list
- The stats should update accordingly

### 5. Logout Flow
- Click the "Logout" button in the header
- You should see a logout success toast
- You will be redirected to the login page
- Your authentication token is removed from localStorage

### 6. Login Flow
- On the login page, enter:
  - Email: The email you used to sign up
  - Password: Your password
- Click "Sign in"
- Upon successful login:
  - You should see a success toast
  - You will be redirected to the dashboard
  - Your previous expenses should still be visible

### 7. Protected Routes
- Try to access http://localhost:5173/dashboard without logging in
- You should be automatically redirected to the login page
- After logging in, try to visit http://localhost:5173
- You should be automatically redirected to the dashboard

## API Testing with curl

You can also test the backend APIs directly:

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Expenses (with token)
```bash
curl http://localhost:3000/api/expenses/recent \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Add Expense (with token)
```bash
curl -X POST http://localhost:3000/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "description": "Coffee",
    "category": "Food",
    "amount": 150,
    "date": "2025-01-20"
  }'
```

## Troubleshooting

### Backend won't start
- Check that MongoDB URI is correct in `server/.env`
- Check that MongoDB is accessible
- Check console for error messages

### Frontend can't connect to backend
- Verify backend is running on port 3000
- Check `.env` file has correct `VITE_API_BASE_URL=http://localhost:3000`
- Check browser console for CORS errors

### Login/Signup not working
- Open browser DevTools (F12)
- Check Network tab for API call responses
- Check Console tab for JavaScript errors
- Verify backend is running and accessible

### Expenses not loading
- Check that you're logged in (token exists in localStorage)
- Check browser console for errors
- Check Network tab for 401 Unauthorized errors
- Try logging out and logging back in

## Expected Behavior Summary

✅ Home page is accessible without authentication
✅ Login and Signup pages are accessible without authentication
✅ Dashboard is only accessible when authenticated
✅ Attempting to access dashboard without auth redirects to login
✅ Attempting to access home when authenticated redirects to dashboard
✅ User data persists across page refreshes (stored in localStorage)
✅ Logout clears authentication and redirects to login
✅ All API calls include proper authorization headers
✅ Toast notifications provide feedback for all actions
✅ Backend runs independently on port 3000
✅ Frontend runs on port 5173 (Vite default)
