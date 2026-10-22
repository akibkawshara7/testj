import { useEffect, useState, useRef } from "react";
import { useLocation, useRouterState } from "@tanstack/react-router";
import { useIsFetching } from "@tanstack/react-query";

export function TopLoadingBar() {
  const location = useLocation();

  // Reactively track TanStack Router pending/loading state
  const isRouterLoading = useRouterState({
    select: (s) => s.status === "pending" || s.isLoading || s.isTransitioning,
  });

  // Track React Query fetching state
  const isFetching = useIsFetching({
    predicate: (query) => {
      const key = query.queryKey[0];
      if (typeof key === "string") {
        const lower = key.toLowerCase();
        if (lower.includes("episode") || lower.includes("watch")) {
          return false;
        }
      }
      return true;
    },
  });

  const isLoading = isRouterLoading || isFetching > 0;

  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const animFrameRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prevLocRef = useRef<string | null>(null);
  const isInitialLoadRef = useRef(true);

  const start = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    setVisible(true);
    setProgress((prev) => (prev > 0 && prev < 100 ? prev : 18));

    let lastTime = performance.now();
    const animate = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      setProgress((prev) => {
        if (prev >= 92) return 92;
        // Smooth logarithmic easing towards 92%
        const rate = Math.max(0.08, (92 - prev) * 0.12);
        const next = prev + rate * dt * 60;
        return Math.min(next, 92);
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  const finish = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);

    setProgress(100);

    timerRef.current = setTimeout(() => {
      setVisible(false);
      timerRef.current = setTimeout(() => {
        setProgress(0);
      }, 300);
    }, 250);
  };

  // 1. Initial page load trigger: start top bar immediately on mount
  useEffect(() => {
    start();

    // Mark initial load window complete after initial queries start/settle
    const initialTimer = setTimeout(() => {
      isInitialLoadRef.current = false;
      if (!isLoading) {
        finish();
      }
    }, 600);

    return () => clearTimeout(initialTimer);
  }, []);

  // 2. Track route/location changes
  useEffect(() => {
    if (prevLocRef.current === null) {
      prevLocRef.current = location.href;
      return;
    }
    if (prevLocRef.current !== location.href) {
      prevLocRef.current = location.href;
      start();
    }
  }, [location.href]);

  // 3. React to loading state changes (router navigation or data fetching)
  useEffect(() => {
    if (isLoading || isInitialLoadRef.current) {
      start();
    } else {
      finish();
    }
  }, [isLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!visible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[999999] h-[2.5px] overflow-visible"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 200ms ease-out",
      }}
    >
      <div
        className="h-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8),0_0_4px_rgba(255,255,255,0.5)]"
        style={{
          width: `${progress}%`,
          transition:
            progress === 100
              ? "width 200ms ease-out"
              : "width 300ms cubic-bezier(0.2, 0, 0, 1)",
        }}
      />
    </div>
  );
}
