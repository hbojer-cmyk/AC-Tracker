# Pre-Flight Briefing (Getting Started Guide) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and integrate an interactive, gamified 6-step "Pre-Flight Briefing" onboarding modal and always-accessible guide for AC-Tracker, seamlessly integrated with the v2.8 refactored codebase.

**Architecture:** Create a standalone, self-contained `src/components/GettingStartedModal.tsx` component that features interactive live controls (live theme preview swatches, scrubber calculation demonstration, and navigation module toggles). Orchestrate clean profile-level persistence in `profiles.ts` (`hasSeenGettingStarted`) and wire up trigger buttons in the top navigation bar, mobile drawer, About page, and Cockpit Settings page.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Lucide icons, Vite.

**Spec:** [docs/superpowers/specs/2026-11-07-preflight-briefing-getting-started-guide-design.md](file:///c:/Users/Alastair/ac-tracker-10/docs/superpowers/specs/2026-11-07-preflight-briefing-getting-started-guide-design.md)

---

## Global Constraints

- Preserve cyber flight-deck glassmorphic aesthetic across all 23 themes.
- Zero TypeScript errors (`npm run build` must succeed with zero unused imports or type warnings).
- Multi-profile safe: returning users and alt profiles are not interrupted with popups; only fresh first-time visits auto-open the guide.
- Always re-playable via top header `"💡 Guide"` button, About page, and Settings page.
- Responsive from 360px mobile viewports up to 4K ultra-wide monitors.
- Update `APP_UPDATED_DATE` in `index.tsx` to current date (`Nov 8, 2026`).

## Review Focus

1. **Auto-Launch Suppression for Existing Pilots:** Existing profiles in `act_profiles` or visitors migrating legacy data must not be forced to see the modal on reload.
2. **Interactive Live Sync:** Selecting a theme inside Step 1 must immediately change the theme of the application (or update active theme state).
3. **Module Toggle Sync:** Toggling modules in Step 3 must update the profile's `enabledViews` preferences.
4. **Scrubber Math Consistency:** Step 2's interactive scrubber demo must reflect Airport City's in-game star threshold formula (`current / target`).
5. **Clean Unmount & Escape Handling:** Pressing Escape, clicking the backdrop, or clicking `"✕ Skip"` / `"Enter Cockpit 🚀"` must close the modal and save the `hasSeenGettingStarted = true` preference.

---

### Task 1: Profile Preference & State Model Integration

**Files:**
- Modify: `profiles.ts`

- [ ] **Step 1: Add `hasSeenGettingStarted` to `ProfilePrefs` interface**
  Add optional `hasSeenGettingStarted?: boolean` to `ProfilePrefs` in `profiles.ts`.
- [ ] **Step 2: Update default preferences in `getDefaultPrefs()`**
  In `getDefaultPrefs()`, default `hasSeenGettingStarted: false` for new profiles.
- [ ] **Step 3: Update `createBlankProfile()` and legacy migration**
  Ensure newly created profiles created from Profile Modal (alt profiles) have `hasSeenGettingStarted: true` so veteran pilots creating an alt profile aren't spammed. Ensure `migrateLegacyData()` sets `hasSeenGettingStarted: true`.
- [ ] **Step 4: Verify TypeScript compilation**
  Run `npm run build` to ensure `profiles.ts` compiles cleanly.

---

### Task 2: Build the `GettingStartedModal.tsx` Component

**Files:**
- Create: `src/components/GettingStartedModal.tsx`

- [ ] **Step 1: Create modal shell and step navigation header**
  Build the glassmorphic modal container with backdrop blur, step progress indicator (Steps 1–6), close / skip button, and keyboard listener (`Escape`, `ArrowLeft`, `ArrowRight`).
- [ ] **Step 2: Implement Slide 1 (Eye Comfort & Theme Swatches)**
  Render the 5 popular theme preview swatches (Stealth Ghost, Mach 3 Stratosphere, Blackbird OLED, Botanical Garden, First Class Suite) with live `onSelectTheme` callback so the user can change their theme immediately.
- [ ] **Step 3: Implement Slide 2 (Log As You Fly & Scrubber Demo)**
  Render explanation that pilots only need to log active flights (not all 536), with an interactive mini-scrubber input (`49 / 300`) demonstrating real-time star and percentage calculations.
- [ ] **Step 4: Implement Slide 3 (Streamline Your Cockpit & Module Toggles)**
  Render interactive switch toggles for `enabledViews` (Map Depot, Fleet Hangar, Missions Depot, 12-Month Calendar) with live `onToggleView` callback.
- [ ] **Step 5: Implement Slide 4 (Category Navigation & Drawer)**
  Explain the category drawer workflow and demonstrate the `[ < ]` sidebar collapse button and Recently Flown quick-bar.
- [ ] **Step 6: Implement Slide 5 (Pilot Backups & Safety)**
  Highlight JSON backup habit in Profile Manager and explain data privacy.
- [ ] **Step 7: Implement Slide 6 (Radar & Secret Weapons)**
  Introduce Lowest Hanging Fruit, Missing Maps radar, and Star Sync Offsets. Render final `"Enter Cockpit 🚀"` completion button.
- [ ] **Step 8: Verify build**
  Run `npm run build` to confirm `GettingStartedModal.tsx` compiles with zero errors.

---

### Task 3: Integrate Briefing into Flight Deck & Top Navigation

**Files:**
- Modify: `index.tsx`

- [ ] **Step 1: Import and wire state for `GettingStartedModal`**
  Add `isGettingStartedOpen` state. On initial load, detect if `!profile.prefs?.hasSeenGettingStarted && !localStorage.getItem('act_has_seen_briefing')` and trigger opening if true.
- [ ] **Step 2: Add `"💡 Guide"` button to Top Desktop Navigation**
  Insert a tactile, responsive `"💡 Guide"` button in the desktop header alongside Theme and Settings buttons.
- [ ] **Step 3: Add `"💡 Guide"` item to Mobile Drawer Switcher**
  Add a guide entry to the mobile navigation menu.
- [ ] **Step 4: Update `APP_UPDATED_DATE`**
  Bump `APP_UPDATED_DATE` to `'Nov 8, 2026'`.
- [ ] **Step 5: Verify build**
  Run `npm run build`.

---

### Task 4: Integrate Triggers in About Page & Settings Page

**Files:**
- Modify: `AboutPage.tsx`
- Modify: `SettingsPage.tsx`

- [ ] **Step 1: Add Pre-Flight Briefing Card in `AboutPage.tsx`**
  Add an interactive avionics card with a `"Launch Pre-Flight Briefing →"` button calling `onOpenGettingStarted`.
- [ ] **Step 2: Add Replay Action in `SettingsPage.tsx`**
  Add a `"Replay Getting Started Briefing"` button under Cockpit Display Settings.
- [ ] **Step 3: Verify build**
  Run `npm run build`.

---

### Task 5: Final Quality Verification & Scratchpad Update

**Files:**
- Modify: `SCRATCHPAD.md`

- [ ] **Step 1: Run comprehensive build verification**
  Run `npm run build` to ensure zero errors and clean bundle output.
- [ ] **Step 2: Update `SCRATCHPAD.md`**
  Move the Getting Started Guide item to the "Implemented / Done" section with completion summary.
