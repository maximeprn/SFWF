"use client";

/**
 * The one press system for every hand-cut button, bound once on `window` in the capture
 * phase rather than per element — see `design_handoff_button_press/README.md`. That is
 * what makes it survive every re-render and answer touch, mouse and keyboard identically:
 * nothing here is wired to a particular button, only to whatever was under the pointer.
 *
 * `.press-btn` is the marker every surface carries. `pointerdown` shows the press; `click`
 * (also captured, so it runs before the element's own handlers) decides what happens next:
 *
 *   · a plain in-app link — no `target="_blank"`, no modifier key — is held for 240ms so
 *     the press is seen before the page turns, then replayed.
 *   · anything else (a button with no navigation, a new-tab link, a modified click) is
 *     never deferred. A delayed `window.open` reads as a popup and a delayed onClick reads
 *     as a broken button.
 *
 * "Replayed" rather than `location.href`: this is a Next.js app, and a hard navigation
 * would throw away the client router's transition for every link on the site. Preventing
 * the first click stops Next's own `<Link>` handler from ever seeing an unprevented event;
 * after the wait, dispatching a second, ordinary `.click()` on the same element — flagged
 * once so this module lets it straight through — reaches that handler exactly as if the
 * press system were not here at all.
 */

const SELECTOR = ".press-btn";
/** However fast a tap is, the press is never on screen for less than this. */
const HOLD = 160;
/** Press-down to navigation — long enough to see the press before the page turns. */
const NAV = 240;

let pressedEl: HTMLElement | null = null;
let pressedAt = 0;
let releaseTimer: ReturnType<typeof setTimeout> | undefined;
let navTimer: ReturnType<typeof setTimeout> | undefined;
/** One-shot: set immediately before a replayed click, cleared the instant this module sees it. */
const passthrough = new WeakSet<HTMLElement>();

function closestButton(e: Event): HTMLElement | null {
  const target = e.target;
  if (!(target instanceof Element)) return null;
  return target.closest<HTMLElement>(SELECTOR);
}

function pressOn(el: HTMLElement) {
  if (pressedEl === el) return;
  if (pressedEl) release(pressedEl);
  clearTimeout(releaseTimer);
  el.classList.remove("releasing");
  el.classList.add("pressed");
  pressedEl = el;
  pressedAt = Date.now();
}

function pressOff(hold: number) {
  const el = pressedEl;
  if (!el) return;
  pressedEl = null;
  clearTimeout(releaseTimer);
  const wait = Math.max(0, pressedAt + hold - Date.now());
  if (wait === 0) {
    release(el);
    return;
  }
  releaseTimer = setTimeout(() => release(el), wait);
}

/** Toggles the classes back rather than touching any property directly — nothing here
 * needs to know what `.pressed` changed, only that it is done changing it. */
function release(el: HTMLElement) {
  el.classList.add("releasing");
  el.classList.remove("pressed");
  setTimeout(() => el.classList.remove("releasing"), 200);
}

let bound = false;

/** Idempotent — safe to call from more than one mount without double-binding. */
export function bindPressSystem() {
  if (bound) return;
  bound = true;

  addEventListener(
    "pointerdown",
    (e) => {
      if ((e as PointerEvent).button !== 0) return;
      const el = closestButton(e);
      if (el) pressOn(el);
    },
    true,
  );
  addEventListener("pointerup", () => pressOff(HOLD), true);
  addEventListener("pointercancel", () => pressOff(HOLD), true);

  addEventListener(
    "keydown",
    (e) => {
      const key = (e as KeyboardEvent).key;
      if (key !== "Enter" && key !== " ") return;
      const el = closestButton(e);
      if (el) pressOn(el);
    },
    true,
  );
  addEventListener(
    "keyup",
    (e) => {
      const key = (e as KeyboardEvent).key;
      if (key === "Enter" || key === " ") pressOff(HOLD);
    },
    true,
  );

  addEventListener(
    "click",
    (e) => {
      const el = closestButton(e);
      if (!el) return;

      /* The replayed click from a previous press — let it straight through to whatever
         Next's own `<Link>` (or a plain anchor's default action) does with it. */
      if (passthrough.has(el)) {
        passthrough.delete(el);
        return;
      }

      pressOn(el);

      const me = e as MouseEvent;
      const anchor = el instanceof HTMLAnchorElement ? el : null;
      const plain =
        anchor !== null &&
        anchor.target !== "_blank" &&
        !me.metaKey &&
        !me.ctrlKey &&
        !me.shiftKey &&
        !me.altKey;

      if (!plain) {
        pressOff(HOLD);
        return;
      }

      e.preventDefault();
      clearTimeout(navTimer);
      const el2 = el;
      navTimer = setTimeout(
        () => {
          pressOff(0);
          passthrough.add(el2);
          el2.click();
        },
        Math.max(60, NAV - (Date.now() - pressedAt)),
      );
    },
    true,
  );
}
