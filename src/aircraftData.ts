export const OWNABLE_AIRCRAFT = [
  'Swift', 'Swallow', 'Owl', 'Hawk', 'Raven', 'Eagle',
  'Jumbo', 'Giant', 'Falcon', 'Thunderbird', 'Condor',
  'Sparrow', 'Crossbill', 'Goldfinch'
];

export const ALL_AIRCRAFT_TYPES = [
  'Thunderbird', 'Crossbill', 'Goldfinch', 'Swallow', 'Sparrow',
  'Falcon', 'Condor', 'Sleigh', 'Swift', 'Raven', 'Eagle',
  'Jumbo', 'Giant', 'Hawk', 'Owl', 'LP1', 'LP2', 'LP3'
];

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

