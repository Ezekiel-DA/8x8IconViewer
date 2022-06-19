# 8x8 LED Grid Icon Viewer

## Running locally

* Clone this repo
* `npm i --legacy-peer-deps` (because a bunch of packages still rely on React 15/16, but Next.js 12 wants React 17+)
* In `config.js`, configure `iconsFilePath`  to point to your icons and `sendToIconViewerDevice` to enable / disable sending to the ESP32 (if on but device not present, mDNS requests may hang browser)
* `npm run dev`
* ??
* Profit!
