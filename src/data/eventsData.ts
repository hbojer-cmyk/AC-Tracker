export interface ActiveEventConfig {
  eventName: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD or ISO timestamp
  endDateDisplay?: string; // Optional user-friendly display date e.g. "Nov 3, 2026"
  wikiUrl: string;
  filterKeyword: string; // Used to filter flights on the main Flights page
}

// ACTIVE_EVENT_CONFIG: Populated when an in-game live event officially begins.
export const ACTIVE_EVENT_CONFIG: ActiveEventConfig = {
  eventName: "Dark Skies",
  startDate: "2026-10-22",
  endDate: "2026-11-02T21:00:00Z",
  endDateDisplay: "Nov 3, 2026",
  wikiUrl: "https://www.airportcitygame.com/wiki/dark_skies/",
  filterKeyword: "Dark Skies"
};

export interface CalendarEventItem {
  title: string;
  wikiUrl: string;
  description: string;
  badges?: string[];
  filterKeyword?: string;
}

export interface MonthCalendarData {
  monthNumber: number; // 1-12
  monthName: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  themeAccent: string; // Hex color or Tailwind accent
  bannerImage: string; // Image path under icons/calendar/
  events: CalendarEventItem[];
}

export const EVENTS_CALENDAR: MonthCalendarData[] = [
  {
    monthNumber: 1,
    monthName: "January",
    quarter: "Q1",
    themeAccent: "#38bdf8", // Sky blue
    bannerImage: "icons/calendar/01.jpg",
    events: [
      {
        title: "It Came from Outer Space",
        wikiUrl: "https://www.airportcitygame.com/wiki/it-came-from-outer-space/",
        description: "Investigate mysterious extraterrestrial signals, UFO sightings, and cosmic artifacts across deep sky routes.",
        badges: ["Sci-Fi", "Space", "10 Routes"],
        filterKeyword: "It Came From Outer Space"
      },
      {
        title: "Riding the Comet",
        wikiUrl: "https://www.airportcitygame.com/wiki/riding-the-comet/",
        description: "Track cosmic perihelion flybys, collecting telemetry data and deep space observatory crystals.",
        badges: ["Cosmic", "Astronomy", "Space Race"],
        filterKeyword: "Riding the Comet"
      },
      {
        title: "Valley of the Kings Curse",
        wikiUrl: "https://www.airportcitygame.com/wiki/valley-of-the-kings-curse/",
        description: "Unearth ancient pharaoh tombs, archaeological relics, golden sarcophagi, and cryptic hieroglyph scrolls.",
        badges: ["Archaeology", "Ancient Egypt", "7 Routes"],
        filterKeyword: "Valley Of The Kings Curse"
      }
    ]
  },
  {
    monthNumber: 2,
    monthName: "February",
    quarter: "Q1",
    themeAccent: "#f472b6", // Rose pink
    bannerImage: "icons/calendar/02.jpg",
    events: [
      {
        title: "On the Wings of Love",
        wikiUrl: "https://www.airportcitygame.com/wiki/on-the-wings-of-love/",
        description: "Valentine's seasonal celebration collecting romantic gifts, bridal bouquets, and destination love tokens.",
        badges: ["Valentine's", "Seasonal", "10 Routes"],
        filterKeyword: "On The Wings Of Love"
      },
      {
        title: "Dragon Rising",
        wikiUrl: "https://www.airportcitygame.com/wiki/dragon-rising/",
        description: "Celebrate the Lunar New Year festival with mythical dragon lanterns, temple fireworks, and cultural flights.",
        badges: ["Lunar New Year", "Festive", "10 Routes"],
        filterKeyword: "Dragon Rising"
      },
      {
        title: "A Walk in the Clouds",
        wikiUrl: "https://www.airportcitygame.com/wiki/a-walk-in-the-clouds/",
        description: "Soar through high-altitude stratospheric currents, airship regattas, and sky-high atmospheric stations.",
        badges: ["Aviation", "Regatta", "10 Routes"],
        filterKeyword: "A Walk In The Clouds"
      }
    ]
  },
  {
    monthNumber: 3,
    monthName: "March",
    quarter: "Q1",
    themeAccent: "#4ade80", // Emerald green
    bannerImage: "icons/calendar/03.jpg",
    events: [
      {
        title: "Dancing with Leprechauns",
        wikiUrl: "https://www.airportcitygame.com/wiki/dancing-with-the-leprechauns/",
        description: "Saint Patrick's Celtic carnival collecting four-leaf clovers, pots of gold, and emerald rainbows.",
        badges: ["St. Patrick's", "Celtic", "10 Routes"],
        filterKeyword: "Dancing With Leprechauns"
      },
      {
        title: "Spring is Here",
        wikiUrl: "https://www.airportcitygame.com/wiki/spring-is-here/",
        description: "Welcoming blooming blossoms, garden sanctuaries, and spring migration routes across warming continents.",
        badges: ["Spring", "Floral", "Seasonal"],
        filterKeyword: "Spring is Here"
      },
      {
        title: "Easter Cheer",
        wikiUrl: "https://www.airportcitygame.com/wiki/easter-cheer/",
        description: "Easter holiday festivities gathering decorative Fabergé eggs, chocolate treats, and springtime joy.",
        badges: ["Easter", "Holiday", "11 Routes"],
        filterKeyword: "Easter Cheer"
      }
    ]
  },
  {
    monthNumber: 4,
    monthName: "April",
    quarter: "Q2",
    themeAccent: "#a78bfa", // Purple lavender
    bannerImage: "icons/calendar/04.jpg",
    events: [
      {
        title: "Easter Cheer",
        wikiUrl: "https://www.airportcitygame.com/wiki/easter-cheer/",
        description: "Easter holiday festivities gathering decorative Fabergé eggs, chocolate treats, and springtime joy.",
        badges: ["Easter", "Holiday", "11 Routes"],
        filterKeyword: "Easter Cheer"
      },
      {
        title: "A Walk in the Clouds",
        wikiUrl: "https://www.airportcitygame.com/wiki/a-walk-in-the-clouds/",
        description: "Soar through high-altitude stratospheric currents, airship regattas, and sky-high atmospheric stations.",
        badges: ["Aviation", "Regatta", "10 Routes"],
        filterKeyword: "A Walk In The Clouds"
      },
      {
        title: "On the Wings of Love",
        wikiUrl: "https://www.airportcitygame.com/wiki/on-the-wings-of-love/",
        description: "Springtime romantic celebration collecting love tokens, wedding gifts, and bridal bouquets.",
        badges: ["Romance", "Seasonal", "10 Routes"],
        filterKeyword: "On The Wings Of Love"
      }
    ]
  },
  {
    monthNumber: 5,
    monthName: "May",
    quarter: "Q2",
    themeAccent: "#fbbf24", // Amber gold
    bannerImage: "icons/calendar/05.jpg",
    events: [
      {
        title: "Airport City Event",
        wikiUrl: "https://www.airportcitygame.com/wiki/airport-city/",
        description: "Anniversary celebration commemorating game lore, airport infrastructure, and iconic milestone flights.",
        badges: ["Anniversary", "Special", "15 Routes"],
        filterKeyword: "Airport City"
      },
      {
        title: "Cinemania",
        wikiUrl: "https://www.airportcitygame.com/wiki/cinemania/",
        description: "Roll out the red carpet for world cinema festivals, film reels, Oscar statues, and blockbuster movie sets.",
        badges: ["Hollywood", "Cinema", "Special"],
        filterKeyword: "Cinemania"
      },
      {
        title: "Age of Ash",
        wikiUrl: "https://www.airportcitygame.com/wiki/age-of-ash/",
        description: "Navigate active volcanic caldera plumes, geothermal stations, and volcanic obsidian recovery missions.",
        badges: ["Volcanic", "Geology", "9 Routes"],
        filterKeyword: "Age of Ash"
      }
    ]
  },
  {
    monthNumber: 6,
    monthName: "June",
    quarter: "Q2",
    themeAccent: "#2dd4bf", // Teal
    bannerImage: "icons/calendar/06.jpg",
    events: [
      {
        title: "The Great Game",
        wikiUrl: "https://www.airportcitygame.com/wiki/the-great-game/",
        description: "Summer sports tournaments, championship trophies, athletic stadiums, and international friendly competitions.",
        badges: ["Sports", "Tournament", "Summer"],
        filterKeyword: "The Great Game"
      },
      {
        title: "The Land of Opportunity",
        wikiUrl: "https://www.airportcitygame.com/wiki/the-land-of-opportunity/",
        description: "Journey across historic pioneer routes, iconic frontier skylines, and transcontinental express routes.",
        badges: ["Americana", "Heritage", "9 Routes"],
        filterKeyword: "The Land of Opportunity"
      }
    ]
  },
  {
    monthNumber: 7,
    monthName: "July",
    quarter: "Q3",
    themeAccent: "#34d399", // Mint / Emerald
    bannerImage: "icons/calendar/07.jpg",
    events: [
      {
        title: "World of Wildlife",
        wikiUrl: "https://www.airportcitygame.com/wiki/world-of-wildlife/",
        description: "Protect endangered species, ecological sanctuaries, safari reserves, and pristine rainforests.",
        badges: ["Nature", "Wildlife", "6 Routes"],
        filterKeyword: "World of Wildlife"
      },
      {
        title: "Riding the Comet",
        wikiUrl: "https://www.airportcitygame.com/wiki/riding-the-comet/",
        description: "Mid-year celestial tracking missions collecting meteor fragments and deep-space observatory supplies.",
        badges: ["Cosmic", "Astronomy", "Repeat"],
        filterKeyword: "Riding the Comet"
      }
    ]
  },
  {
    monthNumber: 8,
    monthName: "August",
    quarter: "Q3",
    themeAccent: "#f97316", // Bright Orange
    bannerImage: "icons/calendar/08.jpg",
    events: [
      {
        title: "Rock the Sky",
        wikiUrl: "https://www.airportcitygame.com/wiki/rock-the-sky/",
        description: "Summer rock music festival tour delivering amplifiers, electric guitars, stage pyrotechnics, and VIP passes.",
        badges: ["Concert", "Music Festival", "6 Routes"],
        filterKeyword: "Rock The Sky"
      },
      {
        title: "Back to School",
        wikiUrl: "https://www.airportcitygame.com/wiki/back-to-school/",
        description: "Academic semester takeoff carrying school supplies, textbooks, laboratory equipment, and campus scholars.",
        badges: ["Academic", "Back to School", "9 Routes"],
        filterKeyword: "Back To School"
      }
    ]
  },
  {
    monthNumber: 9,
    monthName: "September",
    quarter: "Q3",
    themeAccent: "#eab308", // Golden Yellow
    bannerImage: "icons/calendar/09.jpg",
    events: [
      {
        title: "Celestial Festival",
        wikiUrl: "https://www.airportcitygame.com/wiki/celestial-festival/",
        description: "Autumn equinox lantern celebration honoring harvest moons, starlit constellations, and night sky traditions.",
        badges: ["Equinox", "Astronomy", "16 Routes"],
        filterKeyword: "Celestial Festival"
      },
      {
        title: "Valley of the Kings Curse",
        wikiUrl: "https://www.airportcitygame.com/wiki/valley-of-the-kings-curse/",
        description: "Unearth ancient pharaoh tombs, archaeological relics, golden sarcophagi, and cryptic hieroglyph scrolls.",
        badges: ["Archaeology", "Ancient Egypt", "7 Routes"],
        filterKeyword: "Valley Of The Kings Curse"
      },
      {
        title: "Cinemania",
        wikiUrl: "https://www.airportcitygame.com/wiki/cinemania/",
        description: "Roll out the red carpet for world cinema festivals, film reels, Oscar statues, and blockbuster movie sets.",
        badges: ["Hollywood", "Cinema", "Special"],
        filterKeyword: "Cinemania"
      }
    ]
  },
  {
    monthNumber: 10,
    monthName: "October",
    quarter: "Q4",
    themeAccent: "#c084fc", // Mystic Purple
    bannerImage: "icons/calendar/10.jpg",
    events: [
      {
        title: "Riding the Comet",
        wikiUrl: "https://www.airportcitygame.com/wiki/riding-the-comet/",
        description: "Track cosmic perihelion flybys, collecting telemetry data and deep space observatory crystals.",
        badges: ["Cosmic", "Astronomy", "Repeat"],
        filterKeyword: "Riding the Comet"
      },
      {
        title: "Down the Rabbit Hole",
        wikiUrl: "https://www.airportcitygame.com/wiki/down-the-rabbit-hole/",
        description: "Enter a whimsical Wonderland world of mad tea parties, clockwork rabbits, and enigmatic playing cards.",
        badges: ["Wonderland", "Fantasy", "10 Routes"],
        filterKeyword: "Down The Rabbit Hole"
      },
      {
        title: "Dark Skies",
        wikiUrl: "https://www.airportcitygame.com/wiki/dark_skies/",
        description: "Spooky Halloween night missions dodging thunderstorm phantoms, haunted towers, and carved jack-o'-lanterns.",
        badges: ["Halloween", "Spooky", "9 Routes"],
        filterKeyword: "Dark Skies"
      }
    ]
  },
  {
    monthNumber: 11,
    monthName: "November",
    quarter: "Q4",
    themeAccent: "#ea580c", // Autumn Burnt Amber
    bannerImage: "icons/calendar/11.jpg",
    events: [
      {
        title: "Long-awaited Mail",
        wikiUrl: "https://www.airportcitygame.com/wiki/long-awaited-mail/",
        description: "International airmail logistics rush sorting postal deliveries, express packages, and vintage aerogrammes.",
        badges: ["Airmail", "Postal", "9 Routes"],
        filterKeyword: "Long-awaited Mail"
      },
      {
        title: "Thanksgiving Day",
        wikiUrl: "https://www.airportcitygame.com/wiki/thanksgiving-day/",
        description: "Harvest feast flights gathering roast turkeys, cranberry treats, cornucopias, and family homecoming gifts.",
        badges: ["Thanksgiving", "Harvest", "6 Routes"],
        filterKeyword: "Thanksgiving Day"
      },
      {
        title: "Time to Rock",
        wikiUrl: "https://www.airportcitygame.com/wiki/time-to-rock/",
        description: "Rock and roll arena tour delivering sound gear, vintage vinyl, neon tour banners, and legendary riffs.",
        badges: ["Music", "Concert Tour", "6 Routes"],
        filterKeyword: "Time to Rock"
      }
    ]
  },
  {
    monthNumber: 12,
    monthName: "December",
    quarter: "Q4",
    themeAccent: "#06b6d4", // Frost Cyan
    bannerImage: "icons/calendar/12.jpg",
    events: [
      {
        title: "Holiday Rush",
        wikiUrl: "https://www.airportcitygame.com/wiki/holiday-rush/",
        description: "Peak winter holiday travel surge transporting gift cargo, airport passengers, and festive holiday goodwill.",
        badges: ["Winter Holiday", "Airport Rush", "1 Route"],
        filterKeyword: "Holiday Rush"
      },
      {
        title: "Santa's Bad Day",
        wikiUrl: "https://www.airportcitygame.com/wiki/santas-bad-day/",
        description: "Rescue stranded reindeer, collect lost workshop presents, and save Christmas delivery worldwide.",
        badges: ["Christmas", "Santa", "6 Routes"],
        filterKeyword: "Santa's Bad Day"
      },
      {
        title: "Winter Dream",
        wikiUrl: "https://www.airportcitygame.com/wiki/winter-dream/",
        description: "New Year's Eve winter wonderland with glistening ice sculptures, snowfields, and midnight clock towers.",
        badges: ["New Year", "Ice Carnival", "9 Routes"],
        filterKeyword: "Winter Dream"
      }
    ]
  }
];
