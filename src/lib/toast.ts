/**
 * Toast notification utility. Renders a dismissible notification into the
 * `#toast-container` element that must exist in the DOM (see `<ToastContainer />`).
 *
 * Auto-dismisses after 5s. Users can close earlier with the X button.
 */

export type ToastVariant = "success" | "error";

interface ToastOptions {
  variant?: ToastVariant;
  title?: string;
  durationMs?: number;
}

const DEFAULT_DURATION_MS = 5000;
const ANIMATION_MS = 300;

const TITLES: Record<ToastVariant, string> = {
  success: "¡Éxito!",
  error: "Error",
};

const ICONS: Record<ToastVariant, string> = {
  success: `<div class="shrink-0 w-8 h-8 rounded-full bg-[#FEEBDD] flex items-center justify-center text-[#513A31]"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg></div>`,
  error: `<div class="shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg></div>`,
};

const BORDER_COLOR: Record<ToastVariant, string> = {
  success: "border-[#513A31]",
  error: "border-[#ef4444]",
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function showToast(message: string, options: ToastOptions | ToastVariant = {}): void {
  const opts: ToastOptions = typeof options === "string" ? { variant: options } : options;
  const variant = opts.variant ?? "success";
  const title = opts.title ?? TITLES[variant];
  const duration = opts.durationMs ?? DEFAULT_DURATION_MS;

  const container = document.getElementById("toast-container");
  if (!container) {
    console.warn("[toast] #toast-container not found in DOM");
    return;
  }

  const toast = document.createElement("div");
  toast.className = `transform transition-all duration-300 translate-y-8 opacity-0 flex items-center gap-4 px-6 py-4 rounded-2xl shadow-xl pointer-events-auto border-l-4 bg-white text-[#513A31] ${BORDER_COLOR[variant]}`;

  toast.innerHTML = `
    ${ICONS[variant]}
    <div class="flex-1 min-w-0">
      <p class="font-bold text-sm leading-tight">${escapeHtml(title)}</p>
      <p class="text-sm text-[#7D6A5D] mt-0.5 wrap-break-word">${escapeHtml(message)}</p>
    </div>
    <button type="button" data-toast-close class="shrink-0 ml-2 text-[#D6C4B6] hover:text-[#7D6A5D] transition-colors focus:outline-none" aria-label="Cerrar">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>
  `;

  toast.querySelector("[data-toast-close]")?.addEventListener("click", () => dismiss(toast));

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove("translate-y-8", "opacity-0");
    toast.classList.add("translate-y-0", "opacity-100");
  });

  window.setTimeout(() => dismiss(toast), duration);
}

function dismiss(toast: HTMLElement): void {
  if (!toast.isConnected) return;
  toast.classList.remove("translate-y-0", "opacity-100");
  toast.classList.add("translate-y-8", "opacity-0");
  window.setTimeout(() => toast.remove(), ANIMATION_MS);
}
