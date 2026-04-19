# 🚀 Quick Test Guide - Registration & Login

Get your registration and login system up and running in minutes!

---

## ⚙️ Prerequisites

Make sure you have:
1. ✅ Node.js installed
2. ✅ MongoDB running (local or Atlas)
3. ✅ Backend installed and running
4. ✅ Frontend installed

---

## 🎬 Start Everything

### Terminal 1: Backend
```bash
cd backend
npm install          # Install dependencies (only first time)
npm run dev          # Start development server
```

Expected output:
```
MongoDB Connected: localhost
Server is running on port 5000
Environment: development
```

### Terminal 2: Frontend
```bash
cd frontend
npm install          # Install dependencies (only first time)
npm start            # Start development server
```

Expected output:
```
Compiled successfully!

You can now view bookstore in the browser.
  
  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

---

## ✅ Test 1: Registration

### Step 1: Open the App
1. Go to `http://localhost:3000`
2. You should see the Login Page

### Step 2: Switch to Registration
1. Look for the text: **"Don't have an account? Sign up here"**
2. Click the **"Sign up here"** link
3. Should show the Registration Page with:
   - Beautiful purple gradient background
   - Floating book animations
   - Registration form on the right

### Step 3: Fill Registration Form
Enter this test data:
```
Full Name:          John Doe
Email:              john.doe@example.com
Password:           password123
Confirm Password:   password123
Phone Number:       555-1234 (optional - you can leave blank)
Address:            123 Main Street (optional - you can leave blank)
```

### Step 4: Validate Form
The form should validate:
- ✅ All required fields filled
- ✅ Email format valid
- ✅ Password ≥ 6 characters
- ✅ Passwords match

### Step 5: Submit
1. Click **"Create Account"** button
2. Should see loading spinner
3. Wait for response from backend

### Step 6: Success
You should see:
- ✅ "Registration successful!" message
- ✅ Auto-redirect to home page
- ✅ Books loading from backend
- ✅ Header showing user is logged in

---

## ✅ Test 2: Test Form Validation

Try these invalid inputs and verify error messages appear:

### Test 2a: No Name
```
Email: test@test.com
Password: pass123
→ Click Create Account
→ Error: "Name is required"
```

### Test 2b: Invalid Email
```
Name: Test
Email: notanemail
Password: pass123
→ Error: "Please enter a valid email address"
```

### Test 2c: Password Too Short
```
Password: test1
→ Error: "Password must be at least 6 characters"
```

### Test 2d: Passwords Don't Match
```
Password: password123
Confirm: password456
→ Error: "Passwords do not match"
```

---

## ✅ Test 3: Duplicate Email

### First Registration
1. Register with: `user1@test.com`
2. ✅ Should succeed and redirect

### Try Same Email Again
1. Go back to registration
2. Try same email: `user1@test.com`
3. ✅ Error: "User with this email already exists"
4. Try different email: `user2@test.com`
5. ✅ Registration succeeds

---

## ✅ Test 4: Login

### Logout First
1. Look for logout button (top right)
2. Click to logout
3. Should show login page

### Test Login
1. Click "Already have an account? Sign in here"
2. Enter credentials:
   ```
   Email:    john.doe@example.com
   Password: password123
   ```
3. Select: **"👤 User Login"** (not admin)
4. Click **"Sign In"**
5. ✅ Should login and redirect to home page

### Test With Wrong Password
1. Same email but wrong password: `wrongpassword`
2. Click Sign In
3. ✅ Error: "Invalid credentials"

### Test Admin Login
1. Note: Admin accounts must have `role: 'admin'` in database
2. Can't register as admin through UI
3. See "Create Admin Account" section below

---

## ✅ Test 5: Page Refresh - Token Persistence

### Login and Refresh
1. Login with your test account
2. You should see home page with books
3. **Refresh the page** (F5 or Ctrl+R)
4. ✅ Should stay logged in!
5. ✅ Books should reload
6. ✅ No need to login again

### Verify Token Storage
1. Right-click → **Inspect** (or F12)
2. Go to **Application** tab
3. Click **LocalStorage**
4. Look for `http://localhost:3000`
5. You should see:
   - `authToken` - JWT token
   - `user` - User object

---

## ✅ Test 6: Switch Between Pages

### Test Switching
1. On login page, click "Sign up here"
2. ✅ Should show registration page
3. Click "Already have an account? Sign in here"
4. ✅ Should show login page
5. Click "Sign up here" again
6. ✅ Should show registration page

---

## 👨‍💼 Test 7: Create Admin Account (Manual)

To create an admin account for testing:

### Option 1: Modify Registration
You could temporarily modify `RegisterPage.js` to allow admin registration:
```javascript
// In form submission, add:
const userData = {
  ...formData,
  role: loginType === 'admin' ? 'admin' : 'user'  // Add this
};
```

### Option 2: Use Backend Directly
1. Create admin account directly in MongoDB:
```bash
# Connect to MongoDB
mongo

# Use database
use booklibrary

# Insert admin user
db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "$2a$10$...",  // hashed password
  role: "admin",
  isActive: true
})
```

### Option 3: Use API Testing Tool (Postman)
1. Open Postman
2. Create POST request to `http://localhost:5000/api/users/register`
3. Add header: `Content-Type: application/json`
4. Body:
```json
{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "admin123"
}
```
5. Send
6. Then manually update role in MongoDB to "admin"

---

## 📊 Test Results Checklist

Mark these off as you test:

### Registration
- [ ] Can access registration page
- [ ] Form validation works
- [ ] Can submit valid registration
- [ ] Error messages display correctly
- [ ] Can't register duplicate email
- [ ] Success message appears
- [ ] Redirects to home page after registration

### Login
- [ ] Can access login page
- [ ] Can login with registered account
- [ ] Wrong password shows error
- [ ] Stays logged in after page refresh
- [ ] Can switch between login/registration

### UI/UX
- [ ] Loading spinner appears during submission
- [ ] Error messages styled correctly
- [ ] Success messages styled correctly
- [ ] Forms are responsive on mobile
- [ ] Animations work smoothly

### API Integration
- [ ] Backend receives registration data
- [ ] Backend receives login request
- [ ] Token is returned and stored
- [ ] User data is stored in localStorage
- [ ] Token persists after refresh

---

## 🐛 If Something Doesn't Work

### Registration page doesn't show
```bash
# Check if RegistrationPage.js exists
ls frontend/src/pages/RegistrationPage.js

# Check if imported in App.js
grep "RegistrationPage" frontend/src/App.js
```

### Can't register - API error
```bash
# Check backend is running
curl http://localhost:5000/

# Check MongoDB connection
# Look at backend console for errors

# Test with Postman:
POST http://localhost:5000/api/users/register
{
  "name": "Test",
  "email": "test@test.com",
  "password": "test123"
}
```

### Login not working
```bash
# Check token is being stored
# Open DevTools (F12) → Application → LocalStorage

# Check if user exists in database
# Connect to MongoDB and check users collection
```

### Books not loading after login
```bash
# Check backend is returning books
curl http://localhost:5000/api/books

# Check browser console for errors (F12)
# Look for CORS or network errors
```

---

## 📱 Test on Mobile

To test on your phone:

1. Find your computer's IP:
```bash
# On Windows
ipconfig | grep "IPv4"

# On Mac/Linux
ifconfig | grep "inet"
```

2. On your phone, go to:
```
http://YOUR.IP.ADDRESS:3000
```

3. Test registration and login:
   - Form inputs work on touch
   - Buttons are clickable
   - Layout looks good on small screen
   - No horizontal scrolling

---

## 🎯 Test Data You Can Use

### Test User 1
```
Name: Alice Johnson
Email: alice@example.com
Password: alice123
Phone: 555-0001
Address: 123 Oak Street
```

### Test User 2
```
Name: Bob Smith
Email: bob@example.com
Password: bob1234567
Phone: 555-0002
Address: 456 Pine Avenue
```

### Test User 3
```
Name: Carol White
Email: carol@example.com
Password: carol123
Phone: (leave blank)
Address: (leave blank)
```

---

## 📝 Notes

- **First-time registration**: Can take 1-2 seconds (hashing password)
- **Demo accounts**: Not pre-created. Use registration to create accounts
- **Admin role**: Must be set manually in database or through admin panel
- **Token expiration**: 7 days from login/registration
- **Email uniqueness**: Each email can only be registered once
- **Password hashing**: Uses bcryptjs (passwords are never stored plain-text)

---

## 🎉 Success Indicators

You'll know everything is working when:

✅ Can register new user successfully  
✅ Can login with registered credentials  
✅ Stays logged in after page refresh  
✅ Form validation prevents invalid input  
✅ Error messages display correctly  
✅ Books load after login  
✅ Can switch between login/registration  
✅ Works on mobile devices  
✅ No console errors  
✅ Backend logs show successful requests  

---

## 📞 If You're Stuck

1. Check backend console for errors
2. Check browser console (F12) for errors
3. Verify MongoDB is running
4. Verify backend is on port 5000
5. Verify frontend is on port 3000
6. Check that .env files are configured
7. Restart backend and frontend
8. Clear browser cache and localStorage

---

## 🚀 Next Steps After Testing

Once registration and login are working:

1. Build admin dashboard
2. Add book management features
3. Add issue/return book functionality
4. Build user profile page
5. Add email notifications
6. Add password reset
7. Implement search and filters
8. Deploy to production

Enjoy! 🎉
