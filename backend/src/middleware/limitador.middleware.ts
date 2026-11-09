import { NextFunction, Request, Response } from "express";

type Registro = { contagem: number; expiraEm: number };

type OpcoesLimitador = {
  janelaMs: number;
  maximo: number;
  contarApenasFalhas?: boolean;
};

// Limitação: o contador é por processo e em memória. Reinícios zeram os registros
// e múltiplas instâncias do servidor não compartilham estado.
export function criarLimitador({ janelaMs, maximo, contarApenasFalhas = false }: OpcoesLimitador) {
  const registros = new Map<string, Registro>();
  let ultimaLimpeza = Date.now();

  function limparVencidos(agora: number) {
    for (const [ip, registro] of registros) {
      if (registro.expiraEm <= agora) registros.delete(ip);
    }
    ultimaLimpeza = agora;
  }

  return (req: Request, res: Response, next: NextFunction) => {
    const agora = Date.now();

    if (agora - ultimaLimpeza >= 60_000) {
      limparVencidos(agora);
    }

    const ip = req.ip || req.socket.remoteAddress || "desconhecido";
    let registro = registros.get(ip);

    if (!registro || registro.expiraEm <= agora) {
      registro = { contagem: 0, expiraEm: agora + janelaMs };
      registros.set(ip, registro);
    }

    if (registro.contagem >= maximo) {
      const retryAfter = Math.max(1, Math.ceil((registro.expiraEm - agora) / 1000));
      res.setHeader("Retry-After", String(retryAfter));
      return res.status(429).json({ message: "Muitas tentativas. Tente novamente mais tarde." });
    }

    if (contarApenasFalhas) {
      res.on("finish", () => {
        if (res.statusCode === 401) {
          const atual = registros.get(ip);
          if (atual && atual.expiraEm > Date.now()) {
            atual.contagem += 1;
          }
        }
      });
    } else {
      registro.contagem += 1;
    }

    next();
  };
}
