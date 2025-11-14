import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import TestimonialCarousel from '../Components/testi';
const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const clientsTrackRef = useRef(null);
  const videoRef = useRef(null);

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

  // Set video playback rate to smooth slow motion
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;

      const setRate = () => {
        video.playbackRate = 0.5; // smoother slow motion
      };

      video.addEventListener("loadeddata", setRate);
      video.addEventListener("canplay", setRate);

      if (video.readyState >= 2) {
        setRate();
      }

      return () => {
        video.removeEventListener("loadeddata", setRate);
        video.removeEventListener("canplay", setRate);
      };
    }
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

  // Touch event handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;

    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    // Reset touch positions
    setTouchStartX(null);
    setTouchEndX(null);
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
        <video
          ref={videoRef}
          src="/Video/Home_Page_Video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="hero-bg-video"
        />
        <div className="hero-overlay">
          <div className="hero-title-container fade-down">
            <div className="cube-wrapper">
              <div className="cube">
                <div className="cube-face cube-front">Jay Jalaram Electricals</div>
                <div className="cube-face cube-top">જય જલારામ ઇલેક્ટ્રિકલસ</div>
                <div className="cube-face cube-back">Jay Jalaram Electricals</div>
                <div className="cube-face cube-bottom">જય જલારામ ઇલેક્ટ્રિકલસ</div>
              </div>
            </div>
          </div>
          <p className="hero-tagline fade-in">We provide Quality Service</p>
          <div className="hero-buttons slide-up">
            <Link to="/contact" className="btn big-btn">Get a Quote</Link>
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
        <h3 className="enhanced-section-title fade-in">Our Signature Services</h3>
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
        <h3 className="enhanced-section-title fade-in">Our Clients</h3>
        <div className="clients-carousel-container">
          <button className="carousel-nav carousel-nav-left" onClick={prevSlide}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>

          <div className="clients-carousel-wrapper">
            <div
              className="clients-carousel-track"
              ref={clientsTrackRef}
              style={{ transform: `translateX(-${currentSlide * 250}px)` }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
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
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
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




      {/* Why Choose Us Section - Redesigned */}
      <section className="why-choose-section-new">
        <div className="why-choose-container">
          <div className="section-header-new">
            <span className="section-badge">OUR ADVANTAGES</span>
            <h3 className="enhanced-section-title-new fade-in">
              Why Choose Jay Jalaram Electricals?
            </h3>
            <p className="section-subtitle">
              Experience excellence in electrical services with our industry-leading solutions and dedicated team
            </p>
          </div>

          <div className="features-showcase">
            {/* Feature Card 1 */}
            <div className="feature-card-simple feature-card-1 fade-up">
              <div className="feature-icon-new">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="feature-number">01</div>
              <h4>Licensed & Insured</h4>
              <p>Fully licensed professionals with comprehensive insurance coverage for your peace of mind and protection.</p>
              <ul className="feature-benefits-simple">
                <li>✓ Certified Electricians</li>
                <li>✓ Full Insurance Coverage</li>
                <li>✓ Safety Guaranteed</li>
              </ul>
            </div>

            {/* Feature Card 2 */}
            <div className="feature-card-simple feature-card-2 fade-up">
              <div className="feature-icon-new">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="feature-number">02</div>
              <h4>24/7 Emergency Service</h4>
              <p>Round-the-clock support available for all your electrical emergencies whenever you need assistance.</p>
              <ul className="feature-benefits-simple">
                <li>✓ Instant Response Team</li>
                <li>✓ Available 24/7/365</li>
                <li>✓ Quick Solutions</li>
              </ul>
            </div>

            {/* Feature Card 3 */}
            <div className="feature-card-simple feature-card-3 fade-up">
              <div className="feature-icon-new">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="feature-number">03</div>
              <h4>Expert Technicians</h4>
              <p>Highly trained and certified professionals with years of industry experience and technical expertise.</p>
              <ul className="feature-benefits-simple">
                <li>✓ 15+ Years Experience</li>
                <li>✓ Trained Experts</li>
                <li>✓ Latest Techniques</li>
              </ul>
            </div>

            {/* Feature Card 4 */}
            <div className="feature-card-simple feature-card-4 fade-up">
              <div className="feature-icon-new">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="feature-number">04</div>
              <h4>Quality Guarantee</h4>
              <p>100% satisfaction guarantee with comprehensive warranty coverage on all our electrical work and installations.</p>
              <ul className="feature-benefits-simple">
                <li>✓ Premium Materials</li>
                <li>✓ Extended Warranty</li>
                <li>✓ 100% Satisfaction</li>
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* Contact Call-to-Action */}
      <section className="contact-teaser fade-in">
        <h3 className="enhanced-section-title">Ready to Connect?</h3>
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
        <i className="fas fa-arrow-up"></i>
      </button>
    </div>
  );
};

export default Home;
