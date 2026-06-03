import { db } from "../database/connection.database";
import { ILogin } from "../models/login.model";
import { ResultSetHeader } from "mysql2";

export class LoginRepository {
  async selectTodos(): Promise<ResultSetHeader> {
    const sql = "SELECT * FROM login";
    const [rows] = await db.execute<ResultSetHeader>(sql);
    return rows;
  }

  async findByUsername(dados: ILogin): Promise<ResultSetHeader> {
    const sql =
      "SELECT * FROM login WHERE username = ? AND is_active = 1 LIMIT 1;";
    const values = [dados.username];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }

  async selectById(id_login: number): Promise<ResultSetHeader> {
    const sql = "SELECT * FROM login WHERE id_login = ?";
    const values = [id_login];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }

  async adicionarUsuario(dados: ILogin): Promise<ResultSetHeader> {
    const sql =
      "INSERT INTO login (username, password_hash, role) VALUES (?, ?, ?);";
    const values = [dados.username, dados.password_hash, dados.role];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }

  async deletarUsuario(id_login: number): Promise<ResultSetHeader> {
    const sql = "DELETE FROM login WHERE id_login = ?";
    const values = [id_login];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }
}
