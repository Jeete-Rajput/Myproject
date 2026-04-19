const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, address } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phoneNumber,
      address,
      role: 'user',
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: 'User registered successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error registering user',
    });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check for user (include password in query)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is inactive',
      });
    }

    // Compare passwords
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: 'Login successful',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error logging in',
    });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('booksIssued');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Calculate fine based on book issues
    let currentFine = 0;
    const Book = require('../models/Book');
    const books = await Book.find({ 'issuedTo.userId': user._id, 'issuedTo.status': 'issued' });
    
    const now = new Date();
    books.forEach(book => {
      const issuedRecord = book.issuedTo.find(r => r.userId.toString() === user._id.toString() && r.status === 'issued');
      if (issuedRecord && now > issuedRecord.dueDate && !issuedRecord.fineCleared) {
        const daysLate = Math.ceil((now - issuedRecord.dueDate) / (1000 * 60 * 60 * 24));
        currentFine += daysLate * 10;
      }
    });

    res.status(200).json({
      success: true,
      data: { ...user.toObject(), currentFine },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching profile',
    });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const usersRaw = await User.find().select('-password').lean();
    const Book = require('../models/Book');
    
    const now = new Date();
    const books = await Book.find({ 'issuedTo.status': 'issued' });

    // Inject fine amounts
    const users = usersRaw.map(user => {
      let currentFine = 0;
      books.forEach(book => {
        const issuedRecord = book.issuedTo.find(r => r.userId.toString() === user._id.toString() && r.status === 'issued');
        if (issuedRecord && now > issuedRecord.dueDate && !issuedRecord.fineCleared) {
          const daysLate = Math.ceil((now - issuedRecord.dueDate) / (1000 * 60 * 60 * 24));
          currentFine += daysLate * 10;
        }
      });
      return { ...user, currentFine };
    });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching users',
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, phoneNumber, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, phoneNumber, address },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating profile',
    });
  }
};

// @desc    Clear user fine
// @route   PUT /api/users/clear-fine/:id
// @access  Private/Admin
exports.clearUserFine = async (req, res) => {
  try {
    const userId = req.params.id;
    const Book = require('../models/Book');

    const now = new Date();
    const booksWithFines = await Book.find({ 'issuedTo.userId': userId, 'issuedTo.status': 'issued' });

    for (let book of booksWithFines) {
      let changed = false;
      for (let record of book.issuedTo) {
        if (record.userId.toString() === userId.toString() && record.status === 'issued' && now > record.dueDate && !record.fineCleared) {
          record.fineCleared = true;
          changed = true;
        }
      }
      if (changed) {
        await book.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'User fines cleared successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error clearing fine',
    });
  }
};
