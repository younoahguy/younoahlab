# You Noah Lab

**[younoahlab.com](https://younoahlab.com)** is an interactive 3D science lab for kids, guided by NOAH, an AI guide drawn from about 2,600 points of light.

![NOAH on the You Noah Lab home screen](og-image.png)

[![CI](https://github.com/younoahguy/younoahlab/actions/workflows/ci.yml/badge.svg)](https://github.com/younoahguy/younoahlab/actions/workflows/ci.yml)

## At a glance (for reviewers)

| | |
|---|---|
| **What it shows** | A dependency-free WebGL renderer, physics simulations checked against textbook formulas, accessible and private-by-default design for children (no cookies, storage or trackers), and static SEO pages |
| **Stack** | Plain HTML, CSS and JavaScript · raw WebGL with a 2D canvas fallback · GitHub Pages |
| **Verified in this repo** | CI runs `node --test tests/*.test.mjs`: every page has a language, title and description; canonical URLs match paths; internal links and assets resolve; the sitemap covers every article; no trackers or cookie writes; the web manifest is valid |
| **How it was built** | Concept, curriculum and acceptance by Noah Schaa; code written with AI coding agents (Claude) under his direction |

## What it is

- **22 labs and tools:** elements (with a 3D atom for all 118), sound, circuits, chemistry, light, states of matter, magnets, crystals and metals, DNA (with a 3D double helix), the human body, nature, a "Mad Ideas" physics lab, a lab journal, plus:
  - **Free Roam World:** a first-person field site. Throws and drops follow Newton's laws (checked live against the range and fall-time formulas), floating follows Archimedes' principle with real densities, echoes use the speed of sound, and a solar panel follows the Sun. Gravity can be switched to the Moon, Mars or Jupiter. NOAH builds 21 kinds of object on request, in any size, color or material, and says so plainly when asked for something he cannot build.
  - **Molecule Lab 3D:** 15 molecules and crystals built from measured bond lengths and angles, with tap-to-measure distances and angles.
  - **Space & Gravity:** a 3D solar system driven by real orbital periods, a true-size comparison and a weight-on-other-worlds calculator.
  - **Motion & Forces:** a 3D launcher that integrates Newton's laws, with optional air drag; the no-air result matches the textbook formula.
  - **Science Toolbox:** unit converter, float tester, scale-of-the-universe slider and stopwatch.
  - **Robot Lab 3D:** build a robot and program it with blocks (sequence, loops, sensors) across six levels; Big Kid Mode shows the same program as Python.
  - **AI & Agents Lab:** a scripted agent simulator for tools, memory, fact-checking, step limits and human approval; a prompt workshop; and a real perceptron you can train.
  - **Quantum Lab:** the double-slit experiment sampled from the real intensity formula, a qubit on a 3D Bloch sphere with H, X, Z and S gates, and a two-qubit entanglement circuit.
  - **How It Works:** a 64-page library with five ways to learn each page (read, step map, listen, do, quiz), also published as static pages under `/how/` for search engines.
- **R3D:** a small lit 3D renderer written on raw WebGL for this project (spheres, cylinders, discs, boxes, procedural surfaces, orbit and first-person cameras, distance haze, picking), with a 2D canvas fallback. No libraries.
- **Real science:** results are calculated live from standard equations and published reference values. Where a simulation is simplified, the lab says so.
- **NOAH:** watches the pointer, talks, and reshapes himself into the lab you pick. His built-in answers come only from data that ships with the page, and he says so when he does not know something.

## How it is built

- One self-contained `index.html`: no frameworks and no libraries. The only network calls are optional: NOAH's studio voice for his own fixed lines, and live AI answers that stay off unless a grown-up turns them on. Both go through small server functions that hold the keys.
- NOAH is rendered with raw WebGL and falls back to 2D canvas on devices without 3D.
- No cookies, no browser storage, no trackers. A journal is saved only as a file on the user's device.
- A calm mode, and automatic support for reduced-motion settings.

## Testing

This repository's CI runs static checks on every push (`node --test tests/*.test.mjs`, no dependencies): page metadata, canonical URLs, internal links and assets, sitemap coverage, the no-tracker rule and the web manifest.

Releases have also been checked with an automated browser run (all 23 screens on five device sizes, the main user journeys, deep links, the no-WebGL fallback, and a Free Roam run that compares measured throws, drops, floats, echoes and solar readings with the textbook formulas). That browser harness is not yet committed to this repository.

## Privacy

See [privacy.html](privacy.html).

© You Noah Guy. All rights reserved; source shown for review only. See [`LICENSE`](LICENSE).
