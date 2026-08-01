import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { OWNABLE_AIRCRAFT, AircraftInstance, getAircraftTypeFromName, adjustAircraftList } from './src/aircraftData';

export const AirplanesPage = () => {
  const [ownedAirplanes, setOwnedAirplanes] = useState<AircraftInstance[]>([]);
  const [newNickname, setNewNickname] = useState('');
  const [editingAirplane, setEditingAirplane] = useState<AircraftInstance | null>(null);
  const [editStats, setEditStats] = useState({ speed: 0, profit: 0, itemDrop: 0 });

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

  const addAirplane = () => {
    if (!newNickname.trim()) return;
    const derivedType = getAircraftTypeFromName(newNickname);
    const newAirplane: AircraftInstance = {
      id: Date.now().toString(),
      type: derivedType,
      nickname: newNickname,
      speed: 0,
      profit: 0,
      itemDrop: 0,
    };
    saveAirplanes([...ownedAirplanes, newAirplane]);
    setNewNickname('');
  };

  const removeAirplane = (id: string) => {
    saveAirplanes(ownedAirplanes.filter(a => a.id !== id));
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

  return (
    <div className="px-6 pb-6 pt-2 bg-[var(--bg)] min-h-screen grid-bg">
      <div className="rounded-3xl border border-indigo-500/20 bg-slate-900/80 backdrop-blur-xl shadow-2xl overflow-hidden max-w-2xl mx-auto">
        <img src="icons/AC-Header-MyHangar.png" alt="My Hangar" className="mx-auto max-w-[450px] w-full object-contain drop-shadow-2xl p-6 pb-0" referrerPolicy="no-referrer" />
        
        <section className="p-6 border-b border-white/10 bg-black/20">
          <div className="flex flex-wrap gap-2">
            {OWNABLE_AIRCRAFT.filter(type => ownedAirplanes.some(a => getAircraftType(a) === type)).map(type => (
              <div key={type} className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-bold text-indigo-300 flex items-center gap-1.5 shadow-sm">
                <span>{type}</span>
                <span className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-mono font-black">{ownedAirplanes.filter(a => getAircraftType(a) === type).length}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="p-6 border-b border-white/10 bg-black/40">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-1.5">Add Aircraft Nickname</label>
              <input type="text" value={newNickname} onChange={(e) => setNewNickname(e.target.value)} className="w-full p-2.5 border border-white/15 rounded-xl bg-slate-950/80 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium placeholder-gray-500" placeholder="e.g. Superfast Owl, Tropical Sleigh" />
            </div>
            <button onClick={addAirplane} className="btn-primary-glow px-6 py-2.5 text-white font-bold rounded-xl shadow-lg flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add to Fleet
            </button>
          </div>
        </section>

        <section className="divide-y divide-white/5 bg-slate-900/40">
          {[...ownedAirplanes].sort((a, b) => OWNABLE_AIRCRAFT.indexOf(getAircraftType(a)) - OWNABLE_AIRCRAFT.indexOf(getAircraftType(b))).map((a, index) => (
            <div key={a.id} className="p-4 flex items-center gap-4 hover:bg-indigo-500/10 transition-colors group">
               <button onClick={() => startEdit(a)} className="text-left flex items-center gap-4 flex-1">
                 <span className="text-gray-500 font-mono text-xs w-6">{index + 1}.</span>
                 <div className="flex items-center justify-between gap-4 flex-1">
                   <h3 className="font-extrabold text-base text-white group-hover:text-indigo-400 transition-colors">{a.nickname}</h3>
                   <div className="flex gap-2 text-xs font-mono">
                     {a.speed > 0 && <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">Speed +{a.speed}%</span>}
                     {a.profit > 0 && <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">Profit +{a.profit}%</span>}
                     {a.itemDrop > 0 && <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded">Drop +{a.itemDrop}%</span>}
                   </div>
                 </div>
               </button>
               <button onClick={() => removeAirplane(a.id)} className="text-gray-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition-all">
                 <Trash2 className="w-4 h-4" />
               </button>
            </div>
          ))}
        </section>
      </div>

      {editingAirplane && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 p-6 rounded-2xl w-full max-w-sm border border-indigo-500/30 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-lg text-white">Edit {editingAirplane.nickname}</h3>
              <button onClick={() => setEditingAirplane(null)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              {['speed', 'profit', 'itemDrop'].map((stat) => (
                <div key={stat}>
                  <label className="block text-xs font-extrabold text-gray-400 mb-1 capitalize tracking-wider">{stat}</label>
                  <input
                    type="number"
                    value={editStats[stat as keyof typeof editStats]}
                    onChange={(e) => setEditStats({ ...editStats, [stat]: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 border border-white/10 rounded-xl bg-slate-950 text-white font-mono"
                  />
                </div>
              ))}
              <button onClick={saveEdit} className="w-full py-2.5 btn-primary-glow text-white font-bold rounded-xl shadow-lg mt-2">
                Save Stats
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
