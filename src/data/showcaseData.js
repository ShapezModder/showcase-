export const SECTIONS = [
  { id: 'overview', num: '01', label: 'Overview & Challenge' },
  { id: 'problem', num: '02', label: 'The Problem in Assam' },
  { id: 'solution', num: '03', label: 'MargDrishti Solution' },
  { id: 'pilot-videos', num: '04', label: 'Pilot Videos (4 Layers)' },
  { id: 'meerut-field', num: '05', label: 'Meerut Field Testing' },
  { id: 'validation', num: '06', label: 'Validation & Graphs' },
  { id: 'classes', num: '07', label: 'Analysed Classes & PCI' },
  { id: 'surveyor', num: '08', label: 'Surveyor & Add Device' },
  { id: 'official', num: '09', label: 'Official Admin Portal' },
  { id: 'integrity', num: '10', label: 'Anti-Tampering & Loopholes' },
  { id: 'cost-hardware', num: '11', label: 'Assam Cost & Hardware' }
];
export const PILOT_VIDEOS = [
  {
    id: 'road-surface',
    step: 'View 01',
    title: 'Layer 1: Road Surface Defect Detection',
    badge: 'ASTM D6433 · Surface Audit',
    src: '/videos/video3_1_road_surface.mp4',
    description: 'In this view, MargDrishti focuses purely on the pavement surface. As the vehicle moves forward, the surface model flags longitudinal cracks, alligator cracking, potholes, and prior repair patches—displaying each detection with its confidence percentage and ASTM severity score (1–5) so engineers know which stretches need sealing versus urgent patching.'
  },
  {
    id: 'lanes-road',
    step: 'View 02',
    title: 'Layer 2: Drivable Area & Lane Geometry',
    badge: 'Corridor Segmentation',
    src: '/videos/video2_3_lanes_and_road.mp4',
    description: 'Here, the roadway segmentation layer isolates the paved drivable carriageway (shaded in blue) from roadside vegetation, unpaved shoulders, and buildings while tracing active lane markings. This ensures defect audits stay anchored to the actual drivable road even on winding corridors without clear lane paint.'
  },
  {
    id: 'vehicles-assist',
    step: 'View 03',
    title: 'Layer 3: Vehicle Assist & Collision Warning',
    badge: 'Distance (m) & TTC Safety',
    src: '/videos/video2_2_vehicles_assist.mp4',
    description: 'This layer tracks surrounding cars, buses, trucks, motorcycles, and pedestrians in mixed traffic. For every road user, MargDrishti estimates physical distance in metres and calculates Time-to-Collision (TTC) from bounding-box expansion—turning boxes amber or red if a vehicle ahead closes in too quickly.'
  },
  {
    id: 'all-layers',
    step: 'View 04',
    title: 'All 3 Layers Combined — Live Surveyor Vehicle View',
    badge: 'Full Cockpit View',
    src: '/videos/video2_4_all_layers.mp4',
    description: 'Here, all three perception layers run together simultaneously in real time—and this is the exact live view displayed inside the Surveyor Vehicle cockpit during a road patrol. While the driver and operator see surface defects, drivable lanes, and vehicle safety alerts on one screen, GPS coordinates, vehicle speed, and PCI scores are logged automatically in the background.'
  }
];
export const MEERUT_PHOTOS = [
  { src: '/meerut/meerut_01.jpg', caption: 'Meerut Pilot · Urban Carriageway Crack & Traffic Scan' },
  { src: '/meerut/meerut_02.jpg', caption: 'Meerut Pilot · Mixed Indian Traffic & Surface Distress' },
  { src: '/meerut/meerut_03.jpg', caption: 'Meerut Pilot · Two-Wheelers & Edge Shoulder Detection' },
  { src: '/meerut/meerut_04.jpg', caption: 'Meerut Pilot · Longitudinal Crack & Vehicle Distance' },
  { src: '/meerut/meerut_05.jpg', caption: 'Meerut Pilot · Shadowed Tree-Canopy Road Surface' },
  { src: '/meerut/meerut_06.jpg', caption: 'Meerut Pilot · Pothole & Auto-Rickshaw Corridor' },
  { src: '/meerut/meerut_07.jpg', caption: 'Meerut Pilot · Multi-Defect Asphalt Deterioration' },
  { src: '/meerut/meerut_08.jpg', caption: 'Meerut Pilot · Commercial Freight & Road Patching' },
  { src: '/meerut/meerut_09.jpg', caption: 'Meerut Pilot · Arterial Junction & Pedestrian Safety' },
  { src: '/meerut/meerut_10.jpg', caption: 'Meerut Pilot · Uneven Shoulder & Surface Ravelling' },
  { src: '/meerut/meerut_11.jpg', caption: 'Meerut Pilot · Dense Traffic & Pavement Verification' },
  { src: '/meerut/meerut_12.jpg', caption: 'Meerut Pilot · Post-Fine-Tuning Indian Road Validation' }
];
export const DEFECT_CLASSES = [
  { code: '0', label: 'Longitudinal / Transverse Crack', astm: '10', sev: '3 (Medium)', sevTier: 'med', deduct: '8', action: 'Early crack sealing to block monsoon water ingress' },
  { code: '1', label: 'Alligator Crack', astm: '1', sev: '4 (High)', sevTier: 'high', deduct: '15', action: 'Deep structural patching or overlay for base fatigue' },
  { code: '2', label: 'Block Crack', astm: '3', sev: '3 (Medium)', sevTier: 'med', deduct: '8', action: 'Slurry seal or thin bituminous overlay' },
  { code: '3', label: 'Patching', astm: '11', sev: '2 (Low)', sevTier: 'low', deduct: '3', action: 'Track prior repair durability pre- and post-monsoon' },
  { code: '4', label: 'Pothole', astm: '13', sev: '5 (Critical)', sevTier: 'high', deduct: '15', action: 'Urgent cold/hot-mix filling; severe safety risk' },
  { code: '5', label: 'Weathering / Raveling', astm: '19', sev: '2 (Low)', sevTier: 'low', deduct: '3', action: 'Fog seal or surface dressing for aggregate loss' },
  { code: '6', label: 'Lane / Shoulder Drop-off', astm: '9', sev: '4 (High)', sevTier: 'high', deduct: '15', action: 'Shoulder grading & edge strengthening on narrow roads' },
  { code: '7', label: 'Marking / Manhole', astm: '—', sev: '2 (Low)', sevTier: 'low', deduct: '3', action: 'Distinguishes road fixtures from structural potholes' }
];
export const VEHICLE_CLASSES = [
  { id: '0', name: 'Pedestrian', height: '1.7 m', role: 'Vulnerable road user alert in markets & school zones' },
  { id: '1', name: 'Bicycle', height: '1.4 m', role: 'Shoulder traffic safety on rural & district corridors' },
  { id: '2', name: 'Car', height: '1.5 m', role: 'Following distance & lane congestion context' },
  { id: '3', name: 'Motorcycle', height: '1.4 m', role: 'Two-wheeler protection near sudden potholes' },
  { id: '5', name: 'Bus', height: '3.2 m', role: 'Heavy passenger axle-load corridor tracking' },
  { id: '7', name: 'Truck', height: '3.0 m', role: 'Freight load monitoring on fatigued stretches' }
];
export const LOOPHOLE_ROWS = [
  {
    loophole: 'Surveyor editing defect counts, severity, or PCI after a trip',
    fix: 'Strict immutability: Surveyors have zero UI or API access to edit or delete logged defects, severity, or speed. Only Government Officials can review records, and every official action writes to defect_audit_logs.'
  },
  {
    loophole: 'Faking distance covered by idling with GPS jitter',
    fix: 'Speed & accuracy gating: Readings below 3 km/h are zeroed out, and GPS points with accuracy worse than 35 m are excluded from route geometry and distance totals.'
  },
  {
    loophole: 'Driving too fast so road cracks blur out',
    fix: 'Continuous speed telemetry: Every trip records avg_speed_kmh and max_speed_kmh, every defect stores speed_kmh at capture, and overspeeding (> target + 10 km/h) triggers a live cockpit alert.'
  },
  {
    loophole: 'Counting the same pothole 30 times across consecutive video frames',
    fix: 'Temporal cooldown & spatial clustering: Logging enforces cooldown windows and PostGIS ST_ClusterDBSCAN (3–5 m radius) groups repeated sightings into one verified location.'
  },
  {
    loophole: 'False road polygons on covered lenses, tunnels, or dark frames',
    fix: 'Luminance & contrast gate: Frames with mean intensity < 25 or contrast std < 14 are automatically skipped before segmentation.'
  },
  {
    loophole: 'Phone screen locking mid-patrol in wireless camera mode',
    fix: 'Screen Wake Lock + auto-reacquire: MobileCameraPage acquires navigator.wakeLock and keeps live GPS, speed, and video streaming active across patrols.'
  }
];