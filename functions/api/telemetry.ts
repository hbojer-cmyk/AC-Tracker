// Cloudflare Pages Function: /api/telemetry
// Collects anonymous pilot telemetry & serves global fleet analytics

interface Env {
  TELEMETRY_KV?: {
    get: (key: string, type?: string) => Promise<any>;
    put: (key: string, value: string, options?: any) => Promise<void>;
  };
}

interface PilotTelemetry {
  id: string;
  name: string;
  avatar: string;
  acCode?: string;
  totalFlights: number;
  totalStars: number;
  routesCount: number;
  missionsCount: number;
  theme: string;
  density: string;
  starMode: string;
  features: string[];
  version: string;
  firstSeen?: number;
  lastSeen: number;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}

// GET /api/telemetry - Returns global telemetry & aggregated stats
export async function onRequestGet(context: { env: Env }) {
  const { env } = context;

  // Check if KV is bound in Cloudflare Pages settings
  if (!env.TELEMETRY_KV) {
    return new Response(
      JSON.stringify({
        status: 'setup_needed',
        message: 'Cloudflare KV namespace binding TELEMETRY_KV is not yet configured.',
        setupGuide: {
          step1: 'Go to Cloudflare Dashboard -> Storage & Databases -> KV -> Create Namespace named AC_TELEMETRY',
          step2: 'Go to Workers & Pages -> ac-tracker -> Settings -> Functions -> KV namespace bindings',
          step3: 'Add variable TELEMETRY_KV bound to AC_TELEMETRY',
        },
        pilots: [],
        stats: null,
      }),
      { status: 200, headers: CORS_HEADERS }
    );
  }

  try {
    const rawPilots = await env.TELEMETRY_KV.get('index:pilots', 'json');
    const pilots: PilotTelemetry[] = Array.isArray(rawPilots) ? rawPilots : [];

    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    let activeToday = 0;
    let active7d = 0;
    let totalFlights = 0;
    let totalStars = 0;
    const featureCounts: Record<string, number> = {};

    pilots.forEach(p => {
      if (p.lastSeen > oneDayAgo) activeToday++;
      if (p.lastSeen > sevenDaysAgo) active7d++;
      totalFlights += p.totalFlights || 0;
      totalStars += p.totalStars || 0;

      if (Array.isArray(p.features)) {
        p.features.forEach(f => {
          featureCounts[f] = (featureCounts[f] || 0) + 1;
        });
      }
    });

    const totalPilots = pilots.length;
    const featureAdoption: Record<string, number> = {};
    if (totalPilots > 0) {
      Object.entries(featureCounts).forEach(([feat, count]) => {
        featureAdoption[feat] = Math.round((count / totalPilots) * 100);
      });
    }

    return new Response(
      JSON.stringify({
        status: 'ok',
        pilots,
        stats: {
          totalPilots,
          activeToday,
          active7d,
          totalFlights,
          totalStars,
          featureCounts,
          featureAdoption,
          lastUpdated: now,
        },
      }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        status: 'error',
        message: err?.message || String(err),
      }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

// POST /api/telemetry - Ingests anonymous heartbeat from a player
export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  if (!env.TELEMETRY_KV) {
    return new Response(
      JSON.stringify({
        status: 'setup_needed',
        message: 'TELEMETRY_KV binding missing.',
      }),
      { status: 200, headers: CORS_HEADERS }
    );
  }

  try {
    const payload = await request.json();
    if (!payload || !payload.id) {
      return new Response(
        JSON.stringify({ error: 'Missing pilot ID' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const now = Date.now();
    const incoming: PilotTelemetry = {
      id: String(payload.id).slice(0, 64),
      name: String(payload.name || 'Anonymous Pilot').slice(0, 48),
      avatar: String(payload.avatar || '✈️').slice(0, 256),
      acCode: payload.acCode ? String(payload.acCode).slice(0, 24) : '',
      totalFlights: Math.max(0, parseInt(payload.totalFlights, 10) || 0),
      totalStars: Math.max(0, parseInt(payload.totalStars, 10) || 0),
      routesCount: Math.max(0, parseInt(payload.routesCount, 10) || 0),
      missionsCount: Math.max(0, parseInt(payload.missionsCount, 10) || 0),
      theme: String(payload.theme || 'stealth-ghost').slice(0, 32),
      density: String(payload.density || 'compact').slice(0, 16),
      starMode: String(payload.starMode || 'cumulative').slice(0, 16),
      features: Array.isArray(payload.features) ? payload.features.slice(0, 32) : [],
      version: String(payload.version || 'unknown').slice(0, 24),
      lastSeen: now,
    };

    // Retrieve pilot list index
    const rawPilots = await env.TELEMETRY_KV.get('index:pilots', 'json');
    let pilots: PilotTelemetry[] = Array.isArray(rawPilots) ? rawPilots : [];

    // Find and update or append
    const existingIndex = pilots.findIndex(p => p.id === incoming.id);
    if (existingIndex >= 0) {
      incoming.firstSeen = pilots[existingIndex].firstSeen || now;
      pilots[existingIndex] = incoming;
    } else {
      incoming.firstSeen = now;
      pilots.push(incoming);
    }

    // Sort by lastSeen descending
    pilots.sort((a, b) => b.lastSeen - a.lastSeen);

    // Keep up to 500 most recently active pilots
    if (pilots.length > 500) {
      pilots = pilots.slice(0, 500);
    }

    // Save back to KV
    await env.TELEMETRY_KV.put('index:pilots', JSON.stringify(pilots));

    return new Response(
      JSON.stringify({ success: true, pilotId: incoming.id }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || String(err) }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
