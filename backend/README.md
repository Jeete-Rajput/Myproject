# Book Library Management System - Backend

## Overview
This is the backend server for the Book Library Management System built with Express.js and MongoDB.

## Features
- User registration and authentication
- Book management (CRUD operations)
- Book issuing and returning system
- Role-based access control (Admin/User)
- JWT token-based authentication
- CORS enabled for frontend communication

## Technologies Used
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

## Installation

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/booklibrary
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Books
- **POST /api/books/add** - Add a new book (Admin only)
- **GET /api/books** - Get all books
- **GET /api/books/:id** - Get book by ID
- **PUT /api/books/issue/:id** - Issue a book (Admin only)
- **PUT /api/books/return/:id** - Return a book (Admin only)
- **DELETE /api/books/:id** - Delete a book (Admin only)

### Users
- **POST /api/users/register** - Register a new user
- **POST /api/users/login** - Login user
- **GET /api/users/profile** - Get user profile (Protected)
- **PUT /api/users/:id** - Update user profile (Protected)
- **GET /api/users** - Get all users (Admin only)

## Project Structure
```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── bookController.js  # Book operations
│   └── userController.js  # User operations
├── models/
│   ├── Book.js            # Book schema
│   └── User.js            # User schema
├── routes/
│   ├── bookRoutes.js      # Book routes
│   └── userRoutes.js      # User routes
├── middleware/
│   └── auth.js            # Authentication middleware
├── server.js              # Main server file
├── package.json           # Dependencies
└── .env                   # Environment variables
```

## Authentication
The API uses JWT (JSON Web Tokens) for authentication:
1. Register/Login to get a token
2. Include token in Authorization header: `Bearer <token>`
3. Protected routes will verify the token

## Notes
- Make sure MongoDB is running before starting the server
- Admin users can manage books (add, issue, return, delete)
- Regular users can view books and manage their profile
- All passwords are hashed using bcryptjs
