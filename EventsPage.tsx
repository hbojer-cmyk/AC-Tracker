import React from 'react';
import { ExternalLink, ArrowRight, Info } from 'lucide-react';
import { EVENTS_CALENDAR, ACTIVE_EVENT_CONFIG, MonthCalendarData, getEventIcon } from './src/data/eventsData';

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
            className="tactile-btn px-4 py-2.5 rounded-xl border border-[var(--border-card)] hover:border-[var(--border-active)] text-xs font-semibold flex items-center gap-2 transition-all shadow-md group event-action-btn"
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
              className="month-card rounded-3xl border border-black/[0.08] dark:border-white/[0.08] hover:border-[var(--border-active)] overflow-hidden shadow-xl flex flex-col transition-all group"
            >
              {/* Top Banner Image: uncropped, 100% visible, sits cleanly at top of card (month name artwork already included) */}
              <div className="w-full aspect-[2/1] bg-slate-100 dark:bg-[#070c14] overflow-hidden relative border-b border-black/[0.06] dark:border-white/[0.08]">
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
                  {month.events.map((evt, idx) => {
                    const isLiveActive = Boolean(
                      ACTIVE_EVENT_CONFIG?.eventName?.trim() &&
                      (() => {
                        if (!ACTIVE_EVENT_CONFIG.startDate || !ACTIVE_EVENT_CONFIG.endDate) return false;
                        const now = Date.now();
                        const startD = new Date(
                          ACTIVE_EVENT_CONFIG.startDate.includes('T')
                            ? ACTIVE_EVENT_CONFIG.startDate
                            : ACTIVE_EVENT_CONFIG.startDate + 'T00:00:00'
                        );
                        const endD = new Date(
                          ACTIVE_EVENT_CONFIG.endDate.includes('T')
                            ? ACTIVE_EVENT_CONFIG.endDate
                            : ACTIVE_EVENT_CONFIG.endDate + 'T23:59:59'
                        );
                        return now >= startD.getTime() && now <= endD.getTime();
                      })() &&
                      (evt.filterKeyword === ACTIVE_EVENT_CONFIG.filterKeyword ||
                        evt.title.toLowerCase() === ACTIVE_EVENT_CONFIG.eventName.toLowerCase())
                    );

                    return (
                      <div
                        key={idx}
                        className={`event-sub-card p-3.5 rounded-2xl flex flex-col space-y-2.5 shadow-sm transition-all ${
                          isLiveActive
                            ? 'border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)] bg-cyan-500/5'
                            : ''
                        }`}
                      >
                        {/* Title & Wiki Link Icon at top-right */}
                        <div className="flex items-start justify-between gap-2.5">
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            {/* Event Icon badge */}
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#0b1320] p-1 flex items-center justify-center shrink-0 border border-black/5 dark:border-cyan-500/20">
                              <img
                                src={getEventIcon(evt.title)}
                                alt={evt.title}
                                className="w-full h-full object-contain drop-shadow-sm"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  if (target.src.indexOf('icons/event_icon.png') === -1) {
                                    target.src = 'icons/event_icon.png';
                                  }
                                }}
                              />
                            </div>
                            <div className="flex items-center gap-2 flex-wrap min-w-0">
                              <span className="event-title text-sm tracking-tight font-bold">
                                {evt.title}
                              </span>
                              {isLiveActive && (
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-300 px-2 py-0.5 rounded-full bg-cyan-100/90 dark:bg-cyan-950/90 border border-cyan-400/50 shadow-sm">
                                  <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                                  </span>
                                  Active Now
                                </span>
                              )}
                            </div>
                          </div>
                          <a
                            href={evt.wikiUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-lg text-slate-500 hover:text-[var(--border-active)] dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-all shrink-0"
                            title="Open Wiki Walkthrough"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>

                        <p className="event-desc text-xs leading-relaxed font-normal">
                          {evt.description}
                        </p>

                        {/* Clean and theme-adaptive metadata pills */}
                        {evt.badges && evt.badges.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {evt.badges.map((b, bIdx) => (
                              <span
                                key={bIdx}
                                className="event-pill px-2.5 py-0.5 rounded-md text-[10px] font-mono"
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
                            className={`tactile-btn text-xs font-semibold event-action-btn px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm group/btn ${
                              isLiveActive ? 'ring-1 ring-cyan-500/40' : ''
                            }`}
                          >
                            <span>{isLiveActive ? 'View Active Event Flights' : 'View Event Flights'}</span>
                            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
