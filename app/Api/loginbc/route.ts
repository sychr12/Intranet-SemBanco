import { NextResponse } from "next/server";
import mysql, { RowDataPacket, PoolConnection } from "mysql2/promise";

// 🔧 Cria (ou reutiliza) o pool de conexões global
let pool: mysql.Pool | null = null;

function getPool() {
  if (!pool) {
    const {
      MYSQL_HOST = "db",
      MYSQL_USER = "root",
      MYSQL_PASSWORD = "root",
      MYSQL_DATABASE = "intranet",
    } = process.env;

    console.log("[DB-CONFIG]", {
      host: MYSQL_HOST,
      user: MYSQL_USER,
      database: MYSQL_DATABASE,
    });

    pool = mysql.createPool({
      host: MYSQL_HOST,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

// 🔹 POST = Login de usuário existente
export async function POST(req: Request) {
  let connection: PoolConnection | null = null;

  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Usuário e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const pool = getPool();
    connection = await pool.getConnection();

    // Verifica se o usuário existe no banco
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM usuarios WHERE username = ? AND password = ? LIMIT 2",
      [username, password]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Usuário ou senha inválidos." },
        { status: 401 }
      );
    }

    const user = rows[0];
    delete user.password;

    return NextResponse.json({
      success: true,
      message: "Login realizado com sucesso!",
      user,
    });
  } catch (error: any) {
    console.error("Erro no login:", error.message || error);
    return NextResponse.json(
      { success: false, message: "Erro interno no servidor." },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
