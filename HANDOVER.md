# Project Handover & Recent Updates

This document summarizes the recent changes and features implemented in the application to refine the user experience, typography, and mobile performance.

## 1. Unified Typography
- **Font Family Swapped:** Removed `Cinzel` and `Inter`/`EB Garamond` entirely. The project now uses **Cormorant Garamond** across the board to ensure a cohesive, classical aesthetic.
- **Styling Configuration:**
  - **Headings** (e.g., "Enter the Temple", "Awakening", "Om Namah Shivaya") use `font-weight: 600` while preserving the existing gold gradients and letter-spacing.
  - **Subtext & Body** (e.g., "A journey into the divine", "Peace eternal", loading percentages, and descriptions) use `font-weight: 300` and `font-style: italic` for a softer, elegant touch.

## 2. Audio & Autoplay Compliance
- **Audio Consent Modal:** Built a dark/gold themed overlay that appears immediately upon entry, prompting the user to either "Enter with Sound" or "Enter in Silence".
- **iOS/Safari Fix:** By requiring a user click to start the experience, the background flute audio (`flute.play()`) is initialized synchronously within a user interaction event. This effectively complies with strict mobile browser autoplay policies that were previously causing the audio to fail on Vercel deployments.
- **Bell Trigger Calibration:** The gate-opening bell sound effect (`bell.mp3`) was firing slightly early. The `ScrollTrigger` was adjusted from `55%` to `60%` so it perfectly synchronizes with the frame where the golden gates fully open.

## 3. Scroll Experience & Mobile Tuning
- **Lenis Optimizations:** To prevent jumpy scroll-scrubbing on touch devices, Lenis initialization parameters were updated. Added `syncTouch: true` and lowered `touchMultiplier` to `1.5` to provide a smoother, more deliberate scrolling cadence on phones.
- **End-of-Journey Elements:** 
  - Added a closing blessing: *"May light guide your path"*.
  - Implemented an animated **"Begin Again"** button. When clicked, it triggers `lenis.scrollTo(0)` to smoothly rewind the experience back to the very top.
