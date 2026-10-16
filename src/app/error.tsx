"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error al cargar la página:", error);
  }, [error]);

  return (
    <main className="page-shell">
      <section className="message-panel error-panel" role="alert">
        <h1>No pudimos abrir esta dimensión</h1>
        <p>Comprueba tu conexión e inténtalo de nuevo.</p>
        <div className="error-actions">
          <button className="button-link" type="button" onClick={reset}>Reintentar</button>
          <Link className="button-link secondary-button" href="/characters">Ir a personajes</Link>
        </div>
      </section>
    </main>
  );
}
