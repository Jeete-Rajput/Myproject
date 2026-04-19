# Book Library Management System - Complete Setup Guide

## 🎯 Project Overview

Your project now has a complete full-stack book library management system with:

### Backend Features ✅
- Express.js server with MongoDB integration
- User authentication with JWT tokens
- Book management system
- Book issuing and returning functionality
- Role-based access control (Admin/User)
- CORS enabled for frontend communication

### Frontend Features ✅
- Existing React components
- Service layer for API communication
- Authentication service
- Book management service

---

## 📁 Project Structure

```
Myproject/
├── backend/                    # NEW - Express.js server
│   ├── config/
│   │   └── db.js              # MongoDB connection config
│   ├── controllers/
│   │   ├── bookController.js  # Book operations logic
│   │   └── userController.js  # User operations logic
│   ├── models/
│   │   ├── Book.js            # Book schema
│   │   └── User.js            # User schema
│   ├── routes/
│   │   ├── bookRoutes.js      # Book API routes
│   │   └── userRoutes.js      # User API routes
│   ├── middleware/
│   │   └── auth.js            # JWT authentication
│   ├── server.js              # Main server file
│   ├── package.json           # Backend dependencies
│   └── .env.example           # Environment template
│
└── frontend/                   # EXISTING - React app
    ├── src/
    │   ├── services/
    │   │   ├── bookService.js         # UPDATED - API calls
    │   │   ├── authService.js         # NEW - Auth API
    │   │   └── bookManagementService.js # NEW - Book management API
    │   └── ...other components
    └── .env.example            # NEW - Frontend environment
```

---

## 🚀 Getting Started

### Step 1: Install MongoDB
Make sure MongoDB is installed and running on your system:
- Download from: https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

### Step 2: Setup Backend

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB URI and JWT secret:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/booklibrary
JWT_SECRET=your_super_secret_jwt_key_here_change_this
NODE_ENV=development
```

5. Start the backend server:
```bash
npm run dev
```

You should see: `Server is running on port 5000`

### Step 3: Setup Frontend

1. Navigate to frontend folder:
```bash
cd ../frontend
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. The `.env` should contain:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Install dependencies (if not already done):
```bash
npm install
```

5. Start the frontend:
```bash
npm start
```

---

## 📡 API Endpoints

### Book Endpoints

#### Public Endpoints:
- `GET /api/books` - Get all books (with optional search/category filters)
- `GET /api/books/:id` - Get book by ID

#### Admin Only Endpoints:
- `POST /api/books/add` - Add a new book
  ```json
  {
    "title": "Book Title",
    "author": "Author Name",
    "category": "Fiction",
    "description": "Book description",
    "isbn": "ISBN-123",
    "publishedYear": 2023,
    "totalCopies": 5
  }
  ```

- `PUT /api/books/issue/:id` - Issue a book
  ```json
  {
    "userId": "user_id",
    "dueDate": "2024-05-19"
  }
  ```

- `PUT /api/books/return/:id` - Return a book
  ```json
  {
    "userId": "user_id"
  }
  ```

- `DELETE /api/books/:id` - Delete a book

### User Endpoints

#### Public Endpoints:
- `POST /api/users/register` - Register new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phoneNumber": "1234567890",
    "address": "123 Street"
  }
  ```

- `POST /api/users/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

#### Protected Endpoints (requires token):
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users` - Get all users (Admin only)

---

## 🔐 Authentication

The backend uses JWT (JSON Web Tokens) for authentication:

1. **Register/Login**: You'll receive a token
2. **Store Token**: Token is stored in localStorage automatically
3. **Send Token**: Include in Authorization header:
   ```
   Authorization: Bearer <your_token_here>
   ```

### Using Auth Services in Frontend:

```javascript
import { loginUser, registerUser, isAuthenticated } from './services/authService';
import { addBook, issueBook } from './services/bookManagementService';

// Register user
const registerData = await registerUser({
  name: 'John',
  email: 'john@example.com',
  password: 'pass123'
});

// Login user
const loginData = await loginUser('john@example.com', 'pass123');

// Check if authenticated
if (isAuthenticated()) {
  // Can now make protected API calls
  const book = await addBook({
    title: 'New Book',
    author: 'Author',
    category: 'Fiction',
    totalCopies: 5
  });
}
```

---

## 🎨 Frontend Service Layer

### bookService.js
Handles general book fetching and searching:
```javascript
import { fetchBooks, fetchBookById, searchBooks } from './services/bookService';

const books = await fetchBooks();
const book = await fetchBookById(bookId);
const results = await searchBooks('search term');
```

### authService.js
Handles user authentication:
```javascript
import { 
  registerUser, 
  loginUser, 
  logoutUser,
  isAuthenticated,
  isAdmin
} from './services/authService';

await registerUser(userData);
await loginUser(email, password);
logoutUser();
```

### bookManagementService.js
Handles admin book operations:
```javascript
import { 
  addBook, 
  issueBook, 
  returnBook, 
  deleteBook 
} from './services/bookManagementService';

await addBook(bookData);
await issueBook(bookId, userId, dueDate);
await returnBook(bookId, userId);
await deleteBook(bookId);
```

---

## 🧪 Testing the Backend

Use Postman or similar tool to test:

1. **Register User:**
   - POST: `http://localhost:5000/api/users/register`
   - Body: `{ "name": "Test", "email": "test@test.com", "password": "test123" }`

2. **Login:**
   - POST: `http://localhost:5000/api/users/login`
   - Body: `{ "email": "test@test.com", "password": "test123" }`
   - Response includes: `token`, `user` object

3. **Add Book (with token):**
   - POST: `http://localhost:5000/api/books/add`
   - Headers: `Authorization: Bearer <token>`
   - Body: `{ "title": "Book", "author": "Author", "category": "Fiction", "totalCopies": 5 }`

4. **Get All Books:**
   - GET: `http://localhost:5000/api/books`

---

## 📋 Book Categories

The system supports these categories:
- Fiction
- Non-Fiction
- Science
- History
- Technology
- Biography
- Other

---

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - development/production

**Frontend (.env):**
- `REACT_APP_API_URL` - Backend API URL

---

## 📚 Database Schemas

### Book Schema
```javascript
{
  title: String,           // Required
  author: String,          // Required
  category: String,        // Required
  description: String,
  isbn: String,            // Unique
  publishedYear: Number,
  totalCopies: Number,     // Required
  availableCopies: Number, // Auto-calculated
  issuedTo: Array,         // Issue history
  coverImage: String,
  timestamps: true         // createdAt, updatedAt
}
```

### User Schema
```javascript
{
  name: String,            // Required
  email: String,           // Required, Unique
  password: String,        // Hashed
  role: String,            // 'user' or 'admin'
  phoneNumber: String,
  address: String,
  booksIssued: Array,      // Book references
  isActive: Boolean,       // Default: true
  timestamps: true         // createdAt, updatedAt
}
```

---

## ✅ All Implemented Features

- ✅ Express server with CORS
- ✅ MongoDB integration with Mongoose
- ✅ User registration and login
- ✅ JWT authentication
- ✅ Password hashing with bcryptjs
- ✅ Book CRUD operations
- ✅ Book issuing system
- ✅ Book returning system
- ✅ Role-based access control
- ✅ Frontend service layer
- ✅ Environment configuration
- ✅ Error handling
- ✅ Input validation

---

## 🐛 Troubleshooting

**Backend won't start:**
- Ensure MongoDB is running
- Check if port 5000 is available
- Verify .env file has correct MongoDB URI

**CORS errors:**
- Backend has CORS enabled for localhost:3000
- Update CORS in server.js if frontend is on different port

**Authentication errors:**
- Ensure JWT_SECRET is set in .env
- Check token is stored in localStorage
- Verify Authorization header format: `Bearer <token>`

**Database connection errors:**
- Verify MongoDB is running
- Check MONGODB_URI is correct
- Ensure database has sufficient permissions

---

## 🚀 Next Steps

1. Start the backend server
2. Start the frontend
3. Test authentication flow
4. Integrate with your frontend components
5. Build admin dashboard for book management
6. Deploy to production

---

## 📞 Support

For issues or questions, refer to:
- Backend: `/backend/README.md`
- Express docs: https://expressjs.com/
- Mongoose docs: https://mongoosejs.com/
- JWT docs: https://jwt.io/
