# Task Planner Frontend

A modern React application built with Vite for managing tasks and user profiles.

## Features

- **Authentication**: Login, Signup, and secure JWT token management
- **User Profile**: View and manage user profile information
- **Settings**: Update profile and change password
- **Todo Management**: Full CRUD operations for todos
- **Dashboard**: Overview of todos and statistics
- **Protected Routes**: Secure access to authenticated pages
- **Auto Token Refresh**: Automatic access token refresh using refresh tokens

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.jsx      # Navigation bar
│   └── ProtectedRoute.jsx  # Route protection wrapper
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication state management
├── pages/              # Page components
│   ├── Dashboard.jsx   # Dashboard/home page
│   ├── Login.jsx       # Login page
│   ├── Signup.jsx      # Signup page
│   ├── Profile.jsx     # User profile page
│   ├── Settings.jsx    # Settings page
│   └── Todos.jsx       # Todo management page
├── services/           # API services
│   ├── api.js          # Axios instance with interceptors
│   ├── authService.js  # Authentication API calls
│   ├── userService.js  # User API calls
│   └── todoService.js  # Todo API calls
├── utils/              # Utility functions
│   └── validation.js   # Input validation functions
├── App.jsx             # Main app component with routing
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend server running on `http://localhost:3000`

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000
```

If not set, the app will use relative URLs which work with the Vite proxy in development.

## API Integration

The frontend communicates with the backend API at `/api` endpoints:

- `/api/auth/*` - Authentication endpoints
- `/api/user/*` - User management endpoints
- `/api/todos/*` - Todo management endpoints

The API service automatically handles:
- Adding JWT access tokens to requests
- Refreshing expired access tokens
- Redirecting to login on authentication failure

## Features Overview

### Authentication
- Secure login and signup with validation
- JWT token management (access + refresh tokens)
- Automatic token refresh on expiration
- Protected routes requiring authentication

### Todo Management
- Create, read, update, and delete todos
- Toggle todo completion status
- Inline editing of todos
- Todo statistics on dashboard

### User Management
- View user profile with all information
- Update profile (name, email)
- Change password with validation
- Delete account (with confirmation)

## Technologies

- React 19
- React Router DOM 7
- Vite 7
- Axios
- CSS3

