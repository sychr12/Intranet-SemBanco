"use client";

import React, { JSX, useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
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
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Image from "next/image";
import Link from "next/link";

// =================================================================
// 1. TIPAGEM
// =================================================================

type ValuePiece = Date | null;
// Mantenho a tipagem de Value, mas o Calendar só usa Date | null no seu caso de uso
type Value = ValuePiece | [ValuePiece, ValuePiece];
type DepartmentKey = "PJ" | "RH" | "SGC";

type Colaborador = {
  id: number;
  nome: string;
  cargo: string;
  foto: string;
  data_nascimento: string;
};

type Registro = {
  id: number;
  nome?: string;
  cargo?: string;
  ramal?: string;
  email?: string;
  contato?: string;
  foto?: string;
};

type NewsItem = {
  id: number;
  title: string;
  img: string;
  href: string; // Adicionado 'href' para uso no link
};

// =================================================================
// 2. DADOS E CONSTANTES
// =================================================================

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

// Links rápidos
const quickLinks = [
  {
    title: "Ajuri",
    img: "/img/cubos.png",
    href: "http://www.ajuri.am.gov.br/",
  },
  {
    title: "E-Compras",
    img: "/img/carrinho-carrinho.png",
    href: "https://www.e-compras.am.gov.br/publico/",
  },
  {
    title: "Email Corporativo",
    img: "/img/correspondencia.png",
    href: "https://portal.office.com",
  },
  {
    title: "Sefaz",
    img: "/img/grafico-de-barras.png",
    href: "https://www.sefaz.am.gov.br/",
  },
  {
    title: "Siged",
    img: "/img/pasta-aberta.png",
    href: "https://sistemas.sefaz.am.gov.br/siged/login",
  },
  {
    title: "Sigatex",
    img: "/img/semente.png",
    href: "https://sigater.idam.am.gov.br/",
  },
  {
    title: "Site IDAM",
    img: "/img/globo.png",
    href: "https://www.idam.am.gov.br/",
  },
  {
    title: "Suporte TI",
    img: "/img/ferramentas.png",
    href: "https://nti.idam.am.gov.br/front/helpdesk.public.php",
  },
];

// Documentos / Office Apps
const officeApps = [
  {
    img: "/image/outlook.png",
    title: "Outlook",
    href: "https://outlook.office365.com/mail/",
  },
  {
    img: "/image/Word.png",
    title: "Word",
    href: "https://www.office.com/launch/word",
  },
  { img: "/image/excel.png", title: "Excel", href: "https://excel.office.com" },
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
    title: "Office Chat",
    href: "https://m365.cloud.microsoft/chat/?auth=2",
  },
];

// Departamentos
const departamentos: Record<
  DepartmentKey,
  { title: string; icon: JSX.Element; href: string }[]
> = {
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
  SGC: [
    {
      title: "Sistema de Gestão de Contratos (SGC)",
      icon: <FolderOpen className="w-6 h-6" />,
      href: "http://sistemas.sefaz.am.gov.br/sgc-am/login.do",
    },
  ],
};

// =================================================================
// 3. COMPONENTE PRINCIPAL (UNIFICADO)
// =================================================================

export default function Page() {
  const [openMenu, setOpenMenu] = useState(false);
  // Garante que o estado seja inicializado com Date
  const [date, setDate] = useState<Value>(new Date());
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [ramais, setRamais] = useState<Registro[]>([]);
  // Usei setEmails e setContatos com mock data para exibição (se você não tiver um banco configurado)
  const [emails, setEmails] = useState<Registro[]>([]);
  const [contatos, setContatos] = useState<Registro[]>([]);
  const [selectedDept, setSelectedDept] = useState<DepartmentKey>("PJ");

  // O estado 'news' deve ter a tipagem correta com 'href'
  const [fetchedNews, setFetchedNews] = useState<NewsItem[]>([]);

  // URL para o PDF da Lista de Ramais
  const RAMAIS_PDF_URL = "/documentos/lista_de_ramais.pdf";
  const EMAILS_PDF_URL = "/documentos/lista_de_emails.pdf";
  const CONTATOS_PDF_URL = "/documentos/lista_de_contatos.pdf";

  // Hook para carregar dados mock (simulando API/DB)
  useEffect(() => {
    const mockColaboradores: Colaborador[] = [
      {
        id: 1,
        nome: "Luiz Silva",
        cargo: "Analista de TI (Estagiário)",
        foto: "/img/user1.png",
        data_nascimento: "2004-10-09",
      },
      {
        id: 2,
        nome: "Kevin Markes",
        cargo: "Analista de TI (Estagiário)",
        foto: "/img/user2.png",
        data_nascimento: "2004-05-19",
      },
      {
        id: 3,
        nome: "Pessoa1",
        cargo: "Assistente de RH",
        foto: "/img/user2.png",
        data_nascimento: "2004-05-19",
      },
    ];
    setColaboradores(mockColaboradores);

    // Mock de dados para as listas que usam 'emails' e 'contatos'
    const mockEmails: Registro[] = [
      {
        id: 101,
        nome: "Chefe Exemplo",
        email: "chefe@idam.am.gov.br",
        cargo: "Diretor",
        foto: "/img/user-placeholder.png",
      },
      {
        id: 102,
        nome: "Secretário Geral",
        email: "sec.geral@idam.am.gov.br",
        cargo: "Secretário",
        foto: "/img/user-placeholder.png",
      },
    ];
    setEmails(mockEmails);

    const mockContatos: Registro[] = [
      {
        id: 201,
        nome: "Coord. TI",
        contato: "(92) 3333-0000",
        cargo: "Coord. TI",
        foto: "/img/user-placeholder.png",
      },
      {
        id: 202,
        nome: "Recepção",
        contato: "(92) 3333-1111",
        cargo: "Atendente",
        foto: "/img/user-placeholder.png",
      },
    ];
    setContatos(mockContatos);

    // Mock data para notícias com 'href'
    const mockNews: NewsItem[] = [
      {
        id: 1,
        title: "Como Gerenciar sua Estratégia Digital",
        img: "/img/mariciu.png",
        href: "#link-noticia-1",
      },
      {
        id: 2,
        title: "Decore seu Home Office!",
        img: "/image/mariciu.png",
        href: "#link-noticia-2",
      },
      {
        id: 3,
        title: "Treinamento Interno - TI",
        img: "/img/usuarios.png",
        href: "#link-noticia-3",
      },
    ];
    setFetchedNews(mockNews);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-white-50 to-white-100 text-slate-800">
      {/* ====== 1. CABEÇALHO ====== */}
      <motion.header
        className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo e título */}
          <div className="flex items-center gap-4">
            {/* Usando Image da Next.js para otimização */}
            <Image
              src="/img/logo-idam.png"
              alt="Logo IDAM"
              width={64} // Definição de tamanho para otimização
              height={64} // Definição de tamanho para otimização
              className="object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-green-700">INTRANET</h1>
              <p className="text-xs text-gray-500">
                Instituto de Desenvolvimento Agropecuário e Florestal
                Sustentável do Amazonas
              </p>
            </div>
          </div>

          {/* Botões de login e menu */}
          <div className="flex items-center gap-3">
            <Link href="./login">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-[#E7F6E7] hover:bg-[#C9EEC9] transition"
                title="Área do usuário"
              >
                <UserCircle className="w-7 h-7 text-green-800" />
              </motion.button>
            </Link>

            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="md:hidden p-2 rounded bg-gray-100"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* ====== 2. HERO / SEÇÃO DE DESTAQUE ====== */}
      <section className="bg-[#E7F6E7] py-12 text-center border-b border-gray-200">
        <h2 className="text-4xl font-extrabold text-green-800">
          Intranet IDAM
        </h2>
        <p className="text-gray-700 mt-2 text-sm md:text-base max-w-xl mx-auto">
          Conectando o desenvolvimento sustentável do Amazonas
        </p>
      </section>

      {/* ====== 3. LINKS RÁPIDOS ====== */}
      <section className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-8 gap-4">
          {quickLinks.map((q, i) => (
            // Uso de motion.a para envolver o clique e a animação
            <motion.a
              key={q.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              href={q.href}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer bg-white rounded-xl p-4 shadow-md flex flex-col items-center gap-2 hover:shadow-lg transition"
            >
              <Image
                src={q.img}
                alt={q.title}
                width={48}
                height={48}
                className="object-contain"
              />
              <div className="text-sm font-semibold text-slate-700 text-center">
                {q.title}
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* ====== 4. CONTEÚDO PRINCIPAL (Layout unificado) ====== */}
      <motion.main
        className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2 } },
        }}
      >
        {/* Coluna esquerda – Documentos e Departamentos */}
        <div className="lg:col-span-2 space-y-8">
          {/* Documentos */}
          <motion.section variants={fadeUp}>
            <h3 className="text-xl font-semibold text-green-800 mb-3">
              Documentos
            </h3>
            <div className="flex flex-wrap gap-4">
              {officeApps.map((doc, i) => (
                <motion.a
                  key={i}
                  href={doc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center p-2 rounded-lg hover:bg-[#E7F6E7] transition w-20 text-center"
                >
                  {/* Usando <img> nativo para ícones menores que não precisam de otimização pesada */}
                  <img src={doc.img} alt={doc.title} className="w-10 h-10" />
                  <span className="text-xs mt-1 text-black">{doc.title}</span>
                </motion.a>
              ))}
            </div>
          </motion.section>

          {/* Departamentos */}
          <motion.section variants={fadeUp}>
            <h3 className="text-xl font-semibold text-green-800 mb-3">
              Departamentos
            </h3>
            {/* Abas */}
            <div className="flex flex-wrap gap-3 border-b-2 border-gray-200 mb-4">
              {(Object.keys(departamentos) as DepartmentKey[]).map((dep) => (
                <button
                  key={dep}
                  onClick={() => setSelectedDept(dep)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    selectedDept === dep
                      ? "border-b-2 border-green-700 text-green-700"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {dep}
                </button>
              ))}
            </div>
            {/* Conteúdo das Abas */}
            <motion.div
              key={selectedDept}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {departamentos[selectedDept].map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  {/* Remoção do React.cloneElement para simplificar, a classe está no ícone */}
                  <span className="text-green-700">{item.icon}</span>
                  <span className="text-sm font-medium">{item.title}</span>
                </a>
              ))}
            </motion.div>
          </motion.section>

          {/* O que há de novo (Notícias) */}
          <motion.section variants={fadeUp}>
            <h3 className="text-xl font-semibold text-green-800 mb-3">
              O que há de novo?
            </h3>

            {/* Lógica para Carregamento, Estado Vazio e Exibição de Dados */}
            {fetchedNews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {fetchedNews.map((item) => (
                  <a
                    href={item.href}
                    key={item.id}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="relative w-full h-32">
                      {/* Corrigido para usar Next/Image corretamente com layout="fill" */}
                      <Image
                        src={item.img}
                        alt={item.title}
                        fill={true}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold text-gray-800 leading-tight">
                        {item.title}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-500 pt-2 text-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                Nenhuma notícia nova encontrada ou carregando dados...
              </div>
            )}
          </motion.section>
        </div>

        {/* Coluna direita – Calendário e Listas */}
        <motion.aside className="space-y-8" variants={fadeUp}>
          {/* Calendário */}
          <div className="bg-white rounded-lg p-4 shadow">
            <h4 className="font-semibold mb-3">Calendário</h4>
            <Calendar
              onChange={setDate}
              value={date}
              className="w-full rounded-lg border-0 [&_.react-calendar__tile--active]:bg-green-700 [&_.react-calendar__tile--active]:text-white"
            />
          </div>

          {/* Lista de Ramais (Link para PDF) */}
          <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
            <h4 className="font-semibold text-green-800 mb-3 border-b pb-2">
              Ramais 📞
            </h4>
            {/* Correção da sintaxe: whileHover deve estar na motion.a, não solta */}
            <motion.a
              href={RAMAIS_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, x: 2 }}
              className="flex items-center justify-center gap-3 p-4 mt-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition duration-200 shadow-md"
            >
              <File className="w-5 h-5" />
              Visualizar Lista de Ramais (PDF)
            </motion.a>
            <p className="text-center text-xs text-slate-500 mt-2">
              O arquivo será aberto em uma nova aba.
            </p>
          </div>

          {/* Lista de Emails (Link para PDF) */}
          <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
            <h4 className="font-semibold text-green-800 mb-3 border-b pb-2">
              Lista de Emails 📧
            </h4>
            <motion.a
              href={EMAILS_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, x: 2 }}
              className="flex items-center justify-center gap-3 p-4 mt-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition duration-200 shadow-md"
            >
              <File className="w-5 h-5" />
              Visualizar Lista de Emails (PDF)
            </motion.a>
            <p className="text-center text-xs text-slate-500 mt-2">
              O arquivo será aberto em uma nova aba.
            </p>
          </div>

          {/* Lista de Contatos (Link para PDF) */}
          <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
            <h4 className="font-semibold text-green-800 mb-3 border-b pb-2">
              Lista de Contatos 📱
            </h4>
            <motion.a
              href={CONTATOS_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, x: 2 }}
              className="flex items-center justify-center gap-3 p-4 mt-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition duration-200 shadow-md"
            >
              <File className="w-5 h-5" />
              Visualizar Lista de Contatos (PDF)
            </motion.a>
            <p className="text-center text-xs text-slate-500 mt-2">
              O arquivo será aberto em uma nova aba.
            </p>
          </div>
        </motion.aside>
      </motion.main>

      {/* ========================================================== */}
      {/* RODAPÉ */}
      {/* ========================================================== */}
      <footer className="bg-green-900 text-white mt-10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo e Nome da Instituição */}
          <div className="flex items-center gap-3">
            <Image
              src="/img/logo-idam.png"
              alt="Logo IDAM Branco"
              width={40}
              height={40}
              className="object-contain"
            />
            <div className="text-sm font-semibold">INTRANET IDAM</div>
          </div>

          {/* Informações de Copyright e Localização */}
          <div className="text-center md:text-right">
            <p className="text-xs text-green-300">
              Instituto de Desenvolvimento Agropecuário e Florestal Sustentável
              do Amazonas
            </p>
            <p className="text-xs mt-1 text-green-200">
              © {new Date().getFullYear()} Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
