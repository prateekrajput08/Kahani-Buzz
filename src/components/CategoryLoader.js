import React from "react";
import "./CategoryLoader.css";

export default function CategoryLoader({ text = "Loading stories..." }) {
  const numberOfCategories = 6; // adjust as needed

  return (
    <main className="container loader-page category-loader" aria-busy="true" aria-live="polite">

      {/* Left Section Skeleton */}
      <div className="left-section-skeleton">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="story-card-horizontal-skeleton" aria-hidden="true">
            <div className="skeleton story-image-skeleton"></div>
            <div className="story-content-skeleton">
              <div className="skeleton story-title-skeleton"></div>
              <div className="skeleton story-desc-skeleton"></div>
              <div className="skeleton story-desc-skeleton"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Section Skeleton */}
      <aside className="right-section-skeleton" aria-hidden="true" role="complementary">
        <h3 className="skeleton skeleton-section-title"></h3>
        <div className="categories-skeleton-grid">
          {Array.from({ length: numberOfCategories }).map((_, idx) => (
            <div key={idx} className="category-box-skeleton"></div>
          ))}
        </div>

        <h3 className="skeleton skeleton-section-title"></h3>
        <div className="top-story-skeleton"></div>
      </aside>

    </main>
  );
}
