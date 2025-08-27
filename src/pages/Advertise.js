import React from "react";
import { useNavigate } from "react-router-dom";
import "./Advertise.css";

export default function Advertise() {
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate("/contact");
  };

  return (
    <div className="advertise-container">
      {/* Heading Section */}
      <section className="advertise-header">
        <h1>The Regional Advantage</h1>
        <p>
          KahaniBuzz is a vibrant community for regional storytellers and readers.
          <br />
          Here, people engage with stories and content round the clock in their own regional languages,
          making KahaniBuzz a truly unique platform.
          <br />
          When your brand is also presented in regional languages on KahaniBuzz, it builds stronger bonds
          with your audience. With our Regional-First approach, KahaniBuzz helps you create this powerful
          opportunity for deeper communication and cultural connection.
        </p>
        <img
          src="https://github.com/prateekrajput08/Kahani-Buzz/blob/main/public/namaste.png?raw=true"
          alt="Advertise Banner"
          className="banner-img"
        />
      </section>

      {/* How it works */}
      <section className="how-it-works">
        <h1>How It Works</h1>
        <p>
          We create customized campaigns tailored to each client’s product and audience. Our creative design team also helps develop impactful content that enhances the effectiveness of every campaign. Getting started is simple—just reach out to us, and one of our campaign specialists will guide you in choosing the right strategy and content for your brand.
        </p>

        {/* Steps Row */}
        <div className="steps-row">
          <div className="step">
            <img
              src="https://github.com/prateekrajput08/Kahani-Buzz/blob/main/public/Step1.png?raw=true"
              alt="Step 1"
            />
          </div>
          <div className="step">
            <img
              src="https://github.com/prateekrajput08/Kahani-Buzz/blob/main/public/Step%202.png?raw=true"
              alt="Step 2"
            />
          </div>
          <div className="step">
            <img
              src="https://github.com/prateekrajput08/Kahani-Buzz/blob/main/public/Step3.png?raw=true"
              alt="Step 3"
            />
          </div>
        </div>

        {/* Contact Us Button */}
        <div className="contact-button-container">
          <button onClick={handleContactClick} className="contact-button">
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
}
