import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Keyboard, 
  ExternalLink,
  Globe,
  User,
  Layers,
  Copy
} from 'lucide-react';
import { APP_VERSION, APP_UPDATED_DATE } from './index';

interface AboutPageProps {
  onNavigate?: (view: 'list' | 'maps' | 'airplanes' | 'stats') => void;
  onOpenLogoModal?: () => void;
  onOpenWhatsNew?: () => void;
  activeLogoId?: string;
  onSelectLogo?: (id: string) => void;
}


export interface PilotResource {
  title: string;
  url: string;
  category: string;
  description: string;
  badge?: string;
  domain?: string;
  icon?: string;
}

export const COMMUNITY_RESOURCES: PilotResource[] = [
  {
    title: 'Airport City Wiki',
    url: 'https://www.airportcitygame.com/wiki/',
    category: 'Wiki & Database',
    description: 'Comprehensive community encyclopedia, flight requirements, building specs, and quest guides.',
    badge: 'Official Wiki',
    domain: 'airportcitygame.com',
    icon: 'icons/resource-wiki-3d.png',
  },
  {
    title: 'Airport City Game Forums',
    url: 'https://www.airportcitygame.com/',
    category: 'Community & Forums',
    description: 'The premier player community forum covering trading, neighbor codes, flight tips, space launches, alliances, and game strategies.',
    badge: 'Player Forums',
    domain: 'airportcitygame.com',
    icon: 'icons/resource-forums-3d.png',
  },
  {
    title: 'Airport City Official Facebook',
    url: 'https://www.facebook.com/AirportCity',
    category: 'Bonuses & Giveaways',
    description: 'Official page featuring weekly bonus codes, gift giveaways, game updates, and community events.',
    badge: 'Weekly Codes',
    domain: 'facebook.com',
    icon: 'icons/resource-facebook-3d.png',
  },
  {
    title: 'Game Insight Help & FAQ',
    url: 'https://gameinsight.helpshift.com/hc/en/16-airport-city/',
    category: 'Official Support',
    description: "The developer's official help desk, troubleshooting guides, account recovery, bug reports, and game FAQs.",
    badge: 'Developer Support',
    domain: 'gameinsight.helpshift.com',
    icon: 'icons/resource-support-3d.png',
  },
  {
    title: 'World Destinations Interactive Map',
    url: 'https://www.google.com/maps/d/u/0/viewer?hl=en&mid=1MY3JDc6Lr2XaTiP9RC7GzVcJDuOhyvQv&ll=-10.398846696943707%2C-71.04663895648017&z=5',
    category: 'Interactive Maps',
    description: 'Interactive Google Map plotting all Airport City flight destinations worldwide across all continents.',
    badge: 'Google Maps',
    domain: 'google.com/maps',
    icon: 'icons/resource-worldmap-3d.png',
  },
];

export const AboutPage: React.FC<AboutPageProps> = ({
  onOpenWhatsNew,
}) => {
  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-[var(--border-card)] shadow-xl">
        <div
          className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: 'var(--accent)' }}
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5 sm:gap-6">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl theme-badge flex items-center justify-center shadow-2xl shrink-0 p-1 sm:p-1.5 border border-white/10 group">
              <img src="icons/deck-resources-3d.png" alt="AC - Tracker : Help and Resources" className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <button
                  type="button"
                  onClick={onOpenWhatsNew}
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold theme-btn-accent shadow-sm hover:scale-105 transition-transform cursor-pointer"
                  title="View What's New in this release"
                >
                  {APP_VERSION}
                </button>
                <span className="text-xs text-[var(--text-muted)] font-mono">
                  Updated: {APP_UPDATED_DATE}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-main)] font-heading">
                AC - Tracker : Help and Resources
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 font-normal">
                How to use the App and where to find other resources to help you advance in the game.
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

      {/* Multi-Profile Command Feature Showcase */}
      <div className="glass-panel rounded-3xl p-6 border border-[var(--accent)]/30 space-y-4 relative overflow-hidden bg-gradient-to-r from-[var(--bg-card)] to-[var(--bg-surface)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/15 border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[var(--text-main)] font-heading flex items-center gap-2">
                Multi-Profile Pilot Command
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  NEW in v2.1
                </span>
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Manage multiple Airport City game accounts
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
          <div className="p-4 rounded-2xl bg-black/25 border border-white/5 space-y-1.5">
            <div className="text-xs font-semibold text-[var(--text-main)] flex items-center gap-1.5">
              <span>✈️</span> Instant Account Switching
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed font-normal">
              Click your callsign in the top navigation header anytime to switch profiles in a single click. Flight records, map inventory, hangar fleet, and themes swap immediately without page reloads.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/25 border border-white/5 space-y-1.5">
            <div className="text-xs font-semibold text-[var(--text-main)] flex items-center gap-1.5">
              <span>🆔</span> Callsigns & In-Game Codes
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed font-normal">
              Assign bespoke pilot names, avatar emojis, glowing accent tags, and your authentic 9-character Airport City friend code for quick reference.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/25 border border-white/5 space-y-1.5">
            <div className="text-xs font-semibold text-[var(--text-main)] flex items-center gap-1.5">
              <span>💾</span> Export, Backup & Safe Reset
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed font-normal">
              Export individual profile JSON snapshots, download a full multi-profile master backup, or safely reset your active profile from the <strong>Data</strong> hub.
            </p>
          </div>
        </div>
      </div>

      {/* Tips & Privacy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tips */}
        <div className="glass-panel rounded-2xl p-5 border border-[var(--border-card)] space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
            <Keyboard className="w-4 h-4 theme-accent-text" /> Keyboard shortcuts, Usage tips
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
              <span><strong>First Class Suite</strong>: Choose from 23 bespoke airport palettes (Dark & Light) from the top-right theme picker, saved independently per profile.</span>
            </li>
          </ul>
        </div>

        {/* Privacy & Storage */}
        <div className="glass-panel rounded-2xl p-5 border border-[var(--border-card)] space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Offline Storage & Backups
          </h3>
          <p className="text-xs text-[var(--text-muted)] font-normal leading-relaxed">
            ACT is 100% client-side and privacy-respecting. All flight logs, map stocks, aircraft records, and profile settings are stored locally in your browser's <code className="px-1.5 py-0.5 rounded bg-black/40 font-mono text-[10px] text-[var(--text-main)]">localStorage</code> under the clean <code className="px-1.5 py-0.5 rounded bg-black/40 font-mono text-[10px] theme-accent-text">act_</code> namespace.
          </p>
          <p className="text-xs text-[var(--text-muted)] font-normal leading-relaxed">
            Use the <strong className="text-[var(--text-main)]">Data</strong> tool in the top header anytime to export a single profile, download an all-profiles master backup, or restore previous JSON logs.
          </p>
        </div>
      </div>

      {/* Flight Resources & Community Links */}
      <div className="glass-panel rounded-3xl p-6 border border-[var(--border-card)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
          <div>
            <h2 className="text-base font-semibold text-[var(--text-main)] font-heading flex items-center gap-2">
              <Globe className="w-4 h-4 theme-accent-text" /> Flight Resources & Community Links
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5 font-normal">
              Essential knowledge bases, wikis, and reference hubs for Airport City pilots.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {COMMUNITY_RESOURCES.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card rounded-2xl p-4 sm:p-5 border border-[var(--border-card)] hover:border-[var(--border-active)] hover:bg-white/[0.03] transition-all group flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden"
            >
              <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl theme-badge flex items-center justify-center shrink-0 border border-white/10 group-hover:scale-110 transition-transform shadow-lg p-1 overflow-hidden">
                  {link.icon ? (
                    <img src={link.icon} alt={link.title} className="w-full h-full object-contain drop-shadow-md" />
                  ) : (
                    <Globe className="w-5 h-5 theme-accent-text shrink-0" />
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm sm:text-base text-[var(--text-main)] font-heading group-hover:text-white transition-colors">
                      {link.title}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold theme-btn-accent shadow-sm">
                      {link.category}
                    </span>
                    {link.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-[var(--text-muted)] bg-white/5 border border-white/10">
                        {link.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-muted)] font-normal leading-relaxed">
                    {link.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-3.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-muted)]">
                <span className="truncate max-w-[180px] text-[var(--text-muted)]">{link.domain || link.url}</span>
                <span className="px-3.5 py-1.5 rounded-xl border border-[var(--border-subtle)] group-hover:border-[var(--border-active)] group-hover:bg-white/5 text-xs font-medium theme-accent-text flex items-center gap-1.5 transition-all">
                  Open Link
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Star Count FAQ Block */}
      <div className="bg-slate-900/50 border border-cyan-500/30 rounded-xl p-6 space-y-3 relative overflow-hidden backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[var(--text-main)] font-heading">
              Why is my star count wrong?
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Important guidance regarding seasonal and limited-time event destinations
            </p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-normal pt-1">
          Because you don't have access to the flight numbers from the event destinations outside of the event duration, you have no way of knowing those numbers and cannot accurately input them into AC-Tracker. Please note that it's important to note down all the flight numbers from the event before the event timer runs out.
        </p>
      </div>
    </div>
  );
};
