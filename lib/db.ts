import mysql, { Pool } from 'mysql2/promise';

// Configurações do seu MySQL
const pool: Pool = mysql.createPool({
    // ATENÇÃO: Os valores abaixo foram inseridos DIRETAMENTE no código (Hardcoded).
    // Para conexão Docker, 'host' deve ser o nome do serviço do MySQL (ex: 'db').
    host: 'db', 
    user: 'root',
    password: 'root',
    database: 'intranet',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Adiciona um listener para testar a conexão quando o módulo é carregado (Opcional, mas útil)
pool.getConnection()
    .then(connection => {
        console.log('Conexão MySQL estabelecida com sucesso!');
        connection.release();
    })
    .catch(error => {
        console.error('--- ERRO FATAL DE CONEXÃO COM O BANCO ---');
        console.error('VERIFIQUE OS VALORES FIXOS (host, user, password, database) INSERIDOS DIRETAMENTE NO CÓDIGO.');
        console.error('Detalhes do Erro:', error.message);
        // Não é necessário interromper o processo aqui, mas o API Route irá falhar
    });

// Exporta a pool tipada para uso
export default pool;