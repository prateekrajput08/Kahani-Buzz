import React from "react";
import "./Loader.css";

export default function Loader({ text = "Loading..." }) {
  return (
    <div className="custom-loader-container">
      {/* Use public folder image */}
      <img src="/favicon.png" alt="Loading..." className="custom-loader-img" />
      <div className="custom-loader-text">{text}</div>
    </div>
  );
}
