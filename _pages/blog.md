---
layout: page
title: Gasoline Transportation Ally — Top-Down Survival Refueling Game
subtitle: CMU Entertainment Technology Center
category: work
importance: 4
img: assets/img/projects/gasoline/gameplay.jpg
tags: [Unity, Accessibility, Game Design, Physics, Controller Input, C#]
description: A fast-paced top-down survival game where players refuel escaping cars using a custom pressure-sensor controller to keep them from running out of gas and getting caught.
---

<h2 style="color:#ff6666;">Game Cycle & Evolution</h2>
- **Initial Concept:** Began as a top-down arcade survival prototype built around a custom *fuel-gun* controller. The goal was to keep cars alive by refueling them before they ran out of gas and descended toward capture by police cars at the bottom of the screen.  
- **Core Loop:** Four getaway cars leak fuel as they descend through five survival levels. The player, controlling a *flying cat-shaped refueling gun*, must continuously manage which car to fuel next while avoiding overfill explosions.  
- **Mechanics:**  
  - Cars descend at rates tied to their current gasoline level.  
  - Refueling pauses descent and restores altitude.  
  - Overfilling causes an explosion that transfers fuel to adjacent lanes — a designed *risk-reward* moment.  
- **Early Build (Interim):**  
  - The physical controller and art direction drew attention, but unclear fuel logic, missing explosion feedback, and controller calibration issues caused confusion.  
  - Players often scored **zero points**, revealing the need for a more forgiving scoring curve and stronger feedback cues.  
- **Iteration & Refinement:**  
  - Rebuilt the gasoline system with clearer color states and audio feedback.  
  - Calibrated the controller for smoother aiming and consistent pressure response.  
  - Added **tutorial sequencing** and **dialogue-based onboarding** to introduce one car before scaling to five.  
  - Integrated **timer and scoring UI** to improve pacing and give a sense of progress.  
- **Final Build:**  
  - Achieved a more balanced rhythm where players could recognize and plan refueling cycles.  
  - Visual feedback and difficulty tuning made the experience more readable and engaging.  
  - Remaining issues included an "optimal" mid-lane strategy, a plateaued late-game interest curve, and limited escalation in the final minute.  
- **Goal:** Survive the countdown with at least one car remaining — a test of focus, timing, and resource management under pressure.

---

<h2 style="color:#66ccff;">My Role</h2>
- **Programmer & Systems Designer:**  
  - Architected the full gameplay loop in C# and Unity.  
  - Implemented real-time **gasoline management**, **collision logic**, and **car state machines**.  
  - Designed and coded **controller input handling** (WASD + custom analog trigger via Xbox Adaptive Controller).  
  - Wrote **tutorial logic** using coroutine-based sequences for progressive learning.  
  - Built **UI feedback systems** (fuel bars, color transitions, timer, win/lose panels).  
  - Collaborated on gameplay feel — adjusting descent intervals, explosion timings, and police animations for balance and flow.



---

<h2 style="color:#33cc99;">System Overview</h2>
- **Top-Down Game Board:**  
  - 4 vertical lanes (columns) × 5 horizontal survival levels (rows).  
  - Cars start at Level 4 and descend as gas drains.  
  - Police cars patrol Level 0 — the capture line.  
- **Class Architecture:**  
  - **`Gasoline`** – Manages refuel/decay rate, color feedback, explosion detection.  
  - **`Car`** – Controls survival level, movement interpolation, and inter-lane fuel transfer.  
  - **`GameManager`** – Handles game timer, scoring, win/lose transitions, and scene management.  
  - **`ControllerInput`** – Reads joystick and analog trigger input for crosshair aiming and refueling control.  
  - **`TrainingManager`** – Walks new players through mechanics step by step using coroutine-based storytelling.  
- **Gameplay Logic Flow:**  
  `ControllerInput → Gasoline → Car → GameManager → UI`
- **Simulation Rules:**  
  - Gas level directly maps to descent interval (`Mathf.Infinity` at 5 gas, 1 sec at critical).  
  - Explosion adds +4 fuel to adjacent lanes.  
  - Game ends when timer = 0 (Win) or all cars caught/exploded (Lose).


<h3 class="mt-3">Platform Abstraction (Keyboard ↔ Xbox Adaptive)</h3>
<div class="rounded p-3 my-2" style="background:#f8f9fa;border-left:4px solid #33cc99;">

{% raw %}
```csharp
// System-facing interface (gameplay depends on this, not hardware)
public interface IRefuelInput
{
    float Pressure { get; }      // 0..1 analog fueling
    Vector2 AimAxis { get; }     // world-space aim for crosshair
}

// Desktop adapter (keyboard)
public sealed class KeyboardRefuelInput : IRefuelInput
{
    public float Pressure => Input.GetKey(KeyCode.Space) ? 1f : 0f;
    public Vector2 AimAxis => new Vector2(Input.GetAxisRaw("Horizontal"), Input.GetAxisRaw("Vertical"));
}

// Xbox Adaptive Controller adapter
public sealed class XACRefuelInput : IRefuelInput
{
    public float Pressure => Mathf.Clamp01(Input.GetAxis("GasAddInput"));
    public Vector2 AimAxis => new Vector2(Input.GetAxisRaw("XAC_H"), Input.GetAxisRaw("XAC_V"));
}
```
{% endraw %}

<p class="small text-muted mb-0">Swap adapters to change platforms—no gameplay code changes.</p>
</div>


<h3 class="mt-3">Movement Policy (ScriptableObject tuning)</h3>
<div class="rounded p-3 my-2" style="background:#f8f9fa;border-left:4px solid #66ccff;">

{% raw %}
```csharp
[CreateAssetMenu(menuName = "GTA/VerticalMovementPolicy")]
public class VerticalMovementPolicy : ScriptableObject
{
    // index by gas band 1..7 (clamped)
    public float[] bandIntervals = { 1f, 2.5f, 3f, 3.5f, Mathf.Infinity, 0.7f, 1.0f };
    public float IntervalForBand(int band) =>
        band <= 0 ? 1f : band > bandIntervals.Length ? bandIntervals[^1] : bandIntervals[band-1];
}
```
{% endraw %}

<p class="small text-muted mb-0">Design-driven difficulty: adjust intervals in an asset, no code changes.</p>
</div>

---

<h2 style="color:#9966ff;">Technical Challenges & Solutions</h2>
- **Challenge 1 – Controller balance and motion smoothness**  
  - *Initial issue:* The custom refuel gun, built from PVC tubes, was unbalanced and stiff. We first added heavy items like bullets and weights inside to simulate pressure feedback, but the motion wasn't smooth and caused fatigue.  
  - *Solution:* Through iterative prototyping, we discovered that the **front–back and left–right lever arms** required different torque balances because players move differently along each axis. We shortened the forward lever, extended the lateral one, and wrapped internal weights with **foam sleeves** to create damping inside the pipe.  
  - *Outcome:* The gun achieved a smoother swing motion and more natural return force, improving both control precision and player comfort.

<div class="row">
  <div class="col-sm mt-3">
    {% include figure.liquid path="assets/img/projects/gasoline/Initial_Gun.jpg" title="Initial fuel gun prototype — unbalanced and stiff, using ad-hoc weights inside PVC tube" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm mt-3">
    {% include figure.liquid path="assets/img/projects/gasoline/Final_Gun.jpg" title="Final balanced gun — adjusted lever arms and foam-damped weights for smoother control" class="img-fluid rounded z-depth-1" %}
  </div>
</div>

<h3 class="mt-3">Gasoline System (evented, time-driven)</h3>
<div class="rounded p-3 my-2" style="background:#f8f9fa;border-left:4px solid #9966ff;">

{% raw %}
```csharp
// Gasoline System (evented, time-driven)
public interface ITimeSource { float DeltaTime { get; } }
public sealed class UnityTime : ITimeSource { public float DeltaTime => Time.deltaTime; }

public sealed class GasolineSystem
{
    public int Gas { get; private set; }
    public bool Exploded { get; private set; }

    public event System.Action OnGasChanged;   // UI bars / SFX
    public event System.Action OnExploded;          // adjacent-lane refuel

    private readonly ITimeSource _time;
    private float _decayTimer = 0f;
    private float _decayInterval = 3f;
    private float _refuelAccum = 0f;

    public GasolineSystem(int startGas, ITimeSource time) { Gas = startGas; _time = time; }

    public void Tick()
    {
        if (Exploded) return;
        _decayTimer += _time.DeltaTime;
        if (_decayTimer >= _decayInterval) { AddGas(-1); _decayTimer = 0f; }
    }

    public void Refuel(float pressure, float ratePerSecond = 6f)
    {
        if (Exploded) return;
        _refuelAccum += pressure * ratePerSecond * _time.DeltaTime;
        if (_refuelAccum >= 1f) { AddGas(1); _refuelAccum = 0f; }
    }

    private void AddGas(int delta)
    {
        Gas = Mathf.Clamp(Gas + delta, 0, 14);
        OnGasChanged?.Invoke(Gas);
        if (Gas >= 14 && !Exploded) { Exploded = true; OnExploded?.Invoke(); }
    }

    public void SetDecayInterval(float seconds) => _decayInterval = Mathf.Max(0.3f, seconds);
}
```
{% endraw %}

<p class="small text-muted mb-0">Event-driven architecture allows UI and audio systems to react to gas changes without tight coupling.</p>
</div>


- **Challenge 2 – Multi-car state synchronization**  
  - *Issue:* Cars updated asynchronously, causing desynchronized descent and explosion timing.  
  - *Solution:* Centralized all time references to `Time.deltaTime` and unified car updates under the `GameManager`'s master clock.  
  - *Outcome:* Stable multi-vehicle behavior across all lanes.

- **Challenge 3 – Chain reaction control**  
  - *Issue:* Explosions could loop infinitely as cars repeatedly refueled each other.  
  - *Solution:* Added adjacency checks (`Mathf.Abs(carID - otherID) == 1`) and per-frame delay buffers.  
  - *Outcome:* Predictable chain explosions without logic overflow.

- **Challenge 4 – Input calibration and readability**  
  - *Issue:* The analog trigger signal from the adaptive controller fluctuated unpredictably.  
  - *Solution:* Smoothed the `Input.GetAxis("GasAddInput")` values and applied clamping to remove noise while preserving pressure sensitivity.  
  - *Outcome:* Consistent refueling rate that felt responsive to both gentle and full-pressure inputs.

- **Challenge 5 – Visual and onboarding clarity**  
  - *Issue:* Early testers couldn't interpret fuel or explosion feedback.  
  - *Solution:* Added color-coded fuel bars (green–yellow–red), glow warnings, and a step-by-step tutorial sequence using coroutine-driven dialogues.  
  - *Outcome:* Players learned faster, and late-stage playtests showed clear comprehension within one round.

---

<h2 style="color:#ffaa33;">Results</h2>
- **Functional 5-car survival system** with synchronized descent and explosion feedback.  
- **Interactive training mode** guiding new players through each mechanic.  
- **Stable, modular architecture** spanning 9 scripts and >3,000 lines of code, allowing rapid iteration.  
- **Smooth controller experience** verified with both keyboard and adaptive hardware input.  
- **Accessible, high-energy gameplay** praised during ETC demo sessions for its chaos-management and humor.  
- **Next steps:** balance difficulty scaling and introduce leaderboard persistence via Unity PlayerPrefs or external JSON save.