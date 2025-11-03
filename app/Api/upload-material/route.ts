import { NextResponse, NextRequest } from 'next/server';
import { writeFile, access, constants, mkdir, readFile, rename } from 'fs/promises';
import path from 'path';
import formidable from 'formidable';
import type { File as FormidableFile } from 'formidable';

// Localização dos arquivos
const METADATA_PATH = path.join(process.cwd(), 'data', 'materials.json');
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'materials');
const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'data', 'temp'); // Pasta temporária para o formidable

// Configuração para desabilitar o bodyParser padrão do Next.js
export const config = {
    api: {
        bodyParser: false,
    },
};


/**
 * Função utilitária para analisar o formData usando formidable.
 * @param req A requisição NextRequest.
 * @returns Promessa que resolve para fields e files.
 */
function parseForm(req: NextRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
    return new Promise(async (resolve, reject) => {
        // Crie o diretório temporário se não existir
        try {
            await access(TEMP_UPLOAD_DIR, constants.F_OK);
        } catch (e) {
            await mkdir(TEMP_UPLOAD_DIR, { recursive: true });
        }

        const form = formidable({ 
            uploadDir: TEMP_UPLOAD_DIR, // Diretório temporário
            multiples: true, 
            keepExtensions: true,
        });

        // O formidable precisa da requisição Node.js original.
        // req.request é o objeto de requisição Web padrão. Isso é um hack comum.
        const nodeReq = (req as any).req || req; 

        form.parse(nodeReq, (err, fields, files) => {
            if (err) return reject(err);
            resolve({ fields, files });
        });
    });
}


/**
 * Rota POST para receber Matérias (múltiplos arquivos, título, descrição e agendamento)
 * e salvar os arquivos e seus metadados em JSON local.
 */
export async function POST(req: NextRequest) {
    try {
        const { fields, files } = await parseForm(req);

        // --- 1. Coleta e validação dos dados ---
        // Campos de texto vêm como array se forem múltiplos, pegamos o primeiro.
        const titulo = Array.isArray(fields.titulo) ? fields.titulo[0] : fields.titulo;
        const descricao = Array.isArray(fields.descricao) ? fields.descricao[0] : fields.descricao || '';
        const agendamento = Array.isArray(fields.agendamento) ? fields.agendamento[0] : fields.agendamento || null;
        
        if (!titulo) {
            return NextResponse.json(
                { ok: false, message: 'Título da matéria é obrigatório.' }, 
                { status: 400 }
            );
        }

        // 'files' contém todos os arquivos enviados. O nome do campo é 'files' (do frontend).
        let uploadedFiles: FormidableFile[] = [];
        if (files.files) {
            uploadedFiles = Array.isArray(files.files) ? files.files : [files.files];
        }

        if (uploadedFiles.length === 0) {
             return NextResponse.json(
                { ok: false, message: 'Nenhum arquivo de matéria foi enviado.' }, 
                { status: 400 }
            );
        }

        // Garante que o diretório de upload final exista
        try {
            await access(UPLOAD_DIR, constants.F_OK);
        } catch (e) {
            await mkdir(UPLOAD_DIR, { recursive: true });
        }

        // --- 2. Processamento e salvamento dos múltiplos arquivos ---
        const fileEntries = await Promise.all(uploadedFiles.map(async (file) => {
            const safeFilename = `${Date.now()}-${file.originalFilename?.replace(/[^a-zA-Z0-9.]/g, '_')}`;
            const newPath = path.join(UPLOAD_DIR, safeFilename);

            // Move o arquivo do diretório temporário para o diretório final
            await rename(file.filepath, newPath);

            return {
                originalName: file.originalFilename,
                savedName: safeFilename,
                size: file.size,
                fileUrl: `/uploads/materials/${safeFilename}`, // Caminho público
            };
        }));


        // --- 3. Atualização do arquivo JSON de metadados ---
        
        // Garante que o diretório 'data' exista
        const dataDir = path.join(process.cwd(), 'data');
        try {
            await access(dataDir, constants.F_OK);
        } catch (e) {
            await mkdir(dataDir, { recursive: true });
        }

        // Inicializa/Lê os dados existentes
        let materials = [];
        try {
            const data = await readFile(METADATA_PATH, 'utf-8');
            materials = JSON.parse(data);
            if (!Array.isArray(materials)) materials = []; 
        } catch (e) {
            materials = [];
        }

        // Cria o novo objeto Matéria
        const novaMateria = {
            id: Date.now(),
            titulo,
            descricao,
            arquivos: fileEntries, // Lista de arquivos salvos
            data_upload: new Date().toISOString(),
            // Informação importante para agendamento:
            data_publicacao_agendada: agendamento, 
            status: agendamento ? 'Agendado' : 'Publicado Imediatamente',
        };

        // Adiciona e salva o JSON
        materials.push(novaMateria);
        await writeFile(METADATA_PATH, JSON.stringify(materials, null, 2), 'utf-8');

        // --- 4. Resposta de sucesso ---
        return NextResponse.json({ 
            ok: true, 
            message: 'Matérias enviadas, salvas localmente e agendadas com sucesso!',
            data: novaMateria
        }, { status: 200 });

    } catch (error) {
        console.error('Erro no upload das matérias:', error);
        return NextResponse.json({ ok: false, message: 'Erro interno do servidor ao processar o upload de múltiplas matérias.' }, { status: 500 });
    }
}