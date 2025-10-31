import { NextResponse, NextRequest } from 'next/server';
import { writeFile, access, constants, mkdir } from 'fs/promises';
import path from 'path';
import pool from '@/lib/db'; // Importe a conexão do seu MySQL

type MySQLConnection = any; 

export async function POST(request: NextRequest) {
    let connection: MySQLConnection | null = null;
    
    try {
        const formData = await request.formData();
        
        // Campos de texto
        const titulo = formData.get('titulo')?.toString();
        const texto = formData.get('texto')?.toString();
        
        // Campo de arquivo (pode ser null)
        const imagem = formData.get('imagem'); 

        if (!titulo || !texto) {
            return NextResponse.json({ ok: false, message: 'Título e texto do aviso são obrigatórios.' }, { status: 400 });
        }
        
        let imagePath: string | null = null;

        // Processa a imagem se ela existir
        if (imagem instanceof File) {
            const buffer = Buffer.from(await imagem.arrayBuffer());
            const filename = `${Date.now()}-${imagem.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
            const baseUploadDir = path.join(process.cwd(), 'public', 'uploads', 'avisos');
            const filePath = path.join(baseUploadDir, filename);
            
            // Garante que o diretório exista
            try {
                await access(baseUploadDir, constants.F_OK);
            } catch (e) {
                await mkdir(baseUploadDir, { recursive: true });
            }

            await writeFile(filePath, buffer);
            imagePath = `/uploads/avisos/${filename}`;
        }

        // --- 💾 Conexão e Inserção no MySQL ---
        connection = await pool.getConnection();

        // Insere o aviso na tabela de Avisos
        const [result] = await connection.execute(
            `INSERT INTO avisos (titulo, texto, imagem_url, data_criacao, ativo) 
             VALUES (?, ?, ?, NOW(), 1)`, // ativo = 1 (Aviso ativo imediatamente)
            [
                titulo, 
                texto, 
                imagePath 
            ]
        );

        return NextResponse.json({ 
            ok: true, 
            message: 'Aviso enviado e cadastrado com sucesso!',
            id: (result as any).insertId 
        });

    } catch (error) {
        console.error('Erro no envio do aviso:', error);
        return NextResponse.json({ ok: false, message: 'Erro interno do servidor.' }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}