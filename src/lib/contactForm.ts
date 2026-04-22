import { showToast } from "./toast";

/**
 * Contact form lifecycle: submit handling + input sanitization.
 *
 * Idempotent: safe to call multiple times (e.g. on Astro `astro:page-load`
 * events after SPA-style navigation). Uses a `data-initialized` marker to
 * avoid stacking event listeners.
 */

interface SubmitResult {
  ok: boolean;
  status: number;
  body: Record<string, unknown>;
}

export function sanitizeCountryCode(value: string): string {
  // Allow only leading '+' and digits afterwards.
  const cleaned = value.replace(/[^+0-9]/g, "");
  const hasPlus = cleaned.startsWith("+");
  const digits = cleaned.replace(/\D/g, "");
  return hasPlus ? `+${digits}` : digits;
}

export function sanitizePhone(value: string): string {
  // Allow digits and intermediate whitespace only.
  return value.replace(/[^\d\s]/g, "");
}

export function pickFirstValidationError(body: Record<string, unknown>): string | null {
  const errors = (body as { errors?: Record<string, string[]> }).errors;
  if (!errors) return null;
  const first = Object.values(errors)[0];
  return Array.isArray(first) && first.length > 0 ? first[0] : null;
}

async function submitForm(apiUrl: string, formData: FormData): Promise<SubmitResult> {
  const data = Object.fromEntries(formData.entries());

  const response = await fetch(`${apiUrl}/api/v1/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  return { ok: response.ok, status: response.status, body };
}

function handleResult({ ok, status, body }: SubmitResult, form: HTMLFormElement): void {
  if (ok) {
    const message =
      typeof body.message === "string" && body.message
        ? body.message
        : "Mensaje enviado con éxito. Nuestro equipo se pondrá en contacto pronto.";
    showToast(message, "success");
    form.reset();
    return;
  }

  if (status === 422) {
    const firstError = pickFirstValidationError(body);
    showToast(firstError ?? "Revisa los datos del formulario e intenta de nuevo.", "error");
    return;
  }

  if (status === 429) {
    showToast("Has enviado demasiados mensajes. Intenta de nuevo en un minuto.", "error");
    return;
  }

  showToast("Hubo un error al enviar el mensaje. Intente de nuevo.", "error");
}

function attachSubmit(form: HTMLFormElement, apiUrl: string): void {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (!submitBtn) return;

    const originalText = submitBtn.innerText;
    submitBtn.innerText = "Enviando...";
    submitBtn.disabled = true;

    try {
      const result = await submitForm(apiUrl, new FormData(form));
      handleResult(result, form);
    } catch (error) {
      console.error("[contact-form] submit failed:", error);
      showToast("Error de conexión al enviar el formulario. Intente de nuevo.", "error");
    } finally {
      submitBtn.innerText = originalText;
      submitBtn.disabled = false;
    }
  });
}

function attachCountryCodeSanitization(): void {
  const input = document.getElementById("countryCodeInput") as HTMLInputElement | null;
  if (!input) return;

  input.addEventListener("input", (e) => {
    const target = e.target as HTMLInputElement;
    target.value = sanitizeCountryCode(target.value);
  });

  input.addEventListener("blur", (e) => {
    const target = e.target as HTMLInputElement;
    const datalist = document.getElementById("countryCodes") as HTMLDataListElement | null;

    const match = Array.from(datalist?.options ?? []).find(
      (opt) => opt.value === target.value || opt.text === target.value
    );

    if (match) {
      target.value = match.value;
    } else {
      const cleaned = sanitizeCountryCode(target.value);
      target.value = cleaned === "" || cleaned === "+" ? "+57" : cleaned;
    }
  });
}

function attachPhoneSanitization(): void {
  const input = document.getElementById("phoneInput") as HTMLInputElement | null;
  if (!input) return;

  input.addEventListener("input", (e) => {
    const target = e.target as HTMLInputElement;
    target.value = sanitizePhone(target.value);
  });

  input.addEventListener("blur", (e) => {
    const target = e.target as HTMLInputElement;
    target.value = target.value.trim();
  });
}

export function initContactForm(apiUrl: string): void {
  const form = document.getElementById("contactForm") as HTMLFormElement | null;
  if (!form) return;

  // Avoid double-binding when Astro re-runs scripts after SPA navigation.
  if (form.hasAttribute("data-initialized")) return;
  form.setAttribute("data-initialized", "true");

  attachSubmit(form, apiUrl);
  attachCountryCodeSanitization();
  attachPhoneSanitization();
}
