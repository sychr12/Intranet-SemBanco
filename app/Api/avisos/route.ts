import { NextResponse, NextRequest } from 'next/server';
import { writeFile, access, constants, mkdir, readFile } from 'fs/promises';
import path from 'path';

// Localização do arquivo de metadados e da pasta de uploads de imagens
const METADATA_PATH = path.join(process.cwd(), 'data', 'avisos.json');
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'avisos');

/**
 * Rota POST para receber um Aviso (texto, título, imagem opcional e agendamento)
 * e salvar os metadados em um JSON local.
 */
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        
        // --- 1. Coleta e validação dos dados ---
        const titulo = formData.get('titulo')?.toString();
        const texto = formData.get('texto')?.toString();
        // NOVO CAMPO: Agendamento de Data/Hora (datetime-local string)
        const agendamento = formData.get('agendamento')?.toString() || null; 
        
        // Campo de arquivo (pode ser null)
        const imagem = formData.get('imagem'); 

        if (!titulo || !texto) {
            return NextResponse.json({ ok: false, message: 'Título e texto do aviso são obrigatórios.' }, { status: 400 });
        }
        
        let imagePath: string | null = null;
        
        // --- 2. Processamento e salvamento da imagem (se houver) ---
        if (imagem instanceof File) {
            const buffer = Buffer.from(await imagem.arrayBuffer());
            // Cria um nome de arquivo seguro e único
            const filename = `${Date.now()}-${imagem.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
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
            imagePath = `/uploads/avisos/${filename}`;
        }

        // --- 3. Atualização do arquivo JSON de metadados ---
        
        // Garante que o diretório 'data' exista
        const dataDir = path.join(process.cwd(), 'data');
        try {
            await access(dataDir, constants.F_OK);
        } catch (e) {
            await mkdir(dataDir, { recursive: true });
        }
        
        // Inicializa/Lê os dados existentes
        let avisos = [];
        try {
            const data = await readFile(METADATA_PATH, 'utf-8');
            avisos = JSON.parse(data);
            if (!Array.isArray(avisos)) avisos = []; // Garante que seja um array
        } catch (e) {
            // Arquivo não existe ou está inválido, começa com um array vazio
            avisos = [];
        }

        // Cria o novo objeto Aviso
        const novoAviso = {
            id: Date.now(), // ID baseado no timestamp
            titulo,
            texto,
            imagem_url: imagePath,
            data_criacao: new Date().toISOString(),
            // Informação importante para agendamento:
            data_publicacao_agendada: agendamento, 
            status: agendamento ? 'Agendado' : 'Publicado Imediatamente',
        };

        // Adiciona e salva o JSON
        avisos.push(novoAviso);
        await writeFile(METADATA_PATH, JSON.stringify(avisos, null, 2), 'utf-8');

        // --- 4. Resposta de sucesso ---
        return NextResponse.json({ 
            ok: true, 
            message: 'Aviso enviado, salvo localmente e agendado com sucesso!',
            data: novoAviso
        }, { status: 200 });

    } catch (error) {
        console.error('Erro no envio do aviso:', error);
        return NextResponse.json({ ok: false, message: 'Erro interno do servidor ao salvar o aviso localmente.' }, { status: 500 });
    }
}

// Nota: O método GET pode ser implementado aqui para ler o JSON e listar os avisos.