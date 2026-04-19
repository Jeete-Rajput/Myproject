const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a book title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    author: {
      type: String,
      required: [true, 'Please add an author name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['Fiction', 'Non-Fiction', 'Science', 'History', 'Technology', 'Biography', 'Other'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    isbn: {
      type: String,
      unique: true,
      sparse: true,
    },
    publishedYear: {
      type: Number,
    },
    totalCopies: {
      type: Number,
      required: [true, 'Please add total number of copies'],
      default: 1,
    },
    availableCopies: {
      type: Number,
      required: true,
      default: function () {
        return this.totalCopies;
      },
    },
    issuedTo: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        issuedDate: {
          type: Date,
          default: Date.now,
        },
        dueDate: {
          type: Date,
        },
        returnedDate: {
          type: Date,
        },
        status: {
          type: String,
          enum: ['issued', 'returned'],
          default: 'issued',
        },
        fineCleared: {
          type: Boolean,
          default: false,
        },
      },
    ],
    coverImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Book', bookSchema);
