import React, { useMemo, useState } from 'react';
import {
  Compass,
  Plane,
  Trophy,
  AlertTriangle,
  Search,
  X,
  Clock,
  ChevronRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { FlightDestination, getStars, getMaxStars } from './flightUtils';
import { MAP_LOCATIONS } from './mapLocations';
import { AIRCRAFT_ORDER } from './src/aircraftData';
import { EditableNumberInput } from './src/components/common/EditableNumberInput';

export interface MapInventoryPageProps {
  destinations: FlightDestination[];
  onNavigateToDestination: (destinationName: string) => void;
  onNavigateToCategoryMaps?: (categoryName: string) => void;
  updateMapCount: (id: string, count: number) => void;
  showMissingAlliance: boolean;
  setShowMissingAlliance: (val: boolean) => void;
  showMissingAdventure: boolean;
  setShowMissingAdventure: (val: boolean) => void;
}

export const MapInventoryPage: React.FC<MapInventoryPageProps> = ({
  destinations,
  onNavigateToDestination,
  onNavigateToCategoryMaps,
  updateMapCount,
  showMissingAlliance,
  setShowMissingAlliance,
  showMissingAdventure,
  setShowMissingAdventure,
}) => {
  const [missingSearch, setMissingSearch] = useState('');

  // Maps Dashboard Statistics computed only when this view is mounted
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
        const catOrder: Record<string, number> = {
          'Adventure Map Flights': 1,
          'Alliance Map Flights': 2,
          'Space Map Flights': 3,
          'Event Flights': 4,
        };
        const orderA = catOrder[a.category] || 99;
        const orderB = catOrder[b.category] || 99;
        if (orderA !== orderB) return orderA - orderB;
        return a.destination.localeCompare(b.destination);
      });

    return {
      uniqueMaps,
      totalMaps,
      completionRate,
      topStock,
      airplaneStats,
      typeStats,
      missingMaps,
    };
  }, [destinations]);

  return (
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
              <img
                src="icons/deck-mapdepot-3d.png"
                alt="Map Inventory"
                className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-300"
              />
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
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
            <Compass className="w-4 h-4 theme-accent-text" /> Map Progress by Collection
          </h3>
          <span className="text-[11px] text-[var(--text-muted)] font-normal hidden sm:inline">
            Click a collection to view routes in inventory
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mapCollectionStats.typeStats.map((col, idx) => (
            <div
              key={col.name}
              onClick={() => onNavigateToCategoryMaps?.(col.cat)}
              role="button"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onNavigateToCategoryMaps?.(col.cat);
                }
              }}
              title={`View ${col.name} flights with maps in inventory`}
              className="bg-black/20 hover:bg-white/[0.07] p-4 rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-200 cursor-pointer space-y-2 group shadow-sm hover:shadow-lg active:scale-[0.99] select-none"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-heading font-medium tracking-wide text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors flex items-center gap-1.5">
                  {col.name}
                  <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[var(--text-muted)] group-hover:text-[var(--accent)]" />
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
                <span>Collected:</span>
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
          {mapCollectionStats.airplaneStats.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-xs font-mono text-[var(--text-muted)]">
              No maps currently in stock across any aircraft class.
            </div>
          ) : (
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
          )}
        </div>
      </div>

      {/* Top Stocked Maps Leaderboard */}
      <div className="glass-panel rounded-3xl p-6 border border-[var(--border-card)] space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" /> Most Stocked Flight Maps
        </h3>
        {mapCollectionStats.topStock.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-[var(--text-muted)]">
            No flight maps currently in stock. Add maps to routes in the Flights table to populate leaderboard.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {mapCollectionStats.topStock.map((dest, idx) => (
              <div
                key={dest.id}
                onClick={() => onNavigateToDestination(dest.destination)}
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
                        <span className="theme-accent-text flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {dest.mapDuration}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={missingSearch}
                onChange={e => setMissingSearch(e.target.value)}
                placeholder="Search missing..."
                className="pl-8 pr-7 py-1 rounded-xl bg-black/30 border border-white/10 text-xs text-[var(--text-main)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--border-active)] w-40 sm:w-48 font-normal transition-all"
              />
              {missingSearch && (
                <button
                  onClick={() => setMissingSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <label className="flex items-center gap-2 text-xs font-normal text-[var(--text-muted)] cursor-pointer" title="Show/hide Alliance flights with 0 maps in inventory">
              <input
                type="checkbox"
                checked={showMissingAlliance}
                onChange={e => setShowMissingAlliance(e.target.checked)}
                style={{ accentColor: 'var(--accent)' }}
                className="rounded"
              />
              <span>Alliance</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-normal text-[var(--text-muted)] cursor-pointer" title="Show/hide Adventure flights with 0 maps in inventory">
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
              if (
                missingSearch.trim() &&
                !d.destination.toLowerCase().includes(missingSearch.toLowerCase()) &&
                !d.aircraft.toLowerCase().includes(missingSearch.toLowerCase()) &&
                !d.group.toLowerCase().includes(missingSearch.toLowerCase())
              ) {
                return false;
              }
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
                        <span className="theme-accent-text font-mono flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {dest.mapDuration}
                        </span>
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
  );
};
