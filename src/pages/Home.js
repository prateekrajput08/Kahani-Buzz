import React, { useContext, useState, useEffect } from "react";
import { StoriesContext } from "../contexts/StoriesContext";
import { FaArrowRight } from "react-icons/fa";
import StoryCard from "../components/StoryCard";
import Loader from "../components/Loader";

export default function Home() {
  const { stories, loading, error } = useContext(StoriesContext);
  const [expandedSections, setExpandedSections] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Track window resize to update width state
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // === Trending Authors: Get top 5 unique authors ===
  const authorsMap = new Map();
  for (const story of stories) {
    if (story.author && !authorsMap.has(story.author)) {
      authorsMap.set(story.author, story.author_image_url || "");
      if (authorsMap.size >= 5) break;
    }
  }
  const allTopAuthors = Array.from(authorsMap.entries()).map(([name, img]) => ({
    name,
    image: img,
  }));

  // Show only 3 authors on small devices (≤ 600px), else show all 5
  const authorsToShow = windowWidth <= 600 ? allTopAuthors.slice(0, 3) : allTopAuthors;

  if (loading) return <Loader text="Loading stories..." />;
  if (error) return <p>Error loading stories...</p>;

  return (
    <main className="container">
      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to KahaniBuzz</h1>
        <p>
          हिंदी कहानियों का अपार संग्रह! यहाँ आपको प्रेम, साहस और मनोरंजन से
          भरी रोचक kahani और story in Hindi मिलेंगी। नई-नई कहानियों से लेकर
          क्लासिक hindi kahani और शिक्षाप्रद kahaniyan in Hindi—सब एक ही जगह
          उपलब्ध। आनंद लें इन चुनिंदा stories in hindi का और खो जाइए किस्सों की
          दुनिया में।
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

      {/* ======================= Trending Authors Section ======================= */}
      {authorsToShow.length > 0 && (
        <section className="section trending-authors-section">
          <h2 className="section-title">Trending Authors</h2>
          <div className="authors-row">
            {authorsToShow.map((author, index) => (
              <div key={index} className="author-card">
                <img
                  src={author.image || "/default-author.png"}
                  alt={author.name}
                  className="author-image"
                  loading="lazy"
                />
                <p className="author-name">
                  <span className="author-name-text" title={author.name}>
                    {author.name}
                  </span>
                  <span
                    className="blue-tick"
                    aria-label="Verified Author"
                    title="Verified Author"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Twitter_Verified_Badge.svg"
                      alt="Verified Author"
                      width="16"
                      height="16"
                      aria-hidden="true"
                    />
                  </span>
                </p>

              </div>
            ))}
          </div>
        </section>
      )}

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
        const storiesToShow = expanded ? sectionStories : sectionStories.slice(0, 4);
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
