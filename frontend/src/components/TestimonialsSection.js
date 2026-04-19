import React from 'react';
import './TestimonialsSection.css';

/**
 * TestimonialsSection Component - Customer testimonials
 */
const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Book Enthusiast',
      avatar: '👩',
      content: 'BookStore Pro has completely transformed my reading habits. Highly recommend!',
      rating: 5,
    },
    {
      id: 2,
      name: 'Mike Chen',
      role: 'Student',
      avatar: '👨',
      content: 'The search feature and recommendations are incredibly accurate. Best app ever!',
      rating: 5,
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Librarian',
      avatar: '👩',
      content: 'A fantastic platform for book lovers. The interface is intuitive and beautiful.',
      rating: 5,
    },
  ];

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h2>What Our Users Say</h2>
          <p>Join thousands of happy readers</p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="testimonial-card"
              style={{ '--index': index }}
            >
              <div className="testimonial-stars">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="star">⭐</span>
                ))}
              </div>

              <p className="testimonial-content">"{testimonial.content}"</p>

              <div className="testimonial-author">
                <div className="author-avatar">{testimonial.avatar}</div>
                <div className="author-info">
                  <p className="author-name">{testimonial.name}</p>
                  <p className="author-role">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
