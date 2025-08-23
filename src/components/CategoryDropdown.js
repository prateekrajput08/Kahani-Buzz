import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

export default function CategoryDropdown({ categories, onCategoryClick }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  // Called when category link is clicked
  const handleCategoryClick = () => {
    setDropdownOpen(false);
    if (onCategoryClick) onCategoryClick(); // Notify Navbar to close mobile menu
  };

  return (
    <li
      className="dropdown"
      ref={dropdownRef}
      aria-expanded={dropdownOpen}
    >
      <span
        className="category-label"
        onClick={toggleDropdown}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggleDropdown(); }}
        aria-haspopup="true"
        aria-controls="category-menu"
      >
        <i className="fas fa-book"></i>{" "}
        <span className="nav-text">Categories</span>{" "}
        <i className={`fas fa-chevron-down${dropdownOpen ? " rotated" : ""}`}></i>
      </span>

      <div
        id="category-menu"
        className={`dropdown-content${dropdownOpen ? " show" : ""}`}
        role="menu"
        aria-label="Category menu"
      >
        {categories.map((category, idx) => {
          const isActive =
            location.pathname.toLowerCase() === `/category/${category.toLowerCase()}`;

          return (
            <Link
              to={`/category/${category}`}
              key={idx}
              className={`dropdown-item${isActive ? " active" : ""}`}
              role="menuitem"
              tabIndex={dropdownOpen ? 0 : -1}
              onClick={handleCategoryClick}
            >
              {category}
            </Link>
          );
        })}
      </div>
    </li>
  );
}
