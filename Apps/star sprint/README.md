# Star Sprint

A small, offline-capable quiz for learning the approximate temperature ranges of the OBAFGKM stellar classes. It is a static site with no build step.

## Publish with GitHub Pages

1. Keep `index.html`, `styles.css`, `app.js`, `manifest.webmanifest`, `sw.js`, `icon.svg`, and `apple-touch-icon.png` together in this app folder.
2. In the repository’s **Settings → Pages**, publish the branch containing this folder.
3. Open this folder’s published HTTPS address on your iPhone in Safari.
4. Tap **Share → Add to Home Screen**.

The service worker caches the game after its first visit, so it can be played offline. If you update the game, the browser will replace the previous cache.

## Temperature bands used

| Class | Approximate temperature |
| --- | --- |
| O | 25,000–50,000 K |
| B | 11,000–25,000 K |
| A | 7,500–11,000 K |
| F | 6,000–7,500 K |
| G | 5,000–6,000 K |
| K | 3,500–5,000 K |
| M | below 3,500 K |

These ranges follow the AQA A-level Physics 7408 specification, section 3.9.2.4. The app shows this temperature guide before each run.
