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
        <h3 className="section-heading">Our Story</h3>
        <p>
          Since our founding in 2009, <strong>Jay Jalaram Electricals</strong> has empowered businesses and homes
          across the region with professional, reliable, and safe electrical solutions. Our passion for
          cutting-edge technology and customer satisfaction drives every project, big or small.
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
      <div className="about-mission fade-in">
        <h3 className="section-heading">Our Mission</h3>
        <p>
          To deliver innovative, future-ready electrical solutions with uncompromising quality, safety,
          and technical excellence—always aiming to exceed client expectations.
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
          {/* <img src="https://randomuser.me/api/portraits/men/50.jpg" alt="Viral Patel, Operations Lead" /> */}
          <div>
            <h4>Kurnal Sailor</h4>
            <span className="team-role">Site Engineer</span>
          </div>
        </div>
        <div className="team-card">
          {/* <img src="https://randomuser.me/api/portraits/women/47.jpg" alt="Megha Shah, Senior Engineer" /> */}
          <div>
            <h4>Rohit Patil</h4>
            <span className="team-role">Senior Electrician</span>
          </div>
        </div>
        <div className="team-card">
          {/* <img src="https://randomuser.me/api/portraits/men/76.jpg" alt="Jatin Mehta, Support Manager" /> */}
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
