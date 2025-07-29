import React from "react";
const ServiceCard = ({ icon, title }) => (
  <div className="bg-light rounded-lg shadow p-6 text-center hover:bg-primary hover:text-white transition">
    <div className="mb-3">{icon}</div>
    <h3 className="font-semibold">{title}</h3>
  </div>
);
export default ServiceCard;

// Usage in Home.jsx
// <ServiceCard icon={<WiringIcon />} title="Wiring" />
