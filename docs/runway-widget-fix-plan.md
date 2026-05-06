# Runway ML Widget — Fix Plan

Ordered by likelihood of success. Each fix is independent and testable.
Stop at the first fix that produces the floating widget on the page.

---

## Fix 0 — Prerequisites (must be confirmed regardless of which fix is applied)

Before any code change, confirm:

1. **Allowed Origins in Runway Developer Portal** — log in to `dev.runwayml.com`,
   open the Character's Embed tab, and verify that both `https://puertaabierta.com.gt`
   and `https://www.puertaabierta.com.gt` are in the Allowed Origins list. If they are
   not there, the widget will silently fail at the API validation step regardless of how
   the script is loaded. Add them before testing any fix.

2. **Clean up `tech-section.tsx`** — remove the `useEffect` injection code (it cannot
   work and leaves dead state). The widget renders fixed to the viewport, not inside
   that div. The section's right column needs a separate content decision (see note at
   end of this document).

---

## Fix 1 — Patch `document.currentScript` via an inline script in layout.tsx

**Why it should work:** An inline `<script>` block in the SSR HTML (no `src`, no
`async`) runs synchronously during page parsing. At that point `document.body` exists
(placed at end of `<body>`) and we can use `Object.defineProperty` to temporarily
override the `document.currentScript` getter before the external script loads.

**Implementation:**

In `src/app/layout.tsx`, add inside `<body>` after `{children}`:

```tsx
<script
  dangerouslySetInnerHTML={{
    __html: `(function(){
      var s = document.createElement('script');
      s.src = 'https://cdn.dev.runwayml.com/prod/widget.js';
      s.setAttribute('data-pub-key','pub_959a8bd741cec086605875fed16b95a538f3a769880ab81497f09a9c4f3456b3');
      Object.defineProperty(document,'currentScript',{get:function(){return s;},configurable:true});
      s.addEventListener('load',function(){
        Object.defineProperty(document,'currentScript',{get:function(){return null;},configurable:true});
      },{ once:true });
      document.body.appendChild(s);
    })();`,
  }}
/>
```

**How it works:**
1. Inline script executes synchronously at end of `<body>` → `document.body` exists.
2. Creates `s` with the correct `src` and `data-pub-key`.
3. Overrides `document.currentScript` getter to return `s`.
4. When `s` loads and runs, `document.currentScript` returns `s` (not null).
5. Widget reads `s.getAttribute('data-pub-key')` and `s.src` → initializes normally.
6. Getter is restored to `null` after load.

**Risk:** Low. The override is configurable and scoped to the load event.

---

## Fix 2 — `@runwayml/avatars-sdk-react` npm package

**Why it should work:** This is Runway's official React integration. It does not use
`document.currentScript` and is designed for the React component lifecycle.

**Steps:**

```bash
npm install @runwayml/avatars-sdk-react
```

Then create a client component that wraps the SDK widget and render it once in
`layout.tsx`. Refer to the package README at:
`https://github.com/runwayml/avatars-sdk-react`

**Risk:** The SDK may require different authentication (API secret rather than pub-key)
and may have a different setup flow. Verify this before implementing.

---

## Fix 3 — Static HTML proxy via `public/` + `<iframe>` (last resort)

**Why it works:** An iframe has its own document. A `<script>` tag inside `public/runway.html`
runs in that document's context, `document.currentScript` is available, and the widget
initializes correctly inside the iframe's document.

**Limitation:** The widget renders `position:fixed` relative to the **iframe's viewport**,
not the main page. This means it appears at the iframe's bottom-right corner, not the
page's corner. This is only acceptable if the iframe is fullscreen or covers the
intended area.

This is the lowest-priority option and only viable if the goal is to show the widget
confined to a specific section of the page.

---

## Note on the TechSection right column

Regardless of which fix succeeds, the Runway widget renders as a **floating button in
the viewport corner** — it will not fill the right column of the "Abrimos las puertas"
section. That column will remain empty unless a separate content decision is made
(image, video, screenshot of the widget in action, etc.). This is a design decision
that belongs to the product owner, not a technical problem.

---

## Execution order

1. Confirm Allowed Origins in Runway portal (Fix 0, prerequisite).
2. Clean `tech-section.tsx` (Fix 0, prerequisite).
3. Implement Fix 1.
4. Deploy and verify the floating widget appears on the live site.
5. If widget does not appear → check browser console for the `validate` API response.
6. If `valid: false` → origin not whitelisted (Fix 0 was skipped or incomplete).
7. If no network call to `validate` → Fix 1 did not resolve `currentScript` → proceed to Fix 2.
