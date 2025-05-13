# Product Requirements Document (PRD)

## Project: Vibe Timer (Time Tracker)

---

## 1. Purpose
Vibe Timer is a web-based time tracking application that helps users monitor and analyze how they spend their time across different activities, referred to as "vibes". The goal is to provide users with insights into their daily time distribution and help them cultivate better habits or simply understand their routines.

## 2. Target Audience
- Individuals looking to track their time spent on various activities (work, study, relaxation, etc.)
- Productivity enthusiasts
- Anyone interested in self-improvement through time analytics

## 3. Key Features
- **Add/Edit/Delete Vibes:** Users can define custom activities (vibes) they want to track.
- **Start/Stop Timer:** Users can start and stop timers for each vibe to track time spent.
- **Daily Tracking:** Time is tracked on a per-day basis, allowing users to review their daily habits.
- **Data Table:** A summary table displays time spent on each vibe for the selected day.
- **Time Distribution Chart:** Visual representation (pie chart) of time spent on each vibe for the day.
- **Date Picker:** Users can select different dates to view historical data.
- **Persistent Cloud Storage:** All vibe and timer data is stored and synced in real time with Supabase, ensuring persistence across devices and sessions.
- **Responsive UI:** Modern, mobile-friendly interface.

## 4. Technical Requirements
- **Frontend:** React (TypeScript), Vite, shadcn-ui, Tailwind CSS
- **State Management:** React Context API
- **Charting:** recharts library for time distribution visualization
- **Storage:** Supabase (cloud database, replaces local storage)
- **Other:** Uses modern component libraries for UI/UX

## 5. User Stories
- As a user, I want to add new vibes so I can track different activities, and have them saved to the cloud.
- As a user, I want to start and stop a timer for a selected vibe, and know that my progress is saved even if I reload or switch devices.
- As a user, I want to see how much time I spent on each vibe today, with data always up-to-date from the cloud.
- As a user, I want to view my vibe time distribution in a chart.
- As a user, I want to select a date to view my past vibe data.
- As a user, I want the data to persist even if I close and reopen the app.

## 6. Non-Functional Requirements
- The app should load quickly and be responsive on all devices.
- Data should be stored securely on the user's device (no backend required).
- The UI should be intuitive and visually appealing.

## 7. Success Metrics
- Users can successfully add, edit, and delete vibes.
- Users can accurately track and view their time data.
- Visualizations and tables update in real-time as the user interacts.
- High user satisfaction with UX and performance.

## 8. Out of Scope
- No user authentication or cloud sync (local-only data storage)
- No advanced analytics (beyond daily time distribution)
- No integrations with external calendars or productivity tools (future consideration)

---

_Last updated: 2025-04-19_
