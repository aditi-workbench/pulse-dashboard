import type { FeatureRelease } from '../types';

export const featureReleases: FeatureRelease[] = [
  {
    id: 'FLT-001',
    name: 'OTA Firmware Crash Fix (v3.1.2)',
    description:
      'Critical bug causing device brick during OTA update affecting 12% of deployed fleet devices. Firmware corruption in partition swap logic triggers a boot loop on units with fragmented NAND storage.',
    category: 'Bug',
    teams: ['Software', 'Quality'],
    committedDate: '2026-02-28',
    deliveredDate: '2026-03-15',
    status: 'Delayed',
    riskLevel: 'Critical',
    riskReason:
      'Quality team regression pipeline was overwhelmed by the severity of the issue, requiring full device fleet re-validation across 14 hardware SKUs. Delivered 15 days late.',
    atRiskTeam: 'Quality',
    progress: 100,
    jiraEpic: 'FLEET-EP-01',
  },
  {
    id: 'FLT-002',
    name: 'Enhanced GPS Precision v2.5',
    description:
      'Sub-meter GPS accuracy upgrade requested by 78% of enterprise fleet customers. Requires new dual-band GNSS antenna hardware, RTKLIB-based correction algorithms, and field calibration protocol updates.',
    category: 'Top Customer Feature Ask',
    teams: ['Hardware', 'Software', 'Quality'],
    committedDate: '2026-06-15',
    status: 'Delayed',
    riskLevel: 'High',
    riskReason:
      'Hardware team encountered a 6-week supply chain disruption for the u-blox M10 GNSS module (Sprints 3–5). Committed date was Jun 15; delivery is now projected for Jul 10.',
    atRiskTeam: 'Hardware',
    progress: 82,
    jiraEpic: 'FLEET-EP-02',
  },
  {
    id: 'FLT-003',
    name: 'CAN Bus Protocol Upgrade v3.2',
    description:
      'Mandatory upgrade from ISO 11898-2 to the extended J1939-21 protocol stack to maintain compatibility with next-gen OEM vehicle platforms and EU commercial vehicle compliance deadlines.',
    category: 'KTLO',
    teams: ['Hardware', 'Software'],
    committedDate: '2026-07-31',
    status: 'On Track',
    riskLevel: 'Medium',
    riskReason:
      'Minor integration complexity discovered in Software Sprint 11 around message arbitration at high bus loads. Team self-identified the risk and added buffer stories. Currently tracking 1 sprint ahead of plan.',
    progress: 58,
    jiraEpic: 'FLEET-EP-03',
  },
  {
    id: 'FLT-004',
    name: 'Driver Behavior Analytics Dashboard',
    description:
      'Real-time driver scoring dashboard for fleet managers covering harsh braking, cornering, speeding, and idle time. Powered by edge ML inference on the telematics unit with a cloud aggregation API.',
    category: 'Top Customer Feature Ask',
    teams: ['Software', 'Quality'],
    committedDate: '2026-07-15',
    status: 'At Risk',
    riskLevel: 'Medium',
    riskReason:
      'Quality team is at 65% velocity on driver analytics test cases due to dependency on a shared device lab needed for cellular failover testing simultaneously. Lab contention may slip delivery by 1–2 weeks.',
    atRiskTeam: 'Quality',
    progress: 72,
    jiraEpic: 'FLEET-EP-04',
  },
  {
    id: 'FLT-005',
    name: 'Cellular Network Failover',
    description:
      'Automatic LTE-to-Wi-Fi-to-satellite failover for uninterrupted fleet tracking in cellular dead zones. Requires multi-SIM modem management, connection manager state machine overhaul, and Iridium SBD integration.',
    category: 'Bug',
    teams: ['Hardware', 'Software', 'Quality'],
    committedDate: '2026-06-30',
    status: 'At Risk',
    riskLevel: 'High',
    riskReason:
      'Software team underestimated complexity of the connection manager state machine (Sprints 7–11). Technical debt in the legacy modem abstraction layer required a full rewrite. Current sprint velocity at 63%.',
    atRiskTeam: 'Software',
    progress: 61,
    jiraEpic: 'FLEET-EP-05',
  },
];
