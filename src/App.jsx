import React, { useEffect, useRef, useState } from 'react';
import {
  SECTIONS,
  PILOT_VIDEOS,
  MEERUT_PHOTOS,
  DEFECT_CLASSES,
  VEHICLE_CLASSES,
  LOOPHOLE_ROWS,
  TEAM_MEMBERS,
  HACKATHON_ACHIEVEMENTS
} from './data/showcaseData';
import {
  HeroRoadSurveyIllustration,
  MobilePairingIllustration
} from './components/GovIllustrations';
export default function App() {
  const [activeSection, setActiveSection] = useState('overview');
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const sectionRefs = useRef({});
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-18% 0px -65% 0px', threshold: 0.01 }
    );
    SECTIONS.forEach((sec) => {
      const el = sectionRefs.current[sec.id];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  const scrollToSection = (id) => {
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };
  return (
    <div>
      <div className="tricolor-bar" />
      <header className="top-header">
        <div className="top-header-inner">
          <div className="brand-cluster">
            <img src="/brand/assam-govt-emblem.png" alt="Government of Assam" className="brand-emblem" />
            <img src="/brand/nesfic-logo.webp" alt="NESFIC 2026" className="brand-nesfic" />
            <div className="brand-divider" />
            <img src="/brand/margdrishti-logo.png" alt="MargDrishti Formerly StreetIQ" className="brand-marg" />
          </div>
          <div className="header-meta">
            <span className="challenge-pill">Stream 1 · NESFIC-D-05</span>
            <span className="pwd-pill">PWD, Government of Assam</span>
          </div>
        </div>
      </header>
      <nav className="mobile-nav-strip" aria-label="Document Sections">
        {SECTIONS.map((sec) => (
          <button
            key={sec.id}
            type="button"
            className={`mobile-pill ${activeSection === sec.id ? 'active' : ''}`}
            onClick={() => scrollToSection(sec.id)}
          >
            {sec.num}. {sec.label}
          </button>
        ))}
      </nav>
      <div className="doc-shell">
        <aside className="left-rail" aria-label="Document Outline">
          <div>
            <div className="rail-label">Document Sections</div>
            <ul className="rail-list">
              {SECTIONS.map((sec) => (
                <li key={sec.id}>
                  <button
                    type="button"
                    className={`rail-btn ${activeSection === sec.id ? 'active' : ''}`}
                    onClick={() => scrollToSection(sec.id)}
                  >
                    <span className="rail-num">{sec.num}</span>
                    <span>{sec.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="rail-footer">
            <strong>MargDrishti (मार्गदृष्टि)</strong>
            <div>Formerly StreetIQ · NESFIC-D-05</div>
            <div>Ref: EU/ACE&amp;T/2026/31</div>
            <div>Manika Kutiyal &amp; Aditya Verma</div>
          </div>
        </aside>
        <main className="doc-content">
          <section
            id="overview"
            ref={(el) => { sectionRefs.current.overview = el; }}
            className="doc-section"
          >
            <div className="hero-grid">
              <div>
                <div className="hero-badge">NESFIC 2026 · Road Surface Defect Detection &amp; Maintenance Prioritisation</div>
                <h1 className="hero-heading">
                  <span className="accent-saffron">MargDrishti</span> — Practical AI Road Audits for <span className="accent-green">Assam PWD</span>
                </h1>
                <p className="section-lead" style={{ marginBottom: 0 }}>
                  Formerly developed as StreetIQ, <strong>MargDrishti (मार्गदृष्टि)</strong> turns everyday patrol vehicles, two-wheelers, and standard smartphones into automated road-condition auditors. As a vehicle moves, the platform detects cracks and potholes, maps the drivable lane, tracks surrounding traffic safety, records exact GPS and speed, and delivers tamper-proof inspection reports directly to government engineers.
                </p>
                <div className="hero-actions">
                  <button type="button" className="btn-primary" onClick={() => scrollToSection('pilot-videos')}>
                    Watch 4-Layer Pilot Videos
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => scrollToSection('meerut-field')}>
                    View Meerut Field Testing
                  </button>
                </div>
              </div>
              <div>
                <HeroRoadSurveyIllustration />
              </div>
            </div>
            <div className="stat-strip">
              <div className="stat-box">
                <div className="stat-num num-saffron">8 + 2</div>
                <div className="stat-label">ASTM D6433 &amp; Extended Road Distress Classes</div>
              </div>
              <div className="stat-box">
                <div className="stat-num num-green">12.1 FPS</div>
                <div className="stat-label">Measured All-3-Layer Speed (RTX 3050 6GB)</div>
              </div>
              <div className="stat-box">
                <div className="stat-num num-teal">143 + 234</div>
                <div className="stat-label">Meerut Field Photos &amp; Dashcam Frames Validated</div>
              </div>
              <div className="stat-box">
                <div className="stat-num num-amber">~₹85k</div>
                <div className="stat-label">Edge Kit Cost vs ₹1.5–3 Cr Survey Van</div>
              </div>
            </div>
          </section>
          <section
            id="problem"
            ref={(el) => { sectionRefs.current.problem = el; }}
            className="doc-section"
          >
            <div className="section-kicker">02 · Ground Reality</div>
            <h2 className="section-title">Why Road Monitoring Needs a Practical Shift in Assam</h2>
            <p className="section-lead">
              The Public Works Department maintains thousands of kilometres of State Highways, Major District Roads, and rural links. Today, engineers face four connected bottlenecks that delay repairs until small cracks turn into dangerous monsoon potholes.
            </p>
            <div className="numbered-grid">
              <div className="numbered-item">
                <div className="big-num num-green">01</div>
                <h3>Slow Manual Inspections</h3>
                <p>Field teams walking or driving slowly with phone cameras cover only 5–10 km a day, leaving large district and rural networks uninspected for months.</p>
              </div>
              <div className="numbered-item">
                <div className="big-num num-teal">02</div>
                <h3>Subjective Severity Judgement</h3>
                <p>What one inspector notes as minor cracking, another treats as moderate damage. Without automated ASTM scoring, division budgets lack uniform evidence.</p>
              </div>
              <div className="numbered-item">
                <div className="big-num num-amber">03</div>
                <h3>Six-Month Monsoon Acceleration</h3>
                <p>Rainwater enters small hairline cracks, softens the base under heavy bus and truck loads, and breaks the surface into deep potholes within weeks.</p>
              </div>
              <div className="numbered-item">
                <div className="big-num num-saffron">04</div>
                <h3>₹1.5–3 Crore Survey Vans Are Scarce</h3>
                <p>Specialised laser Network Survey Vehicles (NSVs) cost crores and are booked on National Highways, leaving district and hill roads with infrequent audits.</p>
              </div>
            </div>
          </section>
          <section
            id="solution"
            ref={(el) => { sectionRefs.current.solution = el; }}
            className="doc-section"
          >
            <div className="section-kicker">03 · How MargDrishti Works</div>
            <h2 className="section-title">Three Perception Layers Working Together in Real Time</h2>
            <p className="section-lead">
              Instead of relying on a single detector or streaming heavy raw video over weak rural 4G networks, MargDrishti runs three specialised AI layers locally on the patrol unit and sends only lightweight, verified records to the PWD portal.
            </p>
            <div className="numbered-grid">
              <div className="numbered-item">
                <div className="big-num num-saffron">L1</div>
                <h3>Road Surface Distress &amp; Live PCI</h3>
                <p>Detects cracks, potholes, patching, weathering, and shoulder drop-offs from windshield video, assigns ASTM D6433 severity (1–5), and calculates a live 0–100 Pavement Condition Index.</p>
              </div>
              <div className="numbered-item">
                <div className="big-num num-teal">L2</div>
                <h3>Drivable Area &amp; Lane Geometry</h3>
                <p>Separates the paved carriageway from roadside dirt and vegetation while tracing lane lines—keeping defect analysis anchored to the actual road surface.</p>
              </div>
              <div className="numbered-item">
                <div className="big-num num-green">L3</div>
                <h3>Vehicle Assist &amp; Collision Warning</h3>
                <p>Tracks pedestrians, bicycles, two-wheelers, cars, buses, and trucks with monocular distance estimation (metres) and Time-to-Collision (TTC) alerts for driver safety.</p>
              </div>
              <div className="numbered-item">
                <div className="big-num num-amber">DB</div>
                <h3>Geo-Tagged Evidence &amp; Reports</h3>
                <p>Every hazard snapshot is saved with GPS latitude/longitude, vehicle speed at capture, timestamp, and route map—ready for instant official review and printable reports.</p>
              </div>
            </div>
          </section>
          <section
            id="pilot-videos"
            ref={(el) => { sectionRefs.current['pilot-videos'] = el; }}
            className="doc-section"
          >
            <div className="section-kicker">04 · Live Pilot Footage</div>
            <h2 className="section-title">Watch All 4 Detection Views from Our Pilot Runs</h2>
            <p className="section-lead">
              Below are all four real, unedited recordings of our pipeline processing dashcam footage on local GPU hardware—starting with each individual perception layer and ending with the combined live view seen inside the Surveyor Vehicle.
            </p>
            <div className="video-stack">
              {PILOT_VIDEOS.map((vid) => (
                <div key={vid.id} className="video-row">
                  <div className="video-row-info">
                    <span className="challenge-pill">{vid.step} · {vid.badge}</span>
                    <h3>{vid.title}</h3>
                    <p>{vid.description}</p>
                  </div>
                  <div className="video-player-wrap">
                    <video src={vid.src} controls playsInline preload="metadata" />
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section
            id="meerut-field"
            ref={(el) => { sectionRefs.current['meerut-field'] = el; }}
            className="doc-section"
          >
            <div className="section-kicker">05 · Real Indian Road Validation</div>
            <h2 className="section-title">Field Testing Across Real Roads in Meerut City</h2>
            <p className="section-lead">
              Foreign highway datasets do not represent Indian roads. We took MargDrishti onto live streets in <strong>Meerut City</strong>—capturing mixed traffic, two-wheelers, auto-rickshaws, dense tree shadows, uneven shoulders, and real asphalt distresses—and fine-tuned our thresholds for Indian conditions. Click any photo to inspect full detections.
            </p>
            <div className="meerut-grid">
              {MEERUT_PHOTOS.map((item, idx) => (
                <button
                  key={item.src}
                  type="button"
                  className="meerut-card"
                  onClick={() => setLightboxPhoto(item)}
                >
                  <img src={item.src} alt={item.caption} loading="lazy" />
                  <div className="meerut-card-foot">
                    <span>#{idx + 1} · {item.caption.replace('Meerut Pilot · ', '')}</span>
                    <span style={{ color: 'var(--saffron)', fontWeight: 700 }}>Inspect</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="drive-action-wrap">
              <a
                href="https://drive.google.com/drive/u/7/folders/17cFH_bc_d3QcxUSVgxTiQHb0k3OqsEv1"
                target="_blank"
                rel="noopener noreferrer"
                className="drive-link-btn"
              >
                <svg width="20" height="18" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5l5.4 9.35z" fill="#0066DA" />
                  <path d="M43.65 25L29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3L1.2 48.5A9.06 9.06 0 000 53h27.5l16.15-28z" fill="#00AC47" />
                  <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 11.4 7.9 12.4z" fill="#EA4335" />
                  <path d="M43.65 25L57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2L43.65 25z" fill="#00832D" />
                  <path d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2L59.8 53z" fill="#2684FC" />
                  <path d="M73.4 26.5l-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5L73.4 26.5z" fill="#FFBA00" />
                </svg>
                <span>More images here — Open Full Meerut Test Folder</span>
              </a>
            </div>
            <div className="callout-banner">
              <strong>Verified Meerut Field Batch Summary</strong>
              <p>Across the complete 143-image Meerut field test batch processed on CUDA, the pipeline logged 135 road surface hazards across 84 images and 196 vehicles/road users across 77 images—confirming reliable performance in real Indian lighting and traffic clutter.</p>
            </div>
          </section>
          <section
            id="validation"
            ref={(el) => { sectionRefs.current.validation = el; }}
            className="doc-section"
          >
            <div className="section-kicker">06 · Honest Empirical Benchmarks</div>
            <h2 className="section-title">Model Validation &amp; What the Graphs Mean in Plain English</h2>
            <p className="section-lead">
              Every number and graph below is measured directly from our trained model checkpoint and local hardware benchmarks—with zero inflated claims.
            </p>
            <div className="chart-grid">
              <div className="chart-card">
                <img src="/charts/training_validation_curves.png" alt="143-Epoch Training and Validation Metrics" />
                <h3>1. Accuracy &amp; Loss Over 143 Training Epochs</h3>
                <p>
                  On single-frame validation, Layer 1 achieves <strong>68.2% Precision</strong>, <strong>60.4% Recall</strong>, <strong>64.1% F1 Score</strong> (peaking at <strong>65.3%</strong>), and <strong>65.7% mAP@0.50</strong>. In plain terms: when the car is moving at 25 km/h (~7 m/s) and scanning at 12 FPS, a pothole stays in camera view for 15–25 frames—so even across just 5 consecutive frames, the chance of missing a defect drops below <strong>1% (&gt;99% multi-frame capture)</strong>.
                </p>
              </div>
              <div className="chart-card">
                <img src="/charts/inference_latency_fps.png" alt="CUDA GPU vs CPU Inference Latency and FPS" />
                <h3>2. Processing Speed: Entry GPU vs. CPU Only</h3>
                <p>
                  Running all three models together takes <strong>82.5 ms per frame (12.1 FPS)</strong> on an entry-level <strong>NVIDIA RTX 3050 6GB</strong> laptop GPU, compared to <strong>458.7 ms (2.2 FPS)</strong> on CPU alone. At 25 km/h survey speed, 12.1 FPS captures a complete tri-layer inspection every <strong>0.57 metres</strong> of road.
                </p>
              </div>
              <div className="chart-card">
                <img src="/charts/field_validation_distribution.png" alt="Class Distribution Across 234 Sampled Dashcam Frames" />
                <h3>3. Real-World Class Distribution (234 Sampled Dashcam Frames)</h3>
                <p>
                  Across 234 sampled dashcam frames from our test videos, the system detected <strong>280 road surface defects</strong> (213 linear cracks, 29 potholes, 17 manholes/markings, 15 alligator cracks, 6 patches) and <strong>277 road users</strong> (213 cars, 38 pedestrians, 25 trucks, 1 bus). Setting the defect threshold at 0.15 keeps early hairline cracks visible instead of ignoring them.
                </p>
              </div>
            </div>
          </section>
          <section
            id="classes"
            ref={(el) => { sectionRefs.current.classes = el; }}
            className="doc-section"
          >
            <div className="section-kicker">07 · Engineering Standards</div>
            <h2 className="section-title">All Road Defect &amp; Traffic Classes Analysed</h2>
            <p className="section-lead">
              Every detected defect maps to an ASTM D6433 distress category, severity level (1–5), and PCI deduction weight so maintenance teams know whether a road needs simple crack sealing or structural rebuilding.
            </p>
            <div className="table-wrap" style={{ marginBottom: '22px' }}>
              <table className="gov-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Defect Class</th>
                    <th>ASTM Code</th>
                    <th>Severity</th>
                    <th>PCI Deduct</th>
                    <th>Recommended PWD Maintenance Action</th>
                  </tr>
                </thead>
                <tbody>
                  {DEFECT_CLASSES.map((row) => (
                    <tr key={row.code}>
                      <td><strong>{row.code}</strong></td>
                      <td><strong>{row.label}</strong></td>
                      <td>{row.astm}</td>
                      <td><span className={`sev-pill sev-${row.sevTier}`}>{row.sev}</span></td>
                      <td>-{row.deduct}</td>
                      <td>{row.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-wrap">
              <table className="gov-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tracked Road User</th>
                    <th>Calibrated Height</th>
                    <th>Safety &amp; Traffic Role</th>
                  </tr>
                </thead>
                <tbody>
                  {VEHICLE_CLASSES.map((v) => (
                    <tr key={v.id}>
                      <td><strong>{v.id}</strong></td>
                      <td><strong>{v.name}</strong></td>
                      <td>{v.height}</td>
                      <td>{v.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section
            id="surveyor"
            ref={(el) => { sectionRefs.current.surveyor = el; }}
            className="doc-section"
          >
            <div className="section-kicker">08 · Field Operations</div>
            <h2 className="section-title">Surveyor Portal &amp; Wireless "Add Device" (No Car Always Required)</h2>
            <div className="split-editorial">
              <div>
                <p className="section-lead" style={{ marginBottom: '16px' }}>
                  Field staff sign into the Surveyor Dashboard to view assigned stretches or launch a Free Drive patrol. Before scanning begins, a <strong>Pre-Flight Check</strong> confirms GPS lock, camera feed, and AI readiness, followed by optional <strong>Turn-by-Turn Navigation</strong> along the official route.
                </p>
                <p style={{ fontSize: '14.5px', color: 'var(--ink-secondary)', margin: '0 0 12px' }}>
                  <strong>Wireless "Add Device" Feature:</strong> Clicking <em>Add Device</em> generates a unique browser link (<code>?cam=...&amp;name=...</code>). Opening that link on any smartphone immediately turns the phone into a wireless rear-camera, GPS, and live speed source—streaming straight to the operator's laptop cockpit with Screen Wake Lock enabled.
                </p>
                <p style={{ fontSize: '14.5px', color: 'var(--ink-secondary)', margin: 0 }}>
                  <strong>Why a Dedicated Survey Car Is Not Required:</strong> Narrow village roads, market lanes, and steep hill bends in Assam often cannot accommodate large survey vans. With wireless phone pairing, PWD teams can survey on <strong>two-wheelers, auto-rickshaws, patrol bikes, or standard department jeeps</strong> without modifying any vehicle.
                </p>
              </div>
              <div>
                <MobilePairingIllustration />
              </div>
            </div>
          </section>
          <section
            id="official"
            ref={(el) => { sectionRefs.current.official = el; }}
            className="doc-section"
          >
            <div className="section-kicker">09 · Government Oversight</div>
            <h2 className="section-title">Official Admin Portal Built for PWD Engineers</h2>
            <p className="section-lead">
              Senior engineers and administrators get a single console covering everything currently built in MargDrishti—from planning stretches to printing signed-off reports.
            </p>
            <div className="numbered-grid">
              <div className="numbered-item">
                <div className="big-num num-green">01</div>
                <h3>Live Fleet Oversight Map</h3>
                <p>Tracks all registered survey vehicles, active/idle status, crew names, last heartbeat, and cumulative kilometres surveyed across districts.</p>
              </div>
              <div className="numbered-item">
                <div className="big-num num-teal">02</div>
                <h3>Stretch Planner &amp; Distance Checker</h3>
                <p>Officials pick start and end points on the map, verify exact corridor distance, set target speed (default 25 km/h) and priority, and assign tasks directly to vehicles.</p>
              </div>
              <div className="numbered-item">
                <div className="big-num num-amber">03</div>
                <h3>Trip Inspection &amp; Speed Telemetry</h3>
                <p>Inspect any trip's driven GeoJSON path, average and maximum speeds, calculated PCI score, and every captured defect photo with timestamp and speed.</p>
              </div>
              <div className="numbered-item">
                <div className="big-num num-saffron">04</div>
                <h3>Audit Logs &amp; Printable Reports</h3>
                <p>Review defects, record official remarks (logged permanently in <code>defect_audit_logs</code>), and export print-ready ASTM D6433 PCI reports for maintenance approvals.</p>
              </div>
            </div>
          </section>
          <section
            id="integrity"
            ref={(el) => { sectionRefs.current.integrity = el; }}
            className="doc-section"
          >
            <div className="section-kicker">10 · Audit Integrity</div>
            <h2 className="section-title">Closing Field Loopholes &amp; Preventing Data Tampering</h2>
            <p className="section-lead">
              Public road audits must be trustworthy. Every safeguard below is implemented directly in our frontend cockpit, database schema, and backend APIs.
            </p>
            <div className="table-wrap">
              <table className="gov-table">
                <thead>
                  <tr>
                    <th style={{ width: '36%' }}>Potential Loophole / Failure Mode</th>
                    <th>How MargDrishti Solves It in Code</th>
                  </tr>
                </thead>
                <tbody>
                  {LOOPHOLE_ROWS.map((row) => (
                    <tr key={row.loophole}>
                      <td><strong>{row.loophole}</strong></td>
                      <td>{row.fix}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section
            id="cost-hardware"
            ref={(el) => { sectionRefs.current['cost-hardware'] = el; }}
            className="doc-section"
          >
            <div className="section-kicker">11 · Economics, Climate &amp; Deployment</div>
            <h2 className="section-title">Assam Deployment Cost, Monsoon Readiness &amp; Closed-Software Shipping</h2>
            <p className="section-lead">
              For the cost of a single ₹2 crore Network Survey Vehicle, Assam PWD can equip all 35 district divisions with dedicated GPU edge kits (~₹85,000 each) and still retain over 85% of the budget for road repairs.
            </p>
            <div className="chart-card" style={{ marginBottom: '22px' }}>
              <img src="/charts/assam_cost_comparison.png" alt="Assam Deployment Cost Comparison" />
              <h3>Cost Per Unit: Survey Van vs. MargDrishti Edge Kit vs. Mobile Pairing</h3>
              <p>
                <strong>Dedicated Edge Kit (~₹75,000–₹95,000):</strong> Entry RTX 3050/3060 laptop + 1080p dashcam/mount. <strong>Mobile Pairing Mode (~₹3,000–₹5,000):</strong> Uses existing department laptops and surveyor phones with only a windshield or handlebar mount.
              </p>
            </div>
            <div className="numbered-grid">
              <div className="numbered-item">
                <div className="big-num num-green">01</div>
                <h3>Built for Northeast Climate &amp; Terrain</h3>
                <p>Windshield-mounted optics stay clean behind wiper blades during 6-month monsoons, dynamic corridor segmentation adapts to winding hill roads in Dima Hasao &amp; Karbi Anglong, and luminance gates guard against forest canopy shadows.</p>
              </div>
              <div className="numbered-item">
                <div className="big-num num-saffron">02</div>
                <h3>Closed Software &amp; Hardware Tiers</h3>
                <p>Designed to ship as a self-contained closed software bundle (local PostgreSQL/PostGIS + FastAPI + React UI) with zero internet needed on patrol. Even an <strong>NVIDIA RTX 3060 or RTX 3050</strong> runs full tri-layer scans smoothly at 12+ FPS; higher GPUs scale resolution and frame rate further.</p>
              </div>
            </div>
          </section>
          <section
            id="team"
            ref={(el) => { sectionRefs.current.team = el; }}
            className="doc-section"
          >
            <div className="section-kicker">12 · Team, Endorsement &amp; Achievements</div>
            <h2 className="section-title">The Team Behind MargDrishti</h2>
            <p className="section-lead">
              We are a two-member student engineering team building practical AI tools for public infrastructure, formally endorsed by Eternal University (<strong>Ref No. EU/ACE&amp;T/2026/31</strong>, dated 03/11/2026) with academic mentorship from Er. Rajeev Thakur (HoD, Dept. of CSE, ACET) and Lovely Professional University, Phagwara.
            </p>
            <div className="numbered-grid" style={{ marginBottom: '22px' }}>
              {TEAM_MEMBERS.map((member, idx) => (
                <div key={member.email} className="numbered-item">
                  <div className={`big-num ${idx === 0 ? 'num-saffron' : 'num-green'}`}>0{idx + 1}</div>
                  <h3>{member.name}</h3>
                  <p style={{ marginBottom: '6px' }}><strong>{member.institution}</strong></p>
                  <p style={{ marginBottom: '6px' }}>{member.program}</p>
                  <p>
                    <a href={`mailto:${member.email}`} style={{ color: 'var(--saffron)', fontWeight: 700, textDecoration: 'none' }}>{member.email}</a> · {member.phone}
                  </p>
                </div>
              ))}
            </div>
            <div className="table-wrap" style={{ marginBottom: '22px' }}>
              <table className="gov-table">
                <thead>
                  <tr>
                    <th style={{ width: '42%' }}>Selected Hackathon / Competition</th>
                    <th>Recognition / Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {HACKATHON_ACHIEVEMENTS.map((item) => (
                    <tr key={item.event}>
                      <td><strong>{item.event}</strong></td>
                      <td><span className="sev-pill sev-low">{item.result}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="numbered-grid">
              <div className="numbered-item" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src="/brand/mnm-logo.png" alt="Makers Need More" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
                  <h3 style={{ margin: 0 }}>Makers Need More (MnM)</h3>
                </div>
                <p>
                  Founders of <strong>Makers Need More (MnM)</strong>, an independent student-led initiative fostering practical engineering, open-source development, community initiatives, and real-world problem solving.
                </p>
                <p>
                  <a href="https://www.makersneedmore.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--assam-green)', fontWeight: 700, textDecoration: 'none' }}>www.makersneedmore.com</a> · <a href="https://margdrishti.cv" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--saffron)', fontWeight: 700, textDecoration: 'none' }}>margdrishti.cv</a>
                </p>
              </div>
              <div className="numbered-item" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src="/brand/eternal-university-logo.png" alt="Eternal University" style={{ height: '44px', width: 'auto', objectFit: 'contain' }} />
                  <h3 style={{ margin: 0 }}>Official Institutional Endorsement</h3>
                </div>
                <p>
                  Confirmed under <strong>Ref No. EU/ACE&amp;T/2026/31</strong> (03/11/2026) by Akal College of Engineering &amp; Technology, Eternal University, Sirmaur, signed by the HoD (Dept. of CSE) and Dean (ACET) for field-testing and NESFIC-D-05 submission to PWD, Government of Assam.
                </p>
                <button
                  type="button"
                  onClick={() => setLightboxPhoto({ src: '/brand/eternal-university-certificate.jpg', caption: 'Eternal University · Letter of Confirmation (Ref No. EU/ACE&T/2026/31)' })}
                  style={{ padding: 0, border: '1px solid var(--border-warm)', borderRadius: '10px', overflow: 'hidden', background: '#ffffff', cursor: 'pointer', textAlign: 'left' }}
                >
                  <img
                    src="/brand/eternal-university-certificate.jpg"
                    alt="Eternal University Letter of Confirmation"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                  <div style={{ padding: '8px 12px', fontSize: '12.5px', fontWeight: 700, color: 'var(--saffron)', background: 'var(--bg-ivory)', borderTop: '1px solid var(--border-warm)' }}>
                    Click certificate to inspect full size
                  </div>
                </button>
              </div>
            </div>
          </section>
          <footer className="doc-footer">
            <div>
              <strong style={{ display: 'block', fontSize: '15px', color: 'var(--ink)' }}>
                MargDrishti (मार्गदृष्टि) · Formerly StreetIQ
              </strong>
              <span style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
                Submitted to North-East Seva First Innovation Challenge 2026 (NESFIC-D-05) · Public Works Department, Government of Assam
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src="/brand/mnm-logo.png" alt="Team MnM" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
              <span className="pwd-pill">Ref: EU/ACE&amp;T/2026/31</span>
            </div>
          </footer>
        </main>
      </div>
      {lightboxPhoto && (
        <div className="lightbox-backdrop" onClick={() => setLightboxPhoto(null)} role="dialog" aria-modal="true">
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <img src={lightboxPhoto.src} alt={lightboxPhoto.caption} />
            <div className="lightbox-bar">
              <strong style={{ fontSize: '14px', color: 'var(--ink)' }}>{lightboxPhoto.caption}</strong>
              <button type="button" className="btn-primary" style={{ padding: '7px 16px', fontSize: '13px' }} onClick={() => setLightboxPhoto(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}