"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Favorite } from "@/lib/types";

const STORAGE_KEY = "rick-and-morty-favorites";
const EMPTY_FAVORITES: Favorite[] = [];

interface FavoritesContextValue {
  favorites: Favorite[];
  isFavorite: (kind: Favorite["kind"], id: number) => boolean;
  toggleFavorite: (favorite: Favorite) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function readStoredFavorites(): Favorite[] {
  if (typeof window === "undefined") return EMPTY_FAVORITES;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return EMPTY_FAVORITES;

    const parsed: unknown = JSON.parse(stored);
    if (
      Array.isArray(parsed) &&
      parsed.every(
        (item) =>
          item &&
          (item.kind === "character" || item.kind === "episode") &&
          typeof item.data?.id === "number",
      )
    ) {
      return parsed as Favorite[];
    }
    console.error("Los favoritos guardados tienen un formato inválido.");
  } catch (error) {
    console.error("No se pudieron leer los favoritos guardados.", error);
  }
  return EMPTY_FAVORITES;
}

let favoritesStore = readStoredFavorites();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return favoritesStore;
}

function getServerSnapshot() {
  return EMPTY_FAVORITES;
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const favorites = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleFavorite = useCallback((favorite: Favorite) => {
    const exists = favoritesStore.some(
      (item) => item.kind === favorite.kind && item.data.id === favorite.data.id,
    );
    const updated = exists
      ? favoritesStore.filter(
          (item) =>
            item.kind !== favorite.kind || item.data.id !== favorite.data.id,
        )
      : [...favoritesStore, favorite];

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("No se pudieron guardar los favoritos en este navegador.", error);
    }
    favoritesStore = updated;
    listeners.forEach((listener) => listener());
  }, []);

  const isFavorite = useCallback(
    (kind: Favorite["kind"], id: number) =>
      favorites.some((item) => item.kind === kind && item.data.id === id),
    [favorites],
  );

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite }),
    [favorites, isFavorite, toggleFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites debe usarse dentro de FavoritesProvider.");
  }
  return context;
}
