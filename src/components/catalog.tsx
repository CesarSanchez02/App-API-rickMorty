"use client";

import { useEffect, useState } from "react";
import { CharacterCard } from "@/components/character-card";
import { EpisodeCard } from "@/components/episode-card";
import { getCharacters, getEpisodes } from "@/lib/rick-and-morty";
import type { ApiPage, Character, Episode } from "@/lib/types";

type CatalogKind = "characters" | "episodes";

export function Catalog({ kind }: { kind: CatalogKind }) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [gender, setGender] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ApiPage<Character | Episode> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const characterCatalog = kind === "characters";

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => window.clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ page: String(page) });
    if (debouncedSearch) params.set("name", debouncedSearch);
    if (characterCatalog && status) params.set("status", status);
    if (characterCatalog && gender) params.set("gender", gender);

    async function loadCatalog() {
      setLoading(true);
      setError("");
      try {
        const result = characterCatalog
          ? await getCharacters(params, controller.signal)
          : await getEpisodes(params, controller.signal);
        if (!result) {
          setData({ info: { count: 0, pages: 0, next: null, prev: null }, results: [] });
          return;
        }
        setData(result);
      } catch (cause) {
        if (cause instanceof DOMException && cause.name === "AbortError") return;
        setError(cause instanceof Error ? cause.message : "Ocurrió un error inesperado.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadCatalog();
    return () => controller.abort();
  }, [characterCatalog, debouncedSearch, gender, page, status]);

  const title = characterCatalog ? "Personajes" : "Episodios";
  const results = data?.results ?? [];

  return (
    <main className="page-shell">
      <section className="page-intro">
        <p className="eyebrow">EXPLORA EL MULTIVERSO</p>
        <h1>{title}<span className="title-dot">.</span></h1>
        <p className="intro-copy">
          {characterCatalog
            ? "Conoce a los habitantes de cada dimensión. Busca, filtra y guarda tus favoritos."
            : "Revisa las aventuras de Rick y Morty, episodio por episodio."}
        </p>
      </section>

      <section className="catalog-tools" aria-label={`Buscar ${title.toLowerCase()}`}>
        <label className="search-field">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder={`Buscar ${characterCatalog ? "personaje" : "episodio"}...`}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              aria-label="Limpiar búsqueda"
            >
              ×
            </button>
          )}
        </label>
        {characterCatalog && (
          <div className="filter-fields">
            <label>
              <span className="visually-hidden">Filtrar por estado</span>
              <select
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value);
                  setPage(1);
                }}
              >
                <option value="">Todos los estados</option>
                <option value="alive">Vivo</option>
                <option value="dead">Muerto</option>
                <option value="unknown">Desconocido</option>
              </select>
            </label>
            <label>
              <span className="visually-hidden">Filtrar por género</span>
              <select
                value={gender}
                onChange={(event) => {
                  setGender(event.target.value);
                  setPage(1);
                }}
              >
                <option value="">Todos los géneros</option>
                <option value="female">Femenino</option>
                <option value="male">Masculino</option>
                <option value="genderless">Sin género</option>
                <option value="unknown">Desconocido</option>
              </select>
            </label>
          </div>
        )}
      </section>

      <div className="results-summary" aria-live="polite">
        <span>{loading ? "Buscando en la galaxia..." : `${data?.info.count ?? 0} resultados`}</span>
        {data && data.info.pages > 0 && <span>Página {page} de {data.info.pages}</span>}
      </div>

      {error && <div className="message-panel error-panel" role="alert">{error}</div>}
      {!error && !loading && results.length === 0 && (
        <div className="message-panel">
          <span className="empty-icon" aria-hidden="true">⌁</span>
          <h2>No encontramos resultados</h2>
          <p>Prueba con otro nombre o cambia los filtros.</p>
        </div>
      )}
      {results.length > 0 && (
        <div className={`card-grid${loading ? " is-loading" : ""}`}>
          {results.map((item) =>
            characterCatalog ? (
              <CharacterCard key={item.id} character={item as Character} />
            ) : (
              <EpisodeCard key={item.id} episode={item as Episode} />
            ),
          )}
        </div>
      )}

      {data && data.info.pages > 1 && (
        <nav className="pagination" aria-label="Paginación">
          <button type="button" onClick={() => setPage((current) => current - 1)} disabled={page === 1}>
            ← Anterior
          </button>
          <span>{page} <i>/</i> {data.info.pages}</span>
          <button type="button" onClick={() => setPage((current) => current + 1)} disabled={page === data.info.pages}>
            Siguiente →
          </button>
        </nav>
      )}
    </main>
  );
}
