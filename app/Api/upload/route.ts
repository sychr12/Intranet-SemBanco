import { NextResponse, NextRequest } from 'next/server';
import { writeFile, access, constants, mkdir } from 'fs/promises';
import path from 'path';
import pool from '@/lib/db'; // Garanta que esta conexão MySQL esteja tipada corretamente

// A tipagem de conexão do MySQL pode precisar de ajustes dependendo da sua biblioteca (e.g., mysql2)
type MySQLConnection = any; 

// Para lidar com o FormData (arquivos), Next.js 13/14 App Router faz isso automaticamente.
// A export const config não é mais necessária neste contexto.

export async function POST(request: NextRequest) {
    let connection: MySQLConnection | null = null;
    
    try {
        // Obtém o FormData do request
        const formData = await request.formData();
        
        // Extrai os campos de texto
        const titulo = formData.get('titulo')?.toString() || 'Sem Título';
        const descricao = formData.get('descricao')?.toString() || 'Sem descrição';
        
        // Obtém todos os arquivos (serão File objects)
        const files: File[] = formData.getAll('files') as File[]; 

        if (files.length === 0) {
            return NextResponse.json({ ok: false, message: 'Nenhum arquivo enviado.' }, { status: 400 });
        }

        const uploadedFilePaths: string[] = [];
        // Define o diretório base para uploads dentro da pasta public
        const baseUploadDir = path.join(process.cwd(), 'public', 'uploads', 'materias');

        // Garante que o diretório de uploads exista
        try {
            await access(baseUploadDir, constants.F_OK);
        } catch (e) {
            await mkdir(baseUploadDir, { recursive: true });
        }
        
        // Processa e salva cada arquivo
        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer());
            // Limpa o nome do arquivo para garantir segurança
            const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`; 
            const filePath = path.join(baseUploadDir, filename);

            await writeFile(filePath, buffer);
            
            // O caminho acessível publicamente no front-end
            uploadedFilePaths.push(`/uploads/materias/${filename}`);
        }

        // --- 💾 Conexão e Inserção no MySQL ---
        connection = await pool.getConnection();

        // Insere o registro na tabela de Matérias
        const [result] = await connection.execute(
            `INSERT INTO materias (titulo, descricao, arquivos_json, data_upload) 
             VALUES (?, ?, ?, NOW())`,
            [
                titulo, 
                descricao, 
                JSON.stringify(uploadedFilePaths) // Salva os caminhos como JSON string
            ]
        );

        return NextResponse.json({ 
            ok: true, 
            message: 'Matérias e arquivos enviados com sucesso!',
            id: (result as any).insertId // Tipagem de retorno do MySQL
        });

    } catch (error) {
        console.error('Erro no upload de matérias:', error);
        return NextResponse.json({ ok: false, message: 'Erro interno do servidor.' }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}