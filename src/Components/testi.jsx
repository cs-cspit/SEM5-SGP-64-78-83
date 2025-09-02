import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./testi.css";

export default function TestimonialCarousel() {
  const testimonials = [
    {
      id: 1,
      text: "Their team handled our HT line maintenance with full safety and precision. We never faced downtime after their service.",
      name: "Rachel Green",
      role: "Founder",
      img: "/Images/cinepolis.jpg", // ✅ logo/image
    },
    {
      id: 2,
      text: "We are tension-free with their AMC service. Regular checkups keep our system safe and efficient",
      role: "Director",
      img: "/Images/enviro.jpeg", // ✅ logo/image
    
    },
    {
      id: 3,
      text: "They carried out transformer servicing with complete testing and gave us reliable performance assurance.",
      name: "Chandler Bing",
      role: "Manager",
      img: "https://i.pravatar.cc/100?img=3",
    },
    {
      id: 4,
      text: "Their grip on HT line work is unmatched. From shutdowns to live-line jobs, everything is managed safely.",
      name: "Monica Geller",
      role: "CEO",
      img: "https://i.pravatar.cc/100?img=4",
    },
    {
      id: 5,
      text: "During fault, their team responded at midnight. Power was restored faster than we expected.",
      name: "Joey Tribbiani",
      role: "Actor",
      img: "https://i.pravatar.cc/100?img=5",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className="testimonial-section">
      <h3 className="enhanced-section-title fade-in">What Our Clients Say</h3>
      <div className="testimonial-carousel">
        <button className="arrow-btn left" onClick={prevSlide}>
          <ChevronLeft size={28} />
        </button>

        <div className="testimonial-track">
          {testimonials.map((t, index) => {
            let position = "hidden";

            if (index === currentIndex) {
              position = "active";
            } else if (
              index === (currentIndex - 1 + testimonials.length) % testimonials.length
            ) {
              position = "prev";
            } else if (
              index === (currentIndex - 2 + testimonials.length) % testimonials.length
            ) {
              position = "prev2";
            } else if (index === (currentIndex + 1) % testimonials.length) {
              position = "next";
            } else if (index === (currentIndex + 2) % testimonials.length) {
              position = "next2";
            }

            return (
              <div key={t.id} className={`testimonial-card ${position}`}>
                {/* ✅ Circle with logo */}
                <div className="testimonial-logo">
                  <img src={t.img} alt={t.name} />
                </div>

                <p className="testimonial-text">{t.text}</p>
                <h4 className="testimonial-name">{t.name}</h4>
                <span className="testimonial-role">{t.role}</span>
              </div>
            );
          })}
        </div>

        <button className="arrow-btn right" onClick={nextSlide}>
          <ChevronRight size={28} />
        </button>
      </div>
    </section>
  );
}
