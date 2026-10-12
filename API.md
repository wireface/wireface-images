# Bring images on a page to life

Wireface Images adds silent expressions, blinks and eye movements to existing images. It is free for personal and commercial use, such as your own website, under the Wireface Personal Licence; using it in a product, app or service you sell or charge for, such as a SaaS product, needs a Developer or Enterprise licence. No account, API key, subscription, speech service or image upload. Detection and animation run in the visitor's browser. The first visit downloads the JavaScript, WASM and model assets.

## One script tag

```html
<!-- All <img> elements on this page, including images added later. -->
<script defer src="https://cdn.jsdelivr.net/gh/wireface/wireface-images@a742e02a2da0aa31f053142b6a9a396561c232ba/dist/wireface-images.js"></script>
```

Use a class or any CSS selector to limit it. Select images themselves or a container whose images should animate:

```html
<div class="portraits">
  <img src="/photos/alex.jpg" alt="Alex" width="240" height="240">
  <img src="/photos/sam.jpg" alt="Sam" width="240" height="240">
</div>
<script defer src="https://cdn.jsdelivr.net/gh/wireface/wireface-images@a742e02a2da0aa31f053142b6a9a396561c232ba/dist/wireface-images.js"
  data-selector=".portraits" data-mood="happy" data-intensity="0.7"></script>
```

Add `data-wireface-ignore` to an image or container to exclude it. No wrapper, canvas or manual rigging is required. Original images, alt text, dimensions, links and event handlers stay in place. Transparent overlays ignore pointer events.

The jsDelivr URL is pinned to commit `a742e02a2da0aa31f053142b6a9a396561c232ba` of the public [Wireface Images distribution](https://github.com/wireface/wireface-images). It loads the matching `dist/images.js`, MediaPipe JavaScript, WASM and face model from the same revision automatically. No npm install, account or asset-path configuration is needed. Keep the commit pin in production; upgrade by changing it to a tested commit or version tag.

The script is an entry point, not a self-contained model. To self-host, copy the download's entire `dist/` and `assets/` folders alongside one another, then use `/wireface/dist/wireface-images.js`. Serve over HTTP(S), not `file://`. No bundler is needed. The examples repository includes these files and a local server. The existing `https://wireface.dev/assets/sdk/dist/wireface-images.js` URL remains available, but follows the website's SDK deployment rather than a pinned release.

## Browser modules from jsDelivr

Use this in a `<script type="module">` or a JavaScript module loaded by your page:

```js
import { animateImages } from 'https://cdn.jsdelivr.net/gh/wireface/wireface-images@a742e02a2da0aa31f053142b6a9a396561c232ba/dist/images.js';

const gallery = animateImages({ selector: '.portraits', mood: 'happy' });
// The matching detector assets also load from jsDelivr automatically.
```

Choose either the automatic script tag or the module API for a given set of images. Do not initialize both on the same images.

## SDK and modules

```js
import { animateImages } from '@wireface/sdk/images';
// Also exported by '@wireface/sdk'.

const gallery = animateImages();                    // Every image
// Or: animateImages({ selector: '.portraits' });
// Or: animateImages({ selector: 'img.team-face' });
// Create one controller for each non-overlapping set of images.
```

Direct browser modules can import `animateImages` from `/wireface/dist/images.js`. With Vite or another bundler, copy the SDK's `assets/mediapipe/` into `public/wireface-assets/mediapipe/`, then pass `assets: '/wireface-assets/'`. The bundled runtime cannot infer where your build tool serves model files.

## Configuration

```js
const gallery = animateImages({
  selector: '.portraits, .face-carousel', // images or their containers; default 'img'
  root: document,                       // Document, Element or an open ShadowRoot
  mood: 'random',                       // independent standing moods
  moodSeed: 0,                          // change to reshuffle random moods
  intensity: 0.65,                      // 0–1; 0 makes faces still
  speed: 1,                             // 0.1–3, animation speed
  eyeTracking: true,                    // follow the pointer
  eyeMovement: true,                    // occasional glances without a pointer
  hoverExpressions: true,               // a reaction when hovered
  showMesh: false,                      // show the fitted mesh
  minSize: 48,                          // minimum displayed width AND height in CSS px
  maxActive: 32,                        // simultaneous faces / resident image textures
  maxFacesPerImage: 8,                  // 1–16 faces in each image
  fps: 30,                             // 1–60, rendering ceiling
  observe: true,                       // new, changed and removed images
  respectReducedMotion: true,           // pause for prefers-reduced-motion
  hideOnScroll: true,                   // hide moving-face overlays while scrolling
  scrollIdleDelay: 120,                 // ms of quiet before repositioning/restoring
  onReady: ({ image, faces }) => console.log(image.alt, faces),
  onSkip: ({ image, reason }) => console.log(image.alt, reason),
  onError: ({ image, error }) => console.warn(image.currentSrc, error.code, error.message),
});
```

Moods: `random`, `neutral`, `happy`, `cheeky`, `curious`, `calm`, `thoughtful`, `sleepy`, `grumpy`. Faces also perform independently timed blinks, smiles, smirks, brow raises, pouts and squints. None starts speech or opens an audio input/output.

The drop-in script accepts the scalar options as kebab-case attributes: `data-eye-tracking="false"`, `data-max-faces-per-image="4"`, `data-fps="24"`, and so on. Use JavaScript for callbacks, `root`, landmarks and custom MediaPipe paths. Defaults are available as `IMAGE_DEFAULTS`.

## Lifecycle and carousels

```js
gallery.pause();                         // hide overlays and show original pictures
gallery.resume();
gallery.setOptions({ mood: 'curious', intensity: 0.8 });
gallery.setOptions({ mood: 'random', moodSeed: 7 });
gallery.refresh();                       // manual discovery when observe is false
gallery.refresh({ retry: true });        // retry skipped/failed images after changes
console.log(gallery.status);             // images, ready, faces, active, skipped, etc.
gallery.destroy();                       // release everything on component unmount
```

`animateImages()` returns immediately. Detection happens lazily for visible, loaded images; `onReady` fires per image after it is rigged. There is no promise that waits for offscreen or lazy images. `status.ready` counts resident rigged images; `active` counts currently drawn faces. A failed image leaves its original visible and does not stop the rest.

Carousels need no special API. Use `selector: '.face-carousel'` on a normal horizontally scrolling container. While the page or any container scrolls, overlays hide immediately so faces cannot visibly drift away from their photos. After 120 ms without a scroll event, positions are measured and repainted before overlays reappear. Configure `scrollIdleDelay` (50–1000 ms), or set `hideOnScroll: false` to draw continuously. Original photographs always remain visible.

The renderer respects `object-fit`, `object-position`, axis-aligned scaling, scroll positions and rectangular overflow clipping. Offscreen images and hidden tabs pause; image textures are released after time offscreen or when needed for visible images. Detection is serialized and images are resized to at most 1280 px for processing. One WebGL context per controller serves its images.

To control the drop-in instance from another script, load that script after the drop-in file, then await `WirefaceImages.ready`:

```js
const gallery = await window.WirefaceImages.ready;
gallery.setOptions({ mood: 'happy' });
```

For manual startup, set `data-auto="false"` on the script tag and call `await WirefaceImages.animateImages(options)`. `ready` then resolves to `null`. Its resolution means setup is complete, not that all images were detected. Using ESM is preferable for framework components. In React, call `animateImages({ root: ref.current })` inside an effect and return `() => gallery.destroy()` for cleanup. Importing the SDK during SSR is safe; call the function only in the browser.

## Photos, drawings and saved landmarks

Automatic detection works best on clear, front-facing photographic faces. It supports multiple detectable faces in one image. Non-face images are skipped. Most anime, pixel art, cartoons and heavily occluded faces cannot be detected reliably by this local model. This feature never falls back to paid or hosted detection.

If you already have prepared landmarks, attach their URL to the image. The website's mixed portrait grid uses the existing saved fits for its artwork:

```html
<img src="/characters/robot.jpg" alt="Robot"
  data-wireface-landmarks="/characters/robot.json">
```

The JSON is an array of 468–478 normalized `[x, y]` MediaPipe points for one face, an array of those face arrays, or an object with a `landmarks` array. Coordinates must refer to the whole source image with the same crop. Alternatively, pass `landmarks: async (image, { signal }) => points`; return `null` to run local detection. Image source/landmark URL changes invalidate its fit automatically. This is optional, not a requirement for ordinary photos.

## Hosting and limitations

Same-origin images work directly. Cross-origin image hosts must return an appropriate `Access-Control-Allow-Origin` header. Prefer `<img crossorigin="anonymous" ...>` when loading those images; Wireface also attempts an anonymous CORS fetch if the already-loaded image is tainted. The Chrome extension has cross-origin privileges that website JavaScript does not. Wireface does not proxy or upload blocked images. `onError` reports `image_unreadable`; fix hosting and call `refresh({ retry: true })`.

Use a modern browser with WebGL 2 and WebAssembly. Serve `.wasm` as `application/wasm`, `.mjs` and `.js` as JavaScript. Your CSP must permit the runtime/model hosts, WebAssembly compilation (`'wasm-unsafe-eval'` where required), and MediaPipe's WASM loader script. Self-hosting keeps these requests on your origin. Detection can briefly occupy the main thread; reduce `maxFacesPerImage` and the selected images for large galleries. Do not include the drop-in script twice.

For jsDelivr, add `https://cdn.jsdelivr.net` to both `script-src` and `connect-src`, and `'wasm-unsafe-eval'` to `script-src`. For example, merge these directives into your existing Content-Security-Policy, preserving any other hosts your page needs:

```text
script-src 'self' 'wasm-unsafe-eval' https://cdn.jsdelivr.net;
connect-src 'self' https://cdn.jsdelivr.net;
```

These directives allow the external script/module, MediaPipe loader, WASM and model downloads; they do not allow inline scripts. Put module code in a separate file or use your site's existing nonce/hash policy. Your images still need their own CORS permission when hosted on another origin. jsDelivr serves the runtime files; face detection and animation still happen locally without uploading photos.

This API targets `<img>` elements, not CSS backgrounds, videos, canvas content or images in other frames. Pass an open shadow root explicitly for web components. It does not traverse closed shadow DOM. Avoid rotation, perspective, mirrored transforms, complex masks and blend effects; unsupported placement is skipped. GIF/animated WebP use a captured still frame. Up to 40 megapixels per input. Images requiring cross-origin credentials may be skipped. Follow the system motion preference and offer a visible pause control in public galleries.

[Live examples](https://wireface.dev/images/) · [Small examples repository](https://github.com/wireface/wireface-images)
