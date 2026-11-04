import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Check,
  Plus,
  Minus,
  RotateCcw,
  Navigation,
  Sparkles,
  ExternalLink,
  Eye,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Layers,
} from 'lucide-react';
import { Mission, MISSIONS_LIST } from './src/data/missionsData';
import { AIRCRAFT_SPRITES } from './AirplanesPage';

// Graceful thumbnail loader with cyber landmark icon fallback if image asset is not yet available
const MissionThumbnail: React.FC<{
  src?: string;
  name?: string;
  className?: string;
  fallbackIconClass?: string;
}> = ({ src, name = 'Mission', className = 'w-full h-full object-contain', fallbackIconClass = 'w-4 h-4 text-amber-400' }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError || !src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black/40 rounded">
        <Trophy className={fallbackIconClass} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className={className}
      onError={() => setHasError(true)}
    />
  );
};

interface MissionsPageProps {
  missions?: Mission[];
  missionProgress: Record<string, Record<string, number>>;
  onUpdateCount: (missionId: string, itemId: string, count: number) => void;
  onBatchUpdate: (missionId: string, updates: Record<string, number>) => void;
  onNavigateToDestination?: (destName: string) => void;
  selectedMissionId?: string;
  onSelectMission?: (missionId: string) => void;
}

export const MissionsPage: React.FC<MissionsPageProps> = ({
  missions = MISSIONS_LIST,
  missionProgress,
  onUpdateCount,
  onBatchUpdate,
  onNavigateToDestination,
  selectedMissionId,
  onSelectMission,
}) => {
  const [internalMissionId, setInternalMissionId] = useState<string>(selectedMissionId || missions[0]?.id || 'aztec-pyramid');

  const activeMissionId = selectedMissionId !== undefined ? selectedMissionId : internalMissionId;
  const setActiveMissionId = (id: string) => {
    setInternalMissionId(id);
    onSelectMission?.(id);
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  // Active mission definition
  const activeMission = useMemo(() => {
    return missions.find(m => m.id === activeMissionId) || missions[0];
  }, [missions, activeMissionId]);

  const activeIndex = useMemo(() => {
    return missions.findIndex(m => m.id === activeMissionId);
  }, [missions, activeMissionId]);

  // Current counts for active mission
  const currentCounts = useMemo(() => {
    return missionProgress[activeMission?.id || ''] || {};
  }, [missionProgress, activeMission]);

  const maxCompletions = activeMission?.maxCompletions || 6;
  const builtCount = Number(currentCounts['_built'] || 0);

  // Full sets currently ready to claim across all items
  const setsReady = useMemo(() => {
    if (!activeMission || activeMission.items.length === 0) return 0;
    const runsPerItem = activeMission.items.map(item =>
      Math.floor((currentCounts[item.id] || 0) / item.required)
    );
    return Math.max(0, Math.min(...runsPerItem));
  }, [activeMission, currentCounts]);

  // Current landmark stage progress (how far the player is to making landmark #1, #2, ... #6)
  const stageStats = useMemo(() => {
    if (!activeMission) return { collected: 0, required: 0, percent: 0, targetIndex: 1, isFullyComplete: false, isAllBuilt: false };

    const required = activeMission.totalRequired; // items needed for ONE build (e.g. 250 or 30)

    if (builtCount >= maxCompletions) {
      return {
        collected: required,
        required,
        percent: 100,
        targetIndex: maxCompletions,
        isFullyComplete: true,
        isAllBuilt: true,
      };
    }

    const targetIndex = builtCount + 1; // 1 to 6
    let collected = 0;
    let completeItemsInStage = 0;

    activeMission.items.forEach(item => {
      const count = currentCounts[item.id] || 0;
      // Items belonging to this specific landmark stage:
      const itemsInStage = Math.max(0, Math.min(item.required, count - builtCount * item.required));
      collected += itemsInStage;
      if (itemsInStage >= item.required) {
        completeItemsInStage += 1;
      }
    });

    const percent = required > 0 ? Math.min(100, Math.round((collected / required) * 100)) : 0;
    const isFullyComplete = collected >= required;

    return {
      collected,
      required,
      percent,
      targetIndex,
      completeItemsInStage,
      totalItems: activeMission.items.length,
      isFullyComplete,
      isAllBuilt: false,
    };
  }, [activeMission, currentCounts, builtCount, maxCompletions]);

  // Cycle to previous / next mission
  const handlePrevMission = () => {
    const nextIdx = (activeIndex - 1 + missions.length) % missions.length;
    setActiveMissionId(missions[nextIdx].id);
    setIsDropdownOpen(false);
  };

  const handleNextMission = () => {
    const nextIdx = (activeIndex + 1) % missions.length;
    setActiveMissionId(missions[nextIdx].id);
    setIsDropdownOpen(false);
  };

  // Set single item count (unclamped up to 999 so stockpiling 6x is seamless)
  const handleSetCount = (itemId: string, newCount: number) => {
    if (!activeMission) return;
    const val = Math.max(0, Math.min(999, newCount));
    onUpdateCount(activeMission.id, itemId, val);
  };

  // Set built landmarks (0 to 6)
  const handleSetBuilt = (val: number) => {
    if (!activeMission) return;
    const clamped = Math.max(0, Math.min(maxCompletions, val));
    onUpdateCount(activeMission.id, '_built', clamped);
  };

  // Claim 1 completed landmark (consumes 1 set of items and increments built)
  const handleClaimRun = () => {
    if (!activeMission || setsReady <= 0 || builtCount >= maxCompletions) return;
    const updates: Record<string, number> = {
      _built: builtCount + 1,
    };
    activeMission.items.forEach(item => {
      const cur = currentCounts[item.id] || 0;
      updates[item.id] = Math.max(0, cur - item.required);
    });
    onBatchUpdate(activeMission.id, updates);
  };

  // Reset all items for this mission
  const handleResetAll = () => {
    if (!activeMission) return;
    const updates: Record<string, number> = {};
    activeMission.items.forEach(i => {
      updates[i.id] = 0;
    });
    onBatchUpdate(activeMission.id, updates);
    setShowResetConfirm(false);
  };

  // Max out all items for 6 complete runs
  const handleMaxAll6x = () => {
    if (!activeMission) return;
    const updates: Record<string, number> = {};
    activeMission.items.forEach(i => {
      updates[i.id] = i.required * maxCompletions;
    });
    onBatchUpdate(activeMission.id, updates);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200 max-w-5xl mx-auto">
      {/* Sleek Mission Selector Dropdown & Stepper Bar */}
      <div className="flex items-center justify-between gap-3 bg-black/20 p-2 sm:p-2.5 rounded-2xl border border-white/5 relative" ref={dropdownRef}>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Previous Mission Button */}
          <button
            onClick={handlePrevMission}
            className="tactile-btn p-2 rounded-xl bg-black/40 hover:bg-black/60 text-[var(--text-muted)] hover:text-white border border-white/10 shrink-0"
            title="Previous Mission"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Main Dropdown Button */}
          <button
            onClick={() => setIsDropdownOpen(prev => !prev)}
            className="tactile-btn flex-1 flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl glass-card border border-[var(--border-card)] hover:border-[var(--border-active)] transition-all min-w-0 text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-7 h-7 rounded-lg theme-badge flex items-center justify-center p-0.5 shrink-0 overflow-hidden">
                <MissionThumbnail src={activeMission?.reward.image} name={activeMission?.name} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-heading font-bold text-[var(--text-main)] truncate">
                    #{activeIndex + 1} {activeMission?.name}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">
                    ({builtCount}/6 Built)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[var(--text-muted)] shrink-0">
              <span className="text-[10px] font-mono hidden sm:inline">
                Mission {activeIndex + 1} of {missions.length}
              </span>
              {isDropdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {/* Next Mission Button */}
          <button
            onClick={handleNextMission}
            className="tactile-btn p-2 rounded-xl bg-black/40 hover:bg-black/60 text-[var(--text-muted)] hover:text-white border border-white/10 shrink-0"
            title="Next Mission"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dropdown Menu Popover */}
        {isDropdownOpen && (
          <div className="absolute left-2 right-2 top-full mt-2 z-50 glass-panel rounded-2xl border border-white/15 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150 max-h-96 overflow-y-auto no-scrollbar">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] px-3 py-1.5 border-b border-white/5">
              Select Mission ({missions.length} Total)
            </div>
            <div className="divide-y divide-white/5 mt-1">
              {missions.map((m, idx) => {
                const isSelected = m.id === activeMissionId;
                const mCounts = missionProgress[m.id] || {};
                const mBuilt = Number(mCounts['_built'] || 0);
                const mReady = m.items.length > 0
                  ? Math.min(...m.items.map(i => Math.floor((mCounts[i.id] || 0) / i.required)))
                  : 0;

                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setActiveMissionId(m.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                      isSelected
                        ? 'theme-btn-accent font-semibold shadow-sm'
                        : 'hover:bg-white/5 text-[var(--text-muted)] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-lg theme-badge flex items-center justify-center p-0.5 shrink-0 overflow-hidden">
                        <MissionThumbnail src={m.reward.image} name={m.name} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-heading font-semibold text-[var(--text-main)] truncate">
                          #{idx + 1} {m.name}
                        </div>
                        <div className="text-[10px] font-mono text-[var(--text-muted)]">
                          {m.items.length} items • {m.totalRequired} per build
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {mBuilt >= 6 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          ★ 6/6
                        </span>
                      ) : mReady > 0 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                          {mReady} Ready
                        </span>
                      ) : (
                        <span className="font-mono text-[11px] text-[var(--text-muted)]">
                          {mBuilt}/6 Built
                        </span>
                      )}
                      {isSelected && <Check className="w-4 h-4 text-[var(--accent)]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Reward & Next Landmark Progression Cockpit Header */}
      {activeMission && (
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-[var(--border-card)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3.5 w-full md:w-auto">
            <div className="w-14 h-16 sm:w-16 sm:h-20 rounded-xl bg-black/30 border border-white/10 flex items-center justify-center p-1 relative shrink-0">
              <MissionThumbnail
                src={activeMission.reward.image}
                alt={activeMission.name}
                className="w-full h-full object-contain"
                fallbackIconClass="w-8 h-8 text-amber-400 opacity-80"
              />
              {activeMission.reward.statsImage && (
                <button
                  onClick={() => setShowStatsModal(true)}
                  className="absolute bottom-1 right-1 p-1 rounded bg-black/80 hover:bg-black text-white text-[9px] border border-white/20 transition-all"
                  title="View In-Game Dossier"
                >
                  <Eye className="w-2.5 h-2.5" />
                </button>
              )}
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-heading font-bold text-[var(--text-main)] truncate">
                  {activeMission.name}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase theme-badge">
                  {activeMission.reward.category}
                </span>
                {builtCount >= maxCompletions && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    ALL 6 BUILT ★
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="text-amber-300">
                  {activeMission.reward.category === 'Commerce' ? 'Bonus: ' : 'Max Pop: '}
                  {activeMission.reward.bonus.replace('+50 Max Pop', '+50')}
                </span>
                <span className="text-[var(--text-muted)]">•</span>
                <span className="text-emerald-300">
                  {activeMission.reward.category === 'Commerce' ? 'Radius: ' : 'Footprint: '}
                  {activeMission.reward.radius}
                </span>
                <span className="text-[var(--text-muted)]">•</span>
                {activeMission.reward.category === 'Commerce' ? (
                  <span className="text-yellow-300">Coins: {activeMission.reward.coins}</span>
                ) : (
                  <span className="text-cyan-300">Produces: 1 collectible item / 24h</span>
                )}
              </div>

              {/* 6x Built Tracker & Claim Button */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5 select-none">
                <span className="text-[11px] font-mono text-[var(--text-muted)]">Landmarks Built:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5, 6].map(num => {
                    const isBuilt = num <= builtCount;
                    const canBuildThis = num === builtCount + 1 && setsReady > 0;
                    return (
                      <button
                        key={num}
                        disabled={!isBuilt && !canBuildThis}
                        onClick={() => {
                          if (isBuilt && num === builtCount) {
                            handleSetBuilt(num - 1);
                          } else if (canBuildThis) {
                            handleClaimRun();
                          }
                        }}
                        className={`w-5 h-5 rounded text-[10px] font-mono font-bold transition-all border flex items-center justify-center ${
                          isBuilt
                            ? 'bg-amber-500/30 border-amber-500/60 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)] cursor-pointer'
                            : canBuildThis
                            ? 'bg-emerald-500/25 border-emerald-500/50 text-emerald-300 animate-pulse cursor-pointer hover:scale-110'
                            : 'bg-black/20 border-white/5 text-[var(--text-muted)] opacity-35 cursor-not-allowed'
                        }`}
                        title={
                          isBuilt
                            ? `Landmark #${num} built (Click to undo)`
                            : canBuildThis
                            ? `Build Landmark #${num} (1 full set ready! Click to build)`
                            : `Landmark #${num}: Collect all required items to build`
                        }
                      >
                        {isBuilt ? '★' : num}
                      </button>
                    );
                  })}
                </div>
                <span className="text-[11px] font-mono font-bold text-[var(--text-main)] ml-1">
                  {builtCount} / 6
                </span>

                {/* Claim Button when a full set is stockpiled */}
                {setsReady > 0 && builtCount < maxCompletions && (
                  <button
                    onClick={handleClaimRun}
                    className="tactile-btn ml-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/25 hover:bg-emerald-500/35 text-emerald-300 border border-emerald-500/50 flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.35)] animate-pulse"
                    title={`Claim 1 full set of items to build Landmark #${builtCount + 1}`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Build Landmark #{builtCount + 1} ({setsReady} ready)
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Progress towards making NEXT Landmark (Not all 6) & Quick Actions */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end shrink-0">
            <div className="bg-black/25 px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] text-right min-w-[210px]">
              <div className="text-xs mb-1.5 font-mono">
                <div className="text-[var(--text-muted)] text-[11px] text-left">
                  {stageStats.isAllBuilt
                    ? 'All 6 Built'
                    : `Progress to #${stageStats.targetIndex}`}
                </div>
                <div className="font-bold text-[var(--text-main)] text-right">
                  {stageStats.collected} / {stageStats.required} ({stageStats.percent}%)
                </div>
              </div>
              <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden border border-[var(--border-subtle)]">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    stageStats.isAllBuilt
                      ? 'bg-amber-400'
                      : stageStats.isFullyComplete
                      ? 'bg-emerald-400'
                      : 'theme-progress-bar'
                  }`}
                  style={{ width: `${stageStats.percent}%` }}
                />
              </div>
              <div className="text-[10px] text-[var(--text-muted)] mt-1 font-mono text-right">
                {stageStats.isAllBuilt
                  ? 'Maximum 6 builds completed ★'
                  : stageStats.isFullyComplete
                  ? `Ready to build Landmark #${stageStats.targetIndex}!`
                  : `${stageStats.required - stageStats.collected} needed for Landmark #${stageStats.targetIndex}`}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setShowResetConfirm(true)}
                className="tactile-btn p-2 rounded-xl text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                title="Reset all item counters for this mission to 0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleMaxAll6x}
                className="tactile-btn px-2.5 py-2 rounded-xl text-xs font-medium theme-badge text-[var(--text-main)] hover:bg-white/10 border border-white/10 flex items-center gap-1"
                title="Set all items to 6x max stockpile requirement"
              >
                <Sparkles className="w-3 h-3 text-amber-400" /> Max 6x
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clean Items List with Stage Progress & Stockpile Support */}
      <div className="glass-panel rounded-2xl border border-[var(--border-card)] overflow-hidden shadow-lg">
        {/* List Header */}
        <div className="grid grid-cols-12 gap-2 sm:gap-4 px-4 py-2.5 bg-black/35 border-b border-white/5 text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] select-none">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-4 sm:col-span-4">Item ({activeMission?.items.length})</div>
          <div className="col-span-3 sm:col-span-3">Destination</div>
          <div className="col-span-4 sm:col-span-4 text-right">Stockpile & Stepper</div>
        </div>

        {/* Item Rows */}
        <div className="divide-y divide-white/5">
          {activeMission?.items.map((item, idx) => {
            const count = currentCounts[item.id] || 0;
            const fullTarget6x = item.required * maxCompletions; // e.g. 6x6=36 or 10x6=60
            const runsCovered = Math.floor(count / item.required); // e.g. 20 / 6 = 3 full runs
            const isFull6xMax = count >= fullTarget6x;

            // Progress towards the current landmark stage (#1, #2, ... #6)
            const thresholdForStage = Math.min(fullTarget6x, (builtCount + 1) * item.required);
            const itemsInStage = Math.max(0, Math.min(item.required, count - builtCount * item.required));
            const isReadyForStage = count >= thresholdForStage;
            const sprite = AIRCRAFT_SPRITES[item.aircraft];

            return (
              <div
                key={item.id}
                className={`grid grid-cols-12 gap-2 sm:gap-4 px-4 py-2.5 items-center transition-colors ${
                  isFull6xMax
                    ? 'bg-amber-950/15 hover:bg-amber-950/25'
                    : isReadyForStage
                    ? 'bg-emerald-950/15 hover:bg-emerald-950/25'
                    : 'hover:bg-white/[0.02]'
                }`}
              >
                {/* Index / Status */}
                <div className="col-span-1 text-center font-mono text-xs flex items-center justify-center">
                  {isFull6xMax ? (
                    <span className="text-amber-400 font-bold" title="All 6 missions covered!">
                      ★6
                    </span>
                  ) : isReadyForStage ? (
                    <Check className="w-4 h-4 text-emerald-400 stroke-[3]" title={`Ready for Landmark #${builtCount + 1}`} />
                  ) : (
                    <span className="text-[var(--text-muted)]">{idx + 1}</span>
                  )}
                </div>

                {/* Item Name */}
                <div className="col-span-4 sm:col-span-4 min-w-0">
                  <div className="font-medium text-xs sm:text-sm text-[var(--text-main)] truncate">
                    {item.name}
                  </div>
                  <div className="text-[10px] font-mono text-[var(--text-muted)] flex items-center gap-1.5">
                    <span>
                      {itemsInStage}/{item.required} for #{Math.min(maxCompletions, builtCount + 1)}
                    </span>
                    <span>•</span>
                    <span className={runsCovered >= 6 ? 'text-amber-300 font-semibold' : runsCovered > 0 ? 'text-emerald-300' : ''}>
                      {runsCovered >= 6 ? 'All 6 covered' : `${runsCovered}/6 covered`}
                    </span>
                  </div>
                </div>

                {/* Destination & Aircraft / Collection */}
                <div className="col-span-3 sm:col-span-3 flex items-center gap-2 min-w-0">
                  {item.aircraft === 'N/A' || item.destination.toLowerCase().includes('collection') ? (
                    <span
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 text-xs font-medium border border-purple-500/25 truncate shadow-sm"
                      title={`Obtained by completing: ${item.destination}`}
                    >
                      <Layers className="w-3 h-3 text-purple-400 shrink-0" />
                      <span className="truncate">{item.destination}</span>
                    </span>
                  ) : onNavigateToDestination ? (
                    <button
                      onClick={() => onNavigateToDestination(item.destination)}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-[var(--text-main)] text-xs font-medium border border-white/10 transition-colors group/dest truncate"
                      title={`Jump to flight: ${item.destination}`}
                    >
                      <Navigation className="w-3 h-3 text-[var(--accent)] group-hover/dest:translate-x-0.5 transition-transform shrink-0" />
                      <span className="truncate">{item.destination}</span>
                      <ExternalLink className="w-2.5 h-2.5 text-[var(--text-muted)] shrink-0" />
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 text-[var(--text-main)] text-xs font-medium truncate">
                      <Navigation className="w-3 h-3 text-[var(--accent)] shrink-0" />
                      <span className="truncate">{item.destination}</span>
                    </span>
                  )}

                  {sprite && (
                    <img
                      src={sprite}
                      alt={item.aircraft}
                      className="w-3.5 h-3.5 object-contain shrink-0 hidden sm:inline-block"
                      title={item.aircraft}
                    />
                  )}
                  {item.aircraft !== 'N/A' && (
                    <span className="text-[11px] font-mono text-[var(--text-muted)] hidden md:inline">
                      ({item.aircraft})
                    </span>
                  )}
                </div>

                {/* Unconstrained Stockpile Steppers */}
                <div className="col-span-4 sm:col-span-4 flex items-center justify-end gap-1 sm:gap-1.5">
                  {/* Minus 1 */}
                  <button
                    onClick={() => handleSetCount(item.id, count - 1)}
                    disabled={count <= 0}
                    className="tactile-btn w-6 h-6 rounded-md flex items-center justify-center bg-black/40 hover:bg-black/60 text-[var(--text-main)] border border-white/10 disabled:opacity-20 disabled:pointer-events-none transition-all"
                    title="Decrease count by 1"
                  >
                    <Minus className="w-3 h-3" />
                  </button>

                  {/* Number Input (Accepts any stockpile e.g. 20, 36, 60) */}
                  <input
                    type="number"
                    min="0"
                    max="999"
                    value={count}
                    onChange={e => {
                      const val = parseInt(e.target.value, 10);
                      handleSetCount(item.id, isNaN(val) ? 0 : val);
                    }}
                    className={`w-12 h-6 text-center rounded-md border text-xs font-mono font-bold focus:outline-none focus:border-[var(--accent)] transition-all ${
                      isFull6xMax
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_6px_rgba(245,158,11,0.2)]'
                        : isReadyForStage
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-black/40 text-[var(--text-main)] border-white/10'
                    }`}
                    title={`Current inventory count (target: ${thresholdForStage} for #${builtCount + 1})`}
                  />

                  {/* Plus 1 */}
                  <button
                    onClick={() => handleSetCount(item.id, count + 1)}
                    className="tactile-btn w-6 h-6 rounded-md flex items-center justify-center bg-black/40 hover:bg-black/60 text-[var(--text-main)] border border-white/10 transition-all"
                    title="Increase count by 1"
                  >
                    <Plus className="w-3 h-3" />
                  </button>

                  {/* Quick +1 Run step (e.g. +6 or +10) */}
                  <button
                    onClick={() => handleSetCount(item.id, count + item.required)}
                    className="tactile-btn px-1.5 h-6 rounded-md text-[10px] font-mono font-semibold bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-white border border-white/10 transition-all"
                    title={`Add 1 mission run (+${item.required})`}
                  >
                    +{item.required}
                  </button>

                  {/* Quick 6x Max Button (e.g. 36 or 60) */}
                  <button
                    onClick={() => handleSetCount(item.id, isFull6xMax ? 0 : fullTarget6x)}
                    className={`tactile-btn px-2 h-6 rounded-md text-[10px] font-mono font-semibold border transition-all ${
                      isFull6xMax
                        ? 'bg-amber-500/30 text-amber-300 border-amber-500/50'
                        : 'bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-white border-white/10'
                    }`}
                    title={isFull6xMax ? 'Clear to 0' : `Set to 6x full target (${fullTarget6x})`}
                  >
                    {isFull6xMax ? '6x ✓' : `${fullTarget6x}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* In-Game Dossier Modal */}
      {showStatsModal && activeMission?.reward.statsImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-card max-w-sm w-full rounded-2xl p-5 border border-white/10 shadow-2xl relative">
            <button
              onClick={() => setShowStatsModal(false)}
              className="absolute right-3.5 top-3.5 p-1 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-center space-y-3">
              <h3 className="text-base font-heading font-bold text-[var(--text-main)]">
                {activeMission.reward.name}
              </h3>
              <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40 p-2">
                <img
                  src={activeMission.reward.statsImage}
                  alt={activeMission.reward.name}
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>
              <button
                onClick={() => setShowStatsModal(false)}
                className="tactile-btn w-full py-2 rounded-xl theme-btn-accent font-semibold text-xs shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-card max-w-xs w-full rounded-2xl p-5 border border-red-500/30 shadow-2xl space-y-3 text-center">
            <h3 className="text-base font-heading font-bold text-[var(--text-main)]">
              Reset All Counters?
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Set all items for {activeMission?.name} back to 0.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="tactile-btn flex-1 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-white border border-white/10 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleResetAll}
                className="tactile-btn flex-1 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-lg"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
