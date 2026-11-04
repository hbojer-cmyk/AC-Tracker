// missionsData.ts - Registry for Airport City special prize missions & grand landmarks

export interface MissionReward {
  name: string;
  category: string;
  bonus: string;
  radius: number | string;
  coins: string;
  image: string;
  statsImage?: string;
}

export interface MissionItem {
  id: string;
  name: string;
  destination: string;
  aircraft: string;
  required: number;
}

export interface Mission {
  id: string;
  name: string;
  reward: MissionReward;
  totalRequired: number;
  maxCompletions: number; // In Airport City, missions can be completed up to 6 times
  items: MissionItem[];
}

export const MISSIONS_LIST: Mission[] = [
  // -------------------------------------------------------------
  // 1. OWL CLASS (Class 2)
  // -------------------------------------------------------------
  {
    id: 'aztec-pyramid',
    name: 'Aztec Pyramid',
    reward: {
      name: 'Aztec Pyramid',
      category: 'Collectible',
      bonus: '+50 Max Pop',
      radius: '3x3',
      coins: '1 collectible item / 24h',
      image: 'icons/missions/aztec_pyramid.jpg',
    },
    totalRequired: 30,
    maxCompletions: 6,
    items: [
      { id: 'aztec-obsidian-knife', name: 'Obsidian Knife', destination: 'Tollan', aircraft: 'Owl', required: 6 },
      { id: 'aztec-bird-helmet', name: 'Bird Helmet', destination: 'Chichen Itza', aircraft: 'Owl', required: 6 },
      { id: 'aztec-bas-relief-inca', name: 'Bas-Relief of the Inca', destination: 'Machu Picchu', aircraft: 'Owl', required: 6 },
      { id: 'aztec-two-headed-serpent', name: 'Two Headed Serpent', destination: 'Tenochtitlan', aircraft: 'Owl', required: 6 },
      { id: 'aztec-quetzalcoatl', name: 'Quetzalcoatl', destination: 'Quetzalcoatl Temple', aircraft: 'Owl', required: 6 },
    ],
  },

  // -------------------------------------------------------------
  // 2. HAWK CLASS (Class 3)
  // -------------------------------------------------------------
  {
    id: 'colosseum',
    name: 'Colosseum',
    reward: {
      name: 'Colosseum',
      category: 'Collectible',
      bonus: '+50 Max Pop',
      radius: '3x3',
      coins: '1 collectible item / 24h',
      image: 'icons/missions/colosseum_render.png',
    },
    totalRequired: 30,
    maxCompletions: 6,
    items: [
      { id: 'colo-bacchus-chalice', name: "Bacchus' Chalice", destination: 'Constantinople', aircraft: 'Hawk', required: 6 },
      { id: 'colo-minerva-book', name: "Minerva's Book", destination: 'Carthage', aircraft: 'Hawk', required: 6 },
      { id: 'colo-diana-bow', name: "Diana's Bow", destination: 'Veii', aircraft: 'Hawk', required: 6 },
      { id: 'colo-mars-spear', name: "Mars' Spear", destination: 'Ephesus', aircraft: 'Hawk', required: 6 },
      { id: 'colo-mercury-purse', name: "Mercury's Purse", destination: 'Merida', aircraft: 'Hawk', required: 6 },
    ],
  },

  // -------------------------------------------------------------
  // 3. RAVEN CLASS (Class 4)
  // -------------------------------------------------------------
  {
    id: 'stonehenge',
    name: 'Stonehenge',
    reward: {
      name: 'Stonehenge',
      category: 'Collectible',
      bonus: '+50 Max Pop',
      radius: '3x3',
      coins: '1 collectible item / 24h',
      image: 'icons/missions/stonehenge.png',
    },
    totalRequired: 30,
    maxCompletions: 6,
    items: [
      { id: 'stonehenge-amulet-of-cernunnos', name: 'Amulet of Cernunnos', destination: 'Avaricum', aircraft: 'Raven', required: 6 },
      { id: 'stonehenge-deer-helmet', name: 'Deer Helmet', destination: 'Gergovie', aircraft: 'Raven', required: 6 },
      { id: 'stonehenge-healing-herbs', name: 'Healing Herbs', destination: 'Bibracte', aircraft: 'Raven', required: 6 },
      { id: 'stonehenge-druid-sickle', name: 'Druid Sickle', destination: 'Alesia', aircraft: 'Raven', required: 6 },
      { id: 'stonehenge-druid-staff', name: 'Druid Staff', destination: 'Londinium', aircraft: 'Raven', required: 6 },
    ],
  },

  // -------------------------------------------------------------
  // 4. EAGLE CLASS (Class 5)
  // -------------------------------------------------------------
  {
    id: 'sphinx',
    name: 'Sphinx',
    reward: {
      name: 'Sphinx',
      category: 'Collectible',
      bonus: '+50 Max Pop',
      radius: '3x3',
      coins: '1 collectible item / 24h',
      image: 'icons/missions/sphinx.png',
    },
    totalRequired: 30,
    maxCompletions: 6,
    items: [
      { id: 'sphinx-pschent', name: 'Pschent', destination: 'Cairo', aircraft: 'Eagle', required: 6 },
      { id: 'sphinx-nemes', name: 'Nemes', destination: 'Memphis', aircraft: 'Eagle', required: 6 },
      { id: 'sphinx-royal-crook', name: 'Royal Crook', destination: 'Luxor', aircraft: 'Eagle', required: 6 },
      { id: 'sphinx-royal-flail', name: 'Royal Flail', destination: 'Kom Ombo', aircraft: 'Eagle', required: 6 },
      { id: 'sphinx-was-sceptre', name: 'Was Sceptre', destination: 'Heliopolis', aircraft: 'Eagle', required: 6 },
    ],
  },

  // -------------------------------------------------------------
  // 5–7. JUMBO CLASS (Class 6)
  // -------------------------------------------------------------
  {
    id: 'ancient-greek-temple',
    name: 'Ancient Greek Temple',
    reward: {
      name: 'Ancient Greek Temple',
      category: 'Collectible',
      bonus: '+50 Max Pop',
      radius: '3x3',
      coins: '1 collectible item / 24h',
      image: 'icons/missions/ancient_greek_temple.png',
    },
    totalRequired: 30,
    maxCompletions: 6,
    items: [
      { id: 'greek-sandals-of-hermes', name: 'Sandals of Hermes', destination: 'Troy', aircraft: 'Jumbo', required: 6 },
      { id: 'greek-hammer-of-hephaestus', name: 'Hammer of Hephaestus', destination: 'Thebes', aircraft: 'Jumbo', required: 6 },
      { id: 'greek-trident-of-poseidon', name: 'Trident of Poseidon', destination: 'Delphi', aircraft: 'Jumbo', required: 6 },
      { id: 'greek-helm-of-athena', name: 'Helm of Athena', destination: 'Athens', aircraft: 'Jumbo', required: 6 },
      { id: 'greek-girdle-of-aphrodite', name: 'Girdle of Aphrodite', destination: 'Sparta', aircraft: 'Jumbo', required: 6 },
    ],
  },
  {
    id: 'odessa-opera-and-ballet-theater',
    name: 'Odessa Opera and Ballet Theater',
    reward: {
      name: 'Odessa Opera and Ballet Theater',
      category: 'Collectible',
      bonus: '+50 Max Pop',
      radius: '3x3',
      coins: '1 collectible item / 24h',
      image: 'icons/missions/odessa_opera_and_ballet_theater.png',
    },
    totalRequired: 30,
    maxCompletions: 6,
    items: [
      { id: 'davinci-leonardos-parachute', name: "Leonardo's Parachute", destination: 'Vinci', aircraft: 'Jumbo', required: 6 },
      { id: 'davinci-war-machine', name: 'War Machine', destination: 'Florence', aircraft: 'Jumbo', required: 6 },
      { id: 'davinci-flyer', name: 'Flyer', destination: 'Valencia', aircraft: 'Jumbo', required: 6 },
      { id: 'davinci-machine', name: 'Machine', destination: 'Caprese', aircraft: 'Jumbo', required: 6 },
      { id: 'davinci-crossbow', name: 'Crossbow', destination: 'Siena', aircraft: 'Jumbo', required: 6 },
    ],
  },
  {
    id: 'egeskov-castle',
    name: 'Egeskov Castle',
    reward: {
      name: 'Egeskov Castle',
      category: 'Collectible',
      bonus: '+50 Max Pop',
      radius: '3x3',
      coins: '1 collectible item / 24h',
      image: 'icons/missions/egeskov_castle.png',
    },
    totalRequired: 30,
    maxCompletions: 6,
    items: [
      { id: 'norse-brisingamen', name: 'Brisingamen', destination: 'Bergen', aircraft: 'Jumbo', required: 6 },
      { id: 'norse-gungnir', name: 'Gungnir', destination: 'Uppsala', aircraft: 'Jumbo', required: 6 },
      { id: 'norse-gjallarhorn', name: 'Gjallarhorn', destination: 'Trondheim', aircraft: 'Jumbo', required: 6 },
      { id: 'norse-mjolnir', name: 'Mjölnir', destination: 'Skara', aircraft: 'Jumbo', required: 6 },
      { id: 'norse-draupnir', name: 'Draupnir', destination: 'Helsingborg', aircraft: 'Jumbo', required: 6 },
    ],
  },

  // -------------------------------------------------------------
  // 8–10. GIANT CLASS (Class 7)
  // -------------------------------------------------------------
  {
    id: 'winter-palace',
    name: 'Winter Palace',
    reward: {
      name: 'Winter Palace',
      category: 'Collectible',
      bonus: '+50 Max Pop',
      radius: '3x3',
      coins: '1 collectible item / 24h',
      image: 'icons/missions/winter_palace.png',
    },
    totalRequired: 30,
    maxCompletions: 6,
    items: [
      { id: 'winter-birch-bark-scroll', name: 'Birch-Bark Scroll', destination: 'Kyiv', aircraft: 'Giant', required: 6 },
      { id: 'winter-slavic-pitcher', name: 'Slavic Pitcher', destination: 'Novgorod', aircraft: 'Giant', required: 6 },
      { id: 'winter-drinking-horn', name: 'Drinking Horn', destination: 'Murom', aircraft: 'Giant', required: 6 },
      { id: 'winter-talisman', name: 'Talisman', destination: 'Smolensk', aircraft: 'Giant', required: 6 },
      { id: 'winter-temple-ring', name: 'Temple Ring', destination: 'Chernihiv', aircraft: 'Giant', required: 6 },
    ],
  },
  {
    id: 'moai-statues',
    name: 'Moai Statues',
    reward: {
      name: 'Moai Statues',
      category: 'Collectible',
      bonus: '+50 Max Pop',
      radius: '3x3',
      coins: '1 collectible item / 24h',
      image: 'icons/missions/moai_statues.png',
    },
    totalRequired: 30,
    maxCompletions: 6,
    items: [
      { id: 'moai-hei-tiki', name: 'Hei-tiki', destination: 'Samoa', aircraft: 'Giant', required: 6 },
      { id: 'moai-maori-mask', name: 'Maori Mask', destination: 'Wellington', aircraft: 'Giant', required: 6 },
      { id: 'moai-jade-amulet', name: 'Jade Amulet', destination: 'Tahiti', aircraft: 'Giant', required: 6 },
      { id: 'moai-ceremonial-adze', name: 'Ceremonial Adze', destination: 'Honolulu', aircraft: 'Giant', required: 6 },
      { id: 'moai-dagger', name: 'Dagger', destination: 'Funafuti', aircraft: 'Giant', required: 6 },
    ],
  },
  {
    id: 'sagrada-familia',
    name: 'Sagrada Familia',
    reward: {
      name: 'Sagrada Familia',
      category: 'Collectible',
      bonus: '+50 Max Pop',
      radius: '3x3',
      coins: '1 collectible item / 24h',
      image: 'icons/missions/sagrada_familia.png',
    },
    totalRequired: 30,
    maxCompletions: 6,
    items: [
      { id: 'trans-handbook', name: 'Transmutation Handbook', destination: 'Strasbourg', aircraft: 'Giant', required: 6 },
      { id: 'trans-alembic', name: 'Alembic', destination: 'Basel', aircraft: 'Giant', required: 6 },
      { id: 'trans-mortar', name: 'Mortar', destination: 'Montpelier', aircraft: 'Giant', required: 6 },
      { id: 'trans-liquid-gold', name: 'Liquid Gold', destination: 'Zaragoza', aircraft: 'Giant', required: 6 },
      { id: 'trans-aqua-regia', name: 'Aqua Regia', destination: 'Salzburg', aircraft: 'Giant', required: 6 },
    ],
  },

  // -------------------------------------------------------------
  // 11–12. FALCON CLASS (Class 8)
  // -------------------------------------------------------------
  {
    id: 'stone-skyscraper',
    name: 'Stone Skyscraper',
    reward: {
      name: 'Stone Skyscraper',
      category: 'Collectible',
      bonus: '+50 Max Pop',
      radius: '3x3',
      coins: '1 collectible item / 24h',
      image: 'icons/missions/stone_skyscraper.png',
    },
    totalRequired: 30,
    maxCompletions: 6,
    items: [
      { id: 'twenties-suit', name: 'Suit', destination: 'Manhattan', aircraft: 'Falcon', required: 6 },
      { id: 'twenties-fedora', name: 'Fedora', destination: 'Brooklyn', aircraft: 'Falcon', required: 6 },
      { id: 'twenties-tommy-gun', name: 'Tommy Gun', destination: 'Queens', aircraft: 'Falcon', required: 6 },
      { id: 'twenties-switchblade', name: 'Switchblade', destination: 'Bronx', aircraft: 'Falcon', required: 6 },
      { id: 'twenties-brogues', name: 'Brogues', destination: 'Staten Island', aircraft: 'Falcon', required: 6 },
    ],
  },
  {
    id: 'tower-of-babel',
    name: 'Tower of Babel',
    reward: {
      name: 'Tower of Babel',
      category: 'Collectible',
      bonus: '+50 Max Pop',
      radius: '3x3',
      coins: '1 collectible item / 24h',
      image: 'icons/missions/tower_of_babel.png',
    },
    totalRequired: 30,
    maxCompletions: 6,
    items: [
      { id: 'babel-clay-slab', name: 'Clay Slab', destination: 'Assur', aircraft: 'Falcon', required: 6 },
      { id: 'babel-reed-straw', name: 'Reed Straw', destination: 'Lagash', aircraft: 'Falcon', required: 6 },
      { id: 'babel-clay-token', name: 'Clay Token', destination: 'Nineveh', aircraft: 'Falcon', required: 6 },
      { id: 'babel-cylinder-seal', name: 'Cylinder Seal', destination: 'Ur', aircraft: 'Falcon', required: 6 },
      { id: 'babel-ideogram', name: 'Ideogram', destination: 'Babylon', aircraft: 'Falcon', required: 6 },
    ],
  },

  // -------------------------------------------------------------
  // 13–14. THUNDERBIRD CLASS (Class 9)
  // -------------------------------------------------------------
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    reward: {
      name: 'Taj Mahal',
      category: 'Collectible',
      bonus: '+50 Max Pop',
      radius: '3x3',
      coins: '1 collectible item / 24h',
      image: 'icons/missions/taj_mahal.png',
    },
    totalRequired: 30,
    maxCompletions: 6,
    items: [
      { id: 'taj-sitar', name: 'Sitar', destination: 'Mumbai', aircraft: 'Thunderbird', required: 6 },
      { id: 'taj-veena', name: 'Veena', destination: 'Kolkata', aircraft: 'Thunderbird', required: 6 },
      { id: 'taj-bansuri', name: 'Bansuri', destination: 'Hyderabad', aircraft: 'Thunderbird', required: 6 },
      { id: 'taj-tabla', name: 'Tabla', destination: 'Chennai', aircraft: 'Thunderbird', required: 6 },
      { id: 'taj-sarangi', name: 'Sarangi', destination: 'Kanpur', aircraft: 'Thunderbird', required: 6 },
    ],
  },
  {
    id: 'great-pyramid',
    name: 'Great Pyramid',
    reward: {
      name: 'Great Pyramid',
      category: 'Collectible',
      bonus: '+50 Max Pop',
      radius: '3x3',
      coins: '1 collectible item / 24h',
      image: 'icons/missions/great_pyramid.png',
    },
    totalRequired: 30,
    maxCompletions: 6,
    items: [
      { id: 'dawn-afropithecus', name: 'Afropithecus', destination: 'Timbuktu', aircraft: 'Thunderbird', required: 6 },
      { id: 'dawn-australopithecus', name: 'Australopithecus', destination: 'Cirta', aircraft: 'Thunderbird', required: 6 },
      { id: 'dawn-homo-habilis', name: 'Homo Habilis', destination: 'Tipaza', aircraft: 'Thunderbird', required: 6 },
      { id: 'dawn-homo-rudolfensis', name: 'Homo Rudolfensis', destination: 'Nairobi', aircraft: 'Thunderbird', required: 6 },
      { id: 'dawn-homo-erectus', name: 'Homo Erectus', destination: 'Tripoli', aircraft: 'Thunderbird', required: 6 },
    ],
  },

  // -------------------------------------------------------------
  // 15–16. CONDOR CLASS (Class 10)
  // -------------------------------------------------------------
  {
    id: 'temple-of-ah-cacao',
    name: 'Temple of Ah Cacao',
    reward: {
      name: 'Temple of Ah Cacao',
      category: 'Collectible',
      bonus: '+50 Max Pop',
      radius: '3x3',
      coins: '1 collectible item / 24h',
      image: 'icons/missions/temple_of_ah_cacao.png',
    },
    totalRequired: 30,
    maxCompletions: 6,
    items: [
      { id: 'cacao-decalogue-stone', name: 'Decalogue Stone', destination: 'Los Lunas', aircraft: 'Condor', required: 6 },
      { id: 'cacao-acambaro-stone', name: 'Acambaro Stone', destination: 'Acámbaro', aircraft: 'Condor', required: 6 },
      { id: 'cacao-grave-creek-stone', name: 'Grave Creek Stone', destination: 'Moundsville', aircraft: 'Condor', required: 6 },
      { id: 'cacao-dorchester-pot', name: 'Dorchester Pot', destination: 'Dorchester', aircraft: 'Condor', required: 6 },
      { id: 'cacao-winnipesaukee-stone', name: 'Winnipesaukee Stone', destination: 'Meredith', aircraft: 'Condor', required: 6 },
    ],
  },
  {
    id: 'forbidden-city',
    name: 'Forbidden City',
    reward: {
      name: 'Forbidden City',
      category: 'Collectible',
      bonus: '+50 Max Pop',
      radius: '3x3',
      coins: '1 collectible item / 24h',
      image: 'icons/missions/forbidden_city.png',
    },
    totalRequired: 30,
    maxCompletions: 6,
    items: [
      { id: 'china-jade-statue', name: 'Jade Statue', destination: 'Chengdu', aircraft: 'Condor', required: 6 },
      { id: 'china-silk-scroll', name: 'Silk Scroll', destination: 'Guangzhou', aircraft: 'Condor', required: 6 },
      { id: 'china-porcelain-vase', name: 'Porcelain Vase', destination: 'Luoyang', aircraft: 'Condor', required: 6 },
      { id: 'china-bronze-bell', name: 'Bronze Bell', destination: 'Nanjing', aircraft: 'Condor', required: 6 },
      { id: 'china-terracotta-warrior', name: 'Terracotta Warrior', destination: "Xi'an", aircraft: 'Condor', required: 6 },
    ],
  },

  // -------------------------------------------------------------
  // 17–19. META-COLLECTIONS (N/A Aircraft • Ordered by Collection Tiers)
  // -------------------------------------------------------------
  {
    id: 'the-louvre',
    name: 'The Louvre',
    reward: {
      name: 'The Louvre',
      category: 'Collectible',
      bonus: '+50 Max Pop',
      radius: '3x3',
      coins: '1 collectible item / 24h',
      image: 'icons/missions/the_louvre.png',
    },
    totalRequired: 30,
    maxCompletions: 6,
    items: [
      { id: 'sands-sacred-mask', name: 'Sacred Mask', destination: 'Aztec Legacy Collection', aircraft: 'N/A', required: 6 },
      { id: 'sands-druid-horoscope', name: 'Druid Horoscope', destination: 'Guardians of the Forest Collection', aircraft: 'N/A', required: 6 },
      { id: 'sands-chariot-of-zeus', name: 'Chariot of Zeus', destination: 'The Ancient World Collection', aircraft: 'N/A', required: 6 },
      { id: 'sands-augustus-prima-porta', name: 'Augustus of Prima Porta', destination: 'Roman Holiday Collection', aircraft: 'N/A', required: 6 },
      { id: 'sands-sarcophagus', name: 'Sarcophagus', destination: 'Riddles of the Pharaohs Collection', aircraft: 'N/A', required: 6 },
    ],
  },
  {
    id: 'notre-dame-de-paris',
    name: 'Notre Dame de Paris',
    reward: {
      name: 'Notre Dame de Paris',
      category: 'Collectible',
      bonus: '+50 Max Pop',
      radius: '3x3',
      coins: '1 collectible item / 24h',
      image: 'icons/missions/notre_dame_de_paris.png',
    },
    totalRequired: 30,
    maxCompletions: 6,
    items: [
      { id: 'voices-vitruvian-man', name: 'Vitruvian Man', destination: 'Da Vinci the Genius Collection', aircraft: 'N/A', required: 6 },
      { id: 'voices-skidbladnir', name: 'Skidbladnir', destination: 'Treasures of Asgard Collection', aircraft: 'N/A', required: 6 },
      { id: 'voices-lead-seal', name: 'Lead Seal', destination: 'Tale of Bygone Years Collection', aircraft: 'N/A', required: 6 },
      { id: 'voices-tiki-statue', name: 'Tiki Statue', destination: 'Polynesian Triangle Collection', aircraft: 'N/A', required: 6 },
      { id: 'voices-philosophers-stone', name: "Philosopher's Stone", destination: 'The Art of Transmutation Collection', aircraft: 'N/A', required: 6 },
    ],
  },
  {
    id: 'the-kremlin',
    name: 'The Kremlin',
    reward: {
      name: 'The Kremlin',
      category: 'Collectible',
      bonus: '+50 Max Pop',
      radius: '3x3',
      coins: '1 collectible item / 24h',
      image: 'icons/missions/the_kremlin.png',
    },
    totalRequired: 30,
    maxCompletions: 6,
    items: [
      { id: 'wheel-mystery-case', name: 'Mystery Case', destination: 'The Roaring Twenties Collection', aircraft: 'N/A', required: 6 },
      { id: 'wheel-kish-tablet', name: 'Kish Tablet', destination: 'Writing on the Wall Collection', aircraft: 'N/A', required: 6 },
      { id: 'wheel-origin-of-species', name: 'On the Origin of the Species', destination: 'The Dawn of Man Collection', aircraft: 'N/A', required: 6 },
      { id: 'wheel-nataraja-sculpture', name: 'Nataraja Sculpture', destination: 'Rhythm of My Heart Collection', aircraft: 'N/A', required: 6 },
      { id: 'wheel-chinese-fireworks', name: 'Chinese Fireworks', destination: 'City Lights Collection', aircraft: 'N/A', required: 6 },
    ],
  },

  // -------------------------------------------------------------
  // 20. GRAND COMMERCE: REGIONAL TIER (Swift -> Eagle, 250 Items)
  // -------------------------------------------------------------
  {
    id: 'tower-of-london',
    name: 'Tower of London',
    reward: {
      name: 'Tower of London',
      category: 'Commerce',
      bonus: '+25%',
      radius: 2,
      coins: '600 / 01d 00h',
      image: 'icons/missions/tower_of_london_render.png',
      statsImage: 'icons/missions/tower_of_london_stats.jpg',
    },
    totalRequired: 250,
    maxCompletions: 6,
    items: [
      { id: 'london-selfie-drone', name: 'Selfie Drone', destination: 'Antalya', aircraft: 'Swift', required: 10 },
      { id: 'london-neon-glasses', name: 'Neon Glasses', destination: 'Pattaya', aircraft: 'Swift', required: 10 },
      { id: 'london-smartphone-lens', name: 'Smartphone Lens', destination: 'Riga', aircraft: 'Swift', required: 10 },
      { id: 'london-selfie-stick', name: 'Selfie Stick', destination: 'Maracay', aircraft: 'Swift', required: 10 },
      { id: 'london-mustache-on-a-stick', name: 'Mustache on a Stick', destination: 'Dhaka', aircraft: 'Swift', required: 10 },
      { id: 'london-hotel-soap', name: 'Hotel Soap', destination: 'Tel Aviv', aircraft: 'Owl', required: 10 },
      { id: 'london-city-map', name: 'City Map', destination: 'Canberra', aircraft: 'Owl', required: 10 },
      { id: 'london-subway-map', name: 'Subway Map', destination: 'Yerevan', aircraft: 'Owl', required: 10 },
      { id: 'london-matchbox', name: 'Matchbox', destination: 'Winnipeg', aircraft: 'Owl', required: 10 },
      { id: 'london-museum-ticket', name: 'Museum Ticket', destination: 'Ouagadougou', aircraft: 'Owl', required: 10 },
      { id: 'london-trilobite-fossil', name: 'Trilobite Fossil', destination: 'Pretoria', aircraft: 'Hawk', required: 10 },
      { id: 'london-eurypterid-fossil', name: 'Eurypterid Fossil', destination: 'Almaty', aircraft: 'Hawk', required: 10 },
      { id: 'london-ammonite-fossil', name: 'Ammonite Fossil', destination: 'Muscat', aircraft: 'Hawk', required: 10 },
      { id: 'london-archaeopteryx-fossil', name: 'Archaeopteryx Fossil', destination: 'Tashkent', aircraft: 'Hawk', required: 10 },
      { id: 'london-sparus-brusinai-fossil', name: 'Sparus Brusinai Fossil', destination: 'Jeddah', aircraft: 'Hawk', required: 10 },
      { id: 'london-pepper-spray', name: 'Pepper Spray', destination: 'Albuquerque', aircraft: 'Raven', required: 10 },
      { id: 'london-multifunction-pocketknife', name: 'Multifunction Pocketknife', destination: 'Beirut', aircraft: 'Raven', required: 10 },
      { id: 'london-lipstick', name: 'Lipstick', destination: 'Vilnius', aircraft: 'Raven', required: 10 },
      { id: 'london-drivers-license', name: "Driver's License", destination: 'Monterrey', aircraft: 'Raven', required: 10 },
      { id: 'london-discount-card', name: 'Discount Card', destination: 'Khartoum', aircraft: 'Raven', required: 10 },
      { id: 'london-notepad', name: 'Notepad', destination: 'Fortaleza', aircraft: 'Eagle', required: 10 },
      { id: 'london-scented-candle', name: 'Scented Candle', destination: 'Varanasi', aircraft: 'Eagle', required: 10 },
      { id: 'london-couch', name: 'Couch', destination: 'Bishkek', aircraft: 'Eagle', required: 10 },
      { id: 'london-medical-file', name: 'Medical File', destination: 'Santo Domingo', aircraft: 'Eagle', required: 10 },
      { id: 'london-model-brain', name: 'Model Brain', destination: 'Dresden', aircraft: 'Eagle', required: 10 },
    ],
  },

  // -------------------------------------------------------------
  // 21. GRAND COMMERCE: HEAVY LONG-HAUL TIER (Jumbo -> Condor, 250 Items - Highest)
  // -------------------------------------------------------------
  {
    id: 'eiffel-tower',
    name: 'Eiffel Tower',
    reward: {
      name: 'Eiffel Tower',
      category: 'Commerce',
      bonus: '+25%',
      radius: 2,
      coins: '630 / 01d 00h',
      image: 'icons/missions/eiffel_tower_render.png',
      statsImage: 'icons/missions/eiffel_tower_stats.jpg',
    },
    totalRequired: 250,
    maxCompletions: 6,
    items: [
      { id: 'eiffel-common-goldfish', name: 'Common Goldfish', destination: 'Taipei', aircraft: 'Jumbo', required: 10 },
      { id: 'eiffel-brown-discus', name: 'Brown Discus', destination: 'Kazan', aircraft: 'Jumbo', required: 10 },
      { id: 'eiffel-veiltail-goldfish', name: 'Veiltail Goldfish', destination: 'Tallinn', aircraft: 'Jumbo', required: 10 },
      { id: 'eiffel-mandarinfish', name: 'Mandarinfish', destination: 'Medina', aircraft: 'Jumbo', required: 10 },
      { id: 'eiffel-cockatoo-dwarf-cichlid', name: 'Cockatoo Dwarf Cichlid', destination: 'Libreville', aircraft: 'Jumbo', required: 10 },
      { id: 'eiffel-falafel', name: 'Falafel', destination: 'Jerusalem', aircraft: 'Giant', required: 10 },
      { id: 'eiffel-shawarma', name: 'Shawarma', destination: 'Mecca', aircraft: 'Giant', required: 10 },
      { id: 'eiffel-sandwich', name: 'Sandwich', destination: 'Ulaanbaatar', aircraft: 'Giant', required: 10 },
      { id: 'eiffel-lule-kebab', name: 'Lule Kebab', destination: 'Casablanca', aircraft: 'Giant', required: 10 },
      { id: 'eiffel-hot-dog', name: 'Hot Dog', destination: 'Bucharest', aircraft: 'Giant', required: 10 },
      { id: 'eiffel-sofa', name: 'Sofa', destination: 'Toledo', aircraft: 'Falcon', required: 10 },
      { id: 'eiffel-mini-bar', name: 'Mini-Bar', destination: 'Paramaribo', aircraft: 'Falcon', required: 10 },
      { id: 'eiffel-coffee-table', name: 'Coffee Table', destination: 'Windhoek', aircraft: 'Falcon', required: 10 },
      { id: 'eiffel-stationary-set', name: 'Stationary Set', destination: 'Ankara', aircraft: 'Falcon', required: 10 },
      { id: 'eiffel-ikebana', name: 'Ikebana', destination: 'Dushanbe', aircraft: 'Falcon', required: 10 },
      { id: 'eiffel-ice-cream-scoop', name: 'Ice Cream Scoop', destination: 'Doha', aircraft: 'Thunderbird', required: 10 },
      { id: 'eiffel-soft-serve-machine', name: 'Soft Serve Machine', destination: 'Shenzhen', aircraft: 'Thunderbird', required: 10 },
      { id: 'eiffel-waffle-cone', name: 'Waffle Cone', destination: 'Ashgabat', aircraft: 'Thunderbird', required: 10 },
      { id: 'eiffel-change-dispenser', name: 'Change Dispenser', destination: 'Guayaquil', aircraft: 'Thunderbird', required: 10 },
      { id: 'eiffel-ice-cream-man-cap', name: 'Ice Cream Man Cap', destination: 'Guatemala City', aircraft: 'Thunderbird', required: 10 },
      { id: 'eiffel-shrimp-fork', name: 'Shrimp Fork', destination: 'Abu Dhabi', aircraft: 'Condor', required: 10 },
      { id: 'eiffel-dessert-fork', name: 'Dessert Fork', destination: 'Charlotte', aircraft: 'Condor', required: 10 },
      { id: 'eiffel-crab-fork', name: 'Crab Fork', destination: 'Toulouse', aircraft: 'Condor', required: 10 },
      { id: 'eiffel-dining-fork', name: 'Dining Fork', destination: 'Kathmandu', aircraft: 'Condor', required: 10 },
      { id: 'eiffel-lemon-fork', name: 'Lemon Fork', destination: 'Tbilisi', aircraft: 'Condor', required: 10 },
    ],
  },
];
