// src/hooks/useFavorites.js
import { useState, useEffect } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  // Load from localStorage once on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(saved);
  }, []);

  // Toggle favorite (add/remove id)
  function toggleFavorite(id) {
    setFavorites((prev) => {
      let updated;
      if (prev.includes(id)) {
        // remove if already favorite
        updated = prev.filter((fav) => fav !== id);
      } else {
        // add new
        updated = [...prev, id];
      }
      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
  }

  // Check if story is favorite
  function isFavorite(id) {
    return favorites.includes(id);
  }

  return { favorites, toggleFavorite, isFavorite };
}
