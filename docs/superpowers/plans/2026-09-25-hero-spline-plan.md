# Implementation Plan — Spline 3D Hero (dark)

Spec: this file is self-contained; the approved design was agreed in session on
2026-09-25. Decisions recorded under "Approved design decisions" are the binding
authority; conflicts inside tasks resolve against that section.

## Context

`Emporia` is an **Astro 7** static site deployed to GitHub Pages under the base
path `/EMporia-`. It uses **Tailwind CSS v4** with the CSS-first `@theme` block in
`src/styles/global.css` — there is **no `tailwind.config.js`** and none may be
created. TypeScript is `astro/tsconfigs/strict`. The site currently ships **zero
framework JavaScript**.

We are replacing the homepage hero with a dark hero that embeds an interactive
Spline 3D scene and a cursor-following spotlight, using React islands.

## Approved design decisions

1. **Real Spline 3D**, using the public demo scene
   `https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode` as an explicit
   placeholder to be swapped for an Emporia-branded scene later.
2. **Dark hero only.** The hero section is dark. Every other section and page
   stays on the existing light palette. Do not restyle anything outside the hero.
3. **Islands, not a React page.** The hero's heading, paragraph, CTAs and trust
   bullets stay in Astro as server-rendered HTML so the `<h1>` (the LCP element)
   paints without waiting on hydration. Only `Spotlight` and `SplineScene` are
   React islands.
4. **Existing proof card is preserved,** not deleted — it moves from the hero to
   its own band directly below the hero.

## Global Constraints

- **Tailwind v4 only.** Add design tokens to the `@theme` block in
  `src/styles/global.css`. Never create `tailwind.config.js`.
- **Do not modify or remove any existing `@theme` token** (`--color-brand`,
  `--color-ink`, `--color-mist`, `--color-paper`, `--color-line`, etc.) or any
  existing `@layer components` class. Additive changes only.
- **Only the homepage hero may ship JavaScript.** Do not add `client:*`
  directives to any other component or page.
- **Internal links must use the `url()` helper** from `src/lib/url.ts` — the site
  is served under the `/EMporia-` base path and raw `href="/contact/"` breaks.
- **There is no test framework in this repo and none may be added.** Verification
  for every task is exactly:
  `npm run check` (astro check — must report 0 errors) and
  `npm run build` (must exit 0). Run both; paste real output in your report.
  Do not install vitest/jest/playwright. Do not write test files.
- **Copy the three supplied component files verbatim** where the plan says
  verbatim. Do not "improve" them.
- Commit after each task with a descriptive message.
- End every commit message with:
  `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`

---

## Task 1 — Foundation: dependencies, aliases, `cn()`, tokens

**Files:** `package.json`, `astro.config.mjs`, `tsconfig.json`,
`src/lib/utils.ts` (new), `src/styles/global.css`

1. Add the React integration by running `npx astro add react --yes`. This edits
   `astro.config.mjs` and installs `@astrojs/react`, `react`, `react-dom`.
   Verify `react()` ends up inside the existing `integrations: [...]` array
   **alongside the existing `sitemap({...})` call — do not drop sitemap.**
2. Install runtime dependencies:
   `npm i @splinetool/runtime @splinetool/react-spline framer-motion clsx tailwind-merge`
3. Add a path alias so shadcn-style `@/...` imports resolve. In `tsconfig.json`,
   inside `compilerOptions`, add exactly:
   ```json
   "baseUrl": ".",
   "paths": { "@/*": ["src/*"] }
   ```
   Preserve the existing `extends`, `include` and `exclude` keys.
4. Create `src/lib/utils.ts` containing exactly:
   ```ts
   import { clsx, type ClassValue } from 'clsx';
   import { twMerge } from 'tailwind-merge';

   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs));
   }
   ```
5. In `src/styles/global.css`, **append** these tokens inside the existing
   `@theme` block (do not create a second `@theme` block, do not touch existing
   lines). These back the shadcn `card.tsx` primitive:
   ```css
   --color-border: #e6e9ef;
   --color-card: #ffffff;
   --color-card-foreground: #0b1220;
   --color-muted-foreground: #6b7486;
   ```

**Verification:** `npm run check` → 0 errors. `npm run build` → exit 0, 9 pages
built. The site must look **completely unchanged** at this point.

---

## Task 2 — The three `components/ui` primitives

**Files (all new):** `src/components/ui/card.tsx`,
`src/components/ui/spotlight.tsx`, `src/components/ui/splite.tsx`

These go in `src/components/ui/` specifically because that is the shadcn registry
convention: components emitted by `npx shadcn add` import their siblings as
`@/components/ui/<name>`. Any other location means hand-patching imports forever.

Create each file with the exact content supplied below.

### `src/components/ui/card.tsx`

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className,
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

### `src/components/ui/spotlight.tsx`

Copy verbatim, with **one required deviation** from the supplied source, described
after the code.

```tsx
'use client';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useSpring, useTransform, SpringOptions } from 'framer-motion';
import { cn } from '@/lib/utils';

type SpotlightProps = {
  className?: string;
  size?: number;
  springOptions?: SpringOptions;
};

export function Spotlight({
  className,
  size = 200,
  springOptions = { bounce: 0 },
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [parentElement, setParentElement] = useState<HTMLElement | null>(null);

  const mouseX = useSpring(0, springOptions);
  const mouseY = useSpring(0, springOptions);

  const spotlightLeft = useTransform(mouseX, (x) => `${x - size / 2}px`);
  const spotlightTop = useTransform(mouseY, (y) => `${y - size / 2}px`);

  useEffect(() => {
    if (containerRef.current) {
      const parent = containerRef.current.parentElement;
      if (parent) {
        parent.style.position = 'relative';
        parent.style.overflow = 'hidden';
        setParentElement(parent);
      }
    }
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!parentElement) return;
      const { left, top } = parentElement.getBoundingClientRect();
      mouseX.set(event.clientX - left);
      mouseY.set(event.clientY - top);
    },
    [mouseX, mouseY, parentElement]
  );

  useEffect(() => {
    if (!parentElement) return;

    const handleEnter = () => setIsHovered(true);
    const handleLeave = () => setIsHovered(false);

    parentElement.addEventListener('mousemove', handleMouseMove);
    parentElement.addEventListener('mouseenter', handleEnter);
    parentElement.addEventListener('mouseleave', handleLeave);

    return () => {
      parentElement.removeEventListener('mousemove', handleMouseMove);
      parentElement.removeEventListener('mouseenter', handleEnter);
      parentElement.removeEventListener('mouseleave', handleLeave);
    };
  }, [parentElement, handleMouseMove]);

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'pointer-events-none absolute rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops),transparent_80%)] blur-xl transition-opacity duration-200',
        'from-zinc-50 via-zinc-100 to-zinc-200',
        isHovered ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{
        width: size,
        height: size,
        left: spotlightLeft,
        top: spotlightTop,
      }}
    />
  );
}
```

**Why the deviation (this is intentional, not a defect — do not "restore" the
original):** the supplied source passes *fresh arrow functions* to both
`addEventListener` and `removeEventListener` for the `mouseenter`/`mouseleave`
pairs. Those are different function identities, so the removals never match and
the listeners leak on every unmount. Hoisting them into the named `handleEnter` /
`handleLeave` consts makes the cleanup actually remove what it added. Behaviour is
otherwise identical.

### `src/components/ui/splite.tsx`

```tsx
'use client'

import { Suspense, lazy } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="loader"></span>
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
      />
    </Suspense>
  )
}
```

**Also required:** the fallback references a `.loader` class that does not exist
anywhere in this repo — as supplied it renders an invisible empty span. Add a
`.loader` class to the `@layer components` block in `src/styles/global.css`: a
small spinning ring, roughly 28px, using `currentColor` or a neutral tone that
reads on the dark hero, animated with CSS. Respect
`@media (prefers-reduced-motion: reduce)` by disabling the spin.

**Verification:** `npm run check` → 0 errors (this is the real gate — it
typechecks the `@/` alias and all three files). `npm run build` → exit 0. The
rendered site is still unchanged, because nothing imports these yet.

---

## Task 3 — `Hero.astro`

**File (new):** `src/components/Hero.astro`

Build the dark hero. It is an Astro component: all text is server-rendered, and
only the two React pieces are islands.

Structure:

- A `<section>` that is the dark band: `bg-ink` (near-black `#0b1220`, already a
  token) or `bg-black`, full-bleed, with `relative overflow-hidden`.
- Inside it, the existing `.container-x` wrapper for width alignment with the rest
  of the page.
- `<Spotlight client:idle class="-top-40 left-0 md:left-60 md:-top-20" />`
  — note: in Astro, pass the prop as `className` since the React component's prop
  is `className`; Astro does not translate `class` for framework components.
- A two-column grid: `grid lg:grid-cols-2 items-center`, stacking to one column
  below `lg`.
- **Left column** (Astro markup, no JS):
  - eyebrow: `Digital marketing · {site.city}` — reuse the `.eyebrow` class but
    it is brand-blue on white; on dark use `text-brand-sky` instead.
  - `<h1>`: `We don't say we grow local businesses.` then
    `We show you.` wrapped in a gradient span
    (`bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text
    text-transparent`, per the supplied design).
  - paragraph: the existing hero paragraph, in `text-neutral-300`.
  - Two CTAs: `See the results` → `url('/case-studies/')` and
    `Get a free local audit` → `url('/contact/')`. The existing `.btn-primary` /
    `.btn-secondary` classes are built for a light background — do not reuse them
    unchanged. Use a white-on-dark primary and an outline secondary. Keep the
    `Icon name="arrow"` on the primary.
  - The three trust bullets (`Based in {site.city}`, `Monthly proof reports`,
    `Reply within a day`) with the existing `Icon name="check"`, in a muted
    neutral tone.
- **Right column:** `<SplineScene client:visible scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" className="w-full h-full" />`
  inside a sized wrapper: `h-[320px]` on mobile, `lg:h-[500px]`.

Import `site` from `../config/site`, `url` from `../lib/url`, `Icon` from
`./Icon.astro`.

**`client:visible` and `client:idle` are mandatory** — never `client:load` or
`client:only`. The 1MB Spline runtime must not block first paint.

Add a short comment at the top of the file noting the Spline scene is a
placeholder demo asset to be swapped for an Emporia-branded scene.

**Verification:** `npm run check` → 0 errors. `npm run build` → exit 0.
The component is not yet referenced, so the site is still unchanged.

---

## Task 4 — Wire into the homepage

**File:** `src/pages/index.astro`

1. Import `Hero` from `../components/Hero.astro`.
2. Replace the existing `<!-- Hero -->` `<section>` (the
   `container-x grid items-center gap-12 pt-14 pb-20 ...` block, which spans the
   left text column and the `featured &&` proof-card link) with `<Hero />`.
3. **Do not delete the featured proof card.** Move it into a new section placed
   immediately after `<Hero />`: a light band (`container-x py-16`) with a short
   heading such as `Latest proof` and the existing `featured && (...)` anchor
   markup moved across unchanged. All of its existing classes, the metrics grid,
   the `sample` warning pill and the `url(...)` link must be preserved exactly.
4. Leave every other section of the page (Principles, steps, services, lead form,
   etc.) untouched.
5. Confirm the `featured` / `others` / `getCollection` frontmatter logic still
   compiles and `others` is still used where it was.

**Verification:** `npm run check` → 0 errors. `npm run build` → exit 0, 9 pages
built. Then confirm in the built output that
`dist/index.html` contains the literal `<h1>` hero text (proving the headline is
server-rendered, not client-only) — e.g. grep `dist/index.html` for
`We show you`. Report that grep's output. Also confirm the other pages did not
gain a script bundle they did not have before.
