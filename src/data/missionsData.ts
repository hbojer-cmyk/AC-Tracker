// missionsData.ts - Simple registry for Airport City special prize missions

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
  {
    id: 'aztec-pyramid',
    name: 'Aztec Pyramid',
    reward: {
      name: 'Aztec Pyramid',
      category: 'Collectible',
      bonus: '+50 Max Pop',
      radius: '3x3',
      coins: 'Aztec Items / 24h',
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
  {
    id: 'colosseum',
    name: 'Colosseum',
    reward: {
      name: 'Colosseum',
      category: 'Collectible',
      bonus: '+50 Max Pop',
      radius: '3x3',
      coins: 'Roman Items / 24h',
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
      { id: 'london-drivers-license', name: 'Driver\'s License', destination: 'Monterrey', aircraft: 'Raven', required: 10 },
      { id: 'london-discount-card', name: 'Discount Card', destination: 'Khartoum', aircraft: 'Raven', required: 10 },
      { id: 'london-notepad', name: 'Notepad', destination: 'Fortaleza', aircraft: 'Eagle', required: 10 },
      { id: 'london-scented-candle', name: 'Scented Candle', destination: 'Varanasi', aircraft: 'Eagle', required: 10 },
      { id: 'london-couch', name: 'Couch', destination: 'Bishkek', aircraft: 'Eagle', required: 10 },
      { id: 'london-medical-file', name: 'Medical File', destination: 'Santo Domingo', aircraft: 'Eagle', required: 10 },
      { id: 'london-model-brain', name: 'Model Brain', destination: 'Dresden', aircraft: 'Eagle', required: 10 },
    ],
  },
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
