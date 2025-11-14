import React, { useState } from 'react';
import './Company.css';

const Careers = () => {
  const [selectedJob, setSelectedJob] = useState(null);

  const jobOpenings = [
    {
      id: 1,
      title: "Senior Electrical Engineer",
      department: "Engineering",
      location: "Surat, Gujarat",
      type: "Full-time",
      experience: "5-8 years",
      description: "We're looking for an experienced electrical engineer to lead major industrial projects and mentor junior team members.",
      requirements: [
        "Bachelor's degree in Electrical Engineering",
        "5+ years of experience in industrial electrical systems",
        "Strong knowledge of electrical codes and safety standards",
        "Project management experience",
        "Excellent problem-solving skills"
      ]
    },
    {
      id: 2,
      title: "Electrician - Commercial Projects",
      department: "Operations",
      location: "Surat, Gujarat",
      type: "Full-time",
      experience: "2-5 years",
      description: "Join our team to work on exciting commercial electrical installation and maintenance projects.",
      requirements: [
        "ITI or Diploma in Electrical",
        "Valid electrician license",
        "Experience in commercial electrical work",
        "Ability to read electrical drawings",
        "Good communication skills"
      ]
    },
    {
      id: 3,
      title: "Project Manager",
      department: "Project Management",
      location: "Surat, Gujarat",
      type: "Full-time",
      experience: "7-10 years",
      description: "Lead and manage multiple electrical projects from planning to execution, ensuring timely delivery and client satisfaction.",
      requirements: [
        "Degree in Engineering or related field",
        "PMP certification preferred",
        "7+ years of project management experience",
        "Strong leadership and team management skills",
        "Excellent client relationship management"
      ]
    },
    {
      id: 4,
      title: "Electrical Technician",
      department: "Maintenance",
      location: "Surat, Gujarat",
      type: "Full-time",
      experience: "1-3 years",
      description: "Perform electrical maintenance, troubleshooting, and repair work for residential and commercial clients.",
      requirements: [
        "ITI in Electrical",
        "Basic knowledge of electrical systems",
        "Troubleshooting skills",
        "Safety-conscious approach",
        "Willingness to learn and grow"
      ]
    },
    {
      id: 5,
      title: "Sales Engineer",
      department: "Sales & Marketing",
      location: "Surat, Gujarat",
      type: "Full-time",
      experience: "2-4 years",
      description: "Drive business growth by identifying opportunities, building client relationships, and closing electrical service contracts.",
      requirements: [
        "Engineering background preferred",
        "2+ years of technical sales experience",
        "Strong communication and presentation skills",
        "Knowledge of electrical products and services",
        "Self-motivated and target-oriented"
      ]
    }
  ];

  const benefits = [
    { icon: "fas fa-dollar-sign", title: "Competitive Salary", description: "Industry-leading compensation packages" },
    { icon: "fas fa-heartbeat", title: "Health Insurance", description: "Comprehensive medical coverage for you and family" },
    { icon: "fas fa-book", title: "Learning & Development", description: "Training programs and certification support" },
    { icon: "fas fa-clock", title: "Work-Life Balance", description: "Flexible working hours and paid time off" },
    { icon: "fas fa-rocket", title: "Career Growth", description: "Clear paths for advancement and promotion" },
    { icon: "fas fa-users", title: "Team Culture", description: "Collaborative and supportive work environment" }
  ];

  return (
    <div className="company-wrapper">
      {/* Hero Section */}
      <section className="company-hero">
        <h2 className="company-title">Careers</h2>
        <p className="company-tagline">
          Build Your Future • Grow With Us
        </p>
      </section>

      {/* Introduction */}
      <section className="company-careers-intro">
        <h3>Join Our Team</h3>
        <p className="company-intro-text">
          At Jay Jalaram Electricals, we believe our people are our greatest asset. We're always 
          looking for talented, passionate individuals who want to make a difference in the electrical 
          industry. Join us and be part of a team that values innovation, excellence, and integrity.
        </p>
      </section>

      {/* Benefits Section */}
      <section className="company-benefits-section">
        <h3 className="company-section-heading">Why Work With Us?</h3>
        <div className="company-benefits-grid">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="company-benefit-card"
            >
              <div className="company-benefit-icon"><i className={benefit.icon}></i></div>
              <h4>{benefit.title}</h4>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Job Openings */}
      <section className="company-jobs-section">
        <h3 className="company-section-heading">Current Openings</h3>
        <div className="company-jobs-list">
          {jobOpenings.map((job) => (
            <div key={job.id} className="company-job-card">
              <div className="company-job-header">
                <div>
                  <h4 className="company-job-title">{job.title}</h4>
                  <div className="company-job-meta">
                    <span><i className="fas fa-briefcase"></i> {job.department}</span>
                    <span><i className="fas fa-map-marker-alt"></i> {job.location}</span>
                    <span><i className="fas fa-clock"></i> {job.type}</span>
                    <span><i className="fas fa-user-clock"></i> {job.experience}</span>
                  </div>
                </div>
                <button 
                  className="company-job-toggle"
                  onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                >
                  {selectedJob === job.id ? 'Hide Details' : 'View Details'}
                </button>
              </div>
              
              {selectedJob === job.id && (
                <div className="company-job-details">
                  <p className="company-job-description">{job.description}</p>
                  <h5>Requirements:</h5>
                  <ul className="company-job-requirements">
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                  <a href="/contact" className="company-apply-button">
                    Apply Now <i className="fas fa-arrow-right"></i>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Application Process */}
      <section className="company-process-section">
        <h3 className="company-section-heading">Our Hiring Process</h3>
        <div className="company-process-steps">
          <div className="company-process-step">
            <div className="company-step-number">1</div>
            <h4>Apply Online</h4>
            <p>Submit your application through our website or email</p>
          </div>
          <div className="company-process-step">
            <div className="company-step-number">2</div>
            <h4>Initial Screening</h4>
            <p>Our HR team reviews your application</p>
          </div>
          <div className="company-process-step">
            <div className="company-step-number">3</div>
            <h4>Interview</h4>
            <p>Technical and HR interview rounds</p>
          </div>
          <div className="company-process-step">
            <div className="company-step-number">4</div>
            <h4>Offer</h4>
            <p>Receive offer letter and join our team</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="company-cta-section">
        <h3>Ready to Take the Next Step?</h3>
        <p>Send your resume to careers@jayjalaramelectricals.com or contact us for more information.</p>
        <a href="/contact" className="company-cta-button">
          Get in Touch <i className="fas fa-arrow-right"></i>
        </a>
      </section>
    </div>
  );
};

export default Careers;
