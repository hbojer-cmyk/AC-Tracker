import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, X, Plane, Sliders, Zap, Coins, Gift, ShieldAlert, Sparkles, Filter } from 'lucide-react';
import { OWNABLE_AIRCRAFT, AircraftInstance, getAircraftTypeFromName, adjustAircraftList } from './src/aircraftData';

export const AIRCRAFT_SPRITES: Record<string, string> = {
  Swift: 'icons/aircraft/swift.png',
  Swallow: 'icons/aircraft/swallow.png',
  Owl: 'icons/aircraft/owl.png',
  Hawk: 'icons/aircraft/hawk.png',
  Raven: 'icons/aircraft/raven.png',
  Eagle: 'icons/aircraft/eagle.png',
  Jumbo: 'icons/aircraft/jumbo.png',
  Giant: 'icons/aircraft/gianr.png',
  Falcon: 'icons/aircraft/falcon.png',
  Thunderbird: 'icons/aircraft/thunderbird.png',
  Condor: 'icons/aircraft/condor.png',
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

  const fleetStats = useMemo(() => {
    const total = ownedAirplanes.length;
    const avgSpeed = total ? Math.round(ownedAirplanes.reduce((acc, a) => acc + (a.speed || 0), 0) / total) : 0;
    const avgProfit = total ? Math.round(ownedAirplanes.reduce((acc, a) => acc + (a.profit || 0), 0) / total) : 0;
    const avgDrop = total ? Math.round(ownedAirplanes.reduce((acc, a) => acc + (a.itemDrop || 0), 0) / total) : 0;
    return { total, avgSpeed, avgProfit, avgDrop };
  }, [ownedAirplanes]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header HUD Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-[var(--border-card)] shadow-xl">
        <div
          className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: 'var(--accent)' }}
        />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl theme-badge flex items-center justify-center shadow-inner shrink-0">
              <Plane className="w-8 h-8 rotate-45 theme-accent-text" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider theme-badge">
                  Hangar Bay Operations
                </span>
                <span className="text-xs text-[var(--text-muted)] font-mono">
                  {fleetStats.total} Commissioned
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-main)] font-heading">
                Aircraft Fleet Command
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5 font-normal">
                Manage your active aircraft roster, configure performance upgrades, and inspect fleet bonuses.
              </p>
            </div>
          </div>

          {/* Quick Fleet Averages */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-black/20 p-3 rounded-2xl border border-white/5 shrink-0">
            <div className="text-center px-3 py-1">
              <div className="flex items-center justify-center gap-1 text-[10px] font-medium uppercase text-emerald-400 tracking-wider">
                <Zap className="w-3 h-3" /> Speed
              </div>
              <div className="text-lg font-mono font-semibold text-emerald-300 mt-0.5">
                +{fleetStats.avgSpeed}%
              </div>
            </div>
            <div className="text-center px-3 py-1 border-x border-white/10">
              <div className="flex items-center justify-center gap-1 text-[10px] font-medium uppercase text-amber-400 tracking-wider">
                <Coins className="w-3 h-3" /> Profit
              </div>
              <div className="text-lg font-mono font-semibold text-amber-300 mt-0.5">
                +{fleetStats.avgProfit}%
              </div>
            </div>
            <div className="text-center px-3 py-1">
              <div className="flex items-center justify-center gap-1 text-[10px] font-medium uppercase theme-accent-text tracking-wider">
                <Gift className="w-3 h-3" /> Drop
              </div>
              <div className="text-lg font-mono font-semibold theme-accent-text mt-0.5">
                +{fleetStats.avgDrop}%
              </div>
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
            <Plus className="w-4 h-4" /> Commission Aircraft
          </button>
        </form>
      </div>

      {/* Fleet Filter Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        <button
          onClick={() => setFilterType('All')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
            filterType === 'All'
              ? 'theme-btn-accent shadow-md font-semibold'
              : 'bg-black/20 hover:bg-white/10 text-[var(--text-muted)] hover:text-white border border-white/5'
          }`}
        >
          <span>All Classes</span>
          <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10px] font-mono">
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
              className={`px-3 py-1.5 rounded-xl text-xs transition-all shrink-0 flex items-center gap-2 border ${
                isSelected
                  ? 'theme-btn-soft shadow-sm font-semibold'
                  : 'bg-black/20 hover:bg-white/10 text-[var(--text-muted)] hover:text-white border-white/5 font-medium'
              }`}
            >
              {AIRCRAFT_SPRITES[type] && (
                <img src={AIRCRAFT_SPRITES[type]} alt={type} className="w-4 h-4 object-contain" />
              )}
              <span>{type}</span>
              <span className="w-4 h-4 rounded-full theme-badge text-[10px] font-mono flex items-center justify-center font-normal">
                {count}
              </span>
            </button>
          );
        })}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center p-1 relative shrink-0">
                      {sprite ? (
                        <img src={sprite} alt={type} className="w-10 h-10 object-contain drop-shadow" />
                      ) : (
                        <Plane className="w-6 h-6 theme-accent-text" />
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

                {/* Stat Meters */}
                <div className="space-y-2 pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs font-normal">
                    <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-emerald-400" /> Speed Bonus
                    </span>
                    <span className={`font-mono ${airplane.speed > 0 ? 'text-emerald-400 font-semibold' : 'text-[var(--text-faint)]'}`}>
                      +{airplane.speed}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, airplane.speed * 2)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 font-normal">
                    <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-amber-400" /> Profit Bonus
                    </span>
                    <span className={`font-mono ${airplane.profit > 0 ? 'text-amber-400 font-semibold' : 'text-[var(--text-faint)]'}`}>
                      +{airplane.profit}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, airplane.profit * 2)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 font-normal">
                    <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 theme-accent-text" /> Item Drop
                    </span>
                    <span className={`font-mono ${airplane.itemDrop > 0 ? 'theme-accent-text font-semibold' : 'text-[var(--text-faint)]'}`}>
                      +{airplane.itemDrop}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                    <div
                      className="h-full theme-progress-fill rounded-full transition-all"
                      style={{ width: `${Math.min(100, airplane.itemDrop * 2)}%` }}
                    />
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

            <div className="space-y-4 font-normal">
              <div>
                <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1.5">
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <Zap className="w-3.5 h-3.5" /> Speed Bonus (+%)
                  </span>
                  <span className="font-mono text-emerald-300 font-semibold">{editStats.speed}%</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editStats.speed}
                  onChange={(e) => setEditStats({ ...editStats, speed: Math.max(0, parseInt(e.target.value) || 0) })}
                  className="w-full p-2.5 border border-white/10 rounded-xl bg-black/40 text-[var(--text-main)] font-mono text-sm focus:outline-none focus:border-emerald-500 font-normal"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1.5">
                  <span className="flex items-center gap-1 text-amber-400 font-medium">
                    <Coins className="w-3.5 h-3.5" /> Profit Bonus (+%)
                  </span>
                  <span className="font-mono text-amber-300 font-semibold">{editStats.profit}%</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editStats.profit}
                  onChange={(e) => setEditStats({ ...editStats, profit: Math.max(0, parseInt(e.target.value) || 0) })}
                  className="w-full p-2.5 border border-white/10 rounded-xl bg-black/40 text-[var(--text-main)] font-mono text-sm focus:outline-none focus:border-amber-500 font-normal"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1.5">
                  <span className="flex items-center gap-1 theme-accent-text font-medium">
                    <Gift className="w-3.5 h-3.5" /> Item Drop Bonus (+%)
                  </span>
                  <span className="font-mono theme-accent-text font-semibold">{editStats.itemDrop}%</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editStats.itemDrop}
                  onChange={(e) => setEditStats({ ...editStats, itemDrop: Math.max(0, parseInt(e.target.value) || 0) })}
                  className="w-full p-2.5 border border-white/10 rounded-xl bg-black/40 text-[var(--text-main)] font-mono text-sm focus:outline-none focus:border-[var(--border-active)] font-normal"
                />
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

