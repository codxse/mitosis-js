# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.6.0](https://github.com/codxse/mitosis-js/compare/v1.5.1...v1.6.0) (2026-02-16)


### Features

* improve editor styling with scrollbar, divider, and border fixes ([9a6838a](https://github.com/codxse/mitosis-js/commit/9a6838a1c4ab9ee930e9cdf4df285a51a89fa103))

### [1.5.1](https://github.com/codxse/mitosis-js/compare/v1.5.0...v1.5.1) (2026-02-15)


### Bug Fixes

* run bundle build in release workflow ([67d592f](https://github.com/codxse/mitosis-js/commit/67d592fdf4c8e5d9a73d031d529fd3909ea1def5))

## [1.5.0](https://github.com/codxse/mitosis-js/compare/v1.4.0...v1.5.0) (2026-02-15)


### Features

* add CSS copy to build script ([588d049](https://github.com/codxse/mitosis-js/commit/588d049b7d98c8164f7630abc77606e926d4d47a))
* add CSS variables to editor.css ([9972cbe](https://github.com/codxse/mitosis-js/commit/9972cbec335d7c587be86707922f97081f59bf8a))
* add dark theme CSS ([19aa968](https://github.com/codxse/mitosis-js/commit/19aa96878473ae59a932778fdaa6b01d6aff7f9a))
* add light theme CSS ([77f43f5](https://github.com/codxse/mitosis-js/commit/77f43f5c261f561ca5d1be407a7d9409b8c7e378))
* add minification for CSS and JS bundles ([dc6d187](https://github.com/codxse/mitosis-js/commit/dc6d187e0391131e8d9eaa94c817f4d341dd69de))
* add theme options to EditorOptions ([b9033b8](https://github.com/codxse/mitosis-js/commit/b9033b825dff3e4f1b70bd39d2395ffc06af995d))
* add theme support to Editor class ([81b64c8](https://github.com/codxse/mitosis-js/commit/81b64c8087b618ddc26e720a3c8be6b447928dfb))
* add toggle theme button to demo ([8907c04](https://github.com/codxse/mitosis-js/commit/8907c041a28f6e468f8e16a65537547fc43f49a7))
* use .min.css and .min.js extensions for minified files ([5b765a5](https://github.com/codxse/mitosis-js/commit/5b765a5e8b01a96d6b91136dcc8d0bf9071e678a))
* use CSS variables in editor-pane ([3330c62](https://github.com/codxse/mitosis-js/commit/3330c625a5710b63ff8126cd7fade895b547f0d2))
* use CSS variables in preview-pane ([84105b7](https://github.com/codxse/mitosis-js/commit/84105b778a08b297923f0ca7474f04ba02c1f748))
* use CSS variables in two-panel-layout ([92effe2](https://github.com/codxse/mitosis-js/commit/92effe2068196853fe3a5d5dc36291a94761803c))


### Bug Fixes

* add CSS imports to demo and add theme tests ([9743393](https://github.com/codxse/mitosis-js/commit/974339398901acff2fa226a1923acfbfa8dc2643))
* add light theme CSS to demo for toggle to work ([b020f9f](https://github.com/codxse/mitosis-js/commit/b020f9fddb946316edd6f8ef3ee64fd33a6689ec))
* auto-copy CSS to demo/public on build ([0b404b7](https://github.com/codxse/mitosis-js/commit/0b404b79e0b9134ee8a50e0835a7e0f5b618c7c5))
* copy CSS to demo folder for proper serving ([9a6f2c6](https://github.com/codxse/mitosis-js/commit/9a6f2c666873dbfda06e9f72254055f734a6b38e))
* properly remove event listener in Editor class ([4134d91](https://github.com/codxse/mitosis-js/commit/4134d91583583e88c6d0924e8941e54adc313416))
* serve CSS from demo/public instead of vite config ([43d05d6](https://github.com/codxse/mitosis-js/commit/43d05d6a620ab19a628d2ff2d4509d85f0fb782a))
* serve CSS from src/styles via demo/public ([835dc26](https://github.com/codxse/mitosis-js/commit/835dc26f1e2b98b5d665311c5f8cf755cc3996e9))
* use Vite publicDir to serve dist/styles ([2f1e61a](https://github.com/codxse/mitosis-js/commit/2f1e61a02b57c277f9bb1358e5f3d65a7446be26))

## 1.4.0 (2026-02-15)


### Features

* add new feature ([8dc87c0](https://github.com/codxse/mitosis-js/commit/8dc87c0196c98d361c44a3c4cda93f8d3fc81159))
* add prism option to EditorOptions ([d15fbdf](https://github.com/codxse/mitosis-js/commit/d15fbdf165846f4852e4e6dec3394ad6a9499845))
* add release shortcuts (patch, minor, major, dry) ([fc0f373](https://github.com/codxse/mitosis-js/commit/fc0f373b5812fb2fb0ac2e565b905a5e622a11b1))
* add syntax highlighting support with marked-highlight ([b6567aa](https://github.com/codxse/mitosis-js/commit/b6567aaa64cefd2e6990807472b85999377ac4a3))
* init ([641e9b7](https://github.com/codxse/mitosis-js/commit/641e9b7f9e8f4ddee1a8dfe084139d01a1154ef6))
* test release ([883a0b4](https://github.com/codxse/mitosis-js/commit/883a0b47c28ac74b3282725f76c1c6aa1acb0f3e))
* wire prism option to markdown parser ([8e7b2bb](https://github.com/codxse/mitosis-js/commit/8e7b2bb2db057d33e1b65d96ed9175e84d478c77))


### Bug Fixes

* add --append flag to changelog hook ([ae5f971](https://github.com/codxse/mitosis-js/commit/ae5f971e70f93dda8104db5c4d7ee48e3aa1d94a))
* add after:bump hook as fallback for changelog ([57a9363](https://github.com/codxse/mitosis-js/commit/57a9363bde0ba5d9fd08a0bde9c1cbdb368b0af0))
* add git config to release workflow ([c7714f9](https://github.com/codxse/mitosis-js/commit/c7714f9aab34be04e2e9cd1e881d84b6da9453da))
* add outputUnreleased to plugin config ([b684a43](https://github.com/codxse/mitosis-js/commit/b684a43605fc9c510ff0b2f5df768c571926f7c1))
* fix critical bug ([d35675a](https://github.com/codxse/mitosis-js/commit/d35675a6c3a0d26e84a76fc719f818fc4a8e8c5e))
* remove after:bump hook that conflicts with conventional-changelog plugin ([53b9a41](https://github.com/codxse/mitosis-js/commit/53b9a41ecc3c0450414ae0c13a9fa8bb1cd43f1b))
* remove broken plugin, use hook for changelog ([cedff36](https://github.com/codxse/mitosis-js/commit/cedff36a1e9d95db238c5bc01294b480af25d026))
* sync package.json version with tags ([7c76f7e](https://github.com/codxse/mitosis-js/commit/7c76f7eacd1f9d05cc45bcb28cd282d8feeb1064))
* update conventional-changelog plugin config ([0c8b028](https://github.com/codxse/mitosis-js/commit/0c8b0285dc0712c008342dafc75e779c3c76e252))
* use @release-it/conventional-changelog plugin ([5502fa4](https://github.com/codxse/mitosis-js/commit/5502fa43f3af0df7377557245b4f1f439d1d4f05))

## [1.3.0](https://github.com/codxse/mitosis-js/compare/v1.2.1...v1.3.0) (2026-02-15)


### Features

* test release ([883a0b4](https://github.com/codxse/mitosis-js/commit/883a0b47c28ac74b3282725f76c1c6aa1acb0f3e))

### [1.2.1](https://github.com/codxse/mitosis-js/compare/v1.2.0...v1.2.1) (2026-02-15)
