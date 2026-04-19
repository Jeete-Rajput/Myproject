import React, { useState } from 'react';
import './NewsletterSection.css';

/**
 * NewsletterSection Component - Email subscription
 */
const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-container">
        <div className="newsletter-content">
          <h2 className="newsletter-title">Stay Updated</h2>
          <p className="newsletter-subtitle">
            Get weekly recommendations of bestselling books and exclusive offers delivered to your inbox.
          </p>

          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <div className="newsletter-input-group">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="newsletter-input"
                required
              />
              <button
                type="submit"
                className="newsletter-btn"
                disabled={subscribed}
              >
                {subscribed ? '✓ Subscribed!' : 'Subscribe'}
              </button>
            </div>
            {subscribed && (
              <div className="success-message">
                Thanks for subscribing! Check your email for confirmation.
              </div>
            )}
          </form>

          <p className="newsletter-note">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>

        <div className="newsletter-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="newsletter-icon">📬</div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
