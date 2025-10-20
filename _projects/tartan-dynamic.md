---
layout: page
title: Tartan-Dynamic — 3D Reconstruction Benchmark in Dynamic Scenes
subtitle: CMU AirLab
category: work
importance: 4
img: assets/img/projects/tartan-dynamic/AirSim.png
tags: [3D Reconstruction, SLAM, AirSim, UE4, ROS, Novel Views, Benchmark]
description: Benchmark pipeline generating dynamic-scene datasets with true novel-view splits, synchronized simulation and planning stack, and reproducible RGB/Depth/LiDAR/pose capture.
---

<h2 style="color:#ff6666;">Why it matters</h2>
- **Interpolation ≠ Generalization:** Traditional datasets reuse nearby frames—models succeed without true extrapolation.  
- **Low dynamic pressure:** Most benchmarks feature few moving objects; our set fills the frame with motion.  
- **SLAM/SfM fragility:** Static-majority optical flow collapses when motion dominates.  
- **Tiny coverage:** Common sets (< 1 km²) lack the spatial diversity needed for outdoor generalization.  
- **Tooling gap:** Novel-view evaluation across *indoor × outdoor × dynamic* regimes is rare; Tartan-Dynamic bridges this gap.

<div class="row">
  <div class="col-sm mt-3">
    {% include figure.liquid 
       path="assets/img/projects/tartan-dynamic/GroundCamera.png" 
       title="Large-scale outdoor capture zone (ground-level view)" 
       class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm mt-3">
    {% include figure.liquid 
       path="assets/img/projects/tartan-dynamic/TartanAirDataset.png" 
       title="Baseline: existing static-dominant datasets (TartanAir reference)" 
       class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm mt-3">
    {% include figure.liquid 
       path="assets/img/projects/tartan-dynamic/OpticalFlow.png" 
       title="High-motion optical flow field illustrating dynamic stress" 
       class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm mt-3">
    {% include figure.liquid 
       path="assets/img/projects/tartan-dynamic/CurrentBenchmark.png" 
       title="Gap analysis: current benchmarks under low dynamic pressure" 
       class="img-fluid rounded z-depth-1" %}
  </div>
</div>

---

<h2 style="color:#66ccff;">My role</h2>
- Designed **UE4 + AirSim** simulation scenes and drone planner interface.  
- Integrated **EGO-Planner v2** with AirSim LiDAR via ROS topic relay.  
- Implemented **covisibility-based novel-view sampler** for train/test splitting.  
- Automated **synchronized multi-sensor capture** (RGB, Depth, LiDAR, Pose) for reproducible benchmarking.  
- Visualized trajectory graphs and ESDF voxels in RViz for live debugging.

<div class="row">
  <div class="col-sm mt-3">
    {% include figure.liquid 
       path="assets/img/projects/tartan-dynamic/Pipeline.png" 
       title="Full benchmark pipeline: simulation → ROS → planner → capture" 
       class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm mt-3">
    {% include figure.liquid 
       path="assets/img/projects/tartan-dynamic/AirSim.png" 
       title="ROS–AirSim bridge relaying LiDAR and pose topics" 
       class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm mt-3">
    {% include figure.liquid 
       path="assets/img/projects/tartan-dynamic/ROSNoetic.png" 
       title="Planner visualization and trajectory debugging in RViz (ROS Noetic)" 
       class="img-fluid rounded z-depth-1" %}
  </div>
</div>

---

<h2 style="color:#33cc99;">System overview</h2>
- **Simulation & Planning:**  
  - UE 4.27 + AirSim generates RGB/Depth/Seg/LiDAR.  
  - `airsim_ros_pkgs` bridges sensor data to ROS topics.  
  - EGO-Planner builds occupancy grids and smooth trajectories.  
- **Capture & Evaluation:**  
  - Mapping pass writes Octo/voxel grid for feasible camera space.  
  - Novel-view sampler filters poses by covisibility test.  
  - Rendered outputs synchronized and timestamped for training metrics.

<div class="row">
  <div class="col-sm mt-3">{% include figure.liquid path="assets/img/projects/tartan-dynamic/AirSimDrone.png" title="Trajectory graph & covisibility" class="img-fluid rounded z-depth-1" %}</div>
  <div class="col-sm mt-3">{% include figure.liquid path="assets/img/projects/tartan-dynamic/FastPlannerImplement.jpg" title="Dynamic occlusion test" class="img-fluid rounded z-depth-1" %}</div>
   <div class="col-sm mt-3">{% include figure.liquid path="assets/img/projects/tartan-dynamic/FastPlannerPointCloud.jpg" title="Dynamic occlusion test" class="img-fluid rounded z-depth-1" %}</div>
</div>

---

<h2 style="color:#9966ff;">Technical Challenges & Solutions</h2>
- **Benchmark gaps → Need true novel views**  
  - *Challenge:* Train/test cameras share paths.  
  - *Solution:* Sampled off-trajectory poses filtered by covisibility maps.  
  - *Outcome:* Enforced extrapolation—models must reconstruct unseen angles.

- **Too-static scenes → Raise dynamic load**

  - _Challenge:_ < 50 % moving pixels per frame.
  - _Solution:_ Injected multiple scripted actors with stop/start occlusion churn.
  - _Outcome:_ Evaluates motion-heavy robustness.

- **Planner bring-up at scale**

  - _Challenge:_ ROS node timers/topic sync brittle.
  - _Solution:_ Unified topic relays, staged node startup, finite timers.
  - _Outcome:_ Smooth voxel updates and reproducible B-splines.

- **Interpolation metrics inflated**

  - _Challenge:_ PSNR/SSIM over near-duplicate frames.
  - _Solution:_ Covisibility-masked metric evaluation.
  - _Outcome:_ Scores reflect true novel-view reconstruction.

- **Depth + Pose flow limits → Renderer motion vectors**
  - _Challenge:_ Egoflow mislabels camera vs object motion.
  - _Solution:_ Plan UE Velocity/Motion-Vector pass for per-pixel flow GT.
  - _Outcome:_ Valid optical-flow supervision even in high motion scenes.

<div class="row">
  <div class="col-sm mt-3">{% include figure.liquid path="assets/img/projects/tartan-dynamic/DynamicObjectTest.png" title="Dynamic occlusion test" class="img-fluid rounded z-depth-1" %}</div>
  <div class="col-sm mt-3">{% include figure.liquid path="assets/img/projects/tartan-dynamic/BluePrint.png" title="Metric covisibility mask" class="img-fluid rounded z-depth-1" %}</div>
  <div class="col-sm mt-3">{% include figure.liquid path="assets/img/projects/tartan-dynamic/Blueprint2.png" title="Dynamic occlusion test" class="img-fluid rounded z-depth-1" %}</div>
</div>

---

<h2 style="color:#ffaa33;">Results</h2>
- **Working planning stack:** AirSim → EGO-Planner pipeline generates smooth, collision-aware trajectories.  
- **Deterministic bring-up:** One-command ROS launch; documented topic relays.  
- **Reproducible capture:** RGB / Depth / LiDAR / Pose synchronized with timestamps & metadata.  
- **Novel-view readiness:** Covisibility-filtered sampling yields non-redundant test sets.  
- **Dynamic-scene stress tests:** Multiple actors and occlusions stress reconstruction methods.  
- **Flow GT roadmap:** Motion-vector export plan underway for per-pixel ground truth.  
- **Artifacts & manifests:** Auto-generated route manifests for quick re-runs and cross-machine portability.
