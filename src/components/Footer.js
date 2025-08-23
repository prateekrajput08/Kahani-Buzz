import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchStoriesAndCategories } from "../dataService";

export default function Footer() {
  const [categories, setCategories] = useState([]);
  const [popularStories, setPopularStories] = useState([]);

  useEffect(() => {
    fetchStoriesAndCategories().then(({ categories, stories }) => {
      setCategories(categories);
      const latestFive = stories
        .filter(story => story.id >= 1 && story.id <= 5)
        .sort((a, b) => a.id - b.id);
      setPopularStories(latestFive);
    });
  }, []);

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h3>Popular Stories</h3>
            <ul className="footer-links">
              {popularStories.map((story, idx) => (
                <li key={idx}>
                  <Link to={`/story/${story.id}`}>
                    {story.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column">
            <h3>Categories</h3>
            <ul className="footer-links">
              {categories.map((cat, idx) => (
                <li key={idx}>
                  <Link to={`/category/${cat}`}>{cat}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Connect With Us</h3>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="https://www.instagram.com/kahanibuzz.z/" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="https://www.youtube.com/@KahaniBuzz.z" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>

        <div className="copyright">
          <p>© 2025 KahaniBuzz. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
