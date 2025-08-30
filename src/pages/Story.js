// Story.js
import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { StoriesContext } from "../contexts/StoriesContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as solidHeart,
  faHeart as regularHeart,
  faEnvelope,
  faShareAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  faTwitter,
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faPinterestP,
  faTelegramPlane,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import "./Story.css";
import StoryLoader from "../components/StoryLoader";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

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
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState(null);

  useEffect(() => {
    if (stories.length > 0) {
      const cats = Array.from(
        new Set(stories.map((s) => s.category).filter(Boolean))
      );
      setCategories(cats);
      setLatestStories(
        stories
          .filter((s) => Number(s.id) >= 1 && Number(s.id) <= 5)
          .sort((a, b) => Number(a.id) - Number(b.id))
      );
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

  useEffect(() => {
    if (latestStories.length === 0) return;
    const interval = setInterval(() => {
      setCurrentTopStoryIndex((prev) =>
        prev + 1 >= latestStories.length ? 0 : prev + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [latestStories]);

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

  useEffect(() => {
    if (!storyId) return;
    setCommentsLoading(true);
    setCommentsError(null);
    const q = query(
      collection(db, "comments"),
      where("storyId", "==", storyId),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loadedComments = [];
        snapshot.forEach((doc) =>
          loadedComments.push({ id: doc.id, ...doc.data() })
        );
        setComments(loadedComments);
        setCommentsLoading(false);
      },
      (err) => {
        setCommentsError("Failed to load comments: " + err.message);
        setCommentsLoading(false);
      }
    );
    return () => unsubscribe();
  }, [storyId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const trimmed = commentInput.trim();
    if (!trimmed) return;
    try {
      await addDoc(collection(db, "comments"), {
        storyId,
        text: trimmed,
        createdAt: serverTimestamp(),
      });
      setCommentInput("");
    } catch (err) {
      setCommentsError("Failed to submit comment: " + err.message);
    }
  };

  function formatDate(timestamp) {
    if (!timestamp) return "";
    const dateObj = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return `${String(dateObj.getDate()).padStart(2, "0")}/${String(
      dateObj.getMonth() + 1
    ).padStart(2, "0")}/${dateObj.getFullYear()}`;
  }
  function formatTime(timestamp) {
    if (!timestamp) return "";
    const dateObj = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return `${String(dateObj.getHours()).padStart(2, "0")}:${String(
      dateObj.getMinutes()
    ).padStart(2, "0")}`;
  }

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
  const pageUrl = window.location.href;

  function handleNativeShare() {
    if (navigator.share) {
      navigator
        .share({
          title: story.title,
          url: pageUrl,
        })
        .catch(() => {});
    } else {
      window.open(pageUrl, "_blank");
    }
  }

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
          <p
            className="story-title-below-image"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {story.title || "Untitled"}
            <FontAwesomeIcon
              icon={isFavorite(story.id) ? solidHeart : regularHeart}
              onClick={() => toggleFavorite(story.id)}
              style={{
                cursor: "pointer",
                fontSize: "1.3em",
                color: isFavorite(story.id) ? "#ff4747" : "#ccc",
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
        <div className="sharing-section" style={{ marginTop: "2rem" }}>
          <h3>Share this story</h3>
          <div>
            <button
              className="share-plus-button"
              onClick={handleNativeShare}
              title="System Share"
              aria-label="System Share"
            >
              <FontAwesomeIcon icon={faShareAlt} />
            </button>
            <a
              href={`https://twitter.com/share?url=${encodeURIComponent(
                pageUrl
              )}&text=${encodeURIComponent(story.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on Twitter"
              className="social-icon twitter"
              aria-label="Share on Twitter"
              style={{ color: "#1DA1F2" }}
            >
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                pageUrl
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on Facebook"
              className="social-icon facebook"
              aria-label="Share on Facebook"
              style={{ color: "#1877F2" }}
            >
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a
              href={`https://www.instagram.com/?url=${encodeURIComponent(pageUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on Instagram"
              className="social-icon instagram"
              aria-label="Share on Instagram"
              style={{ color: "#E4405F" }}
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                pageUrl
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on LinkedIn"
              className="social-icon linkedin"
              aria-label="Share on LinkedIn"
              style={{ color: "#0A66C2" }}
            >
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>
            <a
              href={`https://telegram.me/share/url?url=${encodeURIComponent(
                pageUrl
              )}&text=${encodeURIComponent(story.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on Telegram"
              className="social-icon telegram"
              aria-label="Share on Telegram"
              style={{ color: "#0088CC" }}
            >
              <FontAwesomeIcon icon={faTelegramPlane} />
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                story.title + " " + pageUrl
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on WhatsApp"
              className="social-icon whatsapp"
              aria-label="Share on WhatsApp"
              style={{ color: "#25D366" }}
            >
              <FontAwesomeIcon icon={faWhatsapp} />
            </a>
          </div>
        </div>
        <div className="comments-section" style={{ marginTop: "2rem" }}>
          <h3>Comments</h3>
          {commentsError && <p style={{ color: "red" }}>{commentsError}</p>}
          <form onSubmit={handleCommentSubmit}>
            <textarea
              rows={3}
              placeholder="Leave a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />
            <button type="submit">Submit</button>
          </form>
          {commentsLoading ? (
            <p>Loading comments...</p>
          ) : comments.length === 0 ? (
            <p>No comments yet. Be the first to comment!</p>
          ) : (
            <div className="comments-list">
              {comments.map((c) => (
                <div key={c.id}>
                  <div className="timestamp">
                    <div>{formatDate(c.createdAt)}</div>
                    <div>{formatTime(c.createdAt)}</div>
                  </div>
                  {c.text}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <aside className="right-section" ref={rightSectionRef}>
        <div className="all-categories">
          <h3>All Categories</h3>
          <div className="categories-list">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                to={`/category/${cat}`}
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

