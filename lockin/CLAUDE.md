# LockIn — Adaptive Daily Routine Tracker

Single-file app at `lockin/index.html`. No build step, no backend — open the
file (or serve the directory) and it runs. All state lives in the browser's
`localStorage`.

## The problem this solves

Static checklists fail the moment you fall behind on one item, which tends to
cause abandoning the whole day. LockIn continuously recalculates a realistic
path forward from wherever you actually are, instead of showing failure.

Full product spec: see the spec this branch was built from (daily targets,
core mechanic, UI requirements, scope) — the implementation below maps
directly onto it.

## Data model (all in one `localStorage` blob per key)

- `lockin_settings_v4` — targets, priorities, bedtime, buffer %. User-editable
  via the Settings panel.
- `lockin_day4_<YYYY-MM-DD>` — today's logged progress. Rolled into history
  and deleted at midnight rollover (`rollOver()`).
- `lockin_history_v4` — one `{date, score}` entry per past day, used for the
  streak, 30-day average, and heatmap.

Bumping the version suffix (`v4`) is the intended way to make a breaking data
model change without corrupting old saved state.

## The three category types

1. **Activities** (`settings.activities`) — the adaptively-rebalanced core:
   Workout, Reading, Writing, Coding by default. Each has a `target` (minutes)
   and a `priority` (0 = protected longest, higher = compressed first when
   time is short). Two `kind`s:
   - `duration` (Reading/Writing/Coding) — accumulates minutes toward target.
   - `session` (Workout) — tracks a 0 / 0.5 / 1 completion fraction, since
     "minutes so far" isn't a meaningful way to track a workout.
2. **Other / free time** (`dayState.other`) — deliberately kept *outside* the
   rebalancing engine entirely. Per spec, this category is flexible and must
   never be compressed when the day is behind. It only has quick-add buttons
   (+15/+30), no priority, no deficit tracking.
3. **Checklist** (`settings.check`) — empty by default. Simple custom
   boolean-ish habits (e.g. shower, skincare) the user adds themselves; not
   part of the time-based pacing math.
4. **Quantities** (`water`, `kcal`, `sleep`) — plain running totals against a
   daily target, logged via quick-add buttons.

## The adaptive engine (`computePlan()`)

Wake time is logged fresh each day (`dayState.wakeTime`, prefilled from
`settings.defaultWakeTime` but editable at the top of the page every day —
this is the spec's "wake time (logged)" input). Target bedtime is a single
user-editable setting. The window between them is what all pacing math is
computed against; there's no fixed schedule beyond that.

On every render:
1. `elapsedFraction` = how far through the wake→bedtime window "now" is.
2. For each activity, `deficit` = how far its completion fraction lags
   `elapsedFraction`. This is what "behind pace" means.
3. **Proportional redistribution**: remaining workable minutes (window time
   left, minus a buffer % reserved for meals/breaks) are split across
   incomplete activities weighted by deficit — the more behind something is,
   the more time it's suggested next.
4. **Priority-order compression**: if the proportional total needs more time
   than is actually left, the shortfall is cut from the *lowest*-priority
   activities first (highest `priority` number), protecting higher-priority
   ones. This is what "compress lower-priority items first" means concretely
   — it's a defined, inspectable order, not a vibe. A `compressed` flag is
   surfaced in the UI so the user can see when this happened, rather than it
   silently vanishing.
5. The single highest-deficit activity becomes the one hero recommendation in
   the "Right now" card. The full ranked list still exists below it
   ("Priority order for the rest of today") so nothing is hidden, but the
   dashboard never asks the user to parse the whole original schedule again.

## Quick-log, not timers

Earlier iterations of this app used running stopwatches (start/pause) for
activities. This version replaced that with three buttons — **Done / Partial
/ Skip** — per the spec's "quick-log buttons rather than typing." Done adds
the engine's current suggested chunk to the activity; Partial adds half;
Skip adds nothing but leaves the activity exactly where it was — it stays on
the list and will resurface in a later recalculation. Nothing is ever marked
"failed."

This also simplifies the data model: no `running`/`start` timer state, no
`Date.now()` deltas to reconcile — `accumulated` is just a plain number of
minutes, updated only on an explicit log action.

## Explicitly out of scope (v1)

Matches the spec: no push notifications/reminders, no multi-user accounts,
no backend. An earlier prototype had an idle-nudge bar and browser
Notification integration; both were removed as out-of-scope scope creep,
along with an unrelated "you got here from a distracting site" referrer
banner that wasn't part of the spec at all.

## Extending

- New activity: add to `settings.activities` (via Settings → "add a custom
  activity") with a `target` and `priority`. Defaults to `kind: 'duration'`.
- New checklist habit: Settings → "add a custom checklist item".
- Changing defaults: edit `DEFAULT_ACTIVITIES` / `DEFAULT_SETTINGS` in the
  `<script>` block. Bump the `_v4` storage suffix if the shape of stored
  state changes, so existing users don't load a mismatched blob.
