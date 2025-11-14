import React from 'react';
import './Company.css';

const Clientele = () => {
  const clients = [
    {
      id: 1,
      name: "Shalby Hospitals",
      industry: "Healthcare",
      icon: "fas fa-hospital",
      description: "Leading multi-specialty hospital chain"
    },
    {
      id: 2,
      name: "Reliance Industries",
      industry: "Manufacturing",
      icon: "fas fa-industry",
      description: "India's largest private sector company"
    },
    {
      id: 3,
      name: "TCS Ltd",
      industry: "IT Services",
      icon: "fas fa-laptop-code",
      description: "Global technology consulting firm"
    },
    {
      id: 4,
      name: "Adani Group",
      industry: "Infrastructure",
      icon: "fas fa-city",
      description: "Multinational conglomerate"
    },
    {
      id: 5,
      name: "Torrent Power",
      industry: "Energy",
      icon: "fas fa-bolt",
      description: "Integrated power utility company"
    },
    {
      id: 6,
      name: "Zydus Cadila",
      industry: "Pharmaceuticals",
      icon: "fas fa-pills",
      description: "Global pharmaceutical company"
    },
    {
      id: 7,
      name: "Sun Pharma",
      industry: "Pharmaceuticals",
      icon: "fas fa-prescription-bottle",
      description: "World's largest generic drug manufacturer"
    },
    {
      id: 8,
      name: "Essar Group",
      industry: "Steel & Energy",
      icon: "fas fa-cog",
      description: "Diversified business conglomerate"
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Rajesh Kumar",
      position: "Facility Manager, Shalby Hospitals",
      text: "Jay Jalaram Electricals has been instrumental in maintaining our critical power systems. Their prompt service and expertise are unmatched.",
      rating: 5
    },
    {
      id: 2,
      name: "Priya Sharma",
      position: "Project Director, Reliance Industries",
      text: "We've worked with them on multiple large-scale projects. Their professionalism and technical knowledge consistently exceed expectations.",
      rating: 5
    },
    {
      id: 3,
      name: "Amit Patel",
      position: "Operations Head, TCS Ltd",
      text: "Reliable, efficient, and always delivers on time. Our go-to partner for all electrical requirements.",
      rating: 5
    }
  ];

  return (
    <div className="company-wrapper">
      {/* Hero Section */}
      <section className="company-hero">
        <h2 className="company-title">Our Clientele</h2>
        <p className="company-tagline">
          Trusted by Industry Leaders • Building Lasting Partnerships
        </p>
      </section>

      {/* Introduction */}
      <section className="company-clientele-intro">
        <p className="company-intro-text">
          We are proud to serve a diverse portfolio of clients across various industries. 
          Our commitment to excellence and customer satisfaction has earned us the trust 
          of leading organizations and businesses throughout the region.
        </p>
      </section>

      {/* Clients Grid */}
      <section className="company-clients-section">
        <h3 className="company-section-heading">Our Valued Clients</h3>
        <div className="company-clients-grid">
          {clients.map((client, index) => (
            <div 
              key={client.id} 
              className="company-client-card"
            >
              <div className="company-client-logo"><i className={client.icon}></i></div>
              <h4 className="company-client-name">{client.name}</h4>
              <span className="company-client-industry">{client.industry}</span>
              <p className="company-client-description">{client.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Industries Served */}
      <section className="company-industries-section">
        <h3 className="company-section-heading">Industries We Serve</h3>
        <div className="company-industries-grid">
          <div className="company-industry-item">
            <div className="company-industry-icon"><i className="fas fa-hospital"></i></div>
            <h4>Healthcare</h4>
          </div>
          <div className="company-industry-item">
            <div className="company-industry-icon"><i className="fas fa-industry"></i></div>
            <h4>Manufacturing</h4>
          </div>
          <div className="company-industry-item">
            <div className="company-industry-icon"><i className="fas fa-briefcase"></i></div>
            <h4>Corporate</h4>
          </div>
          <div className="company-industry-item">
            <div className="company-industry-icon"><i className="fas fa-hotel"></i></div>
            <h4>Hospitality</h4>
          </div>
          <div className="company-industry-item">
            <div className="company-industry-icon"><i className="fas fa-graduation-cap"></i></div>
            <h4>Education</h4>
          </div>
          <div className="company-industry-item">
            <div className="company-industry-icon"><i className="fas fa-home"></i></div>
            <h4>Residential</h4>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="company-testimonials-section">
        <h3 className="company-section-heading">What Our Clients Say</h3>
        <div className="company-testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className="company-testimonial-card"
            >
              <div className="company-testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <i key={i} className="fas fa-star"></i>
                ))}
              </div>
              <p className="company-testimonial-text">"{testimonial.text}"</p>
              <div className="company-testimonial-author">
                <strong>{testimonial.name}</strong>
                <span>{testimonial.position}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="company-cta-section">
        <h3>Join Our Growing Family of Satisfied Clients</h3>
        <p>Experience the difference of working with a trusted electrical partner.</p>
        <a href="/contact" className="company-cta-button">
          Partner With Us <i className="fas fa-arrow-right"></i>
        </a>
      </section>
    </div>
  );
};

export default Clientele;
