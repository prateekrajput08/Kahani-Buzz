// File: src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./ScrollToTop";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Story from "./pages/Story";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import { StoriesProvider } from "./contexts/StoriesContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import "./styles.css";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <StoriesProvider>
        <FavoritesProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryName" element={<Category />} />
            <Route path="/story/:storyId" element={<Story />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            {/* Add more routes as needed */}
          </Routes>
        </FavoritesProvider>
      </StoriesProvider>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
