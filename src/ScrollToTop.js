import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollToTop() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType !== "POP") {  // or remove this condition for all navigations
      // Scroll window to top (optional if other parts scroll)
      window.scrollTo({ top: 0 });
      
      // Scroll the main content container div with class 'left-section' to top
      const mainContentDiv = document.querySelector('.left-section');
      if (mainContentDiv) {
        mainContentDiv.scrollTop = 0;
      }
    }
  }, [location, navigationType]);

  return null;
}
