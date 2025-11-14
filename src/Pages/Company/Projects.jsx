import React from 'react';
import './Company.css';

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: "Industrial Power Distribution System",
      category: "Industrial",
      client: "Manufacturing Corp Ltd.",
      description: "Complete electrical infrastructure setup for a 50,000 sq.ft manufacturing facility including power distribution, lighting, and backup systems.",
      icon: "fas fa-industry",
      year: "2024",
      status: "Completed"
    },
    {
      id: 2,
      title: "Commercial Complex Wiring",
      category: "Commercial",
      client: "StarMall Developers",
      description: "Full electrical installation for a 5-floor commercial complex with advanced automation and energy management systems.",
      icon: "fas fa-building",
      year: "2024",
      status: "Completed"
    },
    {
      id: 3,
      title: "Residential Township Electrification",
      category: "Residential",
      client: "Green Valley Estates",
      description: "Electrical network design and implementation for a 200+ unit residential township with smart home integration.",
      icon: "fas fa-home",
      year: "2023",
      status: "Completed"
    },
    {
      id: 4,
      title: "Hospital Emergency Power Systems",
      category: "Healthcare",
      client: "City General Hospital",
      description: "Critical power backup systems, UPS installation, and emergency lighting for a 300-bed hospital facility.",
      icon: "fas fa-hospital",
      year: "2023",
      status: "Completed"
    },
    {
      id: 5,
      title: "Hotel & Resort Electrical Setup",
      category: "Hospitality",
      client: "Royal Paradise Resort",
      description: "Complete electrical infrastructure for a luxury resort including outdoor lighting, swimming pool systems, and entertainment facilities.",
      icon: "fas fa-hotel",
      year: "2023",
      status: "Completed"
    },
    {
      id: 6,
      title: "Educational Campus Modernization",
      category: "Education",
      client: "Tech University",
      description: "Electrical system upgrade for university campus including smart classrooms, laboratories, and renewable energy integration.",
      icon: "fas fa-graduation-cap",
      year: "2024",
      status: "Ongoing"
    }
  ];

  return (
    <div className="company-wrapper">
      {/* Hero Section */}
      <section className="company-hero">
        <h2 className="company-title">Our Projects</h2>
        <p className="company-tagline">
          Excellence in Execution • Innovation in Every Project
        </p>
      </section>

      {/* Stats Section */}
      <section className="company-projects-stats">
        <div className="company-stat-card">
          <div className="company-stat-icon"><i className="fas fa-chart-line"></i></div>
          <div className="company-stat-number">500+</div>
          <div className="company-stat-label">Projects Completed</div>
        </div>
        <div className="company-stat-card">
          <div className="company-stat-icon"><i className="fas fa-bolt"></i></div>
          <div className="company-stat-number">15+</div>
          <div className="company-stat-label">Years Experience</div>
        </div>
        <div className="company-stat-card">
          <div className="company-stat-icon"><i className="fas fa-smile"></i></div>
          <div className="company-stat-number">98%</div>
          <div className="company-stat-label">Client Satisfaction</div>
        </div>
        <div className="company-stat-card">
          <div className="company-stat-icon"><i className="fas fa-trophy"></i></div>
          <div className="company-stat-number">50+</div>
          <div className="company-stat-label">Industry Awards</div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="company-projects-section">
        <h3 className="company-section-heading">Featured Projects</h3>
        <div className="company-projects-grid">
          {projects.map((project, index) => (
            <div 
              key={project.id} 
              className="company-project-card"
            >
              <div className="company-project-image"><i className={project.icon}></i></div>
              <div className="company-project-content">
                <div className="company-project-header">
                  <span className="company-project-category">{project.category}</span>
                  <span className={`company-project-status company-status-${project.status.toLowerCase()}`}>
                    {project.status}
                  </span>
                </div>
                <h4 className="company-project-title">{project.title}</h4>
                <p className="company-project-client">
                  <i className="fas fa-building"></i> {project.client}
                </p>
                <p className="company-project-description">{project.description}</p>
                <div className="company-project-footer">
                  <span className="company-project-year">
                    <i className="fas fa-calendar"></i> {project.year}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="company-cta-section">
        <h3>Ready to Start Your Project?</h3>
        <p>Let's discuss how we can bring your vision to life with our expert electrical solutions.</p>
        <a href="/contact" className="company-cta-button">
          Get in Touch <i className="fas fa-arrow-right"></i>
        </a>
      </section>
    </div>
  );
};

export default Projects;
