# Design Document: Pre-Flight Briefing (Getting Started Guide) for AC-Tracker

- **Date:** Nov 7, 2026
- **Status:** Draft / In Review
- **Target App Version:** AC-Tracker v2.8 (or v2.7.6)
- **Author:** Antigravity & Commander Alastair

---

## 1. Intent & The "Why"
AC-Tracker is a rich flight tracking suite with 536 destinations, 23 themes, multiple avionics modules (Fleet Hangar, Maps Depot, Missions Depot, Telemetry & Stats, Event Calendars), and granular flight counters. 

However, when a new player opens the application for the first time, they face immediate cognitive overload:
- 536 destination rows with unfamiliar flight and map scrubbers.
- 8 separate navigation modules.
- Multiple competing banners, category drawers, and filter bars.

Players often assume they must transcribe all 500+ game routes before the tool is useful, creating hesitation and friction. The **Pre-Flight Briefing** is an interactive, gamified onboarding experience that welcomes the pilot, sets realistic expectations ("log only what you fly today"), provides direct tactile controls to customize their workspace before entering the cockpit, and teaches them how to unlock the app's full potential.

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
- **Eliminate First-Load Panic:** Immediately explain that logging can be done in bite-sized increments (e.g. 1–3 active destinations).
- **Interactive First-Time Configuration:** Allow pilots to pick their preferred theme and hide advanced modules (Maps, Missions, Hangar) *directly inside the briefing* without needing to hunt through Settings.
- **Explain Core Mechanics:** Clarify the in-game flight scrubber (`Current Star Flights / Star Milestone Target`) vs `Total Flights`.
- **Cultivate Safe Habits:** Teach pilots early on where and how to back up their profile JSON data.
- **Always Re-playable:** Accessible at any time via a dedicated button in the top navigation bar and on the About & Help page.

### Non-Goals
- **Replacing Detailed FAQ:** The comprehensive Airport City wiki guides, drop rate mathematics, and detailed star formula explanations remain in the About page and game documentation.
- **Forced Lock-In:** The briefing must never trap or force a player into mandatory multi-step tutorials before letting them use the app; it must be skippable in a single click.

### Anti-Goals
- **Annoying Persistent Popups:** The modal must not reappear on every page reload once dismissed or completed.
- **Intrusive Screen-Blocking Spotlights:** No fragile DOM coordinate spotlights or disabled overlays that lock the interface.

---

## 3. Constraints
- **Aesthetic:** Match the cyber flight-deck aesthetic (dark glassmorphic panels, glowing cyan/amber accents, tactile buttons, smooth transitions).
- **Responsive:** Must scale fluidly from mobile displays (360px) to split-screen half-monitor windows (700px–960px) and wide 4K screens.
- **Type Safety & Build Cleanliness:** Zero TypeScript errors; passes `npm run build` and `npm run lint`.
- **Multi-Profile Persistence:** The onboarding completion flag (`hasSeenGettingStarted?: boolean`) must persist cleanly within each pilot's profile preferences (`ProfilePrefs`), ensuring new profiles can see it while existing profiles are not interrupted unless they manually open it.

---

## 4. Approaches Considered

### Approach 1: Interactive "Pre-Flight Briefing" Modal / Carousel (Selected)
- A focused glassmorphic modal with 6 bite-sized slides featuring high-contrast icons, bold advice, and embedded interactive widgets (live theme swatches, live module toggle checkboxes).
- **Pros:** Respects user time (~20–30 seconds), highly engaging, game-authentic, solves configuration before cockpit entry, leaves main layout clean.
- **Cons:** Requires a dedicated modal component and state orchestration.
- **Decision:** Picked unanimously.

### Approach 2: Live "Spotlight / Beacon" DOM Tour
- Dims the entire screen and highlights elements on the live page with pulsing beacons.
- **Pros:** Directly points at buttons on the screen.
- **Cons:** Fragile across mobile, responsive wrapping, and themes; users frequently mash "Skip" to regain control.
- **Decision:** Rejected.

### Approach 3: Collapsible Pre-Flight Checklist Card Pinned to Flight Deck
- An embedded widget above the flight table that tracks onboarding tasks.
- **Pros:** Persistent progress indicator.
- **Cons:** Consumes valuable vertical table space on a page that is already dense.
- **Decision:** Rejected in favor of the modal + replay button approach.

---

## 5. Detailed Architecture & The 6 Briefing Slides

The briefing presents a cohesive, paginated card sequence with progress dots, `← Previous`, `Next →`, and `Got It / Enter Cockpit` buttons. Keyboard shortcuts (`ArrowRight`, `ArrowLeft`, `Escape`) will be supported.

```
+------------------------------------------------------------------+
| ✈️ PRE-FLIGHT BRIEFING                          [✕ Close / Skip]  |
| Step 2 of 6: Log As You Fly                                      |
+------------------------------------------------------------------+
|                                                                  |
|   [ Icon / Visual Diagram ]                                      |
|                                                                  |
|   "You don't need to log 500+ flights today. Start small!"       |
|                                                                  |
|   • Focus only on the 2 or 3 destinations your planes are        |
|     currently flying in Airport City right now.                  |
|   • AC-Tracker mirrors the in-game HUD: enter your flights on    |
|     your CURRENT star (e.g. 49 / 300), not your lifetime total.  |
|                                                                  |
+------------------------------------------------------------------+
| (•) (•) (○) (○) (○) (○)                   [Back]   [Next Step →] |
+------------------------------------------------------------------+
```

### Slide Content Breakdown:

1. **Slide 1: Visual Comfort First (Theme Selection)**
   - *Message:* Find a visual style that is easy on your eyes during long tracking sessions.
   - *Interactive Widget:* Quick theme preview buttons (e.g., Default Stealth Ghost, Mach 3 Stratosphere, Blackbird OLED, Botanical Garden, First Class Suite) allowing immediate one-click theme switching right inside the modal.

2. **Slide 2: Log As You Fly (Bite-Sized Flight Logging)**
   - *Message:* Don't feel pressured to enter all 536 routes at once.
   - *Key Takeaway:* Start with the specific flights your active fleet is running right now. Explain the flight scrubber: type what's on your in-game screen (`current / target`), and the app calculates total flights and star percentages automatically.

3. **Slide 3: Streamline Your Cockpit (Custom Navigation Modules)**
   - *Message:* Keep it minimal or unlock the full command center.
   - *Key Takeaway:* If you don't need the Fleet Hangar, Map Depot, or Missions Depot yet, hide them to keep your navigation uncluttered.
   - *Interactive Widget:* Quick toggles for `enabledViews` (Maps, Hangar, Stats, Missions, Events) so the pilot can customize their navigation bar immediately.

4. **Slide 4: Categories & Sidebar (Focused Progression)**
   - *Message:* Tackle one flight category at a time.
   - *Key Takeaway:* Use the left Category drawer to isolate Regular Flights, Adventure Maps, or Space flights. Remind pilots that the sidebar can be collapsed at any time with the `[ < ]` toggle button to maximize table space.

5. **Slide 5: Safe Pilot Habits (Backups & Data Freedom)**
   - *Message:* Your flight data is saved locally on your device.
   - *Key Takeaway:* Cloud accounts can fail, but JSON backups never lie. Show them where the "Export Profile Backup" button lives in Settings / Profile Manager so they can safeguard their hours of progress.

6. **Slide 6: Radar & Secret Weapons (Stats & Telemetry)**
   - *Message:* The tracker becomes smarter the longer you fly.
   - *Key Takeaway:* Introduce the high-leverage tools they will grow into:
     - **Lowest Hanging Fruit Radar:** Highlights which destinations are closest to their next star.
     - **Missing Maps Radar:** Detects flights you can run right now with in-stock maps.
     - **Recently Flown Strip:** One-click `+1` counters for rapid logging between flights.

---

## 6. Trigger & Replay Lifecycle

1. **First-Load Detection & Migration (Builder Decisions Sunk):**
   - **Target Audience:** The auto-launch is strictly intended for **brand new pilots on their first device visit** who do not have existing flight data.
   - **Existing Profiles & Legacy Migration:**
     - In `profiles.ts` / `index.tsx`, when existing profiles exist in storage or when legacy data is migrated via `migrateLegacyData()`, `act_has_seen_briefing` is marked as `'true'` to guarantee zero popups or modal collisions for returning pilots.
     - When an experienced pilot creates an additional alt profile in Profile Manager (`createBlankProfile`), `hasSeenGettingStarted` defaults to `true` (so veteran players are never spammed when creating alt accounts).
   - **First-Time Visitor Trigger:**
     - If neither `act_profiles` nor legacy keys exist on initial load, a new profile is created with `hasSeenGettingStarted: false`, and `isGettingStartedOpen` opens automatically.
     - Closing the modal or completing the briefing sets `act_has_seen_briefing = 'true'` in localStorage and marks `hasSeenGettingStarted = true` on the profile.

2. **Manual Replay Access (Always Available):**
   - **Top Navigation Bar:** Add a clean, responsive `"💡 Guide"` button with icon alongside Theme and Settings in the utility header (and in the mobile drawer switcher).
   - **Help / About Page:** Add a dedicated "Pre-Flight Briefing" card with a prominent `"Launch Interactive Guide →"` button.
   - **Avionics & Settings Page:** Add a `"Replay Getting Started Briefing"` action button in the Cockpit display settings.

---

## 7. What Is Left to the Builder
- Component composition (`GettingStartedModal.tsx` in `src/components/` or root directory).
- Specific SVG iconography and Tailwind glassmorphism tokens matching the active theme.
- Responsive styling down to 360px mobile viewports.
- Keyboard navigation hooks (`useCallback` for Arrow keys and Escape).
