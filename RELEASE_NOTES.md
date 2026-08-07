# CNC — Sell your car · v1.6.1

First-run onboarding for an empty garage (now swipeable), a valuation-history
timeline, a redesigned insurance eligibility card, a full-page performance view,
and a round of interaction polish — drag-to-close sheets, scrollable steps, and
sheet opens without a jump. Built as an Expo / React Native app; this release
ships the web build.

## What's new in v1.6

### Onboarding (new)
- **Onboarding carousel** on the empty garage view — three auto-advancing
  screens (*Your garage is here!*, *Know your vehicle's value*, *Never miss an
  important update*) that slide horizontally with a live page indicator. Titles
  are set in Roboto Flex.
- **Swipe between screens** — the carousel also takes manual navigation: swipe
  left/right on touch, click-drag with a mouse, or a **two-finger trackpad**
  swipe on the web; the auto-advance restarts after you interact.
- **Add-vehicle coachmark** — after **Get started**, a spotlight highlights the
  "Add vehicle to your garage" card and a pointer tooltip appears:
  **Start adding your vehicle** opens the Add Vehicle flow, **Skip** dismisses it
  and returns to the plain empty view.

### Valuation
- **Valuation card refresh** — an ⓘ (circle-info) icon beside the title, the
  value over a "Latest valuation" line, an inline condition scale, and a
  **Sell this car** / **Get expert valuation** button pair. The valuation page
  uses the same card, with **Get expert valuation** as its primary button.
- **Valuation shown as a range** — the figure now reads across the condition
  scale, from **Fair to Concours** (e.g. "£17,700 – £23,200"), on both the vehicle
  card and the valuation page.
- **Valuation history** — the info icon (on both the vehicle valuation card and
  the valuation page) opens a timeline of monthly readings on the 15th,
  January–July 2026, with condition easing from Excellent to Good.
- **Market-trend tooltip** — on the vehicle page it shows the market **Average**,
  the **Bought** baseline and the change; the valuation page shows the average
  only.

### Performance
- **Overall performance** (renamed from "My Vehicles", now 16px) is a **full
  page** rather than a sheet, with a "vs past …" comparison that follows the
  selected range. The summary card reads "↗ 5% + £14,000 vs last month" to match
  the Saved page, both figures bold.
- The saved-search **price trend** opens as a page too.

### Notifications
- The reminder actions (**Renew Now**, **Update Mileage**, …) are now filled
  **primary green** buttons instead of green outlines.

### Insurance
- **Eligibility card** — "Eligible for Car & Classic Insurance from £200
  annually" with the customer logo, a purple outline and a top-aligned info icon;
  the heading is set in Proxima Nova.

### Listings
- **Circular, borderless country flags**, a **dealer logo** overlay on
  dealer-sold cars, a redesigned **Reserve met** badge (light-green fill, green
  outline, fully rounded), and a **blue** live-auction dot.

### Sharing
- The share sheet uses a **4:3** preview, groups the disclaimer with the share
  targets, and flexes the targets evenly so none are cut off on smaller phones;
  the preview scrolls and the bottom padding is tighter.

### Motion & polish
- **Bottom sheets** are height-capped with the action button pinned to the
  bottom; steps slide left/right like a native navigation flow; and they open
  **without a jump** — the sheet is measured before it slides and the
  registration field focuses only once the sheet is open.
- **Gestures & fit** — sheets can be **dragged down to close** from the handle;
  long steps like **Vehicle condition** now scroll with the button pinned; the
  **Update mileage** sheet fills to a fixed height; and the bottom padding was
  trimmed so content isn't clipped on short screens.
- **Typography** — Proxima Nova (Regular / Bold / Semibold) is wired up on web
  and used for the SOLD badge and the insurance heading; ALL-CAPS labels were
  removed everywhere except the SOLD badge.
- Copy tidy-ups: **Skip**, **Add vehicle photo**, "Time for scheduled
  maintenance", and Listings/Saved card titles back at the top.

## What's new in v1.5

### Saved & My Garage
- **Redesigned single-vehicle garage card** — the "My garage" title and trend
  chart sit above a clean photo carrying just the vehicle name and price; its
  height now matches the multiple-vehicle card.
- **Single-view copy** — reads "1 vehicle", the Listings/Saved cards show
  "1 saved", and the Valuations card drops its list counter.
- **Garage trend** — the sparkline sits beside the price, and "vs last month" is
  green to match the change figure.
- **"Saved" collection** — the former "Searches" card is now **Saved**: its count
  when populated, "Get notifications for new listings" when empty. The add-sheet
  option matches.
- Realistic garage and valuation values throughout.

### Vehicle Details
- **Recently sold & Similar vehicle for sale** — two rows inside the market card
  (horizontal scroll, up to four cards, the second cut at ~¾ to signal
  scrolling), with auction/SOLD badges and asking prices.
- **Market trend from the real value** — average price, chart axis and high/low
  sales are derived from each vehicle's own valuation, so added cars no longer
  inherit a default profile's figures.
- **Valuation section redesign** — an inline condition grade scale and a
  **valuation history** timeline of monthly readings. *(Restyled in v1.6 — the
  info icon opens the history; see above.)*
- **Consistent pricing** — the details valuation matches the price on the Saved
  page.
- **Welcome prompt** now overlays the vehicle's own page and uses the Car &
  Classic AI mascot icon.

### Add & Edit
- **iOS wheel date/year picker** — recorded date, insurance renewal and
  purchase/manufacture year use a month·day·year (or year-only) wheel with a
  centre selection band. It opens as a clean stacked sheet and hides the action
  footer while open.
- **Floating labels** lift to a caption on focus.

### Sharing
- **iOS-style share sheet** using the Car & Classic favicon as its app icon,
  from both a vehicle's page and My Garage.

## What's new in v1.4

### Add a vehicle — refinements
- Registration lookup pre-fills make, model, year, engine, colour, transmission
  and steering; manual/import entry fills the gaps.
- The car is saved the moment its condition is set, with an **instant valuation**.
  Photos, purchase details and history stay genuinely empty until you add them,
  each with its own prompt — no forced steps up front.

### Vehicle Details — refinements
- **Placeholder hero:** before any photos are added, the hero holds the model
  name and "year · mileage" over the placeholder itself (no tap target yet).
- **Exact valuation & date:** a single figure with "Latest update", not a range.
- **Tidier details grid:** steering · registration / transmission · fuel /
  engine · year / colour, in two columns; mileage moved to its own section.
- **Mileage chart markers:** every reading is now a point on the line.
- **"Add record"** opens the full vehicle-history list.

### Photos & video, and history
- Refreshed **photo tips** sheet (clean car, space, daylight, plenty of angles,
  15 minutes). The save action only appears once there's a photo, as
  **"Save changes"**.
- Vehicle-history info sheet is explainer-only; upload actions live in the flow.

### Sell your car (new)
- **Sell my car** opens a sheet with two routes — a hands-off **auction** or an
  advert you **create yourself**.
- **Create your advert** hub: four steps (History, Photos & video, Description,
  Price) tracked as a **progress ring**; each completed step turns green and
  **"Review advert"** unlocks at 100%.
- **Description** — free-text write-up with an AI-style **Review** (a centred
  alert with suggestions) and **Done** to save; the action row is even and the
  field has no focus ring.
- **Price** — anchored to your valuation (shown as a fixed estimate). Tap the
  figure to type it, or slide between **"quicker sale"** and **"happy to wait"**;
  GBP / EUR / USD.
- **Advert preview** — the listing as a buyer would see it, with each section
  editable inline and an in-content authority confirmation before continuing.

### Advert packages & checkout (new)
- Choose reach — **Basic** (free), **Featured** (Best value, £29.99) or
  **Spotlight** (Biggest reach, £69.99) — with a daily-views chart.
- **Purchase summary** places a hold on the card; you're only charged once the
  advert is approved.
- **Apple Pay** sheet (card, address, contact, Face ID) that confirms the
  payment, then a **submitted-for-review** confirmation to finish. A free Basic
  listing skips payment.

## Highlights (carried forward)

### Saved (home)
- Sections for **My Garage**, **Listings & searches**, and **Valuations**.
- Portfolio value with a live sparkline; an ownership-reminder summary.
- The header **+** opens the add-vehicle chooser.

### My Garage
- Grid of owned vehicles with per-vehicle valuation and trend.
- **Portfolio performance** sheet and a **Notification centre** sheet.
- **Previously owned** archive via the header history action.

### Vehicle Details
- Hero, ownership reminders, valuation (with "how it's calculated" sheet),
  market insights with an interactive price-trend chart and individual-sale
  toggle, purchase information, car info, insurance, MOT, and service history.
- Sticky header that cross-fades in as the hero scrolls away.
- Each vehicle shows only its own reminders and market data.

### Saved collections
- **Listings**, **Searches**, and **Valuations** collection pages.
- Collection actions: **rename** (keyboard-aware sheet) and multi-select for
  bulk **add to collection** / **unsave**.
- Cards carry a **love/save** button; select mode uses a rounded checkbox.

### Add a vehicle to My Garage (guided flow)
- **Vehicle** — UK registration lookup or manual search; details prefill by
  variant/generation, colour picker.
- **Condition** — Concours / Excellent / Good / Fair, with a live value estimate.
- **Purchase information** — year, price, currency, and source.
- **History** — upload documents (photos/camera), auto-generated timeline, and
  per-document "show on listing" privacy blur.
- **Photos & video** — an iOS-style gallery picker with ordered multi-select, a
  2-column grid with a **cover image** tag, a camera capture screen, and a
  **walkaround video** guide. Completed steps show a preview card.

## Notes & known limitations
- **Camera and photo/video capture are presentational.** The gallery, camera,
  and walkaround "recording" use bundled sample media; wiring real capture needs
  `expo-camera` / `expo-image-picker` and permission handling.
- **Payment is presentational.** The Apple Pay sheet and card details are a mock;
  no charge is made and there is no payment backend.
- **A newly added vehicle's detail page borrows a default profile** for its
  market and history sections until it has real data of its own; its identity,
  photo, purchase details, and valuation estimate are its own.
- **Data is in-memory and not persisted.** Added vehicles, edits and advert
  drafts reset on reload; there is no backend yet.
- The web build is a single-page app tuned to a 393px phone frame, centered on
  larger screens.

## Tech
- Expo ~57, React Native 0.86, React 19.2, react-native-web.
- React Navigation 7 (native-stack); react-native-svg for charts.
- Design tokens mirror the Figma variable system.
