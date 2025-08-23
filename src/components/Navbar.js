import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchStoriesAndCategories } from "../dataService";
import CategoryDropdown from "./CategoryDropdown";

export default function Navbar() {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchStoriesAndCategories().then(({ categories }) => {
      setCategories(categories);
    });
  }, []);

  // Function to close mobile navbar and dropdown after category selection
  const handleCategoryClick = () => {
    setIsOpen(false);
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav>
      <Link to="/" className="logo-link" onClick={closeMenu}>
        <img src="/logo.png" alt="StoryVerse Logo" className="logo" />
      </Link>

      <ul className={`nav-links ${isOpen ? "open" : ""}`}>
        <li>
          <Link to="/" onClick={closeMenu}>
            <i className="fas fa-home"></i> <span className="nav-text">Home</span>
          </Link>
        </li>
        <li>
          <Link to="/about" onClick={closeMenu}>
            <i className="fas fa-info-circle"></i> <span className="nav-text">About Us</span>
          </Link>
        </li>

        <CategoryDropdown categories={categories} onCategoryClick={handleCategoryClick} />

        <li>
          <Link to="/contact" onClick={closeMenu}>
            <i className="fas fa-envelope"></i> <span className="nav-text">Contact</span>
          </Link>
        </li>
      </ul>

      <div
        className="menu-icon"
        onClick={() => setIsOpen(prev => !prev)}
        role="button"
        tabIndex={0}
        aria-label="Toggle menu"
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setIsOpen(prev => !prev); }}
      >
        {isOpen ? <i className="fas fa-times"></i> : <i className="fas fa-bars"></i>}
      </div>
    </nav>
  );
}
