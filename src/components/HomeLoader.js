import React from "react";
import "./HomeLoader.css";

export default function HomeLoader({ text = "Loading..." }) {
  return (
    <main className="container loader-page">
      {/* Hero Section Skeleton */}
        <section className="hero">
          {/* Title line (always visible) */}
          <div className="skeleton skeleton-hero-title"></div>

          {/* Hero lines: render all 6 total lines (indexing for CSS targeting) */}
          <div className="skeleton skeleton-hero-line line-1 long"></div>  {/* line after title */}
          <div className="skeleton skeleton-hero-line line-2 short"></div> {/* short line */}
          
          {/* Extra lines for small devices */}
          <div className="skeleton skeleton-hero-line extra long"></div>
          <div className="skeleton skeleton-hero-line extra long"></div>
          <div className="skeleton skeleton-hero-line extra long"></div>
          <div className="skeleton skeleton-hero-line extra short"></div>
        </section>



      {/* Latest Stories Skeleton */}
      <section className="section latest-stories-section">
        <h2 className="section-title">Latest Stories</h2>
        <div className="latest-stories-grid">
          {/* Left: Large main story skeleton */}
          <div className="large-story">
            <div className="skeleton skeleton-card large"></div>
          </div>
          {/* Right: 4 small story skeletons */}
          <div className="small-stories-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton skeleton-card small"></div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Authors Skeleton */}
      <section className="section trending-authors-section">
        <h2 className="section-title">Trending Authors</h2>
        <div className="authors-row">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="author-card">
              <div className="skeleton skeleton-avatar"></div>
              <div className="skeleton skeleton-author-name"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Generic Sections Skeleton */}
      <section className="section">
        <h2 className="section-title">Loading...</h2>
        <div className="story-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton skeleton-card"></div>
          ))}
        </div>
      </section>

      {/* Loader message */}
      <p className="loader-message">{text}</p>
    </main>
  );
}
