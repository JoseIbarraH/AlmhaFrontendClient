import type { TranslationNamespace, Translations } from "@/types/i18n";

type ModuleLoader = () => Promise<{ default: TranslationNamespace }>;

export async function loadTranslations(lang: string): Promise<Translations> {
    try {
        const modules = import.meta.glob("/src/locales/**/*.json") as Record<string, ModuleLoader>;

        const entries = Object.entries(modules);
        const translations: Translations = {};

        for (const [path, loader] of entries) {
            if (path.includes(`/src/locales/${lang}/`)) {
                const key = path.split("/").pop()?.replace(".json", "");
                if (!key) continue;
                translations[key] = (await loader()).default;
            }
        }

        return translations;
    } catch (e) {
        console.error("Error loading translations:", e);
        return {};
    }
}
