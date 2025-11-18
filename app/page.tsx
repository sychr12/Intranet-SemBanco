"use client";
// Indica ao Next.js que este componente será renderizado no lado do cliente (client-side).

// Este arquivo é um componente React que roda no lado do cliente em ambientes Next.js.
// "use client" garante que este arquivo será renderizado no navegador e não no servidor.

import React, { JSX, useEffect, useState } from "react";
// Importa React e hooks: useEffect (efeitos colaterais) e useState (estado local).
// JSX é importado apenas para tipagem dos elementos JSX (TypeScript).

import { motion, Variants } from "framer-motion";
// Importa 'motion' para componentes animados e 'Variants' para tipar variantes de animação.

import {
  Menu,
  Building2,
  Users2,
  FileText,
  UserCircle,
  Gavel,
  Newspaper,
  Scale,
  FileSearch,
  FolderOpen,
  Briefcase,
  ClipboardList,
  FileSpreadsheet,
  File,
} from "lucide-react";
// Importa vários ícones SVG da biblioteca 'lucide-react' usados na interface.

import { Layers, BarChart3, Mail, Globe, Wrench, Leaf } from "lucide-react";
// Importa ícones adicionais da mesma biblioteca.

// =====================
// COMPONENTES DE INTERFACE
// =====================

import Calendar from "react-calendar";
// Importa componente de calendário da biblioteca 'react-calendar'.

import "react-calendar/dist/Calendar.css";
// Importa o CSS padrão do calendário para estilo básico.

import Image from "next/image";
// Importa o componente de imagem otimizado do Next.js.

import "../app/calendar.css";
// Importa um CSS personalizado (local) para ajustar estilos do calendário.

import Link from "next/link";
// Importa o componente Link do Next.js para navegação interna sem reload completo.

// =================================================================
// 1. TIPAGEM
// =================================================================

type ValuePiece = Date | null;
// Define um tipo que pode ser uma Date ou null (usado pelo calendário).

type Value = ValuePiece | [ValuePiece, ValuePiece];
// Define o valor do calendário: pode ser uma única data ou um intervalo [start, end].

type DepartmentKey = "PJ" | "RH" | "SGC";
// Restrição de chaves válidas para abas/departamentos: somente "PJ", "RH" ou "SGC".

// Tipagem dos colaboradores da empresa
type Colaborador = {
  id: number; // ID interno do colaborador
  nome: string; // Nome do colaborador
  cargo: string; // Cargo ou função
  foto: string; // URL da foto do colaborador
  data_nascimento: string; // Data de nascimento como string
};

// Tipagem genérica para registros como contatos, emails, ramais etc.
type Registro = {
  id: number; // ID do registro
  nome?: string; // Nome (opcional)
  cargo?: string; // Cargo (opcional)
  ramal?: string; // Ramal (opcional)
  email?: string; // Email (opcional)
  contato?: string; // Telefone/contato (opcional)
  foto?: string; // Foto (opcional)
};

// Tipagem da estrutura de notícias exibidas no card de dicas
interface NewsItem {
  id: number; // ID único da notícia
  title: string; // Título da notícia
  img: string; // Caminho/URL da imagem
  href: string; // Link de destino ao clicar
}

// =================================================================
// 2. DADOS E CONSTANTES
// =================================================================

// Variáveis de animação, usadas nos elementos animados do Framer Motion.
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  // Estado "hidden": transparente e deslocado 30px para baixo.

  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
    // Estado "visible": opacidade total, posição original.
    // Atraso de transição proporcional ao índice 'i' (stagger).
  }),
};

// Lista de atalhos rápidos exibidos no topo da intranet.
const quickLinks = [
  {
    title: "Ajuri", // Nome exibido
    icon: <Layers className="w-6 h-6" />, // Ícone JSX
    href: "http://www.ajuri.am.gov.br/", // Link externo
  },
  {
    title: "E-Compras",
    icon: <BarChart3 className="w-6 h-6" />,
    href: "https://www.e-compras.am.gov.br/publico/",
  },
  {
    title: "Email ",
    icon: <Mail className="w-6 h-6" />,
    href: "https://portal.office.com",
  },
  {
    title: "Sefaz",
    icon: <Globe className="w-6 h-6" />,
    href: "https://www.sefaz.am.gov.br/",
  },
  {
    title: "Siged",
    icon: <FolderOpen className="w-6 h-6" />,
    href: "https://sistemas.sefaz.am.gov.br/siged/login",
  },
  {
    title: "Sigatex",
    icon: <Leaf className="w-6 h-6" />,
    href: "https://sigater.idam.am.gov.br/",
  },
  {
    title: "Site IDAM",
    icon: <Globe className="w-6 h-6" />,
    href: "https://www.idam.am.gov.br/",
  },
  {
    title: "Suporte TI",
    icon: <Wrench className="w-6 h-6" />,
    href: "https://nti.idam.am.gov.br/front/helpdesk.public.php",
  },
];

// Lista de aplicativos Office exibidos na seção Documentos
const officeApps = [
  {
    img: "/image/outlook.png", // Caminho da imagem do app
    title: "Outlook", // Nome do app
    href: "https://outlook.office365.com/mail/", // Link de acesso
  },
  {
    img: "/image/Word.png",
    title: "Word",
    href: "https://www.office.com/launch/word",
  },
  {
    img: "/image/excel.png",
    title: "Excel",
    href: "https://excel.office.com",
  },
  {
    img: "/image/powerpoint.png",
    title: "PowerPoint",
    href: "https://www.office.com/launch/powerpoint",
  },
  {
    img: "/image/one.png",
    title: "OneDrive",
    href: "https://www.office.com/launch/onedrive",
  },
  {
    img: "/image/teans.png",
    title: "Teams",
    href: "https://teams.microsoft.com",
  },
  {
    img: "/image/formulario.png",
    title: "Forms",
    href: "https://forms.office.com",
  },
  {
    img: "/image/office.png",
    title: "Office",
    href: "https://m365.cloud.microsoft/chat/?auth=2",
  },
];

// ==================================================================
// Departamentos: cada aba contém seus links específicos
// ==================================================================

// 'departamentos' é um objeto cujas chaves são DepartmentKey e o valor é lista de links com título, ícone e href.
const departamentos: Record<
  DepartmentKey,
  { title: string; icon: JSX.Element; href: string }[]
> = {
  // ============================
  // DEPARTAMENTO PJ
  // ============================
  PJ: [
    {
      title: "Diário Oficial",
      icon: <Newspaper className="w-6 h-6" />,
      href: "https://diario.imprensaoficial.am.gov.br/",
    },
    {
      title: "Diário MP AM",
      icon: <FileText className="w-6 h-6" />,
      href: "https://diario.mpam.mp.br/pages/home.jsf",
    },
    {
      title: "Doe TCE",
      icon: <ClipboardList className="w-6 h-6" />,
      href: "https://doe.tce.am.gov.br/",
    },
    {
      title: "Comunica PJE",
      icon: <Gavel className="w-6 h-6" />,
      href: "https://comunica.pje.jus.br/",
    },
    {
      title: "DEJT",
      icon: <FileText className="w-6 h-6" />,
      href: "https://dejt.jt.jus.br/dejt/",
    },
    {
      title: "Imprensa Nacional",
      icon: <Newspaper className="w-6 h-6" />,
      href: "https://www.gov.br/imprensanacional/pt-br",
    },
    {
      title: "Diário da Justiça Eletrônico (SAJ)",
      icon: <Scale className="w-6 h-6" />,
      href: "https://consultasaj.tjam.jus.br/cdje/index.do",
    },
    {
      title: "DEC TCE",
      icon: <FileSearch className="w-6 h-6" />,
      href: "https://dec.tce.am.gov.br/dec/login.jsf",
    },
    {
      title: "Consulta e-SAJ",
      icon: <FileSearch className="w-6 h-6" />,
      href: "https://consultasaj.tjam.jus.br/esaj/portal.do?servico=740000",
    },
    {
      title: "PROJUDI",
      icon: <Gavel className="w-6 h-6" />,
      href: "https://projudi.tjam.jus.br/projudi/",
    },
    {
      title: "PJE TRT11",
      icon: <Scale className="w-6 h-6" />,
      href: "https://pje.trt11.jus.br/primeirograu/login.seam",
    },
  ],

  // ============================
  // DEPARTAMENTO RH
  // ============================
  RH: [
    {
      title: "Prodam RH",
      icon: <Users2 className="w-6 h-6" />,
      href: "https://prodamrh.prodam.am.gov.br/",
    },
    {
      title: "SEAD",
      icon: <Building2 className="w-6 h-6" />,
      href: "http://servicos.sead.am.gov.br/passivosam/auth/login",
    },
    {
      title: "SISPREV",
      icon: <ClipboardList className="w-6 h-6" />,
      href: "https://www.portaldosegurado.am.gov.br/conectado.php",
    },
    {
      title: "CIEE",
      icon: <Users2 className="w-6 h-6" />,
      href: "https://web.ciee.org.br/empresa/relatorios/estudantes-contratados",
    },
    {
      title: "FAP",
      icon: <FileSpreadsheet className="w-6 h-6" />,
      href: "https://fap.dataprev.gov.br/consultar-fap",
    },
    {
      title: "E-SOCIAL",
      icon: <Briefcase className="w-6 h-6" />,
      href: "https://www.esocial.gov.br/portal/Assinadoc",
    },
    {
      title: "IOA NEWS",
      icon: <Newspaper className="w-6 h-6" />,
      href: "https://ioanews.imprensaoficial.am.gov.br/",
    },
  ],

  // ============================
  // DEPARTAMENTO SGC
  // ============================
  SGC: [
    {
      title: "Sistema de Gestão de Contratos (SGC)",
      icon: <FolderOpen className="w-6 h-6" />,
      href: "http://sistemas.sefaz.am.gov.br/sgc-am/login.do",
    },
  ],
};

// =================================================================
// 3. COMPONENTE PRINCIPAL
// =================================================================

export default function Page() {
  const [date, setDate] = useState<Value>(new Date());
  // Estado 'date' inicializado com a data atual (ou um Value compatível).
  // setDate atualiza o estado quando o usuário escolhe outra data no calendário.

  const [selectedDept, setSelectedDept] = useState<DepartmentKey>("PJ");
  // Estado que guarda o departamento selecionado (aba ativa). Inicial "PJ".

  const [fetchedNews, setFetchedNews] = useState<NewsItem[]>([]);
  // Estado para guardar as notícias/dicas (array de NewsItem).

  // URLs de PDFs/recursos externos usados nos links laterais.
  const RAMAIS_PDF_URL =
    "https://office365prodam-my.sharepoint.com/:x:/g/personal/nti_idam_am_gov_br/EfqRFyXpB7dJme1xxhXjOYMBTJmkM7EoTfn_yk3wBfZuMQ?e=wK1SQ7";
  const EMAILS_PDF_URL =
    "https://docs.google.com/document/d/1Kil4NcZkgZUqnPt5o687z3eBD0W6YNfVXsn2J-t3MSQ/edit?pli=1&tab=t.0";
  const CONTATOS_PDF_URL =
    "https://docs.google.com/document/d/1cHB5TwcjBeatoFZkSdiDsl4-pKsixxy0AdgM4dLTan8/edit?invite=CL6n4Y8O&tab=t.0";

  // Mock de notícias: simula dados vindos de uma API.
  useEffect(() => {
    const mockNews: NewsItem[] = [
      {
        id: 1,
        title: "O que é malware e como se proteger?",
        img: "./image/virus.png",
        href: "https://www.kaspersky.com.br/resource-center/preemptive-safety/what-is-malware-and-how-to-protect-against-it",
      },
      {
        id: 2,
        title: "Por que você não deve compartilhar suas senhas?",
        img: "./image/compartilharsenha.png",
        href: "https://digitalsecurityguide.eset.com/br/por-que-voce-nao-deve-compartilhar-suas-senhas",
      },
      {
        id: 3,
        title: "Como Fazer um Chamado",
        img: "./image/img1.png",
        href: "https://office365prodam-my.sharepoint.com/:b:/g/personal/nti_idam_am_gov_br/EedyNcwHiHFIvvURrOX9Z-oBVP-bAnKVXMgpW1AndAFW6Q?e=RNoSew",
      },
    ];
    setFetchedNews(mockNews);
    // Atualiza o estado 'fetchedNews' com os dados mockados.
  }, []);
  // useEffect sem dependências => roda apenas uma vez ao montar o componente.

  // Estado que mostra o que está tocando no momento
  const [nowPlaying, setNowPlaying] = useState("Carregando...");

  // Estado que controla se está tocando ou pausado
  const [isPlaying, setIsPlaying] = useState(false);

  // Busca "tocando agora" da BRLogic quando o player carrega
  useEffect(() => {
    fetch("https://api.brlogic.com/nowplaying/7486")
      .then((r) => r.json())
      .then((d) => {
        // Nome da rádio
        const radioName = d.station?.name || "Rádio";

        // Música atual
        const music = d.title || "Informação indisponível";

        // Exibe no player
        setNowPlaying(`${radioName} — Tocando: ${music}`);
      })
      .catch(() => {
        setNowPlaying("Informação indisponível");
      });
  }, []);

  // ============================
  // 🔹 PEGAR DATA DO SERVIDOR
  // ============================

  const [loadingDate, setLoadingDate] = useState(true);
  // Estado que indica se estamos carregando a data do servidor.

  useEffect(() => {
    async function fetchServerTime() {
      setLoadingDate(true);
      // Começa o loading para indicar que está buscando a hora

      try {
        // 📡 Nova API estável usada: WorldTimeAPI
        const res = await fetch(
          "https://worldtimeapi.org/api/timezone/America/Manaus"
        );

        // Verifica se a requisição deu certo
        if (!res.ok) {
          throw new Error("Erro ao obter hora do servidor");
        }

        // Converte o conteúdo da resposta em JSON
        const data = await res.json();

        // A WorldTimeAPI retorna a hora em data.datetime
        const serverDate = new Date(data.datetime);

        // Verifica se a data é válida antes de salvar no estado
        if (!isNaN(serverDate.getTime())) {
          setDate(serverDate);
        } else {
          console.warn("⚠️ Data inválida recebida:", data);
        }
      } catch (err) {
        // Qualquer erro vem parar aqui
        console.error("❌ Erro ao buscar hora do servidor:", err);
      } finally {
        // Finaliza o loading de forma segura
        setLoadingDate(false);
      }
    }

    fetchServerTime(); // Executa quando o componente monta
  }, []);

  // Dependências vazias => executa apenas uma vez ao montar.

  return (
    <div className="relative w-full min-h-screen bg-[url('/Gov/foto7.png')] bg-cover bg-center bg-no-repeat">
      {/* Container principal: fundo com imagem, ocupa toda a altura mínima da tela */}

      {/* ====== CABEÇALHO ====== */}
      <motion.header
        className=" border-b border-gray-100 bg-[#227e6a] shadow-sm sticky top-0 z-50"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {/* Cabeçalho animado (entra de cima) com Framer Motion */}
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Wrapper centralizado com padding e espaçamento entre elementos */}
          <div className="flex items-center gap-4">
            <Image
              src="/Gov/logo-idam.png"
              alt="Logo IDAM"
              width={64}
              height={64} //
              className="object-contain"
            />
            {/* Logo usando Next/Image com largura/altura definidas */}

            <div>
              <h1 className="text-[1.10rem] leading-nonebg-[url('/Gov/foto7.png')] tracking-tight sm:text-[1.0rem] font-geomanist font-semibold text-white">
                INTRANET
              </h1>
              {/* Título principal do cabeçalho */}

              <p className="text-xs text-white font-geomanist font-normal">
                Instituto de Desenvolvimento Agropecuário e Florestal
                Sustentável do Amazonas
              </p>
              {/* Subtítulo/informação institucional */}
            </div>
          </div>

          <Link href="./login">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            ></motion.button>
            {/* Botão de login (vazio no conteúdo) com animações ao hover/tap */}
          </Link>
        </div>
      </motion.header>

      {/* ====== HERO ====== */}
      <section className=" py-12 text-center border-b bg-[#144b3f] border-gray-200">
        {/* Seção principal (hero) com cor de fundo escura */}
        {/* Logo à direita */}
        <div className="flex justify-center-safe">
          <Image
            src="/Gov/Nome-INTRANET.png"
            alt="Logo IDAM"
            width={380}
            height={380}
            className="object-contain"
          />
        </div>
        <p className="text-white mt-2 text-base md:text-base max-w-xl mx-auto font-geomanist font-normal"></p>
        {/* Parágrafo vazio — reservado para subtítulo ou descrição */}
      </section>

      {/* Lista de links rápidos (Quick Links) */}
      <div className="max-w-7xl mx-auto px-6 -mt-0 font-geomanist font-normal hover:shadow-black ">
        <div className="grid grid-cols-2 md:grid-cols-8 gap-4 p-5 hover:ring-black font-geomanist font-normal hover:[] ">
          {quickLinks.map((q, i) => (
            <motion.a
              key={q.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              href={q.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-2 p-3 hover:shadow-black bg-[#144b3f] text-white rounded-xl shadow-md hover:bg-[#1d6654] transition-all duration-300 min-h-[110px]"
            >
              {/* Cada atalho rápido é um link externo com animação */}
              {/* Ícone */}
              <div className="w-8 h-8 flex items-center justify-center">
                {q.icon}
                {/* Renderiza o ícone JSX do quickLinks */}
              </div>

              {/* Título */}
              <span className="text-base font-semibold tracking-wide text-center uppercase">
                {q.title}
                {/* Texto do título do atalho */}
              </span>
            </motion.a>
          ))}
        </div>
      </div>

      {/* CONTAINER CENTRALIZADO COMO O TÍTULO DOCUMENTOS */}
      <div className="w-full flex flex-col items-center mt-6">
        {/* TÍTULO DO PLAYER CENTRALIZADO */}
        <p className="text-[#1b3631] font-semibold mb-1 text-sm text-center w-full">
          Ouça a Rádio Agência Amazonas
        </p>

        {/* PLAYER CENTRALIZADO IGUAL AO TÍTULO DOCUMENTOS */}
        <div
          className="bg-white border border-[#d9e6df] rounded-lg flex items-center gap-3 
               p-3 shadow-sm w-full max-w-[600px]"
        >
          {/* BOTÃO PLAY/PAUSE */}
          <button
            onClick={() => {
              const audio = document.getElementById(
                "player"
              ) as HTMLAudioElement;

              // Alterna play/pause
              if (audio.paused) {
                audio.play();
                setIsPlaying(true);
              } else {
                audio.pause();
                setIsPlaying(false);
              }
            }}
            className="w-9 h-9 flex items-center justify-center bg-[#276f59] hover:bg-[#1d5947] 
                 text-white rounded-full shadow-sm transition-all duration-200"
          >
            {/* ÍCONES */}
            {isPlaying ? (
              // Ícone de pause
              <svg width="12" height="12" fill="white">
                <rect x="3" y="1" width="3" height="10" rx="1" />
                <rect x="7" y="1" width="3" height="10" rx="1" />
              </svg>
            ) : (
              // Ícone de play
              <svg width="12" height="12" fill="white">
                <polygon points="3,1 11,6 3,11" />
              </svg>
            )}
          </button>

          {/* BARRA + TEXTO */}
          <div className="flex items-center gap-3 flex-1">
            <input
              id="progress"
              type="range"
              min="0"
              max="100"
              defaultValue="0"
              className="w-full accent-[#276f59] cursor-pointer h-1.5 rounded-lg"
              onChange={(e) => {
                const audio = document.getElementById(
                  "player"
                ) as HTMLAudioElement;

                // Permite buscar manualmente com a barra
                if (audio.duration) {
                  audio.currentTime =
                    (audio.duration * Number(e.target.value)) / 100;
                }
              }}
            />

            {/* TEXTO TOCANDO AGORA VINDO DA API */}
            <span className="text-[#1b3631] text-[11px] whitespace-nowrap opacity-80">
              {nowPlaying}
            </span>
          </div>
        </div>

        {/* ÁUDIO */}
        <audio
          id="player"
          src="https://servidor29-2.brlogic.com:7486/live"
          onTimeUpdate={() => {
            const audio = document.getElementById("player") as HTMLAudioElement;
            const bar = document.getElementById("progress") as HTMLInputElement;

            // Atualiza a barra conforme o áudio toca
            if (audio.duration) {
              bar.value = String((audio.currentTime / audio.duration) * 100);
            }
          }}
        />
      </div>

      {/* ====== CONTEÚDO PRINCIPAL ====== */}
      <motion.main
        className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
      >
        {/* Main com 3 colunas (em telas grandes) e espaçamento entre áreas */}

        {/* COLUNA ESQUERDA */}

        <div className="lg:col-span-2 space-y-8">
          {/* Documentos */}

          <motion.section variants={fadeUp}>
            <h3 className="text-xl font-semibold text-[#144b3f] mb-3 text-bold">
              Documentos
            </h3>
            <div className="flex flex-wrap gap-4 bg-amber-10 font-geomanist font-normal">
              {officeApps.map((doc) => (
                <motion.a
                  key={doc.title}
                  href={doc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-300 transition w-20 text-center font-geomanist font-normal"
                >
                  <img src={doc.img} alt={doc.title} className="w-10 h-10" />
                  {/* Ícone/imagem do aplicativo Office */}
                  <span className="text-xs mt-1 text-black">{doc.title}</span>
                  {/* Nome do app */}
                </motion.a>
              ))}
            </div>
          </motion.section>

          {/* Departamentos */}
          <motion.section
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="font-geomanist font-normal "
          >
            <h3 className="text-xl font-semibold text-[#144b3f] mb-3 text-bold">
              Departamentos
            </h3>

            {/* Botões de departamentos */}
            <div className="flex flex-wrap font-bold gap-3 border-b-2 border-gray-200 mb-4">
              {(Object.keys(departamentos) as DepartmentKey[]).map((dep, i) => (
                <motion.button
                  key={dep}
                  custom={i}
                  variants={fadeUp}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDept(dep)}
                  className={`px-4 py-2 text-base font-medium transition-colors rounded-md ${
                    selectedDept === dep
                      ? "border-b-2 border-[#144b3f] text-[#144b3f]"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {dep}
                  {/* Botão que altera o estado 'selectedDept' ao ser clicado */}
                </motion.button>
              ))}
            </div>

            {/* Lista de links do departamento selecionado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {departamentos[selectedDept].map((item, i) => (
                <motion.a
                  key={item.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.05, backgroundColor: "#eaf4f1" }}
                  whileTap={{ scale: 0.97 }}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white  rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <span className="text-[#144b3f]">{item.icon}</span>
                  <span className="text-base">{item.title}</span>
                  {/* Cada item mostra ícone e título e abre em nova aba */}
                </motion.a>
              ))}
            </div>
          </motion.section>

          {/* Dicas (Notícias) */}
          <motion.section
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="font-geomanist font-normal"
          >
            <h3 className="text-xl font-semibold text-[#144b3f] mb-3">Dicas</h3>

            {fetchedNews.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                variants={{
                  visible: { transition: { staggerChildren: 0.15 } },
                }}
                initial=""
                animate="visible"
              >
                {fetchedNews.map((item, i) => (
                  <motion.a
                    key={item.id}
                    custom={i}
                    variants={fadeUp}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0px 6px 15px rgba(0,0,0,0.1)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition"
                  >
                    <motion.img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-32 object-cover"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.3 }}
                    />
                    {/* Imagem da notícia com leve zoom ao hover */}
                    <div className="p-3">
                      <p className="text-base font-semibold text-gray-800 leading-tight group-hover:text-[#144b3f] transition-colors">
                        {item.title}
                        {/* Título da dica/notícia */}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </motion.div>
            ) : (
              <motion.div
                variants={fadeUp}
                initial=""
                animate="visible"
                className="text-base text-slate-500 pt-2 text-center bg-white p-4 rounded-lg shadow-sm border border-gray-100"
              >
                Nenhuma dica disponível no momento.
                {/* Mensagem exibida quando não há notícias */}
              </motion.div>
            )}
          </motion.section>
        </div>

        {/* COLUNA DIREITA */}
        <motion.aside className="space-y-8" variants={fadeUp}>
          {/* Calendário */}
          <div className="bg-white rounded-lg p-4 shadow">
            <h4 className="font-semibold mb-3 text-base">Calendário</h4>

            {loadingDate ? (
              <p className="text-base text-gray-500 text-center">
                Carregando data...
              </p>
            ) : (
              // Enquanto 'loadingDate' for true, mostra mensagem de carregamento.
              <Calendar
                onChange={setDate}
                value={date}
                className="w-full rounded-lg border-0"
              />
              // Quando não estiver carregando, renderiza o componente Calendar com valor 'date'
            )}
          </div>

          {/* Ramais */}
          <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
            <h4 className="font-semibold text-xl text-green-800 mb-3 border-b pb-2">
              Lista de Ramais
            </h4>
            <motion.a
              href={RAMAIS_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, x: 2 }}
              className="flex items-center justify-center gap-3 p-4 mt-2 bg-[#144b3f] text-white rounded-lg font-medium hover:bg-[#227e6a] transition duration-200 shadow-md"
            >
              <File className="w-5 h-5" />
              Visualizar Lista de Ramais (PDF)
              {/* Link para abrir PDF de ramais em nova aba */}
            </motion.a>
            <p className="text-center text-xs text-slate-500 mt-2">
              O arquivo será aberto em uma nova aba.
            </p>
          </div>

          {/* Emails */}
          <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
            <h4 className="font-semibold text-xl text-green-800 mb-3 border-b pb-2">
              Lista de Emails
            </h4>
            <motion.a
              href={EMAILS_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, x: 2 }}
              className="flex itens-center justify-center gap-3 p-4 mt-2 bg-[#144b3f] text-white rounded-lg font-medium hover:bg-[#227e6a] transition duration-200 shadow-md"
            >
              <File className="w-5 h-5" />
              Visualizar Lista de Emails (PDF)
              {/* Link para abrir PDF/lista de emails */}
            </motion.a>
            <p className="text-center text-xs text-slate-500 mt-2">
              O arquivo será aberto em uma nova aba.
            </p>
          </div>

          {/* Contatos */}
          <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
            <h4 className="font-semibold text-xl text-green-800 mb-3 border-b pb-2">
              Lista de Contatos
            </h4>
            <motion.a
              href={CONTATOS_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, x: 2 }}
              className="flex items-center justify-center gap-3 p-4 mt-2 bg-[#144b3f] text-white rounded-lg font-medium hover:bg-[#227e6a] transition duration-200 shadow-md"
            >
              <File className="w-5 h-5" />
              Visualizar Lista de Contatos (PDF)
              {/* Link para abrir lista de contatos */}
            </motion.a>
            <p className="text-center text-xs text-slate-500 mt-2">
              O arquivo será aberto em uma nova aba.
            </p>
          </div>
        </motion.aside>
      </motion.main>

      {/* ====== RODAPÉ ====== */}

      <div className="w-full h-10 bg-[#227e6a]"></div>
      {/* Barra simples acima do footer para espaçamento/efeito visual */}

      <footer className="bg-[#144b3f] text-white font-geomanist font-normal h-30">
        <div className="max-w-7xl mx-auto px-6 py-1 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Conteúdo do rodapé: texto institucional e logos */}
          <div className="flex flex-col text-center md:text-left ">
            <p className="text-base leading-relaxed ">
              NÚCLEO DE TECNOLOGIA DA INFORMAÇÃO
            </p>
            <p className="text-xs text-gray-200 mt-2">
              © {new Date().getFullYear()} NTI - Todos os direitos reservados.
            </p>
            {/* Ano atual gerado dinamicamente */}
          </div>

          {/* Logos lado a lado */}
          <div className="flex justify-end space-x-4 mt-4 md:mt-3">
            <Image
              src="/Gov/logo-idam.png"
              alt="Logo IDAM"
              width={100}
              height={100}
              className="object-contain"
            />
            <Image
              src="/Gov/sepror.png"
              alt="Logo Sepror"
              width={100}
              height={100}
              className="object-contain"
            />

            <Image
              src="/Gov/logo-govam.png"
              alt="Logo Sepror"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
