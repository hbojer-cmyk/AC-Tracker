import React from 'react';
import { Calendar, ExternalLink, ArrowRight, Sparkles, Compass, Info } from 'lucide-react';
import { EVENTS_CALENDAR, MonthCalendarData } from './src/data/eventsData';

interface EventsPageProps {
  onNavigateToFlightsWithEvent?: (eventKeyword: string) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({
  onNavigateToFlightsWithEvent,
}) => {
  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Banner matching cyber flight-deck aesthetic */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-[var(--border-card)] shadow-xl">
        <div
          className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: 'var(--accent)' }}
        />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5 sm:gap-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl theme-badge flex items-center justify-center shadow-2xl shrink-0 p-2 border border-white/10 group">
              <Calendar className="w-12 h-12 theme-accent-text group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold theme-btn-accent shadow-sm">
                  ANNUAL TIMELINE
                </span>
                <span className="text-xs text-[var(--text-muted)] font-mono">
                  12-Month Schedule
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-main)] font-heading">
                Event Calendar
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 font-normal">
                Click the links for walkthroughs from the Airport City Forum Wiki.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center">
            <a
              href="https://www.airportcitygame.com/wiki/events/"
              target="_blank"
              rel="noopener noreferrer"
              className="tactile-btn px-4 py-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold flex items-center gap-2 transition-all shadow-md group"
            >
              <span>Airport City Events Wiki</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      {/* Historical Disclaimer Callout */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-4 sm:p-5 flex items-start sm:items-center gap-3.5 shadow-lg relative overflow-hidden">
        <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5 sm:mt-0">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-xs text-[var(--text-muted)] leading-relaxed flex-1">
          <span className="font-semibold text-cyan-300 mr-1.5 uppercase tracking-wide text-[11px] font-mono">
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
              className="bg-slate-900/75 backdrop-blur-md border border-cyan-500/20 rounded-3xl overflow-hidden shadow-xl flex flex-col transition-all hover:border-cyan-500/40 group"
            >
              {/* Month Banner Header */}
              <div className="relative h-32 w-full overflow-hidden bg-slate-950/80">
                <img
                  src={month.bannerImage}
                  alt={`${month.monthName} Event Banner`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  onError={(e) => {
                    // Fallback to month 10 image if specific image fails
                    const target = e.currentTarget;
                    if (target.src.indexOf('icons/calendar/10.jpg') === -1) {
                      target.src = 'icons/calendar/10.jpg';
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                
                {/* Month Name and Quarter Badge */}
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between z-10">
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-black/60 text-cyan-300 border border-cyan-500/30">
                      {month.quarter} • Month {String(month.monthNumber).padStart(2, '0')}
                    </span>
                    <h2 className="text-xl font-bold text-white font-heading mt-1 drop-shadow-md">
                      {month.monthName}
                    </h2>
                  </div>
                  <div
                    className="w-3 h-3 rounded-full shadow-[0_0_8px] border border-white/40"
                    style={{ backgroundColor: month.themeAccent, boxShadow: `0 0 10px ${month.themeAccent}` }}
                    title={month.themeAccent}
                  />
                </div>
              </div>

              {/* Events List for Month */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  {month.events.map((evt, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950/60 rounded-2xl p-4 border border-white/5 hover:border-cyan-500/30 transition-all space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <a
                          href={evt.wikiUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-sm text-cyan-300 hover:text-cyan-200 transition-colors flex items-center gap-1.5 group/link"
                          title="Open Wiki Walkthrough"
                        >
                          <span>{evt.title}</span>
                          <ExternalLink className="w-3 h-3 opacity-60 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all shrink-0" />
                        </a>
                      </div>

                      <p className="text-xs text-[var(--text-muted)] leading-relaxed font-normal">
                        {evt.description}
                      </p>

                      {/* Badges */}
                      {evt.badges && evt.badges.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {evt.badges.map((b, bIdx) => (
                            <span
                              key={bIdx}
                              className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-800/40"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* View Event Flights Action */}
                      <div className="pt-1.5 flex justify-end">
                        <button
                          type="button"
                          onClick={() => onNavigateToFlightsWithEvent?.(evt.filterKeyword || evt.title)}
                          className="tactile-btn text-xs font-medium text-cyan-300 hover:text-cyan-100 bg-cyan-500/10 hover:bg-cyan-500/25 border border-cyan-500/25 px-2.5 py-1 rounded-xl flex items-center gap-1.5 transition-all"
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
