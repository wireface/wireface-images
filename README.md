# Wireface Images

Bring faces in your photos to life with **one script tag**. Blinks, smiles, raised eyebrows, quiet eye movements and eyes that follow the pointer. No account, API key, subscription, speech or image uploads.

[Live gallery & carousel](https://wireface.dev/images/) · [Full API reference](API.md) · [Wireface SDK](https://github.com/wireface/wireface-sdk)

## Add it to your page

```html
<!-- All images on the page, including images added later. -->
<script defer src="https://cdn.jsdelivr.net/gh/wireface/wireface-images@main/dist/wireface-images.js"></script>
```

Or select a class (on images or a container):

```html
<div class="portraits">
  <img src="/photos/alex.jpg" alt="Alex" width="240" height="260">
  <img src="/photos/sam.jpg" alt="Sam" width="240" height="260">
</div>

<script defer src="https://cdn.jsdelivr.net/gh/wireface/wireface-images@main/dist/wireface-images.js"
  data-selector=".portraits" data-mood="happy" data-intensity="0.7"></script>
```

Add `data-wireface-ignore` to an image or container to leave it still. Your original layout, images, alt text and links stay in place.

The jsDelivr URL is pinned to commit `main`. It automatically loads the matching animation module and local detector files from this repository's revision. Keep the commit pin in production. For Content-Security-Policy, allow `https://cdn.jsdelivr.net` in `script-src` and `connect-src`, plus `'wasm-unsafe-eval'` in `script-src`; see [hosting details](API.md#hosting-and-limitations).

## Try the examples locally

```sh
git clone https://github.com/wireface/wireface-images.git
cd wireface-images
npm start
```

Open **http://127.0.0.1:5173/**. Requires Node 18+; no install or build step, external packages, keys or external network requests. JavaScript, the local detector model/WASM and example photos are included.

| Example | What it demonstrates |
| --- | --- |
| [All images](examples/images/all.html) | One script, automatic detection, pause/resume. |
| [Selector](examples/images/selector.html) | `.alive` images animate; an unselected photo stays still. |
| [Carousel](examples/images/carousel.html) | Scroll visibility, moods, newly added images and cleanup. |

For your own website, copy **both `dist/` and `assets/`**, keep them next to each other and load `/wireface/dist/wireface-images.js`. The one script tag loads adjacent modules and model assets as needed. The model runs in the visitor's browser. Serve over HTTP(S); opening HTML as `file://` will not work.

## JavaScript / SDK

```js
// Direct browser module from jsDelivr (no install or bundler):
import { animateImages } from 'https://cdn.jsdelivr.net/gh/wireface/wireface-images@main/dist/images.js';
// Self-hosted: import { animateImages } from '/wireface/dist/images.js';
// In the full SDK: import { animateImages } from '@wireface/sdk/images';

const gallery = animateImages({
  selector: '.portraits, .carousel', // omit for all images
  mood: 'random',                   // or happy, cheeky, curious, calm,
                                   // thoughtful, sleepy, grumpy, neutral
  intensity: 0.65,                  // 0–1
  speed: 1,                        // 0.1–3
  eyeTracking: true,                // follow pointer
  eyeMovement: true,                // glance around when idle
  hoverExpressions: true,
  maxActive: 32,
  maxFacesPerImage: 8,
  fps: 30,
  respectReducedMotion: true,
  hideOnScroll: true,               // hide overlays while page/carousel is moving
  scrollIdleDelay: 120,             // repaint at the new position after 120 ms quiet
  onReady: ({ image, faces }) => console.log(image.alt, faces),
  onError: ({ image, error }) => console.warn(image.src, error.message),
});

gallery.setOptions({ mood: 'curious' });
gallery.pause();
gallery.resume();
gallery.refresh({ retry: true });
gallery.destroy(); // On component unmount.
```

The full SDK also exports `animateImages` from `@wireface/sdk`. For bundlers, copy `assets/mediapipe` to your public directory and pass `assets: '/wireface-assets/'` (the directory containing `mediapipe/`). The model files cannot be inferred from a JavaScript bundle's location.

The script-tag version supports the same scalar options as `data-*` attributes, e.g. `data-eye-tracking="false"`, `data-show-mesh="true"` and `data-fps="24"`. From a script loaded after it, `await WirefaceImages.ready` returns the automatic controller. Set `data-auto="false"` to start manually with `await WirefaceImages.animateImages(options)`. That promise means setup is complete; detection is lazy and reports each fitted image through `onReady`.

## What works

- Detectable photographic faces, including several faces in one photo. Non-face pictures are skipped.
- Images or selected containers, dynamically inserted/replaced images, galleries and scrolling carousels.
- Prepared MediaPipe landmarks for artwork: `<img data-wireface-landmarks="/fits/robot.json" ...>`. The live website demonstrates existing fits for its mixed home-page artwork.
- Reduced-motion preferences, offscreen/hidden-tab pausing and explicit cleanup. One shared WebGL renderer per controller.

Cross-origin image hosts **must allow CORS**. A webpage script cannot use the Chrome extension's image access privileges. Same-origin images work directly; blocked images stay unchanged and report `image_unreadable`. This feature never sends them to a proxy or paid detector. Most cartoons/anime need supplied landmarks; local automatic detection is designed for photographic faces. It targets `<img>`, not backgrounds or videos. Modern WebGL 2 / WebAssembly browser required. See [hosting, limitations and all options](API.md).

## Licence and maintenance

Free local use, including commercial use, under the [Wireface Personal Licence](LICENSE.md). Keep required notices with redistributed files. MediaPipe's runtime, model and canonical geometry retain their Apache 2.0 notices; see [NOTICE](NOTICE) and [licenses](licenses).

This is a small distribution and examples repository. Its compiled runtime comes from the SDK's image animation entry; the full engine source is not part of this repository. [Report a problem](https://github.com/wireface/wireface-images/issues).
