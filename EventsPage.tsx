import React from 'react';
import { ExternalLink, ArrowRight, Info } from 'lucide-react';
import { EVENTS_CALENDAR, MonthCalendarData } from './src/data/eventsData';

interface EventsPageProps {
  onNavigateToFlightsWithEvent?: (eventKeyword: string) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({
  onNavigateToFlightsWithEvent,
}) => {
  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Banner - Theme-Aware Glass Panel */}
      <div className="glass-panel rounded-2xl px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl relative overflow-hidden border border-[var(--border-card)]">
        <div
          className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: 'var(--accent)' }}
        />
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)] font-heading">
            Event Calendar
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 font-normal">
            Click the links for walkthroughs from the Airport City Forum Wiki.
          </p>
        </div>

        <div className="shrink-0 flex items-center relative z-10">
          <a
            href="https://www.airportcitygame.com/wiki/events/"
            target="_blank"
            rel="noopener noreferrer"
            className="tactile-btn px-4 py-2.5 rounded-xl border border-[var(--border-card)] hover:border-[var(--border-active)] text-xs font-semibold flex items-center gap-2 transition-all shadow-md group theme-btn-soft"
          >
            <span>Airport City Events Wiki</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Theme-Aware Historical Disclaimer Callout */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 flex items-start sm:items-center gap-3.5 shadow-md relative overflow-hidden border border-[var(--border-card)]">
        <div className="w-8 h-8 rounded-xl theme-badge flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
          <Info className="w-4 h-4 theme-accent-text" />
        </div>
        <div className="text-xs text-[var(--text-muted)] leading-relaxed flex-1">
          <span className="font-semibold theme-accent-text mr-1.5 uppercase tracking-wide text-[11px] font-mono">
            Timeline Disclaimer:
          </span>
          This calendar is based on recurring historical event rotations and official community wiki archives. Exact event dates and schedules may vary month to month, but each newly announced in-game event will be updated in AC-Tracker as soon as it goes live.
        </div>
      </div>

      {/* 12-Month Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EVENTS_CALENDAR.map((month: MonthCalendarData) => {
          return (
            <div
              key={month.monthNumber}
              className="month-card glass-panel rounded-3xl border border-[var(--border-card)] hover:border-[var(--border-active)] overflow-hidden shadow-xl flex flex-col transition-all group"
            >
              {/* a. Top Bar: Dedicated header bar above the image containing ONLY the uppercase month name */}
              <div className="bg-black/10 dark:bg-black/30 border-b border-[var(--border-subtle)] px-5 py-3.5 flex items-center justify-between">
                <h2 className="text-base font-bold text-[var(--text-main)] font-heading tracking-wider uppercase">
                  {month.monthName}
                </h2>
                <div
                  className="w-2.5 h-2.5 rounded-full shadow-sm"
                  style={{ backgroundColor: month.themeAccent, boxShadow: `0 0 8px ${month.themeAccent}` }}
                  title={month.themeAccent}
                />
              </div>

              {/* b. Full 2:1 Banner Image: uncropped, 100% visible, not covered by text or gradients */}
              <div className="w-full aspect-[2/1] bg-black/20 dark:bg-black/60 overflow-hidden relative">
                <img
                  src={month.bannerImage}
                  alt={`${month.monthName} Event Banner`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src.indexOf('icons/calendar/10.jpg') === -1) {
                      target.src = 'icons/calendar/10.jpg';
                    }
                  }}
                />
              </div>

              {/* Events List for Month */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
                <div className="space-y-3">
                  {month.events.map((evt, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-black/15 dark:bg-black/40 border border-[var(--border-subtle)] hover:border-[var(--border-active)] transition-all flex flex-col space-y-2.5 shadow-sm"
                    >
                      {/* Title & Wiki Link Icon at top-right */}
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-sm text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors">
                          {evt.title}
                        </span>
                        <a
                          href={evt.wikiUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-lg theme-accent-text opacity-80 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 transition-all shrink-0"
                          title="Open Wiki Walkthrough"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      <p className="text-xs text-[var(--text-muted)] leading-relaxed font-normal">
                        {evt.description}
                      </p>

                      {/* Clean and theme-adaptive metadata pills */}
                      {evt.badges && evt.badges.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {evt.badges.map((b, bIdx) => (
                            <span
                              key={bIdx}
                              className="theme-badge px-2.5 py-0.5 rounded-md text-[10px] font-mono"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* View Event Flights Action Button */}
                      <div className="pt-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => onNavigateToFlightsWithEvent?.(evt.filterKeyword || evt.title)}
                          className="tactile-btn text-xs font-medium theme-btn-soft px-3 py-1 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
                        >
                          <span>View Event Flights</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
