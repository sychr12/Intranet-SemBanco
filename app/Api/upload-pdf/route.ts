import { NextResponse, NextRequest } from 'next/server';
import { writeFile, access, constants, mkdir, readFile } from 'fs/promises';
import path from 'path';

// Localização dos arquivos
const METADATA_PATH = path.join(process.cwd(), 'data', 'pdfs.json');
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'pdfs');

/**
 * Rota POST para receber um PDF (arquivo, título, descrição e agendamento)
 * e salvar o arquivo e seus metadados em JSON local.
 */
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        
        // --- 1. Coleta e validação dos dados ---
        const title = formData.get('title')?.toString();
        const description = formData.get('description')?.toString() || '';
        // Campo de agendamento (datetime-local string)
        const agendamento = formData.get('agendamento')?.toString() || null; 
        
        // Campo de arquivo (deve ser o PDF)
        const pdfFile = formData.get('file'); 

        if (!title || !(pdfFile instanceof File)) {
            return NextResponse.json(
                { ok: false, message: 'Título e arquivo PDF são obrigatórios.' }, 
                { status: 400 }
            );
        }
        
        // Verifica se o arquivo é realmente um PDF
        if (pdfFile.type !== 'application/pdf') {
            return NextResponse.json(
                { ok: false, message: 'O arquivo enviado não é um PDF válido.' }, 
                { status: 400 }
            );
        }

        // --- 2. Processamento e salvamento do arquivo PDF ---
        const buffer = Buffer.from(await pdfFile.arrayBuffer());
        // Cria um nome de arquivo seguro e único
        const filename = `${Date.now()}-${pdfFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const filePath = path.join(UPLOAD_DIR, filename);
        
        // Garante que o diretório de upload exista
        try {
            await access(UPLOAD_DIR, constants.F_OK);
        } catch (e) {
            await mkdir(UPLOAD_DIR, { recursive: true });
        }

        // Escreve o arquivo no sistema local
        await writeFile(filePath, buffer);
        // Salva o caminho acessível publicamente
        const pdfUrl = `/data/pdfs/${filename}`;


        // --- 3. Atualização do arquivo JSON de metadados ---
        
        // Garante que o diretório 'data' exista
        const dataDir = path.join(process.cwd(), 'data');
        try {
            await access(dataDir, constants.F_OK);
        } catch (e) {
            await mkdir(dataDir, { recursive: true });
        }
        
        // Inicializa/Lê os dados existentes
        let pdfs = [];
        try {
            const data = await readFile(METADATA_PATH, 'utf-8');
            pdfs = JSON.parse(data);
            if (!Array.isArray(pdfs)) pdfs = []; 
        } catch (e) {
            pdfs = [];
        }

        // Cria o novo objeto PDF
        const novoPdf = {
            id: Date.now(),
            title,
            description,
            fileUrl: pdfUrl, // Caminho do PDF salvo
            data_upload: new Date().toISOString(),
            // Informação importante para agendamento:
            data_publicacao_agendada: agendamento, 
            status: agendamento ? 'Agendado' : 'Publicado Imediatamente',
        };

        // Adiciona e salva o JSON
        pdfs.push(novoPdf);
        await writeFile(METADATA_PATH, JSON.stringify(pdfs, null, 2), 'utf-8');

        // --- 4. Resposta de sucesso ---
        return NextResponse.json({ 
            ok: true, 
            message: 'PDF enviado, salvo localmente e agendado com sucesso!',
            data: novoPdf
        }, { status: 200 });

    } catch (error) {
        console.error('Erro no upload do PDF:', error);
        return NextResponse.json({ ok: false, message: 'Erro interno do servidor ao processar o PDF.' }, { status: 500 });
    }
}