<h2 align="center">Termtone</h2>

<p align="center">Termtone is a browser extension that generates dark (or light) themes for websites on the fly, with a focus on <strong>color schemes</strong>: pick a terminal-style palette and see your websites, including Google Docs, in those colors.</p>

## Features

- About 500 color schemes imported from [iTerm2-Color-Schemes](https://github.com/mbadolato/iTerm2-Color-Schemes), plus the original hand-written ones.
- Color scheme selector in the popup (**More** tab, Dynamic mode). Use <kbd>↑</kbd> and <kbd>↓</kbd> on the focused selector to browse schemes.
- Google Docs documents (drawn on a canvas) use the selected scheme's background and text colors.
- Everything else from the Dynamic theme engine: per-site settings, fixes for many websites, brightness, contrast, fonts and more.

## Updating the color schemes

```
node tasks/color-schemes.js [path-to-iTerm2-Color-Schemes]
```

Without a path, the repository is cloned into a temporary directory. Dark themes are added to `src/config/color-schemes.drconf`; existing schemes are kept.

## Building

Install [Node.js](https://nodejs.org/) LTS, then:

```
npm install
npm run debug
```

Load the `build/debug/chrome` folder (or `build/debug/chrome-mv3` for MV3) as an unpacked extension in `chrome://extensions` or `edge://extensions`. Run `npm test` to run the tests.

## Privacy

Termtone does not collect, store or send any personal data, and it shows no ads. It makes no network requests on its own. If you enable the optional synchronization of site fixes and color schemes in the settings, it downloads the configuration files from this repository.

## Origin and license

Termtone is a fork of [Dark Reader](https://github.com/darkreader/darkreader) and is distributed under the same [MIT license](LICENSE). Most of the theme engine and the website fixes come from the Dark Reader project and its contributors. Termtone is not affiliated with or endorsed by Dark Reader.
