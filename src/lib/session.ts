// Session management and freshness tracking

// Unique ID for the current JavaScript runtime process
const RUNTIME_SESSION_ID =
  typeof window !== "undefined"
    ? `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    : "server_sess";

const SESSION_STORAGE_BOOT_KEY = "app_runtime_session_id";
const SESSION_STORAGE_LAST_ACTIVE_KEY = "app_session_last_active_ts";
const SESSION_INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

let sessionInitialized = false;

/**
 * Initialize session lifecycle listeners
 */
export function initSessionTracker() {
  if (typeof window === "undefined" || sessionInitialized) return;
  sessionInitialized = true;

  try {
    const storedSessionId = sessionStorage.getItem(SESSION_STORAGE_BOOT_KEY);
    const lastActiveStr = sessionStorage.getItem(SESSION_STORAGE_LAST_ACTIVE_KEY);
    const lastActiveTs = lastActiveStr ? Number(lastActiveStr) : 0;
    const now = Date.now();

    // Check if this is a brand new browser run or if the user returned after long inactivity
    const isNewRuntime = !storedSessionId || storedSessionId !== RUNTIME_SESSION_ID;
    const isExpired = lastActiveTs > 0 && now - lastActiveTs > SESSION_INACTIVITY_TIMEOUT_MS;

    if (isNewRuntime || isExpired) {
      // Clear per-media session check marks to force fresh chapter/episode checks
      clearMediaSessionFlags();
    }

    sessionStorage.setItem(SESSION_STORAGE_BOOT_KEY, RUNTIME_SESSION_ID);
    sessionStorage.setItem(SESSION_STORAGE_LAST_ACTIVE_KEY, String(now));
  } catch (e) {
    console.warn("Session tracking storage error:", e);
  }

  // Update activity timestamp on user interactions
  const updateActivity = () => {
    try {
      sessionStorage.setItem(SESSION_STORAGE_LAST_ACTIVE_KEY, String(Date.now()));
    } catch {}
  };

  window.addEventListener("pointerdown", updateActivity, { passive: true });
  window.addEventListener("keydown", updateActivity, { passive: true });
  window.addEventListener("scroll", updateActivity, { passive: true });

  // Handle visibility changes (e.g. user minimized browser, closed browser app and tab was restored, or locked phone)
  const handleVisibilityOrResume = () => {
    if (document.visibilityState === "visible") {
      try {
        const lastActiveStr = sessionStorage.getItem(SESSION_STORAGE_LAST_ACTIVE_KEY);
        const lastActiveTs = lastActiveStr ? Number(lastActiveStr) : 0;
        const now = Date.now();

        if (lastActiveTs > 0 && now - lastActiveTs > SESSION_INACTIVITY_TIMEOUT_MS) {
          // Session expired due to inactivity
          clearMediaSessionFlags();
          window.dispatchEvent(new CustomEvent("app:session-refreshed"));
        }
        sessionStorage.setItem(SESSION_STORAGE_LAST_ACTIVE_KEY, String(now));
      } catch {}
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityOrResume);
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      // Loaded from bfcache (browser back/forward or tab resume)
      clearMediaSessionFlags();
      window.dispatchEvent(new CustomEvent("app:session-refreshed"));
    }
    handleVisibilityOrResume();
  });
  window.addEventListener("focus", handleVisibilityOrResume);
}

/**
 * Remove all session-updated flags for media
 */
export function clearMediaSessionFlags() {
  if (typeof window === "undefined") return;
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (
        key &&
        (key.startsWith("mangaball_session_updated_") ||
          key.startsWith("episodes_session_updated_"))
      ) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => sessionStorage.removeItem(k));
  } catch {}
}

/**
 * Check if a media item needs to be updated in the current session
 */
export function isMediaSessionStale(mediaId: string | number, status?: string | null): boolean {
  if (typeof window === "undefined") return false;
  // If manga/anime is completely FINISHED, no new chapters will release, so cache is fine
  if (status === "FINISHED") return false;

  try {
    const key = `mangaball_session_updated_${mediaId}`;
    const val = sessionStorage.getItem(key);
    // If not checked in this runtime session, it is stale and must be fetched
    return val !== RUNTIME_SESSION_ID;
  } catch {
    return true;
  }
}

/**
 * Mark a media item as checked / up-to-date for the current session
 */
export function markMediaSessionFresh(mediaId: string | number) {
  if (typeof window === "undefined") return;
  try {
    const key = `mangaball_session_updated_${mediaId}`;
    sessionStorage.setItem(key, RUNTIME_SESSION_ID);
  } catch {}
}

/**
 * Invalidate session for a specific media item (e.g. manual refresh)
 */
export function invalidateMediaSession(mediaId: string | number) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(`mangaball_session_updated_${mediaId}`);
  } catch {}
}

// Auto-initialize in browser environment
if (typeof window !== "undefined") {
  initSessionTracker();
}
