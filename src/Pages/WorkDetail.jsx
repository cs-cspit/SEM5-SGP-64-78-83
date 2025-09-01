import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './WorkDetail.css';

const WorkDetail = () => {
  const { category } = useParams();

  const workDetails = {
    'RMU Commison': {
      title: "Clients RMU Commissing and Pre-Charging Services",
      sites: [
        {
          location: "Surat - VR Mall",
          description: "Complete RMU commissioning for the new VR Mall power distribution system. Our team handled the installation and testing of 5 RMU units, ensuring seamless integration with the existing infrastructure.",
          challenges: "The main challenge was coordinating with multiple stakeholders and completing the work within a tight deadline before the mall's opening. We overcame this by implementing a detailed project timeline and working in shifts.",
          solution: "Utilized advanced testing equipment and our experienced team to complete commissioning ahead of schedule. Implemented additional safety measures for public area installation.",
          images: ["/Images/RMU_1.jpg", "/Images/RMU_2.jpg", "/Images/RMU_3.jpg", "/Images/RMU_4.jpg"]
        },
        {
          location: "Ahmedabad - Industrial Estate",
          description: "Installation and commissioning of industrial-grade RMUs for a large manufacturing facility. Project involved setting up a comprehensive power distribution network.",
          challenges: "Working in a live industrial environment while maintaining production schedules. Complex integration with existing systems.",
          solution: "Developed a phased implementation plan to minimize downtime. Used temporary power solutions during critical phases.",
          images: ["/Images/RMU_2.jpg", "/Images/RMU_3.jpg", "/Images/RMU_4.jpg", "/Images/RMU_1.jpg"]
        },
         {
          location: "Ahmedabad - Industrial Estate",
          description: "Installation and commissioning of industrial-grade RMUs for a large manufacturing facility. Project involved setting up a comprehensive power distribution network.",
          challenges: "Working in a live industrial environment while maintaining production schedules. Complex integration with existing systems.",
          solution: "Developed a phased implementation plan to minimize downtime. Used temporary power solutions during critical phases.",
          images: ["/Images/RMU_2.jpg", "/Images/RMU_3.jpg", "/Images/RMU_4.jpg", "/Images/RMU_1.jpg"]
        }
      ]
    },
    'LT Works': {
      title: "Clients LT Breaker Servicing works",
      sites: [
        {
          location: "Vadodara - Commercial Complex",
          description: "Comprehensive LT breaker maintenance and upgrade project for a 15-story commercial complex. Serviced over 50 breakers of various capacities.",
          challenges: "Managing power requirements for essential services during maintenance. Coordinating with multiple business tenants.",
          solution: "Implemented a rolling maintenance schedule. Used mobile backup power solutions for critical areas.",
          images: ["/Images/IMG_2.jpg", "/Images/IMG_3.jpg", "/Images/home1.jpg", "/Images/IMG_1.jpg"]
        },
        {
          location: "Surat Airport",
          description: "Regular maintenance and emergency service contract for all LT breakers at Surat Airport facilities.",
          challenges: "Working within strict airport security protocols. Zero downtime requirement for critical systems.",
          solution: "Developed specialized maintenance protocols meeting aviation standards. Maintained dedicated emergency response team.",
          images: ["/Images/IMG_1.jpg", "/Images/IMG_2.jpg", "/Images/IMG_3.jpg", "/Images/home1.jpg"]
        }
      ]
    },
    'High Tension Work': {
      title: "Professional HT Breaker & LBS Servicing",
      sites: [
        {
          location: "Ahmedabad - Industrial Park",
          description: "Complete overhaul of HT infrastructure including breaker servicing and LBS maintenance for a large industrial park.",
          challenges: "Coordinating with multiple industrial units. Managing safety in high-voltage environment.",
          solution: "Implemented comprehensive safety protocols. Used advanced testing equipment for precise diagnostics.",
          images: ["/Images/HT_1.jpg", "/Images/HT_2.jpg", "/Images/HT_3.jpg", "/Images/HT_4.jpg"]
        },
        {
          location: "Vadodara - Power Station",
          description: "Regular maintenance contract for 66kV breakers and switching stations.",
          challenges: "Working in high-stress environment. Managing complex switching operations.",
          solution: "Developed detailed maintenance schedules. Implemented advanced safety measures.",
          images: ["/Images/HT_2.jpg", "/Images/HT_3.jpg", "/Images/HT_4.jpg", "/Images/HT_1.jpg"]
        }
      ]
    },
    'Transformer work': {
      title: "Transformer Oil Filtration & Maintenance",
      sites: [
        {
          location: "Surat - Textile Hub",
          description: "Comprehensive transformer maintenance for multiple textile manufacturing units. Oil filtration and testing for over 20 transformers.",
          challenges: "Managing continuous power requirements. Handling multiple transformer types and specifications.",
          solution: "Used mobile filtration units. Implemented parallel processing techniques for efficiency.",
          images: ["/Images/home1.jpg", "/Images/IMG_1.jpg", "/Images/IMG_2.jpg", "/Images/IMG_3.jpg"]
        },
        {
          location: "Ahmedabad - Commercial District",
          description: "Regular maintenance and emergency services for transformer stations in commercial district.",
          challenges: "Working in densely populated area. Managing environmental concerns.",
          solution: "Implemented eco-friendly filtration process. Used noise reduction techniques during operation.",
          images: ["/Images/IMG_2.jpg", "/Images/IMG_3.jpg", "/Images/home1.jpg", "/Images/IMG_1.jpg"]
        }
      ]
    }
  };

  const categoryData = workDetails[category];

  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!categoryData) {
    return <div>Category not found</div>;
  }

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="work-detail-container">
      <h1 className="work-detail-title">{categoryData.title}</h1>
      <div className="site-list">
        {categoryData.sites.map((site, index) => (
          <div 
            key={index} 
            className={`site-card ${expandedIndex === index ? 'expanded' : ''}`}
          >
            <div className="site-strip" onClick={() => toggleExpand(index)}>
              <div className="site-info">
                <div className="site-info-main">
                  <h2 className="site-title">
                    {site.location}
                    <span className="badge">{site.type || ''}</span>
                  </h2>
                  <div className="site-metadata">
                    <span className="metadata-item">
                      <i className="fas fa-calendar"></i>
                      {site.duration || 'Completed'}
                    </span>
                    <span className="metadata-item">
                      <i className="fas fa-check-circle"></i>
                      {site.status || 'Successful'}
                    </span>
                  </div>
                </div>
              </div>
              <span className="arrow-icon">→</span>
            </div>
            
            <div className="site-content-wrapper">
              <div className="site-images">
                {site.images.map((image, imgIndex) => (
                  <img key={imgIndex} src={image} alt={`${site.location} - View ${imgIndex + 1}`} />
                ))}
              </div>
              <div className="site-content">
                <div className="content-section">
                  <h3>work Overview</h3>
                  <p>{site.description}</p>
                </div>
                <div className="content-section">
                  <h3>Challenges Faced</h3>
                  <p>{site.challenges}</p>
                </div>
                <div className="content-section">
                  <h3>Our Solution</h3>
                  <p>{site.solution}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkDetail;
