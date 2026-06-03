import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { LoginRepository } from "../repository/login.repository";
import { JwtService } from "../utils/jwt";

export class LoginController {
  private readonly loginRepo: LoginRepository;
  private readonly jwtService: JwtService;
  private readonly bcryptRounds: number;

  constructor() {
    this.loginRepo = new LoginRepository();
    this.jwtService = new JwtService();
    this.bcryptRounds = Number(process.env.BCRYPT_ROUNDS) || 10;
  }

  criar: (req: Request, res: Response) => void = async (req, res) => {
    try {
      const { username, password, role } = req.body;
      if (!username || !password || !role) {
        return res
          .status(400)
          .json({ message: "Usuario, senha e cargo são obrigatórios" });
      }
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "A senha deve conter no mínimo 6 caracteres" });
      }
      const userExisting = await this.loginRepo.findByUsername(username.trim());

      if (userExisting) {
        return res.status(409).json({ message: "Usuario já existe" });
      }

      const password_hash = await bcrypt.hash(password, this.bcryptRounds);
      const login_id = await this.loginRepo.adicionarUsuario(
        username,
        password_hash,
        role,
      );
      res.status(201).json({
        message: "Login criado com sucesso",
        data: {
          login_id,
          username,
          role,
        },
      });
    } catch (error) {
      console.error("Erro ao criar login:", error);
      return res.status(500).json({ message: "Erro interno ao criar login" });
    }
  };
  delete: (req: Request, res: Response) => void = async (req, res) => {
    try {
      const login_id = Number(req.params.id);
      if (Number.isNaN(login_id) || login_id <= 0) {
        return res
          .status(400)
          .json({ message: "ID do login é obrigatório e deve ser válido" });
      }

      const deletedRows = await this.loginRepo.deletarUsuario(login_id);
      if (deletedRows === 0) {
        return res.status(404).json({ message: "Login não encontrado" });
      }

      res.status(200).json({ message: "Login excluído com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir login:", error);
      return res.status(500).json({ message: "Erro interno ao excluir login" });
    }
  };

  // Autentica o usuario e retorna o token de acesso
  login: (req: Request, res: Response) => void = async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Usuario e senha são obrigatórios" });
      }
      const user = await this.loginRepo.findByUsername(username.trim());

      if (!user) {
        return res.status(401).json({ message: "Usuario ou senha inválidos" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Usuario ou senha inválidos" });
      }

      const payload = {
        login_id: user.login_id,
        username: user.username,
        role: user.role,
      };
      const accessToken = this.jwtService.gerarTokenAcesso(payload);

      res.status(201).json({
        message: "Login realizado com sucesso",
        data: { accessToken },
      });
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      return res
        .status(500)
        .json({ message: "Erro interno ao realizar login" });
    }
  };

  rotaProtegida: (req: Request, res: Response) => void = async (req, res) => {
    try {
      res.status(200).json({
        message: "Você acessou um recurso protegido",
        user: req.user,
      });
    } catch (error) {
      console.error("Erro ao acessar rota protegida:", error);
    }
  };

  rotaAdmin: (req: Request, res: Response) => void = async (req, res) => {
    try {
      res.status(200).json({
        message: "Área exclusiva de administradores",
        user: req.user,
      });
    } catch (error) {
      console.error("Erro ao acessar rota admin:", error);
    }
  };

  rotaUsuario: (req: Request, res: Response) => void = async (req, res) => {
    try {
      res.status(200).json({
        message: "Área do usuário",
        user: req.user,
      });
    } catch (error) {
      console.error("Erro ao acessar rota usuario:", error);
    }
  };

  rotaGerente: (req: Request, res: Response) => void = async (req, res) => {
    try {
      res.status(200).json({
        message: "Área de gerentes e administradores",
        user: req.user,
      });
    } catch (error) {
      console.error("Erro ao acessar rota gerente:", error);
    }
  };
}