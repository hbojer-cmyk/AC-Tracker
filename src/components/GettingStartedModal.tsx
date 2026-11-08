import React, { useState, useEffect, useCallback } from 'react';
import {
  Plane,
  X,
  Palette,
  Layers,
  SlidersHorizontal,
  Compass,
  ShieldCheck,
  Rocket,
  ChevronRight,
  ChevronLeft,
  Check,
  Star,
  Map as MapIcon,
  Calendar,
  Sparkles,
  Trophy
} from 'lucide-react';
import { EnabledViewsConfig } from '../../profiles';

export interface GettingStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTheme: string;
  onSelectTheme: (themeId: string) => void;
  enabledViews: EnabledViewsConfig;
  onToggleView: (key: keyof EnabledViewsConfig) => void;
}

interface PopularThemeOption {
  id: string;
  name: string;
  category: string;
  previewBg: string;
  previewBorder: string;
  previewAccent: string;
}

const POPULAR_THEMES: PopularThemeOption[] = [
  {
    id: 'stealth-ghost',
    name: 'Stealth Ghost',
    category: 'Cyber Dark (Default)',
    previewBg: '#090d16',
    previewBorder: 'rgba(56, 189, 248, 0.4)',
    previewAccent: '#38bdf8',
  },
  {
    id: 'mach-blue',
    name: 'Mach 3 Stratosphere',
    category: 'Deep Space Blue',
    previewBg: '#0b1d3a',
    previewBorder: '#2563eb',
    previewAccent: '#60a5fa',
  },
  {
    id: 'blackbird',
    name: 'Blackbird OLED',
    category: 'Pure OLED Amber',
    previewBg: '#000000',
    previewBorder: '#d97706',
    previewAccent: '#fbbf24',
  },
  {
    id: 'botanical-garden',
    name: 'Botanical Garden',
    category: 'Daylight Emerald',
    previewBg: '#f0fdf4',
    previewBorder: '#22c55e',
    previewAccent: '#166534',
  },
  {
    id: 'first-class',
    name: 'First Class Suite',
    category: 'Daylight Champagne',
    previewBg: '#fffbeb',
    previewBorder: '#f59e0b',
    previewAccent: '#92400e',
  },
];

export const GettingStartedModal: React.FC<GettingStartedModalProps> = ({
  isOpen,
  onClose,
  activeTheme,
  onSelectTheme,
  enabledViews,
  onToggleView,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 6;

  // Demo scrubber state on Slide 2
  const [demoFlightCount, setDemoFlightCount] = useState<number>(49);
  const demoTarget = 300;

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        setCurrentSlide(prev => Math.min(totalSlides - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide(prev => Math.max(0, prev - 1));
      }
    },
    [isOpen, onClose, totalSlides]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const demoProgressPct = Math.min(100, Math.round((demoFlightCount / demoTarget) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl glass-panel rounded-3xl border border-[var(--border-card)] shadow-2xl flex flex-col overflow-hidden max-h-[92vh] bg-[var(--bg-card)] text-[var(--text-main)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-white/10 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/15 border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] shrink-0">
              <Plane className="w-5 h-5 transform -rotate-45" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-heading text-[var(--text-main)] truncate">
                  Pilot Onboarding Briefing
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30">
                  Pre-Flight
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] truncate">
                Welcome to AC-Tracker • 6-step flight orientation guide
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono font-medium text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-all flex items-center gap-1 shrink-0"
            title="Skip or Close Briefing"
          >
            <X className="w-3.5 h-3.5" />
            <span>Skip</span>
          </button>
        </div>

        {/* Step Tabs Navigation */}
        <div className="flex border-b border-white/10 bg-black/30 overflow-x-auto no-scrollbar">
          {[
            { label: 'Eye Comfort', step: 1 },
            { label: 'Log As You Fly', step: 2 },
            { label: 'Clean Cockpit', step: 3 },
            { label: 'Categories', step: 4 },
            { label: 'Backups', step: 5 },
            { label: 'Radar & Stats', step: 6 },
          ].map((item, idx) => {
            const isActive = currentSlide === idx;
            return (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`flex-1 min-w-[95px] sm:min-w-[110px] py-2.5 px-2 text-center border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--text-main)] font-semibold'
                    : 'border-transparent text-[var(--text-muted)] hover:bg-white/5'
                }`}
              >
                <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  Step {item.step}
                </div>
                <div className={`text-xs truncate ${isActive ? 'text-[var(--text-main)]' : ''}`}>
                  {item.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Slide Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 min-h-[320px]">
          {/* SLIDE 1: Eye Comfort */}
          {currentSlide === 0 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
                <Palette className="w-4 h-4" />
                <span>Step 1 of 6 • Visual Ergonomics</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-heading text-[var(--text-main)]">
                Choose a Theme That's Easy on Your Eyes
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Airport City flight tracking can involve long sessions. AC-Tracker features 23 authentic themes, from deep dark OLED glass to high-contrast daylight palettes. Pick a starting aesthetic you enjoy:
              </p>

              <div className="p-4 rounded-2xl bg-black/20 border border-[var(--border-card)] space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent)] font-bold">
                  Tap to Preview a Theme Live:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {POPULAR_THEMES.map(t => {
                    const isSelected = activeTheme === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => onSelectTheme(t.id)}
                        className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${
                          isSelected
                            ? 'border-[var(--accent)] bg-[var(--accent)]/15 shadow-md ring-1 ring-[var(--accent)]/50'
                            : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <div
                          className="w-full h-7 rounded-lg mb-2 flex items-center justify-center text-xs font-bold border"
                          style={{
                            backgroundColor: t.previewBg,
                            borderColor: t.previewBorder,
                            color: t.previewAccent,
                          }}
                        >
                          {t.name.split(' ')[0]}
                        </div>
                        <div className="text-xs font-bold text-[var(--text-main)] truncate">
                          {t.name}
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)] truncate">
                          {t.category}
                        </div>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[var(--accent)] text-black flex items-center justify-center text-[10px] font-bold">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-[var(--text-muted)] text-center pt-1">
                  You can change themes anytime via the palette icon (🎨) in the top navigation bar.
                </p>
              </div>
            </div>
          )}

          {/* SLIDE 2: Log As You Fly */}
          {currentSlide === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
                <Plane className="w-4 h-4" />
                <span>Step 2 of 6 • Flight Deck Mechanics</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-heading text-[var(--text-main)]">
                Don't Panic: Log As You Fly, Not All at Once
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                AC-Tracker catalogs all 536 destinations in Airport City. <strong>You do not need to transcribe 500 routes right now!</strong>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-black/20 border border-[var(--border-card)] space-y-1.5">
                  <div className="text-xs font-bold font-heading text-[var(--text-main)] flex items-center gap-1.5">
                    <span>📍</span> Start With What's Flying
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Check your in-game fleet right now. Use the search bar to find just those 2 or 3 active destinations.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/20 border border-[var(--border-card)] space-y-1.5">
                  <div className="text-xs font-bold font-heading text-[var(--text-main)] flex items-center gap-1.5">
                    <span>⭐</span> In-Game Scrubber Alignment
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Enter the exact flight count shown in your game on your <em>current star</em> (e.g. <code>49 / 300</code>).
                  </p>
                </div>
              </div>

              {/* Interactive Demo Scrubber */}
              <div className="p-4 rounded-2xl bg-black/30 border border-dashed border-[var(--accent)]/40 space-y-2">
                <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent)] font-bold text-center">
                  Try the Interactive Flight Scrubber Demo:
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 py-2">
                  <span className="text-xs font-semibold text-[var(--text-muted)]">Rome (Owl):</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setDemoFlightCount(prev => Math.max(0, prev - 10))}
                      className="w-7 h-7 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold font-mono"
                    >
                      -10
                    </button>
                    <input
                      type="number"
                      value={demoFlightCount}
                      onChange={e => setDemoFlightCount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-20 px-2 py-1 text-center font-mono text-sm font-bold rounded-lg border border-[var(--accent)] bg-black/50 text-[var(--text-main)] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setDemoFlightCount(prev => prev + 10)}
                      className="w-7 h-7 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold font-mono"
                    >
                      +10
                    </button>
                  </div>
                  <span className="text-xs font-bold font-mono text-[var(--accent)]">
                    / {demoTarget} Flights
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30">
                    ⭐ 2★ Master ({demoProgressPct}%)
                  </span>
                </div>
                {/* Visual Progress Bar */}
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-[var(--accent)] transition-all duration-300"
                    style={{ width: `${demoProgressPct}%` }}
                  />
                </div>
                <p className="text-[11px] text-[var(--text-muted)] text-center">
                  Notice how typing what's on your game screen calculates star rank and completion percentages automatically!
                </p>
              </div>
            </div>
          )}

          {/* SLIDE 3: Streamline Your Cockpit */}
          {currentSlide === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Step 3 of 6 • Clean Navigation</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-heading text-[var(--text-main)]">
                Streamline Your Cockpit (Hide Unused Modules)
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                If the top navigation bar feels crowded with tabs you don't need right now (like the Map Depot, Fleet Hangar, or Missions), you can hide them instantly:
              </p>

              <div className="p-4 rounded-2xl bg-black/20 border border-[var(--border-card)] space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent)] font-bold">
                  Toggle Navigation Modules:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { key: 'maps' as const, label: 'Map Depot', icon: MapIcon, desc: 'Map inventory & drop tracking' },
                    { key: 'airplanes' as const, label: 'Fleet Hangar', icon: Plane, desc: 'Aircraft fleet management' },
                    { key: 'missions' as const, label: 'Missions Depot', icon: Trophy, desc: '21 prize landmark stockpiling' },
                    { key: 'events' as const, label: '12-Month Calendar', icon: Calendar, desc: 'Seasonal event schedule' },
                  ].map(mod => {
                    const isEnabled = enabledViews[mod.key];
                    const Icon = mod.icon;
                    return (
                      <div
                        key={mod.key}
                        onClick={() => onToggleView(mod.key)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isEnabled
                            ? 'border-white/15 bg-white/5 hover:bg-white/10'
                            : 'border-white/5 bg-black/20 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className="w-4 h-4 text-[var(--accent)] shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-[var(--text-main)] truncate">
                              {mod.label}
                            </div>
                            <div className="text-[10px] text-[var(--text-muted)] truncate">
                              {mod.desc}
                            </div>
                          </div>
                        </div>
                        {/* Toggle switch visual */}
                        <div
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors relative shrink-0 ${
                            isEnabled ? 'bg-[var(--accent)]' : 'bg-white/20'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform ${
                              isEnabled ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-[var(--text-muted)] text-center pt-1">
                  You can re-enable or customize any view at any time from <strong>Settings & Avionics (⚙️)</strong>.
                </p>
              </div>
            </div>
          )}

          {/* SLIDE 4: Categories & Sidebar */}
          {currentSlide === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
                <Compass className="w-4 h-4" />
                <span>Step 4 of 6 • Focused Progression</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-heading text-[var(--text-main)]">
                Track One Category at a Time & Toggle Drawer
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Breaking down 536 destinations into focused flight categories helps you make steady, manageable progress.
              </p>

              <div className="space-y-2.5 pt-1">
                <div className="p-3.5 rounded-2xl bg-black/20 border border-[var(--border-card)] flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/15 border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] shrink-0 mt-0.5">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-[var(--text-main)]">
                      Use the Left Category Sidebar
                    </div>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      Click categories like <em>Regular Flights</em>, <em>Adventure Maps</em>, or <em>Space Launches</em> to filter out everything else. Each shows your star completion ratio at a glance.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/20 border border-[var(--border-card)] flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/15 border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] shrink-0 mt-0.5">
                    <ChevronLeft className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-[var(--text-main)]">
                      Collapse the Sidebar When Needed
                    </div>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      Need maximum table width for split-screen monitoring? Click the <code>[ &lt; ]</code> arrow button at the top of the category drawer to fold it away.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/20 border border-[var(--border-card)] flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/15 border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-[var(--text-main)]">
                      Recently Flown Quick-Jump Strip
                    </div>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      As soon as you log a flight, a quick chip appears right above the table with a one-click <code>+1</code> button for instantaneous logging on your next landing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 5: Safe Pilot Habits (Backups) */}
          {currentSlide === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
                <ShieldCheck className="w-4 h-4" />
                <span>Step 5 of 6 • Data Protection</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-heading text-[var(--text-main)]">
                Safeguard Your Progress: Build the Backup Habit
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Your flight records, hangar fleet, and telemetry are stored 100% locally on your browser for instant speed and privacy.
              </p>

              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  <span>Export Profile Backups (JSON)</span>
                </div>
                <p className="text-xs text-[var(--text-main)] leading-relaxed">
                  Web browsers can occasionally clear website caches when device storage is full. Safeguard your progress by backing up your pilot profile periodically.
                </p>
                <div className="p-3 rounded-xl bg-black/30 border border-white/10 space-y-1.5 text-xs">
                  <div className="font-mono text-[var(--accent)] font-semibold">
                    How to Export in 2 Clicks:
                  </div>
                  <div className="text-[var(--text-muted)]">
                    1. Click your <strong>Pilot Profile Avatar</strong> (top right utility bar).<br />
                    2. Click <strong>"Backup Profile (JSON)"</strong> to download your flight file.
                  </div>
                </div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  You can import your backup file on any other computer, iPad, or mobile phone to restore everything immediately!
                </p>
              </div>
            </div>
          )}

          {/* SLIDE 6: Radar & Secret Weapons */}
          {currentSlide === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
                <Rocket className="w-4 h-4" />
                <span>Step 6 of 6 • Secret Weapons</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-heading text-[var(--text-main)]">
                Secret Weapons: Telemetry & Smart Radar
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Once you start logging flights, AC-Tracker unlocks high-value analytics to accelerate your game progression:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-black/20 border border-[var(--border-card)] space-y-1.5">
                  <div className="text-xs font-bold font-heading text-[var(--text-main)] flex items-center gap-1.5">
                    <span>🎯</span> Lowest Hanging Fruit
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Radar on the Stats page highlights the Top 5 destinations closest to reaching your next star milestone.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/20 border border-[var(--border-card)] space-y-1.5">
                  <div className="text-xs font-bold font-heading text-[var(--text-main)] flex items-center gap-1.5">
                    <span>🗺️</span> Missing Maps Radar
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Detect flights grounded by 0 maps or routes you can run immediately with existing inventory stock.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/20 border border-[var(--border-card)] space-y-1.5">
                  <div className="text-xs font-bold font-heading text-[var(--text-main)] flex items-center gap-1.5">
                    <span>⭐</span> Star Sync Offsets
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Match your in-game profile stars exactly, including historical retired events no longer in rotation.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-center">
                <p className="text-xs font-semibold text-[var(--text-main)]">
                  You are cleared for takeoff, Pilot! Enjoy tracking your Airport City fleet.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-t border-white/10 bg-black/30 flex items-center justify-between">
          {/* Dot Indicators */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Jump to step ${idx + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx
                    ? 'w-6 bg-[var(--accent)]'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          {/* Previous / Next / Enter Cockpit Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`px-3.5 py-1.5 rounded-xl border border-white/10 text-xs font-mono font-medium transition-all flex items-center gap-1 ${
                currentSlide === 0
                  ? 'opacity-30 cursor-not-allowed'
                  : 'hover:bg-white/10 text-[var(--text-main)]'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            {currentSlide === totalSlides - 1 ? (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all flex items-center gap-1.5"
              >
                <span>Enter Cockpit</span>
                <Rocket className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={nextSlide}
                className="px-4 py-1.5 rounded-xl text-xs font-mono font-bold bg-[var(--accent)] hover:opacity-90 text-black shadow-md transition-all flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
