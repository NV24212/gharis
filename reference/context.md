# Admin Panel UI/UX Context and Logic

This document explains the design principles, component logic, and micro-interactions that create the user experience of the admin panel.

## 1. Design System and Core Styling

The admin panel's UI is built on a dark theme with a consistent and well-defined design system. The core elements are defined in `frontend/tailwind.config.js` and `frontend/src/styles/index.css`.

### Color Palette (`tailwind.config.js`)
The color scheme is minimalistic and focused on readability in a dark environment.
- **`brand.background` (`#1a1a1a`):** The primary background color, a dark gray.
- **`brand.primary` (`#ffffff`):** White, used for primary text and important UI elements.
- **`brand.secondary` (`#a0a0a0`):** A light gray for secondary text and icons, providing a clear visual hierarchy.
- **`brand.border` (`rgba(255, 255, 255, 0.1)`):** A translucent white for borders, creating subtle separation without harsh lines.

### Typography (`index.css`)
- **Font:** A custom Arabic font named **'PNU'** is used, which gives the interface a unique and localized feel.
- **Direction:** The entire layout is set to **Right-to-Left (RTL)** in the `AdminLayout.jsx` component (`dir="rtl"`), which is crucial for the Arabic language UI.

### Sizing and Spacing
- **Corner Rounding:** A consistent corner rounding of **`20px`** (`rounded-20`) is used for modals, cards, and other major UI containers, giving the interface a soft and modern look.
- **Shadows:** A subtle `box-shadow` (`shadow-card`) is used to lift elements like cards and modals off the background, creating a sense of depth.

---

## 2. Layout and Structure

The admin panel uses a responsive sidebar layout managed by `AdminLayout.jsx`.

- **Desktop Sidebar:** The sidebar is collapsible, transitioning between a full-width (`w-64`) and a collapsed, icon-only state (`w-20`). This is controlled by the `isDesktopSidebarOpen` state. The transition is animated using Tailwind's `transition-all duration-300`.
- **Mobile Sidebar:** On smaller screens, the sidebar is hidden and can be toggled as a slide-out panel (`MobileAdminSidebar.jsx`). It uses a backdrop overlay to dim the main content and locks body scroll to prevent interaction with the page behind it. The slide-in/out animation is achieved with `transform: translateX()`.
- **Content Area:** The main content is displayed within the `<Outlet />` component, with padding to ensure it doesn't touch the screen edges.

---

## 3. Reusable Components and UI Patterns

The UI is built with a set of reusable components that ensure consistency.

### Modals (`Modal.jsx`, `ConfirmationModal.jsx`)
- **Base Modal (`Modal.jsx`):** This is the foundation for all dialogs. It includes a backdrop, a container with the standard `rounded-20` border-radius, a title bar with a close button, and a content area.
- **Confirmation Modal (`ConfirmationModal.jsx`):** A specialized version of the base modal used for destructive actions like deletion. It features an alert icon and standardized "Cancel" and "Delete" buttons.

### Cards (`StudentCard.jsx`, `AdminCard.jsx`, `WeekCard.jsx`)
Cards are used to display lists of items. They share a common style:
- A semi-transparent black background (`bg-black/20`).
- A subtle border (`border-brand-border`).
- A hover effect that highlights the border and slightly lifts the card (`hover:border-brand-primary/50 hover:-translate-y-1`), providing visual feedback.

### Feedback Components
- **`LoadingScreen.jsx`:** Provides visual feedback during data fetching. It can be used as a full-screen overlay or within a component. The logo has a subtle pulse animation (`animate-pulse-subtle`).
- **Status Messages:** Success and error messages are displayed in styled banners with distinct colors (green for success, red for error).

---

## 4. Micro-animations and User Experience

Subtle animations are used throughout the UI to enhance the user experience. These are defined in `tailwind.config.js`.

### Modal Animation
- **`modal-in`:** When a modal opens, it animates in with a slight upward translation and a scale-up effect (`translateY(20px) scale(0.98)` to `translateY(0) scale(1)`), making the appearance smooth and not jarring. This is defined by the `modalIn` keyframe.

### Deletion Animation
- **`fade-out`:** When an item (like a class) is deleted, it fades out and scales down slightly (`opacity: 0, transform: "scale(0.95)"`). This provides immediate visual confirmation of the deletion before the item is removed from the DOM.

### Button Interactions
- **Active State:** Buttons have a `transform active:scale-95` class, which makes them slightly smaller when clicked, giving a tactile "press" effect.

### Sidebar Icons and Text
- **Collapsing Sidebar:** When the desktop sidebar collapses, the text labels for the navigation links fade out (`transition-opacity duration-200`) before the container shrinks, preventing the text from being abruptly cut off. When expanding, the text has a slight delay (`delay-200`) before appearing, making the animation feel more polished.

## 5. Logic and Interactivity

### Dialog Logic
- **Opening/Closing Modals:** The state for modals (`isModalOpen`, `isStudentModalOpen`, etc.) is managed within the parent component (e.g., `UserManagement.jsx`). The modal components are rendered conditionally based on this state.
- **Form Submission:** When submitting a form within a modal, a `isSubmitting` state is used to disable the submit button and show a loading spinner (`Loader2`). This prevents duplicate submissions and provides clear feedback to the user.

### State Management
- **React Context:** The `AuthContext` is used to manage the authenticated user's state across the application, making user data and permissions readily available to all components.
- **Local State (`useState`, `useEffect`):** Components manage their own state for data fetching, form inputs, and UI toggles. The `useEffect` hook is used to fetch data when a component mounts or when dependencies change.
