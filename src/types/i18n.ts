/**
 * i18n dictionaries are loaded dynamically from JSON files and have arbitrary
 * nesting depth. Without codegen from the JSON source, TypeScript cannot
 * statically verify deep key access. We accept a loose type here and keep
 * `any` ban strict everywhere else in the codebase.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export type TranslationNamespace = Record<string, any>;
export type Translations = Record<string, any>;
/* eslint-enable @typescript-eslint/no-explicit-any */
