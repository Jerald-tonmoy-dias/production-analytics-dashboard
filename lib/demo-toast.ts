const DEMO_TOAST_EVENT = "pa-demo-toast";

export type DemoToastDetail = {
  message: string;
};

/**
 * Fire a short-lived chrome-only notice (demo stubs, not product alerts).
 */
export function showDemoToast(message: string): void {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(
    new CustomEvent<DemoToastDetail>(DEMO_TOAST_EVENT, {
      detail: { message },
    })
  );
}

export function subscribeDemoToast(
  onToast: (message: string) => void
): () => void {
  function handler(event: Event) {
    const custom = event as CustomEvent<DemoToastDetail>;
    if (custom.detail?.message) {
      onToast(custom.detail.message);
    }
  }
  window.addEventListener(DEMO_TOAST_EVENT, handler);
  return () => window.removeEventListener(DEMO_TOAST_EVENT, handler);
}
