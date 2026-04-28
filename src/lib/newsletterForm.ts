import { createApi } from "./api";
import { showToast } from "./toast";

/**
 * Newsletter subscribe form lifecycle.
 *
 * Idempotent: safe to call on every `astro:page-load` event — uses a
 * `data-initialized` marker to avoid stacking listeners.
 */

type AxiosErr = {
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
    status?: number;
  };
  message?: string;
};

interface NewsletterStrings {
  rateLimit: string;
  genericError: string;
  defaultSuccess: string;
  loading: string;
}

const FALLBACK_STRINGS: NewsletterStrings = {
  rateLimit: "Too many attempts. Please try again later.",
  genericError: "Error subscribing. Please try again.",
  defaultSuccess: "Thanks for subscribing! Check your email.",
  loading: "Sending...",
};

function readNewsletterStrings(): NewsletterStrings {
  const el = document.getElementById("i18n-newsletter");
  if (!el || !el.textContent) return FALLBACK_STRINGS;
  try {
    const parsed = JSON.parse(el.textContent) as Partial<NewsletterStrings>;
    return { ...FALLBACK_STRINGS, ...parsed };
  } catch {
    return FALLBACK_STRINGS;
  }
}

function pickFirstValidationError(err: AxiosErr): string | null {
  const errors = err.response?.data?.errors;
  if (!errors) return null;
  const first = Object.values(errors)[0];
  return Array.isArray(first) && first.length > 0 ? first[0] : null;
}

function buildErrorMessage(err: AxiosErr, strings: NewsletterStrings): string {
  return (
    pickFirstValidationError(err) ||
    err.response?.data?.message ||
    (err.response?.status === 429 ? strings.rateLimit : strings.genericError)
  );
}

export function initNewsletter(): void {
  console.log("[newsletter] initNewsletter() called");

  const form = document.getElementById("newsletter-form") as HTMLFormElement | null;
  if (!form) {
    console.log("[newsletter] #newsletter-form not found in DOM — bailing");
    return;
  }
  console.log("[newsletter] form found");

  if (form.hasAttribute("data-initialized")) {
    console.log("[newsletter] already initialized — skipping");
    return;
  }
  form.setAttribute("data-initialized", "true");

  const emailInput = document.getElementById("newsletter-email") as HTMLInputElement | null;
  const message = document.getElementById("newsletter-message") as HTMLParagraphElement | null;
  const buttonText = document.getElementById("newsletter-button-text") as HTMLSpanElement | null;

  if (!emailInput || !message || !buttonText) {
    console.warn("[newsletter] missing children:", {
      emailInput: !!emailInput,
      message: !!message,
      buttonText: !!buttonText,
    });
    return;
  }

  const lang = document.documentElement.lang || "es";
  const apiUrl = form.dataset.apiUrl;
  console.log("[newsletter] lang:", lang, "apiUrl:", apiUrl);
  const api = createApi(lang, apiUrl);
  const strings = readNewsletterStrings();

  form.addEventListener("submit", async (e) => {
    console.log("[newsletter] submit fired");
    e.preventDefault();

    const email = emailInput.value.trim();
    if (!email) {
      console.log("[newsletter] empty email — bailing");
      return;
    }

    console.log("[newsletter] POST /api/client/subscribe email=", email);

    const originalText = buttonText.textContent ?? "";
    buttonText.textContent = strings.loading;
    message.classList.add("hidden");

    try {
      const response = await api.post("/api/client/subscribe", { email, locale: lang });
      const data = (response.data ?? {}) as { message?: string };

      const successMsg = data.message || strings.defaultSuccess;
      message.textContent = successMsg;
      message.classList.remove("text-red-400", "hidden");
      message.classList.add("text-green-400");
      form.reset();

      showToast(successMsg, "success");
    } catch (error) {
      console.error("[newsletter] subscribe failed:", error);
      const errorMsg = buildErrorMessage(error as AxiosErr, strings);

      message.textContent = errorMsg;
      message.classList.remove("text-green-400", "hidden");
      message.classList.add("text-red-400");

      showToast(errorMsg, "error");
    } finally {
      buttonText.textContent = originalText;
      setTimeout(() => {
        message.classList.add("hidden");
      }, 5000);
    }
  });
}
