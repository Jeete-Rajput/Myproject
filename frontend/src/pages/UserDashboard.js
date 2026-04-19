import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../services/authService';
import { userReturnBook } from '../services/bookService';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await getUserProfile();
      setProfile(data.data);
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleReturn = async (bookId) => {
    try {
      await userReturnBook(bookId);
      alert('Book returned successfully!');
      loadProfile(); // Reload to update lists
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="loading">Loading Dashboard...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h2>My Dashboard</h2>
        <div className="fine-badge">
          Total Fine: <span className={profile.currentFine > 0 ? 'fine-active' : 'fine-clean'}>
            ${profile.currentFine || 0}
          </span>
        </div>
      </div>

      <div className="dashboard-content">
        <h3>My Borrowed Books</h3>
        {profile.booksIssued && profile.booksIssued.length > 0 ? (
          <div className="borrowed-books-grid">
            {profile.booksIssued.map(book => {
              // Find issue record
              const issueRecord = book.issuedTo?.find(
                r => r.userId === profile._id || r.userId?._id === profile._id || r.userId === profile.id
              ) || null;
              
              const isOverdue = issueRecord && new Date() > new Date(issueRecord.dueDate);
              const daysLate = isOverdue ? Math.ceil((new Date() - new Date(issueRecord.dueDate)) / (1000 * 60 * 60 * 24)) : 0;
              const hasFine = isOverdue && !issueRecord.fineCleared;

              return (
                <div key={book._id} className="borrowed-card">
                  <div className="b-card-content">
                    <h4>{book.title}</h4>
                    <p className="b-author">by {book.author}</p>
                    {issueRecord && (
                      <p className="dueDate">
                        Due: <strong>{new Date(issueRecord.dueDate).toLocaleDateString()}</strong>
                      </p>
                    )}
                    {hasFine && (
                      <div className="fine-warning">
                        ⚠️ Overdue by {daysLate} days. Contact Admin to clear fine.
                      </div>
                    )}
                  </div>
                  <button 
                    className="return-btn"
                    onClick={() => handleReturn(book._id)}
                    disabled={hasFine}
                    title={hasFine ? "Cannot return while fine is active" : "Return this book"}
                  >
                    Return Book
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <p>You haven't borrowed any books yet. Explore our library to find your next great read!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
