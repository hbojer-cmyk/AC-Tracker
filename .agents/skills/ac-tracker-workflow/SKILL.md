---
name: ac-tracker-workflow
description: >-
  Operational runbook for developing, extending, and verifying the AC-Tracker flight monitor application.
  Use when adding or modifying destinations, adjusting aircraft fleets, managing UI themes, or preparing GitHub Pages deployments.
---

# AC-Tracker Development & Operations Workflow

## Key Files & Structure
- [destinations.ts](file:///c:/Users/Alastair/ac-tracker-10/destinations.ts): Complete destination registry, flight counts, map requirements, and star tiers.
- [AirplanesPage.tsx](file:///c:/Users/Alastair/ac-tracker-10/AirplanesPage.tsx): Fleet specifications, aircraft models, and hangar management.
- [index.tsx](file:///c:/Users/Alastair/ac-tracker-10/index.tsx): Flight Deck dashboard, radar, table views, and state management.
- [SCRATCHPAD.md](file:///c:/Users/Alastair/ac-tracker-10/SCRATCHPAD.md): Backlog, active priorities, and feature wishlist.
- [.github/workflows/deploy.yml](file:///c:/Users/Alastair/ac-tracker-10/.github/workflows/deploy.yml): Automated GitHub Pages deployment pipeline.

## Standard Procedures

### 1. Adding or Updating Destinations
1. Open [destinations.ts](file:///c:/Users/Alastair/ac-tracker-10/destinations.ts) and define the destination item with `id`, `name`, `region`, `aircraft`, `progressTarget`, `maps`, and `flights`.
2. Ensure landmark iconography is registered or mapped to existing SVG landmark components.

### 2. Updating Aircraft Fleet
1. Check [AirplanesPage.tsx](file:///c:/Users/Alastair/ac-tracker-10/AirplanesPage.tsx) for aircraft models and specs.
2. Icons reside under `icons/aircraft/` in PNG format.

### 3. Date Stamping & Maintenance
1. Always update `APP_UPDATED_DATE` in [index.tsx](file:///c:/Users/Alastair/ac-tracker-10/index.tsx) with today's date (formatted as `'MMM D, YYYY'`, e.g., `'Sep 26, 2026'`) whenever making changes to the application.
2. Both the top brand bar badge and the About & Resources page read from this single source of truth.

### 4. Verification & Deployment Readiness
1. Always run verification:
   `npm run build`
2. Ensure there are no TypeScript diagnostics or bundle issues.
3. Review changes against [SCRATCHPAD.md](file:///c:/Users/Alastair/ac-tracker-10/SCRATCHPAD.md) and check off completed items.
4. Verify that `APP_UPDATED_DATE` matches the current date.

