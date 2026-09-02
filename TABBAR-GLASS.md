# The bottom menu, in native iOS glass

Rules for `components/TabBar.js`. The target is the iOS 26 tab bar: a floating
capsule of glass over the content, with the selected tab as its own capsule that
blends into the bar around it.

Verified against the Expo SDK 57 docs and the `expo-glass-effect@57.0.1` /
`expo-blur@57.0.2` sources. Anything marked *judgement* is a design call, not
something the platform dictates.

---

## 1. The content has to pass underneath it

This is the first change and nothing else matters without it.

Today `SavedScreen` renders the bar as a sibling *below* the `ScrollView`:

```jsx
</ScrollView>

<View style={{ paddingBottom: insets.bottom }}>
  <TabBar … />
</View>
```

The list stops above the bar, so there is nothing behind the glass but the
screen's own white. Glass with nothing to refract is a flat grey pill — the
effect will look broken and the instinct will be to blame the glass.

Lay it over instead:

```jsx
<ScrollView contentContainerStyle={styles.content} …>
```

with the scroll content reserving room for it —

```js
content: {
  …,
  paddingBottom: spacing[4] + TAB_BAR_HEIGHT + insets.bottom,
},
```

— and the bar absolutely positioned:

```js
bar: { position: 'absolute', left: 0, right: 0, bottom: insets.bottom },
```

Export the measured height from `TabBar.js` rather than hardcoding it in each
screen, so the padding can never drift from the bar.

**No opaque parent.** Anything between the glass and the scrolling content — a
wrapper with a `backgroundColor`, a `SafeAreaView` that paints white — hides the
content and kills the effect.

## 2. Three tiers, one component

| where | what renders | what it looks like |
| --- | --- | --- |
| iOS 26 | `GlassContainer` + `GlassView` | true liquid glass, capsules merge |
| iOS ≤ 25, Android | `BlurView` | real native blur, no merging |
| web | `BlurView` | CSS `backdrop-filter`, no merging |

`expo-blur`'s web build emits `backdrop-filter: saturate(180%) blur(intensity ×
0.2 px)` over a tint fill, so web is covered by the same fallback — there is no
third code path to write.

Install both:

```sh
npx expo install expo-glass-effect expo-blur
```

No config plugin. `npx pod-install` only matters if this ever leaves Expo Go.

## 3. Gate it properly — two checks, not one

```js
import { isLiquidGlassAvailable, isGlassEffectAPIAvailable } from 'expo-glass-effect';

const useGlass = isLiquidGlassAvailable() && isGlassEffectAPIAvailable();
```

Both are needed. `isLiquidGlassAvailable()` says the design is in use;
`isGlassEffectAPIAvailable()` exists because **some iOS 26 betas ship without the
API and crash without it** (expo/expo#40911). On every non-iOS platform both
return `false` and the components degrade to a bare `View` — which is why the
fallback fill has to live in the `style` prop, not in the component.

## 4. Structure: one container, two pieces of glass

```jsx
<GlassContainer spacing={SPACING} style={styles.container}>
  <GlassView glassEffectStyle="regular" isInteractive style={styles.pill}>
    {TABS.map(…)}
  </GlassView>
  <GlassView glassEffectStyle="clear" style={styles.activeCapsule} />
</GlassContainer>
```

- `GlassContainer`'s `spacing` is *"the distance at which glass elements start
  affecting each other"* — the merge threshold. Too small and the capsules stay
  separate discs; too large and everything smears into one blob. Start around
  the gap between the capsule and the pill's edge and tune by eye. *Judgement.*
- `isInteractive` on the pill only. It is what makes the glass respond to touch
  the way native does.
- The active capsule is `'clear'` against the pill's `'regular'` — the selected
  tab should read as a *lighter* pane on the bar, not a second frosted slab.
  *Judgement — try both.*
- Do **not** keep `color.background.neutralSubtle` as the active fill on the
  glass path. A solid fill is exactly the flat look this replaces.

## 5. The fallback

```jsx
<BlurView tint="systemChromeMaterial" intensity={100} style={styles.pill}>
```

`systemChromeMaterial` is the material Apple uses for bars, and on web it
resolves to `rgba(255,255,255,0.75)` — near-identical to the pill's current
white-at-70%. Avoid `systemThinMaterial`: on web it is `rgba(199,199,199,…)`, a
grey that will look dull in the browser.

Keep the existing shadow and the white fill beneath as the last resort, for
`backdrop-filter`-less browsers.

**Add the rim.** `BlurView` draws the blur and the fill but no edge. The lit
hairline is a good part of why a pane reads as glass rather than a tint, so put
it on the fallback pill:

```js
borderWidth: 1,
borderColor: 'rgba(255, 255, 255, 0.5)',
```

This is the auction page's `theme/glass.js` recipe, which is the same
`blur(20px) saturate(180%)` underneath — do not copy that file across as well.
It is web-only (`backdropFilter` is not a real RN style key and is silently
ignored on a device), so it would be a second, worse way to draw what `BlurView`
already draws everywhere. The rim is the only part worth taking.

## 6. Geometry — keep what the comp already has

Nothing here changes. The current values are the comp's:

- pill: `borderRadius: radius.full`, `paddingVertical: spacing[1]`,
  `paddingLeft: spacing[1]`, `paddingRight: spacing[2]`, `gap: spacing[2]`
- tab: 53pt tall, `paddingHorizontal: spacing[3]`, icon 24, label
  `caption1Regular` → `caption1Emphasized` when selected
- shadow: `0 4 20` at 25% — keep it. Glass still needs a shadow to lift off the
  content; the effect gives translucency, not elevation.
- sit the bar on `insets.bottom` from `useSafeAreaInsets`, never a fixed number

Five tabs is the HIG ceiling — this bar is at it. Anything more needs a
different pattern, not a narrower tab.

## 7. Rules that will bite

1. **Never animate opacity to 0** on a `GlassView` or any ancestor. The docs are
   explicit: it stops rendering the glass entirely. To fade the bar in or out,
   use `glassEffectStyle={{ style: 'none', animate: true, animationDuration: … }}`
   — the duration is in **seconds**, not milliseconds.
2. **`borderRadius` goes on the glass/blur view itself**, with
   `overflow: 'hidden'`, not on a parent.
3. **Android `BlurView` needs a `BlurTargetView`** wrapping the blurred content,
   with its ref passed to the `BlurView`. Without it there is no blur on Android.
4. **Render order matters for `BlurView`** — it does not update when it is
   rendered *before* dynamic content like a list. `SavedScreen` already renders
   `TabBar` after its `ScrollView`; keep it that way.
5. **`tintColor` sparingly.** Brand-tinting the whole bar is the fastest way to
   stop looking native. If the selected tab needs the brand green, put it on the
   icon and label, not the glass.

## 8. Accessibility

`isLiquidGlassAvailable()` can return `true` even when the user has turned the
effect down. Check `AccessibilityInfo.isReduceTransparencyEnabled()` and fall
back to an opaque pill when it is on — a translucent bar is a legibility problem
for the people who set that switch.

Keep `accessibilityRole="tab"` and `accessibilityState={{ selected }}` as they
are; none of this changes the semantics.

## 9. How to check it

- **iOS 26 device or simulator, Expo Go** — the only place the real effect
  exists. Scroll the list under the bar: the glass should pick up what passes
  beneath it, and the selected capsule should pull toward the pill's edge as it
  moves between tabs.
- **Web** — expect the blur fallback, not glass. That is correct, not a bug.
- If the bar looks like a flat grey pill on iOS 26, the cause is almost always
  §1: something opaque behind it, or content that stops short of it.
