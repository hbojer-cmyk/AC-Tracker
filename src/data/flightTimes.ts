// src/data/flightTimes.ts
// Authentic flight durations for Airport City destinations, with focus on Map Expeditions.
// Real-world durations represent the base round-trip flight time before speed upgrades or boosters.

export interface DestinationFlightSpec {
  duration: string; // e.g. "1h 30m", "45m", "3h 00m"
  fuel?: number;
  pax?: number;
}

/**
 * Authentic base flight times registry for Airport City destinations.
 * Prioritizes the 150 Map Destinations (Adventure, Alliance, Space, and Event maps)
 * alongside iconic regular routes.
 */
export const DESTINATION_FLIGHT_TIMES: Record<string, DestinationFlightSpec> = {
  // ==========================================================================
  // ADVENTURE MAP DESTINATIONS (80 Routes across 16 Collections)
  // ==========================================================================

  // Collection: Aztec Legacy (Owl - 6h map window)
  'Excavations: Mesoamerica': { duration: '2h 00m', fuel: 20, pax: 38 },
  'Machu Picchu': { duration: '6h 00m', fuel: 20, pax: 38 },
  'Tollan': { duration: '6h 00m', fuel: 20, pax: 38 },
  'Quetzalcoatl Temple': { duration: '6h 00m', fuel: 24, pax: 38 },
  'Tenochtitlan': { duration: '6h 00m', fuel: 24, pax: 38 },
  'Chichen Itza': { duration: '6h 00m', fuel: 24, pax: 38 },

  // Collection: Roman Holiday (Hawk - 6h map window)
  'Excavations: Ancient Rome': { duration: '3h 00m', fuel: 24, pax: 80 },
  'Constantinople': { duration: '6h 00m', fuel: 24, pax: 80 },
  'Carthage': { duration: '6h 00m', fuel: 24, pax: 80 },
  'Veii': { duration: '6h 00m', fuel: 24, pax: 80 },
  'Ephesus': { duration: '6h 00m', fuel: 24, pax: 80 },
  'Merida': { duration: '6h 00m', fuel: 24, pax: 80 },

  // Collection: Guardians of the Forest (Raven - 6h map window)
  'Excavations: Stonehenge': { duration: '5h 40m', fuel: 35, pax: 160 },
  'Avaricum': { duration: '6h 00m', fuel: 40, pax: 160 },
  'Gergovie': { duration: '6h 00m', fuel: 40, pax: 160 },
  'Londinium': { duration: '6h 00m', fuel: 40, pax: 160 },
  'Bibracte': { duration: '6h 00m', fuel: 40, pax: 160 },
  'Alesia': { duration: '6h 00m', fuel: 40, pax: 160 },

  // Collection: Riddles of the Pharaohs (Eagle - 6h map window)
  'Excavations: Ancient Egypt': { duration: '7h 40m', fuel: 42, pax: 280 },
  'Luxor': { duration: '6h 00m', fuel: 42, pax: 280 },
  'Kom Ombo': { duration: '6h 00m', fuel: 42, pax: 280 },
  'Heliopolis': { duration: '6h 00m', fuel: 42, pax: 280 },
  'Cairo': { duration: '6h 00m', fuel: 42, pax: 280 },
  'Memphis': { duration: '6h 00m', fuel: 42, pax: 280 },

  // Collection: The Ancient World (Jumbo - 6h map window)
  'Excavations: The Ancient World': { duration: '8h 00m', fuel: 48, pax: 380 },
  'Delphi': { duration: '6h 00m', fuel: 50, pax: 380 },
  'Sparta': { duration: '6h 00m', fuel: 50, pax: 380 },
  'Troy': { duration: '6h 00m', fuel: 50, pax: 380 },
  'Athens': { duration: '6h 00m', fuel: 50, pax: 380 },
  'Thebes': { duration: '6h 00m', fuel: 50, pax: 380 },

  // Collection: Da Vinci the Genius (Jumbo - 6h map window)
  'Excavations: Southern Europe': { duration: '8h 00m', fuel: 48, pax: 380 },
  'Vinci': { duration: '6h 00m', fuel: 48, pax: 380 },
  'Florence': { duration: '6h 00m', fuel: 48, pax: 380 },
  'Valencia': { duration: '6h 00m', fuel: 48, pax: 380 },
  'Caprese': { duration: '6h 00m', fuel: 48, pax: 380 },
  'Siena': { duration: '6h 00m', fuel: 48, pax: 380 },

  // Collection: Treasures of Asgard (Jumbo - 6h map window)
  'Excavations: Scandinavia': { duration: '8h 00m', fuel: 48, pax: 380 },
  'Skara': { duration: '6h 00m', fuel: 48, pax: 380 },
  'Helsingborg': { duration: '6h 00m', fuel: 48, pax: 380 },
  'Bergen': { duration: '6h 00m', fuel: 48, pax: 380 },
  'Uppsala': { duration: '6h 00m', fuel: 48, pax: 380 },
  'Trondheim': { duration: '6h 00m', fuel: 48, pax: 380 },

  // Collection: Tale of Bygone Years (Giant - 6h map window)
  'Excavations: Eastern Europe': { duration: '9h 00m', fuel: 50, pax: 500 },
  'Novgorod': { duration: '6h 00m', fuel: 50, pax: 500 },
  'Murom': { duration: '6h 00m', fuel: 50, pax: 500 },
  'Smolensk': { duration: '6h 00m', fuel: 50, pax: 500 },
  'Chernihiv': { duration: '6h 00m', fuel: 50, pax: 500 },
  'Kyiv': { duration: '6h 00m', fuel: 50, pax: 500 },

  // Collection: Polynesian Triangle (Giant - 6h map window)
  'Excavations: Oceania': { duration: '9h 00m', fuel: 50, pax: 500 },
  'Honolulu': { duration: '6h 00m', fuel: 50, pax: 500 },
  'Wellington': { duration: '6h 00m', fuel: 50, pax: 500 },
  'Tahiti': { duration: '6h 00m', fuel: 50, pax: 500 },
  'Samoa': { duration: '6h 00m', fuel: 50, pax: 500 },
  'Funafuti': { duration: '6h 00m', fuel: 50, pax: 500 },

  // Collection: The Art of Transmutation (Giant - 6h map window)
  'Excavations: Western Europe': { duration: '9h 00m', fuel: 50, pax: 500 },
  'Zaragoza': { duration: '6h 00m', fuel: 50, pax: 500 },
  'Montpellier': { duration: '6h 00m', fuel: 50, pax: 500 },
  'Montpelier': { duration: '6h 00m', fuel: 50, pax: 500 },
  'Basel': { duration: '6h 00m', fuel: 50, pax: 500 },
  'Strasbourg': { duration: '6h 00m', fuel: 50, pax: 500 },
  'Salzburg': { duration: '6h 00m', fuel: 50, pax: 500 },

  // Collection: The Roaring Twenties (Falcon - 6h map window)
  'Excavations: New World': { duration: '3h 00m', fuel: 45, pax: 350 },
  'Manhattan': { duration: '3h 00m', fuel: 45, pax: 350 },
  'Brooklyn': { duration: '3h 00m', fuel: 45, pax: 350 },
  'Queens': { duration: '3h 00m', fuel: 45, pax: 350 },
  'The Bronx': { duration: '3h 00m', fuel: 45, pax: 350 },
  'Bronx': { duration: '3h 00m', fuel: 45, pax: 350 },
  'Staten Island': { duration: '3h 00m', fuel: 45, pax: 350 },

  // Collection: Writing on the Wall (Falcon - 6h map window)
  'Excavations: Mesopotamia': { duration: '3h 00m', fuel: 45, pax: 350 },
  'Assur': { duration: '3h 00m', fuel: 45, pax: 350 },
  'Lagash': { duration: '3h 00m', fuel: 45, pax: 350 },
  'Nineveh': { duration: '3h 00m', fuel: 45, pax: 350 },
  'Ur': { duration: '3h 00m', fuel: 45, pax: 350 },
  'Babylon': { duration: '3h 00m', fuel: 45, pax: 350 },

  // Collection: The Dawn of Man (Thunderbird - 6h map window)
  'Excavations: Ancient Africa': { duration: '5h 00m', fuel: 40, pax: 150 },
  'Timbuktu': { duration: '5h 00m', fuel: 40, pax: 150 },
  'Cirta': { duration: '5h 00m', fuel: 40, pax: 150 },
  'Tipaza': { duration: '5h 00m', fuel: 40, pax: 150 },
  'Nairobi': { duration: '5h 00m', fuel: 40, pax: 150 },
  'Tripoli': { duration: '5h 00m', fuel: 40, pax: 150 },

  // Collection: Rhythm of My Heart (Thunderbird - 6h map window)
  'Excavations: Ancient India': { duration: '5h 00m', fuel: 40, pax: 150 },
  'Mumbai': { duration: '5h 00m', fuel: 40, pax: 150 },
  'Kolkata': { duration: '5h 00m', fuel: 40, pax: 150 },
  'Hyderabad': { duration: '5h 00m', fuel: 40, pax: 150 },
  'Chennai': { duration: '5h 00m', fuel: 40, pax: 150 },
  'Kanpur': { duration: '5h 00m', fuel: 40, pax: 150 },

  // Collection: City Lights (Condor - 6h map window)
  'Excavations: Ancient China': { duration: '12h 00m', fuel: 60, pax: 750 },
  'Nanjing': { duration: '12h 00m', fuel: 60, pax: 750 },
  'Luoyang': { duration: '12h 00m', fuel: 60, pax: 750 },
  'Xi\'an': { duration: '12h 00m', fuel: 60, pax: 750 },
  'Chengdu': { duration: '12h 00m', fuel: 60, pax: 750 },
  'Guangzhou': { duration: '12h 00m', fuel: 60, pax: 750 },

  // Collection: Out-of-Place Artifacts (Condor - 6h map window)
  'Excavations: North America': { duration: '12h 20m', fuel: 60, pax: 750 },
  'Los Lunas': { duration: '12h 20m', fuel: 60, pax: 750 },
  'Acámbaro': { duration: '12h 20m', fuel: 60, pax: 750 },
  'Acambaro': { duration: '12h 20m', fuel: 60, pax: 750 },
  'Moundsville': { duration: '12h 20m', fuel: 60, pax: 750 },
  'Dorchester': { duration: '12h 20m', fuel: 60, pax: 750 },
  'Meredith': { duration: '12h 20m', fuel: 60, pax: 750 },

  // ==========================================================================
  // ALLIANCE MAP FLIGHTS (50 Routes across 10 Collections - 3h map window)
  // ==========================================================================

  // Swift Alliance: How to Win Friends and Influence People (3h map window)
  'Acapulco': { duration: '30m 00s', fuel: 12, pax: 19 },
  'Tegucigalpa': { duration: '30m 00s', fuel: 12, pax: 19 },
  'Cartagena': { duration: '30m 00s', fuel: 12, pax: 19 },
  'La Paz': { duration: '30m 00s', fuel: 12, pax: 19 },
  'San Pedro Sula': { duration: '30m 00s', fuel: 12, pax: 19 },

  // Owl Alliance: I'll Think About That Tomorrow (3h map window)
  'Vaduz': { duration: '1h 00m', fuel: 14, pax: 38 },
  'Baden-Baden': { duration: '1h 00m', fuel: 14, pax: 38 },
  'Luxembourg': { duration: '1h 00m', fuel: 14, pax: 38 },
  'San Marino': { duration: '1h 00m', fuel: 14, pax: 38 },
  'Monaco': { duration: '1h 00m', fuel: 14, pax: 38 },

  // Hawk Alliance: Spic and Span (3h map window)
  'Hamburg': { duration: '3h 20m', fuel: 24, pax: 80 },
  'Munich': { duration: '3h 20m', fuel: 24, pax: 80 },
  'Stuttgart': { duration: '3h 20m', fuel: 24, pax: 80 },
  'Düsseldorf': { duration: '3h 20m', fuel: 24, pax: 80 },
  'Dusseldorf': { duration: '3h 20m', fuel: 24, pax: 80 },
  'Cologne': { duration: '3h 20m', fuel: 24, pax: 80 },

  // Raven Alliance: Time is Money (3h map window)
  'Geneva': { duration: '6h 00m', fuel: 40, pax: 160 },
  'Winterthur': { duration: '6h 00m', fuel: 40, pax: 160 },
  'Lausanne': { duration: '6h 00m', fuel: 40, pax: 160 },
  'Bern': { duration: '6h 00m', fuel: 40, pax: 160 },
  'Zürich': { duration: '6h 00m', fuel: 40, pax: 160 },
  'Zurich': { duration: '6h 00m', fuel: 40, pax: 160 },

  // Eagle Alliance: Easy Rider (3h map window)
  'Philadelphia': { duration: '8h 40m', fuel: 42, pax: 280 },
  'Denver': { duration: '8h 40m', fuel: 42, pax: 280 },
  'Rapid City': { duration: '8h 40m', fuel: 42, pax: 280 },
  'Phoenix': { duration: '8h 40m', fuel: 42, pax: 280 },
  'Des Moines': { duration: '8h 40m', fuel: 42, pax: 280 },

  // Jumbo Alliance: Need For Speed (3h map window)
  'Modena': { duration: '8h 40m', fuel: 48, pax: 380 },
  'Le Mans': { duration: '8h 40m', fuel: 48, pax: 380 },
  'Monza': { duration: '8h 40m', fuel: 48, pax: 380 },
  'Maranello': { duration: '8h 40m', fuel: 48, pax: 380 },
  'Indianapolis': { duration: '8h 40m', fuel: 48, pax: 380 },

  // Giant Alliance: Gold Reserve (3h map window)
  'San Jose': { duration: '9h 00m', fuel: 50, pax: 500 },
  'San Diego': { duration: '9h 00m', fuel: 50, pax: 500 },
  'Santa Barbara': { duration: '9h 00m', fuel: 50, pax: 500 },
  'Santa Cruz': { duration: '9h 00m', fuel: 50, pax: 500 },
  'Santa Rosa': { duration: '9h 00m', fuel: 50, pax: 500 },

  // Falcon Alliance: Royal Honors (3h map window)
  'Bath': { duration: '3h 00m', fuel: 45, pax: 350 },
  'Canterbury': { duration: '3h 00m', fuel: 45, pax: 350 },
  'Exeter': { duration: '3h 00m', fuel: 45, pax: 350 },
  'York': { duration: '3h 00m', fuel: 45, pax: 350 },
  'Norwich': { duration: '3h 00m', fuel: 45, pax: 350 },

  // Thunderbird Alliance: The Stone Guests (3h map window)
  'Rhodes': { duration: '5h 00m', fuel: 40, pax: 150 },
  'Heraklion': { duration: '5h 00m', fuel: 40, pax: 150 },
  'Patras': { duration: '5h 00m', fuel: 40, pax: 150 },
  'Thessaloniki': { duration: '5h 00m', fuel: 40, pax: 150 },
  'Corinth': { duration: '5h 00m', fuel: 40, pax: 150 },

  // Condor Alliance: Sea-Wolf (3h map window)
  'Bilbao': { duration: '12h 00m', fuel: 60, pax: 750 },
  'Seville': { duration: '12h 00m', fuel: 60, pax: 750 },
  'Granada': { duration: '12h 00m', fuel: 60, pax: 750 },
  'Córdoba': { duration: '12h 00m', fuel: 60, pax: 750 },
  'Cordoba': { duration: '12h 00m', fuel: 60, pax: 750 },
  'Alicante': { duration: '12h 00m', fuel: 60, pax: 750 },

  // ==========================================================================
  // SPACE MAP DESTINATIONS (15 Routes across 3 Collections)
  // ==========================================================================

  // Owl: The Theory of Everything (Green Space Maps - 3h map window)
  'Novosibirsk': { duration: '2h 40m', fuel: 17, pax: 38 },
  'Bangalore': { duration: '2h 40m', fuel: 17, pax: 38 },
  'Edmonton': { duration: '2h 40m', fuel: 17, pax: 38 },
  'Perth': { duration: '2h 40m', fuel: 17, pax: 38 },
  'Berkeley': { duration: '2h 40m', fuel: 17, pax: 38 },

  // Hawk: The Outer Limits (Blue Space Maps - 12h 30m map window)
  'Miami': { duration: '12h 00m', fuel: 26, pax: 80 },
  'Nagoya': { duration: '12h 00m', fuel: 26, pax: 80 },
  'Puerto Rico': { duration: '12h 00m', fuel: 28, pax: 80 },
  'Alexandria': { duration: '12h 00m', fuel: 28, pax: 80 },
  'Sacramento': { duration: '12h 00m', fuel: 28, pax: 80 },

  // Jumbo: Edge of Tomorrow (Red Space Maps - 17h map window)
  'Vienna': { duration: '16h 30m', fuel: 48, pax: 380 },
  'Potsdam': { duration: '16h 30m', fuel: 48, pax: 380 },
  'Zagreb': { duration: '16h 30m', fuel: 48, pax: 380 },
  'Glasgow': { duration: '16h 30m', fuel: 48, pax: 380 },
  'Beverly Hills': { duration: '16h 30m', fuel: 48, pax: 380 },

  // ==========================================================================
  // ALLIANCE TASK FLIGHTS (50 Routes across 10 Weekly Task Sets)
  // ==========================================================================
  // Swift: Carpe Diem
  'Dhaka': { duration: '40m 00s', fuel: 12, pax: 19 },
  'Maracay': { duration: '40m 00s', fuel: 12, pax: 19 },
  'Pattaya': { duration: '40m 00s', fuel: 12, pax: 19 },
  'Riga': { duration: '40m 00s', fuel: 12, pax: 19 },

  // Owl: Random Knick-Knacks
  'Canberra': { duration: '1h 00m', fuel: 14, pax: 38 },
  'Ouagadougou': { duration: '1h 00m', fuel: 14, pax: 38 },
  'Tel Aviv': { duration: '1h 00m', fuel: 14, pax: 38 },
  'Winnipeg': { duration: '1h 00m', fuel: 14, pax: 38 },
  'Yerevan': { duration: '1h 00m', fuel: 14, pax: 38 },

  // Hawk: Extinct Beast and Where to Find Them
  'Almaty': { duration: '3h 20m', fuel: 24, pax: 80 },
  'Jeddah': { duration: '3h 20m', fuel: 24, pax: 80 },
  'Muscat': { duration: '3h 20m', fuel: 24, pax: 80 },
  'Pretoria': { duration: '3h 20m', fuel: 24, pax: 80 },
  'Tashkent': { duration: '3h 20m', fuel: 24, pax: 80 },

  // Raven: Needful Things
  'Albuquerque': { duration: '6h 00m', fuel: 40, pax: 160 },
  'Beirut': { duration: '6h 00m', fuel: 40, pax: 160 },
  'Khartoum': { duration: '6h 00m', fuel: 40, pax: 160 },
  'Monterrey': { duration: '6h 00m', fuel: 40, pax: 160 },
  'Vilnius': { duration: '6h 00m', fuel: 40, pax: 160 },

  // Eagle: The Power of Suggestion
  'Bishkek': { duration: '8h 40m', fuel: 42, pax: 280 },
  'Dresden': { duration: '8h 40m', fuel: 42, pax: 280 },
  'Fortaleza': { duration: '8h 40m', fuel: 42, pax: 280 },
  'Santo Domingo': { duration: '8h 40m', fuel: 42, pax: 280 },
  'Varanasi': { duration: '8h 40m', fuel: 42, pax: 280 },

  // Jumbo: Night Fishing
  'Kazan': { duration: '8h 40m', fuel: 48, pax: 380 },
  'Libreville': { duration: '8h 40m', fuel: 48, pax: 380 },
  'Medina': { duration: '8h 40m', fuel: 48, pax: 380 },
  'Taipei': { duration: '8h 40m', fuel: 48, pax: 380 },
  'Tallinn': { duration: '8h 40m', fuel: 48, pax: 380 },

  // Giant: Fast Food
  'Bucharest': { duration: '9h 00m', fuel: 50, pax: 500 },
  'Casablanca': { duration: '9h 00m', fuel: 50, pax: 500 },
  'Jerusalem': { duration: '9h 00m', fuel: 50, pax: 500 },
  'Mecca': { duration: '9h 00m', fuel: 50, pax: 500 },
  'Ulaanbaatar': { duration: '9h 00m', fuel: 50, pax: 500 },

  // Falcon: Five Stars
  'Ankara': { duration: '3h 00m', fuel: 45, pax: 350 },
  'Dushanbe': { duration: '3h 00m', fuel: 45, pax: 350 },
  'Paramaribo': { duration: '3h 00m', fuel: 45, pax: 350 },
  'Toledo': { duration: '3h 00m', fuel: 45, pax: 350 },
  'Windhoek': { duration: '3h 00m', fuel: 45, pax: 350 },

  // Thunderbird: Cold Comforts
  'Ashgabat': { duration: '5h 00m', fuel: 40, pax: 150 },
  'Doha': { duration: '5h 00m', fuel: 40, pax: 150 },
  'Guatemala City': { duration: '5h 00m', fuel: 40, pax: 150 },
  'Guayaquil': { duration: '5h 00m', fuel: 40, pax: 150 },
  'Shenzhen': { duration: '5h 00m', fuel: 40, pax: 150 },

  // Condor: Dinner Party
  'Fujairah': { duration: '12h 20m', fuel: 60, pax: 750 },
  'Charlotte': { duration: '12h 20m', fuel: 60, pax: 750 },
  'Tbilisi': { duration: '12h 20m', fuel: 60, pax: 750 },
  'Toulouse': { duration: '12h 20m', fuel: 60, pax: 750 },

  // ==========================================================================
  // HELICOPTER FLIGHTS (Sparrow, Crossbill, Goldfinch)
  // ==========================================================================
  // Sparrow (Class 1 Helicopter)
  'Training Flight H': { duration: '1m 24s', fuel: 5, pax: 4 },
  'Yellowstone': { duration: '2m 48s', fuel: 5, pax: 4 },
  'Lake Baikal': { duration: '4m 12s', fuel: 5, pax: 4 },
  'Snowdonia': { duration: '5m 36s', fuel: 5, pax: 4 },
  'Fiordland': { duration: '7m 00s', fuel: 5, pax: 4 },
  'Banff': { duration: '8m 24s', fuel: 5, pax: 4 },

  // Crossbill (Class 2 Helicopter)
  'Iguazu Falls': { duration: '15m 00s', fuel: 8, pax: 6 },
  'Angel Falls': { duration: '20m 00s', fuel: 8, pax: 6 },
  'Victoria Falls': { duration: '25m 00s', fuel: 8, pax: 6 },
  'Niagara Falls': { duration: '40m 00s', fuel: 8, pax: 6 },
  'Rideau Falls': { duration: '1h 00m', fuel: 8, pax: 6 },

  // Goldfinch (Class 3 Helicopter)
  'Denali': { duration: '1h 30m', fuel: 12, pax: 9 },
  'Jaya': { duration: '2h 00m', fuel: 12, pax: 9 },
  'Aconcagua': { duration: '2h 30m', fuel: 12, pax: 9 },
  'Stanley': { duration: '3h 00m', fuel: 12, pax: 9 },
  'Mont Blanc': { duration: '3h 40m', fuel: 12, pax: 9 },

  // ==========================================================================
  // EVENT FLIGHTS & SELECT REGULAR ROUTES
  // ==========================================================================
  'Fatima': { duration: '1h 00m', fuel: 12, pax: 60 },
  'Area 51': { duration: '1h 30m', fuel: 16, pax: 80 },
  'Rovaniemi': { duration: '2h 00m', fuel: 22, pax: 120 },

  // Regular starter / iconic routes
  'Training Flight': { duration: '1m 00s', fuel: 4, pax: 12 },
  'Small Village': { duration: '3m 00s', fuel: 8, pax: 12 },
  'Giza': { duration: '10m 00s', fuel: 10, pax: 19 },
  'Giza (Egypt)': { duration: '10m 00s', fuel: 10, pax: 19 },
  'Cyprus': { duration: '20m 00s', fuel: 12, pax: 19 },
  'Antalya': { duration: '40m 00s', fuel: 12, pax: 19 },
  // Owl Regular Routes (Full In-Game Verified Roster)
  'Turkish Coast': { duration: '30m 00s', fuel: 14, pax: 38 },
  'Washington DC': { duration: '30m 00s', fuel: 14, pax: 38 },
  'Washington, D.C.': { duration: '30m 00s', fuel: 14, pax: 38 },
  'Hurghada': { duration: '45m 00s', fuel: 14, pax: 38 },
  'Hurghada (Egypt)': { duration: '45m 00s', fuel: 14, pax: 38 },
  'Fiji': { duration: '1h 00m', fuel: 14, pax: 38 },
  'Sao Paulo': { duration: '30m 00s', fuel: 14, pax: 38 },
  'São Paulo': { duration: '30m 00s', fuel: 14, pax: 38 },
  'Bali Island': { duration: '40m 00s', fuel: 16, pax: 38 },
  'Arctic Station': { duration: '40m 00s', fuel: 16, pax: 38 },
  'Goa': { duration: '1h 00m', fuel: 16, pax: 38 },
  'Malta': { duration: '1h 20m', fuel: 16, pax: 38 },
  'Cape Canaveral': { duration: '1h 20m', fuel: 16, pax: 38 },
  'Thailand': { duration: '1h 40m', fuel: 17, pax: 38 },
  'San Francisco': { duration: '2h 00m', fuel: 18, pax: 38 },

  // Hawk Regular Routes (Full In-Game Verified Roster)
  'Rome': { duration: '3h 00m', fuel: 22, pax: 80 },
  'Los Angeles': { duration: '3h 00m', fuel: 22, pax: 80 },
  'Corsica': { duration: '3h 00m', fuel: 22, pax: 80 },
  'Madagascar': { duration: '3h 00m', fuel: 22, pax: 80 },
  'Baikonur': { duration: '3h 00m', fuel: 22, pax: 80 },
  'Aswan': { duration: '3h 00m', fuel: 22, pax: 80 },
  'Aswan (Egypt)': { duration: '3h 00m', fuel: 22, pax: 80 },
  'London': { duration: '3h 20m', fuel: 24, pax: 80 },
  'Canary Islands': { duration: '3h 40m', fuel: 24, pax: 80 },
  'North Observatory': { duration: '4h 00m', fuel: 24, pax: 80 },
  'Singapore': { duration: '4h 00m', fuel: 24, pax: 80 },
  'Rio': { duration: '4h 20m', fuel: 26, pax: 80 },
  'Sydney': { duration: '4h 40m', fuel: 28, pax: 80 },
  'Saint Petersburg': { duration: '4h 40m', fuel: 28, pax: 80 },

  // Raven Regular Routes (Full In-Game Verified Roster)
  'Nice': { duration: '5h 00m', fuel: 30, pax: 160 },
  'Easter Island': { duration: '5h 00m', fuel: 30, pax: 160 },
  'South Observatory': { duration: '5h 00m', fuel: 30, pax: 160 },
  'Lima': { duration: '5h 00m', fuel: 30, pax: 160 },
  'Dubai': { duration: '5h 20m', fuel: 32, pax: 160 },
  'Dubai (UAE)': { duration: '5h 20m', fuel: 32, pax: 160 },
  'Sharm El Sheikh': { duration: '5h 40m', fuel: 34, pax: 160 },
  'Sharm El Sheikh (Egypt)': { duration: '5h 40m', fuel: 34, pax: 160 },
  'Moscow': { duration: '5h 40m', fuel: 34, pax: 160 },
  'New York': { duration: '6h 00m', fuel: 36, pax: 160 },
  'Paris': { duration: '6h 20m', fuel: 38, pax: 160 },
  'Seoul': { duration: '6h 40m', fuel: 40, pax: 160 },
  'Barcelona': { duration: '6h 40m', fuel: 40, pax: 160 },
  // Eagle Regular Routes (Full In-Game Verified Roster)
  'Shanghai': { duration: '7h 00m', fuel: 42, pax: 280 },
  'Phuket': { duration: '7h 00m', fuel: 42, pax: 280 },
  'Tasmania': { duration: '7h 00m', fuel: 42, pax: 280 },
  'Chicago': { duration: '7h 00m', fuel: 42, pax: 280 },
  'Delhi': { duration: '7h 20m', fuel: 42, pax: 280 },
  'Sharjah': { duration: '7h 30m', fuel: 42, pax: 280 },
  'Sharjah (UAE)': { duration: '7h 30m', fuel: 42, pax: 280 },
  'Hong Kong': { duration: '7h 40m', fuel: 42, pax: 280 },
  'Iceland': { duration: '8h 00m', fuel: 42, pax: 280 },
  'Nepal': { duration: '8h 20m', fuel: 42, pax: 280 },
  'Antarctic': { duration: '8h 40m', fuel: 42, pax: 280 },
  'Las Vegas': { duration: '8h 40m', fuel: 42, pax: 280 },
  'Brasília': { duration: '8h 40m', fuel: 42, pax: 280 },
  'Brasilia': { duration: '8h 40m', fuel: 42, pax: 280 },
  // Jumbo Regular Routes (Full In-Game Verified Roster)
  'Berlin': { duration: '8h 00m', fuel: 48, pax: 380 },
  'Komodo': { duration: '8h 00m', fuel: 48, pax: 380 },
  'Jiuquan': { duration: '8h 00m', fuel: 48, pax: 380 },
  'Bora-Bora': { duration: '8h 00m', fuel: 48, pax: 380 },
  'Houston': { duration: '8h 00m', fuel: 48, pax: 380 },
  'Mexico City': { duration: '8h 20m', fuel: 48, pax: 380 },
  'Hawaiian Islands': { duration: '8h 20m', fuel: 48, pax: 380 },
  'Amsterdam': { duration: '8h 20m', fuel: 48, pax: 380 },
  'Tokyo': { duration: '8h 20m', fuel: 48, pax: 380 },
  'Seattle': { duration: '8h 40m', fuel: 48, pax: 380 },
  'Santiago': { duration: '8h 40m', fuel: 48, pax: 380 },
  'Montreal': { duration: '8h 40m', fuel: 48, pax: 380 },
  'Vladivostok': { duration: '8h 40m', fuel: 48, pax: 380 },
  'Abu Dhabi': { duration: '8h 40m', fuel: 48, pax: 380 },
  'Abu Dhabi (UAE)': { duration: '8h 40m', fuel: 48, pax: 380 },
  'Quito': { duration: '8h 40m', fuel: 48, pax: 380 },
  // Giant Regular Routes (Full In-Game Verified Roster)
  'Caracas': { duration: '9h 00m', fuel: 50, pax: 500 },
  'Majorca': { duration: '9h 00m', fuel: 50, pax: 500 },
  'Plesetsk': { duration: '9h 00m', fuel: 50, pax: 500 },
  'Oslo': { duration: '9h 00m', fuel: 50, pax: 500 },
  'Johannesburg': { duration: '9h 00m', fuel: 50, pax: 500 },
  'Toronto': { duration: '9h 00m', fuel: 50, pax: 500 },
  'Madeira': { duration: '9h 00m', fuel: 50, pax: 500 },
  'Tortuga': { duration: '9h 00m', fuel: 50, pax: 500 },
  'Helsinki': { duration: '9h 00m', fuel: 50, pax: 500 },
  'Melbourne': { duration: '9h 00m', fuel: 50, pax: 500 },
  'Havana': { duration: '9h 00m', fuel: 50, pax: 500 },
  'Yokohama': { duration: '9h 00m', fuel: 50, pax: 500 },
  'Austin': { duration: '9h 00m', fuel: 50, pax: 500 },
  'Ras Al Khaimah': { duration: '9h 00m', fuel: 50, pax: 500 },
  'Ras Al Khaimah (UAE)': { duration: '9h 00m', fuel: 50, pax: 500 },
  // Falcon Regular Routes (Full In-Game Verified Roster)
  'Mogadishu': { duration: '3h 00m', fuel: 45, pax: 350 },
  'Zanzibar': { duration: '3h 00m', fuel: 45, pax: 350 },
  'Ibiza': { duration: '3h 00m', fuel: 45, pax: 350 },
  'Yekaterinburg': { duration: '3h 00m', fuel: 45, pax: 350 },
  'Anchorage': { duration: '3h 00m', fuel: 45, pax: 350 },
  'Lisbon': { duration: '3h 00m', fuel: 45, pax: 350 },
  'Jeju Island': { duration: '3h 00m', fuel: 45, pax: 350 },
  'Montevideo': { duration: '3h 00m', fuel: 45, pax: 350 },
  'Dakar': { duration: '3h 00m', fuel: 45, pax: 350 },
  'Frankfurt': { duration: '3h 00m', fuel: 45, pax: 350 },
  'Minneapolis': { duration: '3h 00m', fuel: 45, pax: 350 },
  'Beijing': { duration: '3h 00m', fuel: 45, pax: 350 },
  'Stockholm': { duration: '3h 00m', fuel: 45, pax: 350 },
  // Thunderbird Regular Routes (Full In-Game Verified Roster)
  'Pyongyang': { duration: '5h 00m', fuel: 40, pax: 150 },
  'Mauritius': { duration: '5h 00m', fuel: 40, pax: 150 },
  'Belize': { duration: '5h 00m', fuel: 40, pax: 150 },
  'Busan': { duration: '5h 00m', fuel: 40, pax: 150 },
  'Aruba': { duration: '5h 00m', fuel: 40, pax: 150 },
  'Osaka': { duration: '5h 00m', fuel: 40, pax: 150 },
  'Boston': { duration: '5h 00m', fuel: 40, pax: 150 },
  'Tehran': { duration: '5h 00m', fuel: 40, pax: 150 },
  'Baghdad': { duration: '5h 00m', fuel: 40, pax: 150 },
  'Damascus': { duration: '5h 00m', fuel: 40, pax: 150 },
  'Riyadh': { duration: '5h 00m', fuel: 40, pax: 150 },
  'Kabul': { duration: '5h 00m', fuel: 40, pax: 150 },
  'Jakarta': { duration: '5h 00m', fuel: 40, pax: 150 },
  // Condor Regular Routes (Full In-Game Verified Roster)
  'Macau': { duration: '12h 00m', fuel: 60, pax: 750 },
  'Jamaica': { duration: '12h 00m', fuel: 60, pax: 750 },
  'Kathmandu': { duration: '12h 20m', fuel: 60, pax: 750 },
  'Guadalajara': { duration: '12h 00m', fuel: 60, pax: 750 },
  'Hainan': { duration: '12h 00m', fuel: 60, pax: 750 },
  'New Orleans': { duration: '12h 00m', fuel: 60, pax: 750 },
  'Kuala Lumpur': { duration: '12h 00m', fuel: 60, pax: 750 },
  'Kansas City': { duration: '12h 00m', fuel: 60, pax: 750 },
  'Budapest': { duration: '12h 20m', fuel: 60, pax: 750 },
  'Lagos': { duration: '12h 20m', fuel: 60, pax: 750 },
  'Prague': { duration: '12h 20m', fuel: 60, pax: 750 },
  'Karachi': { duration: '12h 20m', fuel: 60, pax: 750 },
  'Dallas': { duration: '12h 20m', fuel: 60, pax: 750 },
  'Bangor': { duration: '12h 20m', fuel: 60, pax: 750 },
};

/**
 * Fallback defaults by aircraft tier when an individual destination has not been explicitly logged.
 */
export const TIER_BASE_DURATIONS: Record<string, DestinationFlightSpec> = {
  Swift: { duration: '20m', fuel: 10, pax: 19 },
  Swallow: { duration: '2m', fuel: 6, pax: 12 },
  Owl: { duration: '1h 00m', fuel: 16, pax: 38 },
  Hawk: { duration: '3h 30m', fuel: 24, pax: 80 },
  Raven: { duration: '5h 45m', fuel: 34, pax: 160 },
  Eagle: { duration: '7h 30m', fuel: 42, pax: 280 },
  Jumbo: { duration: '8h 20m', fuel: 48, pax: 380 },
  Giant: { duration: '9h 00m', fuel: 50, pax: 500 },
  Falcon: { duration: '3h 00m', fuel: 45, pax: 350 },
  Thunderbird: { duration: '5h 00m', fuel: 40, pax: 150 },
  Condor: { duration: '12h 10m', fuel: 60, pax: 750 },
  Sparrow: { duration: '5m 00s', fuel: 5, pax: 4 },
  Crossbill: { duration: '25m 00s', fuel: 8, pax: 6 },
  Goldfinch: { duration: '2h 00m', fuel: 12, pax: 9 },
};

/**
 * Converts a duration string like "1h 30m", "45m", "30s" into total minutes (fractional allowed).
 */
export function parseDurationToMinutes(durationStr?: string): number {
  if (!durationStr) return 0;
  let total = 0;
  const dMatch = durationStr.match(/(\d+)\s*d/i);
  const hMatch = durationStr.match(/(\d+)\s*h/i);
  const mMatch = durationStr.match(/(\d+)\s*m/i);
  const sMatch = durationStr.match(/(\d+)\s*s/i);

  if (dMatch) total += parseInt(dMatch[1], 10) * 1440;
  if (hMatch) total += parseInt(hMatch[1], 10) * 60;
  if (mMatch) total += parseInt(mMatch[1], 10);
  if (sMatch) total += parseInt(sMatch[1], 10) / 60;

  if (!dMatch && !hMatch && !mMatch && !sMatch && !isNaN(Number(durationStr))) {
    total += Number(durationStr);
  }
  return total;
}

/**
 * Formats a duration in minutes back to human-readable format like "1h 35m" or "45m".
 */
export function formatMinutesToDuration(totalMinutes: number): string {
  if (totalMinutes <= 0) return '0m';
  if (totalMinutes < 1) {
    const seconds = Math.round(totalMinutes * 60);
    return `${seconds}s`;
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${String(minutes).padStart(2, '0')}m`;
}

/**
 * Resolves the flight spec (duration, fuel, pax) for a destination:
 * 1. User custom profile overrides -> 2. Destination registry -> 3. Tier fallback
 */
export function getDestinationFlightSpec(
  destinationName: string,
  aircraftType: string,
  userOverrides?: Record<string, string>
): { spec: DestinationFlightSpec; isEstimate: boolean } {
  if (userOverrides && userOverrides[destinationName]) {
    return {
      spec: { duration: userOverrides[destinationName] },
      isEstimate: false,
    };
  }

  if (DESTINATION_FLIGHT_TIMES[destinationName]) {
    return {
      spec: DESTINATION_FLIGHT_TIMES[destinationName],
      isEstimate: false,
    };
  }

  const fallback = TIER_BASE_DURATIONS[aircraftType] || { duration: '2h 00m', fuel: 20, pax: 100 };
  return {
    spec: fallback,
    isEstimate: true,
  };
}
