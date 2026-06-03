import { Request, Response, NextFunction } from "express";
import { JwtService } from "../utils/jwt";
import { Role } from "../config/enum/Roles";

declare global {
  namespace Express {
    interface Request {
      user?: {
        login_id: number;
        username: string;
        role: string;
      };
    }
  }
}

export class AuthMiddleware {
  private readonly jwtService: JwtService;

  constructor() {
    this.jwtService = new JwtService();
  }

  authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Token de acesso ausente ou inválido" });
      return;
    }
    const token = authHeader.split(" ")[1];

    try {
      const decoded = this.jwtService.verificarTokenAcesso(token);
      req.user = {
        login_id: decoded.login_id,
        username: decoded.username,
        role: decoded.role,
      };
      next();
    } catch (error) {
      console.error("Erro ao validar token:", error);
      res.status(401).json({ message: "Token de acesso inválido ou expirado" });
      return;
    }
  };

  authorize = (...roles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({ message: "Não autenticado" });
        return;
      }
      if (!roles.includes(req.user.role as Role)) {
        res.status(403).json({ message: "Acesso negado: permissão insuficiente" });
        return;
      }
      next();
    };
  };
}
