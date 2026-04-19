import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { addBook } from '../services/bookManagementService';
import { fetchBooks } from '../services/bookService';
import './AdminDashboard.css';

const CATEGORIES = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Technology', 'Biography', 'Other'];

const emptyBookForm = {
  title: '',
  author: '',
  category: '',
  description: '',
  isbn: '',
  publishedYear: '',
  totalCopies: 1,
  coverImage: '',
};

/**
 * AdminDashboard Component - Admin management interface
 */
const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Books state
  const [books, setBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [booksError, setBooksError] = useState('');

  // Users state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');

  // Add book form state
  const [bookForm, setBookForm] = useState(emptyBookForm);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Load books from backend
  const loadBooks = async () => {
    setBooksLoading(true);
    setBooksError('');
    try {
      const data = await fetchBooks();
      setBooks(data);
    } catch (err) {
      setBooksError(err.message || 'Failed to load books');
    } finally {
      setBooksLoading(false);
    }
  };

  // Load users from backend
  const loadUsers = async () => {
    setUsersLoading(true);
    setUsersError('');
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/users`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to load users');
      setUsers(data.data || []);
    } catch (err) {
      setUsersError(err.message || 'Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
    loadUsers();
  }, []);

  const handleClearFine = async (userId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/users/clear-fine/${userId}`,
        { 
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` } 
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to clear fine');
      
      // Reload users to fetch updated fines
      loadUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleBookFormChange = (e) => {
    const { name, value } = e.target;
    setBookForm((prev) => ({ ...prev, [name]: value }));
    setFormError('');
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!bookForm.title.trim() || !bookForm.author.trim() || !bookForm.category || !bookForm.totalCopies) {
      setFormError('Title, Author, Category, and Total Copies are required.');
      return;
    }

    setFormLoading(true);
    try {
      const payload = {
        title: bookForm.title.trim(),
        author: bookForm.author.trim(),
        category: bookForm.category,
        description: bookForm.description.trim() || undefined,
        isbn: bookForm.isbn.trim() || undefined,
        publishedYear: bookForm.publishedYear ? Number(bookForm.publishedYear) : undefined,
        totalCopies: Number(bookForm.totalCopies),
        coverImage: bookForm.coverImage.trim() || undefined,
      };
      await addBook(payload);
      setFormSuccess('✅ Book added successfully!');
      setBookForm(emptyBookForm);
      setShowAddForm(false);
      loadBooks(); // refresh list
    } catch (err) {
      setFormError(err.message || 'Failed to add book');
    } finally {
      setFormLoading(false);
    }
  };

  const stats = [
    { icon: '📚', label: 'Total Books', value: books.length },
    { icon: '📖', label: 'Available Books', value: books.reduce((sum, b) => sum + (b.availableCopies || 0), 0) },
    { icon: '👥', label: 'Total Users', value: users.length },
    { icon: '🔖', label: 'Books Issued', value: books.reduce((sum, b) => sum + (b.issuedTo ? b.issuedTo.filter(r => r.status === 'issued').length : 0), 0) },
  ];

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-title">
          <h1>🛡️ Admin Dashboard</h1>
          <p>Manage and monitor your library</p>
        </div>
        <div className="admin-user-info">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <p>{user?.name || user?.email}</p>
            <p>Administrator</p>
          </div>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="admin-tabs">
        {['overview', 'books', 'users'].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div className="admin-content">

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="tab-content">
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-info">
                    <p className="stat-label">{stat.label}</p>
                    <div className="stat-details">
                      <span className="stat-value">{stat.value}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="activities-section">
              <h2>Recent Books</h2>
              {booksLoading ? (
                <p>Loading books...</p>
              ) : booksError ? (
                <p className="error-msg">{booksError}</p>
              ) : books.length === 0 ? (
                <p>No books found. Add your first book in the Books tab.</p>
              ) : (
                <div className="activities-list">
                  {books.slice(0, 5).map((book) => (
                    <div key={book._id} className="activity-item">
                      <div className="activity-icon">📚</div>
                      <div className="activity-details">
                        <p className="activity-action">{book.title} by {book.author}</p>
                        <p className="activity-meta">
                          {book.category} • Available: {book.availableCopies}/{book.totalCopies}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* BOOKS TAB */}
        {activeTab === 'books' && (
          <div className="tab-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ color: 'var(--text-primary)', margin: 0 }}>📚 Book Collection</h2>
              <button className="add-btn" onClick={() => { setShowAddForm(!showAddForm); setFormError(''); setFormSuccess(''); }}>
                {showAddForm ? '✕ Cancel' : '+ Add New Book'}
              </button>
            </div>

            {/* Success message outside form */}
            {formSuccess && !showAddForm && (
              <div className="success-msg" style={{ marginBottom: '1rem' }}>{formSuccess}</div>
            )}

            {/* Add Book Form */}
            {showAddForm && (
              <form className="add-book-form" onSubmit={handleAddBook}>
                <h3>Add New Book</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label>Title <span className="required">*</span></label>
                    <input
                      type="text"
                      name="title"
                      value={bookForm.title}
                      onChange={handleBookFormChange}
                      placeholder="Book title"
                      maxLength={100}
                      disabled={formLoading}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Author <span className="required">*</span></label>
                    <input
                      type="text"
                      name="author"
                      value={bookForm.author}
                      onChange={handleBookFormChange}
                      placeholder="Author name"
                      disabled={formLoading}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category <span className="required">*</span></label>
                    <select
                      name="category"
                      value={bookForm.category}
                      onChange={handleBookFormChange}
                      disabled={formLoading}
                      required
                    >
                      <option value="">Select category</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Total Copies <span className="required">*</span></label>
                    <input
                      type="number"
                      name="totalCopies"
                      value={bookForm.totalCopies}
                      onChange={handleBookFormChange}
                      min={1}
                      disabled={formLoading}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>ISBN</label>
                    <input
                      type="text"
                      name="isbn"
                      value={bookForm.isbn}
                      onChange={handleBookFormChange}
                      placeholder="e.g. 978-3-16-148410-0"
                      disabled={formLoading}
                    />
                  </div>
                  <div className="form-group">
                    <label>Published Year</label>
                    <input
                      type="number"
                      name="publishedYear"
                      value={bookForm.publishedYear}
                      onChange={handleBookFormChange}
                      placeholder="e.g. 2020"
                      min={1000}
                      max={new Date().getFullYear()}
                      disabled={formLoading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={bookForm.description}
                    onChange={handleBookFormChange}
                    placeholder="Short description of the book (max 500 chars)"
                    maxLength={500}
                    rows={3}
                    disabled={formLoading}
                  />
                </div>

                <div className="form-group">
                  <label>Cover Image URL</label>
                  <input
                    type="url"
                    name="coverImage"
                    value={bookForm.coverImage}
                    onChange={handleBookFormChange}
                    placeholder="https://example.com/cover.jpg"
                    disabled={formLoading}
                  />
                </div>

                {formError && <div className="error-msg">{formError}</div>}
                {formSuccess && <div className="success-msg">{formSuccess}</div>}

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" className="add-btn" disabled={formLoading}>
                    {formLoading ? 'Adding...' : '✅ Add Book'}
                  </button>
                  <button type="button" className="logout-btn" onClick={() => { setShowAddForm(false); setFormError(''); }} disabled={formLoading}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Books Table */}
            {booksLoading ? (
              <p>Loading books...</p>
            ) : booksError ? (
              <p className="error-msg">{booksError}</p>
            ) : books.length === 0 ? (
              <div className="empty-state">
                <p>📚 No books yet. Add your first book above!</p>
              </div>
            ) : (
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Category</th>
                      <th>ISBN</th>
                      <th>Year</th>
                      <th>Total</th>
                      <th>Available</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book) => (
                      <tr key={book._id}>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td><span className="badge">{book.category}</span></td>
                        <td>{book.isbn || '—'}</td>
                        <td>{book.publishedYear || '—'}</td>
                        <td>{book.totalCopies}</td>
                        <td>
                          <span className={book.availableCopies > 0 ? 'badge-green' : 'badge-red'}>
                            {book.availableCopies}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="tab-content">
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>👥 Registered Users</h2>
            {usersLoading ? (
              <p>Loading users...</p>
            ) : usersError ? (
              <p className="error-msg">{usersError}</p>
            ) : users.length === 0 ? (
              <div className="empty-state">
                <p>👥 No users registered yet.</p>
              </div>
            ) : (
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Owed Fines</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td><span className={u.role === 'admin' ? 'badge-blue' : 'badge'}>{u.role}</span></td>
                        <td>
                          {u.currentFine > 0 ? (
                            <span className="badge-red" style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                              ${u.currentFine}
                            </span>
                          ) : (
                            <span style={{ color: 'gray' }}>$0</span>
                          )}
                        </td>
                        <td>
                          <span className={u.isActive ? 'badge-green' : 'badge-red'}>
                            {u.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td>
                          {u.currentFine > 0 && (
                            <button 
                              onClick={() => handleClearFine(u._id)}
                              style={{ padding: '6px 12px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                            >
                              Clear Fine
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
