"use client";

import { useSyncExternalStore } from "react";

/**
 * Valor guardado no localStorage e compartilhado entre componentes e abas.
 * Se o navegador bloquear o armazenamento, o valor continua valendo em memória durante a sessão.
 */
export function createStoredValue<T>(key: string, parse: (raw: string | null) => T, empty: T) {
  const listeners = new Set<() => void>();
  let cache: { raw: string | null; value: T } = { raw: null, value: empty };

  function read(): T {
    let raw: string | null;
    try {
      raw = window.localStorage.getItem(key);
    } catch {
      return cache.value;
    }
    if (raw !== cache.raw) cache = { raw, value: parse(raw) };
    return cache.value;
  }

  function write(value: T) {
    const raw = JSON.stringify(value);
    cache = { raw, value };
    try {
      window.localStorage.setItem(key, raw);
    } catch {
      // Armazenamento indisponível (janela privada, cota): mantém só em memória.
    }
    listeners.forEach((l) => l());
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  function useValue(): T {
    return useSyncExternalStore(subscribe, read, () => empty);
  }

  return { read, write, useValue };
}

const subscribeNothing = () => () => {};

/** Falso no servidor e durante a hidratação; verdadeiro depois que o navegador assumiu. */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribeNothing, () => true, () => false);
}
