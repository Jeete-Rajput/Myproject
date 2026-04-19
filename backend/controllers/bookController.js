const Book = require('../models/Book');

// @desc    Add a new book
// @route   POST /api/books/add
// @access  Admin
exports.addBook = async (req, res) => {
  try {
    const { title, author, category, description, isbn, publishedYear, totalCopies, coverImage } = req.body;

    // Validation
    if (!title || !author || !category || !totalCopies) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, author, category, and totalCopies',
      });
    }

    // Check if book already exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: 'Book with this ISBN already exists',
      });
    }

    const book = await Book.create({
      title,
      author,
      category,
      description,
      isbn,
      publishedYear,
      totalCopies,
      availableCopies: totalCopies,
      coverImage,
    });

    res.status(201).json({
      success: true,
      data: book,
      message: 'Book added successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error adding book',
    });
  }
};

// @desc    Get all books
// @route   GET /api/books
// @access  Public
exports.getAllBooks = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const books = await Book.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching books',
    });
  }
};

// @desc    Issue a book
// @route   PUT /api/books/issue/:id
// @access  Admin
exports.issueBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { userId, dueDate } = req.body;

    if (!userId || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide userId and dueDate',
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No copies available for this book',
      });
    }

    // Add issue record
    book.issuedTo.push({
      userId,
      dueDate,
      status: 'issued',
    });

    book.availableCopies -= 1;
    await book.save();

    res.status(200).json({
      success: true,
      data: book,
      message: 'Book issued successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error issuing book',
    });
  }
};

// @desc    Return a book
// @route   PUT /api/books/return/:id
// @access  Admin
exports.returnBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide userId',
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Find the issued record
    const issuedRecord = book.issuedTo.find(
      (record) => record.userId.toString() === userId && record.status === 'issued'
    );

    if (!issuedRecord) {
      return res.status(400).json({
        success: false,
        message: 'No active issue record found for this user',
      });
    }

    // Mark as returned
    issuedRecord.status = 'returned';
    issuedRecord.returnedDate = new Date();
    book.availableCopies += 1;

    await book.save();

    res.status(200).json({
      success: true,
      data: book,
      message: 'Book returned successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error returning book',
    });
  }
};

// @desc    Get book by ID
// @route   GET /api/books/:id
// @access  Public
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('issuedTo.userId', 'name email');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching book',
    });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Admin
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting book',
    });
  }
};

// @desc    User borrows a book
// @route   POST /api/books/borrow/:id
// @access  Private (User)
exports.borrowBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user.id;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    if (book.availableCopies <= 0) return res.status(400).json({ success: false, message: 'No copies available currently' });

    // Check if user already borrowed this book
    const alreadyBorrowed = book.issuedTo.some(record => record.userId.toString() === userId && record.status === 'issued');
    if (alreadyBorrowed) return res.status(400).json({ success: false, message: 'You have already borrowed this book' });

    // Generate 10 day due date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 10);

    book.issuedTo.push({
      userId,
      dueDate,
      status: 'issued',
    });
    book.availableCopies -= 1;
    await book.save();

    const User = require('../models/User');
    await User.findByIdAndUpdate(userId, { $push: { booksIssued: bookId } });

    res.status(200).json({ success: true, message: 'Book borrowed successfully for 10 days', data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error borrowing book' });
  }
};

// @desc    User returns a book
// @route   POST /api/books/return-book/:id
// @access  Private (User)
exports.returnUserBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user.id;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });

    // Find the issued record
    const issuedRecord = book.issuedTo.find(record => record.userId.toString() === userId && record.status === 'issued');
    if (!issuedRecord) return res.status(400).json({ success: false, message: 'You have not borrowed this book' });

    // Check for fine
    const now = new Date();
    if (now > issuedRecord.dueDate && !issuedRecord.fineCleared) {
      const daysLate = Math.ceil((now - issuedRecord.dueDate) / (1000 * 60 * 60 * 24));
      const fine = daysLate * 10; // $10 per day
      return res.status(400).json({
        success: false,
        message: `You cannot return this book. You have an unpaid fine of $${fine} for being ${daysLate} days late. Contact Admin to clear it.`,
      });
    }

    issuedRecord.status = 'returned';
    issuedRecord.returnedDate = now;
    book.availableCopies += 1;
    await book.save();

    const User = require('../models/User');
    await User.findByIdAndUpdate(userId, { $pull: { booksIssued: bookId } });

    res.status(200).json({ success: true, message: 'Book returned successfully', data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error returning book' });
  }
};
