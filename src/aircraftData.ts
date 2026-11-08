export const OWNABLE_AIRCRAFT = [
  'Swift', 'Swallow', 'Owl', 'Hawk', 'Raven', 'Eagle',
  'Jumbo', 'Giant', 'Falcon', 'Thunderbird', 'Condor',
  'Sparrow', 'Crossbill', 'Goldfinch'
];

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

export const ALL_AIRCRAFT_TYPES = [
  'Thunderbird', 'Crossbill', 'Goldfinch', 'Swallow', 'Sparrow',
  'Falcon', 'Condor', 'Sleigh', 'Swift', 'Raven', 'Eagle',
  'Jumbo', 'Giant', 'Hawk', 'Owl', 'LP1', 'LP2', 'LP3'
];

export const AIRCRAFT_ORDER: Record<string, number> = {
  Swallow: 1,
  Swift: 2,
  Owl: 3,
  Hawk: 4,
  Raven: 5,
  Eagle: 6,
  Jumbo: 7,
  Giant: 8,
  Falcon: 9,
  Thunderbird: 10,
  Condor: 11,
  Sparrow: 12,
  Crossbill: 13,
  Goldfinch: 14,
  Sleigh: 15,
};

export interface AircraftInstance {
  id: string;
  type: string;
  nickname: string;
  speed: number;
  profit: number;
  itemDrop: number;
}

export const getAircraftTypeFromName = (name: string, fallback: string = 'Swift'): string => {
  if (!name) return fallback;
  for (const type of OWNABLE_AIRCRAFT) {
    const regex = new RegExp(`(?:^|\\b|_|-)${type}(?:\\b|\\d|_|-|$)`, 'i');
    if (regex.test(name)) {
      return type;
    }
  }
  return fallback;
};

export const adjustAircraftList = (airplanes: any[]): AircraftInstance[] => {
  if (!Array.isArray(airplanes)) return [];
  return airplanes.map((plane, index) => {
    const name = plane.nickname || plane.name || `Aircraft ${index + 1}`;
    const derivedType = (plane.type && ALL_AIRCRAFT_TYPES.includes(plane.type))
      ? plane.type
      : getAircraftTypeFromName(name, 'Swift');
    return {
      id: plane.id || `${Date.now()}-${index}`,
      type: derivedType,
      nickname: name,
      speed: Number(plane.speed) || 0,
      profit: Number(plane.profit) || 0,
      itemDrop: Number(plane.itemDrop) || 0,
    };
  });
};

