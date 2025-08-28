import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchStoriesAndCategories } from "../dataService";
import "./Category.css";
import CategoryLoader from "../components/CategoryLoader";

export default function Category() {
  const { categoryName } = useParams();
  const [stories, setStories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [latestStories, setLatestStories] = useState([]);
  const [currentTopStoryIndex, setCurrentTopStoryIndex] = useState(0);
  const [categoryImages, setCategoryImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refs for scroll sync
  const leftSectionRef = useRef(null);
  const rightSectionRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    fetchStoriesAndCategories()
      .then(({ stories, categories }) => {
        setCategories(categories);
        const filteredStories = stories.filter(
          (story) => story.category && story.category.toLowerCase() === categoryName.toLowerCase()
        );
        setStories(filteredStories);

        setLatestStories(
          stories
            .filter((s) => Number(s.id) >= 1 && Number(s.id) <= 5)
            .sort((a, b) => Number(a.id) - Number(b.id))
        );

        const catImgMap = {};
        categories.forEach((cat) => {
          const match = stories.find(
            (s) => s.category && s.category.toLowerCase() === cat.toLowerCase() && s.image
          );
          catImgMap[cat] =
            (match && match.image) ||
            `https://source.unsplash.com/featured/600x200?${encodeURIComponent(cat)}`;
        });
        setCategoryImages(catImgMap);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [categoryName]);

  useEffect(() => {
    if (latestStories.length === 0) return;
    const interval = setInterval(() => {
      setCurrentTopStoryIndex((prev) => (prev + 1 >= latestStories.length ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [latestStories]);

  // Scroll sync logic - continuous proportional sync
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

      // Calculate scroll progress 0 to 1
      const scrollProgress = leftScrollTop / leftMaxScroll;

      const rightMaxScroll = rightEl.scrollHeight - rightEl.clientHeight;
      if (rightMaxScroll <= 0) return;

      rightEl.scrollTop = scrollProgress * rightMaxScroll;
    }

    leftEl.addEventListener("scroll", handleLeftScroll);

    return () => {
      leftEl.removeEventListener("scroll", handleLeftScroll);
    };
  }, [stories, categories, latestStories, categoryImages]);

  if (loading) return <CategoryLoader text="Loading stories..." />;
  if (error) return <p>Error loading stories: {error.message || error.toString()}</p>;

  return (
    <main className="category-page-container no-right-section-mobile">
      <section className="left-section" ref={leftSectionRef}>
        {stories.length === 0 ? (
          <p>No stories found in this category.</p>
        ) : (
          stories.map((story, idx) => (
            <Link
              to={`/story/${story.id}`}
              key={idx}
              className="story-card-horizontal"
              title={story.title}
            >
              <div className="story-image-container" style={{ position: "relative" }}>
                <img
                  src={
                    story.image ||
                    "https://github.com/prateekrajput08/Kahani-Buzz/blob/main/public/placeholder.png?raw=true"
                  }
                  alt={story.title}
                  className="story-image"
                />
                <span className="category-badge">{story.category}</span>
              </div>
              <div className="story-content">
                <h2 className="story-title" style={{ fontSize: "18px", fontWeight: "600" }}>
                  {story.title}
                </h2>
                <p className="story-description" style={{ fontSize: "12px" }}>
                  {story.description}
                </p>
              </div>
            </Link>
          ))
        )}
      </section>

      <aside className="right-section" ref={rightSectionRef}>
        <div className="all-categories">
          <h3>All Categories</h3>
          <div className="categories-list">
            {categories.map((cat, idx) => (
              <Link to={`/category/${cat}`} key={idx} className="category-full-image-link" title={cat}>
                <img src={categoryImages[cat]} alt={cat} className="category-full-image" />
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
              <div className="top-story-single-title">{latestStories[currentTopStoryIndex].title}</div>
            </Link>
          )}
        </div>
      </aside>
    </main>
  );
}
