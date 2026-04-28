import { effect, signal, untracked, inject, DestroyRef } from '@angular/core';

export function storageSignal(key: string, ttlMs = 60 * 60 * 1000) {
  const read = (): { value: string; expiry: number } | null => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Date.now() < parsed.expiry ? parsed : null;
    } catch { return null; }
  };

  const stored = read();
  if (!stored) localStorage.removeItem(key);

  const sig = signal<string | null>(stored?.value ?? null);

  effect(() => {
    const v = sig();
    if (typeof window === 'undefined') return;

    if (v === null) {
      localStorage.removeItem(key);
    } else {
      const existing = read();
      localStorage.setItem(key, JSON.stringify({
        value: v,
        expiry: existing?.value === v
            ? existing.expiry
            : Date.now() + ttlMs
      }));
    }
  });

  return sig;
}