// telemetry.ts - Anonymous background telemetry heartbeat for AC-Tracker
import { ProfileData } from './profiles';

const PING_STORAGE_KEY = 'act_last_telemetry_ping';
const PING_INTERVAL_MS = 3 * 60 * 60 * 1000; // 3 hours throttle

/**
 * Derives active features used by the pilot profile
 */
export function getActiveFeatures(profile: ProfileData): string[] {
  const features: string[] = [];
  const ud = profile.userData || {};
  const prefs = profile.prefs || ({} as any);

  // Flight Deck activity
  const flightCount = Object.values(ud).reduce((sum, e) => sum + (e?.count || 0), 0);
  if (flightCount > 0) features.push('flights');

  // Bookmarks
  if (Object.values(ud).some(e => e?.isCustomList)) {
    features.push('bookmarks');
  }

  // Maps Depot
  if (prefs.enabledViews?.maps !== false && Object.values(ud).some(e => (e?.maps || 0) > 0)) {
    features.push('maps');
  }

  // Fleet Hangar
  if (prefs.enabledViews?.airplanes !== false && Array.isArray(profile.airplanes) && profile.airplanes.length > 0) {
    features.push('airplanes');
  }

  // Telemetry & Stats
  if (prefs.enabledViews?.stats !== false && (profile.starHistory || []).length > 1) {
    features.push('stats');
  }

  // Missions Depot
  if (prefs.enabledViews?.missions !== false && profile.missions) {
    const hasMissionItems = Object.values(profile.missions).some(group =>
      group && Object.values(group).some(v => typeof v === 'number' && v > 0)
    );
    if (hasMissionItems) features.push('missions');
  }

  // Events Calendar
  if (prefs.enabledViews?.events !== false) {
    features.push('events');
  }

  // Star Sync Offsets
  const offsets = profile.starOffsets;
  if (offsets && (offsets.ace || offsets.captain || offsets.expert || offsets.master || offsets.specialist)) {
    features.push('star_offsets');
  }

  // Custom Theme
  if (prefs.themeId && prefs.themeId !== 'stealth-ghost') {
    features.push('custom_theme');
  }

  // Custom Logo
  if (prefs.logoId && prefs.logoId !== 'opt1') {
    features.push('custom_logo');
  }

  // Grid View
  if (prefs.defaultFlightView === 'grid') {
    features.push('grid_view');
  }

  // Compact density
  if (prefs.density === 'compact') {
    features.push('compact_density');
  }

  // Focus mode
  if (prefs.focusMode) {
    features.push('focus_mode');
  }

  // Getting started completed
  if (prefs.hasSeenGettingStarted) {
    features.push('getting_started');
  }

  return features;
}

/**
 * Sends a lightweight, non-blocking telemetry ping if throttled interval has passed
 */
export async function sendTelemetryPing(profile: ProfileData, appVersion: string): Promise<void> {
  if (typeof window === 'undefined' || !profile || !profile.meta || !profile.meta.id) {
    return;
  }

  // Throttle check per pilot
  try {
    const lastPingStr = localStorage.getItem(`${PING_STORAGE_KEY}_${profile.meta.id}`);
    if (lastPingStr) {
      const lastPing = parseInt(lastPingStr, 10);
      if (Date.now() - lastPing < PING_INTERVAL_MS) {
        return; // Throttled
      }
    }
  } catch {
    // Ignore localStorage errors
  }

  try {
    const ud = profile.userData || {};
    let totalFlights = 0;
    let routesCount = 0;

    Object.values(ud).forEach(e => {
      if (e && e.count > 0) {
        routesCount++;
        totalFlights += e.count;
      }
    });

    const starHistory = profile.starHistory || [];
    const totalStars = starHistory.length ? (starHistory[starHistory.length - 1].stars || 0) : 0;
    const missionsCount = profile.missions ? Object.keys(profile.missions).length : 0;
    const features = getActiveFeatures(profile);

    const payload = {
      id: profile.meta.id,
      name: profile.meta.name || 'Anonymous Pilot',
      avatar: profile.meta.emoji || '✈️',
      acCode: profile.meta.acCode || '',
      totalFlights,
      totalStars,
      routesCount,
      missionsCount,
      theme: profile.prefs?.themeId || 'stealth-ghost',
      density: profile.prefs?.density || 'compact',
      starMode: profile.prefs?.starCountMode || 'cumulative',
      features,
      version: appVersion,
    };

    // Quiet fire-and-forget request
    fetch('/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    })
      .then(res => {
        if (res.ok) {
          try {
            localStorage.setItem(`${PING_STORAGE_KEY}_${profile.meta.id}`, String(Date.now()));
          } catch {
            // Ignore storage errors
          }
        }
      })
      .catch(() => {
        // Silently ignore network failures (e.g. offline, local dev without CF functions)
      });
  } catch {
    // Fail safe with zero side effects on the app
  }
}
