# You Noah Lab

**[younoahlab.com](https://younoahlab.com)** is an interactive 3D science lab for kids, guided by NOAH, an AI guide drawn from about 2,600 points of light.

![NOAH on the You Noah Lab home screen](og-image.png)

## What it is

- **13 hands-on labs:** elements, sound, circuits, chemistry, light, states of matter, magnets, crystals and metals, DNA, the human body, nature, a "Mad Ideas" physics lab and a lab journal.
- **Real science:** results are calculated live from standard equations and published reference values. Where a simulation is simplified, the lab says so.
- **NOAH:** watches the pointer, talks, and reshapes himself into the lab you pick. His built-in answers come only from data that ships with the page, and he says so when he does not know something.

## How it is built

- One self-contained `index.html`: no frameworks, no build step, no external requests.
- NOAH is rendered with raw WebGL and falls back to 2D canvas on devices without 3D.
- No cookies, no browser storage, no trackers. A journal is saved only as a file on the user's device.
- A calm mode, and automatic support for reduced-motion settings.

## Testing

Each release is checked by an automated browser run: all 14 screens on five device sizes, the main user journeys, deep links, and the no-WebGL fallback.

## Privacy

See [privacy.html](privacy.html).

© You Noah Guy. All rights reserved.
