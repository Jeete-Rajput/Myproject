# 🏗️ System Architecture & Data Flow

## 📊 Complete System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      USER'S BROWSER                          │
│                   (http://localhost:3000)                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐      ┌──────────────────────┐    │
│  │   Login/Register      │      │   App.js             │    │
│  │   Components          │      │   (Router Logic)     │    │
│  │                       │      │                      │    │
│  │ - LoginPage           │◄────┤ - State Management   │    │
│  │ - RegistrationPage    │      │ - Authentication     │    │
│  │ - Header              │      │ - Route Protection   │    │
│  │ - BookList            │      │                      │    │
│  │ - AdminDashboard      │      └──────────────────────┘    │
│  └──────────┬───────────┘                                    │
│             │                                                │
│  ┌──────────▼──────────────────────────────────────┐        │
│  │         React Context API (State)                │        │
│  │                                                  │        │
│  │  ┌─────────────────┐    ┌──────────────────┐   │        │
│  │  │  AuthContext    │    │  ThemeContext    │   │        │
│  │  │                 │    │                  │   │        │
│  │  │ - isAuth        │    │ - isDarkMode     │   │        │
│  │  │ - user          │    │ - toggleTheme    │   │        │
│  │  │ - loading       │    │                  │   │        │
│  │  │ - error         │    │                  │   │        │
│  │  │ - login()       │    │                  │   │        │
│  │  │ - register()    │    │                  │   │        │
│  │  │ - logout()      │    │                  │   │        │
│  │  └─────────────────┘    └──────────────────┘   │        │
│  └──────────┬───────────────────────────────────┬─┘        │
│             │                                   │            │
│  ┌──────────▼─────────┐      ┌──────────────────▼──┐        │
│  │  Service Layer     │      │  Browser Storage    │        │
│  │                    │      │                     │        │
│  │ - authService      │      │ - localStorage      │        │
│  │ - bookService      │      │   - authToken       │        │
│  │ - bookManagement   │      │   - user data       │        │
│  │   Service          │      │                     │        │
│  └──────────┬─────────┘      └─────────────────────┘        │
│             │                                                │
│             │ HTTP Requests (JSON)                          │
│             │ Headers: Authorization: Bearer <token>        │
│             │ CORS enabled                                  │
│             │                                                │
└─────────────┼────────────────────────────────────────────────┘
              │
              │ Network
              │
┌─────────────▼────────────────────────────────────────────────┐
│              BACKEND SERVER (Node.js/Express)                │
│           (http://localhost:5000/api)                        │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────┐    │
│  │           Express Routes                            │    │
│  │                                                      │    │
│  │  POST   /users/register                             │    │
│  │  POST   /users/login                                │    │
│  │  GET    /users/profile (auth required)              │    │
│  │  GET    /books                                       │    │
│  │  POST   /books/add (admin only)                     │    │
│  │  PUT    /books/issue/:id (auth required)            │    │
│  │  PUT    /books/return/:id (auth required)           │    │
│  └────────────────┬───────────────────────────────────┘    │
│                   │                                         │
│  ┌────────────────▼────────────────────────────────┐       │
│  │  Middleware Chain                               │       │
│  │                                                 │       │
│  │  1. CORS Middleware                             │       │
│  │  2. JSON Parser                                 │       │
│  │  3. Auth Middleware (JWT verification)          │       │
│  │  4. Route Handler                               │       │
│  └────────────────┬────────────────────────────────┘       │
│                   │                                         │
│  ┌────────────────▼───────────────────────────────┐        │
│  │  Controllers                                   │        │
│  │                                                │        │
│  │  ┌──────────────┐    ┌──────────────────────┐ │        │
│  │  │  User        │    │  Book               │ │        │
│  │  │  Controller  │    │  Controller         │ │        │
│  │  │              │    │                     │ │        │
│  │  │ - register   │    │ - getAllBooks       │ │        │
│  │  │ - login      │    │ - addBook           │ │        │
│  │  │ - getProfile │    │ - issueBook         │ │        │
│  │  │              │    │ - returnBook        │ │        │
│  │  │              │    │ - deleteBook        │ │        │
│  │  └──────────────┘    └──────────────────────┘ │        │
│  └────────────────┬───────────────────────────────┘        │
│                   │                                         │
│  ┌────────────────▼───────────────────────────────┐        │
│  │  Business Logic                               │        │
│  │                                                │        │
│  │  - Password hashing (bcryptjs)                │        │
│  │  - JWT token generation                       │        │
│  │  - Book availability calculation              │        │
│  │  - Permission checking                        │        │
│  └────────────────┬───────────────────────────────┘        │
│                   │                                         │
│  ┌────────────────▼───────────────────────────────┐        │
│  │  Mongoose Models                              │        │
│  │                                                │        │
│  │  ┌──────────────┐    ┌──────────────────────┐ │        │
│  │  │  User Model  │    │  Book Model         │ │        │
│  │  │              │    │                     │ │        │
│  │  │ - name       │    │ - title             │ │        │
│  │  │ - email      │    │ - author            │ │        │
│  │  │ - password   │    │ - category          │ │        │
│  │  │ - role       │    │ - totalCopies       │ │        │
│  │  │ - phone      │    │ - availableCopies   │ │        │
│  │  │ - address    │    │ - issuedTo[]        │ │        │
│  │  └──────────────┘    └──────────────────────┘ │        │
│  └────────────────┬───────────────────────────────┘        │
│                   │                                         │
│                   │ Mongoose ORM                           │
│                   │                                         │
└───────────────────┼─────────────────────────────────────────┘
                    │
                    │ TCP Connection
                    │ (MongoDB Protocol)
                    │
        ┌───────────▼─────────────┐
        │   MongoDB Database      │
        │  (localhost:27017)      │
        ├─────────────────────────┤
        │                         │
        │  Collections:           │
        │  ┌────────────────────┐ │
        │  │ users              │ │
        │  │ {                  │ │
        │  │   _id, name,       │ │
        │  │   email, password, │ │
        │  │   role, ...        │ │
        │  │ }                  │ │
        │  └────────────────────┘ │
        │                         │
        │  ┌────────────────────┐ │
        │  │ books              │ │
        │  │ {                  │ │
        │  │   _id, title,      │ │
        │  │   author, category,│ │
        │  │   issuedTo[], ...  │ │
        │  │ }                  │ │
        │  └────────────────────┘ │
        │                         │
        └─────────────────────────┘
```

---

## 🔄 Registration Flow

```
┌──────────────────┐
│  User Visits App │
│   (Unauthenticated)
└────────┬─────────┘
         │
         ▼
┌──────────────────────┐
│  See Login Page      │
│  Click "Sign up here"│
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  RegistrationPage    │
│  Shows form          │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ User fills form:     │
│ - Name               │
│ - Email              │
│ - Password           │
│ - Confirm Password   │
│ - Optional: Phone,   │
│   Address            │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Frontend Validates  │
│  - All required?     │
│  - Email format?     │
│  - Pass ≥ 6 chars?   │
│  - Passwords match?  │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  POST /api/users/    │
│  register            │
│  (with form data)    │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Backend receives    │
│  request             │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Backend validates   │
│  - Email unique?     │
│  - Data valid?       │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Hash password       │
│  (bcryptjs)          │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Create user in DB   │
│  - Insert user       │
│  - role: 'user'      │
│  - timestamps        │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Generate JWT token  │
│  - exp: +7 days      │
│  - signed with secret│
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Send response:      │
│  {                   │
│    token,            │
│    user: {id, name,  │
│      email, role}    │
│  }                   │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Frontend receives   │
│  response            │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Store in Context:   │
│  - authToken         │
│  - user data         │
│  - isAuthenticated   │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Store in             │
│  localStorage:        │
│  - authToken          │
│  - user               │
└────────┬──────────────┘
         │
         ▼
┌──────────────────────┐
│  Show success msg    │
│  "Registration       │
│   successful!"       │
└────────┬──────────────┘
         │
         ▼
┌──────────────────────┐
│  Redirect to         │
│  Home Page           │
│  (Authenticated)     │
└──────────────────────┘
```

---

## 🔐 Login Flow

```
┌──────────────────┐
│  User visits     │
│  Login Page      │
└────────┬─────────┘
         │
         ▼
┌──────────────────────┐
│  User enters:        │
│  - Email             │
│  - Password          │
│  - Selects role:     │
│    User or Admin     │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Frontend validates  │
│  - Email format?     │
│  - Password entered? │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  POST /api/users/    │
│  login               │
│  Body: {             │
│    email, password   │
│  }                   │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Backend receives    │
│  request             │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Find user by email  │
│  in database         │
└────────┬─────────────┘
         │
         ├─ Not found? ──► Error: Invalid credentials
         │
         ▼
┌──────────────────────┐
│  Compare password:   │
│  bcryptjs.compare    │
│  (entered password   │
│   vs hashed in DB)   │
└────────┬─────────────┘
         │
         ├─ No match? ──► Error: Invalid credentials
         │
         ▼
┌──────────────────────┐
│  Generate JWT token  │
│  - payload: user id, │
│    email, role       │
│  - exp: +7 days      │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Send response:      │
│  {                   │
│    token,            │
│    user: {id, name,  │
│      email, role}    │
│  }                   │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Frontend receives   │
│  response            │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Update AuthContext: │
│  - Set token         │
│  - Set user data     │
│  - isAuthenticated   │
│    = true            │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Save to             │
│  localStorage        │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  App.js checks role: │
│  if role === 'admin' │
│    → Admin Dashboard │
│  else                │
│    → Home/Books      │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Show appropriate    │
│  page with user      │
│  data loaded         │
└──────────────────────┘
```

---

## 📚 Book Issue Flow

```
┌──────────────────┐
│  User logged in  │
│  Viewing books   │
└────────┬─────────┘
         │
         ▼
┌──────────────────────┐
│  Clicks "Issue Book" │
│  button on book      │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Frontend sends:     │
│  PUT /api/books/     │
│  issue/:bookId       │
│  Header:             │
│  Authorization:      │
│  Bearer <token>      │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Backend middleware: │
│  Verify JWT token    │
└────────┬─────────────┘
         │
         ├─ Invalid? ──► Error: Unauthorized
         │
         ▼
┌──────────────────────┐
│  Extract user from   │
│  token               │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Find book by ID     │
└────────┬─────────────┘
         │
         ├─ Not found? ──► Error: Book not found
         │
         ▼
┌──────────────────────┐
│  Check availability: │
│  availableCopies > 0?│
└────────┬─────────────┘
         │
         ├─ No? ──► Error: No copies available
         │
         ▼
┌──────────────────────┐
│  Update book:        │
│  - availableCopies-- │
│  - Add to issuedTo[]:│
│    {userId, issueDate
│     expectedReturn}  │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Save to database    │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Send response:      │
│  {                   │
│    success: true,    │
│    message: "Book    │
│    issued"           │
│  }                   │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Frontend shows:     │
│  "Book issued       │
│   successfully!"     │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Refresh book list   │
│  Show updated        │
│  availability        │
└──────────────────────┘
```

---

## 🔐 API Request/Response Structure

### Registration Request
```
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phoneNumber": "555-1234",
  "address": "123 Main St"
}
```

### Registration Response (Success)
```
HTTP 201 Created

{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Login Request
```
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Login Response (Success)
```
HTTP 200 OK

{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Protected API Request
```
GET /api/books
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Books Response
```
HTTP 200 OK

{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "category": "Fiction",
      "totalCopies": 5,
      "availableCopies": 3,
      "issuedTo": []
    },
    ...
  ],
  "count": 10
}
```

---

## 🎯 Component Hierarchy

```
App.js (Root)
├── AuthContext Provider
│   ├── ThemeContext Provider
│   │   ├── LoginPage
│   │   │   └── Form with validation
│   │   │
│   │   ├── RegistrationPage (if showRegistration)
│   │   │   └── Form with validation
│   │   │
│   │   ├── Header
│   │   │   ├── Logo/Title
│   │   │   ├── Navigation
│   │   │   ├── SearchBar
│   │   │   ├── ThemeToggle
│   │   │   └── UserMenu
│   │   │
│   │   ├── HeroSection
│   │   │
│   │   ├── FeaturedSection
│   │   │
│   │   ├── CategoriesSection
│   │   │
│   │   ├── BookList
│   │   │   └── BookCard (repeated)
│   │   │
│   │   ├── TestimonialsSection
│   │   │
│   │   ├── StatsSection
│   │   │
│   │   ├── NewsletterSection
│   │   │
│   │   └── AdminDashboard (if isAdmin)
│   │       ├── Add Book Form
│   │       ├── Books Management
│   │       └── Users Management
│   │
│   └── AuthContext
│       ├── login()
│       ├── register()
│       ├── logout()
│       ├── user
│       ├── token
│       └── isAuthenticated
```

---

## 💾 Data Persistence

```
┌─────────────────────────────┐
│   Frontend (Browser)        │
├─────────────────────────────┤
│  localStorage:              │
│  ├── authToken              │
│  │   "eyJhbGciOi..."        │
│  │                          │
│  └── user                   │
│      {id, name, email, role}│
│                             │
│  Persists across:           │
│  - Page refresh             │
│  - Browser close/reopen     │
│  - Session timeout (7 days) │
└─────────────────────────────┘
         │
         │ (Sent with each request)
         │ Authorization header
         │
┌────────▼─────────────────────┐
│   Backend (Express)          │
├──────────────────────────────┤
│  Verifies token              │
│  Checks expiration           │
│  Extracts user info          │
└────────┬──────────────────────┘
         │
         │ Database queries
         │
┌────────▼──────────────────────┐
│   MongoDB Database            │
├───────────────────────────────┤
│  Collections:                 │
│  ├── users (user documents)   │
│  │   - Passwords hashed       │
│  │   - Roles stored           │
│  │                            │
│  └── books (book documents)   │
│      - Availability tracked   │
│      - Issue history stored   │
│                               │
│  Persistence:                 │
│  - Permanent until deleted    │
│  - Survives server restart    │
│  - Backed up (production)     │
└───────────────────────────────┘
```

---

This architecture ensures:
- ✅ Secure authentication
- ✅ Scalable backend
- ✅ Responsive frontend
- ✅ Data persistence
- ✅ Role-based access
- ✅ Real-time synchronization
