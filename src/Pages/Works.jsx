import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Works.css';

const Works = () => {
  const workItems = [
    {
      title: "Comprehensive RMU Testing and Pre-Charging Services",
      description: "Comprehensive RMU commissioning services ensuring safe and reliable operation of the power distribution network. Our process includes rigorous testing of protection relays, verification of control wiring, and proper CT/PT connections to guarantee system integrity before energization.",
      extendedDescription: "Our RMU commissioning ensures complete system readiness through protection relay testing, control wiring verification, and CT/PT connection checks. We perform relay programming as per site requirements, insulation and continuity tests, and confirm interlocks and earthing. Before energization, all safety and operational parameters are validated for reliable power distribution",
      images: ["/Images/RMU_1.jpg", "/Images/RMU_2.jpg", "/Images/RMU_3.jpg","/Images/RMU_4.jpg"],
      category: "RMU Commison"
    },
    {
      title: "Professional LT Breaker Servicing for All Major Brands",
      description: "Comprehensive LT breaker servicing for all major brands, including L&T, ABB, Siemens, Schneider Electric, and more. We deliver expert maintenance, greasing, and testing services to ensure safety and reliable operation at competitive pricing.",
      extendedDescription: "Our LT breaker servicing expertise covers all makes and models from brands such as L&T, ABB, Siemens, Schneider, and others. Services include thorough cleaning, lubrication, contact resistance testing, insulation resistance checks, and functional verification for reliable performance. With advanced testing instruments and skilled technicians, we ensure top-quality service at reasonable rates. Trusted by 100+ clients like GMDC, VR Mall, Rahul Raj Mall, and Surat Airport, our services extend across Gujarat, including Vapi, Silvassa, Kutch, Vadodara, and Ahmedabad",
      images: ["/Images/IMG_2.jpg", "/Images/IMG_3.jpg", "/Images/home1.jpg", "/Images/IMG_1.jpg"],
      category: "LT Works"
    },
    {
      title: "Professional HT Breaker & LBS Servicing with Advanced Testing Solutions",
      description: "Expert HT breaker servicing for all leading brands, including L&T, ABB, Siemens, Schneider, and more. We provide end-to-end maintenance, advanced testing, and reliable solutions for breakers and load break switches (LBS) up to 66kV, ensuring maximum system safety and performance.",
      extendedDescription: "Our HT breaker servicing expertise covers all major brands and voltage levels, including 11kV, 22kV, and 66kV breakers as well as LBS systems. We utilize professional-grade testing equipment such as secondary injection kits, Contact Resistance Measurement (CRM) devices, and breaker timing analyzers to ensure accurate performance verification. Services include mechanical inspection, lubrication, insulation resistance testing, primary and secondary injection testing, breaker timing tests, trip circuit verification, and interlock checks. We ensure every service complies with the highest safety and operational standards for reliable and efficient power distribution.",
      images: ["/Images/HT_1.jpg", "/Images/HT_2.jpg", "/Images/HT_3.jpg", "/Images/HT_4.jpg"],
      category: "High Tension Work"
    },
    {
      title: "Transformer Oil Filtration & Comprehensive Maintenance Services",
      description: "Professional transformer oil filtration and maintenance services using advanced filtration equipment and testing techniques to ensure high dielectric strength and optimal performance of transformers.",
      extendedDescription: "Our transformer oil filtration service is designed to restore oil quality and improve the insulation performance of power transformers. We use high-efficiency vacuum filtration machines to remove moisture, gas, and impurities from the oil. Our team performs essential tests such as Breakdown Voltage (BDV), moisture content analysis, and acidity tests to ensure oil health. In addition to filtration, we provide oil top-up services, complete transformer maintenance, inspection of bushings and gaskets, tightening of connections, and cleaning of radiators. We also verify breather silica gel condition, check earthing, and perform insulation resistance tests for overall system reliability. All services are carried out with strict adherence to electrical safety standards for transformers of various capacities.",
      images: ["/Images/home1.jpg", "/Images/IMG_1.jpg", "/Images/IMG_2.jpg", "/Images/IMG_3.jpg"],
      category: "Transformer work"
    }
    
  ];

  // State to track current image index for each work item
  const [currentImages, setCurrentImages] = useState(workItems.map(() => 0));

  // Effect to handle image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImages(prevImages => 
        prevImages.map(index => (index + 1) % 4)
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="works-container">
      <div className="works-header">
        <h1>Our Professional Works</h1>
        <p>Delivering Excellence in Electrical Solutions</p>
      </div>

      <div className="works-list">
        {workItems.map((work, index) => (
          <div 
            key={index} 
            className={`work-card ${index % 2 === 0 ? 'left-image' : 'right-image'}`}
            data-aos={index % 2 === 0 ? 'fade-right' : 'fade-left'}
            data-aos-delay={index * 100}
          >
            <div className="work-image-container">
              {work.images.map((image, imgIndex) => (
                <div 
                  key={imgIndex}
                  className={`slide ${imgIndex === currentImages[index] ? 'active' : ''}`}
                >
                  <img src={image} alt={`${work.title} - View ${imgIndex + 1}`} />
                </div>
              ))}
              <div className="image-overlay">
                <span className="category-badge">{work.category}</span>
              </div>
            </div>
            <div className="work-content">
              <div className="content-inner">
                <h3>{work.title}</h3>
                <p className="description">{work.description}</p>
                <p className="extended-description">
                  {work.extendedDescription}
                </p>
                <Link to={`/works/${work.category}`} className="detail-button">
                  View Projects <span className="arrow">→</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Works;
