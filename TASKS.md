# TASKS.md

## Leftover Tasks Based on PRD.md

### 1. Feature Gaps

- [x] **Edit Vibe**: Implement the ability for users to edit existing vibes (rename/change activity name).
- [x] **Delete Vibe**: Implement the ability for users to delete a vibe (remove it and its tracked data for the day).

### 2. UI/UX Improvements

- [x] **Edit/Delete Controls**: Add UI controls (buttons/menus) to each vibe row or card for edit/delete actions.
- [x] **Confirmation Dialogs**: Add confirmation dialogs for destructive actions (e.g., deleting a vibe).
- [x] **Feedback/Toasts**: Show user feedback (success/error toasts) for edit/delete actions.

### 3. Quality of Life

- [ ] **Empty State for Historical Dates**: Ensure empty states/messages are shown for dates with no tracked data.
- [ ] **Accessibility**: Audit the app for accessibility (keyboard navigation, ARIA labels, color contrast).
- [ ] **Mobile Responsiveness**: Double-check all views/components for mobile-friendliness and fix any issues.

### 4. Technical/Code Improvements

- [x] **Refactor Vibe Context**: Ensure Vibe context supports updating and deleting vibes, not just adding.
- [ ] **Unit Tests**: Add tests for core logic (add, edit, delete, time tracking).
- [ ] **Error Boundaries**: Add error boundaries to catch and display UI errors gracefully.

### 5. Documentation

- [ ] **Update README**: Document the new features (edit/delete), and update usage instructions if needed.
- [ ] **Changelog**: Start a simple changelog for future improvements.

---

## Completed/Existing Features (for reference)
- Add new vibes
- Start/stop timers for vibes
- Track time per day
- View data table and time distribution chart
- Date picker for historical data
- Persistent storage (local)
- Responsive UI (base implementation)

---

_Last updated: 2025-04-19_
