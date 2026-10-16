"use client";

import { useFavorites } from "@/lib/favorites-context";
import type { Favorite } from "@/lib/types";

export function FavoriteButton({ item }: { item: Favorite }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(item.kind, item.data.id);

  return (
    <button
      className={`favorite-button${active ? " is-favorite" : ""}`}
      type="button"
      aria-label={active ? "Quitar de favoritos" : "Agregar a favoritos"}
      aria-pressed={active}
      onClick={() => toggleFavorite(item)}
    >
      {active ? "♥" : "♡"}
    </button>
  );
}
