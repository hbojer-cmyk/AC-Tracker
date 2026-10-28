import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Calendar,
  Zap,
  Activity,
  Plus,
  Minus,
  RotateCcw,
  Trash2,
  ChevronRight,
  BarChart3,
  Navigation,
  Crosshair,
  X,
  History,
  Plane,
} from 'lucide-react';
import { StarHistoryEntry, StarSyncOffsets, DEFAULT_STAR_SYNC_OFFSETS } from './profiles';
import {
  FlightDestination,
  GAME_STAR_RANKS,
  getStars,
  getMaxStars,
  getLocalDateString,
} from './flightUtils';

export interface StatsPageProps {
  globalStars: number;
  maxGlobalStars: number;
  globalPercentage: number;
  starCountMode: 'cumulative' | 'exact' | 'offset';
  toggleStarCountMode: (mode: 'cumulative' | 'exact' | 'offset') => void;
  filterStarRank: number | null;
  handleStarRankClick: (star: number) => void;
  starCounts: {
    cumulative: Record<'ace' | 'captain' | 'expert' | 'master' | 'specialist', number>;
    exact: Record<'ace' | 'captain' | 'expert' | 'master' | 'specialist', number>;
  };
  starOffsets?: StarSyncOffsets;
  onUpdateStarOffsets?: (offsets: StarSyncOffsets) => void;
  totalOffsetStars?: number;
  categories: string[];
  categoryStarsMap: Record<string, { earned: number; max: number }>;
  CATEGORY_ICONS: Record<string, string>;
  handleCategoryClick: (category: string) => void;
  starHistory: StarHistoryEntry[];
  onUpdateStarHistory: (newHistory: StarHistoryEntry[]) => void;
  destinations: FlightDestination[];
  onNavigateToDestination?: (destinationName: string) => void;
  hideZeroMaps?: boolean;
  setHideZeroMaps?: (val: boolean) => void;
  hideEventDestinations?: boolean;
  setHideEventDestinations?: (val: boolean) => void;
}

export const StatsPage: React.FC<StatsPageProps> = ({
  globalStars,
  maxGlobalStars,
  globalPercentage,
  starCountMode,
  toggleStarCountMode,
  filterStarRank,
  handleStarRankClick,
  starCounts,
  starOffsets,
  onUpdateStarOffsets,
  totalOffsetStars,
  categories,
  categoryStarsMap,
  CATEGORY_ICONS,
  handleCategoryClick,
  starHistory,
  onUpdateStarHistory,
  destinations,
  onNavigateToDestination,
  hideZeroMaps,
  setHideZeroMaps,
  hideEventDestinations,
  setHideEventDestinations,
}) => {
  // Radar Map & Event Filters (synchronized with props or localStorage)
  const [localHideZeroMaps, setLocalHideZeroMaps] = useState<boolean>(() => {
    try {
      return localStorage.getItem('act_hide_zero_maps') === 'true';
    } catch {
      return false;
    }
  });
  const [localHideEventDestinations, setLocalHideEventDestinations] = useState<boolean>(() => {
    try {
      return localStorage.getItem('act_hide_event_destinations') === 'true';
    } catch {
      return false;
    }
  });

  const effectiveHideZeroMaps = hideZeroMaps !== undefined ? hideZeroMaps : localHideZeroMaps;
  const effectiveHideEventDestinations =
    hideEventDestinations !== undefined ? hideEventDestinations : localHideEventDestinations;

  const handleToggleHideZeroMaps = (val: boolean) => {
    if (setHideZeroMaps) {
      setHideZeroMaps(val);
    } else {
      setLocalHideZeroMaps(val);
    }
    try {
      localStorage.setItem('act_hide_zero_maps', String(val));
    } catch {}
  };

  const handleToggleHideEventDestinations = (val: boolean) => {
    if (setHideEventDestinations) {
      setHideEventDestinations(val);
    } else {
      setLocalHideEventDestinations(val);
    }
    try {
      localStorage.setItem('act_hide_event_destinations', String(val));
    } catch {}
  };

  // Safe manual star sync offsets & derived values
  const safeStarOffsets = starOffsets || DEFAULT_STAR_SYNC_OFFSETS;
  const effectiveTotalOffsetStars =
    totalOffsetStars !== undefined
      ? totalOffsetStars
      : (safeStarOffsets.ace || 0) +
        (safeStarOffsets.captain || 0) +
        (safeStarOffsets.expert || 0) +
        (safeStarOffsets.master || 0) +
        (safeStarOffsets.specialist || 0);

  const hasNonZeroOffsets = useMemo(() => {
    return (
      (safeStarOffsets.ace || 0) > 0 ||
      (safeStarOffsets.captain || 0) > 0 ||
      (safeStarOffsets.expert || 0) > 0 ||
      (safeStarOffsets.master || 0) > 0 ||
      (safeStarOffsets.specialist || 0) > 0
    );
  }, [safeStarOffsets]);

  const handleUpdateOffset = (
    rankKey: 'ace' | 'captain' | 'expert' | 'master' | 'specialist',
    value: number
  ) => {
    if (onUpdateStarOffsets) {
      onUpdateStarOffsets({
        ...safeStarOffsets,
        [rankKey]: Math.max(0, value),
      });
    }
  };

  const handleResetOffsets = () => {
    if (onUpdateStarOffsets) {
      onUpdateStarOffsets({
        ace: 0,
        captain: 0,
        expert: 0,
        master: 0,
        specialist: 0,
      });
    }
  };

  // Mathematically consistent adjusted exact tier counts:
  // cum[tier] = trackedCum[tier] + offset[tier]
  // exact[tier] = max(0, cum[tier] - cum[tierAbove])
  const adjustedExactCounts = useMemo(() => {
    const cumAce = starCounts.cumulative.ace + (safeStarOffsets.ace || 0);
    const cumCaptain = starCounts.cumulative.captain + (safeStarOffsets.captain || 0);
    const cumExpert = starCounts.cumulative.expert + (safeStarOffsets.expert || 0);
    const cumMaster = starCounts.cumulative.master + (safeStarOffsets.master || 0);
    const cumSpecialist = starCounts.cumulative.specialist + (safeStarOffsets.specialist || 0);

    return {
      ace: cumAce,
      captain: Math.max(0, cumCaptain - cumAce),
      expert: Math.max(0, cumExpert - cumCaptain),
      master: Math.max(0, cumMaster - cumExpert),
      specialist: Math.max(0, cumSpecialist - cumMaster),
    };
  }, [starCounts.cumulative, safeStarOffsets]);

  // Chart timeframe filter
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '90D' | '1Y' | 'ALL'>('30D');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Milestone predictor mode: +50 / +100 / max
  const [milestoneTargetMode, setMilestoneTargetMode] = useState<'+50' | '+100' | 'max'>('+100');

  // Modal states for manual backfill & history management
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);
  const [showManageHistoryModal, setShowManageHistoryModal] = useState(false);

  // Form state for Add Past Milestone
  const [backfillDate, setBackfillDate] = useState(getLocalDateString());
  const [backfillStars, setBackfillStars] = useState<number>(globalStars);
  const [backfillEventTag, setBackfillEventTag] = useState('');
  const [backfillError, setBackfillError] = useState('');

  // Sorted history chronologically
  const sortedHistory = useMemo(() => {
    return [...starHistory].sort((a, b) => a.date.localeCompare(b.date));
  }, [starHistory]);

  // Filtered history by timeframe
  const filteredHistory = useMemo(() => {
    if (sortedHistory.length === 0) return [];
    if (timeframe === 'ALL') return sortedHistory;

    const now = new Date();
    const daysMap: Record<string, number> = { '7D': 7, '30D': 30, '90D': 90, '1Y': 365 };
    const days = daysMap[timeframe] || 30;
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const cutoffStr = getLocalDateString(cutoffDate);

    const inRange = sortedHistory.filter(item => item.date >= cutoffStr);
    if (inRange.length <= 1 && sortedHistory.length > 1) {
      // Include preceding entry to give baseline anchor in chart
      const preceding = sortedHistory.filter(item => item.date < cutoffStr);
      if (preceding.length > 0) {
        return [preceding[preceding.length - 1], ...inRange];
      }
    }
    return inRange.length > 0 ? inRange : sortedHistory;
  }, [sortedHistory, timeframe]);

  // Velocity KPI 1: Stars This Week (Last 7 Days)
  const starsThisWeek = useMemo(() => {
    if (sortedHistory.length === 0) return 0;
    const weekAgoDate = new Date(Date.now() - 7 * 86400000);
    const weekAgoStr = getLocalDateString(weekAgoDate);
    const baseline = sortedHistory.filter(h => h.date <= weekAgoStr).pop() || sortedHistory[0];
    return Math.max(0, globalStars - baseline.stars);
  }, [sortedHistory, globalStars]);

  // Velocity KPI 2: Stars This Month (Since 1st of current month)
  const starsThisMonth = useMemo(() => {
    if (sortedHistory.length === 0) return 0;
    const now = new Date();
    const monthStartStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const baseline =
      sortedHistory.filter(h => h.date <= monthStartStr).pop() ||
      sortedHistory.find(h => h.date >= monthStartStr) ||
      sortedHistory[0];
    return Math.max(0, globalStars - baseline.stars);
  }, [sortedHistory, globalStars]);

  // Velocity KPI 3: Current Velocity (avg stars/wk & stars/mo based on recent history)
  const velocityData = useMemo(() => {
    if (sortedHistory.length < 2) {
      return { starsPerDay: 0, starsPerWeek: '0.0', starsPerMonth: '0.0' };
    }
    // Use last 30 days or available points
    const recent = sortedHistory.slice(-15);
    const first = recent[0];
    const last = recent[recent.length - 1];
    const dFirst = new Date(first.date + 'T12:00:00').getTime();
    const dLast = new Date(last.date + 'T12:00:00').getTime();
    const daysDiff = Math.max(1, (dLast - dFirst) / 86400000);
    const starDelta = last.stars - first.stars;

    if (starDelta > 0) {
      const perDay = starDelta / daysDiff;
      return {
        starsPerDay: perDay,
        starsPerWeek: (perDay * 7).toFixed(1),
        starsPerMonth: (perDay * 30.4).toFixed(1),
      };
    }
    return { starsPerDay: 0, starsPerWeek: '0.0', starsPerMonth: '0.0' };
  }, [sortedHistory]);

  // Velocity KPI 4: 🎯 Next Milestone ETA Predictor
  const milestonePrediction = useMemo(() => {
    let target = 0;
    if (milestoneTargetMode === '+50') {
      target = Math.floor(globalStars / 50) * 50 + 50;
    } else if (milestoneTargetMode === '+100') {
      target = Math.floor(globalStars / 100) * 100 + 100;
    } else {
      target = maxGlobalStars;
    }

    const remaining = Math.max(0, target - globalStars);
    let etaDateStr = '';
    let daysRemaining = 0;

    if (velocityData.starsPerDay > 0 && remaining > 0) {
      daysRemaining = Math.ceil(remaining / velocityData.starsPerDay);
      const targetDate = new Date(Date.now() + daysRemaining * 86400000);
      etaDateStr = targetDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }

    return {
      target,
      remaining,
      etaDateStr,
      daysRemaining,
      hasVelocity: velocityData.starsPerDay > 0,
    };
  }, [globalStars, maxGlobalStars, milestoneTargetMode, velocityData]);

  // Part 5: "Lowest Hanging Fruit" (Next Closest Stars Radar)
  const lowestHangingFruit = useMemo(() => {
    // 1. Filter available destination pool based on map stock and event exclusion
    const candidatePool = destinations.filter(d => {
      if (effectiveHideZeroMaps && d.needsMap && (d.mapsDone || 0) <= 0) {
        return false;
      }
      if (effectiveHideEventDestinations && d.category === 'Event Flights') {
        return false;
      }
      return true;
    });

    // 2. First priority: destinations that have at least 1 flight logged and < getMaxStars(d)
    const activeDestinations = candidatePool.filter(d => {
      const stars = getStars(d.flightsDone, d.star1Req, d.star2Req, d.star3Req, d.star4Req, d.star5Req);
      return d.flightsDone > 0 && stars < getMaxStars(d);
    });

    // Fallback: all candidate destinations with < getMaxStars(d) (if no logged flights yet in filtered pool)
    const pool =
      activeDestinations.length > 0
        ? activeDestinations
        : candidatePool.filter(d => {
            const stars = getStars(d.flightsDone, d.star1Req, d.star2Req, d.star3Req, d.star4Req, d.star5Req);
            return stars < getMaxStars(d);
          });

    return pool
      .map(d => {
        const stars = getStars(d.flightsDone, d.star1Req, d.star2Req, d.star3Req, d.star4Req, d.star5Req);
        const nextStar = stars + 1;
        const maxStars = getMaxStars(d);
        const reqs = [d.star1Req, d.star2Req, d.star3Req, d.star4Req || 0, d.star5Req || 0];
        const prevReq = stars > 0 ? reqs[stars - 1] : 0;
        const nextReq = reqs[stars] || d.star3Req;
        const flightsRemaining = Math.max(0, nextReq - d.flightsDone);
        const tierTarget = Math.max(1, nextReq - prevReq);
        const tierDone = Math.max(0, d.flightsDone - prevReq);
        const progressPct = Math.min(100, Math.round((tierDone / tierTarget) * 100));

        return {
          destination: d,
          currentStars: stars,
          maxStars,
          nextStar,
          nextReq,
          flightsRemaining,
          progressPct,
        };
      })
      .sort((a, b) => a.flightsRemaining - b.flightsRemaining)
      .slice(0, 5);
  }, [destinations, effectiveHideZeroMaps, effectiveHideEventDestinations]);

  // SVG Chart Geometry & Coordinates
  const chartWidth = 800;
  const chartHeight = 270;
  const padding = { top: 30, right: 35, bottom: 42, left: 60 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const chartPoints = useMemo(() => {
    if (filteredHistory.length === 0) return null;

    const starVals = filteredHistory.map(d => d.stars);
    const minVal = Math.min(...starVals);
    const maxVal = Math.max(...starVals);

    let yMin = minVal;
    let yMax = maxVal;
    if (yMin === yMax) {
      yMin = Math.max(0, yMin - 10);
      yMax = yMax + 10;
    } else {
      const margin = (yMax - yMin) * 0.12;
      yMin = Math.max(0, Math.floor(yMin - margin));
      yMax = Math.ceil(yMax + margin);
    }

    if (filteredHistory.length === 1) {
      const entry = filteredHistory[0];
      const x = padding.left + innerWidth / 2;
      const y = padding.top + innerHeight / 2;
      return {
        points: [{ x, y, entry, idx: 0 }],
        yMin,
        yMax,
        smoothLinePath: '',
        areaPath: '',
      };
    }

    const times = filteredHistory.map(d => new Date(d.date + 'T12:00:00').getTime());
    const minTime = times[0];
    const maxTime = times[times.length - 1];
    const timeSpan = maxTime - minTime;

    const points = filteredHistory.map((entry, idx) => {
      const t = times[idx];
      const x =
        timeSpan > 0
          ? padding.left + ((t - minTime) / timeSpan) * innerWidth
          : padding.left + (idx / Math.max(1, filteredHistory.length - 1)) * innerWidth;
      const y =
        padding.top + innerHeight - ((entry.stars - yMin) / (yMax - yMin)) * innerHeight;
      return { x, y, entry, idx };
    });

    // Build smooth cubic bezier line path
    let linePath = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    if (points.length === 2) {
      linePath += ` L ${points[1].x.toFixed(1)} ${points[1].y.toFixed(1)}`;
    } else {
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i === 0 ? i : i - 1];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        linePath += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
      }
    }

    const bottomY = padding.top + innerHeight;
    const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${bottomY} L ${points[0].x.toFixed(1)} ${bottomY} Z`;

    return {
      points,
      yMin,
      yMax,
      smoothLinePath: linePath,
      areaPath,
    };
  }, [filteredHistory, innerWidth, innerHeight, padding]);

  // Handle Save Manual Milestone
  const handleSaveBackfill = (e: React.FormEvent) => {
    e.preventDefault();
    setBackfillError('');

    if (!backfillDate) {
      setBackfillError('Please select a valid date.');
      return;
    }
    if (isNaN(backfillStars) || backfillStars < 0) {
      setBackfillError('Please enter a valid star count (>= 0).');
      return;
    }

    const existingIdx = starHistory.findIndex(h => h.date === backfillDate);
    let nextHistory: StarHistoryEntry[];

    if (existingIdx >= 0) {
      nextHistory = [...starHistory];
      nextHistory[existingIdx] = {
        ...nextHistory[existingIdx],
        stars: backfillStars,
        isManual: true,
        ...(backfillEventTag.trim() ? { eventTag: backfillEventTag.trim() } : {}),
      };
    } else {
      const newEntry: StarHistoryEntry = {
        date: backfillDate,
        stars: backfillStars,
        isManual: true,
        ...(backfillEventTag.trim() ? { eventTag: backfillEventTag.trim() } : {}),
      };
      nextHistory = [...starHistory, newEntry];
    }

    nextHistory.sort((a, b) => a.date.localeCompare(b.date));
    onUpdateStarHistory(nextHistory);
    setShowAddMilestoneModal(false);
    setBackfillEventTag('');
  };

  // Handle Delete History Entry
  const handleDeleteEntry = (dateToDelete: string) => {
    const updated = starHistory.filter(h => h.date !== dateToDelete);
    if (updated.length === 0) {
      // Keep at least current day seed
      const seeded: StarHistoryEntry = {
        date: getLocalDateString(),
        stars: globalStars,
      };
      onUpdateStarHistory([seeded]);
    } else {
      onUpdateStarHistory(updated);
    }
  };

  // Format date helper for tooltip
  const formatFullDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatShortDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const hoveredPoint =
    hoveredIdx !== null && chartPoints?.points && chartPoints.points[hoveredIdx]
      ? chartPoints.points[hoveredIdx]
      : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Analytics Hero Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-[var(--border-card)] shadow-xl">
        <div
          className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: 'var(--accent)' }}
        />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5 sm:gap-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl theme-badge flex items-center justify-center shadow-2xl shrink-0 p-1 sm:p-1.5 border border-white/10 group">
              <img
                src="icons/deck-stars-3d.png"
                alt="Statistics"
                className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-main)] font-heading">
                Statistics
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 font-normal">
                Track total flight progression, telemetry line velocity, and star milestones
              </p>
            </div>
          </div>

          <div className="bg-black/10 dark:bg-black/20 p-4 rounded-2xl border border-black/10 dark:border-white/5 text-center shrink-0 flex flex-col justify-center">
            <div className="text-3xl font-heading font-semibold text-amber-500 dark:text-amber-300">
              {globalStars.toLocaleString()}
              <span className="text-sm font-mono text-[var(--text-muted)]">
                {' '}
                / {maxGlobalStars.toLocaleString()}
              </span>
            </div>
            <div className="text-xs font-mono font-medium text-amber-500 dark:text-amber-400 mt-1">
              {globalPercentage}% Global Progress
            </div>
            {effectiveTotalOffsetStars > 0 && (
              <div
                className="text-[10px] font-mono text-amber-600 dark:text-amber-400/90 mt-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 inline-block mx-auto"
                title="Includes manual star milestone offsets configured in Flight Progress Ranks"
              >
                +{effectiveTotalOffsetStars.toLocaleString()} sync offset
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Part 3: Velocity KPI Cards & Next Milestone ETA Predictor (4-Card Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Stars This Week */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-[var(--border-card)] shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] font-heading">
              Stars This Week
            </span>
            <div className="w-8 h-8 rounded-xl theme-badge flex items-center justify-center">
              <TrendingUp className="w-4 h-4 theme-accent-text" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-heading font-bold text-[var(--text-main)] flex items-baseline gap-1.5">
              <span>+{starsThisWeek}</span>
              <span className="text-base text-amber-400">⭐</span>
            </div>
            <p className="text-[11px] font-mono text-[var(--text-muted)] mt-1">
              Gained over last 7 days
            </p>
          </div>
        </div>

        {/* Card 2: Stars This Month */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-[var(--border-card)] shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] font-heading">
              Stars This Month
            </span>
            <div className="w-8 h-8 rounded-xl theme-badge flex items-center justify-center">
              <Calendar className="w-4 h-4 theme-accent-text" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-heading font-bold text-[var(--text-main)] flex items-baseline gap-1.5">
              <span>+{starsThisMonth}</span>
              <span className="text-base text-amber-400">⭐</span>
            </div>
            <p className="text-[11px] font-mono text-[var(--text-muted)] mt-1">
              Since 1st of current month
            </p>
          </div>
        </div>

        {/* Card 3: Current Velocity */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-[var(--border-card)] shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] font-heading">
              Current Velocity
            </span>
            <div className="w-8 h-8 rounded-xl theme-badge flex items-center justify-center">
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-heading font-bold text-[var(--text-main)] flex items-baseline gap-1.5">
              <span>{velocityData.starsPerWeek}</span>
              <span className="text-xs font-mono text-[var(--text-muted)]">⭐ / wk</span>
            </div>
            <p className="text-[11px] font-mono text-[var(--text-muted)] mt-1">
              ~{velocityData.starsPerMonth} ⭐ / mo rate
            </p>
          </div>
        </div>

        {/* Card 4: 🎯 Next Milestone ETA Predictor */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-[var(--border-card)] shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] font-heading">
              🎯 Milestone ETA
            </span>
            {/* Toggle +50 / +100 / Max */}
            <div className="flex items-center bg-black/40 p-0.5 rounded-lg border border-white/10 text-[10px] font-mono">
              <button
                onClick={() => setMilestoneTargetMode('+50')}
                className={`px-1.5 py-0.5 rounded ${
                  milestoneTargetMode === '+50'
                    ? 'theme-btn-accent text-white font-bold'
                    : 'text-[var(--text-muted)] hover:text-white'
                }`}
                title="Next 50 star milestone"
              >
                +50
              </button>
              <button
                onClick={() => setMilestoneTargetMode('+100')}
                className={`px-1.5 py-0.5 rounded ${
                  milestoneTargetMode === '+100'
                    ? 'theme-btn-accent text-white font-bold'
                    : 'text-[var(--text-muted)] hover:text-white'
                }`}
                title="Next 100 star milestone"
              >
                +100
              </button>
              <button
                onClick={() => setMilestoneTargetMode('max')}
                className={`px-1.5 py-0.5 rounded ${
                  milestoneTargetMode === 'max'
                    ? 'theme-btn-accent text-white font-bold'
                    : 'text-[var(--text-muted)] hover:text-white'
                }`}
                title="Max possible stars"
              >
                Max
              </button>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline justify-between gap-1">
              <div className="text-xl sm:text-2xl font-heading font-bold text-amber-300">
                {milestonePrediction.target.toLocaleString()} ⭐
              </div>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                {milestonePrediction.remaining} to go
              </span>
            </div>
            <p className="text-[11px] font-mono text-[var(--text-muted)] mt-1 truncate">
              {milestonePrediction.hasVelocity && milestonePrediction.etaDateStr ? (
                <span className="text-emerald-400 font-medium">
                  Est: ~{milestonePrediction.etaDateStr} ({milestonePrediction.daysRemaining}d)
                </span>
              ) : (
                <span className="opacity-75">Log more days or add past milestone</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Part 2: Interactive SVG Area/Line Chart ("Star Progression & Velocity Telemetry") */}
      <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-[var(--border-card)] shadow-xl relative overflow-hidden space-y-4">
        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl theme-badge flex items-center justify-center shrink-0">
              <Activity className="w-4 h-4 theme-accent-text" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold uppercase tracking-wider text-[var(--text-main)] font-heading">
                Star Progression & Velocity Telemetry
              </h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                Daily star progression trajectory and historical milestone markers
              </p>
            </div>
          </div>

          {/* Right Toolbar Actions: Backfill, Manage History, Timeframe Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setBackfillStars(globalStars);
                setShowAddMilestoneModal(true);
              }}
              className="tactile-btn px-2.5 py-1.5 rounded-xl border border-[var(--border-card)] hover:border-[var(--border-active)] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm theme-btn-soft"
              title="Add a past milestone to backfill history"
            >
              <Plus className="w-3.5 h-3.5 theme-accent-text" />
              <span>+ Add Past Milestone</span>
            </button>

            <button
              onClick={() => setShowManageHistoryModal(true)}
              className="tactile-btn px-2.5 py-1.5 rounded-xl border border-[var(--border-card)] hover:border-[var(--border-active)] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm theme-btn-soft"
              title="View and manage historical records"
            >
              <History className="w-3.5 h-3.5" />
              <span>Manage ({starHistory.length})</span>
            </button>

            {/* Timeframe Filter Pills */}
            <div className="flex items-center bg-black/40 p-0.5 rounded-xl border border-white/10 text-xs font-mono">
              {(['7D', '30D', '90D', '1Y', 'ALL'] as const).map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    timeframe === tf
                      ? 'theme-btn-accent font-semibold shadow-sm text-white'
                      : 'text-[var(--text-muted)] hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SVG Chart Container */}
        <div className="relative w-full overflow-hidden select-none">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto overflow-visible block"
            style={{ maxHeight: '320px' }}
          >
            <defs>
              <linearGradient id="starProgressGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines & Y-Axis Labels */}
            {chartPoints?.yMin !== undefined &&
              chartPoints?.yMax !== undefined &&
              [0, 0.33, 0.66, 1].map((pct, idx) => {
                const val = Math.round(
                  chartPoints.yMin + (chartPoints.yMax - chartPoints.yMin) * pct
                );
                const y = padding.top + innerHeight - pct * innerHeight;
                return (
                  <g key={idx}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={padding.left + innerWidth}
                      y2={y}
                      stroke="currentColor"
                      className="text-[var(--text-muted)] opacity-15"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={padding.left - 10}
                      y={y + 3}
                      textAnchor="end"
                      className="text-[10px] font-mono fill-[var(--text-muted)] opacity-85 select-none"
                    >
                      {val.toLocaleString()}
                    </text>
                  </g>
                );
              })}

            {/* Area Fill */}
            {chartPoints?.areaPath && (
              <path d={chartPoints.areaPath} fill="url(#starProgressGrad)" />
            )}

            {/* Curved Line Path */}
            {chartPoints?.smoothLinePath && (
              <path
                d={chartPoints.smoothLinePath}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Single point horizontal guideline fallback */}
            {chartPoints?.points && chartPoints.points.length === 1 && (
              <line
                x1={padding.left}
                y1={chartPoints.points[0].y}
                x2={padding.left + innerWidth}
                y2={chartPoints.points[0].y}
                stroke="var(--accent)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.5"
              />
            )}

            {/* Active Crosshair vertical line on hover */}
            {hoveredPoint && (
              <line
                x1={hoveredPoint.x}
                y1={padding.top}
                x2={hoveredPoint.x}
                y2={padding.top + innerHeight}
                stroke="var(--accent)"
                strokeDasharray="3 3"
                strokeWidth="1.5"
                opacity="0.65"
              />
            )}

            {/* Data point circles */}
            {chartPoints?.points &&
              chartPoints.points.map((pt, idx) => {
                const isHovered = hoveredIdx === idx;
                const hasEvent = Boolean(pt.entry.eventTag);
                return (
                  <g key={idx}>
                    {/* Larger hit target for mouse/touch */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={16}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                      onClick={() => setHoveredIdx(idx)}
                    />
                    {/* Visual dot */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 6 : hasEvent ? 4.5 : 3.5}
                      fill={hasEvent ? '#f59e0b' : 'var(--accent)'}
                      stroke="var(--bg-card)"
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      className="pointer-events-none transition-all duration-150"
                    />
                  </g>
                );
              })}

            {/* X-Axis Date Labels along the bottom */}
            {chartPoints?.points &&
              chartPoints.points.length > 0 &&
              (() => {
                const pts = chartPoints.points;
                // Pick nicely spaced labels (up to 5)
                const indicesToShow = new Set<number>();
                indicesToShow.add(0);
                indicesToShow.add(pts.length - 1);
                if (pts.length > 3) {
                  indicesToShow.add(Math.floor(pts.length / 2));
                }
                if (pts.length > 6) {
                  indicesToShow.add(Math.floor(pts.length / 4));
                  indicesToShow.add(Math.floor((3 * pts.length) / 4));
                }

                return Array.from(indicesToShow).map(idx => {
                  const pt = pts[idx];
                  if (!pt) return null;
                  return (
                    <text
                      key={idx}
                      x={pt.x}
                      y={chartHeight - 12}
                      textAnchor="middle"
                      className="text-[10px] font-mono fill-[var(--text-muted)] opacity-85 select-none"
                    >
                      {formatShortDate(pt.entry.date)}
                    </text>
                  );
                });
              })()}
          </svg>

          {/* Interactive Floating Tooltip */}
          {hoveredPoint && (
            <div
              className="absolute z-30 pointer-events-none transition-all duration-150 glass-panel rounded-2xl p-3 border border-[var(--border-card)] shadow-2xl flex flex-col gap-1 min-w-[190px]"
              style={{
                left: `${Math.min(
                  Math.max(10, (hoveredPoint.x / chartWidth) * 100),
                  72
                )}%`,
                top: `${Math.max(
                  8,
                  Math.min(
                    (hoveredPoint.y / chartHeight) * 100 - 30,
                    55
                  )
                )}%`,
                transform: 'translate(-50%, -100%)',
              }}
            >
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5">
                <span className="text-[11px] font-mono text-[var(--text-muted)]">
                  {formatFullDate(hoveredPoint.entry.date)}
                </span>
                {hoveredPoint.entry.isManual && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                    Manual
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 pt-0.5">
                <span className="text-base font-bold font-heading text-[var(--text-main)]">
                  {hoveredPoint.entry.stars.toLocaleString()} ⭐
                </span>
                {/* Net Delta since previous point */}
                {(() => {
                  const pts = chartPoints?.points || [];
                  const prevPt = hoveredPoint.idx > 0 ? pts[hoveredPoint.idx - 1] : null;
                  if (!prevPt) {
                    return (
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        Baseline
                      </span>
                    );
                  }
                  const delta = hoveredPoint.entry.stars - prevPt.entry.stars;
                  return (
                    <span
                      className={`text-xs font-mono font-bold ${
                        delta > 0
                          ? 'text-emerald-400'
                          : delta < 0
                          ? 'text-rose-400'
                          : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {delta > 0 ? `+${delta} ⭐` : `${delta} ⭐`}
                    </span>
                  );
                })()}
              </div>

              {/* Total Flights logged if recorded */}
              {hoveredPoint.entry.totalFlights !== undefined && (
                <div className="text-[10px] font-mono text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                  <Plane className="w-3 h-3 theme-accent-text" />
                  <span>{hoveredPoint.entry.totalFlights.toLocaleString()} flights</span>
                </div>
              )}

              {/* Event Badge if present */}
              {hoveredPoint.entry.eventTag && (
                <div className="mt-1 pt-1 border-t border-white/5 flex items-center gap-1 text-[11px] font-semibold text-amber-300">
                  <span>📅</span>
                  <span className="truncate">{hoveredPoint.entry.eventTag}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4. Part 5: 🎯 "Lowest Hanging Fruit" (Next Closest Stars Radar) */}
      <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-[var(--border-card)] shadow-xl relative overflow-hidden space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl theme-badge flex items-center justify-center shrink-0">
              <Crosshair className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold uppercase tracking-wider text-[var(--text-main)] font-heading">
                Next Closest Stars (Lowest Hanging Fruit)
              </h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                Top reachable destinations closest to earning their next flight progress star rank
              </p>
            </div>
          </div>

          {/* Quick Filter Checkboxes (Matches Flights toolbar) */}
          <div className="flex flex-wrap items-center gap-3 bg-black/25 px-3 py-1.5 rounded-xl border border-white/5">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={effectiveHideZeroMaps}
                onChange={e => handleToggleHideZeroMaps(e.target.checked)}
                style={{ accentColor: 'var(--accent)' }}
                className="rounded"
              />
              <span
                className={`text-xs transition-colors ${
                  effectiveHideZeroMaps ? 'theme-accent-text font-medium' : 'text-[var(--text-muted)]'
                }`}
              >
                🗺️ Hide destinations with 0 maps
              </span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={effectiveHideEventDestinations}
                onChange={e => handleToggleHideEventDestinations(e.target.checked)}
                style={{ accentColor: 'var(--accent)' }}
                className="rounded"
              />
              <span
                className={`text-xs transition-colors ${
                  effectiveHideEventDestinations ? 'text-purple-300 font-medium' : 'text-[var(--text-muted)]'
                }`}
              >
                🎪 Hide Event Destinations
              </span>
            </label>
          </div>
        </div>

        {lowestHangingFruit.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-[var(--text-muted)]">
            No reachable destinations found matching the active filters. Try unchecking &quot;Hide destinations with 0 maps&quot; or &quot;Hide Event Destinations&quot;.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {lowestHangingFruit.map((item, idx) => {
              return (
                <div
                  key={item.destination.id || idx}
                  onClick={() => onNavigateToDestination?.(item.destination.destination)}
                  className="p-3.5 sm:p-4 rounded-2xl bg-black/20 hover:bg-white/5 border border-white/5 hover:border-[var(--border-active)] transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm select-none"
                  title={`Click to view ${item.destination.destination} in Flights deck`}
                >
                  {/* Left: Destination & Aircraft */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl theme-badge flex items-center justify-center shrink-0 font-bold font-heading text-xs text-amber-300 border border-white/10">
                      #{idx + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-heading font-semibold text-sm sm:text-base text-[var(--text-main)] truncate group-hover:text-[var(--accent)] transition-colors">
                          {item.destination.destination}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-[var(--text-muted)] border border-white/10 shrink-0">
                          {item.destination.aircraft}
                        </span>
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">
                        {item.destination.group} • {item.destination.category}
                      </div>
                    </div>
                  </div>

                  {/* Right: Star progress, Progress Bar, Remaining Counts */}
                  <div className="flex flex-col sm:items-end gap-1.5 shrink-0 min-w-[240px]">
                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full">
                      {/* Current Star Badges */}
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: item.maxStars }).map((_, starIdx) => {
                          const earned = starIdx < item.currentStars;
                          return (
                            <span
                              key={starIdx}
                              className={`text-sm ${
                                earned ? 'text-amber-400' : 'text-white/20'
                              }`}
                            >
                              ★
                            </span>
                          );
                        })}
                      </div>

                      {/* Remaining to next star text */}
                      <span className="text-xs font-mono font-medium text-[var(--text-main)]">
                        Only{' '}
                        <strong className="text-amber-300 font-bold">
                          {item.flightsRemaining}
                        </strong>{' '}
                        flights left for Star #{item.nextStar}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-2.5 w-full">
                      <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden">
                        <div
                          className="h-full theme-progress-fill rounded-full transition-all duration-300"
                          style={{ width: `${item.progressPct}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-[var(--text-muted)] w-24 text-right truncate">
                        {item.destination.flightsDone} / {item.nextReq}
                      </span>
                      <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-1 group-hover:text-[var(--accent)] transition-all shrink-0" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Flight Progress / Star Ranks Panel (Game HUD Replica) */}
      <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-[var(--border-card)] shadow-xl relative overflow-hidden space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <img
              src="icons/star-icon.png"
              alt="Star Ranks"
              className="w-5 h-5 object-contain drop-shadow"
            />
            <div>
              <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--text-main)] font-heading">
                Flight Progress Ranks
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  {starCountMode === 'cumulative' &&
                    'Cumulative destinations reaching each milestone tier (In-Game HUD format)'}
                  {starCountMode === 'exact' &&
                    'Destinations currently at each exact star level'}
                  {starCountMode === 'offset' &&
                    'Add manual star offsets for locked event destinations so AC-Tracker matches your in-game HUD'}
                </p>
                {starCountMode === 'offset' && hasNonZeroOffsets && (
                  <button
                    type="button"
                    onClick={handleResetOffsets}
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 underline underline-offset-2 transition-colors cursor-pointer mt-0.5"
                    title="Reset all star offsets to 0"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset to 0
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mode Toggle: In-Game Milestones vs Exact Tier vs Sync Offset */}
          <div className="flex items-center bg-black/10 dark:bg-black/40 p-0.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-mono shrink-0">
            <button
              onClick={() => toggleStarCountMode('cumulative')}
              className={`px-3 py-1 rounded-lg transition-all ${
                starCountMode === 'cumulative'
                  ? 'theme-btn-accent font-semibold shadow-sm text-white'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
              title="Cumulative milestones (matches the in-game Flight Progress popup)"
            >
              In-Game Milestones
            </button>
            <button
              onClick={() => toggleStarCountMode('exact')}
              className={`px-3 py-1 rounded-lg transition-all ${
                starCountMode === 'exact'
                  ? 'theme-btn-accent font-semibold shadow-sm text-white'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
              title="Exact current star tier breakdown"
            >
              Exact Tier
            </button>
            <button
              onClick={() => toggleStarCountMode('offset')}
              className={`px-3 py-1 rounded-lg transition-all ${
                starCountMode === 'offset'
                  ? 'theme-btn-accent font-semibold shadow-sm text-white'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
              title="Add manual star offsets for locked event destinations"
            >
              Sync Offset
            </button>
          </div>
        </div>

        {/* The 5 Stacked Star Rank Rows (Ace 5★ down to Specialist 1★) */}
        <div className="space-y-1.5 sm:space-y-2">
          {GAME_STAR_RANKS.map(rank => {
            const isOffsetMode = starCountMode === 'offset';
            const isInteractive = !isOffsetMode;
            const isFiltered = filterStarRank === rank.star;

            const trackedCumulative = starCounts.cumulative[rank.key];
            const offset = safeStarOffsets[rank.key] || 0;
            const cumulativeTotal = trackedCumulative + offset;

            const trackedExact = starCounts.exact[rank.key];
            const adjustedExact = adjustedExactCounts[rank.key];
            const exactDiff = adjustedExact - trackedExact;

            return (
              <div
                key={rank.star}
                onClick={() => {
                  if (isInteractive) {
                    handleStarRankClick(rank.star);
                  }
                }}
                className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-2xl flex items-center justify-between transition-all duration-150 select-none border ${
                  isInteractive
                    ? isFiltered
                      ? 'bg-amber-500/15 border-amber-500/40 shadow-sm cursor-pointer group'
                      : 'hover:bg-black/5 dark:hover:bg-white/5 border-transparent cursor-pointer group'
                    : 'border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/[0.02]'
                }`}
                title={
                  isInteractive
                    ? `Click to view ${
                        starCountMode === 'cumulative' ? `≥ ${rank.star}★` : `${rank.star}★`
                      } ${rank.name} routes in Flights table`
                    : undefined
                }
              >
                {/* Stars (left-aligned, 3D golden game stars) */}
                <div className="flex items-center gap-1 shrink-0">
                  {Array.from({ length: rank.star }).map((_, i) => (
                    <img
                      key={i}
                      src="icons/star-icon.png"
                      alt="★"
                      className={`w-5 h-5 sm:w-6 sm:h-6 object-contain drop-shadow select-none pointer-events-none transition-transform ${
                        isInteractive ? 'group-hover:scale-105' : ''
                      }`}
                    />
                  ))}
                </div>

                {/* Rank Name */}
                <span className="font-heading font-medium sm:font-semibold text-base sm:text-lg text-[var(--text-main)] ml-2.5 sm:ml-4 shrink-0 tracking-tight">
                  {rank.name}
                </span>

                {/* Hatched Runway-Style Leader Line */}
                <div
                  className={`flex-1 min-w-[12px] sm:min-w-[20px] mx-2 sm:mx-4 h-2 rounded-sm opacity-30 transition-opacity ${
                    isInteractive ? 'group-hover:opacity-65' : ''
                  }`}
                  style={{
                    background:
                      'repeating-linear-gradient(65deg, currentColor 0px, currentColor 6px, transparent 6px, transparent 10px)',
                  }}
                />

                {/* Right Side: Tab-dependent */}
                {starCountMode === 'cumulative' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-heading font-semibold text-lg sm:text-xl text-[var(--text-main)] tabular-nums group-hover:text-amber-500 dark:group-hover:text-amber-300 transition-colors">
                      {cumulativeTotal.toLocaleString()}
                    </span>
                    {offset > 0 && (
                      <span
                        className="text-[10px] sm:text-xs font-mono font-medium px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-500 dark:text-amber-300 border border-amber-500/30"
                        title={`Includes +${offset} manual sync offset (${trackedCumulative.toLocaleString()} tracked)`}
                      >
                        +{offset}
                      </span>
                    )}
                  </div>
                )}

                {starCountMode === 'exact' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-heading font-semibold text-lg sm:text-xl text-[var(--text-main)] tabular-nums group-hover:text-amber-500 dark:group-hover:text-amber-300 transition-colors">
                      {adjustedExact.toLocaleString()}
                    </span>
                    {exactDiff !== 0 && (
                      <span
                        className="text-[10px] sm:text-xs font-mono font-medium px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-500 dark:text-amber-300 border border-amber-500/30"
                        title={`Adjusted with sync offset (${trackedExact.toLocaleString()} tracked)`}
                      >
                        {exactDiff > 0 ? `+${exactDiff}` : `${exactDiff}`}
                      </span>
                    )}
                  </div>
                )}

                {starCountMode === 'offset' && (
                  <div
                    className="flex items-center gap-1.5 sm:gap-2.5 shrink-0"
                    onClick={e => e.stopPropagation()}
                  >
                    {/* Tracked Count + */}
                    <div className="items-center gap-1 text-xs sm:text-sm font-mono text-[var(--text-muted)] hidden xs:flex">
                      <span className="opacity-80" title="Tracked milestone routes in AC-Tracker">
                        {trackedCumulative.toLocaleString()}
                      </span>
                      <span className="opacity-40">+</span>
                    </div>

                    {/* Stepper with [-] [input] [+] */}
                    <div className="flex items-center bg-black/10 dark:bg-black/50 rounded-xl border border-black/10 dark:border-white/10 p-0.5 shadow-inner">
                      <button
                        type="button"
                        onClick={() => handleUpdateOffset(rank.key, Math.max(0, offset - 1))}
                        disabled={offset <= 0}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 transition-all disabled:opacity-25 disabled:pointer-events-none"
                        title={`Decrement ${rank.name} offset (-1)`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={offset}
                        onChange={e => {
                          const val = parseInt(e.target.value, 10);
                          handleUpdateOffset(rank.key, isNaN(val) ? 0 : Math.max(0, val));
                        }}
                        className="w-12 sm:w-14 h-7 sm:h-8 text-center bg-transparent text-amber-500 dark:text-amber-300 font-mono font-bold text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-[var(--accent)] rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        title={`Manual ${rank.name} milestone offset`}
                      />
                      <button
                        type="button"
                        onClick={() => handleUpdateOffset(rank.key, offset + 1)}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 transition-all"
                        title={`Increment ${rank.name} offset (+1)`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Result Preview: = Total */}
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-mono">
                      <span className="text-[var(--text-muted)] opacity-60">=</span>
                      <span
                        className="font-heading font-bold text-base sm:text-lg text-[var(--text-main)] tabular-nums min-w-[32px] sm:min-w-[42px] text-right"
                        title="Calibrated total matching In-Game HUD"
                      >
                        {cumulativeTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Category Breakdown Table */}
      <div className="glass-panel rounded-3xl p-6 border border-[var(--border-card)] space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
          <BarChart3 className="w-4 h-4 theme-accent-text" /> Progress by Category
        </h3>
        <div className="divide-y divide-white/5">
          {categories.map(cat => {
            const stats = categoryStarsMap[cat];
            if (!stats || stats.max === 0) return null;
            const pct = Math.round((stats.earned / stats.max) * 100);
            return (
              <div
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-white/5 px-3 rounded-xl transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {CATEGORY_ICONS[cat] ? (
                    <img
                      src={CATEGORY_ICONS[cat]}
                      alt={cat}
                      className="w-10 h-10 sm:w-11 sm:h-11 object-contain shrink-0 drop-shadow"
                    />
                  ) : (
                    <Navigation className="w-8 h-8 theme-accent-text shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="text-sm sm:text-base font-semibold text-[var(--text-main)] truncate group-hover:text-[var(--accent)] transition-colors">
                      {cat}
                    </div>
                    <div className="text-xs sm:text-sm font-mono text-[var(--text-muted)] mt-0.5 flex items-center gap-1.5">
                      <span className="font-bold text-amber-300 text-sm sm:text-base">
                        {stats.earned.toLocaleString()}
                      </span>
                      <span className="opacity-40 font-normal">/</span>
                      <span className="font-semibold text-[var(--text-main)] text-sm sm:text-base">
                        {stats.max.toLocaleString()}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] font-sans ml-0.5">
                        Stars Earned
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="w-28 sm:w-44 h-2.5 bg-black/40 rounded-full overflow-hidden hidden sm:block">
                    <div
                      className="h-full theme-progress-fill rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-sm font-mono font-bold theme-accent-text w-14 text-right">
                    {pct}%
                  </span>
                  <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL 1: + Add Past Milestone Modal */}
      {showAddMilestoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-[var(--border-card)] shadow-2xl max-w-md w-full relative space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl theme-badge flex items-center justify-center">
                  <Plus className="w-4 h-4 theme-accent-text" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-[var(--text-main)]">
                  Add Past Milestone
                </h3>
              </div>
              <button
                onClick={() => setShowAddMilestoneModal(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-[var(--text-muted)] hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBackfill} className="space-y-4">
              {backfillError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono">
                  {backfillError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Milestone Date
                </label>
                <input
                  type="date"
                  value={backfillDate}
                  max={getLocalDateString()}
                  onChange={e => setBackfillDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-[var(--text-main)] text-sm font-mono focus:outline-none focus:border-[var(--accent)]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Total Stars on this Date
                </label>
                <input
                  type="number"
                  min="0"
                  max={Math.max(maxGlobalStars, globalStars)}
                  value={backfillStars}
                  onChange={e => setBackfillStars(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-[var(--text-main)] text-sm font-mono focus:outline-none focus:border-[var(--accent)]"
                  placeholder="e.g. 900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Optional Note / Event Name
                </label>
                <input
                  type="text"
                  value={backfillEventTag}
                  onChange={e => setBackfillEventTag(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--accent)]"
                  placeholder="e.g. Dragon Rising Event, 900 Stars Celebration"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddMilestoneModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="theme-btn-accent px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-md transition-all hover:scale-[1.02]"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Manage History Records Modal */}
      {showManageHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-[var(--border-card)] shadow-2xl max-w-lg w-full relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl theme-badge flex items-center justify-center">
                  <History className="w-4 h-4 theme-accent-text" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg text-[var(--text-main)]">
                    Star Progression History
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    {starHistory.length} total snapshots recorded
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowManageHistoryModal(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-[var(--text-muted)] hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[360px] overflow-y-auto space-y-2 pr-1 divide-y divide-white/5">
              {[...starHistory]
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((entry, idx) => (
                  <div
                    key={entry.date || idx}
                    className="pt-2.5 pb-2.5 flex items-center justify-between gap-3 px-2 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-semibold text-[var(--text-main)]">
                          {entry.date}
                        </span>
                        {entry.isManual && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                            Manual
                          </span>
                        )}
                        {entry.eventTag && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-medium truncate max-w-[150px]">
                            📅 {entry.eventTag}
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-mono text-[var(--text-muted)] mt-0.5">
                        <span className="text-amber-300 font-bold">{entry.stars} ⭐</span>
                        {entry.totalFlights !== undefined && (
                          <span className="ml-2">({entry.totalFlights.toLocaleString()} flights)</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteEntry(entry.date)}
                      className="p-2 rounded-lg hover:bg-rose-500/20 text-[var(--text-muted)] hover:text-rose-400 transition-colors shrink-0"
                      title={`Delete entry for ${entry.date}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowManageHistoryModal(false)}
                className="theme-btn-accent px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-md transition-all hover:scale-[1.02]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
