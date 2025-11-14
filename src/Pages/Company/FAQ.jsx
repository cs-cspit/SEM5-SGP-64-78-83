import React, { useState } from 'react';
import './Company.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      category: "General",
      questions: [
        {
          question: "What services does Jay Jalaram Electricals offer?",
          answer: "We offer a comprehensive range of electrical services including residential wiring, commercial installations, industrial solutions, electrical maintenance, Havells service center support, and emergency repair services."
        },
        {
          question: "What areas do you serve?",
          answer: "We primarily serve Surat and surrounding areas in Gujarat. However, for large-scale industrial projects, we can extend our services to other regions. Contact us to discuss your specific location requirements."
        },
        {
          question: "Are you licensed and insured?",
          answer: "Yes, we are fully licensed and insured. Our team consists of certified electricians and engineers who comply with all local and national electrical codes and safety standards."
        },
        {
          question: "How long have you been in business?",
          answer: "Jay Jalaram Electricals was established in 2009 and has been serving the community for over 15 years with reliable electrical solutions."
        }
      ]
    },
    {
      category: "Services & Pricing",
      questions: [
        {
          question: "Do you provide free estimates?",
          answer: "Yes, we offer free on-site estimates for all projects. Our team will assess your requirements and provide a detailed quotation with transparent pricing."
        },
        {
          question: "What is your pricing structure?",
          answer: "Our pricing depends on the scope and complexity of the project. We offer competitive rates and provide detailed breakdowns of all costs. Small repairs may have fixed rates, while larger projects are quoted after site assessment."
        },
        {
          question: "Do you offer emergency services?",
          answer: "Yes, we provide 24/7 emergency electrical services for urgent situations. Additional charges may apply for after-hours emergency calls."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept cash, bank transfers, cheques, and online payment methods. For larger projects, we can arrange milestone-based payment schedules."
        }
      ]
    },
    {
      category: "Projects & Timeline",
      questions: [
        {
          question: "How long does a typical project take?",
          answer: "Project duration varies based on scope. Small repairs might be completed in a few hours, while complete wiring for a house could take 1-2 weeks. Industrial projects are assessed individually. We provide estimated timelines during the quotation phase."
        },
        {
          question: "Do you handle residential, commercial, and industrial projects?",
          answer: "Yes, we have expertise in all three sectors. Our team is equipped to handle projects of all sizes, from home electrical repairs to large-scale industrial installations."
        },
        {
          question: "Can you work on existing electrical systems?",
          answer: "Absolutely. We can upgrade, repair, or modify existing electrical systems. We conduct thorough assessments before beginning work to ensure safety and compliance."
        },
        {
          question: "Do you provide maintenance contracts?",
          answer: "Yes, we offer Annual Maintenance Contracts (AMC) for both residential and commercial clients. These include regular inspections, preventive maintenance, and priority service."
        }
      ]
    },
    {
      category: "Safety & Quality",
      questions: [
        {
          question: "What safety standards do you follow?",
          answer: "We strictly adhere to the National Electrical Code (NEC) and Indian Electricity Rules. Our team follows comprehensive safety protocols and uses proper safety equipment on all projects."
        },
        {
          question: "Do you provide warranties?",
          answer: "Yes, we provide warranties on both our workmanship and materials used. The warranty period varies depending on the type of work and products installed. Details are provided in the contract."
        },
        {
          question: "What brands of electrical products do you use?",
          answer: "We work with reputable brands including Havells, Polycab, Anchor, Legrand, and others. We're also an authorized Havells service center. We can accommodate client preferences for specific brands."
        },
        {
          question: "How do you ensure quality work?",
          answer: "Quality is ensured through: certified and experienced electricians, adherence to safety codes, use of quality materials, thorough testing before handover, and post-installation support."
        }
      ]
    },
    {
      category: "Appointments & Support",
      questions: [
        {
          question: "How do I schedule an appointment?",
          answer: "You can schedule an appointment by calling us at +91 70163 88853, emailing jayjalaramelectricals@gmail.com, or using the contact form on our website. We'll respond within 24 hours to confirm your appointment."
        },
        {
          question: "What should I prepare before the electrician arrives?",
          answer: "Please ensure clear access to the work area, secure pets if any, and have a list of your concerns or requirements ready. For major work, discuss any specific preferences or constraints beforehand."
        },
        {
          question: "Do I need to be present during the work?",
          answer: "For residential projects, we prefer someone to be present for security and to address any questions. For commercial/industrial sites, an authorized representative should be available."
        },
        {
          question: "How can I get support after the project is completed?",
          answer: "We provide ongoing support for all our projects. You can reach us through phone, email, or our contact form. We offer warranty support and are happy to address any concerns or questions you may have."
        }
      ]
    }
  ];

  let questionIndex = 0;

  return (
    <div className="company-wrapper">
      {/* Hero Section */}
      <section className="company-hero">
        <h2 className="company-title">Frequently Asked Questions</h2>
        <p className="company-tagline">
          Find Answers • Get Informed
        </p>
      </section>

      {/* Introduction */}
      <section className="company-faq-intro">
        <p className="company-intro-text">
          Have questions? We've compiled answers to the most common questions we receive. 
          If you don't find what you're looking for, feel free to contact us directly.
        </p>
      </section>

      {/* FAQ Categories */}
      <section className="company-faq-section">
        {faqs.map((category, catIndex) => (
          <div key={catIndex} className="company-faq-category">
            <h3 className="company-category-title">
              <i className="fas fa-folder-open"></i> {category.category}
            </h3>
            <div className="company-faq-list">
              {category.questions.map((faq) => {
                const currentIndex = questionIndex++;
                return (
                  <div 
                    key={currentIndex} 
                    className={`company-faq-item ${activeIndex === currentIndex ? 'active' : ''}`}
                  >
                    <div 
                      className="company-faq-question"
                      onClick={() => toggleFAQ(currentIndex)}
                    >
                      <h4>{faq.question}</h4>
                      <i className={`fas fa-chevron-${activeIndex === currentIndex ? 'up' : 'down'}`}></i>
                    </div>
                    {activeIndex === currentIndex && (
                      <div className="company-faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* Contact Section */}
      <section className="company-faq-contact">
        <div className="company-contact-box">
          <h3>Still Have Questions?</h3>
          <p>Our team is here to help. Reach out to us and we'll get back to you as soon as possible.</p>
          <div className="company-contact-options">
            <div className="company-contact-option">
              <i className="fas fa-phone"></i>
              <div>
                <strong>Call Us</strong>
                <p>+91 70163 88853</p>
              </div>
            </div>
            <div className="company-contact-option">
              <i className="fas fa-envelope"></i>
              <div>
                <strong>Email Us</strong>
                <p>jayjalaramelectricals@gmail.com</p>
              </div>
            </div>
          </div>
          <a href="/contact" className="company-cta-button">
            Contact Us <i className="fas fa-arrow-right"></i>
          </a>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
