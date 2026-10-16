import type { ApiPage, Character, Episode } from "@/lib/types";

const API_URL = "https://rickandmortyapi.com/api";

async function fetchApi<T>(
  path: string,
  signal?: AbortSignal,
): Promise<T | null> {
  const response = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    signal,
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`La API respondió con el estado ${response.status}.`);
  }

  return (await response.json()) as T;
}

export async function getCharacters(
  params: URLSearchParams,
  signal?: AbortSignal,
): Promise<ApiPage<Character> | null> {
  return fetchApi<ApiPage<Character>>(`/character/?${params.toString()}`, signal);
}

export async function getEpisodes(
  params: URLSearchParams,
  signal?: AbortSignal,
): Promise<ApiPage<Episode> | null> {
  return fetchApi<ApiPage<Episode>>(`/episode/?${params.toString()}`, signal);
}

export async function getCharacter(id: string): Promise<Character | null> {
  return fetchApi<Character>(`/character/${encodeURIComponent(id)}`);
}

export async function getEpisode(id: string): Promise<Episode | null> {
  return fetchApi<Episode>(`/episode/${encodeURIComponent(id)}`);
}
