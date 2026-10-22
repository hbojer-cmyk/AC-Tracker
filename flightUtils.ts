// flightUtils.ts - Shared Flight & Progression Calculation Utilities

export interface FlightDestination {
  id: string;
  aircraft: string;
  category: string;
  group: string;
  destination: string;
  icon?: string;
  star1Req: number;
  star2Req: number;
  star3Req: number;
  star4Req?: number;
  star5Req?: number;
  maxStars: number;
  flightsDone: number;
  mapsDone?: number;
  needsMap: boolean;
  mapDuration?: string;
  lastUpdated: number;
  isCustomList?: boolean;
}

export const GAME_STAR_RANKS = [
  { star: 5, name: 'Ace', key: 'ace' as const },
  { star: 4, name: 'Captain', key: 'captain' as const },
  { star: 3, name: 'Expert', key: 'expert' as const },
  { star: 2, name: 'Master', key: 'master' as const },
  { star: 1, name: 'Specialist', key: 'specialist' as const },
];

export const getMaxStars = (d: { star4Req?: number; star5Req?: number; maxStars?: number }): number => {
  if (d.maxStars) return d.maxStars;
  if (d.star5Req && d.star5Req > 0) return 5;
  if (d.star4Req && d.star4Req > 0) return 4;
  return 3;
};

export const getStars = (
  done: number,
  s1: number,
  s2: number,
  s3: number,
  s4?: number,
  s5?: number
): number => {
  if (s5 && s5 > 0 && done >= s5) return 5;
  if (s4 && s4 > 0 && done >= s4) return 4;
  if (done >= s3) return 3;
  if (done >= s2) return 2;
  if (done >= s1) return 1;
  return 0;
};

export interface NextStarInfo {
  nextReq: number;
  nextStar: number;
  rank: string;
  needed: number;
}

export const getNextStarInfo = (d: FlightDestination): NextStarInfo => {
  const reqs: { req: number; star: number; rank: string }[] = [
    { req: d.star1Req, star: 1, rank: 'Specialist' },
    { req: d.star2Req, star: 2, rank: 'Master' },
    { req: d.star3Req, star: 3, rank: 'Expert' },
  ];
  if (d.star4Req && d.star4Req > 0) reqs.push({ req: d.star4Req, star: 4, rank: 'Captain' });
  if (d.star5Req && d.star5Req > 0) reqs.push({ req: d.star5Req, star: 5, rank: 'Ace' });

  for (const item of reqs) {
    if (d.flightsDone < item.req) {
      return {
        nextReq: item.req,
        nextStar: item.star,
        rank: item.rank,
        needed: item.req - d.flightsDone,
      };
    }
  }
  const maxReq = reqs[reqs.length - 1].req;
  const maxStar = reqs[reqs.length - 1].star;
  const maxRank = reqs[reqs.length - 1].rank;
  return { nextReq: maxReq, nextStar: maxStar, rank: maxRank, needed: 0 };
};

/** Get local date string YYYY-MM-DD */
export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
