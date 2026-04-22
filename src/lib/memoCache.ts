/**
 * In-process TTL memoization for SSR fetchers.
 *
 * Shared across all requests handled by the same Astro Node worker. Survives
 * until the process restarts. Typical use case: avoiding per-request hits to
 * the backend for data that rarely changes (maintenance flag, navbar, etc.).
 *
 * Semantics:
 *  - Fresh  (age < ttl):     returns cached value, no fetch.
 *  - Expired:                fetches, updates cache, returns new value.
 *  - Fetch fails + stale:    returns stale value (degrade gracefully).
 *  - Fetch fails + no stale: re-throws the error so the caller can handle it.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export interface MemoCache<T> {
  get(): T | undefined;
  fetch(loader: () => Promise<T>): Promise<T>;
  invalidate(): void;
}

export function createMemoCache<T>(ttlMs: number): MemoCache<T> {
  let entry: CacheEntry<T> | null = null;

  return {
    get() {
      return entry?.value;
    },

    async fetch(loader) {
      const now = Date.now();

      if (entry && entry.expiresAt > now) {
        return entry.value;
      }

      try {
        const value = await loader();
        entry = { value, expiresAt: now + ttlMs };
        return value;
      } catch (err) {
        if (entry) {
          return entry.value;
        }
        throw err;
      }
    },

    invalidate() {
      entry = null;
    },
  };
}

export interface KeyedMemoCache<T> {
  fetch(key: string, loader: () => Promise<T>): Promise<T>;
  invalidate(key?: string): void;
}

/**
 * Multi-key variant: one TTL entry per string key (e.g. one per language).
 */
export function createKeyedMemoCache<T>(ttlMs: number): KeyedMemoCache<T> {
  const store = new Map<string, CacheEntry<T>>();

  return {
    async fetch(key, loader) {
      const now = Date.now();
      const entry = store.get(key);

      if (entry && entry.expiresAt > now) {
        return entry.value;
      }

      try {
        const value = await loader();
        store.set(key, { value, expiresAt: now + ttlMs });
        return value;
      } catch (err) {
        if (entry) {
          return entry.value;
        }
        throw err;
      }
    },

    invalidate(key) {
      if (key === undefined) {
        store.clear();
      } else {
        store.delete(key);
      }
    },
  };
}
