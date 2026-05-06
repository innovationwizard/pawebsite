# Runway ML Widget — Research Findings

All findings below are derived directly from:
- The live widget source at `https://cdn.dev.runwayml.com/prod/widget.js` (fetched and read in full)
- Agent research against official Runway documentation

---

## 1. Root cause of the blank render: `document.currentScript` guard

The widget IIFE begins with an immediate exit if `document.currentScript` is null:

```js
(function(){
  if(window.__runwayEmbedWidget) return;
  window.__runwayEmbedWidget = !0;
  let n = document.currentScript;   // ← reads currentScript
  if (!n) return;                    // ← exits immediately if null
  let r = n.getAttribute("data-pub-key");
  if (!r) return;
  let c = n.src;
  if (!c) return;
  ...
```

Per the HTML spec, `document.currentScript` returns `null` for any script that was
created dynamically via `document.createElement('script')` + `appendChild`.

**Every approach we tried so far falls into this category:**

| Method | How the `<script>` tag is created | `currentScript` result |
|---|---|---|
| `next/script strategy="lazyOnload"` | `createElement` at idle | `null` → widget exits |
| `next/script strategy="afterInteractive"` | `createElement` post-hydration | `null` → widget exits |
| `useEffect` + `ref.current.appendChild` | `createElement` in effect | `null` → widget exits |

Only scripts that exist in the **original HTML** (not dynamically created) have `currentScript` set.

---

## 2. Widget is a fixed floating element — NOT an embedded content block

From the widget's injected CSS:

```css
.rw-container {
  position: fixed;
  bottom: 36px;
  right: 20px;
  z-index: 2147483647;
}
```

The widget always renders as a **fixed chat button in the bottom-right corner of the
viewport** — identical to Intercom or Drift. It appends its own `<div id="runway-embed-widget">`
directly to `document.body` and attaches a closed Shadow DOM to it.

The container `div` we placed inside `<TechSection>` has no effect on where the widget
renders. The widget ignores the location of the script tag for its visual output.

---

## 3. The widget needs `document.body` to exist at execution time

Immediately after the `currentScript` check, the widget does:

```js
let k = document.createElement("div");
k.setAttribute("id", "runway-embed-widget");
document.body.appendChild(k);   // ← synchronous, no DOMContentLoaded wrapper
```

This means the script **must execute after `<body>` has been parsed**. Placing it in
`<head>` (as `strategy="beforeInteractive"` does) would cause `document.body` to be
`null` at execution time and throw a `TypeError`.

The correct placement is: **after the opening `<body>` tag and before `</body>`**, with
no `async` or `defer` attribute.

---

## 4. `cdn.dev.runwayml.com` is a development/staging CDN

The API base URL hardcoded inside the widget is:

```js
let l = "https://api.dev.runwayml.com";
```

Both the CDN and the API are `.dev` infrastructure (staging/development). The production
equivalents are `cdn.runwayml.com` and `api.runwayml.com`. Using the dev CDN in
production is a risk: the endpoint may be less stable, rate-limited differently, or
unavailable without warning.

---

## 5. Origin validation — silent blocker

On every page load, the widget calls:

```
GET https://api.dev.runwayml.com/v1/embeds/validate
Authorization: Bearer {pub-key}
```

If the current origin (`puertaabierta.com.gt` or `www.puertaabierta.com.gt`) is **not
in the Allowed Origins list** configured in the Runway Developer Portal for this pub-key,
the response will be `{ valid: false }` and the widget will silently abort — no error,
no UI, nothing rendered. This is a second independent blocker even if `currentScript`
is resolved.

---

## 6. `document.currentScript` is read-only but its getter is configurable

`document.currentScript` is defined on `Document.prototype` with a getter. Per the
spec, it can be temporarily overridden using `Object.defineProperty` with
`configurable: true`. This is the basis for Fix #1 in the plan.

---

## 7. Official React SDK exists

Runway publishes `@runwayml/avatars-sdk-react` on GitHub. It is designed specifically
for React/Next.js and does not use `document.currentScript`. It communicates with the
same API but via React-compatible lifecycle management. This is the basis for Fix #2
in the plan.
