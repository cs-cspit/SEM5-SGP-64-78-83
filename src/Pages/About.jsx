import React from 'react';
import './About.css';

const About = () => (
  <div className="about-wrapper">

    {/* Hero Section */}
    <section className="about-hero">
      <h2 className="about-title fade-down">About Jay Jalaram Electricals</h2>
      <p className="about-tagline fade-in">
        Energizing Excellence • Lighting the Future
      </p>
    </section>

    {/* Company Story & Mission */}
    <section className="about-section-1 fade-left">
      <div className="about-history">
        <h3>Our Story</h3>
        <p>
          Founded in 2009, <strong>Jay Jalaram Electricals</strong> has grown from a small local enterprise to become one of the region's most trusted names in electrical solutions. Our journey began with a simple vision: to provide exceptional electrical services that prioritize safety, reliability, and innovation.
        </p>
        <p>
          Over the years, we've evolved with the industry, embracing new technologies and sustainable practices while maintaining our core values of integrity and excellence. Our team of certified professionals has successfully completed projects across residential, commercial, and industrial sectors, earning a reputation for precision and professionalism.
        </p>
        <div className="about-timeline">
          <div>
            <span className="timeline-years">15+</span>
            <div className="timeline-label">Years Experience</div>
          </div>
          <div>
            <span className="timeline-years">500+</span>
            <div className="timeline-label">Clients Served</div>
          </div>
          <div>
            <span className="timeline-years">1000+</span>
            <div className="timeline-label">Installations</div>
          </div>
        </div>
      </div>
      <div className="about-mission">
        <h3>Our Mission</h3>
        <p>
          Our mission is to be the leading provider of innovative and sustainable electrical solutions, setting industry standards for quality, safety, and technical excellence. We are committed to:
        </p>
        <p>
          • Delivering cutting-edge electrical solutions that meet tomorrow's challenges<br/>
          • Maintaining the highest safety standards in every project we undertake<br/>
          • Providing exceptional customer service and support<br/>
          • Investing in our team's continuous professional development<br/>
          • Contributing to a more sustainable and energy-efficient future
        </p>
        <p>
          Through our dedication to these principles, we aim to not just meet but exceed our clients' expectations, ensuring their electrical systems are efficient, reliable, and future-ready.
        </p>
      </div>
    </section>

    {/* Team Section */}
    <section className="about-team-section fade-up">
      <h3 className="section-heading">Meet the Team</h3>
      <div className="team-grid">
        <div className="team-card">
          <img src="/Images/Jayesh_Sailor.jpg" alt="Rajesh Parmar, Founder" />
          <div>
            <h4>Jayesh Sailor</h4>
            <span className="team-role">Founder & Master Electrician</span>
          </div>
        </div>
        <div className="team-card">
          <img src="/Images/Krunal.jpg" alt="krunal , Operations Lead" />
          <div>
            <h4>Krunal Sailor</h4>
            <span className="team-role">Site Engineer</span>
          </div>
        </div>
        <div className="team-card">
          {<img src="/Images/Rohit.jpg" alt="Rohit patil, Senior Engineer" />}
          <div>
            <h4>Rohit Patil</h4>
            <span className="team-role">Senior Electrician</span>
          </div>
        </div>
        <div className="team-card">
          {<img src="/Images/kevin.jpg" alt="kevin, Support Manager" /> }
          <div>
            <h4>Kevin Sailor</h4>
            <span className="team-role">Jr. Engineer</span>
          </div>
        </div>
      </div>
    </section>

    {/* Call to Action */}
    <section className="about-cta fade-in">

      <h3>Want to work with industry leaders?</h3>

      <a href="/contact" className="btn big-btn">Let’s Connect</a>
    </section>

  </div>
);

export default About;
