// Registry of timer durations for destinations requiring flight maps in Airport City.
// In Airport City, activating a flight map unlocks the destination for a limited time duration (timer),
// allowing players to dispatch as many flights as their fleet and turnarounds allow until the timer runs out.

export interface MapTimerConfig {
  duration: string; // e.g. "3h", "6h", "24h", "45m"
  minutes?: number;
}

/**
 * Map duration registry: Destination Name -> Active Timer string.
 * Timer values can be specified as e.g. '6h', '3h', '24h', '45m'.
 * Values can be entered directly here as confirmed from the game.
 */
export const MAP_TIMERS: Record<string, string> = {
  // ==========================================================================
  // ALLIANCE MAP FLIGHTS (50 Destinations) - 3 Hours Active Timer
  // ==========================================================================

  // Collection: How to Win Friends and Influence People (Swift)
  'Acapulco': '3h',
  'Tegucigalpa': '3h',
  'Cartagena': '3h',
  'La Paz': '3h',
  'San Pedro Sula': '3h',

  // Collection: I´ll Think About That Tomorrow (Owl)
  'Vaduz': '3h',
  'Baden-Baden': '3h',
  'Luxembourg': '3h',
  'San Marino': '3h',
  'Monaco': '3h',

  // Collection: Spic and Span (Hawk)
  'Hamburg': '3h',
  'Stuttgart': '3h',
  'Dusseldorf': '3h',
  'Cologne': '3h',
  'Munich': '3h',

  // Collection: Time is Money (Raven)
  'Geneva': '3h',
  'Winterthur': '3h',
  'Lausanne': '3h',
  'Bern': '3h',
  'Zurich': '3h',

  // Collection: Easy Rider (Eagle)
  'Philadelphia': '3h',
  'Denver': '3h',
  'Rapid City': '3h',
  'Phoenix': '3h',
  'Des Moines': '3h',

  // Collection: Need For Speed (Jumbo)
  'Modena': '3h',
  'Le Mans': '3h',
  'Monza': '3h',
  'Maranello': '3h',
  'Indianapolis': '3h',

  // Collection: Gold Reserve (Giant)
  'San Jose': '3h',
  'San Diego': '3h',
  'Santa Barbara': '3h',
  'Santa Cruz': '3h',
  'Santa Rosa': '3h',

  // Collection: Royal Honors (Falcon)
  'Bath': '3h',
  'Canterbury': '3h',
  'Exeter': '3h',
  'York': '3h',
  'Norwich': '3h',

  // Collection: The Stone Guests (Thunderbird)
  'Rhodes': '3h',
  'Heraklion': '3h',
  'Patras': '3h',
  'Thessaloniki': '3h',
  'Corinth': '3h',

  // Collection: Sea-Wolf (Condor)
  'Bilbao': '3h',
  'Seville': '3h',
  'Granada': '3h',
  'Córdoba': '3h',
  'Cordoba': '3h',
  'Alicante': '3h',

  // ==========================================================================
  // SPACE MAP FLIGHTS (15 Destinations)
  // ==========================================================================

  // Collection: The Theory of Everything (Owl - Green Space Maps) - 3 Hours Active Timer
  'Novosibirsk': '3h',
  'Bangalore': '3h',
  'Edmonton': '3h',
  'Perth': '3h',
  'Berkeley': '3h',

  // Collection: The Outer Limits (Hawk - Blue Space Maps) - 12h 30m Active Timer
  'Sacramento': '12h 30m',
  'Alexandria': '12h 30m',
  'Miami': '12h 30m',
  'Nagoya': '12h 30m',
  'Puerto Rico': '12h 30m',

  // Collection: Edge of Tomorrow (Jumbo - Red Space Maps) - 17 Hours Active Timer
  'Vienna': '17h',
  'Glasgow': '17h',
  'Beverly Hills': '17h',
  'Zagreb': '17h',
  'Potsdam': '17h',

  // ==========================================================================
  // ADVENTURE MAP FLIGHTS (80 Destinations) - 6 Hours Active Timer
  // ==========================================================================

  // Collection: Aztec Legacy (Owl - Mesoamerica)
  'Chichen Itza': '6h',
  'Machu Picchu': '6h',
  'Quetzalcoatl Temple': '6h',
  'Tenochtitlan': '6h',
  'Tollan': '6h',

  // Collection: Roman Holiday (Hawk - Ancient Rome)
  'Carthage': '6h',
  'Constantinople': '6h',
  'Ephesus': '6h',
  'Merida': '6h',
  'Veii': '6h',

  // Collection: Guardians of the Forest (Raven - Stonehenge)
  'Alesia': '6h',
  'Avaricum': '6h',
  'Bibracte': '6h',
  'Gergovie': '6h',
  'Londinium': '6h',

  // Collection: Riddles of the Pharaohs (Eagle - Ancient Egypt)
  'Cairo': '6h',
  'Heliopolis': '6h',
  'Kom Ombo': '6h',
  'Luxor': '6h',
  'Memphis': '6h',

  // Collection: The Ancient World (Jumbo - Ancient Greece)
  'Athens': '6h',
  'Delphi': '6h',
  'Sparta': '6h',
  'Thebes': '6h',
  'Troy': '6h',

  // Collection: Treasures of Asgard (Jumbo - Scandinavia)
  'Bergen': '6h',
  'Helsingborg': '6h',
  'Skara': '6h',
  'Trondheim': '6h',
  'Uppsala': '6h',

  // Collection: Da Vinci the Genius (Jumbo - Southern Europe)
  'Caprese': '6h',
  'Florence': '6h',
  'Siena': '6h',
  'Valencia': '6h',
  'Vinci': '6h',

  // Collection: Tale of Bygone Years (Giant - Eastern Europe)
  'Chernihiv': '6h',
  'Kyiv': '6h',
  'Murom': '6h',
  'Novgorod': '6h',
  'Smolensk': '6h',

  // Collection: Polynesian Triangle (Giant - Oceania)
  'Funafuti': '6h',
  'Honolulu': '6h',
  'Samoa': '6h',
  'Tahiti': '6h',
  'Wellington': '6h',

  // Collection: The Art of Transmutation (Giant - Western Europe)
  'Basel': '6h',
  'Montpelier': '6h',
  'Salzburg': '6h',
  'Strasbourg': '6h',
  'Zaragoza': '6h',

  // Collection: The Roaring Twenties (Falcon - New World)
  'Bronx': '6h',
  'Brooklyn': '6h',
  'Manhattan': '6h',
  'Queens': '6h',
  'Staten Island': '6h',

  // Collection: Writing on the Wall (Falcon - Mesopotamia)
  'Assur': '6h',
  'Babylon': '6h',
  'Lagash': '6h',
  'Nineveh': '6h',
  'Ur': '6h',

  // Collection: The Dawn of Man (Thunderbird - Ancient Africa)
  'Cirta': '6h',
  'Nairobi': '6h',
  'Timbuktu': '6h',
  'Tipaza': '6h',
  'Tripoli': '6h',

  // Collection: Rhythm of My Heart (Thunderbird - Ancient India)
  'Chennai': '6h',
  'Hyderabad': '6h',
  'Kanpur': '6h',
  'Kolkata': '6h',
  'Mumbai': '6h',

  // Collection: City Lights (Condor - Ancient China)
  'Chengdu': '6h',
  'Guangzhou': '6h',
  'Luoyang': '6h',
  'Nanjing': '6h',
  'Xi\'an': '6h',

  // Collection: Out-of-Place Artifacts (Condor - North America)
  'Acámbaro': '6h',
  'Dorchester': '6h',
  'Los Lunas': '6h',
  'Meredith': '6h',
  'Moundsville': '6h',

  // ==========================================================================
  // EVENT FLIGHTS (Seasonal / Special Maps)
  // ==========================================================================

  // Collection: Easter Cheer (Owl)
  'Fatima': '2h',

  // Collection: It Came From Outer Space (Owl)
  'Area 51': '6h',

  // Collection: Santa's Bad Day / Winter (Single-use Map)
  'Rovaniemi': '1-time use',
};

/**
 * Returns the active timer duration string for a given map destination, if configured.
 * Automatically defaults to '6h' for Adventure Maps and '3h' for Alliance Maps.
 */
export const getMapDuration = (destination: string, category?: string): string | undefined => {
  const val = MAP_TIMERS[destination];
  if (val && val.trim() !== '') return val.trim();
  if (category && category.includes('Adventure')) return '6h';
  if (category && category.includes('Alliance')) return '3h';
  return undefined;
};

/**
 * Helper to parse a timer duration string like "6h", "30m", "1h 30m" into total minutes.
 */
export const parseDurationMinutes = (duration?: string): number => {
  if (!duration) return 0;
  let total = 0;
  const dMatch = duration.match(/(\d+)\s*d/i);
  const hMatch = duration.match(/(\d+)\s*h/i);
  const mMatch = duration.match(/(\d+)\s*m/i);
  if (dMatch) total += parseInt(dMatch[1], 10) * 1440;
  if (hMatch) total += parseInt(hMatch[1], 10) * 60;
  if (mMatch) total += parseInt(mMatch[1], 10);
  if (!dMatch && !hMatch && !mMatch && !isNaN(Number(duration))) {
    total += Number(duration);
  }
  return total;
};
