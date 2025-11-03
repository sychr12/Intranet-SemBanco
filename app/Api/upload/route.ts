import { NextResponse, NextRequest } from 'next/server';
import { writeFile, access, constants, mkdir } from 'fs/promises';
import path from 'path';

// Removida a dependência do MySQL (`pool` e `connection`)

export async function POST(request: NextRequest) {
    
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
        // Isso garante que os arquivos possam ser acessados publicamente.
        const baseUploadDir = path.join(process.cwd(), 'public', 'uploads', 'materias');

        // Garante que o diretório de uploads exista
        try {
            await access(baseUploadDir, constants.F_OK);
        } catch (e) {
            // Se o diretório não existir, cria ele e todos os pais necessários
            await mkdir(baseUploadDir, { recursive: true });
        }
        
        // Processa e salva cada arquivo
        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer());
            
            // Cria um nome de arquivo único e seguro para evitar colisões e ataques de path traversal
            // Remove caracteres não alfanuméricos e substitui por '_'
            const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
            const filename = `${Date.now()}-${sanitizedFilename}`; 
            const filePath = path.join(baseUploadDir, filename);

            // Salva o arquivo no sistema de arquivos local
            await writeFile(filePath, buffer);
            
            // O caminho acessível publicamente no front-end (Ex: /public/uploads/materias/...)
            uploadedFilePaths.push(`/uploads/materias/${filename}`);
        }

        // --- SIMULAÇÃO DE ARMAZENAMENTO LOCAL (Substitui a lógica do MySQL) ---
        // Neste modo, o sucesso é retornado após salvar os arquivos no disco.

        return NextResponse.json({ 
            ok: true, 
            message: 'Matérias e arquivos salvos localmente no sistema de arquivos.',
            // Retorna os dados que seriam inseridos, confirmando a operação
            dados_salvos_localmente: {
                titulo: titulo,
                descricao: descricao,
                caminhos_arquivos: uploadedFilePaths,
                data_simulada: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Erro no upload de matérias (modo local):', error);
        return NextResponse.json({ ok: false, message: 'Erro interno do servidor ao processar arquivos.' }, { status: 500 });
    }
    // O bloco 'finally' para liberar a conexão MySQL foi removido.
}
