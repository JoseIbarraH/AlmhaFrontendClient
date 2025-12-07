export async function loadTranslations(lang: string) {
    try {
        const modules = import.meta.glob('/src/locales/**/*.json');

        const entries = Object.entries(modules);
        const translations: Record<string, any> = {};

        for (const [path, loader] of entries) {
            if (path.includes(`/src/locales/${lang}/`)) {
                const key = path.split('/').pop()?.replace('.json', '')!;
                translations[key] = (await loader() as any).default;
            }
        }

        return translations;
    } catch (e) {
        console.error("Error loading translations:", e);
        return {};
    }
}
