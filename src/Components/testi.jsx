import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import "./testi.css";

export default function TestimonialCarousel() {
  const testimonials = [
    {
      id: 1,
      text: "Their team handled our HT line maintenance with full safety and precision. We never faced downtime after their service.",
      name: "Rachel Green",
      role: "Technical Manager",
      company: "Power Grid Solutions",
      rating: 5,
      img: "/Images/cinepolis.png",
    },
    {
      id: 2,
      text: "We are tension-free with their AMC service. Regular checkups keep our system safe and efficient",
      name: "Arjun Patel", 
      role: "Operations Director",
      company: "Industrial Solutions Ltd",
      rating: 5,
      img: "/Images/enviro.jpeg",
    },
    {
      id: 3,
      text: "They carried out transformer servicing with complete testing and gave us reliable performance assurance.",
      name: "Priya Sharma",
      role: "Plant Manager", 
      company: "Manufacturing Corp",
      rating: 5,
      img: "/Images/gmdc.jpg",
    },
    {
      id: 4,
      text: "Their grip on HT line work is unmatched. From shutdowns to live-line jobs, everything is managed safely.",
      name: "Rajesh Modi",
      role: "Electrical Engineer",
      company: "Infrastructure Pvt Ltd",
      rating: 5,
      img: "/Images/havells.jpg",
    },
    {
      id: 5,
      text: "During fault, their team responded at midnight. Power was restored faster than we expected.",
      name: "Neha Desai",
      role: "Facility Head",
      company: "Tech Solutions Inc",
      rating: 5,
      img: "/Images/L&T.jpeg",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance testimonials
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPaused, testimonials.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section 
      className="testimonial-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="testimonial-header">
        <h3 className="enhanced-section-title fade-in">What Our Clients Say</h3>
        <p className="testimonial-subtitle">
          Trusted by leading companies across Gujarat for reliable electrical solutions
        </p>
      </div>
      
      <div className="testimonial-carousel">
        <button 
          className="arrow-btn left" 
          onClick={prevSlide}
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="testimonial-track">
          {testimonials.map((testimonial, index) => {
            let position = "hidden";

            if (index === currentIndex) {
              position = "active";
            } else if (
              index === (currentIndex - 1 + testimonials.length) % testimonials.length
            ) {
              position = "prev";
            } else if (
              index === (currentIndex - 2 + testimonials.length) % testimonials.length
            ) {
              position = "prev2";
            } else if (index === (currentIndex + 1) % testimonials.length) {
              position = "next";
            } else if (index === (currentIndex + 2) % testimonials.length) {
              position = "next2";
            }

            return (
              <div 
                key={testimonial.id} 
                className={`testimonial-card ${position}`}
                onClick={() => goToSlide(index)}
              >
                <div className="quote-icon">
                  <Quote size={20} />
                </div>
                
                <div className="testimonial-content">
                  <p className="testimonial-text">"{testimonial.text}"</p>
                  
                  <div className="rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#ff6b00" color="#ff6b00" />
                    ))}
                  </div>
                </div>

                <div className="testimonial-author">
                  <div className="author-avatar">
                    <img src={testimonial.img} alt={`${testimonial.company} logo`} />
                  </div>
                  <div className="author-info">
                    <h4 className="author-name">{testimonial.name}</h4>
                    <p className="author-role">{testimonial.role}</p>
                    <p className="author-company">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button 
          className="arrow-btn right" 
          onClick={nextSlide}
          aria-label="Next testimonial"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      
      {/* Pagination dots */}
      <div className="testimonial-pagination">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`pagination-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Progress indicator */}
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ 
            width: `${((currentIndex + 1) / testimonials.length) * 100}%` 
          }}
        />
      </div>
    </section>
  );
}
