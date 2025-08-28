import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { StoriesContext } from "../contexts/StoriesContext";
import { useFavorites } from "../contexts/FavoritesContext";   // ✅ use global favorites
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import "./Story.css";
import Loader from "../components/Loader";

export default function Story() {import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { StoriesContext } from "../contexts/StoriesContext";
import { useFavorites } from "../contexts/FavoritesContext";   // ✅ use global favorites
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import "./Story.css";
import StoryLoader from "../components/StoryLoader";

export default function Story() {
  const { storyId } = useParams();
  const { stories, loading, error } = useContext(StoriesContext);
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const [categories, setCategories] = useState([]);
  const [latestStories, setLatestStories] = useState([]);
  const [currentTopStoryIndex, setCurrentTopStoryIndex] = useState(0);
  const [categoryImages, setCategoryImages] = useState({});

  const leftSectionRef = useRef(null);
  const rightSectionRef = useRef(null);

  useEffect(() => {
    if (stories.length > 0) {
      // Extract unique categories
      const cats = Array.from(
        new Set(stories.map((s) => s.category).filter(Boolean))
      );
      setCategories(cats);

      // Setup top stories (id 1 to 5)
      setLatestStories(
        stories
          .filter((s) => Number(s.id) >= 1 && Number(s.id) <= 5)
          .sort((a, b) => Number(a.id) - Number(b.id))
      );

      // Map category -> image
      const catImgMap = {};
      cats.forEach((cat) => {
        const match = stories.find(
          (s) =>
            s.category &&
            s.category.toLowerCase() === cat.toLowerCase() &&
            s.image
        );
        catImgMap[cat] =
          (match && match.image) ||
          `https://source.unsplash.com/featured/600x200?${encodeURIComponent(
            cat
          )}`;
      });
      setCategoryImages(catImgMap);
    }
  }, [stories]);

  // Auto slider for Top Stories
  useEffect(() => {
    if (latestStories.length === 0) return;
    const interval = setInterval(() => {
      setCurrentTopStoryIndex((prev) =>
        prev + 1 >= latestStories.length ? 0 : prev + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [latestStories]);

  // Scroll synchronization
  useEffect(() => {
    const leftEl = leftSectionRef.current;
    const rightEl = rightSectionRef.current;
    if (!leftEl || !rightEl) return;

    function handleLeftScroll() {
      const leftScrollTop = leftEl.scrollTop;
      const leftScrollHeight = leftEl.scrollHeight;
      const leftClientHeight = leftEl.clientHeight;
      const leftMaxScroll = leftScrollHeight - leftClientHeight;
      if (leftMaxScroll <= 0) return;

      const scrollProgress = leftScrollTop / leftMaxScroll;

      const rightMaxScroll = rightEl.scrollHeight - rightEl.clientHeight;
      if (rightMaxScroll <= 0) return;

      rightEl.scrollTop = scrollProgress * rightMaxScroll;
    }

    leftEl.addEventListener("scroll", handleLeftScroll);
    return () => leftEl.removeEventListener("scroll", handleLeftScroll);
  }, [stories, categories, latestStories, categoryImages]);

if (loading) return <StoryLoader text="Loading story..." />;
  if (error) return <p>Error: {error.message || error.toString()}</p>;

  const story = stories.find((s) => String(s.id) === String(storyId));
  if (!story) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Story not found</h2>
        <p>
          URL storyId: <b>{storyId}</b>
        </p>
        <p>Available IDs: {stories.map((s) => s.id).join(", ")}</p>
        <Link to="/" style={{ color: "#ff4747" }}>
          Go back to Home
        </Link>
      </div>
    );
  }

  const storyContent =
    story.Content ?? story.content ?? story.description ?? "No content available.";
  const audioSrc = story.Audio ?? story.audio ?? "";

  const relatedStories = stories
    .filter(
      (s) =>
        s.category &&
        s.category === story.category &&
        String(s.id) !== String(story.id)
    )
    .slice(0, 2);

  return (
    <main className="story-page-container no-right-section-mobile">
      <section className="left-section" ref={leftSectionRef}>
        <article className="story-detail-card">
          <h1 className="story-detail-title">{story.title || "Untitled"}</h1>

          <div className="story-detail-image-container">
            <img
              src={
                story.image ||
                "https://github.com/prateekrajput08/Kahani-Buzz/blob/main/public/placeholder.png?raw=true"
              }
              alt={story.title}
              className="story-detail-image"
            />
            {story.category && (
              <span className="story-detail-category">{story.category}</span>
            )}
          </div>

          {audioSrc && (
            <div className="story-audio-player">
              <audio controls preload="none">
                <source src={audioSrc} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {/* Title below image + Heart */}
          <p
            className="story-title-below-image"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            {story.title || "Untitled"}
            <FontAwesomeIcon
              icon={isFavorite(story.id) ? solidHeart : regularHeart}
              onClick={() => toggleFavorite(story.id)}
              style={{
                cursor: "pointer",
                fontSize: "1.3em",
                color: isFavorite(story.id) ? "red" : "#ccc",
              }}
            />
          </p>

          <div className="story-full-content" style={{ whiteSpace: "pre-wrap" }}>
            {storyContent}
          </div>
        </article>

        {relatedStories.length > 0 && (
          <div className="related-stories">
            <h3>Related Stories</h3>
            <div className="related-stories-container">
              {relatedStories.map((r) => (
                <Link
                  to={`/story/${r.id}`}
                  key={r.id}
                  className="related-story-box"
                  title={r.title}
                >
                  <img
                    src={
                      r.image ||
                      "https://github.com/prateekrajput08/Kahani-Buzz/blob/main/public/placeholder.png?raw=true"
                    }
                    alt={r.title}
                    className="related-story-image"
                  />
                  <div className="related-story-title">{r.title}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      <aside className="right-section" ref={rightSectionRef}>
        <div className="all-categories">
          <h3>All Categories</h3>
          <div className="categories-list">
            {categories.map((cat, idx) => (
              <Link
                to={`/category/${cat}`}
                key={idx}
                className="category-full-image-link"
                title={cat}
              >
                <img
                  src={categoryImages[cat]}
                  alt={cat}
                  className="category-full-image"
                />
                <span className="category-overlay-fulltext">{cat}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="top-stories-slider">
          <h3>Top Stories</h3>
          {latestStories.length === 0 ? (
            <p>No top stories available.</p>
          ) : (
            <Link
              to={`/story/${latestStories[currentTopStoryIndex].id}`}
              className="top-story-single-box fade-in-out"
              title={latestStories[currentTopStoryIndex].title}
              key={latestStories[currentTopStoryIndex].id}
            >
              <img
                src={
                  latestStories[currentTopStoryIndex].image ||
                  "https://github.com/prateekrajput08/Kahani-Buzz/blob/main/public/placeholder.png?raw=true"
                }
                alt={latestStories[currentTopStoryIndex].title}
                className="top-story-single-image"
              />
              <div className="top-story-single-title">
                {latestStories[currentTopStoryIndex].title}
              </div>
            </Link>
          )}
        </div>
      </aside>
    </main>
  );
}

  const { storyId } = useParams();
  const { stories, loading, error } = useContext(StoriesContext);
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const [categories, setCategories] = useState([]);
  const [latestStories, setLatestStories] = useState([]);
  const [currentTopStoryIndex, setCurrentTopStoryIndex] = useState(0);
  const [categoryImages, setCategoryImages] = useState({});

  const leftSectionRef = useRef(null);
  const rightSectionRef = useRef(null);

  useEffect(() => {
    if (stories.length > 0) {
      // Extract unique categories
      const cats = Array.from(
        new Set(stories.map((s) => s.category).filter(Boolean))
      );
      setCategories(cats);

      // Setup top stories (id 1 to 5)
      setLatestStories(
        stories
          .filter((s) => Number(s.id) >= 1 && Number(s.id) <= 5)
          .sort((a, b) => Number(a.id) - Number(b.id))
      );

      // Map category -> image
      const catImgMap = {};
      cats.forEach((cat) => {
        const match = stories.find(
          (s) =>
            s.category &&
            s.category.toLowerCase() === cat.toLowerCase() &&
            s.image
        );
        catImgMap[cat] =
          (match && match.image) ||
          `https://source.unsplash.com/featured/600x200?${encodeURIComponent(
            cat
          )}`;
      });
      setCategoryImages(catImgMap);
    }
  }, [stories]);

  // Auto slider for Top Stories
  useEffect(() => {
    if (latestStories.length === 0) return;
    const interval = setInterval(() => {
      setCurrentTopStoryIndex((prev) =>
        prev + 1 >= latestStories.length ? 0 : prev + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [latestStories]);

  // Scroll synchronization
  useEffect(() => {
    const leftEl = leftSectionRef.current;
    const rightEl = rightSectionRef.current;
    if (!leftEl || !rightEl) return;

    function handleLeftScroll() {
      const leftScrollTop = leftEl.scrollTop;
      const leftScrollHeight = leftEl.scrollHeight;
      const leftClientHeight = leftEl.clientHeight;
      const leftMaxScroll = leftScrollHeight - leftClientHeight;
      if (leftMaxScroll <= 0) return;

      const scrollProgress = leftScrollTop / leftMaxScroll;

      const rightMaxScroll = rightEl.scrollHeight - rightEl.clientHeight;
      if (rightMaxScroll <= 0) return;

      rightEl.scrollTop = scrollProgress * rightMaxScroll;
    }

    leftEl.addEventListener("scroll", handleLeftScroll);
    return () => leftEl.removeEventListener("scroll", handleLeftScroll);
  }, [stories, categories, latestStories, categoryImages]);

  if (loading) return <Loader text="Loading stories..." />;
  if (error) return <p>Error: {error.message || error.toString()}</p>;

  const story = stories.find((s) => String(s.id) === String(storyId));
  if (!story) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Story not found</h2>
        <p>
          URL storyId: <b>{storyId}</b>
        </p>
        <p>Available IDs: {stories.map((s) => s.id).join(", ")}</p>
        <Link to="/" style={{ color: "#ff4747" }}>
          Go back to Home
        </Link>
      </div>
    );
  }

  const storyContent =
    story.Content ?? story.content ?? story.description ?? "No content available.";
  const audioSrc = story.Audio ?? story.audio ?? "";

  const relatedStories = stories
    .filter(
      (s) =>
        s.category &&
        s.category === story.category &&
        String(s.id) !== String(story.id)
    )
    .slice(0, 2);

  return (
    <main className="story-page-container no-right-section-mobile">
      <section className="left-section" ref={leftSectionRef}>
        <article className="story-detail-card">
          <h1 className="story-detail-title">{story.title || "Untitled"}</h1>

          <div className="story-detail-image-container">
            <img
              src={
                story.image ||
                "https://github.com/prateekrajput08/Kahani-Buzz/blob/main/public/placeholder.png?raw=true"
              }
              alt={story.title}
              className="story-detail-image"
            />
            {story.category && (
              <span className="story-detail-category">{story.category}</span>
            )}
          </div>

          {audioSrc && (
            <div className="story-audio-player">
              <audio controls preload="none">
                <source src={audioSrc} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {/* Title below image + Heart */}
          <p
            className="story-title-below-image"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            {story.title || "Untitled"}
            <FontAwesomeIcon
              icon={isFavorite(story.id) ? solidHeart : regularHeart}
              onClick={() => toggleFavorite(story.id)}
              style={{
                cursor: "pointer",
                fontSize: "1.3em",
                color: isFavorite(story.id) ? "red" : "#ccc",
              }}
            />
          </p>

          <div className="story-full-content" style={{ whiteSpace: "pre-wrap" }}>
            {storyContent}
          </div>
        </article>

        {relatedStories.length > 0 && (
          <div className="related-stories">
            <h3>Related Stories</h3>
            <div className="related-stories-container">
              {relatedStories.map((r) => (
                <Link
                  to={`/story/${r.id}`}
                  key={r.id}
                  className="related-story-box"
                  title={r.title}
                >
                  <img
                    src={
                      r.image ||
                      "https://github.com/prateekrajput08/Kahani-Buzz/blob/main/public/placeholder.png?raw=true"
                    }
                    alt={r.title}
                    className="related-story-image"
                  />
                  <div className="related-story-title">{r.title}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      <aside className="right-section" ref={rightSectionRef}>
        <div className="all-categories">
          <h3>All Categories</h3>
          <div className="categories-list">
            {categories.map((cat, idx) => (
              <Link
                to={`/category/${cat}`}
                key={idx}
                className="category-full-image-link"
                title={cat}
              >
                <img
                  src={categoryImages[cat]}
                  alt={cat}
                  className="category-full-image"
                />
                <span className="category-overlay-fulltext">{cat}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="top-stories-slider">
          <h3>Top Stories</h3>
          {latestStories.length === 0 ? (
            <p>No top stories available.</p>
          ) : (
            <Link
              to={`/story/${latestStories[currentTopStoryIndex].id}`}
              className="top-story-single-box fade-in-out"
              title={latestStories[currentTopStoryIndex].title}
              key={latestStories[currentTopStoryIndex].id}
            >
              <img
                src={
                  latestStories[currentTopStoryIndex].image ||
                  "https://github.com/prateekrajput08/Kahani-Buzz/blob/main/public/placeholder.png?raw=true"
                }
                alt={latestStories[currentTopStoryIndex].title}
                className="top-story-single-image"
              />
              <div className="top-story-single-title">
                {latestStories[currentTopStoryIndex].title}
              </div>
            </Link>
          )}
        </div>
      </aside>
    </main>
  );
}

