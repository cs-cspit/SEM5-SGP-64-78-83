import React from 'react';
import './Company.css';

const Terms = () => {
  return (
    <div className="company-wrapper">
      {/* Hero Section */}
      <section className="company-hero">
        <h2 className="company-title">Terms & Privacy Policy</h2>
        <p className="company-tagline">
          Your Trust • Our Responsibility
        </p>
      </section>

      {/* Content Section */}
      <section className="company-terms-content">
        <div className="company-terms-container">
          
          {/* Terms of Service */}
          <div className="company-terms-section">
            <h3 className="company-terms-heading">
              <i className="fas fa-file-contract"></i> Terms of Service
            </h3>
            
            <div className="company-terms-block">
              <h4>1. Acceptance of Terms</h4>
              <p>
                By accessing and using the services of Jay Jalaram Electricals, you accept and agree 
                to be bound by the terms and conditions outlined in this agreement. If you do not 
                agree to these terms, please do not use our services.
              </p>
            </div>

            <div className="company-terms-block">
              <h4>2. Services Description</h4>
              <p>
                Jay Jalaram Electricals provides professional electrical installation, maintenance, 
                and repair services for residential, commercial, and industrial clients. All services 
                are subject to availability and may be modified or discontinued without prior notice.
              </p>
            </div>

            <div className="terms-block">
              <h4>3. Service Agreements</h4>
              <p>
                All projects require a written agreement specifying the scope of work, timeline, 
                pricing, and payment terms. The agreement becomes binding upon signature by both 
                parties. Any changes to the scope of work must be documented and approved in writing.
              </p>
            </div>

            <div className="terms-block">
              <h4>4. Payment Terms</h4>
              <p>
                Payment terms will be specified in the service agreement. We accept various payment 
                methods including cash, bank transfers, and online payments. For larger projects, 
                milestone-based payment schedules may be arranged. Late payments may incur additional 
                charges as specified in the agreement.
              </p>
            </div>

            <div className="terms-block">
              <h4>5. Warranties</h4>
              <p>
                We provide warranties on our workmanship and materials as specified in individual 
                service agreements. Warranty coverage excludes damage caused by misuse, unauthorized 
                modifications, or natural disasters. Warranty claims must be reported promptly with 
                proper documentation.
              </p>
            </div>

            <div className="terms-block">
              <h4>6. Liability Limitations</h4>
              <p>
                While we maintain comprehensive insurance coverage, our liability is limited to the 
                contract value of the specific project. We are not liable for indirect, incidental, 
                or consequential damages. All work is performed in accordance with applicable electrical 
                codes and safety standards.
              </p>
            </div>

            <div className="terms-block">
              <h4>7. Client Responsibilities</h4>
              <p>
                Clients are responsible for: providing accurate information about the project, 
                ensuring access to work areas, obtaining necessary permits (unless specified otherwise), 
                and maintaining installed systems according to recommendations. Failure to meet these 
                responsibilities may affect warranty coverage.
              </p>
            </div>

            <div className="terms-block">
              <h4>8. Cancellation Policy</h4>
              <p>
                Project cancellations must be communicated in writing. Cancellation charges may apply 
                based on work already completed and materials purchased. For scheduled appointments, 
                please provide at least 24 hours notice for cancellations or rescheduling.
              </p>
            </div>
          </div>

          {/* Privacy Policy */}
          <div className="company-terms-section">
            <h3 className="company-terms-heading">
              <i className="fas fa-shield-alt"></i> Privacy Policy
            </h3>

            <div className="company-terms-block">
              <h4>1. Information Collection</h4>
              <p>
                We collect personal information including name, contact details, address, and project 
                specifications when you engage our services. This information is collected through 
                direct communication, contact forms, and service agreements. We only collect information 
                necessary to provide our services effectively.
              </p>
            </div>

            <div className="terms-block">
              <h4>2. Use of Information</h4>
              <p>
                Your information is used to: provide and improve our services, communicate about 
                projects and appointments, send invoices and receipts, provide technical support, 
                and comply with legal obligations. We may also use aggregated, non-personal data 
                for business analysis and service improvement.
              </p>
            </div>

            <div className="terms-block">
              <h4>3. Information Sharing</h4>
              <p>
                We do not sell, rent, or trade your personal information to third parties. Information 
                may be shared with: authorized service partners working on your project, payment 
                processors for transaction handling, and legal authorities when required by law. 
                All third parties are bound by confidentiality agreements.
              </p>
            </div>

            <div className="terms-block">
              <h4>4. Data Security</h4>
              <p>
                We implement industry-standard security measures to protect your information from 
                unauthorized access, disclosure, alteration, or destruction. This includes secure 
                data storage, encrypted communications, and restricted access to personal information. 
                However, no method of transmission over the internet is 100% secure.
              </p>
            </div>

            <div className="terms-block">
              <h4>5. Cookies and Tracking</h4>
              <p>
                Our website may use cookies to enhance user experience and analyze site usage. 
                Cookies are small files stored on your device that help us remember your preferences 
                and understand how you interact with our website. You can control cookie settings 
                through your browser preferences.
              </p>
            </div>

            <div className="terms-block">
              <h4>6. Your Rights</h4>
              <p>
                You have the right to: access your personal information, request corrections to 
                inaccurate data, request deletion of your data (subject to legal requirements), 
                opt-out of marketing communications, and file a complaint if you believe your 
                privacy rights have been violated.
              </p>
            </div>

            <div className="terms-block">
              <h4>7. Data Retention</h4>
              <p>
                We retain your personal information for as long as necessary to provide services 
                and fulfill legal obligations. Project-related information is typically retained 
                for 7 years for warranty and legal purposes. After this period, data is securely 
                deleted or anonymized.
              </p>
            </div>

            <div className="terms-block">
              <h4>8. Children's Privacy</h4>
              <p>
                Our services are not directed to individuals under 18 years of age. We do not 
                knowingly collect personal information from children. If you become aware that 
                a child has provided us with personal information, please contact us immediately.
              </p>
            </div>

            <div className="terms-block">
              <h4>9. Policy Updates</h4>
              <p>
                We may update this Privacy Policy periodically to reflect changes in our practices 
                or legal requirements. Significant changes will be communicated through our website 
                or direct notification. Continued use of our services after policy updates constitutes 
                acceptance of the revised terms.
              </p>
            </div>

            <div className="terms-block">
              <h4>10. Contact Information</h4>
              <p>
                For questions or concerns about our Terms of Service or Privacy Policy, please contact us at:
              </p>
              <ul className="company-contact-list">
                <li><i className="fas fa-envelope"></i> Email: jayjalaramelectricals@gmail.com</li>
                <li><i className="fas fa-phone"></i> Phone: +91 70163 88853</li>
                <li><i className="fas fa-map-marker-alt"></i> Address: 43, Junajin Hanuman Tekri, Opp Ramji Temple, Rander, Surat</li>
              </ul>
            </div>
          </div>

          {/* Last Updated */}
          <div className="company-terms-footer">
            <p><strong>Last Updated:</strong> November 14, 2025</p>
            <p>
              By using our services, you acknowledge that you have read, understood, and agree 
              to be bound by these Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="company-cta-section">
        <h3>Have Questions About Our Policies?</h3>
        <p>We're here to help clarify any concerns you may have.</p>
        <a href="/contact" className="company-cta-button">
          Contact Us <i className="fas fa-arrow-right"></i>
        </a>
      </section>
    </div>
  );
};

export default Terms;
