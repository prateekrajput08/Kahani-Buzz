import axios from "axios";

// Access environment variables as React expects
const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const API_KEY = process.env.REACT_APP_API_KEY;
const RANGE = process.env.REACT_APP_RANGE;

export async function fetchStoriesAndCategories() {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    const res = await axios.get(url);

    const rows = res.data.values;
    if (!rows || rows.length < 2) return { stories: [], categories: [], homepageSections: [] };

    const headers = rows[0].map(h => h.toLowerCase());
    const idIndex = headers.indexOf("id");
    if (idIndex === -1) throw new Error("No 'id' column found in the sheet");

    const stories = rows.slice(1)
      .filter(row => row.length > 0 && row[idIndex])
      .map(row => {
        let story = {};
        headers.forEach((col, i) => {
          story[col] = (row[i] || "").toString().trim();
        });
        story.id = Number(story.id);
        return story;
      });

    // Debug: Log story with ID 1
    console.log("Story with ID 1:", stories.find(s => s.id === 1));

    // Extract categories and homepage sections
    const categoriesSet = new Set();
    const homepageSectionsSet = new Set();

    stories.forEach(s => {
      if (s.category) categoriesSet.add(s.category);
      if (s.homepage_section && s.homepage_section.trim() !== "") {
        s.homepage_section.split(",").map(sec => sec.trim()).forEach(secName => {
          if (secName) homepageSectionsSet.add(secName);
        });
      }
    });

    return {
      stories,
      categories: Array.from(categoriesSet),
      homepageSections: Array.from(homepageSectionsSet)
    };
  } catch (err) {
    console.error("Error fetching stories and categories:", err);
    return { stories: [], categories: [], homepageSections: [] };
  }
}
