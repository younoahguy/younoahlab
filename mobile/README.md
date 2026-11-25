# You Noah Lab iPhone app

A one-screen Expo app that shows the lab (`../index.html`, copied unchanged to `assets/web/younoahlab.html`) in a WebView. It tells the
page it is inside the app (`window.YNL_APP`), so the lab uses the phone's own voice and never offers live AI answers. Links that leave
the lab (privacy page, library pages) open in Safari after a grown-ups-only question.

- Bundle id `com.younoahguy.younoahlab`, Expo owner `younoahguy`, iPhone only.
- After changing the site: `cp ../index.html assets/web/younoahlab.html`, then `npm test`.
- Builds run on Expo's servers, started from the Mac Mini (see `/mnt/project-files/younoahlab/mac-mini-testflight-build.md` in the project).
- Internal TestFlight only. Not submitted for App Review.
