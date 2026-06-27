# Reading Tracker

Welcome to my Reading Tracker web application! This project was built to demonstrate component-driven state management, real-time API integrations, custom hooks, and dynamic list processing.

This is a clean, single-page reading application featuring:
- **API Search Integration:** Asynchronously queries and fetches book titles, authors, publication years, and cover artwork from the public Open Library API in real time.
- **Status & Rating Workflows:** Organizes books by "To Read", "Reading", and "Finished" statuses, enabling an interactive 1-to-5 star rating popover for finished books.
- **Dynamic Filtering & Sorting:** Updates library lists instantly via reading status filters and sorting controls (by title, author, or date added) with live average rating calculations.
- **Polished Empty States:** Displays responsive, contextual empty-state panels with illustrations and actions for empty libraries, unmatched filters, and search errors.
- **Persistent State:** Saves and retrieves the user's book collection and ratings locally using browser `localStorage` to preserve library records across sessions.

It is built using React, Vite, TypeScript, and Tailwind CSS (featuring a warm-toned dark/light mode toggle with custom transition animations).
