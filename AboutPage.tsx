import React from 'react';
import { 
  Plane, 
  Compass, 
  Map as MapIcon, 
  Layers, 
  BarChart3, 
  ShieldCheck, 
  Sparkles, 
  HelpCircle, 
  Database, 
  Keyboard, 
  Palette,
  ExternalLink
} from 'lucide-react';
import { APP_VERSION, APP_UPDATED_DATE } from './index';

interface AboutPageProps {
  onNavigate: (view: 'list' | 'maps' | 'airplanes' | 'stats') => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-[var(--border-card)] shadow-xl">
        <div
          className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: 'var(--accent)' }}
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl theme-badge flex items-center justify-center shadow-inner shrink-0 p-2 overflow-hidden">
              <img src="Map-icons/standard_icon.png" alt="ACT" className="w-11 h-11 object-contain drop-shadow" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold theme-btn-accent shadow-sm">
                  {APP_VERSION}
                </span>
                <span className="text-xs text-[var(--text-muted)] font-mono">
                  Updated: {APP_UPDATED_DATE}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-main)] font-heading">
                About ACT
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5 font-normal">
                Airport City Tracker — Operations Hub & Flight Mastery Companion by Soupha
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Card */}
      <div className="glass-panel rounded-3xl p-6 border border-[var(--border-card)] space-y-3">
        <h2 className="text-base font-semibold text-[var(--text-main)] font-heading flex items-center gap-2">
          <Sparkles className="w-4 h-4 theme-accent-text" /> What is AC-Tracker?
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-normal">
          <strong className="text-[var(--text-main)]">AC-Tracker (ACT)</strong> is a companion application created specifically for Airport City pilots. It replaces bulky spreadsheets and notes with an interactive cockpit to track flight quotas, star progressions, map stocks, and fleet properties with maximum speed and clarity.
        </p>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Flights */}
        <div 
          onClick={() => onNavigate('list')}
          className="glass-card rounded-2xl p-5 border border-[var(--border-card)] hover:border-[var(--border-active)] transition-all cursor-pointer group space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-[var(--text-main)] flex items-center gap-2 font-heading">
              <Compass className="w-4 h-4 theme-accent-text" /> Flights
            </span>
            <span className="text-[11px] font-mono text-[var(--text-muted)] group-hover:text-white transition-colors">
              Open &rarr;
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] font-normal leading-relaxed">
            The core flight operations deck. View destinations in High-Density Table or Card layouts. Features instant click-to-type number inputs, tactile increment scrubbers, and category filtering.
          </p>
        </div>

        {/* Maps */}
        <div 
          onClick={() => onNavigate('maps')}
          className="glass-card rounded-2xl p-5 border border-[var(--border-card)] hover:border-[var(--border-active)] transition-all cursor-pointer group space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-[var(--text-main)] flex items-center gap-2 font-heading">
              <MapIcon className="w-4 h-4 theme-accent-text" /> Maps
            </span>
            <span className="text-[11px] font-mono text-[var(--text-muted)] group-hover:text-white transition-colors">
              Open &rarr;
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] font-normal leading-relaxed">
            Dedicated collection depot for all 148 adventure, alliance, and space flight destinations. Tracks map inventory with single-click stock increments and depleted map identification.
          </p>
        </div>

        {/* Aircraft */}
        <div 
          onClick={() => onNavigate('airplanes')}
          className="glass-card rounded-2xl p-5 border border-[var(--border-card)] hover:border-[var(--border-active)] transition-all cursor-pointer group space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-[var(--text-main)] flex items-center gap-2 font-heading">
              <Layers className="w-4 h-4 theme-accent-text" /> Aircraft
            </span>
            <span className="text-[11px] font-mono text-[var(--text-muted)] group-hover:text-white transition-colors">
              Open &rarr;
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] font-normal leading-relaxed">
            Fleet hangar collection manager. Commission and name your aircraft across all 14 classes, with interactive 5% step sliders to tune Speed, Profit, and Drop chance modifiers.
          </p>
        </div>

        {/* Stats */}
        <div 
          onClick={() => onNavigate('stats')}
          className="glass-card rounded-2xl p-5 border border-[var(--border-card)] hover:border-[var(--border-active)] transition-all cursor-pointer group space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-[var(--text-main)] flex items-center gap-2 font-heading">
              <BarChart3 className="w-4 h-4 theme-accent-text" /> Stats
            </span>
            <span className="text-[11px] font-mono text-[var(--text-muted)] group-hover:text-white transition-colors">
              Open &rarr;
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] font-normal leading-relaxed">
            Comprehensive analytics suite with mastery star distribution, flight completion gauges, airline pilot rank progression, and JSON/CSV backup dispatch.
          </p>
        </div>
      </div>

      {/* Tips & Privacy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tips */}
        <div className="glass-panel rounded-2xl p-5 border border-[var(--border-card)] space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
            <Keyboard className="w-4 h-4 theme-accent-text" /> Cockpit Shortcuts & Ergonomics
          </h3>
          <ul className="text-xs text-[var(--text-muted)] space-y-2 font-normal">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>Click-to-Type</strong>: Clicking any flight or map count auto-selects the number so you can type immediately without backspacing.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>Arrow Keys</strong>: While focused on a number field, press <kbd className="px-1.5 py-0.5 rounded bg-black/40 font-mono text-[10px]">Up</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-black/40 font-mono text-[10px]">Down</kbd> to increment or decrement.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>First Class Suite</strong>: Choose from 13 bespoke airport palettes (Dark & Light) from the top-right theme picker.</span>
            </li>
          </ul>
        </div>

        {/* Privacy & Storage */}
        <div className="glass-panel rounded-2xl p-5 border border-[var(--border-card)] space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Offline Storage & Backups
          </h3>
          <p className="text-xs text-[var(--text-muted)] font-normal leading-relaxed">
            ACT is 100% client-side and privacy-respecting. All flight logs, map stocks, and aircraft records are stored locally in your browser's <code className="px-1.5 py-0.5 rounded bg-black/40 font-mono text-[10px] text-white/90">localStorage</code>.
          </p>
          <p className="text-xs text-[var(--text-muted)] font-normal leading-relaxed">
            Use the <strong className="text-[var(--text-main)]">Data</strong> tool in the top header anytime to export a full JSON backup or transfer your flight progress to another device.
          </p>
        </div>
      </div>
    </div>
  );
};
