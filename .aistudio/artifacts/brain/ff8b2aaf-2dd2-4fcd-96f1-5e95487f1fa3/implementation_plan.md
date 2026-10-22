# Instant Load, Smooth Poster Transition & Permanent Double-Load Fix

A comprehensive architectural fix to eliminate route-loader freezing, double loading, and poster transition flickering on direct hits, page refreshes, and route navigation.

> [!IMPORTANT]
> **Key Decisions & Confirmed Rationale**
> - **Non-blocking Route Loaders**: Remove blocking `await queryClient.ensureQueryData(...)` in route `loader` definitions (`/`, `/anime/$id`, `/anime/watch/$id`). This allows TanStack Router to mount routes instantly (0ms response time) without waiting 5-10s for API responses or server cold starts.
> - **Clean Initial Splash & Skeleton Flow**: Ensure initial mount renders instant layout & skeleton placeholders without triggering secondary re-fetches or conflicting overlay overlays.
> - **Flawless Poster Transition**: Precision bounding-rect calculations for shared poster morphing between home/browse cards and the detail page poster. Ensures pixel-perfect alignment, zero flicker during route transition, and a clean fade-out once target image settles.

---

## 1. Overview & Core Concept

When navigating or refreshing pages, blocking data promises in route loaders held the UI in an unrendered state for up to 10 seconds. Coupled with double-loading hooks and misaligned poster coordinates, the user experienced screen freezes, double loads, and visual flickering.

This plan addresses all three core issues permanently:
1. **Zero-Delay Route Resolution**: Routes mount immediately; React Query handles async fetching inside components with instant skeleton states.
2. **Unified Splash & Loader**: Eliminates duplicate load triggers and screen freezing on fresh visits and hard refreshes.
3. **Seamless Shared Poster Morph**: Recalculates exact target viewport rects for shared poster transitions, eliminating jumpiness, offset errors, and flickering artifacts.

---

## 2. User Experience & Visual Design

### User Experience Flow
1. **Direct Hit / Page Refresh**:
   - User enters website or refreshes page.
   - Header, navigation layout, top loading bar, and skeleton loading grids appear instantly (0ms delay).
   - Content fills in smoothly as soon as API data resolves.
2. **Poster Click & Transition**:
   - User clicks an anime card poster on Home, Browse, or Search.
   - The poster image smoothly morphs and glides directly to the exact pixel coordinates of the detail page hero poster without flickering or hiding the underlying image prematurely.
   - Once placed on the detail page, the overlay poster cleanly dissolves after a brief settlement duration (2-3s) without leaving any DOM artifacts.

---

## 3. Key Product Decisions & Trade-Offs

| Decision | Selected Approach | Rationale & Impact |
| :--- | :--- | :--- |
| **Route Loaders** | Non-blocking prefetch inside loaders, `useQuery` inside components | Removes 5-10s blocking pause on cold start or slow network API calls. |
| **Initial Hydration** | Single unified splash / top loader | Prevents double-triggering initial load logic on mount vs query resolution. |
| **Poster Transition Math** | Synchronous element measuring with `getBoundingClientRect` & CSS transform matrix | Prevents poster shift, pop-in, or flickering when navigating between grid cards and detail view. |

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                    TanStack Router Navigation                   │
└────────────────────────────────┬────────────────────────────────┘
                                 │ Instantly Mounts (0ms)
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                  React View Component Layer                     │
│  ┌────────────────────────┐         ┌────────────────────────┐  │
│  │ TopLoadingBar (Active) │         │ Skeleton / Layout UI   │  │
│  └────────────────────────┘         └────────────────────────┘  │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│           React Query Async Engine (useQuery Fetching)           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ SharedPosterTransitionProvider (Pixel-Perfect Morph)      │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Affected Files & Modifications
1. `src/routes/index.tsx`, `src/routes/anime.$id.tsx`, `src/routes/anime.watch.$id.tsx`: Convert blocking route `loader` promises into non-blocking prefetches.
2. `src/lib/shared-poster-transition.tsx`: Refactor transition positioning math to use exact target element viewport rects (`data-detail-poster="true"`), eliminate premature image unmounting, and apply smooth opacity dissolves.
3. `src/components/TopLoadingBar.tsx`: Fine-tune initial load and route transition state synchronization.
