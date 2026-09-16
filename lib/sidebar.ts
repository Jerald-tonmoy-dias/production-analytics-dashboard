const SIDEBAR_COLLAPSED_STORAGE_KEY = "pa-sidebar-collapsed";
const SIDEBAR_COLLAPSED_EVENT = "pa-sidebar-collapsed";

/**
 * Subscribe to desktop sidebar collapsed-state changes (same tab + other tabs).
 *
 * @param onStoreChange - Called when `localStorage` for the rail changes.
 * @returns Unsubscribe function.
 */
export function subscribeSidebarCollapsed(onStoreChange: () => void): () => void {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(SIDEBAR_COLLAPSED_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(SIDEBAR_COLLAPSED_EVENT, onStoreChange);
  };
}

/**
 * Read whether the desktop sidebar is the icon rail.
 *
 * @returns `true` when collapsed. Missing keys and SSR are expanded.
 */
export function readSidebarCollapsed(): boolean {
  try {
    return window.localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Persist the desktop sidebar collapsed state. Does not affect the mobile drawer.
 *
 * @param collapsed - `true` for the icon rail.
 */
export function writeSidebarCollapsed(collapsed: boolean): void {
  try {
    window.localStorage.setItem(
      SIDEBAR_COLLAPSED_STORAGE_KEY,
      collapsed ? "1" : "0"
    );
  } catch {
    return;
  }
  window.dispatchEvent(new Event(SIDEBAR_COLLAPSED_EVENT));
}
