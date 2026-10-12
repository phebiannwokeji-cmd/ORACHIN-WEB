// src/lib/config/business.ts
// Mandated by stack.md, decision-gates.md, enquiry-and-communications.md
// Centralizes business contacts, hours, responders, commercial settings, and decision gates.

export type GateState = 'configured' | 'cleared';

export interface DecisionGate {
  readonly id: string;
  readonly name: string;
  readonly state: GateState;
  readonly recordedOn: string;
  readonly source: string;
  readonly blocks: string;
}

export const GATES_REGISTRY: Record<string, DecisionGate> = {
  G1: {
    id: 'G1',
    name: 'Quote issuance',
    state: 'configured',
    recordedOn: '2026-10-11',
    source: 'decision-gates.md',
    blocks: 'Real quotes to customers',
  },
  G2: {
    id: 'G2',
    name: 'Live acceptance',
    state: 'configured',
    recordedOn: '2026-10-11',
    source: 'decision-gates.md',
    blocks: 'Recording real acceptances',
  },
  G3: {
    id: 'G3',
    name: 'Live release',
    state: 'configured',
    recordedOn: '2026-10-11',
    source: 'decision-gates.md',
    blocks: 'Production or dispatch release actions',
  },
  G4: {
    id: 'G4',
    name: 'Policy publication',
    state: 'configured',
    recordedOn: '2026-10-11',
    source: 'decision-gates.md',
    blocks: 'Real quotes and public release of affected policies',
  },
  G5: {
    id: 'G5',
    name: 'Destructive retention',
    state: 'configured',
    recordedOn: '2026-10-11',
    source: 'decision-gates.md',
    blocks: 'Deleting or anonymising production data',
  },
  G6: {
    id: 'G6',
    name: 'Uploads',
    state: 'configured',
    recordedOn: '2026-10-11',
    source: 'decision-gates.md',
    blocks: 'Turning on customer uploads',
  },
  G7: {
    id: 'G7',
    name: 'Phone recovery',
    state: 'configured',
    recordedOn: '2026-10-11',
    source: 'decision-gates.md',
    blocks: 'Self-service link recovery by phone',
  },
  G8: {
    id: 'G8',
    name: 'Delivery and timing claims',
    state: 'configured',
    recordedOn: '2026-10-11',
    source: 'decision-gates.md',
    blocks: 'Delivery promises, same-day or next-day delivery claims',
  },
  G9: {
    id: 'G9',
    name: 'Catalogue and Projects publication',
    state: 'configured',
    recordedOn: '2026-10-12',
    source: 'D-2026-10-12-01',
    blocks: 'Publishing products and the Projects page',
  },
  G10: {
    id: 'G10',
    name: 'Production launch',
    state: 'configured',
    recordedOn: '2026-10-11',
    source: 'decision-gates.md',
    blocks: 'Going live',
  },
} as const;

export const BUSINESS_CONFIG = {
  name: 'ORACHIN Paints',
  tagline: 'Premium Paints & Architectural Coatings',
  address: '110b Old Ewu Road, Aviation Estate, Mafoluku, Lagos',
  phoneNumbers: ['08035855944', '08108196504'] as const,
  whatsappNumbers: ['08035855944', '08108196504'] as const,
  responders: {
    primary: 'Phebian Nwokeji',
    deputy: 'Juliet Nwabueze',
  },
  hours: {
    days: 'Monday – Saturday',
    time: '9:00 AM – 5:00 PM',
    timezone: 'Africa/Lagos',
  },
  timing: {
    responseHoursDisplay: 'Mon–Sat, 9:00 AM – 5:00 PM (Africa/Lagos)',
    productionLeadTimeDisplay: '1–3 days (confirmed per quote version)',
    courierTransitNote: 'Delivery quoted per job; no unconfirmed nationwide guarantee',
  },
  commercial: {
    currency: 'NGN',
    minorUnit: 'kobo',
    standardDepositPercent: 60, // Provisional 60% per D11
    quoteValidityDays: 14,      // Provisional 14 days per D11
    discountCeilingBps: 300,    // 3.00% ceiling without owner approval
    checkoutEnabled: false,     // CHK01 fixed to false
  },
  unconfigured: {
    emailProvider: null,
    analyticsProvider: null,
    courierFlatRates: null,
    namedAlertOwner: null,
  },
  gates: {
    G1_QUOTE_ISSUANCE: GATES_REGISTRY.G1,
    G2_LIVE_ACCEPTANCE: GATES_REGISTRY.G2,
    G3_LIVE_RELEASE: GATES_REGISTRY.G3,
    G4_POLICY_PUBLICATION: GATES_REGISTRY.G4,
    G5_DESTRUCTIVE_RETENTION: GATES_REGISTRY.G5,
    G6_UPLOADS: GATES_REGISTRY.G6,
    G7_PHONE_RECOVERY: GATES_REGISTRY.G7,
    G8_DELIVERY_TIMING_CLAIMS: GATES_REGISTRY.G8,
    G9_PROJECTS_PUBLIC_DISPLAY: GATES_REGISTRY.G9,
    G10_PRODUCTION_LAUNCH: GATES_REGISTRY.G10,
  },
} as const;

export function isGateCleared(gateId: keyof typeof GATES_REGISTRY): boolean {
  return GATES_REGISTRY[gateId]?.state === 'cleared';
}

export function isProjectsPublicDisplayCleared(): boolean {
  return BUSINESS_CONFIG.gates.G9_PROJECTS_PUBLIC_DISPLAY.state === 'cleared';
}
