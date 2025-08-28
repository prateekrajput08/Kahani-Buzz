import React from "react";
import "./StoryLoader.css";

export default function StoryLoader({ text = "Loading story..." }) {
  return (
    <main className="container story-loader" aria-busy="true" aria-live="polite">

      {/* LEFT COLUMN */}
      <section className="left-section-skeleton">
        <div className="skeleton story-detail-title-skeleton"></div>
        <div className="skeleton story-detail-image-skeleton"></div>
        <div className="story-title-like-skeleton">
          <div className="skeleton story-title-below-image-skeleton"></div>
          <div className="skeleton heart-icon-skeleton"></div>
        </div>
        <div className="story-full-content-skeleton">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="skeleton story-text-line-skeleton"></div>
          ))}
        </div>
      </section>

      {/* RIGHT COLUMN */}
      <aside className="right-section-skeleton" aria-hidden="true" role="complementary">
        <div className="sidebar-block-skeleton">
          <div className="skeleton sidebar-block-title-skeleton"></div>
          <div className="categories-list-skeleton">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="category-full-image-skeleton"></div>
            ))}
          </div>
        </div>
        <div className="sidebar-block-skeleton">
          <div className="skeleton sidebar-block-title-skeleton"></div>
          <div className="top-stories-slider-skeleton">
            <div className="top-story-single-box-skeleton"></div>
          </div>
        </div>
      </aside>
    </main>
  );
}
