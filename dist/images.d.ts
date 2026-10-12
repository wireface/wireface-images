export type ImageMood = 'random' | 'neutral' | 'happy' | 'cheeky' | 'curious' | 'calm' | 'thoughtful' | 'sleepy' | 'grumpy';
export type ImageLandmarks = readonly (readonly [number, number])[];
export interface ImageAnimationOptions {
  /** CSS selector for images or containers. Default: 'img'. */
  selector?: string;
  root?: Document | Element | ShadowRoot;
  /** 0–1. Zero leaves the original face still. Default .65. */
  intensity?: number;
  /** Animation clock multiplier, .1–3. Default 1. */
  speed?: number;
  mood?: ImageMood;
  moodSeed?: number;
  eyeTracking?: boolean;
  eyeMovement?: boolean;
  hoverExpressions?: boolean;
  showMesh?: boolean;
  minSize?: number;
  /** Maximum simultaneously animated faces and resident image textures. Default 32. */
  maxActive?: number;
  maxFacesPerImage?: number;
  fps?: number;
  observe?: boolean;
  respectReducedMotion?: boolean;
  /** Hide overlays during page/container scrolling, then repaint before restoring. Default true. */
  hideOnScroll?: boolean;
  /** Quiet period after the last scroll event, 50–1000 ms. Default 120. */
  scrollIdleDelay?: number;
  /** Public SDK assets directory with trailing slash; contains mediapipe/. */
  assets?: string;
  mediapipe?: { bundle?: string; wasm?: string; model?: string };
  /** Optional prepared landmarks; null uses local detection. Coordinates refer to the complete image. */
  landmarks?: (image: HTMLImageElement, context: { signal: AbortSignal }) =>
    ImageLandmarks | readonly ImageLandmarks[] | { landmarks: ImageLandmarks } | null |
    Promise<ImageLandmarks | readonly ImageLandmarks[] | { landmarks: ImageLandmarks } | null>;
  onReady?: (event: { image: HTMLImageElement; faces: number }) => void;
  onSkip?: (event: { image: HTMLImageElement; reason: 'no_face' }) => void;
  onError?: (event: { image: HTMLImageElement; error: Error & { code?: string } }) => void;
}
export interface ImageAnimationStatus {
  images: number; ready: number; faces: number; active: number; scanned: number; skipped: number;
  scanning: boolean; paused: boolean; scrolling: boolean; destroyed: boolean;
}
export interface ImageAnimator {
  readonly status: ImageAnimationStatus;
  pause(): void;
  resume(): void;
  /** Discover matches, changed images and removed nodes; retry rerigs existing matches. */
  refresh(options?: { retry?: boolean }): void;
  setOptions(options: Omit<ImageAnimationOptions, 'root'>): void;
  /** Remove overlays, release graphics resources, cancel work and disconnect listeners. */
  destroy(): void;
}
export const IMAGE_DEFAULTS: Readonly<Required<Pick<ImageAnimationOptions,
  'selector' | 'intensity' | 'speed' | 'mood' | 'moodSeed' | 'eyeTracking' | 'eyeMovement' |
  'hoverExpressions' | 'showMesh' | 'minSize' | 'maxActive' | 'maxFacesPerImage' | 'fps' | 'observe' | 'respectReducedMotion' | 'hideOnScroll' | 'scrollIdleDelay'>>>;
/** Free, silent browser-local animation. Does not upload images or invoke hosted services. */
export function animateImages(options?: ImageAnimationOptions): ImageAnimator;
