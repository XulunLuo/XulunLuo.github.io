---
layout: page
title: UWB + IMU Fusion Camera Tracking
subtitle: WLab Virtual Production
importance: 5
# Card/hero image (use the same file for both to be safe across custom includes)
img: assets/img/projects/uwb-imu/FinalCombination.jpg
tags: [Virtual Production, Sensor Fusion, IMU, UWB, EKF, LTC, UDP, UE]
description: Radio + inertial fallback tracking for LED-wall sets, time-locked to LTC for frame-true capture at 25 Hz.
links:
  - { label: "Slide Deck", url: "#" }
  - { label: "Demo", url: "#" }
---

<h2 style="color:#ff6666;">Why it matters</h2>
On LED-wall stages, optical systems (e.g., OptiTrack) can jitter or drop when markers get occluded by crew/rigs. I prototyped a **radio + inertial fallback** that keeps pose stable during those gaps and produces research-grade logs for model training.

<div class="row">
  <div class="col-sm mt-3">{% include figure.liquid loading="eager" path="assets/img/projects/uwb-imu/OptiTrackPack.png" title="OptiTrack rig pack" class="img-fluid rounded z-depth-1" %}</div>
  <div class="col-sm mt-3">{% include figure.liquid loading="eager" path="assets/img/projects/uwb-imu/MarkersAndTracking.png" title="Markers & tracking solve" class="img-fluid rounded z-depth-1" %}</div>
  <div class="col-sm mt-3">{% include figure.liquid loading="eager" path="assets/img/projects/uwb-imu/MarkerJitter.png" title="Marker jitter during occlusion" class="img-fluid rounded z-depth-1" %}</div>
</div>

---

<h2 style="color:#66ccff;">My role</h2>
- Built end-to-end pipeline: UWB anchors + tag, dual-IMU, edge compute, UDP telemetry, Unreal ingest.
- Reverse-engineered UWB byte streams; normalized to ASCII/JSON with on-demand mode switching.
- Designed a bounded time-window **“catch” matcher** to pair UWB/IMU packets deterministically.
- Implemented **LTC “chase”** sync to align (UWB+IMU) with OptiTrack frames for dataset generation.

<div class="row">
  <div class="col-sm mt-3">{% include figure.liquid path="assets/img/projects/uwb-imu/Ranging.png" title="UWB ranging topology" class="img-fluid rounded z-depth-1" %}</div>
  <div class="col-sm mt-3">{% include figure.liquid path="assets/img/projects/uwb-imu/UWB3D.png" title="UWB 3D anchor geometry" class="img-fluid rounded z-depth-1" %}</div>
  <div class="col-sm mt-3">{% include figure.liquid path="assets/img/projects/uwb-imu/IMU.jpg" title="IMU axes & orientation" class="img-fluid rounded z-depth-1" %}</div>
</div>

---

<h2 style="color:#33cc99;">System overview</h2>
- **Hardware:** UWB anchor network & on-camera tag, dual IMUs, Raspberry Pi edge node, LTC generator, OptiTrack reference.
- **Software:** Concurrent serial + UDP I/O, packet pairing, jitter buffer, 25 Hz stream, ASCII/JSON logs, LTC retiming.

<div class="row justify-content-center">
  <div class="col-sm-8 mt-3 text-center">
    <img src="{{ 'assets/img/projects/uwb-imu/DemoCombination.jpg' | relative_url }}"
         alt="On-rig combo: UWB + dual IMUs + markers"
         class="rounded z-depth-1"
         style="width:70%; height:auto; max-height:300px; object-fit:contain;">
    <p class="mt-2 text-muted small">On-rig combo: UWB + dual IMUs + markers</p>
  </div>
</div>

---

<h2 style="color:#9966ff;">Technical Challenges & Solutions</h2>
- **Challenge:** OptiTrack frequently lost tracking when reflective markers were blocked by crew or equipment.  
  - **Solution:** Prototyped a **UWB-assisted fallback** system to complement optical tracking and maintain continuous pose estimation during occlusions.  
  - **Outcome:** Short dropouts no longer interrupted camera tracking, ensuring stable and uninterrupted motion capture.

- **Challenge:** UWB vendor documentation lacked details on frame layouts, with anchors reporting only relative distances instead of absolute positions.

  - **Solution:** **Reverse-engineered** the communication protocol through differential probing and systematic logging, mapping byte fields to physical values and exporting standardized ASCII/JSON data.
  - **Outcome:** Achieved a transparent, normalized data stream compatible with other sensor inputs and fusion scripts.

- **Challenge:** UWB data alone exhibited severe vertical drift, even with a well-distributed 3D anchor setup.

  - **Solution:** Integrated **dual IMUs** to provide quaternion orientation, angular rate, and acceleration data for vertical stabilization and motion priors.
  - **Outcome:** The system maintained stable Z-axis readings and realistic movement profiles, significantly improving overall tracking fidelity.

- **Challenge:** Edge computing on ESP32 required complex multithreading and caused race conditions, slowing iteration and debugging.

  - **Solution:** Migrated computation to a **Raspberry Pi running Python**, enabling threaded serial and UDP I/O with lightweight concurrency control.
  - **Outcome:** Increased iteration speed, improved stability, and simplified live debugging during on-set testing.

- **Challenge:** Timestamp drift between UWB and IMU modules led to inconsistent cross-sensor pairing.

  - **Solution:** Developed a **bounded time-window matching algorithm** that only emits fused data when packets align temporally, discarding partial records.
  - **Outcome:** Achieved consistent, drift-free synchronization across heterogeneous sensors suitable for data logging and model training.

- **Challenge:** Raw binary packets caused instability and inconsistent data rates during streaming.

  - **Solution:** Implemented **rate control and structured UDP telemetry** at 25 Hz with sequence IDs, validity flags, and a jitter buffer.
  - **Outcome:** Delivered smooth, reliable telemetry suitable for real-time visualization and dataset generation.

- **Challenge:** Multi-sensor data streams required precise frame-true synchronization for motion analysis and training datasets.
  - **Solution:** Adopted **LTC (Linear Time Code)** as the global master clock, with automatic retiming whenever drift exceeded the set threshold.
  - **Outcome:** Established frame-accurate timing across all capture systems, aligning with professional film and virtual production standards.

<div class="row">
  <div class="col-sm mt-3">{% include figure.liquid path="assets/img/projects/uwb-imu/CodeSnippet.jpg" title="Packet parser & threads" class="img-fluid rounded z-depth-1" %}</div>
  <div class="col-sm mt-3">{% include figure.liquid path="assets/img/projects/uwb-imu/datapackage.jpg" title="Normalized telemetry record" class="img-fluid rounded z-depth-1" %}</div>
  <div class="col-sm mt-3">{% include figure.liquid path="assets/img/projects/uwb-imu/kalman.jpg" title="Fusion & EKF diagram" class="img-fluid rounded z-depth-1" %}</div>
</div>

<div class="row">
  <div class="col-sm mt-3">{% include figure.liquid path="assets/img/projects/uwb-imu/LTC.png" title="LTC master clock" class="img-fluid rounded z-depth-1" %}</div>
  <div class="col-sm mt-3">{% include figure.liquid path="assets/img/projects/uwb-imu/FinalCombination.jpg" title="Final on-set combination" class="img-fluid rounded z-depth-1" %}</div>
</div>

---

<h2 style="color:#ffaa33;">Results</h2>
- **25 Hz fused telemetry** (UDP) aligned to LTC/OptiTrack; clean UE ingestion.
- **Deterministic integrity:** complete-or-drop policy via “catch” matcher.
- **Low drift:** ~1 frame average over 30-minute captures at 25 Hz with LTC chase.
- **Production resilience:** practical tracking continuity when optics degrade.

<div class="mt-3 text-center" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe
    src="https://drive.google.com/file/d/1_5rCD2XlDwAunYrIlPmMRGNqVKEGVivI/preview"
    allow="autoplay"
    allowfullscreen
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
  ></iframe>
</div>
