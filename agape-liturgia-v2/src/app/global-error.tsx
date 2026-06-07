"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "sans-serif", backgroundColor: "#fff", color: "#000" }}>
          <div style={{ maxWidth: "400px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px", border: "1px solid #eaeaea", borderRadius: "24px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
            
            <h2 style={{ fontSize: "24px", fontWeight: "900", marginBottom: "8px", textAlign: "center" }}>Erro Crítico</h2>
            
            <p style={{ color: "#666", textAlign: "center", fontSize: "14px", lineHeight: "1.5", marginBottom: "32px" }}>
              A aplicação encontrou um erro grave de renderização. 
            </p>

            <button
              onClick={() => reset()}
              style={{ width: "100%", backgroundColor: "#2F6BFF", color: "white", fontWeight: "bold", padding: "16px", borderRadius: "16px", border: "none", cursor: "pointer" }}
            >
              Recarregar Aplicativo
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
