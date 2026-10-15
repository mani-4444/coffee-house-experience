// Smooth inertial scrolling + in-page links (D14, docs/motion.md).
// Lenis runs only with motion allowed; touch keeps native scrolling. It pauses while the opening plays.
import Lenis from 'lenis';

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis: Lenis | null = null;
if (!reduced) {
  lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
  const raf = (time: number) => {
    lenis!.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  const sync = () => (root.dataset.intro ? lenis!.stop() : lenis!.start());
  sync();
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-intro'] });
}

/** Header height, so arrivals land below the sticky bar. */
const headerOffset = () => (document.querySelector<HTMLElement>('[data-header]')?.offsetHeight ?? 0) + 16;

/** Move focus to where the reader arrived, as a native anchor would (without a second scroll). */
const focusArrival = (target: HTMLElement) => {
  if (!target.matches('a, button, input, select, textarea, [tabindex]')) {
    target.setAttribute('tabindex', '-1');
    target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
  }
  target.focus({ preventScroll: true });
};

/** Every in-page link: smooth scroll, update the URL, announce the arrival (Board flashes a row). */
document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
  const id = link?.getAttribute('href')?.slice(1);
  if (!link || !id) return;
  const target = document.getElementById(id);
  if (!target) return;
  e.preventDefault();
  history.pushState(null, '', `#${id}`);
  const arrive = () => {
    focusArrival(target);
    target.dispatchEvent(new CustomEvent('obt:arrive', { bubbles: true }));
  };
  if (lenis) {
    lenis.scrollTo(target, { offset: -headerOffset(), duration: 1.3, onComplete: arrive });
  } else {
    target.scrollIntoView(); // scroll-padding-top keeps it clear of the header
    arrive();
  }
});
