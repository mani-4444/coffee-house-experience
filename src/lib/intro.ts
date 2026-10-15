/**
 * The opening animation (D11, docs/motion.md): a coded drawing below the header (filter drips →
 * pour splits into two tumblers → ½), then the panel lifts like a shutter onto the site.
 * It plays on every page load (client request, D13).
 */
export type IntroState = 'animating' | 'done';

export type IntroConditions = {
  /** Set only by automated tests and the screenshot script (sessionStorage INTRO_OFF_KEY). */
  optedOut: boolean;
  /** prefers-reduced-motion: reduce */
  reducedMotion: boolean;
};

/** Never set for visitors: lets tests and screenshots load the page without the opening. */
export const INTRO_OFF_KEY = 'obt:intro-off';
/** Length of the drawing before the panel lifts (matches the --d delays in IntroAnimation.astro). */
export const ANIMATION_MS = 5300;
/** The shutter lift onto the site. */
export const LIFT_MS = 900;

/** Every load plays the opening, except with reduced motion (or the test opt-out). */
export function initialIntroState(c: IntroConditions): IntroState {
  return c.optedOut || c.reducedMotion ? 'done' : 'animating';
}
