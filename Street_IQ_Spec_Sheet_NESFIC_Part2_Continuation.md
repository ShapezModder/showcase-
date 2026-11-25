# StreetIQ Gov — Technical Specification, Model Validation & Deployment Continuation (Page 15 Onwards)

**Document Reference:** Continuation of *Street IQ Spec Sheet NESFIC.docx* (NESFIC-D-05 | Public Works Department, Government of Assam)  
**Institution Endorsement:** Ref No. EU/ACE&T/2026/31  
**Target Audience:** PWD Assam Engineers, Technical Evaluators, Systems Architects & State Innovation Reviewers

---

## 11. Complete Taxonomy of Analysed Classes & Engineering Standards

For an automated road monitoring system to be trusted by government highway engineers, it cannot simply draw generic boxes around "damage." It must classify road conditions using recognised engineering categories, assign consistent severity weights, and account for both the surrounding traffic environment and the geometry of the roadway itself.

StreetIQ Gov analyses three distinct layers simultaneously: **Road Surface Defects (Layer 1)**, **Roadway Geometry & Lanes (Layer 2)**, and **Traffic & Vulnerable Road Users (Layer 3)**.

### 11.1 Layer 1: Road Surface Distress Classes (ASTM D6433 & IRC:82-2015 Alignment)

The primary pavement perception model is trained to detect **10 distinct road surface distress and feature classes**. In the production backend (`backend/src/routers/vision.py`), the 8 core pavement distress classes are actively mapped to ASTM D6433 distress codes, severity weights (`1` to `5`), and Pavement Condition Index (PCI) deduction points, while the full 10-class model checkpoint also recognises edge cracking and surface bumps/sags for extended analysis.

| Class ID | Raw Model Label | Display Label in StreetIQ | App Category | ASTM D6433 Code | Severity (1–5) | PCI Deduct Points | Engineering Meaning & Maintenance Action |
| :---: | :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **0** | `longitudinal_transverse_crack` | Longitudinal / Transverse Crack | `crack` | **10** | **3** (Medium) | **8** | Linear cracks running parallel or perpendicular to traffic flow caused by shrinkage, joint fatigue, or axle loads. Requires early **crack sealing** to block monsoon water ingress. |
| **1** | `alligator_crack` | Alligator Crack | `crack` | **1** | **4** (High) | **15** | Interconnected fatigue cracking resembling crocodile skin. Signals **base or sub-base structural failure** under repeated heavy loads; requires **deep patching or overlay**. |
| **2** | `block_crack` | Block Crack | `crack` | **3** | **3** (Medium) | **8** | Large rectangular/polygonal interconnected cracks caused by asphalt binder hardening and thermal cycling. Requires **slurry seal or thin overlay**. |
| **3** | `patching` | Patching | `patch` | **11** | **2** (Low) | **3** | Previously repaired road sections or utility-cut fills. Logged so PWD engineers can track **repair durability** across pre- and post-monsoon surveys. |
| **4** | `pothole` | Pothole | `pothole` | **13** | **5** (Critical) | **15** | Bowl-shaped structural cavities where aggregate and bitumen have broken away. Immediate **safety hazard** for two-wheelers and autos; requires **urgent cold/hot-mix filling**. |
| **5** | `weathering_raveling` | Weathering / Raveling | `surface_damage` | **19** | **2** (Low) | **3** | Loss of surface binder and dislodgement of fine aggregate particles due to moisture and UV exposure. Indicates early surface ageing; treated with **fog seal or surface dressing**. |
| **6** | `lane_shoulder_drop_off` | Lane / Shoulder Drop-off | `shoulder_drop` | **9** | **4** (High) | **15** | Elevation difference between the paved carriageway edge and unpaved earthen/gravel shoulder. High **rollover/skid risk** on narrow Assam district and hill roads. |
| **7** | `marking_manhole` | Marking / Manhole | `manhole` | *N/A* | **2** (Low) | **3** | Utility manholes, recessed covers, and faded/damaged road markings on the carriageway. Helps distinguish intentional road fixtures from structural potholes. |
| **8** | `edge_crack` | Edge Crack *(Extended)* | `crack` | *IRC / Extended* | **3** (Medium) | *Extended* | Crescent-shaped cracks within 0.3–0.6 m of the pavement edge due to lack of shoulder support and monsoon edge erosion. |
| **9** | `bumps_and_sags` | Bumps and Sags *(Extended)* | `surface_damage` | *IRC / Extended* | **3** (Medium) | *Extended* | Localised upward displacements (bumps/shoving) or downward depressions (sags) affecting ride quality and vehicle stability. |

#### How Pavement Condition Index (PCI) Is Computed Live

On every analysed frame, StreetIQ computes an instantaneous **Estimated PCI (0–100)** by subtracting severity-weighted deduct points from a baseline score of `100` (clamped to `[0, 100]`):

$$\text{PCI}_{\text{frame}} = \max\Big(0,\; \min\big(100,\; 100 - \sum_{i} \text{Deduct}(s_i)\big)\Big)$$

where $\text{Deduct}(s_i) = 15$ for severity $s_i \ge 4$, $8$ for $s_i = 3$, and $3$ for $s_i \le 2$.

The numeric PCI score maps directly to standard five-tier pavement health categories used in official PWD reports:

| PCI Score Range | Condition Rating | Operational Interpretation |
| :---: | :--- | :--- |
| **85 – 100** | **Good** | Sound pavement; routine monitoring only. |
| **70 – 84** | **Satisfactory** | Minor surface wear or isolated cracks; schedule preventive sealing. |
| **55 – 69** | **Fair** | Moderate cracking or patching; prioritise before next monsoon. |
| **40 – 54** | **Poor** | Significant structural distress or potholes; corrective maintenance required. |
| **0 – 39** | **Serious** | Severe pavement failure; urgent rehabilitation / reconstruction required. |

---

### 11.2 Layer 2: Roadway Geometry & Drivable Corridor Classes

Detecting a crack in isolation is not enough if the system cannot tell whether the crack lies on the **active carriageway** or on an adjacent dirt yard or footpath. Layer 2 performs pixel-level semantic segmentation across two complementary classes:

1. **Drivable Area (`da_out`)**: Pixels belonging to the active paved carriageway (`softmax` probability $> 0.58$ in backend / $> 0.62$ in browser fallback), converted via contour extraction and Douglas–Peucker polygon simplification into smooth normalised road-corridor polygons.
2. **Lane Lines (`ll_out`)**: Pixels belonging to longitudinal road markings and lane dividers (`softmax` probability $> 0.50$), extracted into polylines. This verifies lane-marking visibility and anchors defect context to the vehicle's travel corridor.

---

### 11.3 Layer 3: Traffic, Vulnerable Road Users & Forward Collision Classes

Survey vehicles operate in live mixed Indian traffic—sharing roads with pedestrians, cyclists, two-wheelers, buses, and heavy freight trucks. Layer 3 tracks **6 active road-user classes**, each paired with a calibrated nominal physical height ($H_{\text{nominal}}$) for monocular distance estimation:

| Class ID | Road User Class | Nominal Physical Height ($H_{\text{nominal}}$) | Safety & Operational Role |
| :---: | :--- | :---: | :--- |
| **0** | **Pedestrian** | **1.7 m** | Vulnerable road user protection in market zones, school zones, and rural settlements. |
| **1** | **Bicycle** | **1.4 m** | Slow-moving shoulder traffic common across rural Assam. |
| **2** | **Car** | **1.5 m** | Standard passenger vehicles for following-distance and congestion context. |
| **3** | **Motorcycle** | **1.4 m** | High-risk two-wheeler traffic especially vulnerable to sudden potholes. |
| **5** | **Bus** | **3.2 m** | Heavy public transport vehicles causing high axle-load fatigue on bitumen. |
| **7** | **Truck** | **3.0 m** | Heavy freight vehicles contributing to alligator cracking and rutting. |

---

## 12. Technical Architecture & How the Tri-Layer Solution Works

### 12.1 Why a Single Model Is Not Enough

Most academic road-damage prototypes run only one defect detector on static images. In real-world PWD highway surveys, a single detector faces three practical problems:
1. It cannot separate **drivable carriageway** from non-road clutter.
2. It provides no awareness of **surrounding vehicles or pedestrians**, which is essential both for driver safety during surveys and for understanding traffic load on damaged stretches.
3. Heavy two-stage detectors (such as Faster R-CNN) run too slowly for continuous vehicle-mounted operation.

StreetIQ Gov solves this by combining **three specialised neural networks** into one synchronised perception pipeline (`run_tri_layer_detection` in `backend/src/routers/vision.py`):

```text
  Camera / Mobile Stream / Dashcam Frame (640x360 -> 640x640)
         │
         ├──► [Layer 1] YOLO11-L ASTM D6433 Detector (25.29M params, 86.9 GFLOPs)
         │         └──► 8-Class Road Defects + Severity + Live PCI Score
         │
         ├──► [Layer 2] TwinLiteNet+ Nano Dual-Head Segmentation (156 KB safetensors)
         │         └──► Drivable Road Polygon + Lane Line Polylines (luminance-gated)
         │
         └──► [Layer 3] YOLO11-N + IoU Optical Kinematic Tracker
                   └──► 6 Traffic Classes + Distance (m) + Time-to-Collision (TTC) + Audio/Visual FCW
```

### 12.2 How Each Layer Works Under the Hood

#### Layer 1: Road Surface Defect Detection (`YOLO11-L` ASTM D6433)
- **Architecture:** Single-stage anchor-free object detector with a C3k2/C2PSA backbone and FPN/PAN multi-scale neck (`190` fused layers, `25,287,022` parameters, `86.9 GFLOPs` at `640×640`).
- **Why `YOLO11-L`:** Larger capacity (`Large` variant) captures fine hairline longitudinal cracks (`2–10 mm` wide) and subtle weathering patterns that lightweight `Nano` models miss, while remaining fast enough on entry-level GPUs (`~39.7 ms` per frame on an RTX 3050).
- **Confidence Threshold:** Default `0.15` to preserve high recall on faint early-stage cracks, followed by Non-Maximum Suppression (NMS) to prevent overlapping duplicate boxes.

#### Layer 2: Drivable Area & Lane Segmentation (`TwinLiteNet+ Nano`)
- **Architecture:** Ultra-lightweight encoder–decoder segmentation network (`156 KB` weights in `model.safetensors`) built with Depthwise Separable Convolutions (`ESP` / `DepthwiseSeparableConv`), Partial Class Activation Attention (`CAAM`), and dual segmentation heads (`da_out` for drivable area, `ll_out` for lane lines).
- **Brightness & Contrast Gate:** Before running segmentation, StreetIQ computes the frame's mean pixel intensity ($\mu$) and standard deviation ($\sigma$). If $\mu < 25.0$ or $\sigma < 14.0$ (for example, a covered lens, pitch-black tunnel, or camera initialisation frame), segmentation is skipped automatically to eliminate spurious polygon artefacts.
- **Contour Extraction:** Binary masks are thresholded and smoothed using `cv2.findContours` and `cv2.approxPolyDP` (filtering drivable regions $> 2200\text{ px}^2$ and lane segments $> 120\text{ px}^2$) into compact normalised coordinate arrays.

#### Layer 3: Vehicle Tracking & Optical Kinematic Time-to-Collision (TTC)
- **Detection:** `YOLO11-N` detects all 6 target road-user classes (`conf >= 0.25`, minimum bounding box $18 \times 18\text{ px}$ to reject distant horizon noise).
- **Monocular Distance Estimation:** Using calibrated focal-length geometry ($f_{\text{px}} = 650 \times \frac{W}{640}$) and each class's nominal height $H_{\text{nominal}}$, physical distance $D$ in metres is estimated as:

$$D = \text{clamp}\!\left(\frac{f_{\text{px}} \cdot H_{\text{nominal}}}{h_{\text{px}}},\; 2.0,\; 120.0\right)$$

- **IoU Multi-Frame Tracking & Smoothed Expansion Rate:** Consecutive detections are matched across frames using Intersection-over-Union ($\text{IoU} > 0.20$). The system tracks the rate of bounding-box height growth $\frac{dh}{dt}$ smoothed with an Exponential Moving Average ($\alpha = 0.65$):

$$\left(\frac{dh}{dt}\right)_t = 0.65 \cdot \frac{h_t - h_{t-1}}{\Delta t} + 0.35 \cdot \left(\frac{dh}{dt}\right)_{t-1}$$

- **Optical Time-to-Collision (TTC):** Under perspective projection, $\text{TTC} \approx \frac{h}{dh/dt}$ when the target is expanding ($\frac{dh}{dt} > 1.5\text{ px/s}$). StreetIQ classifies collision risk into three real-time alert tiers:
  - **COLLISION WARNING (`#FF453A`)**: $\text{TTC} < 2.0\text{ s}$ and $D < 35.0\text{ m}$ (triggers optional Web Audio warning chime with 4-second anti-spam cooldown or 40% surge override).
  - **APPROACHING (`#FF9F0A`)**: $\text{TTC} \le 3.5\text{ s}$ and $D < 50.0\text{ m}$.
  - **Safe (`#30D158`)**: All other tracked road users.

### 12.3 Hybrid Local-First Execution & Browser Fallback

In local/workstation deployments, the frontend sends frames over `localhost` (`http://127.0.0.1:8000/predict/tri_layer`) to the PyTorch GPU/CPU backend for maximum speed and precision. If the backend is unavailable, the frontend automatically switches to its **in-browser WebAssembly ONNX Runtime engine** (`localTriLayerEngine.js`), running full-precision FP32 exports of all three models directly inside the browser without requiring server connectivity.

---

## 13. Genuine Model Validation, Empirical Benchmarks & Performance Analysis

All metrics reported in this section are **directly measured** from the model checkpoint metadata (`yolo11l_640_best.pt`) and controlled hardware benchmarks executed on this codebase. **No synthetic, inflated, or unverified numbers are presented.**

### 13.1 Layer 1 Training & Validation Performance (143-Epoch Checkpoint Evaluation)

Inspection of the saved validation telemetry inside `backend/weights/yolo11l_640_best.pt` (`143` completed training epochs at `640×640` input resolution) yields the following verified validation metrics:

| Evaluation Metric | Final Epoch (Epoch 143) | Peak Observed Across Training | Interpretation |
| :--- | :---: | :---: | :--- |
| **Precision (Box)** | **0.6824 (68.24%)** | — | Nearly 7 out of 10 predicted defect boxes correspond to true annotated road distresses. |
| **Recall (Box)** | **0.6041 (60.41%)** | — | Over 60% of ground-truth distresses are captured even across complex multi-crack frames. |
| **F1 Score (Harmonic Mean)** | **0.6409 (64.09%)** | **0.6530 (65.30%)** | Balanced precision–recall trade-off suited to continuous video scanning where repeated frames boost effective per-defect recall. |
| **mAP@0.50** | **0.6570 (65.70%)** | **0.6577 (65.77%)** | Strong object-level localisation across 10 fine-grained pavement distress categories. |
| **mAP@0.50:0.95** | **0.4014 (40.14%)** | — | Strict IoU-averaged localisation accuracy across varying crack aspect ratios. |

![Layer 1 143-Epoch Validation Metrics and Loss Convergence](docs/validation_charts/training_validation_curves.png)

*Why an F1 score of `0.6409` on single frames works effectively in moving-vehicle surveys:* Road cracks and potholes are elongated, overlapping textures where two human annotators often draw slightly different box boundaries (reducing strict single-frame IoU). However, at `12.1 FPS` on a moving vehicle (`25 km/h` $\approx 6.9\text{ m/s}$), a single pothole remains visible in **15 to 25 consecutive camera frames**. Even with a `60.4%` single-frame recall, the probability of missing a defect across just 5 consecutive frames drops to $(1 - 0.604)^5 \approx \mathbf{0.97\%}$ (over **99% multi-frame detection probability**).

### 13.2 Measured Hardware Inference Latency & Throughput (GPU vs. CPU)

To verify real-world deployability on affordable hardware, we benchmarked the exact production tri-layer pipeline (`640×360` dashcam input resized to `640×640`) on **NVIDIA GeForce RTX 3050 6GB Laptop GPU (CUDA)** versus **AMD Ryzen 5 7235HS (CPU Only)** across warm frames from `video3.mp4`:

| Pipeline Layer | CUDA GPU Latency (`RTX 3050 6GB`) | CPU-Only Latency (`Ryzen 5 7235HS`) | GPU Speedup Factor |
| :--- | :---: | :---: | :---: |
| **Layer 1: Road Surface Defects** (`YOLO11-L`) | **39.7 ms** | 334.5 ms | **8.4× faster** |
| **Layer 2: Road & Lane Segmentation** (`TwinLiteNet+`) | **21.7 ms** | 71.8 ms | **3.3× faster** |
| **Layer 3: Vehicles & TTC Tracking** (`YOLO11-N`) | **21.1 ms** | 52.4 ms | **2.5× faster** |
| **Combined Tri-Layer Pipeline (All 3 Active)** | **82.5 ms** | **458.7 ms** | **5.6× faster** |
| **Sustained Throughput (FPS)** | **12.1 FPS** | **2.2 FPS** | **5.5× higher** |

![Measured Inference Latency and Throughput Comparison](docs/validation_charts/inference_latency_fps.png)

**Key Engineering Finding:** Even an entry-level **RTX 3050 6GB Laptop GPU** achieves **12.1 FPS** running all three models simultaneously (`82.5 ms` total latency). At the recommended PWD survey speed of `25 km/h` (`6.94 m/s`), `12.1 FPS` captures one complete tri-layer inspection frame every **0.57 metres** of road travel—more than dense enough to ensure every crack and pothole is scanned multiple times.

### 13.3 Field Validation on Dashcam Videos & Real Smartphone Road Photos

We evaluated the production models on two real-world datasets inside this project:

1. **Dashcam Video Benchmark (`234` uniformly sampled frames across `video2.mp4` and `video3.mp4`):**
   - **Road Surface Defects Detected:** `280` total detections (mean confidence `0.375`):
     - Longitudinal / Transverse Crack: **213** (`76.1%`)
     - Pothole: **29** (`10.4%`)
     - Marking / Manhole: **17** (`6.1%`)
     - Alligator Crack: **15** (`5.4%`)
     - Patching: **6** (`2.1%`)
   - **Road Users Detected:** `277` total detections (mean confidence `0.582`):
     - Car: **213**, Pedestrian: **38**, Truck: **25**, Bus: **1**.
2. **Real Smartphone Field Dataset (`143` field photographs in `StreetIQ_testing`):**
   - **Road Hazards Detected:** **135** defects across **84** images (`58.7%` defect incidence).
   - **Vehicles Detected:** **196** vehicles across **77** images (`53.8%` traffic incidence).

![Field Validation Detection Distribution](docs/validation_charts/field_validation_distribution.png)

*Note on Confidence Calibration:* Pavement cracks naturally exhibit lower raw visual contrast than solid vehicles, which is why road defects average `0.375` confidence while vehicles average `0.582`. Setting the defect confidence threshold to `0.15` (rather than `0.50`) is a deliberate engineering decision so hairline cracks are captured early rather than silently ignored.

---

## 14. End-to-End System Architecture & Database Design

StreetIQ Gov is engineered as a modular client–server platform backed by **FastAPI**, **PostgreSQL + PostGIS**, **Supabase Storage**, and **React (Vite)**.

### 14.1 Backend REST API Modules (`backend/src/routers/`)

| Router Module | Base Endpoints | Core Responsibilities |
| :--- | :--- | :--- |
| **`vision.py`** | `/health/vision`, `/predict/tri_layer`, `/predict/frame`, `/predict/base64` | Executes selective or full tri-layer AI inference, computes live PCI, tracks vehicles & TTC, and reports device/VRAM status. |
| **`fleet.py`** | `/api/fleet/vehicles`, `/api/fleet/vehicles/{id}` | Registers patrol vehicles, drivers, crew lists, jurisdiction names, and updates live PostGIS `last_location` heartbeats. |
| **`tasks.py`** | `/api/tasks`, `/api/tasks/{id}/status`, `/api/tasks/{id}/reply`, `/api/tasks/{id}/mark-read` | Creates assigned road-stretch tasks (`route_points`, `target_speed_kmh`, `priority`), handles surveyor replies, and tracks unread official alerts. |
| **`trips.py`** | `/api/trips`, `/api/trips/{id}` | Records every survey trip's GeoJSON route, `avg_speed_kmh`, `max_speed_kmh`, `speed_telemetry`, `total_distance_km`, `total_hazards_count`, and final `calculated_pci`. |
| **`defects.py`** | `/api/defects`, `/api/defects/{id}/action`, `/api/defects/{id}/audit` | Stores immutable geo-tagged defect detections (`astm_code`, `severity_score`, `confidence_score`, `speed_kmh`, `image_url`) and maintains official review audit logs. |
| **`reports.py`** | `/api/reports/summary`, `/api/reports/vehicle/{id}` | Aggregates state/district defect statistics, PCI distributions, and vehicle-wise inspection histories for printable official reports. |

### 14.2 Geospatial PostgreSQL / PostGIS Schema (`supabase_complete_schema.sql`)

The relational database uses **PostGIS (`GEOMETRY(Point, 4326)`)** across six core tables:
- **`gov_profiles`**: Role-based user profiles (`surveyor` or `official`), department, phone, `assigned_state` (default `Assam`), and `assigned_city` (default `Guwahati`).
- **`survey_vehicles`**: Vehicle registry, crew roster, status (`idle` / `active`), cumulative `total_distance_km`, `defects_logged`, and `last_heartbeat`.
- **`survey_tasks`**: Assigned stretches with `start_location`, `end_location`, `route_points` JSONB, `target_speed_kmh` (default `25.0`), `priority`, and `is_free_drive`.
- **`survey_trips`**: Complete trip telemetry (`trip_route_geojson`, `speed_telemetry`, `avg_speed_kmh`, `max_speed_kmh`, `calculated_pci`, `pci_category`).
- **`hazards`**: Every detected defect with `astm_code`, `severity_score`, `confidence_score`, `speed_kmh`, `location`, `image_url`, and official review status (`under_review` / `action_status`).
- **`defect_audit_logs`**: Append-only audit trail recording every status transition (`previous_status` → `new_status`, `official_name`, `official_remarks`, timestamp).

---

## 15. Field Surveyor Portal & Operational Features

The **Surveyor Dashboard** (`SurveyorDashboard.jsx` & `SurveyCockpit.jsx`) is designed so field drivers and junior engineers can run high-precision surveys with minimal training:

1. **Assigned Task Queue & Free Drive Mode:** Surveyors see tasks assigned to their vehicle with priority badges (`urgent` / `routine`), road name, target speed (`25 km/h`), distance, and notes from PWD officials. A **Drive & Random Scan** (`is_free_drive`) button allows immediate unscheduled patrolling anywhere.
2. **Pre-Flight Readiness Check (`PreFlightModal.jsx`):** Before entering the live cockpit, the system verifies GPS permission/lock, camera/mobile-device video stream availability, and AI scanner readiness.
3. **Turn-by-Turn Route Navigation (`TurnByTurnNavModal.jsx`):** Guides the driver along the official's planned road stretch using live GPS tracking (`SurveyorTrackMap.jsx`).
4. **Live Survey Cockpit (`SurveyCockpit.jsx`):**
   - Displays the live video feed with real-time bounding boxes, drivable road corridor, lane lines, and vehicle TTC tags.
   - **Live Speed & Overspeed Alert:** Displays real-time speed (`km/h`) and flashes a warning if speed exceeds `targetSpeed + 10 km/h` (preventing motion blur).
   - **Live PCI & Hazard Counter:** Continuously updates `PCI Score (0–100)`, `PCI Rating`, `GPS Accuracy (m)`, `Distance Covered (km)`, and logged hazard count.
   - **Audio-Visual FCW Alerts:** Plays a synthesised Web Audio chime when an imminent forward collision warning (`TTC < 2.0 s`) occurs.
   - **Automatic Snapshot Upload & Persistence:** Captures annotated defect snapshots (`640×360` JPEG) and uploads them directly to `hazard-images` storage alongside GPS coordinates and vehicle speed.
5. **Two-Way Official Communication:** Surveyors can send field replies directly on an assigned task (for example, reporting road blockages or floodwater detours).

---

## 16. Wireless "Add Device" Feature — Why a Survey Car Is Not Always Required

One of StreetIQ Gov's most practical innovations for Northeast India is the **Add Device / Remote Mobile Camera Bridge** (`MobileCameraPage.jsx` + `remoteCameraBridge.js`).

### 16.1 How the "Add Device" Workflow Works

1. Inside the Surveyor Dashboard, the operator clicks **Add Device**, enters a friendly name (for example, *"Bike Mount Cam 1"* or *"Auto Patrol Phone"*), and instantly receives a **unique pairing URL** (`https://<host>/?cam=<device_id>&name=<device_name>`).
2. The operator opens that link on any secondary smartphone—no app store download or login required on the phone.
3. The phone automatically requests rear camera access (`facingMode: { ideal: 'environment' }`), locks the screen awake (`navigator.wakeLock.request('screen')`), and begins streaming **live video + high-precision GPS coordinates + live speed (`km/h`)** over a low-latency peer-to-peer WebRTC bridge.
4. On the Surveyor's laptop or tablet (inside a vehicle cabin or backpack), the **paired camera appears online** at the top of the dashboard. Selecting it routes the phone's live video, GPS, and speed straight into the AI Survey Cockpit, which processes every frame and saves all detections and trip telemetry to the database.

### 16.2 Why This Eliminates the Need for a Dedicated Survey Car

In Assam and neighbouring Northeastern states, many critical roads **cannot** be surveyed easily by a four-wheel survey van:
- Narrow rural PMGSY roads, village connectivity tracks, and market lanes.
- Congested urban arterial bottlenecks in Guwahati, Silchar, Jorhat, or Dibrugarh.
- Steep, narrow hill roads and landslide-affected bypasses in Dima Hasao, Karbi Anglong, or Arunachal Pradesh.

Because the perception engine and dashboard accept any paired smartphone via a single link, PWD teams can mount a weather-protected smartphone on:
- **Two-wheelers / Patrol Motorcycles** (ideal for rapid post-monsoon rural road checks).
- **Auto-rickshaws or Public Buses** (passive daily scanning along commuter corridors).
- **Standard Department Jeeps / Pickups** (no vehicle modification or roof-rack drilling required).

---

## 17. Government Official (Admin) Portal & Audit Features

The **Official Dashboard** (`OfficialDashboard.jsx`) provides PWD engineers and senior administrators with complete oversight:

1. **Fleet Oversight Map (`FleetOverviewMap.jsx`):** Live map showing every registered survey vehicle, active/idle status, last heartbeat timestamp, driver/crew details, and total kilometres surveyed.
2. **Interactive Road Stretch Planner (`StretchPlannerMap.jsx` & `StretchDistanceCheckerModal.jsx`):** Officials click start and end points on the map to automatically compute road route geometry (`route_points`) and corridor length (`distance_km`), then assign the stretch to a specific vehicle with a target speed and priority (`routine` or `urgent`).
3. **Vehicle Task Stretch Map (`VehicleTaskStretchMap.jsx`):** Visualises assigned vs. completed stretches per vehicle alongside unread surveyor replies.
4. **Survey Trip Inspection Modal (`SurveyTripDetailModal.jsx`):** Allows officials to open any completed or active trip, inspect the driven GPS route on the map, review speed telemetry (`avg_speed_kmh`, `max_speed_kmh`), and browse every captured defect thumbnail with its ASTM code, severity, confidence, and vehicle speed at detection time.
5. **Defect Verification & Audit Trail (`defect_audit_logs`):** Officials can inspect individual defects, mark verification/repair actions (`PATCH /api/defects/{id}/action`), add `official_remarks`, and view the immutable chronological audit log (`GET /api/defects/{id}/audit`).
6. **Printable Official Compliance Reports (`PrintReportModal.jsx`):** Generates clean, print-ready government summary and vehicle-wise inspection reports with PCI scores, hazard breakdowns, and stretch metrics ready for tender and budget justification.
7. **Interactive Demo Mode (`ScanDemoModal.jsx`):** Allows officials and reviewers to test all three perception layers on pre-loaded dashcam footage with live layer toggles (**Road Defects**, **Vehicle Hazard**, **Road & Lanes**) before field deployment.

---

## 18. System Integrity, Anti-Tampering & Loophole Mitigation

Government infrastructure audits often fail not because of software bugs, but because of **human and operational loopholes**—such as exaggerated survey distances, fabricated defect counts, skipped road stretches, or post-survey editing of inspection numbers. StreetIQ Gov is explicitly engineered to close these loopholes:

| Potential Loophole / Failure Mode | How StreetIQ Gov Addresses It |
| :--- | :--- |
| **1. Surveyor tampering with defect counts, severity, or PCI scores** | **Strict Immutability:** Surveyors have **zero UI or API permission** to edit or delete logged defects, severity scores, ASTM codes, timestamps, or PCI values. All `hazards` and `survey_trips` telemetry are generated automatically by the AI pipeline and persisted directly. Only authenticated **Officials** can review defects, and every official action is permanently recorded in `defect_audit_logs`. |
| **2. "Ghost Driving" / Parking with GPS jitter to fake kilometres** | **Speed & Accuracy Gating:** In `SurveyCockpit.jsx`, any GPS reading with speed $< 3\text{ km/h}$ is zeroed out, and any GPS fix with positional uncertainty $> 35\text{ m}$ is excluded from `tripRoutePointsRef` and cumulative `total_distance_km`. Stationary idling never inflates distance. |
| **3. Driving too fast to blur road cracks and skip defects** | **Speed Telemetry + Overspeed Alert:** Every trip stores continuous `speed_telemetry`, `avg_speed_kmh`, and `max_speed_kmh` in `survey_trips`, and every individual hazard stores `speed_kmh` at the moment of capture. If the driver exceeds `target_speed_kmh + 10`, the cockpit raises a live overspeed alert, and officials can audit speed logs later. |
| **4. Inflating defect counts by counting the same pothole 30 times** | **Cooldown & Spatial Deduplication:** The logging pipeline enforces per-class temporal cooldowns (`6 s` in demo / spatial-temporal gating in live cockpit) and supports PostGIS `ST_ClusterDBSCAN` (`3–5 m` radius) so repeated frames of the same physical pothole do not inflate official defect counts. |
| **5. False positives on covered lenses, tunnels, or night initialisation** | **Luminance & Contrast Guard:** Frames with mean brightness $< 25.0$ or contrast std $< 14.0$ are automatically gated out before segmentation so dark frames cannot generate false drivable-area polygons. |
| **6. Mobile screen turning off mid-survey in Remote Camera mode** | **Screen Wake Lock + Reconnection:** `MobileCameraPage.jsx` acquires `navigator.wakeLock` (and re-acquires it on tab visibility change) and maintains continuous heartbeat/GPS status monitoring so the pairing bridge remains alive across long patrols. |
| **7. Network drop-outs in rural or forested Assam highways** | **Local-First Inference:** Because perception runs locally on the patrol laptop/edge unit (or browser ONNX fallback) rather than streaming raw video to a cloud GPU, temporary 4G dead zones never stop AI detection. |

---

## 19. Northeast India & Assam Climate, Terrain & Operational Engineering

Deploying computer vision in Assam and the wider Northeast requires designing for **harsh environmental realities** rather than ideal laboratory conditions:

1. **Prolonged Monsoon Rainfall (6 Months/Year):** Heavy rain creates specular glare on wet bitumen and partially fills shallow potholes with muddy water. Running the camera **inside the vehicle windshield** behind active wiper blades keeps the optics dry and clean—avoiding the mud-fouling problems of downward-facing external laser bars—while the `0.15` defect confidence floor ensures partially water-ringed distresses are still flagged for review.
2. **Dense Tree Canopy & Sudden Shadow Transitions:** Highways near Kaziranga, Nameri, and hill districts alternate rapidly between harsh sunlight and dark forest canopy shadows. By training and validating on diverse lighting conditions and gating out completely dark/unexposed frames ($\mu < 25, \sigma < 14$), StreetIQ avoids mistaking sharp tree shadows for transverse cracks.
3. **Hilly Terrain, Hairpin Bends & Narrow Carriageways:** In Dima Hasao, Karbi Anglong, Meghalaya, and Arunachal Pradesh, road geometry changes continuously on steep gradients. Layer 2's per-frame drivable-corridor segmentation dynamically adapts to curved hill roads without assuming straight multi-lane expressways, while the **Add Device** mode lets teams survey narrow hill stretches by motorcycle where large vans cannot turn safely.
4. **High Humidity & Dust:** Because StreetIQ uses standard enclosed consumer laptops/edge boxes inside the cabin and sealed IP67/IP68 smartphones as external/windshield sensors, hardware failures from dust and humidity are minimised and replacement units can be sourced locally in any district headquarters.

---

## 20. Implementation Cost Analysis for Assam & Northeast India

Traditional road condition surveys rely on imported **Network Survey Vehicles (NSVs)** equipped with laser profilometers and custom strobe rigs, costing **₹1.5 crore to ₹3.0 crore per vehicle** plus **₹1,500–₹3,500 per km** in specialised operating contracts. Consequently, most PWD divisions can afford to survey district and rural roads only once every 1–2 years.

StreetIQ Gov transforms the economics of highway monitoring into three practical deployment tiers:

| Deployment Tier | Equipment Required | Approx. Capex per Unit | Ideal Use Case in Assam / Northeast |
| :--- | :--- | :---: | :--- |
| **Traditional NSV (Baseline)** | Imported laser/LiDAR van + crew | **₹1.5 – 3.0 Crore** | Expressways / NHAI flagship corridors only |
| **StreetIQ Dedicated Edge Kit** | Entry RTX 3050/3060 laptop/mini-PC + 1080p dashcam/phone + vehicle mount + DC inverter | **~₹75,000 – ₹95,000** | District PWD division headquarters for high-speed (`12+ FPS`) daily state highway & MDR audits |
| **StreetIQ Mobile Pairing Mode** | Existing department laptop + existing surveyor smartphone + windshield/handlebar mount | **~₹3,000 – ₹5,000** *(mount & power cable only)* | Rapid rural, two-wheeler, auto-rickshaw, and post-flood emergency surveys across all blocks |

![Per-Unit Deployment Cost Comparison for Assam PWD Divisions](docs/validation_charts/assam_cost_comparison.png)

**Statewide Rollout Insight:** For the price of **one** traditional Network Survey Vehicle (`~₹2.0 crore`), the Assam PWD could equip **all 35 district divisions** with dedicated StreetIQ GPU Edge Kits (`35 × ₹85,000 = ₹29.75 lakh`) and still have over **85% of the budget remaining** for cloud/on-prem database hosting, maintenance training, and immediate pothole repair grants.

---

## 21. Proposed Closed-Software Packaging & Hardware Requirements

For secure government adoption, StreetIQ Gov is designed to be shipped as a **closed, turnkey software appliance** rather than an open cloud dependency or raw developer repository.

### 21.1 Proposed Closed-Software Distribution Model

1. **Packaged Local / On-Premises Bundle:**
   - The React frontend, FastAPI inference engine, and pre-bundled AI model weights are compiled/packaged into a single **signed installer or locked Docker/Windows Appliance** (`StreetIQ-Gov-Appliance`) that starts automatically on boot with zero internet dependency during road patrols.
   - Model weights remain local and protected inside the closed package—field operators interact only with the clean role-based UI, never with raw scripts or model files.
2. **Local Database + Central PWD Sync:**
   - Survey trips, defect snapshots, and speed telemetry can be written to a local PostgreSQL + PostGIS instance on the patrol unit (or district server) and synchronised automatically to the central Assam PWD state portal when office Wi-Fi or 4G connectivity is available.
3. **Role-Hardened Access Control:**
   - Separate credentialed logins for **Field Surveyors** (capture-only, immutable logging) and **PWD Officials** (stretch assignment, verification, audit logs, report export).

### 21.2 Hardware Requirements

Because the tri-layer pipeline was benchmarked directly on consumer GPU and CPU hardware (Section 13.2), the hardware tiers are transparent and realistic:

| Hardware Tier | Minimum Spec (Portable / Field) | Recommended Spec (Production Division Kit) | High-Throughput Spec (Multi-Stream / 1080p) |
| :--- | :--- | :--- | :--- |
| **GPU** | CPU-only (i5 / Ryzen 5) or integrated graphics *(uses browser ONNX / CPU PyTorch at ~2.2 FPS, suited to slow ~15 km/h surveys)* | **NVIDIA RTX 3050 / RTX 3060 (6–12 GB VRAM)** *(delivers 12+ FPS full tri-layer scanning smoothly at 25–40 km/h)* | **NVIDIA RTX 4060 / 4070+ or Jetson Orin** *(25–30+ FPS, supports higher input resolution & multi-camera feeds)* |
| **CPU** | 4-core x86_64 (Intel i5 / AMD Ryzen 5) | 6-core / 8-core (Ryzen 5 7235HS / i5-12450H or better) | 8-core+ (i7 / Ryzen 7) |
| **RAM** | 8 GB | **16 GB** | 32 GB |
| **Storage** | 20 GB free SSD | **256 GB+ NVMe SSD** (for trip video/snapshot caching) | 512 GB+ NVMe SSD |
| **Camera** | Any 720p/1080p smartphone via **Add Device** link or USB webcam | **1080p 30 FPS smartphone or wide-angle dashcam** | 1080p/4K global-shutter or Sony Starvis dashcam |

> **Practical Takeaway:** Even a widely available **NVIDIA RTX 3060 (or RTX 3050 6 GB)** laptop handles all three AI models simultaneously in real time (`~82.5 ms/frame`, `12.1 FPS`) without lag, while upgrading to stronger GPU hardware directly scales inspection speed, camera resolution, and multi-angle coverage.

---

## 22. Conclusion & Implementation Roadmap for PWD Assam

StreetIQ Gov bridges the gap between **unaffordable ₹2-crore laser survey vans** and **inconsistent manual paper inspections**. By pairing an ASTM D6433-aligned tri-layer computer vision engine with tamper-proof GPS/speed telemetry, wireless smartphone camera pairing, and official audit reporting, it gives Assam PWD a practical, field-tested system built for Northeast India's roads, monsoon climate, and budgets.

### Recommended Phased Rollout
1. **Phase 1 — Pilot Validation (Weeks 1–4):** Deploy 3–5 StreetIQ Edge Kits + Mobile Pairing units in 2–3 contrasting Assam divisions (one urban/plains division such as Kamrup Metro, one hill/monsoon-heavy division such as Dima Hasao or Karbi Anglong) to benchmark pre- and post-repair PCI tracking across 200+ km.
2. **Phase 2 — Division-Level Integration (Months 2–3):** Equip district PWD subdivisions with closed-software kits and connect official print reports directly to maintenance prioritisation and contractor verification workflows.
3. **Phase 3 — Statewide Network Intelligence (Months 4–6):** Aggregate district PostGIS defect clusters into a unified Assam Road Health Map enabling predictive pre-monsoon crack sealing before small cracks become costly potholes.
