import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface TokenPayload {
  sub: string;
  role: string;
  iat: number;
  exp: number;
}

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "JWT token is missing." });
  }

  const [, token] = authHeader.split(" ");

  try {
    const secret = process.env.JWT_SECRET || "default-secret-key";
    const decoded = verify(token, secret) as TokenPayload;

    // Injeta os dados do usuário na requisição para uso nos controllers
    req.user = {
      id: decoded.sub,
      role: decoded.role,
    };

    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired JWT token." });
  }
}
