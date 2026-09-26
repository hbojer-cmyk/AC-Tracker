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
  Bookmark,
  PanelLeftClose,
  PanelLeftOpen,
  PanelLeft,
  Compass,
  Sparkles,
  Sliders,
  Filter,
  Check,
  AlertTriangle,
  X,
  ExternalLink,
  ShieldCheck,
  Zap,
  RefreshCw,
  Eye,
  EyeOff,
  Info
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
import { getMapDuration } from './mapTimers';
import { AirplanesPage, AIRCRAFT_SPRITES } from './AirplanesPage';
import { AboutPage } from './AboutPage';
import { adjustAircraftList } from './src/aircraftData';

// --- App Version & Maintenance Tracker ---
// NOTE: Always update APP_UPDATED_DATE whenever making changes in the app
export const APP_VERSION = 'Version 2.0';
export const APP_UPDATED_DATE = 'Sep 26, 2026';

// --- Types & Interfaces ---
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
  mapDuration?: string;
  lastUpdated: number;
  isCustomList?: boolean;
}

interface UserDataEntry {
  count: number;
  lastUpdated: number;
  maps?: number;
  isCustomList?: boolean;
}

type SortField =
  | 'destination'
  | 'aircraft'
  | 'group'
  | 'flightsDone'
  | 'currentStarFlights'
  | 'stars'
  | 'mastery'
  | 'lastUpdated'
  | 'maps'
  | 'neededToNextStar';


type SortDirection = 'asc' | 'desc';

type ViewMode = 'list' | 'grid' | 'maps' | 'airplanes' | 'stats' | 'about';

export type ThemeId =
  | 'mach-blue'
  | 'blackbird'
  | 'golden-hour'
  | 'aurora'
  | 'cyber-runway'
  | 'first-class'
  | 'red-flag'
  | 'orbital'
  | 'storm-chaser'
  | 'pacific-clipper'
  | 'mojave-dusk'
  | 'stealth-ghost'
  | 'alpine-flight'
  // Theme Factory Templates
  | 'arctic-frost'
  | 'botanical-garden'
  | 'desert-rose'
  | 'forest-canopy'
  | 'golden-autumn'
  | 'midnight-galaxy'
  | 'modern-minimalist'
  | 'ocean-depths'
  | 'sunset-boulevard'
  | 'tech-innovation';

export interface ThemeConfig {
  name: string;
  isDark: boolean;
  tag: string;
  desc: string;
  bgPreview: string;
  surfacePreview: string;
  accentPreview: string;
  badgePreview: string;
  category?: 'core' | 'theme-factory';
}

export const THEME_CONFIGS: Record<ThemeId, ThemeConfig> = {
  'mach-blue': {
    name: 'Mach 3 Stratosphere',
    isDark: true,
    tag: 'SUPERSONIC',
    desc: 'Midnight void with electric horizon cyan & afterburner gold',
    bgPreview: '#030712',
    surfacePreview: '#0a1931',
    accentPreview: '#00e5ff',
    badgePreview: '#38bdf8',
    category: 'core',
  },
  'blackbird': {
    name: 'SR-71 Blackbird',
    isDark: true,
    tag: 'STEALTH TITANIUM',
    desc: 'Titanium carbon matte with amber gold avionics displays',
    bgPreview: '#0b0d11',
    surfacePreview: '#1a1e27',
    accentPreview: '#f59e0b',
    badgePreview: '#fbbf24',
    category: 'core',
  },
  'golden-hour': {
    name: 'Cruising FL380',
    isDark: true,
    tag: 'FL380 SUNSET',
    desc: 'Transcontinental dusk with warm coral glow & amber stars',
    bgPreview: '#120a1c',
    surfacePreview: '#26163b',
    accentPreview: '#ff6b4a',
    badgePreview: '#ff8a65',
    category: 'core',
  },
  'aurora': {
    name: 'Aurora Borealis',
    isDark: true,
    tag: 'POLAR RADAR',
    desc: 'Deep spruce arctic night with radiant emerald & mint aurora',
    bgPreview: '#03100d',
    surfacePreview: '#0d2822',
    accentPreview: '#00ffb3',
    badgePreview: '#34d399',
    category: 'core',
  },
  'cyber-runway': {
    name: 'Tokyo Haneda Night',
    isDark: true,
    tag: 'NIGHT ATC',
    desc: 'Rainy runway tarmac with neon magenta beacon & cyan vectors',
    bgPreview: '#05050a',
    surfacePreview: '#161226',
    accentPreview: '#f72585',
    badgePreview: '#4cc9f0',
    category: 'core',
  },
  'first-class': {
    name: 'First Class Suite',
    isDark: false,
    tag: 'DAYLIGHT LUXURY',
    desc: 'Daylight frosted alabaster with presidential navy & champagne gold',
    bgPreview: '#f4f6fa',
    surfacePreview: '#ffffff',
    accentPreview: '#c29438',
    badgePreview: '#87641c',
    category: 'core',
  },
  'red-flag': {
    name: 'Red Flag Combat',
    isDark: true,
    tag: 'COMBAT FLIR',
    desc: 'Covert night vision tactical HUD with phosphor green displays',
    bgPreview: '#020803',
    surfacePreview: '#0a200e',
    accentPreview: '#39ff14',
    badgePreview: '#39ff14',
    category: 'core',
  },
  'orbital': {
    name: 'Cosmic Orbital',
    isDark: true,
    tag: 'SPACE PROGRAM',
    desc: 'Deep space void with solar plasma purple & supernova gold',
    bgPreview: '#080312',
    surfacePreview: '#1a0f35',
    accentPreview: '#e040fb',
    badgePreview: '#ea80fc',
    category: 'core',
  },
  'storm-chaser': {
    name: 'Storm Chaser',
    isDark: true,
    tag: 'THUNDERSTORM',
    desc: 'Deep squall-line slate with electric lightning volt accents',
    bgPreview: '#070b14',
    surfacePreview: '#142036',
    accentPreview: '#facc15',
    badgePreview: '#fde047',
    category: 'core',
  },
  'pacific-clipper': {
    name: 'Pan Am Clipper',
    isDark: true,
    tag: 'OCEANIC TRANSIT',
    desc: 'Maritime nautical deep abyss with luminous seafoam turquoise',
    bgPreview: '#030d13',
    surfacePreview: '#0e2736',
    accentPreview: '#14b8a6',
    badgePreview: '#2dd4bf',
    category: 'core',
  },
  'mojave-dusk': {
    name: 'Mojave Airfield',
    isDark: true,
    tag: 'DESERT RUNWAY',
    desc: 'Sunbaked desert dark roast with terracotta copper & warm amber flare',
    bgPreview: '#100b08',
    surfacePreview: '#291c14',
    accentPreview: '#f97316',
    badgePreview: '#fb923c',
    category: 'core',
  },
  'stealth-ghost': {
    name: 'Ghost Radar OLED',
    isDark: true,
    tag: 'MINIMAL MONOCHROME',
    desc: 'Pure OLED deep black with surgical monochrome silver & frost accents',
    bgPreview: '#000000',
    surfacePreview: '#141414',
    accentPreview: '#e2e8f0',
    badgePreview: '#94a3b8',
    category: 'core',
  },
  'alpine-flight': {
    name: 'Alpine Snow Flight',
    isDark: false,
    tag: 'GLACIAL DAYLIGHT',
    desc: 'Daylight glacial frost with crisp cobalt sky & ice crest highlights',
    bgPreview: '#f1f5f9',
    surfacePreview: '#ffffff',
    accentPreview: '#0284c7',
    badgePreview: '#0369a1',
    category: 'core',
  },

  // --- Theme Factory Template Themes ---
  'arctic-frost': {
    name: 'Arctic Frost',
    isDark: false,
    tag: 'ICE PATROL',
    desc: 'Crisp glacial ice blue with steel blue avionics and silver metallic trim',
    bgPreview: '#eaf2fa',
    surfacePreview: '#ffffff',
    accentPreview: '#4a6fa5',
    badgePreview: '#325280',
    category: 'theme-factory',
  },
  'botanical-garden': {
    name: 'Botanical Garden',
    isDark: false,
    tag: 'EQUATORIAL',
    desc: 'Organic cream base with fern green canopy, marigold markers and terracotta accents',
    bgPreview: '#f5f3ed',
    surfacePreview: '#ffffff',
    accentPreview: '#4a7c59',
    badgePreview: '#f9a620',
    category: 'theme-factory',
  },
  'desert-rose': {
    name: 'Desert Rose',
    isDark: true,
    tag: 'MIRAGE TWILIGHT',
    desc: 'Deep burgundy night flight with dusty rose instruments and warm clay glow',
    bgPreview: '#1f1019',
    surfacePreview: '#2b1623',
    accentPreview: '#d4a5a5',
    badgePreview: '#b87d6d',
    category: 'theme-factory',
  },
  'forest-canopy': {
    name: 'Forest Canopy',
    isDark: true,
    tag: 'DEEP CANOPY',
    desc: 'Primeval pine woodland darkness with olive vectors and sage foliage telemetry',
    bgPreview: '#0e180e',
    surfacePreview: '#172616',
    accentPreview: '#a4ac86',
    badgePreview: '#7d8471',
    category: 'theme-factory',
  },
  'golden-autumn': {
    name: 'Golden Hour Autumn',
    isDark: false,
    tag: 'INDIAN SUMMER',
    desc: 'Warm beige daylight expanse with mustard amber radar, terracotta tones and chocolate anchors',
    bgPreview: '#f4ede4',
    surfacePreview: '#ffffff',
    accentPreview: '#d98200',
    badgePreview: '#c1666b',
    category: 'theme-factory',
  },
  'midnight-galaxy': {
    name: 'Midnight Galaxy',
    isDark: true,
    tag: 'COSMIC DEEP',
    desc: 'Deep cosmic nebula purple with celestial blue avionics and radiant lavender glow',
    bgPreview: '#140c1f',
    surfacePreview: '#1e122e',
    accentPreview: '#a490c2',
    badgePreview: '#4a4e8f',
    category: 'theme-factory',
  },
  'modern-minimalist': {
    name: 'Modern Minimalist',
    isDark: false,
    tag: 'MONOLITH SLATE',
    desc: 'Architectural light grayscale with slate charcoal typography and precision platinum borders',
    bgPreview: '#f3f4f6',
    surfacePreview: '#ffffff',
    accentPreview: '#36454f',
    badgePreview: '#708090',
    category: 'theme-factory',
  },
  'ocean-depths': {
    name: 'Ocean Depths',
    isDark: true,
    tag: 'MARITIME RECON',
    desc: 'Suboceanic deep navy void with vibrant deep-sea teal instrumentation and seafoam crests',
    bgPreview: '#0d131d',
    surfacePreview: '#141c2b',
    accentPreview: '#2d8b8b',
    badgePreview: '#a8dadc',
    category: 'theme-factory',
  },
  'sunset-boulevard': {
    name: 'Sunset Boulevard',
    isDark: true,
    tag: 'RUNWAY DUSK',
    desc: 'Deep teal-charcoal horizon with fiery burnt orange afterglow and radiant coral flare',
    bgPreview: '#14242b',
    surfacePreview: '#1c323c',
    accentPreview: '#e76f51',
    badgePreview: '#f4a261',
    category: 'theme-factory',
  },
  'tech-innovation': {
    name: 'Tech Innovation',
    isDark: true,
    tag: 'AVIONICS LAB',
    desc: 'Sleek carbon dark gray with high-voltage electric blue vectors and piercing neon cyan telemetry',
    bgPreview: '#101012',
    surfacePreview: '#191920',
    accentPreview: '#0066ff',
    badgePreview: '#00ffff',
    category: 'theme-factory',
  },
};

// Legacy & Alias Theme Fallbacks
const THEME_FALLBACK_MAP: Record<string, ThemeId> = {
  classic: 'first-class',
  daylight: 'first-class',
  dark: 'mach-blue',
  stealth: 'blackbird',
  abyss: 'mach-blue',
  nord: 'aurora',
  nordic: 'aurora',
  dracula: 'orbital',
  nebula: 'orbital',
  gruvbox: 'blackbird',
  forest: 'red-flag',
  tactical: 'red-flag',
  sunset: 'golden-hour',
  ocean: 'mach-blue',
  solarized_dark: 'blackbird',
  cyber: 'cyber-runway',
  slate: 'storm-chaser',
  storm: 'storm-chaser',
  thunder: 'storm-chaser',
  clipper: 'pacific-clipper',
  teal: 'pacific-clipper',
  mojave: 'mojave-dusk',
  desert: 'mojave-dusk',
  copper: 'mojave-dusk',
  oled: 'stealth-ghost',
  monochrome: 'stealth-ghost',
  ghost: 'stealth-ghost',
  alpine: 'alpine-flight',
  snow: 'alpine-flight',
  ice: 'alpine-flight',
  arctic: 'arctic-frost',
  frost: 'arctic-frost',
  botanical: 'botanical-garden',
  garden: 'botanical-garden',
  rose: 'desert-rose',
  canopy: 'forest-canopy',
  autumn: 'golden-autumn',
  galaxy: 'midnight-galaxy',
  minimalist: 'modern-minimalist',
  depths: 'ocean-depths',
  sunset_boulevard: 'sunset-boulevard',
  boulevard: 'sunset-boulevard',
  tech: 'tech-innovation',
  innovation: 'tech-innovation',
};

const AIRCRAFT_ORDER: Record<string, number> = {
  Swallow: 1,
  Swift: 2,
  Owl: 3,
  Hawk: 4,
  Raven: 5,
  Eagle: 6,
  Jumbo: 7,
  Giant: 8,
  Falcon: 9,
  Thunderbird: 10,
  Condor: 11,
  Sparrow: 12,
  Crossbill: 13,
  Goldfinch: 14,
  Sleigh: 15,
  LP1: 16,
  LP2: 17,
  LP3: 18,
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
  'Event Flights',
];

const QUICK_FILTERS = [
  {
    id: 'regular',
    label: 'Regular & Heli',
    match: (d: FlightDestination) => d.category === 'Regular Flights' || d.category === 'Helicopter Flights',
  },
  {
    id: 'adventure',
    label: 'Adventure & Space',
    match: (d: FlightDestination) =>
      d.category === 'Adventure Map Flights' ||
      d.category === 'Space Map Flights' ||
      d.category === 'Space Launches',
  },
  {
    id: 'alliance',
    label: 'Alliance Flights',
    match: (d: FlightDestination) =>
      d.category === 'Alliance Task Flights' || d.category === 'Alliance Map Flights',
  },
  { id: 'event', label: 'Event Flights', match: (d: FlightDestination) => d.category === 'Event Flights' },
];

const CATEGORY_ICONS: Record<string, string> = {
  'All Destinations': 'Map-icons/standard_icon.png',
  'Regular Flights': 'icons/flights_icon.png',
  'Helicopter Flights': 'icons/helicopter_icon.png',
  'Adventure Map Flights': 'icons/adventure_icon.png',
  'Alliance Map Flights': 'icons/alliance__icon.png',
  'Alliance Task Flights': 'icons/alliance__icon.png',
  'Space Map Flights': 'Map-icons/space_map_icon.png',
  'Space Launches': 'Map-icons/space_icon.png',
  'Event Flights': 'icons/event_icon.png',
};

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

const STAR_RANKS = [
  { star: 1, name: 'Specialist', short: 'Spec' },
  { star: 2, name: 'Master', short: 'Mast' },
  { star: 3, name: 'Expert', short: 'Exp' },
  { star: 4, name: 'Captain', short: 'Capt' },
  { star: 5, name: 'Ace', short: 'Ace' },
];

const GAME_STAR_RANKS = [
  { star: 5, name: 'Ace', key: 'ace' as const },
  { star: 4, name: 'Captain', key: 'captain' as const },
  { star: 3, name: 'Expert', key: 'expert' as const },
  { star: 2, name: 'Master', key: 'master' as const },
  { star: 1, name: 'Specialist', key: 'specialist' as const },
];

const getNextStarInfo = (d: FlightDestination) => {
  const reqs: { req: number; star: number; rank: string }[] = [
    { req: d.star1Req, star: 1, rank: 'Specialist' },
    { req: d.star2Req, star: 2, rank: 'Master' },
    { req: d.star3Req, star: 3, rank: 'Expert' },
  ];
  if (d.star4Req && d.star4Req > 0) reqs.push({ req: d.star4Req, star: 4, rank: 'Captain' });
  if (d.star5Req && d.star5Req > 0) reqs.push({ req: d.star5Req, star: 5, rank: 'Ace' });

  for (const item of reqs) {
    if (d.flightsDone < item.req) {
      return {
        nextReq: item.req,
        nextStar: item.star,
        rank: item.rank,
        needed: item.req - d.flightsDone,
      };
    }
  }
  const maxReq = reqs[reqs.length - 1].req;
  const maxStar = reqs[reqs.length - 1].star;
  const maxRank = reqs[reqs.length - 1].rank;
  return { nextReq: maxReq, nextStar: maxStar, rank: maxRank, needed: 0 };
};

interface CurrentStarDetails {
  currentStar: number;
  tierDone: number;
  tierTarget: number;
  prevThreshold: number;
  nextThreshold: number;
  isMastered: boolean;
}

const getCurrentStarDetails = (d: FlightDestination): CurrentStarDetails => {
  const reqs = [d.star1Req, d.star2Req, d.star3Req];
  if (d.star4Req && d.star4Req > 0) reqs.push(d.star4Req);
  if (d.star5Req && d.star5Req > 0) reqs.push(d.star5Req);

  let prevThreshold = 0;
  for (let i = 0; i < reqs.length; i++) {
    const nextThreshold = reqs[i];
    const tierTarget = nextThreshold - prevThreshold;
    if (d.flightsDone < nextThreshold) {
      return {
        currentStar: i + 1,
        tierDone: Math.max(0, d.flightsDone - prevThreshold),
        tierTarget,
        prevThreshold,
        nextThreshold,
        isMastered: false,
      };
    }
    prevThreshold = nextThreshold;
  }

  const lastTarget = reqs.length > 1 ? reqs[reqs.length - 1] - reqs[reqs.length - 2] : reqs[0];
  return {
    currentStar: reqs.length,
    tierDone: lastTarget,
    tierTarget: lastTarget,
    prevThreshold: reqs[reqs.length - 1],
    nextThreshold: reqs[reqs.length - 1],
    isMastered: true,
  };
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

interface EditableNumberInputProps {
  value: number;
  onChange: (val: number) => void;
  className?: string;
  min?: number;
  max?: number;
  ariaLabel?: string;
  title?: string;
}

const EditableNumberInput: React.FC<EditableNumberInputProps> = ({
  value,
  onChange,
  className = '',
  min = 0,
  max,
  ariaLabel,
  title,
}) => {
  const [localVal, setLocalVal] = useState<string>(String(value));
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    if (!isFocused) {
      setLocalVal(String(value));
    }
  }, [value, isFocused]);

  const commitValue = (valStr: string) => {
    let parsed = parseInt(valStr, 10);
    if (isNaN(parsed) || parsed < min) {
      parsed = min;
    }
    if (max !== undefined && parsed > max) {
      parsed = max;
    }
    setLocalVal(String(parsed));
    if (parsed !== value) {
      onChange(parsed);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setLocalVal(raw);
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && parsed >= min && (max === undefined || parsed <= max)) {
      onChange(parsed);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    commitValue(localVal);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      commitValue(localVal);
      (e.target as HTMLInputElement).blur();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const current = parseInt(localVal, 10) || 0;
      const next = max !== undefined ? Math.min(max, current + 1) : current + 1;
      setLocalVal(String(next));
      onChange(next);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const current = parseInt(localVal, 10) || 0;
      const next = Math.max(min, current - 1);
      setLocalVal(String(next));
      onChange(next);
    }
  };

  return (
    <input
      type="number"
      value={isFocused ? localVal : value}
      onChange={handleInputChange}
      onFocus={e => {
        setIsFocused(true);
        e.target.select();
      }}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      min={min}
      max={max}
      aria-label={ariaLabel}
      title={title || 'Click to type a number'}
      className={`hide-arrows number-input-prominent ${className}`}
    />
  );
};

export interface LogoOptionConfig {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  file: string;
  description: string;
  inspiration: string;
  highlights: string[];
}

export const LOGO_OPTIONS: LogoOptionConfig[] = [
  {
    id: 'opt1',
    name: 'Winged Control Tower Medallion',
    subtitle: 'Recommended • Direct Airport City 3D Evolution',
    badge: 'Recommended',
    file: 'icons/act-logo-opt1.png',
    description: 'A circular brushed-titanium and gold aviation medallion with 3-tier sculpted gold wings. Features the iconic golden Airport City control tower, city skyline, a soaring jet with cyan contrail arc, and an embossed "ACT" badge.',
    inspiration: 'Directly adapts the official Airport City winged logo into a tactile 3D flight-deck medallion with glowing cyan holographic radar rings.',
    highlights: ['3-tier sculpted golden wings', 'Recessed sapphire & cyan radar dome', 'Embossed ACT titanium bezel', 'Optimal balance at navbar sizes']
  },
  {
    id: 'opt2',
    name: 'Isometric ATC Tower & Radar Crest',
    subtitle: 'High-Tech Flight Deck Pedestal',
    badge: 'Tactile 3D',
    file: 'icons/act-logo-opt2.png',
    description: 'A heavy brushed-titanium flight-deck pedestal with glowing cyan radar sweep rings and front pilot wings badge, crowned by the golden control tower and mini skyscrapers inside a holographic dome.',
    inspiration: 'Shares design language with the 3D Map Depot console, placing the Airport City control tower on a tactical command pedestal.',
    highlights: ['Matches deck-mapdepot pedestal style', 'Miniature 3D golden skyscrapers', 'Ascending airliner with cyan orbit', 'High-contrast base for all themes']
  },
  {
    id: 'opt3',
    name: 'Winged Aviation Radar Shield',
    subtitle: 'Aviation Command & Star Pilot Crest',
    badge: 'Bold Crest',
    file: 'icons/act-logo-opt3.png',
    description: 'A heavy 3D dark brushed-titanium shield framed in polished gold with prominent Airport City golden wings, central radar screen displaying the golden tower silhouette, and a banking 3D silver jet.',
    inspiration: 'Fuses military flight-deck star pilot heraldry with the Airport City golden wings and gold-engraved AC-TRACKER banner.',
    highlights: ['Engraved AC-TRACKER gold banner', 'Dynamic banking 3D airliner', 'Circular glowing radar sweep', 'Command shield silhouette']
  },
  {
    id: 'opt4',
    name: 'Winged Hologram Globe & Control Tower',
    subtitle: 'Global Operations & Destination Mastery',
    badge: 'World Radar',
    file: 'icons/act-logo-opt4.png',
    description: 'A circular titanium instrument bezel with golden pilot wings cradling a glowing cyan 3D world globe with flight pins, topped by the golden Airport City control tower and an orbiting airliner.',
    inspiration: 'Embodies global flight tracking, integrating the Airport City control tower and skyline as a crown over the worldwide navigation sphere.',
    highlights: ['Cyan holographic world globe', 'Global destination flight pins', 'Orbiting jet with dual contrail', 'Classic winged instrument bezel']
  }
];

export const AeroQuest = () => {
  const [destinations, setDestinations] = useState<FlightDestination[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All Destinations');
  const [selectedQuickFilters, setSelectedQuickFilters] = useState<string[]>([
    'regular',
    'adventure',
    'alliance',
    'event',
  ]);
  const [filterAircraft, setFilterAircraft] = useState<string>('All');
  const [filterGroup, setFilterGroup] = useState<string>('All');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStarRank, setFilterStarRank] = useState<number | null>(null);
  const [starCountMode, setStarCountMode] = useState<'cumulative' | 'exact'>(() => {
    const saved = localStorage.getItem('aeroquest_star_count_mode');
    return saved === 'exact' ? 'exact' : 'cumulative';
  });

  const toggleStarCountMode = (mode: 'cumulative' | 'exact') => {
    setStarCountMode(mode);
    localStorage.setItem('aeroquest_star_count_mode', mode);
  };
  const [view, setView] = useState<ViewMode>('list');
  const [density, setDensity] = useState<'compact' | 'comfortable'>(() => {
    const saved = localStorage.getItem('aeroquest_density');
    return saved === 'comfortable' ? 'comfortable' : 'compact';
  });

  const toggleDensity = (newDensity: 'compact' | 'comfortable') => {
    setDensity(newDensity);
    localStorage.setItem('aeroquest_density', newDensity);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('aeroquest_sidebar_open');
    return saved !== null ? saved === 'true' : false;
  });
  const [isFlightDeckHeaderOpen, setIsFlightDeckHeaderOpen] = useState(() => {
    const saved = localStorage.getItem('aeroquest_flight_deck_header_open');
    return saved !== null ? saved === 'true' : true;
  });
  const toggleFlightDeckHeader = () => {
    setIsFlightDeckHeaderOpen(prev => {
      const next = !prev;
      localStorage.setItem('aeroquest_flight_deck_header_open', String(next));
      return next;
    });
  };
  const [theme, setTheme] = useState<ThemeId>('stealth');
  const [isLoaded, setIsLoaded] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [logoId, setLogoId] = useState<string>(() => {
    return localStorage.getItem('act_logo_choice') || 'opt1';
  });
  const handleSelectLogo = (id: string) => {
    setLogoId(id);
    localStorage.setItem('act_logo_choice', id);
  };
  const activeLogo = LOGO_OPTIONS.find(l => l.id === logoId) || LOGO_OPTIONS[0];
  const [themeTab, setThemeTab] = useState<'all' | 'factory' | 'light' | 'dark'>('all');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [showOnlyMaps, setShowOnlyMaps] = useState(false);
  const [hide3Star, setHide3Star] = useState(false);
  const [missingSearch, setMissingSearch] = useState('');
  const [showMissingAlliance, setShowMissingAlliance] = useState(true);
  const [showMissingAdventure, setShowMissingAdventure] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ field: SortField; direction: SortDirection }>({
    field: 'destination',
    direction: 'asc',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Saved Data
  useEffect(() => {
    const rawData = localStorage.getItem('aeroquest_user_data');
    const savedData: Record<string, any> = rawData ? JSON.parse(rawData) : {};
    const savedTheme = localStorage.getItem('aeroquest_theme_id') || 'stealth';
    const mappedTheme = THEME_FALLBACK_MAP[savedTheme] || (THEME_CONFIGS[savedTheme] ? (savedTheme as ThemeId) : 'stealth');
    setTheme(mappedTheme);

    const savedShowMissingAlliance = localStorage.getItem('aeroquest_show_missing_alliance');
    if (savedShowMissingAlliance !== null) setShowMissingAlliance(savedShowMissingAlliance === 'true');

    const savedShowMissingAdventure = localStorage.getItem('aeroquest_show_missing_adventure');
    if (savedShowMissingAdventure !== null) setShowMissingAdventure(savedShowMissingAdventure === 'true');

    const parsed: FlightDestination[] = RAW_MASTER_LIST.split('\n')
      .map((line, idx) => {
        const parts = line.split('|');
        if (parts.length < 8) return null;
        const [aircraft, category, group, dest, icon, s1, s2, s3, s4, s5] = parts;
        const id = `f-${idx}`;
        const needsMap = MAP_LOCATIONS.includes(dest);
        const mapDuration = needsMap ? getMapDuration(dest, category) : undefined;

        const star1Req = parseInt(s1) || 0;
        const star2Req = parseInt(s2) || 0;
        const star3Req = parseInt(s3) || 0;
        const star4Req = s4 && parseInt(s4) > 0 ? parseInt(s4) : undefined;
        const star5Req = s5 && parseInt(s5) > 0 ? parseInt(s5) : undefined;
        const maxStars = star5Req ? 5 : star4Req ? 4 : 3;

        const entry = savedData[dest] || savedData[id];
        let flightsDone = 0;
        let mapsDone = 0;
        let lastUpdated = 0;
        let isCustomList = false;

        if (typeof entry === 'number') {
          flightsDone = entry;
        } else if (entry && typeof entry === 'object') {
          flightsDone = entry.count || 0;
          mapsDone = entry.maps || 0;
          lastUpdated = entry.lastUpdated || 0;
          isCustomList = entry.isCustomList || false;
        }

        return {
          id,
          aircraft,
          category,
          group: group || 'None',
          destination: dest,
          icon: icon ? icon.replace(/^\//, '') : undefined,
          star1Req,
          star2Req,
          star3Req,
          star4Req,
          star5Req,
          maxStars,
          flightsDone,
          mapsDone,
          needsMap,
          mapDuration,
          lastUpdated,
          isCustomList,
        };
      })
      .filter(Boolean) as FlightDestination[];

    setDestinations(parsed);
    setIsLoaded(true);
  }, []);

  // Theme & Preference Persistence
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('aeroquest_theme_id', theme);
      localStorage.setItem('aeroquest_sidebar_open', String(isSidebarOpen));
      localStorage.setItem('aeroquest_show_missing_alliance', String(showMissingAlliance));
      localStorage.setItem('aeroquest_show_missing_adventure', String(showMissingAdventure));

      const html = document.documentElement;
      Object.keys(THEME_CONFIGS).forEach(id => html.classList.remove(`theme-${id}`));
      html.classList.add(`theme-${theme}`);
      if (THEME_CONFIGS[theme]?.isDark) html.classList.add('dark');
      else html.classList.remove('dark');
    }
  }, [theme, isSidebarOpen, showMissingAlliance, showMissingAdventure, isLoaded]);

  // Destination Progress Persistence
  useEffect(() => {
    if (isLoaded) {
      const storageObj: Record<string, UserDataEntry> = {};
      destinations.forEach(d => {
        if (d.flightsDone > 0 || (d.needsMap && (d.mapsDone || 0) > 0) || d.isCustomList) {
          storageObj[d.destination] = {
            count: d.flightsDone,
            lastUpdated: d.lastUpdated,
            ...(d.needsMap ? { maps: d.mapsDone } : {}),
            ...(d.isCustomList ? { isCustomList: true } : {}),
          };
        }
      });
      localStorage.setItem('aeroquest_user_data', JSON.stringify(storageObj));
    }
  }, [destinations, isLoaded]);

  // Scroll into view on expand
  useEffect(() => {
    if (expandedRowId) {
      const element = document.getElementById(expandedRowId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [expandedRowId]);

  // Keyboard shortcut '/' to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        const searchInput = document.getElementById('command-search-input') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDestinations(prev =>
      prev.map(d => (d.id === id ? { ...d, isCustomList: !d.isCustomList, lastUpdated: Date.now() } : d))
    );
  };

  // Categories
  const categories = useMemo(() => {
    const activeFilters = QUICK_FILTERS.filter(f => selectedQuickFilters.includes(f.id));
    const unique = (Array.from(new Set(destinations.map(d => d.category))) as string[]).filter(c =>
      destinations.some(d => d.category === c && activeFilters.some(f => f.match(d)))
    );
    const sorted = unique.sort((a, b) => {
      const idxA = CATEGORY_ORDER.indexOf(a);
      const idxB = CATEGORY_ORDER.indexOf(b);
      return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
    });
    return ['All Destinations', ...sorted];
  }, [destinations, selectedQuickFilters]);

  // Groups and Aircraft filters
  const allGroups = useMemo(() => {
    const filtered =
      activeCategory === 'All Destinations'
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
    const filtered =
      activeCategory === 'All Destinations'
        ? destinations
        : activeCategory === 'Bookmarks'
        ? destinations.filter(d => d.isCustomList)
        : destinations.filter(d => d.category === activeCategory);
    const unique = Array.from(new Set(filtered.map(d => d.aircraft))) as string[];
    return ['All', ...unique.sort((a, b) => (AIRCRAFT_ORDER[a] || 999) - (AIRCRAFT_ORDER[b] || 999))];
  }, [destinations, activeCategory]);

  // Stars per sub-item
  const subItemStatsByCategory = useMemo(() => {
    const stats: Record<string, Record<string, { earned: number; max: number }>> = {};
    destinations.forEach(d => {
      if (!stats[d.category]) stats[d.category] = {};
      const stars = getStars(d.flightsDone, d.star1Req, d.star2Req, d.star3Req, d.star4Req, d.star5Req);
      const destMax = getMaxStars(d);

      if (d.category === 'Event Flights') {
        d.group
          .split(/[;,]/)
          .map(g => g.trim())
          .forEach(g => {
            if (!stats[d.category][g]) stats[d.category][g] = { earned: 0, max: 0 };
            stats[d.category][g].earned += stars;
            stats[d.category][g].max += destMax;
          });
      } else {
        const sub = d.aircraft;
        if (!stats[d.category][sub]) stats[d.category][sub] = { earned: 0, max: 0 };
        stats[d.category][sub].earned += stars;
        stats[d.category][sub].max += destMax;
      }

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
        map[cat] = items.sort((a, b) => a.localeCompare(b));
      } else {
        map[cat] = items.sort((a, b) => (AIRCRAFT_ORDER[a] || 999) - (AIRCRAFT_ORDER[b] || 999));
      }
    });
    return map;
  }, [subItemStatsByCategory]);

  const categoryStarsMap = useMemo(() => {
    const map: Record<string, { earned: number; max: number }> = {};
    categories.forEach(cat => {
      const catDests = cat === 'All Destinations' ? destinations : destinations.filter(d => d.category === cat);
      const earned = catDests.reduce(
        (acc, d) => acc + getStars(d.flightsDone, d.star1Req, d.star2Req, d.star3Req, d.star4Req, d.star5Req),
        0
      );
      const max = catDests.reduce((acc, d) => acc + getMaxStars(d), 0);
      map[cat] = { earned, max };
    });
    return map;
  }, [destinations, categories]);

  const starCounts = useMemo(() => {
    let ace = 0,
      captain = 0,
      expert = 0,
      master = 0,
      specialist = 0;
    let exactAce = 0,
      exactCaptain = 0,
      exactExpert = 0,
      exactMaster = 0,
      exactSpecialist = 0;

    destinations.forEach(d => {
      const s = getStars(d.flightsDone, d.star1Req, d.star2Req, d.star3Req, d.star4Req, d.star5Req);
      // Cumulative milestones (In-Game HUD format)
      if (s >= 5) ace++;
      if (s >= 4) captain++;
      if (s >= 3) expert++;
      if (s >= 2) master++;
      if (s >= 1) specialist++;

      // Exact current star tier
      if (s === 5) exactAce++;
      else if (s === 4) exactCaptain++;
      else if (s === 3) exactExpert++;
      else if (s === 2) exactMaster++;
      else if (s === 1) exactSpecialist++;
    });
    return {
      cumulative: { ace, captain, expert, master, specialist },
      exact: {
        ace: exactAce,
        captain: exactCaptain,
        expert: exactExpert,
        master: exactMaster,
        specialist: exactSpecialist,
      },
    };
  }, [destinations]);

  const globalStars = useMemo(() => {
    return destinations.reduce(
      (acc, d) => acc + getStars(d.flightsDone, d.star1Req, d.star2Req, d.star3Req, d.star4Req, d.star5Req),
      0
    );
  }, [destinations]);

  const maxGlobalStars = useMemo(() => {
    return destinations.reduce((acc, d) => acc + getMaxStars(d), 0);
  }, [destinations]);

  const globalPercentage = useMemo(() => {
    return maxGlobalStars > 0 ? Math.round((globalStars / maxGlobalStars) * 100) : 0;
  }, [globalStars, maxGlobalStars]);

  // Maps Dashboard Statistics
  const mapCollectionStats = useMemo(() => {
    const uniqueMaps = destinations.filter(d => (d.mapsDone || 0) > 0).length;
    const totalMaps = destinations.reduce((acc, d) => acc + (d.mapsDone || 0), 0);
    const mapLocationsCount = MAP_LOCATIONS.length || 148;
    const completionRate = Math.round((uniqueMaps / mapLocationsCount) * 100);

    const topStock = [...destinations]
      .filter(d => (d.mapsDone || 0) > 0)
      .sort((a, b) => (b.mapsDone || 0) - (a.mapsDone || 0))
      .slice(0, 10);

    const airplaneStats = Object.keys(AIRCRAFT_ORDER)
      .map(ac => {
        const acDests = destinations.filter(d => d.aircraft === ac);
        const maps = acDests.filter(d => (d.mapsDone || 0) > 0).length;
        return { name: ac, maps };
      })
      .filter(s => s.maps > 0);

    const typeStats = [
      { name: 'ADVENTURE', cat: 'Adventure Map Flights' },
      { name: 'ALLIANCE', cat: 'Alliance Map Flights' },
      { name: 'SPACE', cat: 'Space Map Flights' },
      { name: 'EVENT', cat: 'Event Flights' },
    ].map(type => {
      const catDests = destinations.filter(d => {
        if (type.cat === 'Event Flights') {
          return (
            d.category === 'Event Flights' &&
            (d.destination === 'Area 51' || d.destination === 'Rovaniemi' || d.destination === 'Fatima')
          );
        }
        return d.category === type.cat;
      });
      const collected = catDests.filter(d => (d.mapsDone || 0) > 0).length;
      const total = catDests.length;
      const percentage = total > 0 ? Math.round((collected / total) * 100) : 0;
      return { ...type, collected, total, percentage };
    });

    const missingMaps = destinations
      .filter(
        d =>
          d.needsMap &&
          (d.mapsDone || 0) === 0 &&
          getStars(d.flightsDone, d.star1Req, d.star2Req, d.star3Req, d.star4Req, d.star5Req) < getMaxStars(d)
      )
      .sort((a, b) => {
        const acA = AIRCRAFT_ORDER[a.aircraft] || 999;
        const acB = AIRCRAFT_ORDER[b.aircraft] || 999;
        if (acA !== acB) return acA - acB;
        const catA = CATEGORY_ORDER.indexOf(a.category);
        const catB = CATEGORY_ORDER.indexOf(b.category);
        if (catA !== catB) return catA - catB;
        return a.destination.localeCompare(b.destination);
      });

    return { uniqueMaps, totalMaps, completionRate, topStock, airplaneStats, typeStats, missingMaps };
  }, [destinations]);

  // Filtered & Sorted Destinations
  const sortedAndFilteredDestinations = useMemo(() => {
    const activeFilters = QUICK_FILTERS.filter(f => selectedQuickFilters.includes(f.id));

    let result = destinations.filter(
      d =>
        activeFilters.some(f => f.match(d)) &&
        (activeCategory === 'All Destinations' ||
          (activeCategory === 'Bookmarks' ? d.isCustomList : d.category === activeCategory)) &&
        (filterAircraft === 'All' || d.aircraft === filterAircraft) &&
        (filterGroup === 'All' || d.group.split(/[;,]/).map(g => g.trim()).includes(filterGroup)) &&
        (!showOnlyMaps || d.needsMap) &&
        (!hide3Star || getStars(d.flightsDone, d.star1Req, d.star2Req, d.star3Req, d.star4Req, d.star5Req) < getMaxStars(d)) &&
        (filterStarRank === null ||
          (starCountMode === 'cumulative'
            ? getStars(d.flightsDone, d.star1Req, d.star2Req, d.star3Req, d.star4Req, d.star5Req) >= filterStarRank
            : getStars(d.flightsDone, d.star1Req, d.star2Req, d.star3Req, d.star4Req, d.star5Req) === filterStarRank)) &&
        (d.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.aircraft.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.group.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    result.sort((a, b) => {
      if (activeCategory === 'Event Flights' && sortConfig.field === 'destination') {
        const aGroup = a.group.split(/[;,]/)[0].trim();
        const bGroup = b.group.split(/[;,]/)[0].trim();
        if (aGroup !== bGroup) return aGroup.localeCompare(bGroup);
      }

      let valA: unknown, valB: unknown;
      switch (sortConfig.field) {
        case 'group':
          valA = a.group.split(/[;,]/).map(g => g.trim()).join(', ');
          valB = b.group.split(/[;,]/).map(g => g.trim()).join(', ');
          break;
        case 'flightsDone':
          valA = a.flightsDone;
          valB = b.flightsDone;
          break;
        case 'currentStarFlights': {
          const infoA = getCurrentStarDetails(a);
          const infoB = getCurrentStarDetails(b);
          valA = infoA.tierDone;
          valB = infoB.tierDone;
          break;
        }
        case 'aircraft':
          valA = AIRCRAFT_ORDER[a.aircraft] || 999;
          valB = AIRCRAFT_ORDER[b.aircraft] || 999;
          break;
        case 'stars':
          valA = getStars(a.flightsDone, a.star1Req, a.star2Req, a.star3Req, a.star4Req, a.star5Req);
          valB = getStars(b.flightsDone, b.star1Req, b.star2Req, b.star3Req, b.star4Req, b.star5Req);
          break;
        case 'mastery': {
          const maxA = a.star5Req || a.star4Req || a.star3Req;
          const maxB = b.star5Req || b.star4Req || b.star3Req;
          valA = a.flightsDone / maxA;
          valB = b.flightsDone / maxB;
          break;
        }
        case 'maps':
          valA = a.mapsDone || 0;
          valB = b.mapsDone || 0;
          break;
        case 'neededToNextStar': {
          const infoA = getNextStarInfo(a);
          const infoB = getNextStarInfo(b);
          const starsA = getStars(a.flightsDone, a.star1Req, a.star2Req, a.star3Req, a.star4Req, a.star5Req);
          const maxStarsA = getMaxStars(a);
          const starsB = getStars(b.flightsDone, b.star1Req, b.star2Req, b.star3Req, b.star4Req, b.star5Req);
          const maxStarsB = getMaxStars(b);
          const isMaxA = starsA >= maxStarsA || infoA.needed <= 0;
          const isMaxB = starsB >= maxStarsB || infoB.needed <= 0;
          if (isMaxA && !isMaxB) return 1;
          if (!isMaxA && isMaxB) return -1;
          if (isMaxA && isMaxB) return 0;
          valA = infoA.needed;
          valB = infoB.needed;
          break;
        }
        case 'lastUpdated':
          valA = a.lastUpdated;
          valB = b.lastUpdated;
          break;
        default:
          valA = a.destination;
          valB = b.destination;
          break;
      }

      if (typeof valA === 'string' && typeof valB === 'string') {
        const comp = sortConfig.direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        if (comp !== 0) return comp;
        return a.destination.localeCompare(b.destination);
      }
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortConfig.direction === 'asc' ? (valA < valB ? -1 : 1) : valA > valB ? -1 : 1;
      }
      return 0;
    });

    return result;
  }, [
    activeCategory,
    filterAircraft,
    filterGroup,
    searchQuery,
    destinations,
    sortConfig,
    showOnlyMaps,
    hide3Star,
    filterStarRank,
    starCountMode,
    selectedQuickFilters,
  ]);

  // Handlers
  const handleStarRankClick = (star: number) => {
    setFilterStarRank(prev => (prev === star ? null : star));
    if (view === 'stats' || view === 'airplanes' || view === 'maps' || view === 'about') {
      setView('list');
    }
  };

  const handleCategoryClick = (cat: string) => {
    if (view === 'stats' || view === 'airplanes' || view === 'maps' || view === 'about') {
      setView('list');
    }
    setActiveCategory(cat);
    setFilterAircraft('All');
    setFilterGroup('All');
    setExpandedCategory(prev => (prev === cat ? null : cat));
  };

  const handleSubItemClick = (cat: string, item: string) => {
    if (view === 'stats' || view === 'airplanes' || view === 'maps' || view === 'about') {
      setView('list');
    }
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
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Export JSON
  const exportToJSON = () => {
    const storageObj: Record<string, any> = {};
    destinations.forEach(d => {
      if (d.flightsDone > 0 || (d.needsMap && (d.mapsDone || 0) > 0) || d.isCustomList) {
        storageObj[d.destination] = {
          count: d.flightsDone,
          lastUpdated: d.lastUpdated,
          ...(d.needsMap ? { maps: d.mapsDone } : {}),
          ...(d.isCustomList ? { isCustomList: true } : {}),
        };
      }
    });

    const savedAirplanes = localStorage.getItem('aeroquest_owned_airplanes_v2');
    if (savedAirplanes) {
      try {
        const parsed = JSON.parse(savedAirplanes);
        const adjusted = adjustAircraftList(parsed);
        storageObj['airplanes'] = adjusted;
      } catch (e) {}
    }

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(storageObj, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute(
      'download',
      `star_tracker_backup_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Import JSON
  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const json = JSON.parse(e.target?.result as string) as Record<string, any>;
        const sanitizedJson: Record<string, UserDataEntry> = {};
        Object.entries(json).forEach(([id, val]) => {
          if (id === 'airplanes') {
            const adjusted = adjustAircraftList(Array.isArray(val) ? val : []);
            localStorage.setItem('aeroquest_owned_airplanes_v2', JSON.stringify(adjusted));
          } else if (typeof val === 'number') {
            sanitizedJson[id] = { count: val, lastUpdated: 0 };
          } else if (typeof val === 'object' && val !== null) {
            sanitizedJson[id] = val as UserDataEntry;
          }
        });
        setDestinations(prev =>
          prev.map(d => {
            const entry = sanitizedJson[d.destination] || sanitizedJson[d.id];
            return entry
              ? {
                  ...d,
                  flightsDone: entry.count || 0,
                  mapsDone: entry.maps || 0,
                  lastUpdated: entry.lastUpdated || 0,
                  isCustomList: entry.isCustomList || false,
                }
              : d;
          })
        );
        setShowBackupModal(false);
        alert('Flight data imported successfully!');
      } catch (err) {
        alert('Error parsing JSON backup file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Reset Data
  const resetAllData = () => {
    if (!showResetConfirm) {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 4000);
      return;
    }
    setDestinations(prev =>
      prev.map(d => ({ ...d, flightsDone: 0, mapsDone: 0, lastUpdated: 0, isCustomList: false }))
    );
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
    <div className={`theme-${theme} min-h-screen bg-[var(--bg-base)] text-[var(--text-main)] flex flex-col font-ui selection:bg-[var(--accent)] selection:text-white transition-colors duration-300`}>
      {/* Top Operations Command Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-[var(--border-subtle)] shadow-lg backdrop-blur-xl">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center h-14 sm:h-16 gap-4">
            {/* Brand Logo & Brand Crest */}
            <div className="flex items-center justify-start min-w-0 gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowLogoModal(true)}
                title="Click to customize AC-Tracker logo (4 options available)"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-all shrink-0 relative group p-0.5 focus:outline-none cursor-pointer"
              >
                <img
                  src={activeLogo.file}
                  alt={activeLogo.name}
                  className="w-full h-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-300"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[9px] font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                  ✦
                </span>
              </button>

              <div
                onClick={() => {
                  setView('list');
                  setActiveCategory('All Destinations');
                  setFilterAircraft('All');
                  setFilterGroup('All');
                  setSearchQuery('');
                }}
                className="flex flex-col justify-center cursor-pointer group select-none"
                title="Reset filters and view all flights"
              >
                <span className="font-heading font-bold text-base sm:text-lg tracking-tight text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors leading-none">
                  AC-TRACKER
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[11px] font-medium text-[var(--text-muted)] leading-none">
                    by Soupha
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-medium theme-badge leading-none">
                    {APP_VERSION}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-[var(--text-muted)] opacity-75 mt-0.5 leading-none">
                  Updated: {APP_UPDATED_DATE}
                </span>
              </div>
            </div>

            {/* Left of Header Links: Star Count with Yellow Star Icon (Informational Only, Doubled Size) */}
            <div className="hidden md:flex items-center justify-center gap-3 shrink-0">
              <div
                className="px-4 py-2 rounded-2xl bg-black/35 border border-amber-500/35 shadow-inner flex items-center gap-2.5 select-none"
                title="Total Stars Earned"
              >
                <Star className="w-6 h-6 text-amber-400 fill-amber-400 drop-shadow-md" />
                <span className="font-heading font-bold text-xl text-amber-300 tracking-tight leading-none">
                  {globalStars.toLocaleString()}
                </span>
              </div>

              {/* View Switcher Tabs (Header Link Row - Static & Centered) */}
              <nav className="flex items-center gap-1.5 bg-black/25 p-1 rounded-2xl border border-white/5">
                <button
                  onClick={() => setView('list')}
                  className={`tactile-btn px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all ${
                    view === 'list' || view === 'grid'
                      ? 'theme-btn-accent font-semibold shadow-md'
                      : 'text-[var(--text-muted)] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Compass className="w-4 h-4" /> Flights
                </button>

                <button
                  onClick={() => setView('maps')}
                  className={`tactile-btn px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all ${
                    view === 'maps'
                      ? 'theme-btn-accent font-semibold shadow-md'
                      : 'text-[var(--text-muted)] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <MapIcon className="w-4 h-4" /> Maps
                </button>

                <button
                  onClick={() => setView('airplanes')}
                  className={`tactile-btn px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all ${
                    view === 'airplanes'
                      ? 'theme-btn-accent font-semibold shadow-md'
                      : 'text-[var(--text-muted)] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Layers className="w-4 h-4" /> Aircraft
                </button>

                <button
                  onClick={() => setView('stats')}
                  className={`tactile-btn px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all ${
                    view === 'stats'
                      ? 'theme-btn-accent font-semibold shadow-md'
                      : 'text-[var(--text-muted)] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" /> Stats
                </button>

                <button
                  onClick={() => setView('about')}
                  className={`tactile-btn px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all ${
                    view === 'about'
                      ? 'theme-btn-accent font-semibold shadow-md'
                      : 'text-[var(--text-muted)] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Info className="w-4 h-4" /> About ACT
                </button>
              </nav>
            </div>

            {/* Global Utility Actions (Always Static on Every Page) */}
            <div className="flex items-center justify-end gap-2 min-w-0">
              {/* Theme Picker Button */}
              <button
                onClick={() => setShowThemeModal(true)}
                title="Change Cockpit Theme"
                className="tactile-btn p-2 sm:p-2.5 rounded-xl glass-panel border border-[var(--border-subtle)] hover:border-[var(--border-active)] text-[var(--text-main)] transition-all flex items-center gap-1.5"
              >
                <Palette className="w-4 h-4 theme-accent-text" />
                <span className="text-xs font-medium hidden xl:inline">
                  {THEME_CONFIGS[theme]?.name}
                </span>
              </button>

              {/* Backup & Tools Modal Button */}
              <button
                onClick={() => setShowBackupModal(true)}
                title="Data Backup & JSON Tools"
                className="tactile-btn p-2 sm:p-2.5 rounded-xl glass-panel border border-[var(--border-subtle)] hover:border-[var(--border-active)] text-[var(--text-main)] transition-all flex items-center gap-1.5"
              >
                <Download className="w-4 h-4 theme-accent-text" />
                <span className="text-xs font-medium hidden lg:inline">Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile View Switcher Bar */}
        <div className="md:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-white/5 gap-1.5 no-scrollbar bg-black/20">
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-1.5 ${
              view === 'list' || view === 'grid'
                ? 'theme-btn-accent font-semibold shadow-sm'
                : 'text-[var(--text-muted)] hover:bg-white/5'
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> Flights
          </button>
          <div
            className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold whitespace-nowrap flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 select-none"
            title="Total Stars"
          >
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            {globalStars.toLocaleString()}
          </div>
          <button
            onClick={() => setView('maps')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-1.5 ${
              view === 'maps' ? 'theme-btn-accent font-semibold shadow-sm' : 'text-[var(--text-muted)] hover:bg-white/5'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" /> Maps
          </button>
          <button
            onClick={() => setView('airplanes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-1.5 ${
              view === 'airplanes' ? 'theme-btn-accent font-semibold shadow-sm' : 'text-[var(--text-muted)] hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Aircraft
          </button>
          <button
            onClick={() => setView('stats')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-1.5 ${
              view === 'stats' ? 'theme-btn-accent font-semibold shadow-sm' : 'text-[var(--text-muted)] hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Stats
          </button>
          <button
            onClick={() => setView('about')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-1.5 ${
              view === 'about' ? 'theme-btn-accent font-semibold shadow-sm' : 'text-[var(--text-muted)] hover:bg-white/5'
            }`}
          >
            <Info className="w-3.5 h-3.5" /> About ACT
          </button>
        </div>
      </header>



      {/* Main Body with Optional Category Drawer */}
      <div className="flex-1 max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex gap-5">
        {/* Collapsible Category Drawer */}
        {isSidebarOpen && (view === 'list' || view === 'grid') && (
          <aside className="w-72 shrink-0 space-y-4 animate-in slide-in-from-left duration-200">
            <div className="glass-panel rounded-3xl p-4 border border-[var(--border-card)]">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Flight Categories
                </span>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 text-[var(--text-muted)] hover:text-white rounded-lg hover:bg-white/10"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1 max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar pr-1">
                {categories.map(cat => {
                  const isActive = activeCategory === cat;
                  const isExpanded = expandedCategory === cat;
                  const stats = categoryStarsMap[cat];
                  const icon = CATEGORY_ICONS[cat];

                  return (
                    <div key={cat} className="rounded-xl overflow-hidden">
                      <button
                        onClick={() => handleCategoryClick(cat)}
                        className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between ${
                          isActive
                            ? 'theme-btn-accent font-semibold shadow-md'
                            : 'hover:bg-white/5 text-[var(--text-main)]'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {icon ? (
                            <img src={icon} alt={cat} className="w-5 h-5 object-contain shrink-0" />
                          ) : (
                            <Navigation className="w-5 h-5 theme-accent-text shrink-0" />
                          )}
                          <span className="truncate">{cat}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {stats && (
                            <span className="text-[10px] font-mono opacity-80">
                              {stats.earned}/{stats.max}★
                            </span>
                          )}
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                          )}
                        </div>
                      </button>

                      {/* Sub-item Filter List */}
                      {isExpanded && (
                        <div className="pl-6 pr-2 py-1 space-y-0.5 bg-black/20 rounded-b-xl">
                          {(categorySubItemsMap[cat] || []).map(item => {
                            const subStat = subItemStatsByCategory[cat]?.[item];
                            const isSubActive =
                              cat === 'Event Flights' ? filterGroup === item : filterAircraft === item;
                            return (
                              <button
                                key={item}
                                onClick={() => handleSubItemClick(cat, item)}
                                className={`w-full text-left px-2 py-1.5 rounded-lg text-[11px] font-normal transition-all flex items-center justify-between ${
                                  isSubActive
                                    ? 'theme-btn-soft font-medium'
                                    : 'text-[var(--text-muted)] hover:text-white hover:bg-white/5'
                                }`}
                              >
                                <span className="truncate">{item}</span>
                                {subStat && (
                                  <span className="text-[9px] font-mono opacity-70">
                                    {subStat.earned}/{subStat.max}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Bookmarks Row in Drawer */}
                <button
                  onClick={() => handleCategoryClick('Bookmarks')}
                  className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between mt-2 border-t border-white/10 ${
                    activeCategory === 'Bookmarks'
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                      : 'hover:bg-white/5 text-[var(--text-main)]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>Bookmarks Playlist</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/30">
                    {destinations.filter(d => d.isCustomList).length}
                  </span>
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* VIEW: FLEET HANGAR */}
          {view === 'airplanes' && <AirplanesPage />}

          {/* VIEW: ABOUT ACT */}
          {view === 'about' && (
            <AboutPage
              onNavigate={(v) => setView(v)}
              onOpenLogoModal={() => setShowLogoModal(true)}
              activeLogoId={logoId}
              onSelectLogo={handleSelectLogo}
            />
          )}

          {/* VIEW: MAP DEPOT */}
          {view === 'maps' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Map Depot Vector HUD Header */}
              <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-[var(--border-card)] shadow-xl">
                <div
                  className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
                  style={{ backgroundColor: 'var(--accent)' }}
                />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-5 sm:gap-6">
                    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl theme-badge flex items-center justify-center shadow-2xl shrink-0 p-1 sm:p-1.5 border border-white/10 group">
                      <img src="icons/deck-mapdepot-3d.png" alt="Map Inventory" className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-main)] font-heading">
                        Map Inventory
                      </h1>
                      <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 font-normal max-w-2xl leading-relaxed">
                        Keep track of all the maps in your game. The game has very nice rewards for players who use their maps strategically to complete collections. This page lets you see at a glance which ones you're missing to achieve your goals.
                      </p>
                    </div>
                  </div>

                  <div className="bg-black/20 p-3 px-5 rounded-2xl border border-white/5 text-center shrink-0">
                    <div className="text-[10px] font-medium uppercase theme-accent-text tracking-wider">
                      Collected Maps
                    </div>
                    <div className="text-2xl font-heading font-semibold theme-accent-text mt-0.5">
                      {mapCollectionStats.uniqueMaps}
                      <span className="text-xs text-[var(--text-muted)] font-mono"> / 148</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Collections Progress */}
              <div className="glass-panel rounded-3xl p-6 border border-[var(--border-card)] space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                  <Compass className="w-4 h-4 theme-accent-text" /> Map Progress by Collection
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {mapCollectionStats.typeStats.map((col, idx) => (
                    <div key={col.name} className="bg-black/20 p-4 rounded-2xl border border-white/5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-heading font-medium tracking-wide text-[var(--text-main)]">
                          {col.name}
                        </span>
                        <span className="font-mono font-medium theme-accent-text">
                          {col.percentage}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            idx === 0
                              ? 'bg-emerald-500'
                              : idx === 1
                              ? 'bg-indigo-500'
                              : idx === 2
                              ? 'theme-progress-fill'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${col.percentage}%` }}
                        />
                      </div>
                      <div className="text-[11px] font-mono text-[var(--text-muted)] flex justify-between">
                        <span>Unlocked:</span>
                        <span className="text-[var(--text-main)] font-medium">
                          {col.collected} / {col.total}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map Stock by Aircraft Class Chart */}
              <div className="glass-panel rounded-3xl p-6 border border-[var(--border-card)] space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                  <Plane className="w-4 h-4 theme-accent-text" /> Maps In Stock by Aircraft Class
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mapCollectionStats.airplaneStats} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 500 }}
                        angle={-30}
                        textAnchor="end"
                        height={40}
                      />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                      <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                        contentStyle={{
                          backgroundColor: 'var(--bg-surface)',
                          borderColor: 'var(--border-card)',
                          borderRadius: '16px',
                          color: 'var(--text-main)',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}
                      />
                      <Bar dataKey="maps" fill="var(--accent)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Stocked Maps Leaderboard */}
              <div className="glass-panel rounded-3xl p-6 border border-[var(--border-card)] space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" /> Most Stocked Flight Maps
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {mapCollectionStats.topStock.map((dest, idx) => (
                    <div
                      key={dest.id}
                      onClick={() => {
                        setView('list');
                        setSearchQuery(dest.destination);
                      }}
                      className="bg-black/20 hover:bg-white/5 p-3.5 rounded-2xl border border-white/5 cursor-pointer transition-all flex items-center gap-3 group"
                    >
                      <div className="w-7 h-7 rounded-xl theme-badge flex items-center justify-center font-mono font-medium text-xs shrink-0">
                        #{idx + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-[var(--text-main)] truncate group-hover:text-[var(--accent)] transition-colors">
                          {dest.destination}
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)] font-mono flex items-center gap-1.5">
                          <span>{dest.mapsDone} maps</span>
                          {dest.mapDuration && (
                            <>
                              <span>•</span>
                              <span className="theme-accent-text flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{dest.mapDuration}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Maps Radar Checklist */}
              <div className="glass-panel rounded-3xl p-6 border border-[var(--border-card)] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/10">
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-main)] font-heading flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400" /> Missing Maps Radar
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      Routes requiring maps where you currently have 0 inventory and incomplete stars.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-xs font-normal text-[var(--text-muted)] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showMissingAlliance}
                        onChange={e => setShowMissingAlliance(e.target.checked)}
                        style={{ accentColor: 'var(--accent)' }}
                        className="rounded"
                      />
                      <span>Alliance</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-normal text-[var(--text-muted)] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showMissingAdventure}
                        onChange={e => setShowMissingAdventure(e.target.checked)}
                        style={{ accentColor: 'var(--accent)' }}
                        className="rounded"
                      />
                      <span>Adventure</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto custom-scrollbar pr-1">
                  {mapCollectionStats.missingMaps
                    .filter(d => {
                      if (!showMissingAlliance && d.category.includes('Alliance')) return false;
                      if (!showMissingAdventure && d.category.includes('Adventure')) return false;
                      return true;
                    })
                    .map(dest => (
                      <div
                        key={dest.id}
                        className="bg-black/20 p-3 rounded-2xl border border-white/5 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-medium text-[var(--text-main)] truncate">
                            {dest.destination}
                          </div>
                          <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-2">
                            <span>{dest.aircraft}</span>
                            <span>•</span>
                            <span className="truncate">{dest.group}</span>
                            {dest.mapDuration && (
                              <>
                                <span>•</span>
                                <span className="theme-accent-text font-mono flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{dest.mapDuration}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 shrink-0">
                          <button
                            onClick={() => updateMapCount(dest.id, (dest.mapsDone || 0) - 1)}
                            disabled={(dest.mapsDone || 0) <= 0}
                            title="Subtract 1 Map"
                            className="tactile-btn w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-[var(--text-muted)] hover:text-white flex items-center justify-center disabled:opacity-20 text-xs font-mono font-bold"
                          >
                            -
                          </button>
                          <EditableNumberInput
                            value={dest.mapsDone || 0}
                            onChange={val => updateMapCount(dest.id, val)}
                            ariaLabel={`Maps for ${dest.destination}`}
                            title="Click to type map count"
                            className="w-12 h-7 text-center font-mono font-bold text-sm bg-black/50 border border-white/10 rounded-lg theme-accent-text shadow-inner"
                          />
                          <button
                            onClick={() => updateMapCount(dest.id, (dest.mapsDone || 0) + 1)}
                            title="Add 1 Map"
                            className="tactile-btn w-7 h-7 rounded-lg theme-btn-soft text-xs font-mono font-bold flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: PILOT ANALYTICS & STATS */}
          {view === 'stats' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Analytics Header */}
              <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-[var(--border-card)] shadow-xl">
                <div
                  className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
                  style={{ backgroundColor: 'var(--accent)' }}
                />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-5 sm:gap-6">
                    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl theme-badge flex items-center justify-center shadow-2xl shrink-0 p-1 sm:p-1.5 border border-white/10 group">
                      <img src="icons/deck-stars-3d.png" alt="Statistics" className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-main)] font-heading">
                        Statistics
                      </h1>
                      <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 font-normal">
                        Track total flight progression, star milestones, and mastery across all categories
                      </p>
                    </div>
                  </div>

                  <div className="bg-black/20 p-4 rounded-2xl border border-white/5 text-center shrink-0 flex flex-col justify-center">
                    <div className="text-3xl font-heading font-semibold text-amber-300">
                      {globalStars.toLocaleString()}
                      <span className="text-sm font-mono text-[var(--text-muted)]"> / {maxGlobalStars.toLocaleString()}</span>
                    </div>
                    <div className="text-xs font-mono font-medium text-amber-400 mt-1">
                      {globalPercentage}% Global Mastery
                    </div>
                  </div>
                </div>
              </div>

              {/* Flight Mastery / Star Ranks Panel (Game HUD Replica) */}
              <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-[var(--border-card)] shadow-xl relative overflow-hidden space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    <img src="icons/star-icon.png" alt="Star Ranks" className="w-5 h-5 object-contain drop-shadow" />
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--text-main)] font-heading">
                        Flight Mastery Ranks
                      </h3>
                      <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                        {starCountMode === 'cumulative'
                          ? 'Cumulative destinations reaching each milestone tier (In-Game HUD format)'
                          : 'Destinations currently at each exact star level'}
                      </p>
                    </div>
                  </div>

                  {/* Mode Toggle: In-Game Milestones vs Exact Tier */}
                  <div className="flex items-center bg-black/40 p-0.5 rounded-xl border border-white/10 text-xs font-mono shrink-0">
                    <button
                      onClick={() => toggleStarCountMode('cumulative')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        starCountMode === 'cumulative'
                          ? 'theme-btn-accent font-semibold shadow-sm text-white'
                          : 'text-[var(--text-muted)] hover:text-white'
                      }`}
                      title="Cumulative milestones (matches the in-game Flight Mastery popup)"
                    >
                      In-Game Milestones
                    </button>
                    <button
                      onClick={() => toggleStarCountMode('exact')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        starCountMode === 'exact'
                          ? 'theme-btn-accent font-semibold shadow-sm text-white'
                          : 'text-[var(--text-muted)] hover:text-white'
                      }`}
                      title="Exact current star tier breakdown"
                    >
                      Exact Tier
                    </button>
                  </div>
                </div>

                {/* The 5 Stacked Mastery Rows (Ace 5★ down to Specialist 1★) */}
                <div className="space-y-1.5 sm:space-y-2">
                  {GAME_STAR_RANKS.map(rank => {
                    const count =
                      starCountMode === 'cumulative'
                        ? starCounts.cumulative[rank.key]
                        : starCounts.exact[rank.key];
                    const isFiltered = filterStarRank === rank.star;

                    return (
                      <div
                        key={rank.star}
                        onClick={() => handleStarRankClick(rank.star)}
                        className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-2xl flex items-center justify-between transition-all duration-150 cursor-pointer group select-none border ${
                          isFiltered
                            ? 'bg-amber-500/15 border-amber-500/40 shadow-sm'
                            : 'hover:bg-white/5 border-transparent'
                        }`}
                        title={`Click to view ${starCountMode === 'cumulative' ? `≥ ${rank.star}★` : `${rank.star}★`} ${rank.name} routes in Flights table`}
                      >
                        {/* Stars (left-aligned, 3D golden game stars) */}
                        <div className="flex items-center gap-1 shrink-0">
                          {Array.from({ length: rank.star }).map((_, i) => (
                            <img
                              key={i}
                              src="icons/star-icon.png"
                              alt="★"
                              className="w-5 h-5 sm:w-6 sm:h-6 object-contain drop-shadow select-none pointer-events-none group-hover:scale-105 transition-transform"
                            />
                          ))}
                        </div>

                        {/* Rank Name (cascading staircase right after the stars) */}
                        <span className="font-heading font-medium sm:font-semibold text-base sm:text-lg text-[var(--text-main)] ml-2.5 sm:ml-4 shrink-0 tracking-tight">
                          {rank.name}
                        </span>

                        {/* Hatched Runway-Style Leader Line (Game HUD replica) */}
                        <div
                          className="flex-1 min-w-[20px] mx-3 sm:mx-4 h-2 rounded-sm opacity-30 group-hover:opacity-65 transition-opacity"
                          style={{
                            background:
                              'repeating-linear-gradient(65deg, currentColor 0px, currentColor 6px, transparent 6px, transparent 10px)',
                          }}
                        />

                        {/* Count (right-aligned, tabular numbers) */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-heading font-semibold text-lg sm:text-xl text-[var(--text-main)] tabular-nums group-hover:text-amber-300 transition-colors">
                            {count.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category Breakdown Table */}
              <div className="glass-panel rounded-3xl p-6 border border-[var(--border-card)] space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 theme-accent-text" /> Progress by Category
                </h3>
                <div className="divide-y divide-white/5">
                  {categories.map(cat => {
                    const stats = categoryStarsMap[cat];
                    if (!stats || stats.max === 0) return null;
                    const pct = Math.round((stats.earned / stats.max) * 100);
                    return (
                      <div
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className="py-3.5 flex items-center justify-between gap-4 hover:bg-white/5 px-3 rounded-xl transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {CATEGORY_ICONS[cat] ? (
                            <img src={CATEGORY_ICONS[cat]} alt={cat} className="w-10 h-10 sm:w-11 sm:h-11 object-contain shrink-0 drop-shadow" />
                          ) : (
                            <Navigation className="w-8 h-8 theme-accent-text shrink-0" />
                          )}
                          <div className="min-w-0">
                            <div className="text-sm sm:text-base font-semibold text-[var(--text-main)] truncate group-hover:text-[var(--accent)] transition-colors">
                              {cat}
                            </div>
                            <div className="text-xs sm:text-sm font-mono text-[var(--text-muted)] mt-0.5 flex items-center gap-1.5">
                              <span className="font-bold text-amber-300 text-sm sm:text-base">{stats.earned.toLocaleString()}</span>
                              <span className="opacity-40 font-normal">/</span>
                              <span className="font-semibold text-[var(--text-main)] text-sm sm:text-base">{stats.max.toLocaleString()}</span>
                              <span className="text-xs text-[var(--text-muted)] font-sans ml-0.5">Stars Earned</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <div className="w-28 sm:w-44 h-2.5 bg-black/40 rounded-full overflow-hidden hidden sm:block">
                            <div
                              className="h-full theme-progress-fill rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-sm font-mono font-bold theme-accent-text w-14 text-right">
                            {pct}%
                          </span>
                          <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: FLIGHT DECK (LIST OR GRID) */}
          {(view === 'list' || view === 'grid') && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Flight Deck HUD Header Banner */}
              {isFlightDeckHeaderOpen ? (
                <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-[var(--border-card)] shadow-xl">
                  <div
                    className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
                    style={{ backgroundColor: 'var(--accent)' }}
                  />
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-5 sm:gap-6">
                      <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl theme-badge flex items-center justify-center shadow-2xl shrink-0 p-1 sm:p-1.5 border border-white/10 group">
                        <img src="icons/deck-radar-3d.png" alt="Flights" className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-main)] font-heading">
                          Flights
                        </h1>
                        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 font-normal">
                          Update the flight counts from your game to keep track of your progress. Sort by columns and use the category filters to plan your game strategy
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-auto">
                      <div className="grid grid-cols-2 gap-3 bg-black/20 p-3 rounded-2xl border border-white/5 shrink-0">
                        <div className="text-center px-4 py-1">
                          <div className="text-[10px] font-medium uppercase theme-accent-text tracking-wider">
                            Active Routes
                          </div>
                          <div className="text-2xl font-heading font-semibold theme-accent-text mt-0.5">
                            {sortedAndFilteredDestinations.length}
                            <span className="text-xs text-[var(--text-muted)] font-mono"> / {destinations.length}</span>
                          </div>
                        </div>
                        <div className="text-center px-4 py-1 border-l border-white/10">
                          <div className="text-[10px] font-medium uppercase text-amber-400 tracking-wider">
                            Total Flights
                          </div>
                          <div className="text-2xl font-heading font-semibold text-amber-300 mt-0.5">
                            {destinations.reduce((acc, d) => acc + (d.flightsDone || 0), 0).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={toggleFlightDeckHeader}
                        title="Collapse Flights Header"
                        className="p-2 rounded-xl text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-all border border-white/5"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between px-4 py-2 glass-panel rounded-2xl border border-[var(--border-card)]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl theme-badge flex items-center justify-center p-0.5 shrink-0 shadow-inner border border-white/10">
                      <img src="icons/deck-radar-3d.png" alt="Flights" className="w-full h-full object-contain drop-shadow-md" />
                    </div>
                    <span className="font-heading font-semibold text-sm text-[var(--text-main)]">Flights</span>
                    <span className="text-xs text-[var(--text-muted)] font-mono">({sortedAndFilteredDestinations.length} routes)</span>
                  </div>
                  <button
                    onClick={toggleFlightDeckHeader}
                    className="tactile-btn text-xs text-[var(--text-muted)] hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/20 hover:bg-white/10 border border-white/5 transition-all"
                  >
                    <span>Expand Header</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Category Quick Filter Pills Strip (Responsive Wrapped Layout - No Scrolling Required) */}
              <div className="glass-panel rounded-2xl p-2 sm:p-2.5 border border-[var(--border-card)] flex flex-wrap items-center gap-1.5">
                {categories.map(cat => {
                  const isActive = activeCategory === cat;
                  const stats = categoryStarsMap[cat];
                  return (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className={`tactile-btn px-2.5 py-1 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'theme-btn-accent font-semibold shadow-md'
                          : 'bg-black/20 hover:bg-white/10 text-[var(--text-muted)] hover:text-white border border-white/5'
                      }`}
                    >
                      <span>{cat}</span>
                      {stats && (
                        <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[9px] font-mono opacity-90">
                          {stats.earned}/{stats.max}★
                        </span>
                      )}
                    </button>
                  );
                })}

                <button
                  onClick={() => handleCategoryClick('Bookmarks')}
                  className={`tactile-btn px-2.5 py-1 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                    activeCategory === 'Bookmarks'
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                      : 'bg-black/20 hover:bg-white/10 text-amber-300 border border-amber-500/20'
                  }`}
                >
                  <Bookmark className="w-3 h-3 fill-amber-400" />
                  <span>Bookmarks ({destinations.filter(d => d.isCustomList).length})</span>
                </button>
              </div>

              {/* Filter & Command Controller Bar */}
              <div className="glass-panel rounded-2xl p-2.5 sm:p-3 border border-[var(--border-card)] space-y-2">
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
                  {/* Search Bar with Shortcut hint */}
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                      id="command-search-input"
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search route destination, aircraft model, or mission set (Press /)..."
                      className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-black/30 border border-white/10 text-xs text-[var(--text-main)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--border-active)] font-normal transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Aircraft Dropdown */}
                  <div className="flex items-center gap-1.5 shrink-0 flex-wrap sm:flex-nowrap">
                    <select
                      value={filterAircraft}
                      onChange={e => setFilterAircraft(e.target.value)}
                      className="bg-black/30 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-normal text-[var(--text-main)] focus:outline-none focus:border-[var(--border-active)] transition-all cursor-pointer"
                    >
                      <option value="All">All Aircraft ({allAircraft.length - 1})</option>
                      {allAircraft.filter(ac => ac !== 'All').map(ac => (
                        <option key={ac} value={ac}>{ac}</option>
                      ))}
                    </select>

                    {/* Mission / Group Dropdown */}
                    <select
                      value={filterGroup}
                      onChange={e => setFilterGroup(e.target.value)}
                      className="bg-black/30 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-normal text-[var(--text-main)] focus:outline-none focus:border-[var(--border-active)] transition-all cursor-pointer max-w-[140px] truncate"
                    >
                      <option value="All">All Missions</option>
                      {allGroups.filter(g => g !== 'All').map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>

                    {/* Sort Controller */}
                    <div className="flex items-center bg-black/30 rounded-xl border border-white/10 overflow-hidden">
                      <select
                        value={sortConfig.field}
                        onChange={e => handleSort(e.target.value as SortField)}
                        className="bg-transparent px-2.5 py-1.5 text-xs font-normal text-[var(--text-main)] focus:outline-none cursor-pointer"
                      >
                        <option value="destination">Sort: Destination</option>
                        <option value="group">Sort: Collection</option>
                        <option value="aircraft">Sort: Aircraft</option>
                        <option value="neededToNextStar">Sort: Closest Star</option>
                        <option value="currentStarFlights">Sort: Star Flights</option>
                        <option value="flightsDone">Sort: Total Flights</option>
                        <option value="stars">Sort: Star Rank</option>
                        <option value="mastery">Sort: Mastery %</option>
                        <option value="maps">Sort: Maps Stocked</option>
                        <option value="lastUpdated">Sort: Last Updated</option>
                      </select>
                      <button
                        onClick={() => setSortConfig(prev => ({ ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' }))}
                        title={`Sort ${sortConfig.direction === 'asc' ? 'Descending' : 'Ascending'}`}
                        className="p-1.5 border-l border-white/10 hover:bg-white/10 theme-accent-text transition-all"
                      >
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Density Switcher (in toolbar) */}
                    {view === 'list' && (
                      <div className="flex items-center bg-black/30 rounded-xl p-0.5 border border-white/10 shrink-0">
                        <button
                          onClick={() => toggleDensity('compact')}
                          className={`px-2 py-1 rounded-lg text-xs font-mono transition-all ${
                            density === 'compact' ? 'theme-btn-soft font-semibold shadow-sm' : 'text-[var(--text-muted)] hover:text-white'
                          }`}
                          title="High-Density Table (25+ routes per screen)"
                        >
                          Dense
                        </button>
                        <button
                          onClick={() => toggleDensity('comfortable')}
                          className={`px-2 py-1 rounded-lg text-xs font-mono transition-all ${
                            density === 'comfortable' ? 'theme-btn-soft font-semibold shadow-sm' : 'text-[var(--text-muted)] hover:text-white'
                          }`}
                          title="Comfortable Cards"
                        >
                          Cards
                        </button>
                      </div>
                    )}

                    {/* Tactical List vs Grid Switcher */}
                    <div className="flex items-center bg-black/30 rounded-xl p-0.5 border border-white/10 shrink-0">
                      <button
                        onClick={() => setView('list')}
                        title="Tactical List View"
                        className={`p-1.5 rounded-lg transition-all ${
                          view === 'list' ? 'theme-btn-soft shadow-sm' : 'text-[var(--text-muted)] hover:text-white'
                        }`}
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setView('grid')}
                        title="Radar Grid View"
                        className={`p-1.5 rounded-lg transition-all ${
                          view === 'grid' ? 'theme-btn-soft shadow-sm' : 'text-[var(--text-muted)] hover:text-white'
                        }`}
                      >
                        <Grid className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Sidebar Drawer Toggle */}
                    <button
                      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                      title={isSidebarOpen ? 'Hide Category Drawer' : 'Show Category Drawer'}
                      className={`tactile-btn p-1.5 rounded-xl border border-white/10 transition-all ${
                        isSidebarOpen
                          ? 'theme-btn-soft'
                          : 'bg-black/30 text-[var(--text-muted)] hover:text-white'
                      }`}
                    >
                      <PanelLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Quick Toggle Filter Chips */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-white/5 text-xs">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={showOnlyMaps}
                        onChange={e => setShowOnlyMaps(e.target.checked)}
                        style={{ accentColor: 'var(--accent)' }}
                        className="rounded"
                      />
                      <span className={`text-xs font-normal transition-colors ${showOnlyMaps ? 'theme-accent-text font-medium' : 'text-[var(--text-muted)]'}`}>
                        🗺️ Show only Map Destinations
                      </span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={hide3Star}
                        onChange={e => setHide3Star(e.target.checked)}
                        style={{ accentColor: 'var(--accent)' }}
                        className="rounded"
                      />
                      <span className={`text-xs font-normal transition-colors ${hide3Star ? 'text-amber-300 font-medium' : 'text-[var(--text-muted)]'}`}>
                        ⭐ Hide completed destinations
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-[var(--text-muted)] flex-wrap">
                    <span>
                      Showing <span className="font-semibold text-[var(--text-main)]">{sortedAndFilteredDestinations.length}</span> / {destinations.length} routes
                    </span>
                    {filterStarRank !== null && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs">
                        <img src="icons/star-icon.png" alt="" className="w-3.5 h-3.5 object-contain" />
                        <span>
                          {starCountMode === 'cumulative' ? `≥ ${filterStarRank}★` : `${filterStarRank}★`}{' '}
                          {STAR_RANKS.find(r => r.star === filterStarRank)?.name}
                        </span>
                        <button
                          onClick={() => setFilterStarRank(null)}
                          className="hover:text-white p-0.5"
                          title="Clear star filter"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {(searchQuery || filterAircraft !== 'All' || filterGroup !== 'All' || showOnlyMaps || hide3Star || filterStarRank !== null) && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setFilterAircraft('All');
                          setFilterGroup('All');
                          setShowOnlyMaps(false);
                          setHide3Star(false);
                          setFilterStarRank(null);
                        }}
                        className="text-cyan-400 hover:underline font-medium text-xs"
                      >
                        Reset Filters
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Destination Cards / Strips Container */}
              {sortedAndFilteredDestinations.length === 0 ? (
                <div className="glass-panel rounded-3xl p-10 text-center border border-[var(--border-card)]">
                  <Navigation className="w-10 h-10 text-[var(--text-faint)] mx-auto mb-2 opacity-40" />
                  <h3 className="text-base font-semibold text-[var(--text-main)] font-heading">No Flight Routes Found</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1 max-w-sm mx-auto">
                    Try clearing search query or adjusting your category/aircraft filter selections.
                  </p>
                </div>
              ) : view === 'list' && density === 'compact' ? (
                /* HIGH-DENSITY FLIGHT OPERATIONS TABLE (25+ DESTINATIONS PER SCREEN) */
                <div className="glass-panel rounded-2xl border border-[var(--border-card)] overflow-x-auto shadow-sm">
                  {/* Sticky Table Header */}
                  <div className="hidden lg:grid grid-cols-[32px_28px_minmax(140px,1.3fr)_minmax(120px,1.1fr)_minmax(70px,0.6fr)_minmax(110px,0.9fr)_minmax(85px,0.7fr)_minmax(105px,0.8fr)_minmax(125px,1.0fr)_minmax(80px,0.6fr)_32px] items-center gap-2 px-3 py-2 text-[10px] font-mono font-semibold uppercase tracking-wider dense-table-header sticky top-0 z-30 backdrop-blur-md select-none min-w-[1020px]">
                    <div className="text-center" title="Bookmark / Pin">★</div>
                    <div className="text-center" aria-hidden="true"></div>
                    <div
                      onClick={() => handleSort('destination')}
                      className="cursor-pointer hover:text-[var(--text-main)] transition-colors flex items-center gap-1 group/col"
                    >
                      <span>Destination</span>
                      {sortConfig.field === 'destination' ? (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 theme-accent-text" /> : <ChevronDown className="w-3 h-3 theme-accent-text" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 opacity-30 group-hover/col:opacity-80" />
                      )}
                    </div>
                    <div
                      onClick={() => handleSort('group')}
                      className="cursor-pointer hover:text-[var(--text-main)] transition-colors flex items-center gap-1 group/col"
                    >
                      <span>Collection</span>
                      {sortConfig.field === 'group' ? (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 theme-accent-text" /> : <ChevronDown className="w-3 h-3 theme-accent-text" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 opacity-30 group-hover/col:opacity-80" />
                      )}
                    </div>
                    <div
                      onClick={() => handleSort('aircraft')}
                      className="text-center cursor-pointer hover:text-[var(--text-main)] transition-colors flex items-center justify-center gap-1 group/col"
                    >
                      <span>Aircraft</span>
                      {sortConfig.field === 'aircraft' ? (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 theme-accent-text" /> : <ChevronDown className="w-3 h-3 theme-accent-text" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 opacity-30 group-hover/col:opacity-80" />
                      )}
                    </div>
                    <div
                      onClick={() => handleSort('stars')}
                      className="cursor-pointer hover:text-[var(--text-main)] transition-colors flex items-center gap-1 group/col"
                    >
                      <span>Progress</span>
                      {sortConfig.field === 'stars' || sortConfig.field === 'mastery' ? (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 theme-accent-text" /> : <ChevronDown className="w-3 h-3 theme-accent-text" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 opacity-30 group-hover/col:opacity-80" />
                      )}
                    </div>
                    <div
                      onClick={() => handleSort('neededToNextStar')}
                      className="text-center cursor-pointer hover:text-[var(--text-main)] transition-colors flex items-center justify-center gap-1 group/col"
                    >
                      <span>To Next Star</span>
                      {sortConfig.field === 'neededToNextStar' ? (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 theme-accent-text" /> : <ChevronDown className="w-3 h-3 theme-accent-text" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 opacity-30 group-hover/col:opacity-80" />
                      )}
                    </div>
                    <div
                      onClick={() => handleSort('maps')}
                      className="text-center cursor-pointer hover:text-[var(--text-main)] transition-colors flex items-center justify-center gap-1 group/col"
                    >
                      <span>Maps</span>
                      {sortConfig.field === 'maps' ? (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 theme-accent-text" /> : <ChevronDown className="w-3 h-3 theme-accent-text" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 opacity-30 group-hover/col:opacity-80" />
                      )}
                    </div>
                    <div
                      onClick={() => handleSort('currentStarFlights')}
                      className="text-center cursor-pointer hover:text-[var(--text-main)] transition-colors flex items-center justify-center gap-1 group/col"
                    >
                      <span>Flights</span>
                      {sortConfig.field === 'currentStarFlights' ? (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 theme-accent-text" /> : <ChevronDown className="w-3 h-3 theme-accent-text" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 opacity-30 group-hover/col:opacity-80" />
                      )}
                    </div>
                    <div
                      onClick={() => handleSort('flightsDone')}
                      className="text-center cursor-pointer hover:text-[var(--text-main)] transition-colors flex items-center justify-center gap-1 group/col"
                    >
                      <span>Total Flights</span>
                      {sortConfig.field === 'flightsDone' ? (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 theme-accent-text" /> : <ChevronDown className="w-3 h-3 theme-accent-text" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 opacity-30 group-hover/col:opacity-80" />
                      )}
                    </div>
                    <div className="text-center">Info</div>
                  </div>

                  {/* Dense Table Rows */}
                  <div className="divide-y divide-[var(--border-subtle)] lg:min-w-[1020px]">
                    {sortedAndFilteredDestinations.map(dest => {
                      const stars = getStars(dest.flightsDone, dest.star1Req, dest.star2Req, dest.star3Req, dest.star4Req, dest.star5Req);
                      const maxStars = getMaxStars(dest);
                      const info = getNextStarInfo(dest);
                      const starDetails = getCurrentStarDetails(dest);
                      const isExpanded = expandedRowId === dest.id;
                      const reqs = [dest.star1Req, dest.star2Req, dest.star3Req];
                      if (dest.star4Req && dest.star4Req > 0) reqs.push(dest.star4Req);
                      if (dest.star5Req && dest.star5Req > 0) reqs.push(dest.star5Req);
                      const maxReq = reqs[reqs.length - 1];
                      const planeSprite = AIRCRAFT_SPRITES[dest.aircraft];

                      return (
                        <div
                          key={dest.id}
                          className={`transition-colors ${
                            isExpanded ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'
                          }`}
                        >
                          {/* Desktop Dense Row */}
                          <div className="hidden lg:grid grid-cols-[32px_28px_minmax(140px,1.3fr)_minmax(120px,1.1fr)_minmax(70px,0.6fr)_minmax(110px,0.9fr)_minmax(85px,0.7fr)_minmax(105px,0.8fr)_minmax(125px,1.0fr)_minmax(80px,0.6fr)_32px] items-center gap-2 px-3 py-1.5 text-xs dense-table-row min-w-[1020px]">
                            {/* Pin / Bookmark */}
                            <div className="flex justify-center">
                              <button
                                onClick={e => toggleBookmark(dest.id, e)}
                                className="p-0.5 text-[var(--text-muted)] hover:text-amber-400 transition-colors"
                                title={dest.isCustomList ? 'Remove Bookmark' : 'Bookmark Route'}
                              >
                                <Star className={`w-3.5 h-3.5 ${dest.isCustomList ? 'fill-amber-400 text-amber-400 glow-star' : ''}`} />
                              </button>
                            </div>

                            {/* Icon / Sprite */}
                            <div className="flex justify-center">
                              <div className="w-6 h-6 rounded-md bg-black/40 border border-white/10 flex items-center justify-center p-0.5 overflow-hidden">
                                {dest.icon ? (
                                  <img src={dest.icon} alt={dest.destination} className="w-5 h-5 object-contain" />
                                ) : planeSprite ? (
                                  <img src={planeSprite} alt={dest.aircraft} className="w-5 h-5 object-contain" />
                                ) : (
                                  <Plane className="w-3.5 h-3.5 theme-accent-text" />
                                )}
                              </div>
                            </div>

                            {/* Destination Name */}
                            <div className="min-w-0 flex items-center">
                              <span
                                onClick={() => setExpandedRowId(isExpanded ? null : dest.id)}
                                className="font-semibold text-[var(--text-main)] truncate cursor-pointer hover:text-[var(--accent)] transition-colors"
                                title={dest.destination}
                              >
                                {dest.destination}
                              </span>
                            </div>

                            {/* Collection / Set */}
                            <div className="min-w-0 flex items-center">
                              {dest.group && dest.group !== 'None' ? (
                                <span
                                  className="text-[11px] text-[var(--text-muted)] bg-white/5 px-1.5 py-0.5 rounded truncate max-w-full hover:text-[var(--text-main)] transition-colors"
                                  title={dest.group}
                                >
                                  {dest.group}
                                </span>
                              ) : (
                                <span className="text-[var(--text-faint)] text-xs select-none pl-1">—</span>
                              )}
                            </div>

                            {/* Aircraft Class */}
                            <div className="text-center">
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium theme-badge uppercase inline-block truncate max-w-[80px]" title={dest.aircraft}>
                                {dest.aircraft}
                              </span>
                            </div>

                            {/* Star Mastery HUD */}
                            <div className="flex items-center gap-1.5">
                              <div className="flex items-center gap-0.5 shrink-0">
                                {Array.from({ length: maxStars }).map((_, idx) => (
                                  <Star
                                    key={idx}
                                    className={`w-2.5 h-2.5 ${
                                      stars >= idx + 1 ? 'theme-star-active' : 'theme-star-inactive'
                                    }`}
                                  />
                                ))}
                              </div>
                              <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden min-w-[36px]">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    stars >= maxStars ? 'bg-[var(--star-color)]' : 'theme-progress-fill'
                                  }`}
                                  style={{ width: `${Math.min(100, Math.round((dest.flightsDone / maxReq) * 100))}%` }}
                                />
                              </div>
                            </div>

                            {/* To Next Star */}
                            <div className="text-center">
                              {stars >= maxStars ? (
                                <span className="text-[9px] font-mono font-semibold text-amber-400 bg-amber-400/15 px-1.5 py-0.2 rounded">
                                  ACE ★
                                </span>
                              ) : (
                                <span className="text-[11px] font-mono text-[var(--text-muted)]">
                                  <span className="font-semibold text-[var(--text-main)]">{info.needed}</span> to ★{info.nextStar}
                                </span>
                              )}
                            </div>

                            {/* Map Stock */}
                            <div className="flex items-center justify-center">
                              {dest.needsMap ? (
                                <div
                                  className="inline-flex items-center gap-1 bg-black/40 border border-white/10 px-1 py-0.5 rounded-lg shadow-inner"
                                  title={dest.mapDuration ? `Map count (${dest.mapDuration} active window per map)` : 'Map count (click to edit)'}
                                >
                                  <button
                                    onClick={() => updateMapCount(dest.id, (dest.mapsDone || 0) - 1)}
                                    disabled={(dest.mapsDone || 0) <= 0}
                                    className="tactile-btn w-6 h-7 rounded bg-white/5 hover:bg-white/15 text-[var(--text-muted)] hover:text-white flex items-center justify-center disabled:opacity-20 text-xs font-mono font-bold transition-all"
                                    title="Subtract 1 Map"
                                  >
                                    -
                                  </button>
                                  <EditableNumberInput
                                    value={dest.mapsDone || 0}
                                    onChange={val => updateMapCount(dest.id, val)}
                                    ariaLabel={`Map count for ${dest.destination}`}
                                    title={dest.mapDuration ? `Map count (${dest.mapDuration} active window per map)` : 'Map count (click to edit)'}
                                    className="w-12 h-7 text-center font-mono font-bold text-sm bg-black/50 border border-white/10 rounded-md focus:border-[var(--border-active)] theme-accent-text shadow-inner"
                                  />
                                  <button
                                    onClick={() => updateMapCount(dest.id, (dest.mapsDone || 0) + 1)}
                                    className="tactile-btn w-6 h-7 rounded theme-btn-soft flex items-center justify-center text-xs font-mono font-bold transition-all"
                                    title="Add 1 Map"
                                  >
                                    +
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[var(--text-faint)] text-xs select-none">—</span>
                              )}
                            </div>

                            {/* Current Star Flight Scrubber */}
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => updateFlightCount(dest.id, Math.max(0, dest.flightsDone - 1))}
                                disabled={dest.flightsDone <= 0}
                                className="tactile-btn w-6 h-7 rounded bg-white/5 hover:bg-white/10 text-xs font-mono font-bold disabled:opacity-20 transition-all flex items-center justify-center text-[var(--text-muted)] hover:text-white"
                                title="-1 Flight"
                              >
                                -
                              </button>

                              {starDetails.isMastered ? (
                                <div className="inline-flex items-center justify-center px-2.5 h-7 rounded-lg bg-amber-400/10 border border-amber-400/25 text-amber-300 font-mono font-semibold text-xs select-none">
                                  ★ ACE
                                </div>
                              ) : (
                                <div className="inline-flex items-center bg-black/50 border border-white/10 rounded-lg px-2 h-7 focus-within:border-[var(--border-active)] shadow-inner">
                                  <EditableNumberInput
                                    value={starDetails.tierDone}
                                    onChange={val => {
                                      const newTotal = starDetails.prevThreshold + Math.max(0, val);
                                      updateFlightCount(dest.id, newTotal);
                                    }}
                                    ariaLabel={`Flights on Star ${starDetails.currentStar} for ${dest.destination}`}
                                    title={`Flights on Star ${starDetails.currentStar} (click to edit)`}
                                    className="w-10 h-5 text-center font-mono font-bold text-xs bg-transparent border-0 focus:ring-0 theme-accent-text p-0"
                                  />
                                  <span className="text-[11px] font-mono text-[var(--text-muted)] select-none">
                                    /{starDetails.tierTarget}
                                  </span>
                                </div>
                              )}

                              <button
                                onClick={() => updateFlightCount(dest.id, dest.flightsDone + 1)}
                                className="tactile-btn w-6 h-7 rounded theme-btn-soft text-xs font-mono font-bold transition-all flex items-center justify-center"
                                title="+1 Flight"
                              >
                                +
                              </button>
                            </div>

                            {/* Total Flights */}
                            <div className="flex items-center justify-center">
                              <EditableNumberInput
                                value={dest.flightsDone}
                                onChange={val => updateFlightCount(dest.id, Math.max(0, val))}
                                ariaLabel={`Total flights for ${dest.destination}`}
                                title="Total flights completed (click to edit)"
                                className="w-14 h-7 text-center font-mono font-bold text-xs bg-black/40 border border-white/10 rounded-lg focus:border-[var(--border-active)] text-[var(--text-main)] shadow-inner"
                              />
                            </div>

                            {/* Details Chevron */}
                            <div className="flex justify-center">
                              <button
                                onClick={() => setExpandedRowId(isExpanded ? null : dest.id)}
                                className={`p-1 rounded-lg transition-colors ${
                                  isExpanded ? 'theme-btn-soft' : 'text-[var(--text-muted)] hover:text-white hover:bg-white/5'
                                }`}
                                title={isExpanded ? 'Collapse Details' : 'Expand Details'}
                              >
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          {/* Mobile/Tablet Fallback (< lg) */}
                          <div className="lg:hidden p-2.5 flex items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <button
                                onClick={e => toggleBookmark(dest.id, e)}
                                className="p-1 text-[var(--text-muted)] hover:text-amber-400 shrink-0"
                              >
                                <Star className={`w-3.5 h-3.5 ${dest.isCustomList ? 'fill-amber-400 text-amber-400' : ''}`} />
                              </button>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono theme-badge">{dest.aircraft}</span>
                                  {dest.needsMap && (
                                    <div
                                      className="inline-flex items-center gap-0.5 bg-black/40 border border-white/10 px-1 py-0.5 rounded-lg shadow-inner"
                                      title={dest.mapDuration ? `Map count (${dest.mapDuration} active timer per map)` : 'Map count'}
                                    >
                                      <span className="text-[10px]">🗺️</span>
                                      <button
                                        onClick={() => updateMapCount(dest.id, (dest.mapsDone || 0) - 1)}
                                        disabled={(dest.mapsDone || 0) <= 0}
                                        className="w-4 h-5 rounded bg-white/5 text-[var(--text-muted)] hover:text-white flex items-center justify-center disabled:opacity-20 text-[10px] font-bold"
                                        title="Subtract 1 Map"
                                      >
                                        -
                                      </button>
                                      <EditableNumberInput
                                        value={dest.mapsDone || 0}
                                        onChange={val => updateMapCount(dest.id, val)}
                                        ariaLabel={`Maps for ${dest.destination}`}
                                        className="w-9 h-5 text-center font-mono font-bold text-xs bg-black/50 border border-white/10 rounded theme-accent-text"
                                      />
                                      <button
                                        onClick={() => updateMapCount(dest.id, (dest.mapsDone || 0) + 1)}
                                        className="w-4 h-5 rounded theme-btn-soft flex items-center justify-center text-[10px] font-bold"
                                        title="Add 1 Map"
                                      >
                                        +
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <div
                                  onClick={() => setExpandedRowId(isExpanded ? null : dest.id)}
                                  className="font-semibold text-[var(--text-main)] truncate cursor-pointer"
                                >
                                  {dest.destination}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => updateFlightCount(dest.id, Math.max(0, dest.flightsDone - 1))}
                                  disabled={dest.flightsDone <= 0}
                                  className="tactile-btn w-6 h-7 rounded bg-white/5 text-xs font-mono font-bold disabled:opacity-20 flex items-center justify-center text-[var(--text-muted)]"
                                  title="-1 Flight"
                                >
                                  -
                                </button>
                                {starDetails.isMastered ? (
                                  <div className="px-2 h-7 rounded-lg bg-amber-400/10 border border-amber-400/25 text-amber-300 font-mono font-semibold text-xs flex items-center">
                                    ★ ACE
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center bg-black/50 border border-white/10 rounded-lg px-1.5 h-7">
                                    <EditableNumberInput
                                      value={starDetails.tierDone}
                                      onChange={val => {
                                        const newTotal = starDetails.prevThreshold + Math.max(0, val);
                                        updateFlightCount(dest.id, newTotal);
                                      }}
                                      ariaLabel={`Star flights for ${dest.destination}`}
                                      className="w-8 h-5 text-center font-mono font-bold text-xs bg-transparent border-0 focus:ring-0 theme-accent-text p-0"
                                    />
                                    <span className="text-[10px] font-mono text-[var(--text-muted)] select-none">
                                      /{starDetails.tierTarget}
                                    </span>
                                  </div>
                                )}
                                <button
                                  onClick={() => updateFlightCount(dest.id, dest.flightsDone + 1)}
                                  className="tactile-btn w-6 h-7 rounded theme-btn-soft text-xs font-mono font-bold flex items-center justify-center"
                                  title="+1 Flight"
                                >
                                  +
                                </button>
                              </div>

                              <div className="hidden sm:flex flex-col items-center justify-center px-1 text-[10px] font-mono" title="Total Flights">
                                <span className="text-[8px] uppercase tracking-wider text-[var(--text-faint)]">Total</span>
                                <span className="font-bold text-[var(--text-main)]">{dest.flightsDone}</span>
                              </div>

                              <button
                                onClick={() => setExpandedRowId(isExpanded ? null : dest.id)}
                                className="p-1.5 text-[var(--text-muted)] hover:text-white"
                              >
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          {/* Expanded Drawer Details */}
                          {isExpanded && (
                            <div className="bg-black/30 border-t border-white/5 p-4 animate-in slide-in-from-top-2 duration-200">
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Milestone Star Requirements Table */}
                                <div className="space-y-1.5">
                                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                                    Milestone Requirements
                                  </span>
                                  <div className="space-y-1 font-mono text-xs">
                                    {reqs.map((req, idx) => {
                                      const starNum = idx + 1;
                                      const isReached = dest.flightsDone >= req;
                                      const rankName = STAR_RANKS[idx]?.name || `Star ${starNum}`;
                                      return (
                                        <div
                                          key={idx}
                                          className={`flex items-center justify-between p-1.5 rounded-lg border ${
                                            isReached
                                              ? 'bg-amber-500/10 border-amber-500/25 text-amber-300'
                                              : 'bg-white/5 border-white/5 text-[var(--text-muted)]'
                                          }`}
                                        >
                                          <div className="flex items-center gap-1.5">
                                            <Star className={`w-3 h-3 ${isReached ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`} />
                                            <span>{rankName}</span>
                                          </div>
                                          <span>{req} flights</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Map Inventory Tracker */}
                                {dest.needsMap ? (
                                  <div className="space-y-1.5">
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                                      Map Inventory Stock
                                    </span>
                                    <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex items-center justify-between gap-3">
                                      <div className="flex items-center gap-2">
                                        <MapIcon className="w-4 h-4 theme-accent-text" />
                                        <div>
                                          <div className="text-xs font-medium text-[var(--text-main)]">Maps in Stock</div>
                                          <div className="text-[10px] text-[var(--text-muted)]">
                                            {dest.mapDuration
                                              ? (dest.mapDuration.toLowerCase().includes('use') ? 'Single-use map per flight' : `${dest.mapDuration} active timer per map`)
                                              : 'Unlocks timed flight window'}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1.5 bg-black/50 p-1 rounded-xl border border-white/10">
                                        <button
                                          onClick={() => updateMapCount(dest.id, (dest.mapsDone || 0) - 1)}
                                          disabled={(dest.mapsDone || 0) <= 0}
                                          className="tactile-btn w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-[var(--text-muted)] hover:text-white flex items-center justify-center disabled:opacity-20 font-bold transition-all"
                                          title="Subtract 1 Map"
                                        >
                                          <Minus className="w-3.5 h-3.5" />
                                        </button>
                                        <EditableNumberInput
                                          value={dest.mapsDone || 0}
                                          onChange={val => updateMapCount(dest.id, val)}
                                          ariaLabel={`Map stock for ${dest.destination}`}
                                          title="Click to type map count"
                                          className="w-16 h-8 text-center font-mono font-bold text-base bg-black/60 border border-white/15 rounded-lg theme-accent-text shadow-inner"
                                        />
                                        <button
                                          onClick={() => updateMapCount(dest.id, (dest.mapsDone || 0) + 1)}
                                          className="tactile-btn w-8 h-8 rounded-lg theme-btn-soft flex items-center justify-center font-bold transition-all"
                                          title="Add 1 Map"
                                        >
                                          <Plus className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-1.5">
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                                      Route Type
                                    </span>
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-[var(--text-muted)]">
                                      Regular scheduled flight route. No consumable flight maps required.
                                    </div>
                                  </div>
                                )}

                                {/* Route Details */}
                                <div className="space-y-1.5">
                                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                                    Route Details
                                  </span>
                                  <div className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-1.5 text-xs">
                                    <div className="flex justify-between">
                                      <span className="text-[var(--text-muted)]">Category:</span>
                                      <span className="text-[var(--text-main)]">{dest.category}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-[var(--text-muted)]">Total Flights:</span>
                                      <span className="font-mono font-medium text-[var(--text-main)]">
                                        {dest.flightsDone.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-[var(--text-muted)]">Mastery:</span>
                                      <span className="font-mono font-medium text-amber-400">
                                        {Math.round((dest.flightsDone / maxReq) * 100)}%
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-[var(--text-muted)]">Last Logged:</span>
                                      <span className="font-mono text-[var(--text-main)]">{formatTimestamp(dest.lastUpdated)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : view === 'list' ? (
                /* COMFORTABLE FLIGHT STRIP LIST VIEW */
                <div className="space-y-2">
                  {sortedAndFilteredDestinations.map(dest => {
                    const stars = getStars(dest.flightsDone, dest.star1Req, dest.star2Req, dest.star3Req, dest.star4Req, dest.star5Req);
                    const maxStars = getMaxStars(dest);
                    const info = getNextStarInfo(dest);
                    const starDetails = getCurrentStarDetails(dest);
                    const isExpanded = expandedRowId === dest.id;
                    const reqs = [dest.star1Req, dest.star2Req, dest.star3Req];
                    if (dest.star4Req && dest.star4Req > 0) reqs.push(dest.star4Req);
                    if (dest.star5Req && dest.star5Req > 0) reqs.push(dest.star5Req);
                    const maxReq = reqs[reqs.length - 1];
                    const planeSprite = AIRCRAFT_SPRITES[dest.aircraft];

                    return (
                      <div
                        key={dest.id}
                        className={`glass-card rounded-2xl border transition-all overflow-hidden ${
                          isExpanded ? 'border-[var(--border-active)] shadow-md' : 'border-[var(--border-card)]'
                        }`}
                      >
                        <div className="p-3 sm:p-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <button
                              onClick={e => toggleBookmark(dest.id, e)}
                              className="p-1 text-[var(--text-muted)] hover:text-amber-400 transition-colors shrink-0"
                              title={dest.isCustomList ? 'Remove from Bookmarks' : 'Pin to Bookmarks'}
                            >
                              <Star
                                className={`w-4 h-4 transition-all ${
                                  dest.isCustomList ? 'fill-amber-400 text-amber-400 glow-star scale-110' : ''
                                }`}
                              />
                            </button>

                            <div className="w-9 h-9 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center p-1 shrink-0 relative overflow-hidden">
                              {dest.icon ? (
                                <img src={dest.icon} alt={dest.destination} className="w-7 h-7 object-contain drop-shadow" />
                              ) : planeSprite ? (
                                <img src={planeSprite} alt={dest.aircraft} className="w-7 h-7 object-contain drop-shadow" />
                              ) : (
                                <Plane className="w-5 h-5 theme-accent-text" />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-medium uppercase tracking-wider theme-badge">
                                  {dest.aircraft}
                                </span>
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-normal text-[var(--text-muted)] bg-white/5 truncate max-w-[150px]">
                                  {dest.group}
                                </span>
                                {dest.needsMap && (
                                  <div className="inline-flex items-center gap-1 bg-black/40 border border-white/10 px-1.5 py-0.5 rounded-lg shadow-inner">
                                    <span className="text-[11px]" title="Flight Maps Required">🗺️</span>
                                    <span className="text-[10px] font-mono text-[var(--text-muted)] font-medium">Maps:</span>
                                    <button
                                      onClick={() => updateMapCount(dest.id, (dest.mapsDone || 0) - 1)}
                                      disabled={(dest.mapsDone || 0) <= 0}
                                      className="tactile-btn w-5 h-5 rounded bg-white/5 hover:bg-white/15 text-[var(--text-muted)] hover:text-white flex items-center justify-center disabled:opacity-20 text-[10px] font-mono font-bold transition-all"
                                      title="Subtract 1 Map"
                                    >
                                      -
                                    </button>
                                    <EditableNumberInput
                                      value={dest.mapsDone || 0}
                                      onChange={val => updateMapCount(dest.id, val)}
                                      ariaLabel={`Map count for ${dest.destination}`}
                                      title="Map count (click to edit)"
                                      className="w-11 h-6 text-center font-mono font-bold text-xs bg-black/50 border border-white/10 rounded focus:border-[var(--border-active)] theme-accent-text shadow-inner"
                                    />
                                    <button
                                      onClick={() => updateMapCount(dest.id, (dest.mapsDone || 0) + 1)}
                                      className="tactile-btn w-5 h-5 rounded theme-btn-soft flex items-center justify-center text-[10px] font-mono font-bold transition-all"
                                      title="Add 1 Map"
                                    >
                                      +
                                    </button>
                                  </div>
                                )}
                              </div>
                              <h3 className="text-sm sm:text-base font-semibold text-[var(--text-main)] tracking-tight font-heading truncate">
                                {dest.destination}
                              </h3>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1 min-w-[170px] lg:w-56 shrink-0">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: maxStars }).map((_, idx) => (
                                  <Star
                                    key={idx}
                                    className={`w-3 h-3 ${stars >= idx + 1 ? 'theme-star-active' : 'theme-star-inactive'}`}
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] font-mono font-medium text-[var(--text-muted)]">
                                {stars >= maxStars ? (
                                  <span className="text-amber-400 font-semibold">★ ACE</span>
                                ) : (
                                  `${info.needed} to ★${info.nextStar}`
                                )}
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden flex">
                              <div
                                className="h-full theme-progress-fill rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(100, (dest.flightsDone / maxReq) * 100)}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between lg:justify-end gap-2 shrink-0">
                            {/* Current Star Scrubber */}
                            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-2xl border border-white/10 shadow-inner">
                              <button
                                onClick={() => updateFlightCount(dest.id, Math.max(0, dest.flightsDone - 1))}
                                disabled={dest.flightsDone <= 0}
                                className="tactile-btn px-2.5 h-8 rounded-xl bg-white/5 hover:bg-white/15 text-xs font-mono font-bold text-[var(--text-muted)] hover:text-white disabled:opacity-20 flex items-center justify-center"
                                title="Subtract 1 Flight"
                              >
                                -
                              </button>
                              {starDetails.isMastered ? (
                                <div className="px-3 h-8 rounded-xl bg-amber-400/10 border border-amber-400/25 text-amber-300 font-mono font-bold text-sm flex items-center">
                                  ★ ACE
                                </div>
                              ) : (
                                <div className="inline-flex items-center bg-black/50 border border-white/10 rounded-xl px-2 h-8 focus-within:border-[var(--border-active)]">
                                  <EditableNumberInput
                                    value={starDetails.tierDone}
                                    onChange={val => {
                                      const newTotal = starDetails.prevThreshold + Math.max(0, val);
                                      updateFlightCount(dest.id, newTotal);
                                    }}
                                    ariaLabel={`Star ${starDetails.currentStar} flights for ${dest.destination}`}
                                    title={`Star ${starDetails.currentStar} flights (click to edit)`}
                                    className="w-12 h-6 text-center font-mono font-bold text-sm bg-transparent border-0 focus:ring-0 theme-accent-text p-0"
                                  />
                                  <span className="text-xs font-mono text-[var(--text-muted)] select-none">
                                    /{starDetails.tierTarget}
                                  </span>
                                </div>
                              )}
                              <button
                                onClick={() => updateFlightCount(dest.id, dest.flightsDone + 1)}
                                className="tactile-btn px-2.5 h-8 rounded-xl theme-btn-soft text-xs font-mono font-bold flex items-center justify-center"
                                title="Add 1 Flight"
                              >
                                +
                              </button>
                            </div>

                            {/* Total Flights */}
                            <div className="flex items-center gap-1.5 bg-black/40 px-2.5 h-10 rounded-2xl border border-white/10 shadow-inner" title="Total All-Time Flights">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Total:</span>
                              <EditableNumberInput
                                value={dest.flightsDone}
                                onChange={val => updateFlightCount(dest.id, Math.max(0, val))}
                                ariaLabel={`Total flights for ${dest.destination}`}
                                title="Total flights completed (click to edit)"
                                className="w-12 h-6 text-center font-mono font-bold text-xs bg-white/5 border border-white/10 rounded-lg theme-accent-text p-0"
                              />
                            </div>

                            <button
                              onClick={() => setExpandedRowId(isExpanded ? null : dest.id)}
                              className={`p-1.5 rounded-xl border transition-all ${
                                isExpanded ? 'theme-btn-soft' : 'bg-white/5 border-white/10 text-[var(--text-muted)] hover:text-white'
                              }`}
                              title={isExpanded ? 'Collapse Details' : 'Expand Details'}
                            >
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="bg-black/30 border-t border-white/5 p-4 animate-in slide-in-from-top-2 duration-200">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              <div className="space-y-1.5">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                                  Milestone Star Requirements
                                </span>
                                <div className="space-y-1 font-mono text-xs">
                                  {reqs.map((req, idx) => {
                                    const isReached = dest.flightsDone >= req;
                                    return (
                                      <div
                                        key={idx}
                                        className={`flex items-center justify-between p-1.5 rounded-lg border ${
                                          isReached ? 'bg-amber-500/10 border-amber-500/25 text-amber-300' : 'bg-white/5 border-white/5 text-[var(--text-muted)]'
                                        }`}
                                      >
                                        <div className="flex items-center gap-1.5">
                                          <Star className={`w-3 h-3 ${isReached ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`} />
                                          <span>{STAR_RANKS[idx]?.name || `Star ${idx + 1}`}</span>
                                        </div>
                                        <span>{req} flights</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {dest.needsMap ? (
                                <div className="space-y-1.5">
                                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                                    Map Inventory Tracker
                                  </span>
                                  <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                      <MapIcon className="w-4 h-4 theme-accent-text" />
                                      <div>
                                        <div className="text-xs font-medium text-[var(--text-main)]">Maps in Stock</div>
                                        <div className="text-[10px] text-[var(--text-muted)]">
                                          {dest.mapDuration
                                            ? (dest.mapDuration.toLowerCase().includes('use') ? 'Single-use map per flight' : `${dest.mapDuration} active timer per map`)
                                            : 'Unlocks timed flight window'}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-black/50 p-1 rounded-xl border border-white/10">
                                      <button
                                        onClick={() => updateMapCount(dest.id, (dest.mapsDone || 0) - 1)}
                                        disabled={(dest.mapsDone || 0) <= 0}
                                        className="tactile-btn w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-[var(--text-muted)] hover:text-white flex items-center justify-center disabled:opacity-20 font-bold transition-all"
                                        title="Subtract 1 Map"
                                      >
                                        <Minus className="w-3.5 h-3.5" />
                                      </button>
                                      <EditableNumberInput
                                        value={dest.mapsDone || 0}
                                        onChange={val => updateMapCount(dest.id, val)}
                                        ariaLabel={`Map stock for ${dest.destination}`}
                                        title="Click to type map count"
                                        className="w-16 h-8 text-center font-mono font-bold text-base bg-black/60 border border-white/15 rounded-lg theme-accent-text shadow-inner"
                                      />
                                      <button
                                        onClick={() => updateMapCount(dest.id, (dest.mapsDone || 0) + 1)}
                                        className="tactile-btn w-8 h-8 rounded-lg theme-btn-soft flex items-center justify-center font-bold transition-all"
                                        title="Add 1 Map"
                                      >
                                        <Plus className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-1.5">
                                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                                    Route Access
                                  </span>
                                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-[var(--text-muted)]">
                                    Regular scheduled flight route. No consumable flight maps required.
                                  </div>
                                </div>
                              )}

                              <div className="space-y-1.5">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                                  Flight Log Details
                                </span>
                                <div className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-1.5 text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-[var(--text-muted)]">Division:</span>
                                    <span className="text-[var(--text-main)]">{dest.category}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-[var(--text-muted)]">Total Flights:</span>
                                    <span className="font-mono font-medium text-[var(--text-main)]">
                                      {dest.flightsDone.toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-[var(--text-muted)]">Mastery:</span>
                                    <span className="font-mono font-medium text-amber-400">
                                      {Math.round((dest.flightsDone / maxReq) * 100)}%
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-[var(--text-muted)]">Last Logged:</span>
                                    <span className="font-mono text-[var(--text-main)]">{formatTimestamp(dest.lastUpdated)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* HIGH-DENSITY RADAR GRID VIEW (6-8 COLUMNS ACROSS) */
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 gap-2">
                  {sortedAndFilteredDestinations.map(dest => {
                    const stars = getStars(dest.flightsDone, dest.star1Req, dest.star2Req, dest.star3Req, dest.star4Req, dest.star5Req);
                    const maxStars = getMaxStars(dest);
                    const info = getNextStarInfo(dest);
                    const starDetails = getCurrentStarDetails(dest);
                    const planeSprite = AIRCRAFT_SPRITES[dest.aircraft];

                    return (
                      <div
                        key={dest.id}
                        className="glass-card rounded-xl p-2.5 border border-[var(--border-card)] hover:border-[var(--border-active)] transition-all space-y-2 flex flex-col justify-between group"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-start justify-between gap-1">
                            <div className="w-7 h-7 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center p-0.5 shrink-0">
                              {dest.icon ? (
                                <img src={dest.icon} alt={dest.destination} className="w-6 h-6 object-contain" />
                              ) : planeSprite ? (
                                <img src={planeSprite} alt={dest.aircraft} className="w-6 h-6 object-contain" />
                              ) : (
                                <Plane className="w-4 h-4 theme-accent-text" />
                              )}
                            </div>
                            <button
                              onClick={e => toggleBookmark(dest.id, e)}
                              className="p-0.5 text-[var(--text-muted)] hover:text-amber-400 transition-colors"
                            >
                              <Star
                                className={`w-3.5 h-3.5 ${dest.isCustomList ? 'fill-amber-400 text-amber-400 glow-star' : ''}`}
                              />
                            </button>
                          </div>

                          <div>
                            <div className="flex items-center gap-1 mb-0.5">
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-medium uppercase theme-badge truncate max-w-[70px]">
                                {dest.aircraft}
                              </span>
                              {dest.needsMap && (
                                <div
                                  className="flex items-center gap-0.5 bg-black/40 px-1 py-0.5 rounded border border-white/5"
                                  title={dest.mapDuration ? `Map count (${dest.mapDuration} active timer per map)` : 'Map Inventory'}
                                >
                                  <span className="text-[10px]">🗺️</span>
                                  <button
                                    onClick={() => updateMapCount(dest.id, (dest.mapsDone || 0) - 1)}
                                    disabled={(dest.mapsDone || 0) <= 0}
                                    className="w-4 h-5 rounded bg-white/5 text-[var(--text-muted)] hover:text-white flex items-center justify-center disabled:opacity-20 text-[10px] font-bold"
                                    title="Subtract 1 Map"
                                  >
                                    -
                                  </button>
                                  <EditableNumberInput
                                    value={dest.mapsDone || 0}
                                    onChange={val => updateMapCount(dest.id, val)}
                                    ariaLabel={`Maps for ${dest.destination}`}
                                    className="w-8 h-5 text-center font-mono font-bold text-xs bg-black/50 border border-white/10 rounded theme-accent-text"
                                  />
                                  <button
                                    onClick={() => updateMapCount(dest.id, (dest.mapsDone || 0) + 1)}
                                    className="w-4 h-5 rounded theme-btn-soft flex items-center justify-center text-[10px] font-bold"
                                    title="Add 1 Map"
                                  >
                                    +
                                  </button>
                                </div>
                              )}
                            </div>
                            <h3 className="text-xs font-semibold text-[var(--text-main)] font-heading truncate leading-snug" title={dest.destination}>
                              {dest.destination}
                            </h3>
                            <div className="text-[9px] text-[var(--text-muted)] truncate opacity-70">
                              {dest.group}
                            </div>
                          </div>

                          {/* Star Mastery */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px]">
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: maxStars }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-2.5 h-2.5 ${stars >= i + 1 ? 'theme-star-active' : 'theme-star-inactive'}`}
                                  />
                                ))}
                              </div>
                              <span className="text-[9px] font-mono text-amber-300">
                                {stars >= maxStars ? 'ACE' : `${info.needed} left`}
                              </span>
                            </div>

                            <div className="h-1 w-full bg-black/40 rounded-full overflow-hidden">
                              <div
                                className="h-full theme-progress-fill rounded-full"
                                style={{ width: `${Math.min(100, (dest.flightsDone / info.nextReq) * 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Quick Action Counters */}
                        <div className="pt-1.5 border-t border-white/5 flex items-center justify-between gap-1">
                          <button
                            onClick={() => updateFlightCount(dest.id, Math.max(0, dest.flightsDone - 1))}
                            disabled={dest.flightsDone <= 0}
                            className="tactile-btn px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-xs font-mono font-bold disabled:opacity-20 flex items-center justify-center text-[var(--text-muted)] hover:text-white"
                            title="-1 Flight"
                          >
                            -
                          </button>
                          {starDetails.isMastered ? (
                            <div className="px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/25 text-amber-300 font-mono font-bold text-xs">
                              ★ ACE
                            </div>
                          ) : (
                            <div className="inline-flex items-center bg-black/50 border border-white/10 rounded-lg px-1.5 py-0.5">
                              <EditableNumberInput
                                value={starDetails.tierDone}
                                onChange={val => {
                                  const newTotal = starDetails.prevThreshold + Math.max(0, val);
                                  updateFlightCount(dest.id, newTotal);
                                }}
                                ariaLabel={`Star flights for ${dest.destination}`}
                                title={`Flights on Star ${starDetails.currentStar} (click to edit)`}
                                className="w-8 h-5 text-center font-mono font-bold text-xs bg-transparent border-0 focus:ring-0 theme-accent-text p-0"
                              />
                              <span className="text-[10px] font-mono text-[var(--text-muted)] select-none">
                                /{starDetails.tierTarget}
                              </span>
                            </div>
                          )}
                          <button
                            onClick={() => updateFlightCount(dest.id, dest.flightsDone + 1)}
                            className="tactile-btn px-2 py-0.5 rounded theme-btn-soft font-mono font-bold text-xs flex items-center justify-center"
                            title="+1 Flight"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Theme Picker Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="glass-panel bg-[var(--bg-card)] p-6 sm:p-7 rounded-3xl w-full max-w-2xl border border-[var(--border-card)] shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl theme-badge flex items-center justify-center">
                  <Palette className="w-5 h-5 theme-accent-text" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-[var(--text-main)] font-heading">
                    Color Themes
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Change the color theme of AC-Tracker.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowThemeModal(false)}
                className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-xl hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-black/40 border border-white/10 rounded-2xl overflow-x-auto custom-scrollbar">
                {[
                  { id: 'all', label: 'All Themes', count: Object.keys(THEME_CONFIGS).length },
                  {
                    id: 'factory',
                    label: 'Theme Factory',
                    count: Object.values(THEME_CONFIGS).filter(c => c.category === 'theme-factory').length,
                  },
                  {
                    id: 'light',
                    label: 'Daylight / Light',
                    count: Object.values(THEME_CONFIGS).filter(c => !c.isDark).length,
                  },
                  {
                    id: 'dark',
                    label: 'Dark Deck',
                    count: Object.values(THEME_CONFIGS).filter(c => c.isDark).length,
                  },
                ].map(tab => {
                  const isActive = themeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setThemeTab(tab.id as any)}
                      className={`tactile-btn px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                        isActive
                          ? 'theme-btn-accent shadow-sm'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/5'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive ? 'bg-black/30 text-white' : 'bg-white/10 text-[var(--text-muted)]'
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1 pt-1">
                {(Object.entries(THEME_CONFIGS) as [ThemeId, ThemeConfig][])
                  .filter(([_, cfg]) => {
                    if (themeTab === 'factory') return cfg.category === 'theme-factory';
                    if (themeTab === 'light') return !cfg.isDark;
                    if (themeTab === 'dark') return cfg.isDark;
                    return true;
                  })
                  .map(([id, cfg]) => {
                    const isSelected = theme === id;
                    return (
                      <button
                        key={id}
                        onClick={() => {
                          setTheme(id);
                          setShowThemeModal(false);
                        }}
                        style={{
                          borderColor: isSelected ? cfg.accentPreview : undefined,
                          boxShadow: isSelected ? `0 0 22px -3px ${cfg.accentPreview}40` : undefined,
                        }}
                        className={`tactile-btn p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between gap-3 group ${
                          isSelected
                            ? 'bg-[var(--bg-surface)] border-2'
                            : 'bg-black/25 border-white/10 hover:border-white/20 hover:bg-white/5'
                        }`}
                      >
                        {/* Atmospheric color swatch strip */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* 3-Tone Cockpit Palette Stripe */}
                            <div className="flex items-center rounded-lg overflow-hidden border border-white/15 shadow-inner shrink-0">
                              <div className="w-4 h-5" style={{ backgroundColor: cfg.bgPreview }} title="Void Base" />
                              <div className="w-4 h-5" style={{ backgroundColor: cfg.surfacePreview }} title="Surface Card" />
                              <div className="w-5 h-5 flex items-center justify-center" style={{ backgroundColor: cfg.accentPreview }} title="HUD Accent">
                                {isSelected && <Check className="w-3.5 h-3.5 text-slate-950 font-bold" />}
                              </div>
                            </div>

                            <span
                              className="text-[9px] font-mono font-medium px-2 py-0.5 rounded-full border uppercase tracking-wider"
                              style={{
                                color: cfg.accentPreview,
                                borderColor: `${cfg.accentPreview}40`,
                                backgroundColor: `${cfg.accentPreview}15`,
                              }}
                            >
                              {cfg.tag}
                            </span>

                            {cfg.category === 'theme-factory' && (
                              <span
                                className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-widest"
                                title="Created from Theme Factory Template"
                              >
                                Factory
                              </span>
                            )}
                          </div>

                          {isSelected && (
                            <span
                              className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full shrink-0"
                              style={{
                                backgroundColor: cfg.accentPreview,
                                color: cfg.isDark ? '#020617' : '#ffffff',
                              }}
                            >
                              ACTIVE
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="text-sm font-semibold font-heading text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors">
                            {cfg.name}
                          </div>
                          <div className="text-[11px] text-[var(--text-muted)] line-clamp-2 mt-0.5 leading-snug">
                            {cfg.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Brand Logo Crest Selector Modal */}
      {showLogoModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="glass-panel bg-[var(--bg-card)] p-6 sm:p-7 rounded-3xl w-full max-w-3xl border border-[var(--border-card)] shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl theme-badge flex items-center justify-center p-1 shadow-md shrink-0">
                  <img src={activeLogo.file} alt="Active Logo" className="w-full h-full object-contain drop-shadow" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-[var(--text-main)] font-heading">
                    AC-Tracker Brand Logos
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Original 3D flight-deck emblems reimagined from the official Airport City logo.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLogoModal(false)}
                className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-xl hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto custom-scrollbar pr-1 pt-1">
              {LOGO_OPTIONS.map((opt) => {
                const isSelected = logoId === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      handleSelectLogo(opt.id);
                    }}
                    className={`tactile-btn p-5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between gap-4 cursor-pointer group ${
                      isSelected
                        ? 'border-[var(--accent)] bg-[var(--accent-muted)] shadow-xl ring-1 ring-[var(--accent)]'
                        : 'border-[var(--border-card)] bg-black/30 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* 3D Emblem Showcase Box */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center p-1.5 shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
                        <img
                          src={opt.file}
                          alt={opt.name}
                          className="w-full h-full object-contain drop-shadow-2xl"
                        />
                      </div>

                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            isSelected ? 'theme-btn-accent shadow-sm' : 'bg-white/10 text-white/90'
                          }`}>
                            {opt.badge}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                              <Check className="w-3 h-3" /> ACTIVE
                            </span>
                          )}
                        </div>
                        <h4 className="font-heading font-semibold text-base text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                          {opt.name}
                        </h4>
                        <p className="text-xs text-[var(--text-muted)] font-normal line-clamp-2">
                          {opt.description}
                        </p>
                      </div>
                    </div>

                    {/* Dual Theme Preview Comparison: Dark vs Light */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-mono text-[var(--text-muted)] tracking-wider">Theme Contrast:</span>
                        {/* Dark Cockpit Swatch */}
                        <div className="w-6 h-6 rounded-lg bg-slate-950 border border-white/20 flex items-center justify-center p-0.5" title="Dark Cockpit Preview">
                          <img src={opt.file} alt="Dark" className="w-full h-full object-contain" />
                        </div>
                        {/* Daylight Light Swatch */}
                        <div className="w-6 h-6 rounded-lg bg-slate-100 border border-black/20 flex items-center justify-center p-0.5" title="Daylight Theme Preview">
                          <img src={opt.file} alt="Light" className="w-full h-full object-contain" />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectLogo(opt.id);
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                          isSelected
                            ? 'theme-btn-accent shadow-md'
                            : 'bg-white/10 hover:bg-white/20 text-[var(--text-main)]'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Use Logo'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Backup & JSON Tools Modal */}
      {showBackupModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="glass-panel bg-[var(--bg-card)] p-6 rounded-3xl w-full max-w-md border border-[var(--border-card)] shadow-2xl space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl theme-badge flex items-center justify-center">
                  <Download className="w-5 h-5 theme-accent-text" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-[var(--text-main)] font-heading">Data Management</h3>
                  <p className="text-xs text-[var(--text-muted)]">Backup, restore, or reset your flight progress.</p>
                </div>
              </div>
              <button onClick={() => setShowBackupModal(false)} className="p-1.5 text-gray-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={exportToJSON}
                className="tactile-btn w-full p-4 rounded-2xl bg-black/30 border border-white/10 hover:border-[var(--border-active)] flex items-center justify-between text-left group transition-all"
              >
                <div>
                  <div className="text-xs font-medium text-[var(--text-main)] group-hover:text-[var(--accent)]">Export Progress to JSON</div>
                  <div className="text-[10px] text-[var(--text-muted)]">Download a timestamped snapshot of all flights & fleet</div>
                </div>
                <Download className="w-4 h-4 theme-accent-text" />
              </button>

              <label className="tactile-btn w-full p-4 rounded-2xl bg-black/30 border border-white/10 hover:border-[var(--border-active)] flex items-center justify-between text-left group transition-all cursor-pointer">
                <div>
                  <div className="text-xs font-medium text-[var(--text-main)] group-hover:text-[var(--accent)]">Import Backup JSON</div>
                  <div className="text-[10px] text-[var(--text-muted)]">Restore your previously saved flight logs</div>
                </div>
                <Upload className="w-4 h-4 theme-accent-text" />
                <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImportJSON} />
              </label>

              <div className="pt-2">
                <button
                  onClick={resetAllData}
                  className={`w-full p-3.5 rounded-2xl border text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                    showResetConfirm
                      ? 'bg-rose-600 border-rose-700 text-white animate-pulse font-semibold'
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                  {showResetConfirm ? 'Click Again to Confirm Reset!' : 'Reset All Progress'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const container = document.getElementById('root')!;
const root = (window as any)._reactRoot || createRoot(container);
(window as any)._reactRoot = root;
root.render(<AeroQuest />);
