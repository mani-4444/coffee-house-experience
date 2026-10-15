import { test, expect } from '@playwright/test';
import { initialIntroState } from '../src/lib/intro';

test.describe('opening start state (D11, D13)', () => {
  test('every load plays the animation', () => {
    expect(initialIntroState({ optedOut: false, reducedMotion: false })).toBe('animating');
  });
  test('reduced motion always skips it', () => {
    expect(initialIntroState({ optedOut: false, reducedMotion: true })).toBe('done');
  });
  test('the test/screenshot opt-out skips it', () => {
    expect(initialIntroState({ optedOut: true, reducedMotion: false })).toBe('done');
  });
});
