# Antigravity Workspace Rules for AC-Tracker

## Communication & Reasoning
- **Always include an "Approach & Reasoning" section** at the start of every response.
- Present the thought process, findings, logic, and planned actions in clear, readable plain text so the user can easily follow along directly in the message without needing to expand or read the collapsible UI thinking block.

## Feature Tracking & Scratchpad
- Check [SCRATCHPAD.md](file:///c:/Users/Alastair/ac-tracker-10/SCRATCHPAD.md) when planning new features, UI improvements, or reviewing backlog tasks.
- Keep [SCRATCHPAD.md](file:///c:/Users/Alastair/ac-tracker-10/SCRATCHPAD.md) updated when items are implemented, moving them to the "Implemented / Done" section.

## Code Quality & Verification
- Verify all TypeScript and asset changes by running `npm run build` before completing a task.
- Ensure zero unused imports or type errors to keep GitHub Pages CI deployments healthy.

## App Maintenance & Date Stamping
- **Always update `APP_UPDATED_DATE` in `index.tsx`**: Whenever modifying the app (features, UI, styling, destinations, or bug fixes), update `export const APP_UPDATED_DATE` to the current date (formatted as `'MMM D, YYYY'`, e.g. `'Sep 26, 2026'`) so the "Updated: [Date]" badge in the top navigation bar and About page always reflects the latest revision.

## Live Deployment & Cache Verification
- **Always verify live deployments**: After pushing commits, always push to both `main` and `ACT+` (`git push origin main; git push origin main:ACT+`) so both GitHub Pages and Cloudflare Pages pipelines trigger. Wait for and verify that `origin/gh-pages` is updated (`git fetch origin gh-pages; git log -1 origin/gh-pages`).
- **Remind user about browser cache**: Inform the user if hard refreshing (`Ctrl + F5` or `Cmd + Shift + R`) or opening a private/incognito window is needed to bypass edge caching (Cloudflare CDN / Service Worker / browser cache) and fetch the new JavaScript bundle immediately.

## Design & UI Aesthetics
- Preserve the cyber flight-deck aesthetic: dark glassmorphic panels, glowing cyan/amber accents, high-contrast badges, and custom landmark SVGs/icons across all views.


