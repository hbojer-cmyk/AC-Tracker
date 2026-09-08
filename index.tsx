
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Plane,
  Star,
  BarChart3,
  Map as MapIcon,
  Rocket,
  Trophy,
  Search,
  CheckCircle2,
  Navigation,
  Activity,
  Plus,
  Minus,
  List,
  Grid,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Upload,
  Download,
  ChevronRight,
  Palette,
  Layers,
  Clock,
  Medal,
  Trash2,
  MapPin,
  Home,
  Bookmark
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { RAW_MASTER_LIST } from './destinations';
import { MAP_LOCATIONS } from './MAPLOCATIONS';
import { AirplanesPage } from './AirplanesPage';
import { adjustAircraftList } from './src/aircraftData';

// --- Types & Themes ---
interface FlightDestination {
  id: string;
  aircraft: string;
  category: string;
  group: string;
  destination: string;
  icon?: string;
  star1Req: number;
  star2Req: number;
  star3Req: number;
  star4Req?: number;
  star5Req?: number;
  maxStars: number;
  flightsDone: number;
  mapsDone?: number;
  needsMap: boolean;
  lastUpdated: number;
  isCustomList?: boolean;
}

interface UserDataEntry {
  count: number;
  lastUpdated: number;
  maps?: number;
  isCustomList?: boolean;
}

type SortField = 'destination' | 'aircraft' | 'group' | 'flightsDone' | 'stars' | 'mastery' | 'lastUpdated' | 'maps';
type SortDirection = 'asc' | 'desc';

type ThemeId =
  | 'classic'
  | 'dark'
  | 'ocean'
  | 'nord'
  | 'dracula'
  | 'gruvbox'
  | 'synthwave'
  | 'forest'
  | 'coffee'
  | 'minimal'
  | 'sunset'
  | 'cyberpunk'
  | 'lavender'
  | 'monochrome'
  | 'autumn'
  | 'matrix'
  | 'rose'
  | 'abyss'
  | 'solarized_light'
  | 'solarized_dark';

const THEME_CONFIGS: Record<ThemeId, { name: string, isDark: boolean }> = {
  classic: { name: 'Airport Classic', isDark: false },
  dark: { name: 'Midnight', isDark: true },
  ocean: { name: 'Deep Sea', isDark: true },
  nord: { name: 'Nordic Frost', isDark: true },
  dracula: { name: 'Vampire Night', isDark: true },
  gruvbox: { name: 'Retro Earth', isDark: true },
  synthwave: { name: 'Neon Dreams', isDark: true },
  forest: { name: 'Mossy Pine', isDark: true },
  coffee: { name: 'Coffee', isDark: false },
  minimal: { name: 'Minimal', isDark: false },
  sunset: { name: 'Sunset Glow', isDark: true },
  cyberpunk: { name: 'Cyberpunk', isDark: true },
  lavender: { name: 'Lavender', isDark: false },
  monochrome: { name: 'Monochrome', isDark: true },
  autumn: { name: 'Autumn Leaves', isDark: false },
  matrix: { name: 'The Matrix', isDark: true },
  rose: { name: 'Rose Gold', isDark: false },
  abyss: { name: 'Ocean Abyss', isDark: true },
  solarized_light: { name: 'Solarized Light', isDark: false },
  solarized_dark: { name: 'Solarized Dark', isDark: true }
};

const AIRCRAFT_ORDER: Record<string, number> = {
  'Swallow': 1, 'Swift': 2, 'Owl': 3, 'Hawk': 4, 'Raven': 5, 'Eagle': 6,
  'Jumbo': 7, 'Giant': 8, 'Falcon': 9, 'Thunderbird': 10, 'Condor': 11,
  'Sparrow': 12, 'Crossbill': 13, 'Goldfinch': 14, 'Sleigh': 15, 'LP1': 16,
  'LP2': 17, 'LP3': 18
};

const CATEGORY_ORDER = [
  'All Destinations',
  'Regular Flights',
  'Helicopter Flights',
  'Adventure Map Flights',
  'Alliance Map Flights',
  'Alliance Task Flights',
  'Space Map Flights',
  'Space Launches',
  'Event Flights'
];

const QUICK_FILTERS = [
  { id: 'regular', label: 'Regular & Helicopter', match: (d: FlightDestination) => d.category === 'Regular Flights' || d.category === 'Helicopter Flights' },
  { id: 'adventure', label: 'Adventure & Space', match: (d: FlightDestination) => d.category === 'Adventure Map Flights' || d.category === 'Space Map Flights' || d.category === 'Space Launches' },
  { id: 'alliance', label: 'Alliance Flights', match: (d: FlightDestination) => d.category === 'Alliance Task Flights' || d.category === 'Alliance Map Flights' },
  { id: 'event', label: 'Event Flights', match: (d: FlightDestination) => d.category === 'Event Flights' }
];

const getMaxStars = (d: { star4Req?: number; star5Req?: number; maxStars?: number }) => {
  if (d.maxStars) return d.maxStars;
  if (d.star5Req && d.star5Req > 0) return 5;
  if (d.star4Req && d.star4Req > 0) return 4;
  return 3;
};

const getStars = (done: number, s1: number, s2: number, s3: number, s4?: number, s5?: number) => {
  if (s5 && s5 > 0 && done >= s5) return 5;
  if (s4 && s4 > 0 && done >= s4) return 4;
  if (done >= s3) return 3;
  if (done >= s2) return 2;
  if (done >= s1) return 1;
  return 0;
};

const getNextStarInfo = (d: FlightDestination) => {
  const reqs: { req: number; star: number }[] = [
    { req: d.star1Req, star: 1 },
    { req: d.star2Req, star: 2 },
    { req: d.star3Req, star: 3 }
  ];
  if (d.star4Req && d.star4Req > 0) reqs.push({ req: d.star4Req, star: 4 });
  if (d.star5Req && d.star5Req > 0) reqs.push({ req: d.star5Req, star: 5 });

  for (const item of reqs) {
    if (d.flightsDone < item.req) {
      return { nextReq: item.req, nextStar: item.star, needed: item.req - d.flightsDone };
    }
  }
  const maxReq = reqs[reqs.length - 1].req;
  const maxStar = reqs[reqs.length - 1].star;
  return { nextReq: maxReq, nextStar: maxStar, needed: 0 };
};



const formatTimestamp = (ts: number) => {
  if (!ts) return 'Never';
  const date = new Date(ts);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const CATEGORY_ICONS: Record<string, string> = {
  'All Destinations': 'Map-icons/standard_icon.png',
  'Regular Flights': 'icons/flights_icon.png',
  'Helicopter Flights': 'icons/helicopter_icon.png',
  'Adventure Map Flights': 'icons/adventure_icon.png',
  'Alliance Map Flights': 'icons/alliance__icon.png',
  'Alliance Task Flights': 'icons/alliance__icon.png',
  'Space Map Flights': 'Map-icons/space_map_icon.png',
  'Space Launches': 'Map-icons/space_icon.png',
  'Event Flights': 'icons/event_icon.png'
};

const AeroQuest = () => {
  const [destinations, setDestinations] = useState<FlightDestination[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All Destinations');
  const [selectedQuickFilters, setSelectedQuickFilters] = useState<string[]>(['regular', 'adventure', 'alliance', 'event']);
  const [filterAircraft, setFilterAircraft] = useState<string>('All');
  const [filterGroup, setFilterGroup] = useState<string>('All');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list' | 'stats' | 'maps' | 'almost-next-star' | 'airplanes'>('list');

  const [theme, setTheme] = useState<ThemeId>('classic');
  const [isLoaded, setIsLoaded] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [showOnlyMaps, setShowOnlyMaps] = useState(false);
  const [hide3Star, setHide3Star] = useState(false);
  const [includeEventTasks, setIncludeEventTasks] = useState(false);
  const [includeAllianceTasks, setIncludeAllianceTasks] = useState(false);
  const [hideZeroMaps, setHideZeroMaps] = useState(false);
  const [showMissingAlliance, setShowMissingAlliance] = useState(true);
  const [showMissingAdventure, setShowMissingAdventure] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ field: SortField; direction: SortDirection }>({
    field: 'destination',
    direction: 'asc'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const rawData = localStorage.getItem('aeroquest_user_data');
    const savedData: Record<string, any> = rawData ? JSON.parse(rawData) : {};
    const savedTheme = localStorage.getItem('aeroquest_theme_id') as ThemeId;
    if (savedTheme && THEME_CONFIGS[savedTheme]) setTheme(savedTheme);

    const savedIncludeEvent = localStorage.getItem('aeroquest_include_event_tasks');
    if (savedIncludeEvent !== null) setIncludeEventTasks(savedIncludeEvent === 'true');
    const savedIncludeAlliance = localStorage.getItem('aeroquest_include_alliance_tasks');
    if (savedIncludeAlliance !== null) setIncludeAllianceTasks(savedIncludeAlliance === 'true');

    const savedHideZero = localStorage.getItem('aeroquest_hide_zero_maps');
    if (savedHideZero !== null) setHideZeroMaps(savedHideZero === 'true');

    const savedShowMissingAlliance = localStorage.getItem('aeroquest_show_missing_alliance');
    if (savedShowMissingAlliance !== null) setShowMissingAlliance(savedShowMissingAlliance === 'true');

    const savedShowMissingAdventure = localStorage.getItem('aeroquest_show_missing_adventure');
    if (savedShowMissingAdventure !== null) setShowMissingAdventure(savedShowMissingAdventure === 'true');

    const parsed: FlightDestination[] = RAW_MASTER_LIST.split('\n').map((line, idx) => {
      const parts = line.split('|');
      if (parts.length < 8) return null;
      const [aircraft, category, group, dest, icon, s1, s2, s3, s4, s5] = parts;
      const id = `f-${idx}`;
      const needsMap = MAP_LOCATIONS.includes(dest);

      const star1Req = parseInt(s1) || 0;
      const star2Req = parseInt(s2) || 0;
      const star3Req = parseInt(s3) || 0;
      const star4Req = s4 && parseInt(s4) > 0 ? parseInt(s4) : undefined;
      const star5Req = s5 && parseInt(s5) > 0 ? parseInt(s5) : undefined;
      const maxStars = star5Req ? 5 : star4Req ? 4 : 3;

      // Try loading by destination name first, then by old ID for migration
      const entry = savedData[dest] || savedData[id];
      let flightsDone = 0;
      let mapsDone = 0;
      let lastUpdated = 0;
      let isCustomList = false;

      if (typeof entry === 'number') {
        flightsDone = entry;
      } else if (entry && typeof entry === 'object') {
        flightsDone = entry.count;
        mapsDone = entry.maps || 0;
        lastUpdated = entry.lastUpdated || 0;
        isCustomList = entry.isCustomList || false;
      }

      return {
        id, aircraft, category, group: group || 'None', destination: dest, icon: icon ? icon.replace(/^\//, '') : undefined,
        star1Req, star2Req, star3Req, star4Req, star5Req, maxStars,
        flightsDone, mapsDone, needsMap, lastUpdated, isCustomList
      };
    }).filter(Boolean) as FlightDestination[];
    setDestinations(parsed);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (expandedRowId) {
      const element = document.getElementById(expandedRowId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [expandedRowId]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('aeroquest_theme_id', theme);
      localStorage.setItem('aeroquest_include_event_tasks', String(includeEventTasks));
      localStorage.setItem('aeroquest_include_alliance_tasks', String(includeAllianceTasks));
      localStorage.setItem('aeroquest_hide_zero_maps', String(hideZeroMaps));
      localStorage.setItem('aeroquest_show_missing_alliance', String(showMissingAlliance));
      localStorage.setItem('aeroquest_show_missing_adventure', String(showMissingAdventure));
      const html = document.documentElement;
      Object.keys(THEME_CONFIGS).forEach(id => html.classList.remove(`theme-${id}`));
      html.classList.add(`theme-${theme}`);
      if (THEME_CONFIGS[theme].isDark) html.classList.add('dark');
      else html.classList.remove('dark');
    }
  }, [theme, includeEventTasks, includeAllianceTasks, hideZeroMaps, showMissingAlliance, showMissingAdventure, isLoaded]);

  // Persistence layer for destinations
  useEffect(() => {
    if (isLoaded) {
      const storageObj: Record<string, UserDataEntry> = {};
      destinations.forEach(d => {
        if (d.flightsDone > 0 || (d.needsMap && (d.mapsDone || 0) > 0) || d.isCustomList) {
          storageObj[d.destination] = {
            count: d.flightsDone,
            lastUpdated: d.lastUpdated,
            ...(d.needsMap ? { maps: d.mapsDone } : {}),
            ...(d.isCustomList ? { isCustomList: true } : {})
          };
        }
      });
      localStorage.setItem('aeroquest_user_data', JSON.stringify(storageObj));
    }
  }, [destinations, isLoaded]);

  const updateFlightCount = (id: string, newVal: number) => {
    const safeVal = Math.max(0, isNaN(newVal) ? 0 : newVal);
    const now = Date.now();
    setDestinations(prev => prev.map(d => (d.id === id ? { ...d, flightsDone: safeVal, lastUpdated: now } : d)));
  };

  const updateMapCount = (id: string, newVal: number) => {
    const safeVal = Math.max(0, isNaN(newVal) ? 0 : newVal);
    const now = Date.now();
    setDestinations(prev => prev.map(d => (d.id === id ? { ...d, mapsDone: safeVal, lastUpdated: now } : d)));
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDestinations(prev => prev.map(d => (d.id === id ? { ...d, isCustomList: !d.isCustomList, lastUpdated: Date.now() } : d)));
  };

  const categories = useMemo(() => {
    const activeFilters = QUICK_FILTERS.filter(f => selectedQuickFilters.includes(f.id));

    const unique = Array.from(new Set(destinations.map(d => d.category)))
      .filter(c => {
        // A category is allowed if at least one destination in it matches an active filter
        return destinations.some(d => d.category === c && activeFilters.some(f => f.match(d)));
      });

    const sorted = unique.sort((a, b) => {
      const idxA = CATEGORY_ORDER.indexOf(a as string);
      const idxB = CATEGORY_ORDER.indexOf(b as string);
      const safeA = idxA === -1 ? 999 : idxA;
      const safeB = idxB === -1 ? 999 : idxB;
      return safeA - safeB;
    });
    return ['All Destinations', ...sorted];
  }, [destinations, selectedQuickFilters]);

  const allGroups = useMemo(() => {
    const filtered = activeCategory === 'All Destinations'
      ? destinations
      : activeCategory === 'Bookmarks'
        ? destinations.filter(d => d.isCustomList)
        : destinations.filter(d => d.category === activeCategory);
    const unique = new Set<string>();
    filtered.forEach(d => {
      d.group.split(/[;,]/).forEach(g => unique.add(g.trim()));
    });
    return ['All', ...Array.from(unique).sort()];
  }, [destinations, activeCategory]);

  const allAircraft = useMemo(() => {
    const filtered = activeCategory === 'All Destinations'
      ? destinations
      : activeCategory === 'Bookmarks'
        ? destinations.filter(d => d.isCustomList)
        : destinations.filter(d => d.category === activeCategory);
    const unique = Array.from(new Set(filtered.map(d => d.aircraft)));
    return ['All', ...unique.sort((a, b) => (AIRCRAFT_ORDER[a as string] || 999) - (AIRCRAFT_ORDER[b as string] || 999))];
  }, [destinations, activeCategory]);

  // Memoized stars for each sub-item (aircraft or group) within each category
  const subItemStatsByCategory = useMemo(() => {
    const stats: Record<string, Record<string, { earned: number, max: number }>> = {};
    destinations.forEach(d => {
      // Regular category entry
      if (!stats[d.category]) stats[d.category] = {};

      const stars = getStars(d.flightsDone, d.star1Req, d.star2Req, d.star3Req, d.star4Req, d.star5Req);
      const destMax = getMaxStars(d);

      if (d.category === 'Event Flights') {
        const groups = d.group.split(/[;,]/).map(g => g.trim());
        groups.forEach(g => {
          if (!stats[d.category][g]) stats[d.category][g] = { earned: 0, max: 0 };
          stats[d.category][g].earned += stars;
          stats[d.category][g].max += destMax;
        });
      } else {
        const subItem = d.aircraft;
        if (!stats[d.category][subItem]) stats[d.category][subItem] = { earned: 0, max: 0 };
        stats[d.category][subItem].earned += stars;
        stats[d.category][subItem].max += destMax;
      }

      // All Destinations entry (always by aircraft)
      if (!stats['All Destinations']) stats['All Destinations'] = {};
      if (!stats['All Destinations'][d.aircraft]) stats['All Destinations'][d.aircraft] = { earned: 0, max: 0 };
      stats['All Destinations'][d.aircraft].earned += stars;
      stats['All Destinations'][d.aircraft].max += destMax;
    });
    return stats;
  }, [destinations]);

  const categorySubItemsMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    Object.keys(subItemStatsByCategory).forEach(cat => {
      const items = Object.keys(subItemStatsByCategory[cat]);
      if (cat === 'Event Flights') {
        // Sort missions alphabetically
        map[cat] = items.sort((a, b) => a.localeCompare(b));
      } else {
        // Sort aircraft by predefined order
        map[cat] = items.sort((a, b) => (AIRCRAFT_ORDER[a] || 999) - (AIRCRAFT_ORDER[b] || 999));
      }
    });
    return map;
  }, [subItemStatsByCategory]);

  const categoryStarsMap = useMemo(() => {
    const map: Record<string, { earned: number, max: number }> = {};
    categories.forEach(cat => {
      const catDests = cat === 'All Destinations' ? destinations : destinations.filter(d => d.category === cat);
      const earned = catDests.reduce((acc, d) => acc + getStars(d.flightsDone, d.star1Req, d.star2Req, d.star3Req, d.star4Req, d.star5Req), 0);
      const max = catDests.reduce((acc, d) => acc + getMaxStars(d), 0);
      map[cat] = { earned, max };
    });
    return map;
  }, [destinations, categories]);

  const starCounts = useMemo(() => {
    let ace = 0, captain = 0, expert = 0, master = 0, specialist = 0;
    destinations.forEach(d => {
      const s = getStars(d.flightsDone, d.star1Req, d.star2Req, d.star3Req, d.star4Req, d.star5Req);
      if (s === 5) ace++;
      else if (s === 4) captain++;
      else if (s === 3) expert++;
      else if (s === 2) master++;
      else if (s === 1) specialist++;
    });
    return { ace, captain, expert, master, specialist };
  }, [destinations]);

  const statsBreakdown = useMemo(() => {
    return categories.map(catName => {
      const catDests = catName === 'All Destinations' ? destinations : destinations.filter(d => d.category === catName);
      const total = catDests.length;
      const starsGained = catDests.reduce((acc, d) => acc + getStars(d.flightsDone, d.star1Req, d.star2Req, d.star3Req, d.star4Req, d.star5Req), 0);
      const maxStars = catDests.reduce((acc, d) => acc + getMaxStars(d), 0);
      const mapsCollected = catDests.reduce((acc, d) => acc + (d.mapsDone || 0), 0);
      const uniqueMaps = catDests.filter(d => (d.mapsDone || 0) > 0).length;
      return {
        name: catName,
        total,
        starsGained,
        maxStars,
        percentage: Math.round((starsGained / (maxStars || 1)) * 100) || 0,
        mapsCollected,
        uniqueMaps
      };
    }).filter(s => s.total > 0);
  }, [destinations, categories]);

  const mapCollectionStats = useMemo(() => {
    const uniqueMaps = destinations.filter(d => (d.mapsDone || 0) > 0).length;
    const totalMaps = destinations.reduce((acc, d) => acc + (d.mapsDone || 0), 0);
    const completionRate = (uniqueMaps / destinations.length) * 100;

    const topStock = [...destinations]
      .filter(d => (d.mapsDone || 0) > 0)
      .sort((a, b) => (b.mapsDone || 0) - (a.mapsDone || 0))
      .slice(0, 10);

    const airplaneStats = Object.keys(AIRCRAFT_ORDER).map(ac => {
      const acDests = destinations.filter(d => d.aircraft === ac);
      const maps = acDests.filter(d => (d.mapsDone || 0) > 0).length;
      return { name: ac, maps };
    }).filter(s => s.maps > 0);

    const typeStats = [
      { name: 'ADVENTURE', cat: 'Adventure Map Flights' },
      { name: 'ALLIANCE', cat: 'Alliance Map Flights' },
      { name: 'SPACE', cat: 'Space Map Flights' },
      { name: 'EVENT', cat: 'Event Flights' }
    ].map(type => {
      const catDests = destinations.filter(d => {
        if (type.cat === 'Event Flights') {
          return d.category === 'Event Flights' && (d.destination === 'Area 51' || d.destination === 'Rovaneimi' || d.destination === 'Fatima');
        }
        return d.category === type.cat;
      });
      const collected = catDests.filter(d => (d.mapsDone || 0) > 0).length;
      const total = catDests.length;
      const percentage = total > 0 ? Math.round((collected / total) * 100) : 0;
      return { ...type, collected, total, percentage };
    });

    const missingMaps = destinations.filter(d =>
      d.needsMap &&
      (d.mapsDone || 0) === 0 &&
      getStars(d.flightsDone, d.star1Req, d.star2Req, d.star3Req, d.star4Req, d.star5Req) < getMaxStars(d)
    ).sort((a, b) => {
      const acA = AIRCRAFT_ORDER[a.aircraft] || 999;
      const acB = AIRCRAFT_ORDER[b.aircraft] || 999;
      if (acA !== acB) return acA - acB;

      const catA = CATEGORY_ORDER.indexOf(a.category) !== -1 ? CATEGORY_ORDER.indexOf(a.category) : 999;
      const catB = CATEGORY_ORDER.indexOf(b.category) !== -1 ? CATEGORY_ORDER.indexOf(b.category) : 999;
      if (catA !== catB) return catA - catB;

      const groupA = a.group.split(/[;,]/)[0].trim();
      const groupB = b.group.split(/[;,]/)[0].trim();
      if (groupA !== groupB) return groupA.localeCompare(groupB);

      return a.destination.localeCompare(b.destination);
    });

    return { uniqueMaps, totalMaps, completionRate, topStock, airplaneStats, typeStats, missingMaps };
  }, [destinations]);


  const sortedAndFilteredDestinations = useMemo(() => {
    const activeFilters = QUICK_FILTERS.filter(f => selectedQuickFilters.includes(f.id));

    let result = destinations.filter(d =>
      activeFilters.some(f => f.match(d)) &&
      (activeCategory === 'All Destinations' || (activeCategory === 'Bookmarks' ? d.isCustomList : d.category === activeCategory)) &&
      (filterAircraft === 'All' || d.aircraft === filterAircraft) &&
      (filterGroup === 'All' || d.group.split(/[;,]/).map(g => g.trim()).includes(filterGroup)) &&
      (!showOnlyMaps || d.needsMap) &&
      (!hide3Star || getStars(d.flightsDone, d.star1Req, d.star2Req, d.star3Req, d.star4Req, d.star5Req) < getMaxStars(d)) &&
      (d.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.aircraft.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.group.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    result.sort((a, b) => {
      // If we are in Event Flights and using default sort (destination), 
      // sort by group (mission) first for better organization
      if (activeCategory === 'Event Flights' && sortConfig.field === 'destination') {
        const aGroup = a.group.split(/[;,]/)[0].trim();
        const bGroup = b.group.split(/[;,]/)[0].trim();
        if (aGroup !== bGroup) {
          return aGroup.localeCompare(bGroup);
        }
      }

      let valA: unknown, valB: unknown;
      switch (sortConfig.field) {
        case 'group': valA = a.group.split(/[;,]/).map(g => g.trim()).join(', '); valB = b.group.split(/[;,]/).map(g => g.trim()).join(', '); break;
        case 'flightsDone': valA = a.flightsDone; valB = b.flightsDone; break;
        case 'aircraft': valA = AIRCRAFT_ORDER[a.aircraft] || 999; valB = AIRCRAFT_ORDER[b.aircraft] || 999; break;
        case 'stars': valA = getStars(a.flightsDone, a.star1Req, a.star2Req, a.star3Req, a.star4Req, a.star5Req); valB = getStars(b.flightsDone, b.star1Req, b.star2Req, b.star3Req, b.star4Req, b.star5Req); break;
        case 'mastery': {
          const maxA = (a.star5Req || a.star4Req || a.star3Req);
          const maxB = (b.star5Req || b.star4Req || b.star3Req);
          valA = a.flightsDone / maxA;
          valB = b.flightsDone / maxB;
          break;
        }
        case 'maps': valA = a.mapsDone || 0; valB = b.mapsDone || 0; break;
        case 'lastUpdated': valA = a.lastUpdated; valB = b.lastUpdated; break;
        default: valA = a.destination; valB = b.destination; break;
      }

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortConfig.direction === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      if (typeof valA === 'number' && typeof valB === 'number') {
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return result;
  }, [activeCategory, filterAircraft, filterGroup, searchQuery, destinations, sortConfig, showOnlyMaps, hide3Star]);

  const globalStars = destinations.reduce((acc, d) => acc + getStars(d.flightsDone, d.star1Req, d.star2Req, d.star3Req, d.star4Req, d.star5Req), 0);
  const totalMaps = destinations.reduce((acc, d) => acc + (d.mapsDone || 0), 0);
  const maxGlobalStars = destinations.reduce((acc, d) => acc + getMaxStars(d), 0);

  const handleCategoryClick = (cat: string) => {
    if (view === 'stats' || view === 'almost-next-star' || view === 'airplanes' || view === 'maps') setView('list');
    setActiveCategory(cat);
    setFilterAircraft('All');
    setFilterGroup('All');
    setExpandedCategory(prev => (prev === cat ? null : cat));
  };

  const handleSubItemClick = (cat: string, item: string) => {
    if (view === 'stats' || view === 'almost-next-star' || view === 'airplanes' || view === 'maps') setView('list');
    setActiveCategory(cat);
    if (cat === 'Event Flights') {
      setFilterGroup(item);
      setFilterAircraft('All');
    } else {
      setFilterAircraft(item);
      setFilterGroup('All');
    }
  };

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const exportToJSON = () => {
    const storageObj: Record<string, any> = {};
    destinations.forEach(d => {
      if (d.flightsDone > 0 || (d.needsMap && (d.mapsDone || 0) > 0) || d.isCustomList) {
        storageObj[d.destination] = {
          count: d.flightsDone,
          lastUpdated: d.lastUpdated,
          ...(d.needsMap ? { maps: d.mapsDone } : {}),
          ...(d.isCustomList ? { isCustomList: true } : {})
        };
      }
    });

    const savedAirplanes = localStorage.getItem('aeroquest_owned_airplanes_v2');
    if (savedAirplanes) {
      try {
        const parsed = JSON.parse(savedAirplanes);
        const adjusted = adjustAircraftList(parsed);
        storageObj['airplanes'] = adjusted;
        localStorage.setItem('aeroquest_owned_airplanes_v2', JSON.stringify(adjusted));
      } catch (e) {
        // ignore JSON parse error
      }
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(storageObj, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `star_tracker_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string) as Record<string, any>;
        const sanitizedJson: Record<string, UserDataEntry> = {};
        Object.entries(json).forEach(([id, val]) => {
          if (id === 'airplanes') {
            const adjusted = adjustAircraftList(Array.isArray(val) ? val : []);
            localStorage.setItem('aeroquest_owned_airplanes_v2', JSON.stringify(adjusted));
          } else if (typeof val === 'number') sanitizedJson[id] = { count: val, lastUpdated: 0 };
          else if (typeof val === 'object' && val !== null) sanitizedJson[id] = val as UserDataEntry;
        });
        setDestinations(prev => prev.map(d => {
          const entry = sanitizedJson[d.destination] || sanitizedJson[d.id];
          return entry ? {
            ...d,
            flightsDone: entry.count,
            mapsDone: entry.maps || 0,
            lastUpdated: entry.lastUpdated || 0,
            isCustomList: entry.isCustomList || false
          } : d;
        }));
        alert('Data imported successfully!');
      } catch (err) { alert('Error importing JSON'); }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetAllData = () => {
    if (!showResetConfirm) {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3000); // Reset after 3 seconds
      return;
    }

    setDestinations(prev => prev.map(d => ({ ...d, flightsDone: 0, mapsDone: 0, lastUpdated: 0, isCustomList: false })));
    setActiveCategory('All Destinations');
    setFilterAircraft('All');
    setFilterGroup('All');
    setSearchQuery('');
    localStorage.removeItem('aeroquest_user_data');
    localStorage.removeItem('aeroquest_owned_airplanes_v2');
    setShowResetConfirm(false);
  };

  if (!isLoaded) return null;

  return (
    // Fix: Updated font-family in the main container class to Lexend
    <div className={`theme-${theme} h-screen flex flex-col lg:flex-row transition-colors duration-300 bg-[var(--bg)] text-[var(--text-main)] font-['Lexend',_sans-serif] overflow-hidden`}>
      {/* Sidebar */}
      <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-[var(--border)] flex flex-col p-6 lg:h-screen z-20 shrink-0 bg-[var(--sidebar)] backdrop-blur-xl">
        <div className="flex flex-col items-center mb-8 shrink-0 group cursor-pointer" onClick={() => {
          setView('list');
          setActiveCategory('All Destinations');
          setFilterAircraft('All');
          setFilterGroup('All');
          setSearchQuery('');
        }}>
          <img src="icons/AC-Tracker-By-Soupha.png" alt="AC Tracker Logo" className="w-full max-w-[340px] object-contain drop-shadow-lg transition-transform group-hover:scale-125" referrerPolicy="no-referrer" />
          <span className="text-[10px] font-black uppercase tracking-[0.1em] text-[#4A606C] mt-1">
            Version 10.1, 08.06.26
          </span>
        </div>

        {/* Stats Summary from Mockup */}


        <nav className="flex-1 overflow-y-auto custom-scrollbar pr-2 hidden lg:flex flex-col border-t border-[var(--border)] pt-6 no-scrollbar">
          <div className="space-y-1">
            {categories.map(cat => {
              const isExpanded = expandedCategory === cat;
              const isActive = activeCategory === cat;
              return (
                <div key={cat} className="flex flex-col">
                  <button onClick={() => handleCategoryClick(cat)} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-xs font-bold ${isActive ? 'bg-[#00A0D6] text-white shadow-md' : 'text-white/80 hover:text-white hover:bg-white/10'}`}>
                    <div className="flex items-center space-x-2 min-w-0">
                      {CATEGORY_ICONS[cat] ? (
                        <img src={CATEGORY_ICONS[cat]} alt={cat} className="w-10 h-10 object-contain" referrerPolicy="no-referrer" />
                      ) : (
                        cat === 'All Destinations' ? <Navigation className="w-10 h-10" /> : <MapIcon className="w-10 h-10" />
                      )}
                      <div className="flex flex-col items-start min-w-0">
                        <span className="truncate w-full font-bold">{cat}</span>
                        <span className="text-[11px] font-black tracking-tight uppercase opacity-80">{categoryStarsMap[cat].earned}/{categoryStarsMap[cat].max} Stars</span>
                      </div>
                    </div>
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                  {isExpanded && (
                    <div className="flex flex-col pl-6 py-1 space-y-0.5">
                      {(categorySubItemsMap[cat] || []).map(item => {
                        const s = subItemStatsByCategory[cat]?.[item];
                        const statStr = s ? ` (${s.earned}/${s.max})` : '';
                        const isActive = cat === 'Event Flights' ? filterGroup === item : filterAircraft === item;
                        return (
                          <button key={item} onClick={() => handleSubItemClick(cat, item)} className={`text-left px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>
                            {item}<span className="opacity-70 ml-1 font-black">({s?.earned}/{s?.max})</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Bookmarks Button */}
            <div className="flex flex-col mt-4 pt-4 border-t border-[var(--border)]">
              <button onClick={() => handleCategoryClick('Bookmarks')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-xs font-bold ${activeCategory === 'Bookmarks' ? 'bg-[#00A0D6] text-white shadow-md' : 'text-white/80 hover:text-white hover:bg-white/10'}`}>
                <div className="flex items-center space-x-2 min-w-0">
                  <Bookmark className="w-4 h-4" />
                  <div className="flex flex-col items-start min-w-0">
                    <span className="truncate w-full font-bold">Bookmarks</span>
                    <span className="text-[11px] font-black tracking-tight uppercase opacity-80">{destinations.filter(d => d.isCustomList).length} Destinations</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </nav>


      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar bg-[var(--bg)] relative" id="main-scroll-container">
        {/* Top 4 Large Buttons */}
        <div className="px-6 pt-6 lg:px-10 lg:pt-10 pb-2">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            <div
              onClick={() => setView('stats')}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${view === 'stats' ? 'bg-[var(--accent-muted)] border-[var(--accent)] translate-y-1 shadow-none' : 'bg-[var(--card)] border-[var(--border)] shadow-[0_4px_0_0_var(--border)] hover:bg-[var(--bg)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_var(--border)] active:translate-y-1 active:shadow-none'}`}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-md" />
                <img src="icons/star-icon.png" alt="Star" className="w-12 h-12 relative z-10 object-contain" referrerPolicy="no-referrer" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-[var(--text-main)] leading-none">Stars</span>
                <span className="text-l font-light text-[var(--text-muted)] tracking-tighter">
                  {globalStars.toLocaleString()} / {maxGlobalStars.toLocaleString()} - ({Math.round((globalStars / maxGlobalStars) * 100)} %)
                </span>
              </div>
            </div>

            <div
              onClick={() => setView('maps')}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${view === 'maps' ? 'bg-[var(--accent-muted)] border-[var(--accent)] translate-y-1 shadow-none' : 'bg-[var(--card)] border-[var(--border)] shadow-[0_4px_0_0_var(--border)] hover:bg-[var(--bg)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_var(--border)] active:translate-y-1 active:shadow-none'}`}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-md" />
                <img src="icons/map-icon.png" alt="Map" className="w-12 h-12 relative z-10 object-contain" referrerPolicy="no-referrer" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-[var(--text-main)] leading-none">Maps</span>
                <span className="text-l font-light text-[var(--text-muted)] tracking-tighter">{mapCollectionStats.uniqueMaps.toLocaleString()} / 148 - ({Math.round((mapCollectionStats.uniqueMaps / 148) * 100)} %)
                </span>
              </div>
            </div>

            <div
              onClick={() => setView('almost-next-star')}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${view === 'almost-next-star' ? 'bg-[var(--accent-muted)] border-[var(--accent)] translate-y-1 shadow-none' : 'bg-[var(--card)] border-[var(--border)] shadow-[0_4px_0_0_var(--border)] hover:bg-[var(--bg)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_var(--border)] active:translate-y-1 active:shadow-none'}`}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-md" />
                <img src="icons/star-icon.png" alt="Next Star" className="w-12 h-12 relative z-10 object-contain" referrerPolicy="no-referrer" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-[var(--text-main)] leading-none">Next Stars</span>
                <span className="text-l font-light text-[var(--text-muted)] tracking-tighter">View destinations</span>
              </div>
            </div>

            <div
              onClick={() => setView('airplanes')}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${view === 'airplanes' ? 'bg-[var(--accent-muted)] border-[var(--accent)] translate-y-1 shadow-none' : 'bg-[var(--card)] border-[var(--border)] shadow-[0_4px_0_0_var(--border)] hover:bg-[var(--bg)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_var(--border)] active:translate-y-1 active:shadow-none'}`}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-md" />
                <img src="icons/airplane-icon.png" alt="Airplane" className="w-12 h-12 relative z-10 object-contain" referrerPolicy="no-referrer" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-[var(--text-main)] leading-none">My Hangar</span>
                <span className="text-l font-light text-[var(--text-muted)] tracking-tighter">View your aircraft</span>
              </div>
            </div>
          </div>
        </div>

        {view === 'airplanes' ? (
          <AirplanesPage />
        ) : (
          <div className="min-h-full flex flex-col">
            <div className="px-6 pb-6 lg:px-10 lg:pb-10 pt-2 flex-1">
              {(view === 'list' || view === 'grid') && (
                <header className="flex flex-col gap-4 mb-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center flex-wrap gap-1.5">
                      <button onClick={() => setView('list')} className={`px-3 py-2 rounded-xl border border-[var(--border)] transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm ${view === 'list' ? 'bg-[#00A0D6] text-white border-sky-500' : 'bg-[var(--card)] text-[var(--text-main)] hover:bg-[var(--accent-muted)]'}`}>
                        <List className="w-4 h-4" />List
                      </button>
                      <button onClick={() => setView('grid')} className={`px-3 py-2 rounded-xl border border-[var(--border)] transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm ${view === 'grid' ? 'bg-[#00A0D6] text-white border-sky-500' : 'bg-[var(--card)] text-[var(--text-main)] hover:bg-[var(--accent-muted)]'}`}>
                        <Grid className="w-4 h-4" />Grid
                      </button>
                      <div className="relative group">
                        <button className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--text-main)] hover:bg-[var(--accent-muted)] transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm"><Palette className="w-4 h-4" />{THEME_CONFIGS[theme].name}</button>
                        <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                          {Object.entries(THEME_CONFIGS).map(([id, cfg]) => (
                            <button key={id} onClick={() => setTheme(id as ThemeId)} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold ${theme === id ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-main)] hover:bg-[var(--bg)]'}`}>{cfg.name}</button>
                          ))}
                        </div>
                      </div>
                      <button onClick={exportToJSON} title="Export Data to JSON" className="p-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--text-main)] hover:bg-[var(--accent-muted)] shadow-sm flex items-center gap-1.5 transition-all">
                        <Download className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Export</span>
                      </button>
                      <label title="Import Data from JSON" className="p-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--text-main)] hover:bg-[var(--accent-muted)] cursor-pointer shadow-sm flex items-center gap-1.5 transition-all">
                        <Upload className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Import</span>
                        <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImportJSON} />
                      </label>
                      <button
                        onClick={resetAllData}
                        title={showResetConfirm ? "Click again to confirm" : "Delete All Data"}
                        className={`p-2 rounded-xl border transition-all shadow-sm flex items-center gap-1.5 ${showResetConfirm
                          ? 'bg-red-600 border-red-700 text-white animate-pulse'
                          : 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-wider">
                          {showResetConfirm ? 'Confirm?' : 'Reset'}
                        </span>
                      </button>
                      <div className="relative w-full md:w-56">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                        <input type="text" placeholder="Search routes..." className="pl-9 pr-3 py-2 text-sm w-full rounded-xl border border-[var(--border)] bg-[var(--card)] outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-muted)] transition-all shadow-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  {activeCategory === 'Bookmarks' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                      <img src="icons/Header-Bookmarks.png" alt="Bookmarks" className="mx-auto max-w-[450px] w-full object-contain drop-shadow-lg" referrerPolicy="no-referrer" />
                    </div>
                  )}

                  {view !== 'stats' && view !== 'maps' && (
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-sm shadow-sm">
                        <div className="flex flex-row items-center gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] px-1">Map Type</label>
                            <select
                              value={activeCategory}
                              onChange={(e) => handleCategoryClick(e.target.value)}
                              className="bg-[var(--bg)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs font-bold text-[var(--text-main)] outline-none focus:ring-2 focus:ring-[var(--accent-muted)] transition-all min-w-[160px]"
                            >
                              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                              <option value="Bookmarks">Bookmarks</option>
                            </select>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] px-1">Map Set</label>
                            <select
                              value={filterGroup}
                              onChange={(e) => setFilterGroup(e.target.value)}
                              className="bg-[var(--bg)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs font-bold text-[var(--text-main)] outline-none focus:ring-2 focus:ring-[var(--accent-muted)] transition-all min-w-[160px]"
                            >
                              {allGroups.map(group => <option key={group} value={group}>{group}</option>)}
                            </select>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] px-1">Aircraft</label>
                            <select
                              value={filterAircraft}
                              onChange={(e) => setFilterAircraft(e.target.value)}
                              className="bg-[var(--bg)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs font-bold text-[var(--text-main)] outline-none focus:ring-2 focus:ring-[var(--accent-muted)] transition-all min-w-[160px]"
                            >
                              {allAircraft.map(ac => <option key={ac} value={ac}>{ac}</option>)}
                            </select>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] px-1">Sort By</label>
                            <div className="flex items-center gap-2">
                              <select
                                value={sortConfig.field}
                                onChange={(e) => handleSort(e.target.value as SortField)}
                                className="bg-[var(--bg)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs font-bold text-[var(--text-main)] outline-none focus:ring-2 focus:ring-[var(--accent-muted)] transition-all min-w-[140px]"
                              >
                                <option value="destination">Destination</option>
                                <option value="aircraft">Aircraft Type</option>
                                <option value="group">Map Set / Mission</option>
                                <option value="flightsDone">Total Flights</option>
                                <option value="stars">Star Rating</option>
                                <option value="mastery">Mastery %</option>
                                <option value="maps">Maps Collected</option>
                                <option value="lastUpdated">Last Updated</option>
                              </select>
                              <button
                                onClick={() => setSortConfig(prev => ({ ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' }))}
                                className="p-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text-main)] hover:bg-[var(--accent-muted)] transition-all shadow-sm"
                                title={`Sort ${sortConfig.direction === 'asc' ? 'Descending' : 'Ascending'}`}
                              >
                                {sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-row items-center gap-4 pt-2 border-t border-[var(--border)]/50">
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <div className="relative flex items-center justify-center">
                              <input
                                type="checkbox"
                                className="peer sr-only"
                                checked={showOnlyMaps}
                                onChange={() => setShowOnlyMaps(!showOnlyMaps)}
                              />
                              <div className="w-4 h-4 border-2 border-[var(--border)] rounded bg-[var(--card)] peer-checked:bg-[var(--accent)] peer-checked:border-[var(--accent)] transition-all" />
                              <MapPin className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity fill-white" />
                            </div>
                            <span className="text-[11px] font-bold text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors whitespace-nowrap">Only Map Locations</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer group">
                            <div className="relative flex items-center justify-center">
                              <input
                                type="checkbox"
                                className="peer sr-only"
                                checked={hide3Star}
                                onChange={() => setHide3Star(!hide3Star)}
                              />
                              <div className="w-4 h-4 border-2 border-[var(--border)] rounded bg-[var(--card)] peer-checked:bg-[var(--accent)] peer-checked:border-[var(--accent)] transition-all" />
                              <Star className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity fill-white" />
                            </div>
                            <span className="text-[11px] font-bold text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors whitespace-nowrap">Hide Completed</span>
                          </label>

                          <button
                            onClick={() => {
                              setActiveCategory('All Destinations');
                              setFilterAircraft('All');
                              setFilterGroup('All');
                              setSearchQuery('');
                            }}
                            className="ml-auto px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                          >
                            Clear Filters
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </header>
              )}

              {view === 'maps' ? (
                <div className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="max-w-4xl mx-auto space-y-8">


                    {/* Key Metrics Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-[2rem] bg-[var(--card)] border border-[var(--border)] p-6 text-center shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Unique Maps</p>
                        <p className="text-4xl font-black text-[var(--accent)]">{mapCollectionStats.uniqueMaps}</p>
                      </div>
                      <div className="rounded-[2rem] bg-[var(--card)] border border-[var(--border)] p-6 text-center shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Total Maps</p>
                        <p className="text-4xl font-black text-[var(--accent)]">{mapCollectionStats.totalMaps}</p>
                      </div>
                    </div>

                    {/* Map Type Collection Progress */}
                    <div className="rounded-[2.5rem] bg-[var(--card)] border border-[var(--border)] p-8 shadow-lg">
                      <center>  <img src="Headers/maps-by-collection.png" alt="Most owned Maps" referrerPolicy="no-referrer" /> </center>
                      <div className="space-y-8">
                        {mapCollectionStats.typeStats.map((type, idx) => (
                          <div key={type.name} className="space-y-2">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                              <span className="text-[var(--text-main)]">{type.name}</span>
                              <span className="text-[var(--text-muted)]">{type.collected}/{type.total} <span className="text-[var(--accent)]">({type.percentage}%)</span></span>
                            </div>
                            <div className="h-2 w-full bg-[var(--bg)] rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-1000 ${idx === 0 ? 'bg-emerald-500' :
                                  idx === 1 ? 'bg-indigo-500' :
                                    idx === 2 ? 'bg-cyan-500' : 'bg-amber-500'
                                  }`}
                                style={{ width: `${type.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>                  {/* Charts Section */}
                    <div className="space-y-8">
                      {/* Maps Per Airplane Bar Chart */}
                      <div className="rounded-[2.5rem] bg-[var(--card)] border border-[var(--border)] p-8 shadow-lg">
                        <center>  <img src="Headers/maps-by-aircraft.png" alt="Most owned Maps" referrerPolicy="no-referrer" /> </center>
                        <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mapCollectionStats.airplaneStats} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                              <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 700 }}
                                interval={0}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                              />
                              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 700 }} />
                              <Tooltip
                                cursor={{ fill: 'var(--bg)', opacity: 0.5 }}
                                contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', fontSize: '12px', fontWeight: 700 }}
                              />
                              <Bar dataKey="maps" fill="var(--accent)" radius={[4, 4, 0, 0]} barSize={24} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Collection Status Header Card */}
                      <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] shadow-lg overflow-hidden">

                        <div className="p-6 border-b border-[var(--border)] text-center">
                          <center>  <img src="Headers/most-owned-maps.png" alt="Most owned Maps" referrerPolicy="no-referrer" /> </center>
                        </div>

                        <div className="divide-y divide-[var(--border)]">
                          {mapCollectionStats.topStock.map((stock, idx) => (
                            <div key={stock.id} className="p-4 hover:bg-[var(--bg)] transition-colors group cursor-pointer" onClick={() => { setView('list'); setSearchQuery(stock.destination); }}>
                              <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-[var(--accent-muted)] flex items-center justify-center text-[var(--accent)] font-black text-xs shrink-0">
                                  {idx + 1}
                                </div>
                                {stock.icon && (
                                  <img src={stock.icon} alt={stock.destination} className="w-8 h-8 object-contain shrink-0" referrerPolicy="no-referrer" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-black text-sm text-[var(--text-main)] truncate group-hover:text-[var(--accent)] transition-colors">{stock.destination}</h4>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="text-sm font-black text-[var(--accent)]">{stock.mapsDone} maps</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Missing Maps Card */}
                      <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] shadow-lg overflow-hidden">
                        <div className="py-6 px-6 border-b border-[var(--border)] flex flex-col items-center gap-4">
                          <center>  <img src="Headers/missing-maps.png" alt="Most owned Maps" referrerPolicy="no-referrer" /> </center>

                          <label className="flex items-center cursor-pointer group">
                            <div className="relative flex items-center justify-center">
                              <input
                                type="checkbox"
                                className="peer sr-only"
                                checked={showMissingAdventure}
                                onChange={() => setShowMissingAdventure(!showMissingAdventure)}
                              />
                              <div className="w-4 h-4 border-2 border-[var(--border)] rounded bg-[var(--card)] peer-checked:bg-[var(--accent)] peer-checked:border-[var(--accent)] transition-all" />
                              <CheckCircle2 className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />

                            </div>
                            <span className="px-3 py-3 text-[14px] font-bold text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors whitespace-nowrap">  Show Adventure Maps        </span>
                            <div className="relative flex items-center justify-center">
                              <input
                                type="checkbox"
                                className="peer sr-only"
                                checked={showMissingAlliance}
                                onChange={() => setShowMissingAlliance(!showMissingAlliance)}
                              />
                              <div className="w-4 h-4 border-2 border-[var(--border)] rounded bg-[var(--card)] peer-checked:bg-[var(--accent)] peer-checked:border-[var(--accent)] transition-all" />
                              <CheckCircle2 className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                            </div>
                            <span className="px-3 py-3 text-[14px] font-bold text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors">  Show Alliance Maps         </span>
                          </label>


                        </div>
                        <div className="divide-y divide-[var(--border)]">
                          {mapCollectionStats.missingMaps.filter(d => {
                            if (d.category === 'Alliance Map Flights' && !showMissingAlliance) return false;
                            if (d.category === 'Adventure Map Flights' && !showMissingAdventure) return false;
                            return true;
                          }).length === 0 ? (
                            <div className="p-6 text-center text-[var(--text-muted)] font-bold">
                              You have at least 1 map for all non-3-star locations!
                            </div>
                          ) : (
                            mapCollectionStats.missingMaps.filter(d => {
                              if (d.category === 'Alliance Map Flights' && !showMissingAlliance) return false;
                              if (d.category === 'Adventure Map Flights' && !showMissingAdventure) return false;
                              return true;
                            }).map((dest, idx) => (
                              <div key={dest.id} className="p-4 hover:bg-[var(--bg)] transition-colors group cursor-pointer" onClick={() => { setView('list'); setSearchQuery(dest.destination); }}>
                                <div className="flex items-center gap-4">
                                  <div className="w-8 h-8 rounded-full bg-[var(--accent-muted)] flex items-center justify-center text-[var(--accent)] font-black text-xs shrink-0">
                                    {idx + 1}
                                  </div>
                                  {dest.icon && (
                                    <img src={dest.icon} alt={dest.destination} className="w-8 h-8 object-contain shrink-0" referrerPolicy="no-referrer" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-black text-sm text-[var(--text-main)] truncate group-hover:text-[var(--accent)] transition-colors">{dest.destination}</h4>
                                    <p className="text-[10px] font-bold text-[var(--text-muted)] opacity-60 truncate">
                                      {dest.category} • {dest.group.split(/[;,]/).map(g => g.trim()).join(', ')}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-center shrink-0">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-muted)] px-2.5 py-1 rounded-lg border border-[var(--accent)]/10">{dest.aircraft}</span>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : view === 'almost-next-star' ? (
                <div className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] shadow-lg overflow-hidden">
                    <img src="icons/AC-Header-NextStars.png" alt="Next Stars" className="mx-auto max-w-[450px] w-full object-contain drop-shadow-lg p-6 pb-0" referrerPolicy="no-referrer" />
                    <div className="flex items-center gap-6 px-6 pb-6">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="include-event-tasks"
                          checked={includeEventTasks}
                          onChange={() => setIncludeEventTasks(!includeEventTasks)}
                          className="w-5 h-5 accent-[var(--accent)]"
                        />
                        <label htmlFor="include-event-tasks" className="text-sm font-bold text-[var(--text-main)]">Include Event Tasks</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="include-alliance-tasks"
                          checked={includeAllianceTasks}
                          onChange={() => setIncludeAllianceTasks(!includeAllianceTasks)}
                          className="w-5 h-5 accent-[var(--accent)]"
                        />
                        <label htmlFor="include-alliance-tasks" className="text-sm font-bold text-[var(--text-main)]">Include Alliance Tasks</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="hide-zero-maps"
                          checked={hideZeroMaps}
                          onChange={() => setHideZeroMaps(!hideZeroMaps)}
                          className="w-5 h-5 accent-[var(--accent)]"
                        />
                        <label htmlFor="hide-zero-maps" className="text-sm font-bold text-[var(--text-main)]">Hide destinations with 0 maps</label>
                      </div>
                    </div>
                    <div className="divide-y divide-[var(--border)]">
                      {destinations
                        .filter(d => (includeEventTasks || d.category !== 'Event Flights') && (includeAllianceTasks || (d.category !== 'Alliance Task Flights' && d.category !== 'Alliance Map Flights')))
                        .filter(d => !hideZeroMaps || !d.needsMap || (d.mapsDone || 0) > 0)
                        .map(d => {
                          const info = getNextStarInfo(d);
                          return { ...d, needed: info.needed, nextStar: info.nextStar };
                        })
                        .filter(d => d.needed > 0)
                        .sort((a, b) => a.needed - b.needed)
                        .slice(0, 20)
                        .map((d, idx) => (
                          <div key={d.id} className="p-4 flex items-center gap-4 hover:bg-[var(--bg)] transition-colors cursor-pointer" onClick={() => {
                            setView('list');
                            setSearchQuery('');
                            setActiveCategory('All Destinations');
                            setFilterAircraft('All');
                            setFilterGroup('All');
                            setExpandedRowId(d.id);
                          }}>
                            <div className="w-8 h-8 rounded-full bg-[var(--accent-muted)] flex items-center justify-center text-[var(--accent)] font-black text-xs shrink-0">
                              {idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <button onClick={(e) => toggleBookmark(d.id, e)} className="hover:scale-110 transition-transform shrink-0" title={d.isCustomList ? "Remove from Bookmarks" : "Add to Bookmarks"}>
                                  <Bookmark className={`w-4 h-4 ${d.isCustomList ? 'fill-[var(--accent)] text-[var(--accent)]' : 'text-[var(--text-muted)] opacity-30 hover:opacity-100'}`} />
                                </button>
                                <h4 className="font-black text-sm text-[var(--text-main)] truncate">{d.destination}</h4>
                              </div>
                              <p className="text-xs text-[var(--text-muted)] truncate">
                                {d.group.split(/[;,]/).map(g => g.trim()).join(', ')} - {d.aircraft}
                                {d.needsMap && (
                                  <span className={(d.mapsDone || 0) === 0 ? 'text-red-500' : ''}>
                                    {` (${d.mapsDone || 0} map${(d.mapsDone || 0) === 1 ? '' : 's'} owned)`}
                                  </span>
                                )}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-black text-[var(--accent)]">{d.needed} flights to ⭐{d.nextStar}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : view === 'stats' ? (
                <div className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="max-w-4xl mx-auto space-y-12">
                    <div className="grid grid-cols-1 gap-8 items-start">
                      {/* Star Statistics Column */}
                      <div className="space-y-4">
                        <img src="icons/AC-Header-MyStars.png" alt="Star Stats" className="mx-auto max-w-[450px] w-full object-contain drop-shadow-lg" referrerPolicy="no-referrer" />

                        {/* Skill Stars Overview */}
                        <div className="rounded-3xl p-6 border border-[var(--border)] bg-[var(--card)] shadow-sm text-[var(--text-main)] relative overflow-hidden">
                          <div className="flex items-center gap-6 mb-6 relative z-10">
                            <div className="relative group">
                              <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl group-hover:bg-amber-400/40 transition-all duration-500" />
                              <img src="icons/star-icon.png" alt="Star" className="w-20 h-20 relative z-10 object-contain drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]" referrerPolicy="no-referrer" />
                            </div>
                            <div className="flex flex-col">
                              <h4 className="text-3xl font-medium tracking-tight text-[var(--text-main)] mb-1">Skill Stars</h4>
                              <p className="text-4xl font-black text-[var(--text-muted)] tracking-tighter">{globalStars.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="space-y-4 relative z-10">
                            {starCounts.ace > 0 && (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="flex -space-x-1">
                                    {[1, 2, 3, 4, 5].map(s => (
                                      <Star key={s} className="w-6 h-6 fill-amber-400 text-amber-500/50 stroke-[1.5px] stroke-black" />
                                    ))}
                                  </div>
                                  <span className="text-lg font-black text-[var(--text-main)] tracking-tight">Ace</span>
                                </div>
                                <span className="text-xl font-black text-[var(--text-muted)] tabular-nums">{starCounts.ace} ({starCounts.ace * 5} Stars)</span>
                              </div>
                            )}
                            {starCounts.captain > 0 && (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="flex -space-x-1">
                                    {[1, 2, 3, 4].map(s => (
                                      <Star key={s} className="w-6 h-6 fill-amber-400 text-amber-500/50 stroke-[1.5px] stroke-black" />
                                    ))}
                                  </div>
                                  <span className="text-lg font-black text-[var(--text-main)] tracking-tight">Captain</span>
                                </div>
                                <span className="text-xl font-black text-[var(--text-muted)] tabular-nums">{starCounts.captain} ({starCounts.captain * 4} Stars)</span>
                              </div>
                            )}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex -space-x-1">
                                  {[1, 2, 3].map(s => (
                                    <Star key={s} className="w-6 h-6 fill-amber-400 text-amber-500/50 stroke-[1.5px] stroke-black" />
                                  ))}
                                </div>
                                <span className="text-lg font-black text-[var(--text-main)] tracking-tight">Expert</span>
                              </div>
                              <span className="text-xl font-black text-[var(--text-muted)] tabular-nums">{starCounts.expert} ({starCounts.expert * 3} Stars)</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex -space-x-1">
                                  {[1, 2].map(s => (
                                    <Star key={s} className="w-6 h-6 fill-amber-400 text-amber-500/50 stroke-[1.5px] stroke-black" />
                                  ))}
                                </div>
                                <span className="text-lg font-black text-[var(--text-main)] tracking-tight">Master</span>
                              </div>
                              <span className="text-xl font-black text-[var(--text-muted)] tabular-nums">{starCounts.master} ({starCounts.master * 2} Stars)</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex -space-x-1">
                                  <Star className="w-6 h-6 fill-amber-400 text-amber-500/50 stroke-[1.5px] stroke-black" />
                                </div>
                                <span className="text-lg font-black text-[var(--text-main)] tracking-tight">Specialist</span>
                              </div>
                              <span className="text-xl font-black text-[var(--text-muted)] tabular-nums">{starCounts.specialist} ({starCounts.specialist * 1} Stars)</span>
                            </div>
                          </div>
                        </div>


                        <div className="rounded-3xl p-6 border border-[var(--border)] bg-[var(--card)] shadow-lg">
                          <h3 className="text-2xl font-black mb-8 text-[var(--text-main)] text-center">Stars by Destination Category</h3>
                          <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left whitespace-nowrap">
                              <thead>
                                <tr className="border-b border-[var(--border)] text-[var(--text-muted)] font-black uppercase text-[10px] tracking-widest">
                                  <th className="pb-4 px-4">Map Category</th>
                                  <th className="pb-4 px-4">Completion</th>
                                  <th className="pb-4 px-4 text-center">Stars Completed</th>
                                  <th className="pb-4 px-4 text-center">Stars Left</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[var(--border)]">
                                {statsBreakdown.map(cat => (
                                  <tr key={cat.name} className={`hover:bg-[var(--bg)] transition-all ${cat.name === 'All Destinations' ? 'bg-[var(--accent-muted)]' : ''}`}>
                                    <td className="py-6 px-4 font-bold text-lg text-[var(--text-main)]">{cat.name}</td>
                                    <td className="py-6 px-4 text-4xl font-black text-[var(--accent)]">{cat.percentage}%</td>
                                    <td className="py-6 px-4 text-center"><div className="flex flex-col"><span className="text-2xl font-black">{cat.starsGained.toLocaleString()}</span><span className="text-[10px] font-bold text-[var(--text-muted)] uppercase opacity-40">of {cat.maxStars.toLocaleString()} Total</span></div></td>
                                    <td className="py-6 px-4 text-center text-2xl font-black text-[var(--text-main)]">{(cat.maxStars - cat.starsGained).toLocaleString()}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Removed Top 10 Near Star section */}
                  </div>
                </div>
              ) : (
                <>
                  <div className={`${view === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4' : 'flex flex-col space-y-2'}`}>
                    {view === 'list' && (
                      <div className="hidden lg:grid sticky top-0 z-40 bg-[var(--bg)]/95 backdrop-blur-md grid-cols-[minmax(250px,2fr)_minmax(100px,1fr)_minmax(150px,1.5fr)_minmax(100px,1fr)_auto] gap-4 items-center px-4 py-4 mb-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border)] shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="cursor-pointer hover:text-[var(--text-main)] transition-colors flex items-center gap-1 group/col" onClick={() => handleSort('destination')}>
                            Destination {sortConfig.field === 'destination' ? (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 text-[var(--accent)]" /> : <ChevronDown className="w-3 h-3 text-[var(--accent)]" />) : <ArrowUpDown className="w-3 h-3 opacity-20 group-hover/col:opacity-50" />}
                          </div>
                          <div className="cursor-pointer hover:text-[var(--text-main)] transition-colors flex items-center gap-1 group/col" onClick={() => handleSort('group')}>
                            Map Set {sortConfig.field === 'group' ? (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 text-[var(--accent)]" /> : <ChevronDown className="w-3 h-3 text-[var(--accent)]" />) : <ArrowUpDown className="w-3 h-3 opacity-20 group-hover/col:opacity-50" />}
                          </div>
                        </div>
                        <div className="text-center cursor-pointer hover:text-[var(--text-main)] transition-colors flex items-center justify-center gap-1 group/col pr-[30px]" onClick={() => handleSort('aircraft')}>
                          Aircraft {sortConfig.field === 'aircraft' ? (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 text-[var(--accent)]" /> : <ChevronDown className="w-3 h-3 text-[var(--accent)]" />) : <ArrowUpDown className="w-3 h-3 opacity-20 group-hover/col:opacity-50" />}
                        </div>
                        <div />
                        <div className="text-center cursor-pointer hover:text-[var(--text-main)] transition-colors flex items-center justify-center gap-1 group/col pr-[30px]" onClick={() => handleSort('maps')}>
                          Maps {sortConfig.field === 'maps' ? (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 text-[var(--accent)]" /> : <ChevronDown className="w-3 h-3 text-[var(--accent)]" />) : <ArrowUpDown className="w-3 h-3 opacity-20 group-hover/col:opacity-50" />}
                        </div>
                        <div className="text-right cursor-pointer hover:text-[var(--text-main)] transition-colors flex items-center justify-end gap-1 group/col pr-[44px]" onClick={() => handleSort('flightsDone')}>
                          Flights {sortConfig.field === 'flightsDone' ? (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 text-[var(--accent)]" /> : <ChevronDown className="w-3 h-3 text-[var(--accent)]" />) : <ArrowUpDown className="w-3 h-3 opacity-20 group-hover/col:opacity-50" />}
                        </div>
                      </div>
                    )}
                    {sortedAndFilteredDestinations.map(dest => {
                      const stars = getStars(dest.flightsDone, dest.star1Req, dest.star2Req, dest.star3Req, dest.star4Req, dest.star5Req);
                      const maxStars = getMaxStars(dest);
                      const isExpanded = expandedRowId === dest.id;

                      const reqs = [dest.star1Req, dest.star2Req, dest.star3Req];
                      if (dest.star4Req && dest.star4Req > 0) reqs.push(dest.star4Req);
                      if (dest.star5Req && dest.star5Req > 0) reqs.push(dest.star5Req);
                      const maxReq = reqs[reqs.length - 1];

                      if (view === 'grid') {
                        return (
                          <div key={dest.id} className="group relative rounded-2xl p-4 border border-[var(--border)] bg-[var(--card)] transition-all hover:shadow-2xl hover:-translate-y-1.5 flex flex-col overflow-hidden">
                            {/* Top Status Bar */}
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: maxStars }, (_, i) => i + 1).map(s => (
                                  <Star key={s} className={`w-3 h-3 ${stars >= s ? 'fill-amber-400 text-amber-400' : 'text-[var(--border)] opacity-20'}`} />
                                ))}
                              </div>
                              <div className="flex items-center gap-2">
                                <button onClick={(e) => toggleBookmark(dest.id, e)} className="hover:scale-110 transition-transform" title={dest.isCustomList ? "Remove from Bookmarks" : "Add to Bookmarks"}>
                                  <Bookmark className={`w-4 h-4 ${dest.isCustomList ? 'fill-[var(--accent)] text-[var(--accent)]' : 'text-[var(--text-muted)] opacity-30 hover:opacity-100'}`} />
                                </button>
                                <span className="text-[9px] font-black uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-muted)] px-2 py-0.5 rounded-md border border-[var(--accent)]/10">{dest.aircraft}</span>
                              </div>
                            </div>

                            {/* Destination Info */}
                            <div className="mb-4 flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  {dest.icon && <img src={dest.icon} alt={dest.destination} className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />}
                                  <h3 className="text-sm font-black text-[var(--text-main)] leading-tight group-hover:text-[var(--accent)] transition-colors truncate">{dest.destination}</h3>
                                </div>
                                <p className="text-[10px] font-bold text-[var(--text-muted)] opacity-60 truncate">{dest.group.split(/[;,]/).map(g => g.trim()).join(', ')}</p>
                                {(() => {
                                  const info = getNextStarInfo(dest);
                                  const showNote = info.needed > 0 && (dest.flightsDone / info.nextReq) > 0.9;
                                  return showNote ? (
                                    <div className="mt-2 p-1.5 bg-amber-100 text-amber-800 text-[9px] font-bold rounded-lg border border-amber-200">
                                      You only need {info.needed} more flights to reach star ⭐{info.nextStar}!
                                    </div>
                                  ) : null;
                                })()}
                              </div>
                              {dest.icon && (
                                <img src={dest.icon} alt={dest.destination} className="w-8 h-8 object-contain shrink-0" referrerPolicy="no-referrer" />
                              )}
                            </div>

                            {/* Segmented Progress Bar */}
                            <div className="mb-4 flex flex-col gap-1.5">
                              <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-tighter">
                                <div className="flex items-center gap-1">
                                  <span className="text-[var(--text-main)]">{dest.flightsDone}</span>
                                  <span className="text-[var(--text-muted)] opacity-40">/ {maxReq}</span>
                                </div>
                                {dest.flightsDone < maxReq && (
                                  <span className="text-[var(--accent)] bg-[var(--accent-muted)] px-1.5 rounded-md">
                                    {(() => {
                                      const info = getNextStarInfo(dest);
                                      return `+${info.needed} to ⭐${info.nextStar}`;
                                    })()}
                                  </span>
                                )}
                              </div>
                              <div className="h-2 w-full bg-[var(--border)] rounded-full overflow-hidden shadow-inner flex gap-0.5 p-0.5">
                                {reqs.map((req, idx) => {
                                  const prevReq = idx === 0 ? 0 : reqs[idx - 1];
                                  const segmentSize = req - prevReq;
                                  const segmentProgress = Math.max(0, Math.min(segmentSize, dest.flightsDone - prevReq));
                                  const percentage = (segmentProgress / segmentSize) * 100;
                                  const colors = ['bg-amber-200', 'bg-amber-300', 'bg-amber-400', 'bg-amber-500', 'bg-amber-600'];

                                  return (
                                    <div key={idx} className="h-full bg-[var(--bg)] rounded-sm overflow-hidden flex-1 relative">
                                      <div
                                        className={`h-full transition-all duration-700 ${colors[idx] || 'bg-amber-500'}`}
                                        style={{ width: `${percentage}%` }}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Counters Cluster */}
                            <div className="flex flex-col gap-2 mt-auto">
                              {/* Flight Counter */}
                              <div className="p-1.5 rounded-xl flex items-center justify-between border border-[var(--border)] bg-[var(--bg)] shadow-inner group/counter hover:border-[var(--accent)] transition-colors">
                                <button
                                  onClick={() => updateFlightCount(dest.id, dest.flightsDone - 1)}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[var(--card)] text-[var(--text-muted)] active:scale-90 transition-all"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <div className="flex flex-col items-center">
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    className="w-10 bg-transparent text-center text-xs font-black outline-none text-[var(--text-main)]"
                                    value={dest.flightsDone}
                                    onChange={(e) => updateFlightCount(dest.id, parseInt(e.target.value.replace(/\D/g, '')) || 0)}
                                  />
                                  <span className="text-[7px] font-black uppercase opacity-40 -mt-1 tracking-tighter">Flights</span>
                                </div>
                                <button
                                  onClick={() => updateFlightCount(dest.id, dest.flightsDone + 1)}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-[var(--accent)] text-white shadow-md hover:scale-110 active:scale-90 transition-all"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Map Counter */}
                              {dest.needsMap ? (
                                <div className="p-1.5 rounded-xl flex items-center justify-between border border-[var(--border)] bg-[var(--bg)] shadow-inner group/counter hover:border-[var(--accent)] transition-colors">
                                  <button
                                    onClick={() => updateMapCount(dest.id, (dest.mapsDone || 0) - 1)}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[var(--card)] text-[var(--text-muted)] active:scale-90 transition-all"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <div className="flex flex-col items-center">
                                    <input
                                      type="text"
                                      inputMode="numeric"
                                      className="w-10 bg-transparent text-center text-xs font-black outline-none text-[var(--text-main)]"
                                      value={dest.mapsDone || 0}
                                      onChange={(e) => updateMapCount(dest.id, parseInt(e.target.value.replace(/\D/g, '')) || 0)}
                                    />
                                    <span className="text-[7px] font-black uppercase opacity-40 -mt-1 tracking-tighter">Maps</span>
                                  </div>
                                  <button
                                    onClick={() => updateMapCount(dest.id, (dest.mapsDone || 0) + 1)}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-[var(--accent)] text-white shadow-md hover:scale-110 active:scale-90 transition-all"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <div className="h-[46px] flex items-center justify-center opacity-5 border border-dashed border-[var(--text-muted)] rounded-xl">
                                  <MapIcon className="w-4 h-4" />
                                </div>
                              )}
                            </div>

                            {/* Footer Info */}
                            <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between">
                              <div className="flex items-center gap-1 opacity-40">
                                <Clock className="w-2.5 h-2.5" />
                                <span className="text-[8px] font-bold uppercase truncate max-w-[80px]">{formatTimestamp(dest.lastUpdated)}</span>
                              </div>
                              <div className="flex space-x-0.5">
                                {Array.from({ length: maxStars }, (_, i) => i + 1).map(s => (
                                  <Star key={s} className={`w-3 h-3 ${stars >= s ? 'fill-amber-400 text-amber-400 stroke-black stroke-[1px]' : 'text-[var(--text-muted)] opacity-10'}`} />
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      }

                      // List View Row (Redesigned for high-density information)
                      return (
                        <div
                          key={dest.id}
                          id={dest.id}
                          onClick={() => setExpandedRowId(isExpanded ? null : dest.id)}
                          className={`group rounded-xl border border-[var(--border)] bg-[var(--card)] transition-all cursor-pointer overflow-hidden ${isExpanded ? 'shadow-lg ring-2 ring-[var(--accent)]' : 'hover:bg-[var(--bg)] shadow-sm'}`}
                        >
                          {/* Main Row Content */}
                          <div className="px-4 py-3 grid grid-cols-1 lg:grid-cols-[minmax(250px,2fr)_minmax(100px,1fr)_minmax(150px,1.5fr)_minmax(100px,1fr)_auto] gap-4 items-center">
                            {/* Destination & Mission */}
                            <div className="min-w-0 flex items-center gap-3">
                              <button onClick={(e) => toggleBookmark(dest.id, e)} className="hover:scale-110 transition-transform shrink-0" title={dest.isCustomList ? "Remove from Bookmarks" : "Add to Bookmarks"}>
                                <Bookmark className={`w-5 h-5 ${dest.isCustomList ? 'fill-[var(--accent)] text-[var(--accent)]' : 'text-[var(--text-muted)] opacity-30 hover:opacity-100'}`} />
                              </button>
                              {dest.icon && (
                                <img src={dest.icon} alt={dest.destination} className="w-6 h-6 object-contain shrink-0" referrerPolicy="no-referrer" />
                              )}
                              <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-2">
                                  <h3 className="text-sm font-black truncate text-[var(--text-main)] leading-tight group-hover:text-[var(--accent)] transition-colors">{dest.destination}</h3>
                                </div>
                                <span className="text-[10px] font-bold text-[var(--text-muted)] truncate opacity-60">{dest.group.split(/[;,]/).map(g => g.trim()).join(', ')}</span>
                                {(() => {
                                  const info = getNextStarInfo(dest);
                                  const showNote = info.needed > 0 && (dest.flightsDone / info.nextReq) > 0.9;
                                  return showNote ? (
                                    <div className="mt-1 text-[9px] font-bold text-amber-700">
                                      Need {info.needed} more for star ⭐{info.nextStar}!
                                    </div>
                                  ) : null;
                                })()}
                              </div>
                            </div>

                            {/* Aircraft */}
                            <div className="hidden lg:flex flex-col items-center">
                              <span className="text-[10px] font-black uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-muted)] px-2.5 py-1 rounded-lg border border-[var(--accent)]/10">{dest.aircraft}</span>
                            </div>

                            {/* Progress Visualization (Segmented Bar) */}
                            <div className="flex flex-col gap-1.5 min-w-[140px]">
                              <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-tighter text-[var(--text-muted)]">
                                <div className="flex items-center gap-1">
                                  <span className="text-[var(--text-main)]">{dest.flightsDone}</span>
                                  <span className="opacity-40">/ {maxReq}</span>
                                </div>
                              </div>
                              <div className="h-2 w-full bg-[var(--border)] rounded-full overflow-hidden shadow-inner flex gap-0.5 p-0.5">
                                {reqs.map((req, idx) => {
                                  const prevReq = idx === 0 ? 0 : reqs[idx - 1];
                                  const segmentSize = req - prevReq;
                                  const segmentProgress = Math.max(0, Math.min(segmentSize, dest.flightsDone - prevReq));
                                  const percentage = (segmentProgress / segmentSize) * 100;
                                  const colors = ['bg-amber-200', 'bg-amber-300', 'bg-amber-400', 'bg-amber-500', 'bg-amber-600'];

                                  return (
                                    <div key={idx} className="h-full bg-[var(--bg)] rounded-sm overflow-hidden flex-1 relative">
                                      <div
                                        className={`h-full transition-all duration-700 ${colors[idx] || 'bg-amber-500'}`}
                                        style={{ width: `${percentage}%` }}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Inline Map Counter (Editable in List Mode) */}
                            <div className="flex items-center justify-center gap-3">
                              <div className="hidden sm:flex space-x-0.5 w-[60px] justify-center">
                                {Array.from({ length: maxStars }, (_, i) => i + 1).map(s => (
                                  <Star key={s} className={`w-3.5 h-3.5 ${stars >= s ? 'fill-amber-400 text-amber-400 stroke-black stroke-[1px]' : 'text-[var(--text-muted)] opacity-10'}`} />
                                ))}
                              </div>
                              {dest.needsMap ? (
                                <div className="flex items-center gap-1.5 bg-[var(--bg)] border border-[var(--border)] rounded-xl p-1 shadow-sm hover:border-[var(--accent)] transition-colors w-[116px]" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); updateMapCount(dest.id, (dest.mapsDone || 0) - 1); }}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[var(--card)] text-[var(--text-muted)] transition-all active:scale-90"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <div className="flex flex-col items-center min-w-[28px]">
                                    <input
                                      type="text"
                                      inputMode="numeric"
                                      className="w-10 bg-transparent text-center text-xs font-black outline-none text-[var(--text-main)]"
                                      value={dest.mapsDone || 0}
                                      onChange={(e) => updateMapCount(dest.id, parseInt(e.target.value.replace(/\D/g, '')) || 0)}
                                    />
                                    <span className="text-[7px] font-black uppercase opacity-40 -mt-1 tracking-tighter">Maps</span>
                                  </div>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); updateMapCount(dest.id, (dest.mapsDone || 0) + 1); }}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-[var(--accent)] text-white shadow-md hover:scale-110 transition-all active:scale-90"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center opacity-10 w-[116px]">
                                  <MapIcon className="w-4 h-4 mb-0.5" />
                                  <span className="text-[7px] font-black uppercase tracking-widest">N/A</span>
                                </div>
                              )}
                            </div>

                            {/* Stars & Inline Flight Counter */}
                            <div className="flex items-center justify-end gap-6">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 bg-[var(--bg)] border border-[var(--border)] rounded-xl p-1 shadow-sm hover:border-[var(--accent)] transition-colors" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); updateFlightCount(dest.id, dest.flightsDone - 1); }}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[var(--card)] text-[var(--text-muted)] active:scale-90 transition-transform"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <div className="flex flex-col items-center min-w-[28px]">
                                    <input
                                      type="text"
                                      inputMode="numeric"
                                      className="w-10 bg-transparent text-center text-xs font-black outline-none"
                                      value={dest.flightsDone}
                                      onChange={(e) => updateFlightCount(dest.id, parseInt(e.target.value.replace(/\D/g, '')) || 0)}
                                    />
                                    <span className="text-[7px] font-black uppercase opacity-40 -mt-1 tracking-tighter">Flights</span>
                                  </div>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); updateFlightCount(dest.id, dest.flightsDone + 1); }}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-[var(--accent)] text-white shadow-md hover:scale-110 transition-all active:scale-90"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--accent-muted)] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Expanded Content (Detailed View) */}
                          {isExpanded && (
                            <div className="px-6 pb-6 pt-2 border-t border-[var(--border)] bg-[var(--bg)]/30 animate-in slide-in-from-top-2 duration-200">
                              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-start">
                                {/* Left Side: Detailed Progress */}
                                <div className="flex flex-col gap-6">
                                  <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                      <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Full Flight Log</span>
                                      <div className="flex items-center gap-4 mt-1">
                                        {dest.icon && (
                                          <img src={dest.icon} alt={dest.destination} className="w-16 h-16 object-contain shrink-0" referrerPolicy="no-referrer" />
                                        )}
                                        <div className="flex items-baseline gap-2">
                                          <span className="text-3xl font-black text-[var(--text-main)]">{dest.flightsDone}</span>
                                          <span className="text-sm font-bold text-[var(--text-muted)]">/ {maxReq} flights</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Large Progress Bar with Markers */}
                                  <div className="relative pt-6 pb-2">
                                    <div className="h-4 w-full bg-[var(--border)] rounded-full overflow-hidden shadow-inner">
                                      <div
                                        className="h-full bg-gradient-to-r from-amber-300 to-amber-600 transition-all duration-500"
                                        style={{ width: `${Math.min(100, (dest.flightsDone / maxReq) * 100)}%` }}
                                      />
                                    </div>
                                    {/* Star Markers */}
                                    {reqs.map((req, idx) => {
                                      const pos = (req / maxReq) * 100;
                                      const isReached = dest.flightsDone >= req;
                                      return (
                                        <div key={idx} className="absolute top-0 -translate-x-1/2 flex flex-col items-center" style={{ left: `${pos}%` }}>
                                          <Star className={`w-4 h-4 mb-1 ${isReached ? 'fill-amber-400 text-amber-400' : 'text-[var(--text-muted)] opacity-30'}`} />
                                          <div className={`w-0.5 h-6 ${isReached ? 'bg-amber-400' : 'bg-[var(--border)]'}`} />
                                          <span className="text-[9px] font-black mt-1 text-[var(--text-muted)]">{req}</span>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* Detailed Metadata */}
                                  <div className="flex items-center gap-6 mt-2">
                                    <div className="flex items-center gap-2 text-[var(--text-muted)]">
                                      <Clock className="w-4 h-4" />
                                      <span className="text-[10px] font-bold uppercase">Last Flight: {formatTimestamp(dest.lastUpdated)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[var(--text-muted)]">
                                      <Layers className="w-4 h-4" />
                                      <span className="text-[10px] font-bold uppercase">{dest.category} • {dest.group.split(/[;,]/).map(g => g.trim()).join(', ')}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Right Side: Map Summary */}
                                {dest.needsMap && (
                                  <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-md flex flex-col items-center gap-4 min-w-[160px]">
                                    <div className="flex items-center gap-2 text-[var(--accent)]">
                                      <MapIcon className="w-5 h-5" />
                                      <span className="text-xs font-black uppercase tracking-widest">Map Inventory</span>
                                    </div>
                                    <div className="text-4xl font-black text-[var(--text-main)]">{dest.mapsDone || 0}</div>
                                    <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-tight">Current Stock</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Switched to Quicksand for an even softer, more rounded font experience */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300..700&family=Anton&display=swap');
        * { font-family: 'Inter', sans-serif !important; }
        :root { --bg: #7A98A8; --sidebar: #5C7C8C; --card: #B0C4CE; --text-main: #1A2B34; --text-muted: #4A606C; --accent: #00A0D6; --accent-muted: #FFB833; --border: #5C7C8C; }
        .theme-classic { --bg: #7A98A8; --sidebar: #5C7C8C; --card: #B0C4CE; --text-main: #1A2B34; --text-muted: #4A606C; --accent: #00A0D6; --accent-muted: #FFB833; --border: #5C7C8C; }
        .theme-dark { --bg: #0a0e17; --sidebar: #111827; --card: #1f2937; --text-main: #f1f5f9; --text-muted: #94a3b8; --accent: #818cf8; --accent-muted: #1e1b4b; --border: #334155; }
        .theme-coffee { --bg: #faf7f5; --sidebar: #ffffff; --card: #ffffff; --text-main: #433422; --text-muted: #8c7851; --accent: #7c2d12; --accent-muted: #fff7ed; --border: #eaddd7; }
        .theme-ocean { --bg: #0c1c2e; --sidebar: #13273e; --card: #1a365d; --text-main: #ffffff; --text-muted: #94a3b8; --accent: #38bdf8; --accent-muted: #082f49; --border: #1e40af; }
        .theme-nord { --bg: #2e3440; --sidebar: #3b4252; --card: #434c5e; --text-main: #eceff4; --text-muted: #d8dee9; --accent: #88c0d0; --accent-muted: #4c566a; --border: #4c566a; }
        .theme-dracula { --bg: #282a36; --sidebar: #44475a; --card: #282a36; --text-main: #f8f8f2; --text-muted: #a695e7; --accent: #bd93f9; --accent-muted: #44475a; --border: #6272a4; }
        .theme-gruvbox { --bg: #282828; --sidebar: #3c3836; --card: #282828; --text-main: #ebdbb2; --text-muted: #a89984; --accent: #fabd2f; --accent-muted: #3c3836; --border: #504945; }
        .theme-synthwave { --bg: #2b065a; --sidebar: #1b043a; --card: #2b065a; --text-main: #ffffff; --text-muted: #d1d5db; --accent: #00ffff; --accent-muted: #1b043a; --border: #ff00ff; }
        .theme-forest { --bg: #061a06; --sidebar: #0b2e0b; --card: #061a06; --text-main: #e8f5e9; --text-muted: #bbf7d0; --accent: #4caf50; --accent-muted: #0b2e0b; --border: #1b5e20; }
        .theme-minimal { --bg: #ffffff; --sidebar: #f8fafc; --card: #ffffff; --text-main: #000000; --text-muted: #64748b; --accent: #000000; --accent-muted: #f1f5f9; --border: #e2e8f0; }
        .theme-sunset { --bg: #2d1b2e; --sidebar: #1a0f1c; --card: #3d263f; --text-main: #fceabb; --text-muted: #f8b500; --accent: #ff6b6b; --accent-muted: #592e3c; --border: #592e3c; }
        .theme-cyberpunk { --bg: #0f0f0f; --sidebar: #050505; --card: #141414; --text-main: #fcee0a; --text-muted: #00ff9f; --accent: #00ffff; --accent-muted: #2b00ff; --border: #fcee0a; }
        .theme-lavender { --bg: #f3e8ff; --sidebar: #faf5ff; --card: #ffffff; --text-main: #4c1d95; --text-muted: #7c3aed; --accent: #8b5cf6; --accent-muted: #ddd6fe; --border: #c4b5fd; }
        .theme-monochrome { --bg: #000000; --sidebar: #0a0a0a; --card: #111111; --text-main: #ffffff; --text-muted: #a3a3a3; --accent: #ffffff; --accent-muted: #262626; --border: #404040; }
        .theme-autumn { --bg: #fff7ed; --sidebar: #ffedd5; --card: #ffffff; --text-main: #7c2d12; --text-muted: #9a3412; --accent: #ea580c; --accent-muted: #fed7aa; --border: #fdba74; }
        .theme-matrix { --bg: #000000; --sidebar: #001100; --card: #000a00; --text-main: #00ff41; --text-muted: #008f11; --accent: #00ff41; --accent-muted: #003b00; --border: #008f11; }
        .theme-rose { --bg: #fff1f2; --sidebar: #ffe4e6; --card: #ffffff; --text-main: #881337; --text-muted: #be123c; --accent: #e11d48; --accent-muted: #fecdd3; --border: #fda4af; }
        .theme-abyss { --bg: #000814; --sidebar: #000000; --card: #001233; --text-main: #e0fbfc; --text-muted: #98c1d9; --accent: #ee6c4d; --accent-muted: #002855; --border: #002855; }
        .theme-solarized_light { --bg: #fdf6e3; --sidebar: #eee8d5; --card: #fdf6e3; --text-main: #657b83; --text-muted: #93a1a1; --accent: #268bd2; --accent-muted: #eee8d5; --border: #93a1a1; }
        .theme-solarized_dark { --bg: #002b36; --sidebar: #073642; --card: #002b36; --text-main: #839496; --text-muted: #586e75; --accent: #b58900; --accent-muted: #073642; --border: #586e75; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
};

const container = document.getElementById('root')!;
const root = (window as any)._reactRoot || createRoot(container);
(window as any)._reactRoot = root;
root.render(<AeroQuest />);
