# ⚡ Quick Start Guide - Backend & Frontend

Get your full-stack Book Library application running in 5 minutes!

---

## Prerequisites ✅

Before you start, make sure you have:
- **Node.js** (v14+) - [Download](https://nodejs.org/)
- **MongoDB** - Either:
  - Local: [Download Community Edition](https://www.mongodb.com/try/download/community)
  - Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** - VS Code recommended

---

## 🚀 Start Backend (Terminal 1)

### 1. Navigate to Backend Folder
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File
```bash
cp .env.example .env
```

### 4. Update `.env` File
Edit `.env` and add your MongoDB connection:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/booklibrary
JWT_SECRET=your_secret_key_change_this_in_production
NODE_ENV=development
```

**MongoDB Atlas Users:** Replace with:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/booklibrary
```

### 5. Start Backend Server
```bash
npm run dev
```

✅ **Backend is running!** You should see:
```
MongoDB Connected: localhost
Server is running on port 5000
```

---

## 🎨 Start Frontend (Terminal 2)

### 1. Navigate to Frontend Folder
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File
```bash
cp .env.example .env
```

The `.env` should have:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Start Frontend
```bash
npm start
```

✅ **Frontend is running!** Browser opens at:
```
http://localhost:3000
```

---

## 🧪 Test Your Setup

### Step 1: Register a User
1. Click "Sign Up" on the login page
2. Fill in details:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
3. Click Register

### Step 2: Login
1. Click "Sign In"
2. Use credentials from registration
3. You should be logged in!

### Step 3: View Books
1. On homepage, scroll to see books
2. Try searching for a book
3. Click on a book to see details

### Step 4: Test with Postman (Optional)

Use [Postman](https://www.postman.com/) to test API directly:

**Register User:**
```
POST http://localhost:5000/api/users/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "role": "user"
  }
}
```

**Get All Books:**
```
GET http://localhost:5000/api/books
```

---

## 📁 File Structure

```
Myproject/
├── backend/
│   ├── config/db.js              ← Database connection
│   ├── models/
│   │   ├── Book.js               ← Book schema
│   │   └── User.js               ← User schema
│   ├── controllers/
│   │   ├── bookController.js     ← Book logic
│   │   └── userController.js     ← User logic
│   ├── routes/
│   │   ├── bookRoutes.js         ← Book endpoints
│   │   └── userRoutes.js         ← User endpoints
│   ├── middleware/
│   │   └── auth.js               ← JWT auth
│   ├── server.js                 ← Main file
│   ├── .env                      ← Your settings
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── services/
    │   │   ├── bookService.js            ← Fetch books
    │   │   ├── authService.js            ← Login/Register
    │   │   └── bookManagementService.js  ← Admin operations
    │   ├── components/                   ← React components
    │   ├── pages/                        ← Pages
    │   └── context/                      ← State management
    ├── .env                      ← Frontend settings
    └── package.json
```

---

## 🔐 Authentication Flow

### How It Works:

1. **User Registers** → Password hashed with bcryptjs
2. **System Creates Account** → Stored in MongoDB
3. **User Logs In** → Credentials verified
4. **Token Generated** → JWT token created
5. **Token Stored** → Saved in browser localStorage
6. **Protected Requests** → Token sent with API calls
7. **Backend Verifies** → Token validated on each request

### Token in Header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📡 Key API Endpoints

### Public Endpoints (No Auth Required)
```
GET  /api/books                    # List all books
GET  /api/books/:id                # Get single book
POST /api/users/register           # Create new user
POST /api/users/login              # Login user
```

### Protected Endpoints (Auth Required)
```
GET  /api/users/profile            # Get your profile
PUT  /api/users/:id                # Update profile
POST /api/books/add                # Add book (Admin)
PUT  /api/books/issue/:id          # Issue book (Admin)
PUT  /api/books/return/:id         # Return book (Admin)
DELETE /api/books/:id              # Delete book (Admin)
```

---

## 🛠️ Common Commands

### Backend
```bash
cd backend

npm install              # Install dependencies
npm run dev              # Start development server
npm start                # Start production server
npm test                 # Run tests (if available)
```

### Frontend
```bash
cd frontend

npm install              # Install dependencies
npm start                # Start dev server (port 3000)
npm run build            # Build for production
npm test                 # Run tests
npm run eject            # Eject from CRA (one-way!)
```

---

## 🔍 Troubleshooting

### Backend Won't Start
```
✗ Error: EADDRINUSE - Port 5000 already in use
→ Change PORT in .env to 5001, or kill process using port 5000

✗ Error: MongoDB connection failed
→ Ensure MongoDB is running (local or Atlas connection valid)

✗ Error: Cannot find module
→ Run: npm install (in backend folder)
```

### Frontend Crashes
```
✗ Error: CORS error
→ Ensure backend is running on http://localhost:5000

✗ Error: API calls failing
→ Check REACT_APP_API_URL in .env

✗ Cannot find module
→ Run: npm install (in frontend folder)
```

### Login Not Working
```
✗ Login fails with 401 Unauthorized
→ Check email/password are correct
→ Verify user exists in MongoDB

✗ Token not stored
→ Check browser localStorage settings
→ Open DevTools → Application → LocalStorage
```

### Database Issues
```
✗ Cannot connect to MongoDB
→ Check MongoDB URI in .env
→ Ensure MongoDB service is running
→ For Atlas: verify IP whitelist allows your computer
```

---

## 💾 MongoDB Setup

### Option 1: Local MongoDB
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Windows
# Start MongoDB Server from Services or:
mongod

# Linux
sudo systemctl start mongodb
```

### Option 2: MongoDB Atlas (Cloud)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster
4. Get connection string
5. Add to `.env` as `MONGODB_URI`

---

## 🎯 Next Steps

1. ✅ Backend running on localhost:5000
2. ✅ Frontend running on localhost:3000
3. ✅ MongoDB connected
4. ✅ User registration working
5. ✅ Login authentication working

### Now You Can:
- Browse books on homepage
- Register new users
- Login with credentials
- View user profile
- (Admins can manage books with proper setup)

---

## 📚 Learn More

- **Backend Setup:** See `/backend/README.md`
- **Full Guide:** See `/SETUP_GUIDE.md`
- **Frontend Code:** See `/frontend/README.md`
- **Express Docs:** https://expressjs.com/
- **MongoDB Docs:** https://docs.mongodb.com/
- **React Docs:** https://react.dev/

---

## ✅ Checklist

Before considering setup complete:

- [ ] Backend running without errors
- [ ] Frontend running without errors
- [ ] MongoDB connected
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Can see books on homepage
- [ ] User profile loads correctly

---

## 🎉 You're All Set!

Your full-stack application is now ready for development!

### Quick Summary:
```
Terminal 1: cd backend && npm run dev
Terminal 2: cd frontend && npm start
Browser:   http://localhost:3000
API:       http://localhost:5000/api
```

Happy coding! 🚀

---

## 📞 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Check backend logs in Terminal 1
3. Check frontend console (F12 → Console)
4. Verify MongoDB is running
5. Verify .env files are correct
