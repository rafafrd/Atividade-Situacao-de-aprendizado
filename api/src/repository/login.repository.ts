import { db } from "../database/connection.database";
import { ILogin } from "../models/login.model";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export class LoginRepository {
  async selectTodos(): Promise<ResultSetHeader> {
    const sql = "SELECT * FROM login";
    const [rows] = await db.execute<ResultSetHeader>(sql);
    return rows;
  }
  async findByUsername(username: string): Promise<ILogin | null> {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM login WHERE username = ? AND is_active = 1 LIMIT 1;",
      [username],
    );
    return rows.length > 0 ? (rows[0] as ILogin) : null;
  }

  async selectById(login_id: number): Promise<ILogin | null> {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM login WHERE login_id = ? LIMIT 1;",
      [login_id],
    );
    return rows.length > 0 ? (rows[0] as ILogin) : null;
  }

  async adicionarUsuario(
    username: string,
    password_hash: string,
    role: string,
  ): Promise<number> {
    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO login (username, password_hash, role) VALUES (?, ?, ?);",
      [username, password_hash, role],
    );
    return result.insertId;
  }

  async deletarUsuario(login_id: number): Promise<number> {
    const [result] = await db.execute<ResultSetHeader>(
      "DELETE FROM login WHERE login_id = ?;",
      [login_id],
    );
    return result.affectedRows;
  }
}
