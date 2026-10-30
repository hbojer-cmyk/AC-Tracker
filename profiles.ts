// profiles.ts - Multi-profile storage, metadata, and migration for AC-Tracker

export interface ProfileMeta {
  id: string;           // Unique profile ID e.g. generated UUID or timestamp-random
  name: string;         // Display name e.g. "Alastair"
  emoji: string;        // Avatar emoji e.g. "✈️"
  acCode: string;       // Airport City profile code e.g. "207ZK0GJT"
  accentColor: string;  // Hex color code e.g. "#00e5ff"
  createdAt: number;    // Creation timestamp
}

export interface UserDataEntry {
  count: number;
  lastUpdated: number;
  maps?: number;
  isCustomList?: boolean;
}

export interface VisibleColumnsConfig {
  bookmark: boolean;
  collection: boolean;
  aircraft: boolean;
  progress: boolean;
  toNextStar: boolean;
  maps: boolean;
  totalFlights: boolean;
  info: boolean;
}

export const DEFAULT_VISIBLE_COLUMNS: VisibleColumnsConfig = {
  bookmark: true,
  collection: true,
  aircraft: true,
  progress: true,
  toNextStar: true,
  maps: true,
  totalFlights: true,
  info: true,
};

export interface ProfilePrefs {
  themeId: string;
  logoId: string;
  density: 'compact' | 'comfortable';
  starCountMode: 'cumulative' | 'exact' | 'offset';
  sidebarOpen: boolean;
  flightDeckHeaderOpen: boolean;
  showMissingAlliance: boolean;
  showMissingAdventure: boolean;
  visibleColumns?: VisibleColumnsConfig;
  focusMode?: boolean;
}

export interface StarHistoryEntry {
  date: string;       // YYYY-MM-DD
  stars: number;      // Total star count on this date
  totalFlights?: number; // Optional total flights logged
  eventTag?: string;  // Optional: populated if an active event from ACTIVE_EVENT_CONFIG was running on this date
  isManual?: boolean; // True if manually backfilled by the user
}

export interface StarSyncOffsets {
  ace: number;        // 5-star cumulative milestone offset
  captain: number;    // 4-star cumulative milestone offset
  expert: number;     // 3-star cumulative milestone offset
  master: number;     // 2-star cumulative milestone offset
  specialist: number; // 1-star cumulative milestone offset
}

export const DEFAULT_STAR_SYNC_OFFSETS: StarSyncOffsets = {
  ace: 0,
  captain: 0,
  expert: 0,
  master: 0,
  specialist: 0,
};

export interface ProfileData {
  meta: ProfileMeta;
  userData: Record<string, UserDataEntry>;
  airplanes: any[] | null;
  prefs: ProfilePrefs;
  starHistory?: StarHistoryEntry[];
  starOffsets?: StarSyncOffsets;
}

export const STORAGE_KEYS = {
  profiles: 'act_profiles',
  activeProfileId: 'act_active_profile_id',
} as const;

export const LEGACY_KEYS = [
  'aeroquest_user_data',
  'aeroquest_owned_airplanes_v2',
  'aeroquest_theme_id',
  'aeroquest_density',
  'aeroquest_star_count_mode',
  'aeroquest_sidebar_open',
  'aeroquest_flight_deck_header_open',
  'aeroquest_show_missing_alliance',
  'aeroquest_show_missing_adventure',
  'act_logo_choice',
] as const;

export const DEFAULT_AVATARS = ['✈️', '🛫', '🛬', '🚀', '🚁', '🛰️', '🌍', '🧭', '⭐', '⚡', '🏆', '🎖️'];

export const DEFAULT_ACCENT_COLORS = [
  '#00e5ff', // Cyan
  '#38bdf8', // Sky Blue
  '#3b82f6', // Cobalt
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#f43f5e', // Rose
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#14b8a6', // Teal
  '#a855f7', // Purple
];

export function generateProfileId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
}

export function getDefaultPrefs(): ProfilePrefs {
  return {
    themeId: 'stealth-ghost',
    logoId: 'opt1',
    density: 'compact',
    starCountMode: 'cumulative',
    sidebarOpen: false,
    flightDeckHeaderOpen: true,
    showMissingAlliance: true,
    showMissingAdventure: true,
    visibleColumns: { ...DEFAULT_VISIBLE_COLUMNS },
    focusMode: false,
  };
}

/** Check if legacy aeroquest_* data exists in localStorage and no new profiles exist yet */
export function hasLegacyData(): boolean {
  try {
    const rawUserData = localStorage.getItem('aeroquest_user_data');
    const rawPlanes = localStorage.getItem('aeroquest_owned_airplanes_v2');
    return Boolean(rawUserData || rawPlanes);
  } catch (e) {
    return false;
  }
}

/** Read all profiles from localStorage */
export function loadAllProfiles(): Record<string, ProfileData> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.profiles);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (e) {
    console.error('Failed to parse act_profiles from localStorage', e);
    return {};
  }
}

/** Save all profiles to localStorage */
export function saveAllProfiles(profiles: Record<string, ProfileData>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.profiles, JSON.stringify(profiles));
  } catch (e) {
    console.error('Failed to save act_profiles to localStorage', e);
  }
}

/** Get active profile ID from localStorage */
export function getActiveProfileId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.activeProfileId);
  } catch (e) {
    return null;
  }
}

/** Set active profile ID in localStorage */
export function setActiveProfileId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.activeProfileId, id);
  } catch (e) {
    console.error('Failed to set act_active_profile_id', e);
  }
}

/**
 * Migrate legacy aeroquest_* keys into a newly named ProfileData,
 * persist to act_profiles, set active profile ID, and remove old flat keys.
 */
export function migrateLegacyData(
  name: string,
  emoji: string,
  accentColor: string,
  acCode: string
): ProfileData {
  const profileId = generateProfileId();

  let userData: Record<string, UserDataEntry> = {};
  let airplanes: any[] | null = null;

  try {
    const rawUserData = localStorage.getItem('aeroquest_user_data');
    if (rawUserData) {
      userData = JSON.parse(rawUserData);
    }
  } catch (e) {
    console.error('Error parsing legacy aeroquest_user_data', e);
  }

  try {
    const rawPlanes = localStorage.getItem('aeroquest_owned_airplanes_v2');
    if (rawPlanes) {
      airplanes = JSON.parse(rawPlanes);
    }
  } catch (e) {
    console.error('Error parsing legacy aeroquest_owned_airplanes_v2', e);
  }

  const prefs: ProfilePrefs = {
    themeId: localStorage.getItem('aeroquest_theme_id') || 'stealth-ghost',
    logoId: localStorage.getItem('act_logo_choice') || 'opt1',
    density: (localStorage.getItem('aeroquest_density') as 'compact' | 'comfortable') || 'compact',
    starCountMode: (localStorage.getItem('aeroquest_star_count_mode') as 'cumulative' | 'exact') || 'cumulative',
    sidebarOpen: localStorage.getItem('aeroquest_sidebar_open') === 'true',
    flightDeckHeaderOpen: localStorage.getItem('aeroquest_flight_deck_header_open') !== 'false',
    showMissingAlliance: localStorage.getItem('aeroquest_show_missing_alliance') !== 'false',
    showMissingAdventure: localStorage.getItem('aeroquest_show_missing_adventure') !== 'false',
    visibleColumns: { ...DEFAULT_VISIBLE_COLUMNS },
    focusMode: false,
  };

  const newProfile: ProfileData = {
    meta: {
      id: profileId,
      name: name.trim() || 'Pilot Commander',
      emoji: emoji || '✈️',
      accentColor: accentColor || '#00e5ff',
      acCode: acCode.trim().toUpperCase() || '',
      createdAt: Date.now(),
    },
    userData,
    airplanes,
    prefs,
    starHistory: [],
    starOffsets: { ...DEFAULT_STAR_SYNC_OFFSETS },
  };

  const allProfiles: Record<string, ProfileData> = {
    [profileId]: newProfile,
  };

  saveAllProfiles(allProfiles);
  setActiveProfileId(profileId);

  // Clean up legacy flat keys
  LEGACY_KEYS.forEach(key => {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  });

  return newProfile;
}

/** Create a blank profile */
export function createBlankProfile(meta: ProfileMeta): ProfileData {
  return {
    meta,
    userData: {},
    airplanes: null,
    prefs: getDefaultPrefs(),
    starHistory: [],
    starOffsets: { ...DEFAULT_STAR_SYNC_OFFSETS },
  };
}

/** Clone an existing profile into a new profile */
export function cloneProfile(source: ProfileData, newMeta: ProfileMeta): ProfileData {
  return {
    meta: newMeta,
    userData: JSON.parse(JSON.stringify(source.userData || {})),
    airplanes: source.airplanes ? JSON.parse(JSON.stringify(source.airplanes)) : null,
    prefs: {
      ...source.prefs,
      visibleColumns: source.prefs.visibleColumns
        ? { ...source.prefs.visibleColumns }
        : { ...DEFAULT_VISIBLE_COLUMNS },
    },
    starHistory: source.starHistory ? JSON.parse(JSON.stringify(source.starHistory)) : [],
    starOffsets: source.starOffsets ? { ...source.starOffsets } : { ...DEFAULT_STAR_SYNC_OFFSETS },
  };
}

/** Delete a profile from the profiles map and save */
export function deleteProfile(
  profiles: Record<string, ProfileData>,
  idToDelete: string
): Record<string, ProfileData> {
  const updated = { ...profiles };
  delete updated[idToDelete];
  saveAllProfiles(updated);
  return updated;
}
