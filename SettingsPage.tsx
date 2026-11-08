import React from 'react';
import {
  Plane,
  SlidersHorizontal,
  Compass,
  Map as MapIcon,
  Layers,
  BarChart3,
  Trophy,
  Calendar,
  Info,
  Palette,
  Download,
  User,
  Plus,
  Minus,
  Check,
  Sparkles,
  LayoutGrid,
  List,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { APP_VERSION, APP_UPDATED_DATE, THEME_CONFIGS, ThemeId } from './index';
import {
  EnabledViewsConfig,
  ProfileData,
  StarSyncOffsets,
} from './profiles';
import { ProfileAvatar } from './ProfileModal';

interface SettingsPageProps {
  // Navigation & Feature Toggles
  enabledViews: EnabledViewsConfig;
  onToggleView: (viewKey: keyof EnabledViewsConfig) => void;
  onSetAllViews: (enabled: boolean) => void;
  onApplyPreset: (preset: 'all' | 'streamlined' | 'minimal') => void;

  // Flight Deck & Display Preferences
  defaultFlightView: 'list' | 'grid';
  onChangeDefaultFlightView: (val: 'list' | 'grid') => void;
  density: 'compact' | 'comfortable';
  onChangeDensity: (val: 'compact' | 'comfortable') => void;
  showRecentFlights: boolean;
  onToggleRecentFlights: () => void;
  showActiveEventBanner: boolean;
  onToggleActiveEventBanner: () => void;
  focusMode: boolean;
  onToggleFocusMode: () => void;
  showMissingAlliance: boolean;
  onToggleMissingAlliance: () => void;
  showMissingAdventure: boolean;
  onToggleMissingAdventure: () => void;

  // Star Progression & Offsets
  starCountMode: 'cumulative' | 'exact' | 'offset';
  onChangeStarCountMode: (mode: 'cumulative' | 'exact' | 'offset') => void;
  starOffsets: StarSyncOffsets;
  onUpdateOffset: (tier: keyof StarSyncOffsets, delta: number) => void;

  // Theme & Appearance
  activeThemeId: string;
  onOpenThemeModal: () => void;
  activeLogoId: string;
  onOpenLogoModal: () => void;

  // Profile & Backup
  activeProfile: ProfileData | null;
  onOpenProfileModal: () => void;
  onOpenBackupModal: () => void;
  onOpenWhatsNewModal: () => void;
  onOpenGettingStarted?: () => void;

  // Quick navigation back to Flight Deck
  onNavigateToFlights: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  enabledViews,
  onToggleView,
  onSetAllViews,
  onApplyPreset,
  defaultFlightView,
  onChangeDefaultFlightView,
  density,
  onChangeDensity,
  showRecentFlights,
  onToggleRecentFlights,
  showActiveEventBanner,
  onToggleActiveEventBanner,
  focusMode,
  onToggleFocusMode,
  showMissingAlliance,
  onToggleMissingAlliance,
  showMissingAdventure,
  onToggleMissingAdventure,
  starCountMode,
  onChangeStarCountMode,
  starOffsets,
  onUpdateOffset,
  activeThemeId,
  onOpenThemeModal,
  activeLogoId,
  onOpenLogoModal,
  activeProfile,
  onOpenProfileModal,
  onOpenBackupModal,
  onOpenWhatsNewModal,
  onOpenGettingStarted,
  onNavigateToFlights,
}) => {
  const currentTheme = THEME_CONFIGS[activeThemeId as ThemeId] || THEME_CONFIGS['stealth-ghost'];

  const moduleDefinitions: Array<{
    key: keyof EnabledViewsConfig;
    title: string;
    description: string;
    icon: React.ReactNode;
    badge: string;
  }> = [
    {
      key: 'maps',
      title: 'Maps',
      description: 'Route map inventory, acquisition status, collection sets, and active flight window durations.',
      icon: <MapIcon className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />,
      badge: 'Inventory & Timers',
    },
    {
      key: 'airplanes',
      title: 'Aircraft',
      description: 'Owned aircraft list, flight speeds, fuel consumption, profits, and custom callsign nicknames.',
      icon: <Layers className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />,
      badge: 'Fleet Avionics',
    },
    {
      key: 'stats',
      title: 'Stats',
      description: 'Star velocity curves, milestone forecasting, category breakdown, and lowest-hanging fruit radar.',
      icon: <BarChart3 className="w-5 h-5 text-amber-500 dark:text-amber-400" />,
      badge: 'Analytics Hub',
    },
    {
      key: 'missions',
      title: 'Missions',
      description: 'Special landmark item trackers across aircraft tiers (Eiffel Tower, Aztec Pyramid, Colosseum, etc.).',
      icon: <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />,
      badge: 'Grand Landmarks',
    },
    {
      key: 'events',
      title: 'Events',
      description: 'Historical seasonal event rotation calendar, live active event indicators, and Forum Wiki guides.',
      icon: <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      badge: 'Seasonal Timeline',
    },
    {
      key: 'about',
      title: 'About ACT',
      description: 'Airport City wiki links, forums, promo codes, keyboard shortcuts, FAQ, and release documentation.',
      icon: <Info className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
      badge: 'Reference & Links',
    },
  ];

  const enabledCount = Object.values(enabledViews).filter(Boolean).length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Settings Header Bar */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[var(--border-card)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--theme-accent)] opacity-5 blur-[120px] pointer-events-none rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--theme-accent-soft)] border border-[var(--theme-accent)]/30 flex items-center justify-center shrink-0 shadow-lg">
              <SlidersHorizontal className="w-7 h-7 theme-accent-text" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[var(--text-main)] tracking-tight">
                  Avionics & Cockpit Settings
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[var(--theme-accent-soft)] theme-accent-text border border-[var(--theme-accent)]/30">
                  ACT PREFS
                </span>
              </div>
              <p className="text-sm text-[var(--text-muted)] mt-1 font-normal">
                Customize visible navigation modules, flight deck display options, progression modes, and cockpit aesthetics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToFlights}
              className="tactile-btn px-4 py-2 rounded-xl text-xs font-semibold theme-btn-accent flex items-center gap-2 shadow-md transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Return to Flights</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Settings Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Module Visibility & Flight Deck Preferences (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Navigation & Module Visibility */}
          <div className="glass-panel rounded-3xl p-6 border border-[var(--border-card)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[var(--border-subtle)] gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-heading font-bold text-[var(--text-main)]">
                    Navigation & Module Visibility
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-semibold">
                    {enabledCount} of 6 Enabled
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-0.5 font-normal">
                  Choose which features are shown in your header and mobile navigation bars. Flights is always active as the central hub.
                </p>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => onApplyPreset('all')}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors border border-black/10 dark:border-white/10"
                  title="Enable all modules"
                >
                  All
                </button>
                <button
                  onClick={() => onApplyPreset('streamlined')}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors border border-black/10 dark:border-white/10"
                  title="Flights, Maps, Stats, Events only"
                >
                  Streamlined
                </button>
                <button
                  onClick={() => onApplyPreset('minimal')}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors border border-black/10 dark:border-white/10"
                  title="Flights & Stats only"
                >
                  Minimal
                </button>
              </div>
            </div>

            {/* Permanent Core Module: Flights */}
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 dark:bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[var(--text-main)]">Flights</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-bold">
                      Always Active
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] font-normal">
                    Primary route tracker, flight counters, 536 destinations, star mastery, and filters.
                  </p>
                </div>
              </div>
              <div className="px-3 py-1 rounded-xl bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 text-xs font-mono font-semibold border border-cyan-500/30 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Locked</span>
              </div>
            </div>

            {/* Configurable Modules List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {moduleDefinitions.map((mod) => {
                const isEnabled = enabledViews[mod.key];
                return (
                  <div
                    key={mod.key}
                    onClick={() => onToggleView(mod.key)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isEnabled
                        ? 'bg-black/[0.03] dark:bg-black/30 border-black/15 dark:border-white/15 hover:border-[var(--theme-accent)]/50 shadow-sm'
                        : 'bg-black/[0.015] dark:bg-black/15 border-black/5 dark:border-white/5 opacity-60 hover:opacity-80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                            isEnabled
                              ? 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/15'
                              : 'bg-black/5 dark:bg-black/20 border-black/5 dark:border-white/5 text-gray-500'
                          }`}
                        >
                          {mod.icon}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[var(--text-main)] leading-tight">
                            {mod.title}
                          </div>
                          <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase font-medium">
                            {mod.badge}
                          </span>
                        </div>
                      </div>

                      {/* Custom Tactile Toggle Switch (Visible in both light and dark themes) */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isEnabled}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleView(mod.key);
                        }}
                        className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out shrink-0 border ${
                          isEnabled
                            ? 'bg-[var(--theme-accent)] border-[var(--theme-accent)] shadow-sm'
                            : 'bg-slate-300 dark:bg-white/15 border-slate-400/30 dark:border-white/10'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                            isEnabled ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    <p className="text-xs text-[var(--text-muted)] line-clamp-2 font-normal">
                      {mod.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 2: Flight Deck & Display Options */}
          <div className="glass-panel rounded-3xl p-6 border border-[var(--border-card)] space-y-5">
            <div className="pb-3 border-b border-[var(--border-subtle)]">
              <h2 className="text-lg font-heading font-bold text-[var(--text-main)]">
                Flight Deck & Display Preferences
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5 font-normal">
                Configure default startup views, row density, and cockpit widgets.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Default Flight View */}
              <div className="p-4 rounded-2xl bg-black/25 border border-[var(--border-subtle)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--text-main)] uppercase tracking-wider">
                    Default Flight View
                  </span>
                  <span className="text-[10px] font-mono theme-accent-text font-bold">
                    {defaultFlightView === 'list' ? 'Dense Table' : 'Grid Cards'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => onChangeDefaultFlightView('list')}
                    className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                      defaultFlightView === 'list'
                        ? 'theme-btn-accent font-semibold shadow-md'
                        : 'bg-black/5 dark:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/10 dark:hover:bg-white/10 border border-black/5 dark:border-white/5'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" /> Dense Table
                  </button>
                  <button
                    onClick={() => onChangeDefaultFlightView('grid')}
                    className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                      defaultFlightView === 'grid'
                        ? 'theme-btn-accent font-semibold shadow-md'
                        : 'bg-black/5 dark:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/10 dark:hover:bg-white/10 border border-black/5 dark:border-white/5'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" /> Grid Cards
                  </button>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] font-normal">
                  Preferred presentation mode when opening the Flights deck.
                </p>
              </div>

              {/* Row Density */}
              <div className="p-4 rounded-2xl bg-black/25 border border-[var(--border-subtle)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--text-main)] uppercase tracking-wider">
                    Row Density
                  </span>
                  <span className="text-[10px] font-mono theme-accent-text uppercase font-bold">
                    {density}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => onChangeDensity('compact')}
                    className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                      density === 'compact'
                        ? 'theme-btn-accent font-semibold shadow-md'
                        : 'bg-black/5 dark:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/10 dark:hover:bg-white/10 border border-black/5 dark:border-white/5'
                    }`}
                  >
                    <Minimize2 className="w-3.5 h-3.5" /> Compact
                  </button>
                  <button
                    onClick={() => onChangeDensity('comfortable')}
                    className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                      density === 'comfortable'
                        ? 'theme-btn-accent font-semibold shadow-md'
                        : 'bg-black/5 dark:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/10 dark:hover:bg-white/10 border border-black/5 dark:border-white/5'
                    }`}
                  >
                    <Maximize2 className="w-3.5 h-3.5" /> Comfortable
                  </button>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] font-normal">
                  Compact optimizes for maximum flights per screen; comfortable gives larger click targets.
                </p>
              </div>
            </div>

            {/* Widget Toggles */}
            <div className="space-y-2.5 pt-2">
              {/* Recently Flown Strip Toggle */}
              <div
                onClick={onToggleRecentFlights}
                className="p-3.5 rounded-2xl bg-black/25 border border-[var(--border-subtle)] flex items-center justify-between cursor-pointer hover:border-[var(--border-active)] transition-colors"
              >
                <div>
                  <div className="text-sm font-semibold text-[var(--text-main)]">Recently Flown Quick-Jump Bar</div>
                  <div className="text-xs text-[var(--text-muted)] font-normal">
                    Display horizontal chip strip with one-click +1 counters on the Flights page.
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={showRecentFlights}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleRecentFlights();
                  }}
                  className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out shrink-0 border ${
                    showRecentFlights
                      ? 'bg-[var(--theme-accent)] border-[var(--theme-accent)] shadow-sm'
                      : 'bg-slate-300 dark:bg-white/15 border-slate-400/30 dark:border-white/10'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      showRecentFlights ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Active Event Banner Toggle */}
              <div
                onClick={onToggleActiveEventBanner}
                className="p-3.5 rounded-2xl bg-black/25 border border-[var(--border-subtle)] flex items-center justify-between cursor-pointer hover:border-[var(--border-active)] transition-colors"
              >
                <div>
                  <div className="text-sm font-semibold text-[var(--text-main)]">Live Event Cockpit Banner</div>
                  <div className="text-xs text-[var(--text-muted)] font-normal">
                    Show current active seasonal event countdown and quick filter banner.
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={showActiveEventBanner}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleActiveEventBanner();
                  }}
                  className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out shrink-0 border ${
                    showActiveEventBanner
                      ? 'bg-[var(--theme-accent)] border-[var(--theme-accent)] shadow-sm'
                      : 'bg-slate-300 dark:bg-white/15 border-slate-400/30 dark:border-white/10'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      showActiveEventBanner ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Focus Mode Toggle */}
              <div
                onClick={onToggleFocusMode}
                className="p-3.5 rounded-2xl bg-black/25 border border-[var(--border-subtle)] flex items-center justify-between cursor-pointer hover:border-[var(--border-active)] transition-colors"
              >
                <div>
                  <div className="text-sm font-semibold text-[var(--text-main)]">Focus Mode (Streamlined Avionics)</div>
                  <div className="text-xs text-[var(--text-muted)] font-normal">
                    Collapses top metrics and transforms category pills into a compact dropdown.
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={focusMode}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFocusMode();
                  }}
                  className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out shrink-0 border ${
                    focusMode
                      ? 'bg-[var(--theme-accent)] border-[var(--theme-accent)] shadow-sm'
                      : 'bg-slate-300 dark:bg-white/15 border-slate-400/30 dark:border-white/10'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      focusMode ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Missing Alliance & Adventure Maps Radar Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div
                  onClick={onToggleMissingAlliance}
                  className="p-3 rounded-2xl bg-black/25 border border-[var(--border-subtle)] flex items-center justify-between cursor-pointer hover:border-[var(--border-active)] transition-colors"
                >
                  <div className="pr-2">
                    <div className="text-xs font-semibold text-[var(--text-main)]">Alliance Missing Maps</div>
                    <div className="text-[11px] text-[var(--text-muted)] font-normal">Show/hide Alliance flights with 0 maps in inventory</div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={showMissingAlliance}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleMissingAlliance();
                    }}
                    className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out shrink-0 border ${
                      showMissingAlliance
                        ? 'bg-[var(--theme-accent)] border-[var(--theme-accent)]'
                        : 'bg-slate-300 dark:bg-white/15 border-slate-400/30 dark:border-white/10'
                    }`}
                  >
                    <div
                      className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                        showMissingAlliance ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div
                  onClick={onToggleMissingAdventure}
                  className="p-3 rounded-2xl bg-black/25 border border-[var(--border-subtle)] flex items-center justify-between cursor-pointer hover:border-[var(--border-active)] transition-colors"
                >
                  <div className="pr-2">
                    <div className="text-xs font-semibold text-[var(--text-main)]">Adventure Missing Maps</div>
                    <div className="text-[11px] text-[var(--text-muted)] font-normal">Show/hide Adventure flights with 0 maps in inventory</div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={showMissingAdventure}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleMissingAdventure();
                    }}
                    className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out shrink-0 border ${
                      showMissingAdventure
                        ? 'bg-[var(--theme-accent)] border-[var(--theme-accent)]'
                        : 'bg-slate-300 dark:bg-white/15 border-slate-400/30 dark:border-white/10'
                    }`}
                  >
                    <div
                      className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                        showMissingAdventure ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Star Progression, Theme & Profile Management (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 3: Star Progression & In-Game Calibration */}
          <div className="glass-panel rounded-3xl p-6 border border-[var(--border-card)] space-y-4">
            <div className="pb-3 border-b border-[var(--border-subtle)]">
              <h2 className="text-lg font-heading font-bold text-[var(--text-main)] flex items-center gap-2">
                <span>⭐ Star Progression</span>
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5 font-normal">
                Configure calculation mode & manual in-game HUD sync offsets.
              </p>
            </div>

            {/* Calculation Mode Selector */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[var(--text-main)] uppercase tracking-wider">
                Calculation Mode
              </span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => onChangeStarCountMode('cumulative')}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    starCountMode === 'cumulative'
                      ? 'bg-[var(--theme-accent-soft)] border-[var(--theme-accent)] shadow-sm'
                      : 'bg-black/5 dark:bg-black/20 border-black/10 dark:border-white/5 hover:border-[var(--border-subtle)]'
                  }`}
                >
                  <div className="text-xs font-semibold text-[var(--text-main)]">Cumulative (1★ to 5★)</div>
                  <div className="text-[11px] text-[var(--text-muted)] font-normal">Standard all-time stars earned across all tiers</div>
                </button>
                <button
                  onClick={() => onChangeStarCountMode('exact')}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    starCountMode === 'exact'
                      ? 'bg-[var(--theme-accent-soft)] border-[var(--theme-accent)] shadow-sm'
                      : 'bg-black/5 dark:bg-black/20 border-black/10 dark:border-white/5 hover:border-[var(--border-subtle)]'
                  }`}
                >
                  <div className="text-xs font-semibold text-[var(--text-main)]">Exact Active Rank</div>
                  <div className="text-[11px] text-[var(--text-muted)] font-normal">Count only routes at their current highest star milestone</div>
                </button>
                <button
                  onClick={() => onChangeStarCountMode('offset')}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    starCountMode === 'offset'
                      ? 'bg-[var(--theme-accent-soft)] border-[var(--theme-accent)] shadow-sm'
                      : 'bg-black/5 dark:bg-black/20 border-black/10 dark:border-white/5 hover:border-[var(--border-subtle)]'
                  }`}
                >
                  <div className="text-xs font-semibold text-[var(--text-main)]">HUD Calibrated (Sync Offsets)</div>
                  <div className="text-[11px] text-[var(--text-muted)] font-normal">Adds manual offsets for past/hidden event stars</div>
                </button>
              </div>
            </div>

            {/* In-Game Star Offsets Steppers */}
            <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--text-main)] uppercase tracking-wider">
                  Milestone Offsets
                </span>
                <span className="text-[10px] font-mono text-[var(--text-muted)] font-bold">
                  Total: {Object.values(starOffsets).reduce<number>((a, b) => a + Number(b || 0), 0)}
                </span>
              </div>
              <div className="space-y-1.5">
                {(
                  [
                    { key: 'ace', label: '5★ Ace', color: 'text-amber-600 dark:text-amber-400' },
                    { key: 'captain', label: '4★ Captain', color: 'text-yellow-600 dark:text-yellow-400' },
                    { key: 'expert', label: '3★ Expert', color: 'text-cyan-600 dark:text-cyan-400' },
                    { key: 'master', label: '2★ Master', color: 'text-indigo-600 dark:text-indigo-400' },
                    { key: 'specialist', label: '1★ Specialist', color: 'text-slate-600 dark:text-slate-300' },
                  ] as const
                ).map((tier) => (
                  <div
                    key={tier.key}
                    className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/5 text-xs"
                  >
                    <span className={`font-semibold ${tier.color}`}>{tier.label}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateOffset(tier.key, -1)}
                        className="w-6 h-6 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/20 flex items-center justify-center text-[var(--text-main)] border border-black/10 dark:border-white/10 transition-colors"
                        title="Decrement offset"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono font-bold text-[var(--text-main)] min-w-[24px] text-center">
                        {starOffsets[tier.key] || 0}
                      </span>
                      <button
                        onClick={() => onUpdateOffset(tier.key, 1)}
                        className="w-6 h-6 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/20 flex items-center justify-center text-[var(--text-main)] border border-black/10 dark:border-white/10 transition-colors"
                        title="Increment offset"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 4: Theme & Avionics Appearance */}
          <div className="glass-panel rounded-3xl p-6 border border-[var(--border-card)] space-y-4">
            <div className="pb-3 border-b border-[var(--border-subtle)]">
              <h2 className="text-lg font-heading font-bold text-[var(--text-main)] flex items-center gap-2">
                <Palette className="w-5 h-5 theme-accent-text" />
                <span>Cockpit Theme</span>
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5 font-normal">
                Avionics HUD color scheme & brand emblem.
              </p>
            </div>

            {/* Active Theme Preview */}
            <div className="p-3.5 rounded-2xl bg-black/25 border border-[var(--border-subtle)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl border border-black/20 dark:border-white/20 shrink-0 shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${currentTheme.bgPreview} 0%, ${currentTheme.surfacePreview} 50%, ${currentTheme.accentPreview} 100%)`,
                  }}
                />
                <div>
                  <div className="text-sm font-semibold text-[var(--text-main)]">{currentTheme.name}</div>
                  <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase font-semibold">
                    {currentTheme.tag}
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenThemeModal}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold theme-btn-accent shadow-sm"
              >
                Change
              </button>
            </div>

            {/* Brand Logo Picker Trigger */}
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-black/20 border border-[var(--border-subtle)]">
              <div>
                <div className="text-xs font-semibold text-[var(--text-main)]">Brand Emblem</div>
                <div className="text-[11px] text-[var(--text-muted)] font-normal">Custom AC-Tracker crest</div>
              </div>
              <button
                onClick={onOpenLogoModal}
                className="px-3 py-1 rounded-xl text-xs font-medium bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-main)] border border-black/10 dark:border-white/10 transition-colors"
              >
                Choose Logo
              </button>
            </div>
          </div>

          {/* Card 5: Profile & System Info */}
          <div className="glass-panel rounded-3xl p-6 border border-[var(--border-card)] space-y-4">
            <div className="pb-3 border-b border-[var(--border-subtle)]">
              <h2 className="text-lg font-heading font-bold text-[var(--text-main)] flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                <span>Pilot Profile & System</span>
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5 font-normal">
                Active pilot data and local backups.
              </p>
            </div>

            {/* Profile Info Card */}
            {activeProfile && (
              <div className="p-3.5 rounded-2xl bg-black/25 border border-[var(--border-subtle)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onOpenProfileModal}
                    title="Change profile avatar & settings"
                    aria-label="Change profile avatar & settings"
                    className="relative shrink-0 cursor-pointer group rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center p-1 border overflow-hidden transition-transform group-hover:scale-105"
                      style={{
                        borderColor: activeProfile.meta.accentColor || '#00e5ff',
                        backgroundColor: `${activeProfile.meta.accentColor || '#00e5ff'}20`,
                      }}
                    >
                      <ProfileAvatar avatar={activeProfile.meta.emoji} />
                    </div>
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-black/50"
                      style={{ backgroundColor: activeProfile.meta.accentColor || 'var(--accent)' }}
                    />
                  </button>
                  <div>
                    <div className="text-sm font-semibold text-[var(--text-main)]">
                      {activeProfile.meta.name || 'Active Pilot'}
                    </div>
                    <div className="text-xs font-mono text-[var(--text-muted)] font-medium">
                      Code: {activeProfile.meta.acCode || 'None'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={onOpenProfileModal}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold theme-btn-soft border border-[var(--border-subtle)]"
                >
                  Manage
                </button>
              </div>
            )}

            {/* Backup & Restore Hub Trigger */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={onOpenBackupModal}
                className="px-2 py-2 rounded-xl text-xs font-medium bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-main)] border border-black/10 dark:border-white/10 flex items-center justify-center gap-1.5 transition-colors"
                title="Backup and restore pilot JSON data"
              >
                <Download className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" /> Backup
              </button>
              {onOpenGettingStarted && (
                <button
                  onClick={onOpenGettingStarted}
                  className="px-2 py-2 rounded-xl text-xs font-medium bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-main)] border border-black/10 dark:border-white/10 flex items-center justify-center gap-1.5 transition-colors"
                  title="Replay Pre-Flight Briefing"
                >
                  <Plane className="w-3.5 h-3.5 text-sky-500" /> Briefing
                </button>
              )}
              <button
                onClick={onOpenWhatsNewModal}
                className="px-2 py-2 rounded-xl text-xs font-medium bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-main)] border border-black/10 dark:border-white/10 flex items-center justify-center gap-1.5 transition-colors"
                title="What's New in this release"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> What's New
              </button>
            </div>

            {/* App Version Info */}
            <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-muted)] font-mono font-medium">
              <span>{APP_VERSION}</span>
              <span>Updated: {APP_UPDATED_DATE}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
