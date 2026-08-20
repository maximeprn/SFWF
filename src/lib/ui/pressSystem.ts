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
/** Press-down to release — long enough to see the press before the page turns. */
const NAV = 240;

/**
 * Below this the press is carried by travel alone — the colour half is a pointer-only rule, in
 * `globals.css` on the same number — so the travel is the whole of the feedback and it is worth
 * waiting for. The two have to stay in step: change one and change the other.
 */
const TOUCH_WIDTH = "(max-width: 859.98px)";

/**
 * How long the surface takes to rise, mirroring `.press-btn.releasing`'s own transform
 * transition. Written here as well because JS has to know when the button is back up, and
 * there is no reading it off the element mid-flight.
 */
const RISE = 160;

/** The beat held after the button is fully back up, before the page is allowed to turn. */
const SETTLE = 100;

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
      /* On a pointer the page turns as the surface starts back up: the colour has already
         inverted and come back, so the press has been read by then and waiting only adds lag.
         On a touch width there is no colour, so the travel is the entire feedback — the button
         is let all the way up and held a beat there before the route changes, rather than the
         page turning out from under a surface still in motion. */
      const settle = window.matchMedia(TOUCH_WIDTH).matches ? RISE + SETTLE : 0;
      const go = () => {
        passthrough.add(el2);
        el2.click();
      };
      navTimer = setTimeout(
        () => {
          pressOff(0);
          if (settle === 0) {
            go();
            return;
          }
          /* Re-using `navTimer` keeps the whole sequence cancellable by the next press. */
          navTimer = setTimeout(go, settle);
        },
        Math.max(60, NAV - (Date.now() - pressedAt)),
      );
    },
    true,
  );
}
