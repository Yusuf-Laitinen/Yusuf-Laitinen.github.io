# Star Sprint

A small, offline-capable quiz for learning the approximate temperature ranges of the OBAFGKM stellar classes. It is a static site with no build step.

## Publish with GitHub Pages

1. Add `index.html`, `manifest.webmanifest`, `sw.js`, and `icon.svg` to the root of your repository.
2. In the repository’s **Settings → Pages**, choose the branch and `/ (root)` folder to publish.
3. Open the published HTTPS address on your iPhone in Safari.
4. Tap **Share → Add to Home Screen**.

The service worker caches the game after its first visit, so it can be played offline. If you update the game, the browser will replace the previous cache.

## Temperature bands used

| Class | Approximate temperature |
| --- | --- |
| O | 30,000 K and hotter |
| B | 10,000–30,000 K |
| A | 7,500–10,000 K |
| F | 6,000–7,500 K |
| G | 5,200–6,000 K |
| K | 3,700–5,200 K |
| M | below 3,700 K |
