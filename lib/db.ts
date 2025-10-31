import mysql from 'mysql2/promise';

// Configurações do seu MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// A tipagem 'any' aqui pode ser refinada, mas resolve o erro inicial
// Se estiver usando mysql2, é bom usar 'Pool' do próprio módulo para tipagem
export default pool;