export function logErro(contexto: string, error: unknown): void {
  const detalhe = error as { message?: unknown; code?: unknown } | null | undefined;
  const mensagem =
    detalhe && typeof detalhe === "object" && "message" in detalhe
      ? String(detalhe.message)
      : String(error);
  const codigo =
    detalhe && typeof detalhe === "object" && "code" in detalhe
      ? String(detalhe.code)
      : "";

  console.error(`[ERRO] ${contexto}: ${mensagem}${codigo ? ` (code: ${codigo})` : ""}`);
}
