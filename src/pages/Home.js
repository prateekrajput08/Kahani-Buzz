// File: src/pages/Home.js
import React, { useContext, useState } from "react";
import { StoriesContext } from "../contexts/StoriesContext";
import { FaArrowRight } from "react-icons/fa";
import StoryCard from "../components/StoryCard";
import Loader from "../components/Loader";

export default function Home() {
  const { stories, loading, error } = useContext(StoriesContext);
  const [expandedSections, setExpandedSections] = useState([]);
  if (loading) return <Loader text="कहानियाँ लोड हो रही हैं..." />;

  // === Latest Stories Filtering ===
  const mainStory = stories.find((s) => Number(s.id) === 1);
  const otherLatestStories = stories
    .filter((s) => {
      const sid = Number(s.id);
      return sid >= 2 && sid <= 5;
    })
    .sort((a, b) => Number(a.id) - Number(b.id));

  // === Homepage Sections Filtering (beyond Latest) ===
  const homepageSections = Array.from(
    new Set(
      stories.flatMap((story) =>
        story.homepage_section
          ? story.homepage_section.split(",").map((s) => s.trim())
          : []
      )
    )
  ).filter(Boolean);

  const toggleSection = (sectionName) => {
    setExpandedSections((prev) =>
      prev.includes(sectionName)
        ? prev.filter((s) => s !== sectionName)
        : [...prev, sectionName]
    );
  };

  // === Loading & Error states ===
  if (loading) return <Loader text="Loading stories..." />;
  if (error) return <p>Error loading stories...</p>;

  return (
    <main className="container">
      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to KahaniBuzz</h1>
        <p>
          Hindi Kahani का विशाल संग्रह! Hindi story और story in hindi का खजाना।
          प्रेम, साहस और मनोरंजन से भरी kahani व kahani in hindi। नई kahaniyan,
          क्लासिक hindi kahani और शिक्षाप्रद hindi kahaniyan एक जगह।  
          Stories in hindi का आनंद लें!
        </p>
      </section>

      {/* ======================= Latest Stories ======================= */}
      <section className="section latest-stories-section">
        <h2 className="section-title">Latest Stories</h2>

        {(mainStory || otherLatestStories.length > 0) ? (
          <div className="latest-stories-grid">

            {/* Left: Main Story */}
            {mainStory && (
              <div className="large-story">
                <StoryCard story={mainStory} clickableBox />
              </div>
            )}

            {/* Right: 4 Small Stories */}
            <div className="small-stories-grid">
              {otherLatestStories.map((story) => (
                <StoryCard key={story.id} story={story} clickableBox />
              ))}
            </div>

          </div>
        ) : (
          <p>No latest stories found.</p>
        )}
      </section>

      {/* ======================= Other Homepage Sections ======================= */}
      {homepageSections.map((sectionName) => {
        const sectionStories = stories.filter((story) => {
          if (!story.homepage_section) return false;
          const sid = Number(story.id);
          if (sid >= 1 && sid <= 5) return false; // exclude "latest stories"
          const sections = story.homepage_section.split(",").map((s) => s.trim());
          return sections.includes(sectionName);
        });

        if (sectionStories.length === 0) return null;

        const expanded = expandedSections.includes(sectionName);
        const storiesToShow = expanded
          ? sectionStories
          : sectionStories.slice(0, 4);

        return (
          <section className="section" key={sectionName}>
            <div
              className="section-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 className="section-title">{sectionName}</h2>
              {sectionStories.length > 4 && (
                <button
                  className="view-all-btn"
                  onClick={() => toggleSection(sectionName)}
                  aria-label={`View ${expanded ? "less" : "all"} stories in ${sectionName}`}
                >
                  View {expanded ? "Less" : "All"}{" "}
                  <FaArrowRight
                    style={{
                      marginLeft: "5px",
                      transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
                      transition: "transform 0.3s",
                    }}
                  />
                </button>
              )}
            </div>

            {/* Grid of 4 StoryCards per row */}
            <div className="story-grid">
              {storiesToShow.map((story) => (
                <StoryCard key={story.id} story={story} clickableBox />
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
