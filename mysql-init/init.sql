-- MySQL Dump Corrigido e Completo - Banco: intranet
-- Compatível com MySQL 8.x

-- ---------------------------------------------------------------------
-- Configuração inicial do Banco
-- ---------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS intranet
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE intranet;

-- ---------------------------------------------------------------------
-- Tabela: avisos (Para Popups e Notificações)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS avisos;

CREATE TABLE avisos (
  id INT NOT NULL AUTO_INCREMENT,
  titulo VARCHAR(255) NOT NULL,
  texto TEXT NOT NULL,
  -- Caminho do arquivo da imagem opcional (e.g., /uploads/avisos/banner.png)
  imagem VARCHAR(255) DEFAULT NULL,
  criado_em TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  -- Adicionado flag para controlar se o aviso está ativo para exibição
  ativo BOOLEAN NOT NULL DEFAULT 1, 
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Tabela: usuarios (Para Login e Permissões)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL, -- O ideal é que este campo armazene hashes (criptografia)
  nome VARCHAR(100) DEFAULT NULL,
  role VARCHAR(50) DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Tabela: materias (Para Notícias e Artigos - Rota /api/upload)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS materias;

CREATE TABLE materias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    -- JSON: Salva uma lista de caminhos de arquivos anexados
    arquivos_json JSON, 
    data_upload DATETIME DEFAULT CURRENT_TIMESTAMP,
    -- URL de imagem de destaque para a pré-visualização (se diferente dos anexos)
    imagem_destaque VARCHAR(255) DEFAULT NULL 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Tabela: colaboradores (Para Listas de Ramais, E-mails e Contatos)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS colaboradores;

CREATE TABLE colaboradores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cargo VARCHAR(100),
    departamento VARCHAR(50),
    ramal VARCHAR(10), 
    email VARCHAR(100) UNIQUE, 
    telefone VARCHAR(20), 
    -- Caminho da foto de perfil (e.g., /img/users/luiz.jpg)
    foto_url VARCHAR(255), 
    ativo BOOLEAN NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Tabela: documentos_pdf (Para Armazenar PDFs Editáveis/Visualizáveis)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS documentos_pdf;

CREATE TABLE documentos_pdf (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    -- Caminho do arquivo PDF salvo (e.g., /uploads/pdfs/manual.pdf)
    caminho_arquivo VARCHAR(255) NOT NULL, 
    data_upload DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ---------------------------------------------------------------------
-- Dados iniciais (Usuários)
-- ---------------------------------------------------------------------
INSERT INTO usuarios (username, password, nome, role)
VALUES 
    ('suporteti', 'wtc1902crc', 'Suporte TI', 'admin'),
    ('admin', '1234', 'Administrador', 'admin');

-- ---------------------------------------------------------------------
-- Dados de Exemplo (Colaboradores)
-- ---------------------------------------------------------------------
INSERT INTO colaboradores (nome, cargo, departamento, ramal, email, telefone)
VALUES
    ('Luiz Silva', 'Desenvolvedor', 'TI', '412', 'luiz.silva@empresa.com.br', '99123-4567'),