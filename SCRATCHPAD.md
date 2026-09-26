# AC-Tracker Scratchpad & Feature Ideas

A dedicated space to jot down brainstorms, backlog items, feature requests, and improvements for AC-Tracker.

---

## 💡 Quick Brainstorming & Raw Notes
*Jot down quick thoughts, unformatted ideas, or bugs spotted while playing.*

- make destinations sortable by last flight date
- [x] sort by collection (implemented via separate Collection column with sorting support)

---

## 🚀 Feature Ideas & Wishlist

Links page

Event walkthroughs

"what's new" page that's only visible on first load after a new update

Add a "Recent Flights" dropdown to the Flight Deck and Radar pages so users can quickly jump back to flights they've recently worked on

Add "Event Walkthrough" pages for past events, similar to the Map Depot format, with categories for easy navigation

### 🧭 Flight Deck & Radar
- [ ] 


### ✈️ Fleet Hangar & Aircraft
- [ ] 

### 🗺️ Map Depot & Destinations
- [ ] 

### 📊 Stats, Analytics & Progression
- [ ] 

### 🛠️ UI, Themes & Quality of Life (QoL)
- [x] More light themes (added Arctic Frost, Botanical Garden, Golden Autumn, Modern Minimalist from Theme Factory)
- [ ] Auto-expand rows on the stats page to show plane details when clicking the row
- [ ] Expandable aircraft info on the hangar page (the aircraft tiles)
- [ ] Add a button on the stats page to toggle between dark/light mode

---

## 🎯 Short-Term Priorities / Up Next
1. 
2. 
3. 

---

## ✅ Implemented / Done
- [x] In-Game Authentic Flight Mastery HUD Panel: Redesigned the Statistics page Star Tier Cards into an authentic Airport City Flight Mastery panel matching the in-game HUD screenshot (descending rank order from Ace 5★ down to Specialist 1★, authentic 3D golden game stars, cascading title-case rank names, diagonal runway-striped leader line track, right-aligned tabular counts, and in-game cumulative milestone vs exact tier mode toggle with click-to-filter support).
- [x] Updated Flights Page Header & Subheader: Renamed header from "Flight Deck" to "Flights" (aligning with top navigation), updated subheader to guide users on updating in-game flight counts, column sorting, and category filters for strategy planning, and updated collapsed header state and accessibility labels.
- [x] Flight Operations Dense Table Column Split & Renaming: Split "Destination & Set" into two independent sortable columns ("Destination" and "Collection"); updated column names to Destination, Collection, Aircraft, Progress, To Next Star, Maps, Flights, Total Flights, Info; removed column name for icons; added "Sort: Collection" to toolbar sort dropdown; ensured clean horizontal scrolling with minimum responsive desktop grid constraints.
- [x] In-game Star Flight Scrubber: Input flights directly on current star ("XX / [Star Target]" e.g. "49/300") with paired Total Flights column (e.g. 349) matching Airport City in-game HUD; removed redundant +5 and +10 buttons for an uncluttered, clean flight deck across Desktop Dense Table, Mobile Rows, Cards View, and Priority Radar
- [x] Integrated 10 themes from Theme Factory templates (Arctic Frost, Botanical Garden, Desert Rose, Forest Canopy, Golden Autumn, Midnight Galaxy, Modern Minimalist, Ocean Depths, Sunset Boulevard, Tech Innovation) expanding theme roster to 23 with modal filter tabs (All, Theme Factory, Daylight/Light, Dark Deck)
- [x] Modern Flight Deck UI overhaul with 13 themes & dense table view
- [x] "To Next Star" sorting & Priority Radar
- [x] Map Depot collection tracking
- [x] Flight Resources & Community Links section in About ACT (Wiki, Game Forums, Facebook Bonus Codes, Developer Support & FAQ, World Destinations Map)
- [x] Custom high-resolution 3D flight-deck icon set (Radar Deck, Fleet Hangar, Map Depot, Progression Stars, Flight Resources) with alpha transparency and shared 512x512 canvas
- [x] Integrated 3D flight-deck icons across all page headers (Flight Deck radar, Fleet Hangar aircraft, Map Depot collection, Progression Stars statistics, Flight Resources about page) with tightly cropped 97%-fill artwork (496x496 inside 512x512), enlarged full-bleed hero badges (112px–144px), enlarged Fleet Hangar card sprites, and collapsible Flight Deck banner
- [x] Standardized Statistics page header icon container and ambient glow to use dynamic `.theme-badge` and `var(--accent)`, resolving legacy amber/brown background discrepancy
- [x] Updated Map Depot view header: renamed main title to "Map Inventory", updated subheader copy to highlight strategic collection rewards & missing map tracking, changed metric badge to "Collected Maps", and streamlined the header by removing the "Physical Stock" block
- [x] Original 3D AC-Tracker Brand Logo suite: created 4 bespoke 3D flight-deck emblems reimagining the official Airport City game logo (golden control tower, skyline, wings, ascending jet contrail) in 3D brushed titanium & cyan hologram style, integrated live interactive Logo Selector Modal, dual-theme contrast swatches, and About ACT showcase card
- [x] Updated Help & Resources Page Header & Subheader: Renamed header to "AC - Tracker : Help and Resources" and updated subheader to "How to use the App and where to find other resources to help you master the game."
- [x] Help & Resources Layout Reorganization: Removed the Cockpit Brand Emblems showcase card from the Help/About view and moved the Cockpit Shortcuts & Offline Storage section up directly below the "What is AC-Tracker?" overview card, positioning the Modules Grid and Flight Resources below it.
- [x] Renamed Shortcuts Card Header: Changed "Cockpit Shortcuts & Ergonomics" to "Keyboard shortcuts, Usage tips" in the Help & Resources view.
- [x] Removed Modules Navigation Grid: Removed the 4 navigation shortcut cards (Flights, Maps, Aircraft, Stats) from the Help & Resources page, cleaning up redundant cards and streamlining the flow directly to Flight Resources & Community Links.
- [x] Flight Resources List-Style Redesign: Converted the Flight Resources & Community Links section on the Help & Resources page from a 3-column card grid into a sleek horizontal list-style format, featuring dedicated themed icon badges, responsive category pills, domain indicators, and interactive "Open Link" action buttons.

