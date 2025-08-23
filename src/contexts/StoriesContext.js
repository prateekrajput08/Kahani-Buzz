// src/contexts/StoriesContext.js
import React, { createContext, useState, useEffect } from "react";
import { fetchStoriesAndCategories } from "../dataService";

export const StoriesContext = createContext();

export const StoriesProvider = ({ children }) => {
  const [stories, setStories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStoriesAndCategories()
      .then(({ stories, categories }) => {
        setStories(stories);
        setCategories(categories);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return (
    <StoriesContext.Provider value={{ stories, categories, loading, error }}>
      {children}
    </StoriesContext.Provider>
  );
};
