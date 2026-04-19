const express = require('express');
const router = express.Router();
const {
  addBook,
  getAllBooks,
  issueBook,
  returnBook,
  getBookById,
  deleteBook,
  borrowBook,
  returnUserBook,
} = require('../controllers/bookController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/', getAllBooks);
router.get('/:id', getBookById);

// User routes
router.post('/borrow/:id', protect, borrowBook);
router.post('/return-book/:id', protect, returnUserBook);

// Admin routes
router.post('/add', protect, adminOnly, addBook);
router.put('/issue/:id', protect, adminOnly, issueBook);
router.put('/return/:id', protect, adminOnly, returnBook);
router.delete('/:id', protect, adminOnly, deleteBook);

module.exports = router;
