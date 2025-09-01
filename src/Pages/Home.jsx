import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import TestimonialCarousel from '../Components/testi';
const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const clientsTrackRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      text: "Precision, safety, and rapid response. Jay Jalaram Electricals raised our standards for reliability.",
      name: "Environ Control PVT LTD",
      avatar: "https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?auto=format&fit=facearea&w=400&q=80&facepad=2"
    },
    {
      text: "We loved their professionalism. From wiring to maintenance, everything is flawless and high-tech.",
      name: "N. Patel, Business Owner",
      avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&w=400&q=80"
    },
    {
      text: "Outstanding service quality and technical expertise. They transformed our entire electrical infrastructure.",
      name: "Gujarat Industrial Corp",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&w=400&q=80&facepad=2"
    }
  ];

  const stats = [
    { number: "500+", label: "Projects Completed" },
    { number: "15+", label: "Years Experience" },
    { number: "24/7", label: "Support Available" },
    { number: "100%", label: "Customer Satisfaction" }
  ];

  // Client logos data
  const clientLogos = [
    { src: "/Images/havells.jpg", alt: "Havells" },
    { src: "/Images/gmdc.jpg", alt: "gmdc" },
    { src: "/Images/cinepolis.png", alt: "Siemens" },
    { src: "/Images/pvr.jpeg", alt: "Schneider Electric" },
    { src: "/Images/L&T.jpeg", alt: "L&T" },
    { src: "/Images/siemns.jpeg", alt: "siemns" },
    { src: "/Images/tata.png", alt: "tata" },
    { src: "/Images/Pidilite.png", alt: "pidilite" },
    { src: "/Images/inox.jpeg", alt: "inox" },
    { src: "/Images/VR.png", alt: "VR" },
    { src: "/Images/rrtm.jpg", alt: "rrtm" },
     { src: "/Images/enviro.jpeg", alt: "enviro" },
     { src: "/Images/ppl.png", alt: "people" },
     { src: "/Images/metro.png", alt: "metro" },
      { src: "/Images/redfm.png", alt: "redfm" },
      { src: "/Images/iocl.png", alt: "iocl" },
      { src: "/Images/mafat.png", alt: "mafat" },
      { src: "/Images/jkumar.jpg", alt: "jkumar" },
       { src: "/Images/shalby.avif", alt: "avif" },
     
     
  ];

  // Navigation functions for client carousel
  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % clientLogos.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + clientLogos.length) % clientLogos.length);
  };

  // Auto-slide for clients
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // Change slide every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-wrapper">
      {/* Hero Section with Electrical Background */}
      <section className="hero-section apple-hero">
        <img
          src="/Images/home1.jpg"
          alt="Modern electrical cables cityscape"
          className="hero-bg-img"
        />
        <div className="hero-overlay">
          <h2 className="fade-down">Jay Jalaram Electricals</h2>
          <p className="hero-tagline fade-in">We provide Quality Service</p>
          <div className="hero-buttons slide-up">
            <a href="/contact" className="btn big-btn">Get a Quote</a>
            <a href="#services" className="btn-secondary big-btn">Our Services</a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <h3 className="stat-number">{stat.number}</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services with Electrical-Themed Cards */}
      <section className="pro-section" id="services">
        <h3 className="section-title fade-in">Our Signature Services</h3>
        <div className="service-showcase-grid">
          <Link to="/services/wiring" className="pro-card fade-left">
            <img
              src="/Images/IMG_1.jpg"
              alt="Electrician working on high-voltage wires"
            />
            <div>
              <h4>Wiring Excellence</h4>
              <p>Dependable, modern wiring—precision installed with digital diagnostics for peak safety.</p>
            </div>
          </Link>
          <Link to="/services/maintenance" className="pro-card fade-up">
            <img
              src="/Images/IMG_2.jpg"
              alt="Technician testing electrical panel"
            />
            <div>
              <h4>Proactive Maintenance</h4>
              <p>Preventive checks, smart analysis, and expert fixes to keep your power uninterrupted.</p>
            </div>
          </Link>
          <Link to="/services/havells" className="pro-card fade-down">
            <img
              src="/Images/IMG_3.jpg"
              alt="Modern electrical installation"
            />
            <div>
              <h4>Havells Service Center</h4>
              <p>Complete solutions for homes, offices, and industry—energy efficient and future-ready.</p>
            </div>
          </Link>
          <Link to="/services/industrial" className="pro-card fade-right">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
              alt="Industrial electrical setup"
            />
            <div>
              <h4>Industrial Setup</h4>
              <p>Design and commissioning of scalable, robust systems for modern industry demands.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Enhanced Clients Section with Navigation */}
      <section className="clients-section">
        <h3 className="section-title fade-in">Our Clients</h3>
        <div className="clients-carousel-container">
          <button className="carousel-nav carousel-nav-left" onClick={prevSlide}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          
          <div className="clients-carousel-wrapper">
            <div 
              className="clients-carousel-track"
              ref={clientsTrackRef}
              style={{ transform: `translateX(-${currentSlide * 250}px)` }}
            >
              {/* Render logos multiple times for infinite scroll effect */}
              {[...clientLogos, ...clientLogos, ...clientLogos].map((logo, index) => (
                <div key={index} className="client-logo-carousel">
                  <img src={logo.src} alt={logo.alt} />
                </div>
              ))}
            </div>
          </div>
          
          <button className="carousel-nav carousel-nav-right" onClick={nextSlide}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
            </svg>
          </button>
        </div>
        
        {/* Carousel Indicators */}
        <div className="carousel-indicators">
          {clientLogos.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

     
      {/* Testimonial Section with Professional Imagery */}
      {/* <section className="testimonial-apple">
        <h3 className="section-title fade-in">Trusted by Industry Leaders</h3>
        <div className="testimonial-carousel fade-up">
          <div className="testimonial-panel active">
            <img
              src={testimonials[currentTestimonial].avatar}
              alt="Client testimonial"
              className="testimonial-avatar"
            />
            <div>
              <p className="testimonial-text">
                "{testimonials[currentTestimonial].text}"
              </p>
              <div className="testimonial-name">- {testimonials[currentTestimonial].name}</div>
            </div>
          </div>
          <div className="testimonial-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentTestimonial ? 'active' : ''}`}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </section> */}
      <div className="carousel-container">
  <TestimonialCarousel />
</div>

    
      

      {/* Why Choose Us Section */}
      <section className="why-choose-section">
  <h3 className="section-title fade-in">Why Choose Jay Jalaram Electricals?</h3>
  <div className="features-grid">
    <div className="feature-item fade-left">
      <div className="feature-icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"/>
        </svg>
      </div>
      <h4>Licensed & Insured</h4>
      <p>Fully licensed professionals with comprehensive insurance coverage for your peace of mind.</p>
    </div>
    <div className="feature-item fade-up">
      <div className="feature-icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L1 21H23L12 2Z"/>
        </svg>
      </div>
      <h4>24/7 Emergency Service</h4>
      <p>Round-the-clock emergency electrical services to keep your operations running smoothly.</p>
    </div>
    <div className="feature-item fade-down">
      <div className="feature-icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"/>
        </svg>
      </div>
      <h4>Expert Technicians</h4>
      <p>Highly trained and certified electricians with years of industry experience.</p>
    </div>
    <div className="feature-item fade-right">
      <div className="feature-icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 12L11 14L15 10M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z"/>
        </svg>
      </div>
      <h4>Quality Guarantee</h4>
      <p>100% satisfaction guarantee with warranty on all our electrical work and installations.</p>
    </div>
  </div>
</section>


      {/* Contact Call-to-Action */}
      <section className="contact-teaser fade-in">
        <h3 className="section-title">Ready to Connect?</h3>
        <p className="contact-description">
          Let's build the future of electrical safety and efficiency together. Reach out to us for expert consultation and solutions.
        </p>
        <Link to="/contact" className="btn">Get in Touch</Link>
      </section>

      {/* Scroll To Top Button */}
      <button 
        className={`scroll-to-top ${isVisible ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        ↑
      </button>
    </div>
  );
};

export default Home;
