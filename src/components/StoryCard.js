import React from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../contexts/FavoritesContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";

export default function StoryCard({ story, clickableBox = false }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const storyId = story.id ? story.id : "story";

  const cardContent = (
    <>
      <div className="story-img-container">
        <img
          src={
            story.image ||
            "https://github.com/prateekrajput08/Kahani-Buzz/blob/main/public/placeholder.png?raw=true"
          }
          alt={story.title}
          className="story-img"
        />
        <span className="story-genre">{story.category}</span>
      </div>
      <div className="story-info">
        <h3
          className="story-title"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Title part with truncation */}
          <span
            style={{
              flex: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginRight: "8px",
            }}
            title={story.title} // full title on hover
          >
            {story.title}
          </span>

          {/* Heart icon stays visible */}
          <FontAwesomeIcon
            icon={isFavorite(storyId) ? solidHeart : regularHeart}
            onClick={(e) => {
              e.preventDefault(); // Prevent link navigation
              toggleFavorite(storyId);
            }}
            style={{
              cursor: "pointer",
              fontSize: "1.3em",
              color: isFavorite(storyId) ? "red" : "#ccc",
              flexShrink: 0, // do not shrink heart
            }}
          />
        </h3>

        <p className="story-desc">{story.description}</p>
      </div>
    </>
  );

  if (clickableBox) {
    return (
      <Link
        to={`/story/${storyId}`}
        className="story-card"
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "block",
          height: "100%",
          width: "100%",
          cursor: "pointer",
        }}
      >
        {cardContent}
      </Link>
    );
  }

  return <div className="story-card">{cardContent}</div>;
}
