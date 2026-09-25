import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, X, Plane, Sliders, Zap, Coins, Gift, ShieldAlert, Sparkles, Filter, Gauge, CircleDollarSign, Package } from 'lucide-react';
import { OWNABLE_AIRCRAFT, AircraftInstance, getAircraftTypeFromName, adjustAircraftList } from './src/aircraftData';

export const AIRCRAFT_SPRITES: Record<string, string> = {
  Swift: 'icons/aircraft/swift.png',
  Swallow: 'icons/aircraft/swallow.png',
  Owl: 'icons/aircraft/owl.png',
  Hawk: 'icons/aircraft/hawk.png',
  Raven: 'icons/aircraft/raven.png',
  Eagle: 'icons/aircraft/eagle.png',
  Jumbo: 'icons/aircraft/jumbo.png',
  Giant: 'icons/aircraft/giant.png',
  Falcon: 'icons/aircraft/falcon.png',
  Thunderbird: 'icons/aircraft/thunderbird.png',
  Condor: 'icons/aircraft/condor.png',
  Sparrow: 'icons/aircraft/sparrow.png',
  Crossbill: 'icons/aircraft/crossbill.png',
  Goldfinch: 'icons/aircraft/goldfinch.png',
};

export const AirplanesPage = () => {
  const [ownedAirplanes, setOwnedAirplanes] = useState<AircraftInstance[]>([]);
  const [newNickname, setNewNickname] = useState('');
  const [editingAirplane, setEditingAirplane] = useState<AircraftInstance | null>(null);
  const [editStats, setEditStats] = useState({ speed: 0, profit: 0, itemDrop: 0 });
  const [filterType, setFilterType] = useState<string>('All');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('aeroquest_owned_airplanes_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const adjusted = adjustAircraftList(parsed);
        setOwnedAirplanes(adjusted);
      } catch (e) {
        setOwnedAirplanes([]);
      }
    }
  }, []);

  const saveAirplanes = (airplanes: AircraftInstance[]) => {
    const adjusted = adjustAircraftList(airplanes);
    setOwnedAirplanes(adjusted);
    localStorage.setItem('aeroquest_owned_airplanes_v2', JSON.stringify(adjusted));
  };

  const detectedNewType = useMemo(() => {
    return newNickname.trim() ? getAircraftTypeFromName(newNickname) : 'Swift';
  }, [newNickname]);

  const addAirplane = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newNickname.trim()) return;
    const derivedType = getAircraftTypeFromName(newNickname);
    const newAirplane: AircraftInstance = {
      id: Date.now().toString(),
      type: derivedType,
      nickname: newNickname.trim(),
      speed: 0,
      profit: 0,
      itemDrop: 0,
    };
    saveAirplanes([...ownedAirplanes, newAirplane]);
    setNewNickname('');
  };

  const removeAirplane = (id: string) => {
    saveAirplanes(ownedAirplanes.filter(a => a.id !== id));
    setConfirmDeleteId(null);
  };

  const startEdit = (airplane: AircraftInstance) => {
    setEditingAirplane(airplane);
    setEditStats({ speed: airplane.speed, profit: airplane.profit, itemDrop: airplane.itemDrop });
  };

  const saveEdit = () => {
    if (editingAirplane) {
      saveAirplanes(ownedAirplanes.map(a => a.id === editingAirplane.id ? { ...a, ...editStats } : a));
      setEditingAirplane(null);
    }
  };

  const getAircraftType = (airplane: AircraftInstance): string => {
    return getAircraftTypeFromName(airplane.nickname, airplane.type);
  };

  const filteredAirplanes = useMemo(() => {
    const list = [...ownedAirplanes].sort(
      (a, b) => OWNABLE_AIRCRAFT.indexOf(getAircraftType(a)) - OWNABLE_AIRCRAFT.indexOf(getAircraftType(b))
    );
    if (filterType === 'All') return list;
    return list.filter(a => getAircraftType(a) === filterType);
  }, [ownedAirplanes, filterType]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header HUD Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-[var(--border-card)] shadow-xl">
        <div
          className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: 'var(--accent)' }}
        />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5 sm:gap-6">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl theme-badge flex items-center justify-center shadow-2xl shrink-0 p-1 sm:p-1.5 border border-white/10 group">
              <img src="icons/deck-hangar-3d.png" alt="Aircraft Collection" className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-main)] font-heading">
                Aircraft Collection
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 font-normal">
                Keep track of your Aircraft and their properties
              </p>
            </div>
          </div>

          {/* Right-side HUD Counter Box */}
          <div className="bg-black/20 px-6 py-2.5 rounded-2xl border border-white/5 shrink-0 text-center min-w-[120px]">
            <div className="text-[10px] font-medium uppercase theme-accent-text tracking-wider">
              Fleet Size
            </div>
            <div className="text-2xl font-heading font-semibold theme-accent-text mt-0.5">
              {ownedAirplanes.length}
            </div>
          </div>
        </div>
      </div>

      {/* Commission New Aircraft Dock */}
      <div className="glass-panel rounded-2xl p-5 border border-[var(--border-card)]">
        <form onSubmit={addAirplane} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1">
            <input
              type="text"
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              placeholder="Enter aircraft call sign or nickname (e.g. Thunder Jumbo 1, Arctic Owl, Crossbill Alpha)..."
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-sm text-[var(--text-main)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--border-active)] focus:ring-2 focus:ring-[var(--accent-glow)] font-normal transition-all"
            />
            {newNickname.trim() && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 rounded-lg theme-badge text-[11px] font-medium">
                {AIRCRAFT_SPRITES[detectedNewType] && (
                  <img src={AIRCRAFT_SPRITES[detectedNewType]} alt={detectedNewType} className="w-4 h-4 object-contain" />
                )}
                <span>Type: {detectedNewType}</span>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={!newNickname.trim()}
            className="tactile-btn px-6 py-3 rounded-xl theme-btn-accent font-medium text-sm shadow-lg disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2 shrink-0 transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Aircraft
          </button>
        </form>
      </div>

      {/* Fleet Filter Bar (Responsive Wrapped Layout - No Scrolling Required) */}
      <div className="glass-panel rounded-2xl p-3 sm:p-3.5 border border-[var(--border-card)]">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterType('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs transition-all flex items-center gap-2 border ${filterType === 'All'
                ? 'theme-btn-accent shadow-md font-semibold border-transparent'
                : 'bg-black/30 hover:bg-white/10 text-[var(--text-muted)] hover:text-white border-white/5 font-medium'
              }`}
          >
            <span>All Classes</span>
            <span className="min-w-[18px] h-[18px] px-1.5 rounded-full bg-black/40 text-[10px] font-mono flex items-center justify-center font-bold">
              {ownedAirplanes.length}
            </span>
          </button>

          {OWNABLE_AIRCRAFT.filter(type => ownedAirplanes.some(a => getAircraftType(a) === type)).map(type => {
            const count = ownedAirplanes.filter(a => getAircraftType(a) === type).length;
            const isSelected = filterType === type;
            return (
              <button
                key={type}
                onClick={() => setFilterType(isSelected ? 'All' : type)}
                className={`px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-2 border ${isSelected
                    ? 'theme-btn-soft shadow-sm font-semibold border-transparent'
                    : 'bg-black/30 hover:bg-white/10 text-[var(--text-muted)] hover:text-white border-white/5 font-medium'
                  }`}
              >
                {AIRCRAFT_SPRITES[type] && (
                  <img src={AIRCRAFT_SPRITES[type]} alt={type} className="w-4 h-4 object-contain shrink-0" />
                )}
                <span>{type}</span>
                <span className="min-w-[18px] h-[18px] px-1 rounded-full theme-badge text-[10px] font-mono flex items-center justify-center font-bold">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Aircraft Grid Roster */}
      {filteredAirplanes.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center border border-[var(--border-card)]">
          <Plane className="w-12 h-12 text-[var(--text-faint)] mx-auto mb-3 opacity-40" />
          <h3 className="text-lg font-semibold text-[var(--text-main)] font-heading">Hangar Bay Empty</h3>
          <p className="text-xs text-[var(--text-muted)] mt-1 max-w-sm mx-auto font-normal">
            {filterType !== 'All'
              ? `No aircraft found matching the "${filterType}" filter.`
              : 'Add your first aircraft above to track upgrade modifiers and keep tabs on your fleet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAirplanes.map((airplane, index) => {
            const type = getAircraftType(airplane);
            const sprite = AIRCRAFT_SPRITES[type];
            return (
              <div
                key={airplane.id}
                className="glass-card rounded-2xl p-5 relative group overflow-hidden border border-[var(--border-card)] hover:border-[var(--border-active)] transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center p-1 relative shrink-0">
                      {sprite ? (
                        <img src={sprite} alt={type} className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
                      ) : (
                        <Plane className="w-7 h-7 theme-accent-text" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider theme-badge">
                          {type}
                        </span>
                        <span className="text-[10px] text-[var(--text-faint)] font-mono">
                          #{index + 1}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-[var(--text-main)] tracking-tight mt-1 font-heading group-hover:text-[var(--accent)] transition-colors">
                        {airplane.nickname}
                      </h3>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEdit(airplane)}
                      title="Edit Aircraft Stats"
                      className="p-2 rounded-lg bg-white/5 hover:bg-[var(--accent-muted)] text-[var(--text-muted)] hover:text-[var(--accent)] transition-all"
                    >
                      <Sliders className="w-4 h-4" />
                    </button>
                    {confirmDeleteId === airplane.id ? (
                      <div className="flex items-center gap-1 bg-rose-500/20 border border-rose-500/30 p-1 rounded-lg">
                        <button
                          onClick={() => removeAirplane(airplane.id)}
                          className="px-2 py-0.5 rounded bg-rose-500 text-white text-[10px] font-medium hover:bg-rose-600"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-[var(--text-muted)] hover:text-white p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(airplane.id)}
                        title="Decommission Aircraft"
                        className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-[var(--text-muted)] hover:text-rose-400 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Aircraft Properties (In-Game Wording & Styling) */}
                <div className="space-y-2 pt-3 border-t border-white/5 bg-black/20 p-2.5 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between text-xs font-normal">
                    <span className="text-xs text-[var(--text-main)] flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-white/90 shrink-0" /> Speed
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${airplane.speed > 0
                          ? 'bg-[#45c900] text-white shadow-sm'
                          : 'bg-white/10 text-[var(--text-faint)]'
                        }`}
                    >
                      {airplane.speed > 0 ? `+ ${airplane.speed}%` : '+ 0%'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-normal">
                    <span className="text-xs text-[var(--text-main)] flex items-center gap-2">
                      <CircleDollarSign className="w-4 h-4 text-white/90 shrink-0" /> Profit
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${airplane.profit > 0
                          ? 'bg-[#45c900] text-white shadow-sm'
                          : 'bg-white/10 text-[var(--text-faint)]'
                        }`}
                    >
                      {airplane.profit > 0 ? `+ ${airplane.profit}%` : '+ 0%'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-normal">
                    <span className="text-xs text-[var(--text-main)] flex items-center gap-2">
                      <svg className="w-4 h-4 text-white/90 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5l-8.2-1.8c-.5-.1-.9.1-1.2.4l-.9.9c-.3.3-.2.8.2 1l6 3.7-3.4 3.4-2.8-.4c-.4-.1-.7.1-.9.3l-.5.5c-.3.3-.2.7.2.9l3.3 2 2 3.3c.2.4.6.5.9.2l.5-.5c.2-.2.4-.5.3-.9l-.4-2.8 3.4-3.4 3.7 6c.2.4.7.5 1 .2l.9-.9c.3-.3.5-.7.4-1.2z" />
                        <rect x="2" y="15" width="5" height="5" rx="1" fill="currentColor" fillOpacity="0.4" />
                      </svg>
                      Drop chance:
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${airplane.itemDrop > 0
                          ? 'bg-[#45c900] text-white shadow-sm'
                          : 'bg-white/10 text-[var(--text-faint)]'
                        }`}
                    >
                      {airplane.itemDrop > 0 ? `+ ${airplane.itemDrop}%` : '+ 0%'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Stats Modal */}
      {editingAirplane && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="glass-panel bg-[var(--bg-card)] p-6 rounded-3xl w-full max-w-md border border-[var(--border-card)] shadow-2xl space-y-5">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl theme-badge flex items-center justify-center">
                  <Sliders className="w-5 h-5 theme-accent-text" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-[var(--text-main)] font-heading">
                    Edit Aircraft Stats
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] font-normal">
                    {editingAirplane.nickname} ({getAircraftType(editingAirplane)})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingAirplane(null)}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5 font-normal">
              {/* Speed Slider */}
              <div className="space-y-2 bg-black/20 p-3 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-1.5 text-white/90 font-medium">
                    <Gauge className="w-4 h-4 text-emerald-400" /> Speed
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${editStats.speed > 0
                        ? 'bg-[#45c900] text-white shadow-sm'
                        : 'bg-white/10 text-[var(--text-faint)]'
                      }`}
                  >
                    + {editStats.speed}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={editStats.speed}
                  onChange={(e) => setEditStats({ ...editStats, speed: parseInt(e.target.value) || 0 })}
                  className="stat-slider cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[var(--text-faint)] font-mono px-0.5">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Profit Slider */}
              <div className="space-y-2 bg-black/20 p-3 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-1.5 text-white/90 font-medium">
                    <CircleDollarSign className="w-4 h-4 text-amber-400" /> Profit
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${editStats.profit > 0
                        ? 'bg-[#45c900] text-white shadow-sm'
                        : 'bg-white/10 text-[var(--text-faint)]'
                      }`}
                  >
                    + {editStats.profit}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={editStats.profit}
                  onChange={(e) => setEditStats({ ...editStats, profit: parseInt(e.target.value) || 0 })}
                  className="stat-slider cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[var(--text-faint)] font-mono px-0.5">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Drop Chance Slider */}
              <div className="space-y-2 bg-black/20 p-3 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-1.5 text-white/90 font-medium">
                    <svg className="w-4 h-4 text-cyan-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5l-8.2-1.8c-.5-.1-.9.1-1.2.4l-.9.9c-.3.3-.2.8.2 1l6 3.7-3.4 3.4-2.8-.4c-.4-.1-.7.1-.9.3l-.5.5c-.3.3-.2.7.2.9l3.3 2 2 3.3c.2.4.6.5.9.2l.5-.5c.2-.2.4-.5.3-.9l-.4-2.8 3.4-3.4 3.7 6c.2.4.7.5 1 .2l.9-.9c.3-.3.5-.7.4-1.2z" />
                      <rect x="2" y="15" width="5" height="5" rx="1" fill="currentColor" fillOpacity="0.4" />
                    </svg>
                    Drop chance:
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${editStats.itemDrop > 0
                        ? 'bg-[#45c900] text-white shadow-sm'
                        : 'bg-white/10 text-[var(--text-faint)]'
                      }`}
                  >
                    + {editStats.itemDrop}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={editStats.itemDrop}
                  onChange={(e) => setEditStats({ ...editStats, itemDrop: parseInt(e.target.value) || 0 })}
                  className="stat-slider cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[var(--text-faint)] font-mono px-0.5">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setEditingAirplane(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-[var(--text-muted)] font-medium text-xs transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveEdit}
                className="flex-1 py-2.5 rounded-xl theme-btn-accent font-medium text-xs shadow-lg transition-all"
              >
                Save Modifiers
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

