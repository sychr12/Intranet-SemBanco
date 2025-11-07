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
import "../app/calendar.css";
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

interface NewsItem {
  id: number;
  title: string;
  img: string; // O tipo 'string' é perfeito para URLs completas
  href: string;
}

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
    icon: "/icon/cubos.ico",
    href: "http://www.ajuri.am.gov.br/",
  },
  {
    title: "E-Compras",
    icon: "/icon/grafico-de-barras.ico",
    href: "https://www.e-compras.am.gov.br/publico/",
  },
  {
    title: "Email Corporativo",
    icon: "/icon/correspondencia.ico",
    href: "https://portal.office.com",
  },
  {
    title: "Sefaz",
    icon: "/icon/grafico-de-barras.ico",
    href: "https://www.sefaz.am.gov.br/",
  },
  {
    title: "Siged",
    icon: "/icon/pasta-aberta.ico",
    href: "https://sistemas.sefaz.am.gov.br/siged/login",
  },
  {
    title: "Sigatex",
    icon: "/icon/semente.ico",
    href: "https://sigater.idam.am.gov.br/",
  },
  {
    title: "Site IDAM",
    icon: "/icon/globo.ico",
    href: "https://www.idam.am.gov.br/",
  },
  {
    title: "Suporte TI",
    icon: "/icon/ferramentas.ico",
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
// 3. COMPONENTE PRINCIPAL
// =================================================================

export default function Page() {
  const [date, setDate] = useState<Value>(new Date());
  const [selectedDept, setSelectedDept] = useState<DepartmentKey>("PJ");
  const [fetchedNews, setFetchedNews] = useState<NewsItem[]>([]);

  // PDFs
  const RAMAIS_PDF_URL =
    "https://office365prodam-my.sharepoint.com/:x:/g/personal/nti_idam_am_gov_br/EfqRFyXpB7dJme1xxhXjOYMBTJmkM7EoTfn_yk3wBfZuMQ?e=wK1SQ7";
  const EMAILS_PDF_URL =
    "https://docs.google.com/document/d/1Kil4NcZkgZUqnPt5o687z3eBD0W6YNfVXsn2J-t3MSQ/edit?pli=1&tab=t.0";
  const CONTATOS_PDF_URL = "";

  // Mock de notícias
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
  }, []);

  // ============================
  // 🔹 PEGAR DATA DO SERVIDOR
  // ============================

  const [loadingDate, setLoadingDate] = useState(true);

  useEffect(() => {
    async function fetchServerTime() {
      setLoadingDate(true);
      try {
        // 🔧 Você pode trocar a URL pelo seu servidor:
        // Exemplo: http://200.160.7.186/api/time
        const res = await fetch(
          "https://worldtimeapi.org/api/timezone/America/Manaus"
        );

        if (!res.ok) throw new Error("Erro ao obter hora do servidor");

        const data = await res.json();

        // A API retorna algo assim:
        // {
        //   "datetime": "2025-11-04T12:34:56.789012-04:00",
        //   ...
        // }

        const serverDate = new Date(data.datetime);
        if (!isNaN(serverDate.getTime())) {
          setDate(serverDate);
        } else {
          console.warn("⚠️ Data inválida recebida:", data);
        }
      } catch (err) {
        console.error("❌ Erro ao buscar hora do servidor:", err);
      } finally {
        setLoadingDate(false);
      }
    }

    fetchServerTime();
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[url('/image/foto2.png')] bg-cover bg-center bg-no-repeat">
      {/* ====== CABEÇALHO ====== */}
      <motion.header
        className=" border-b border-gray-100 bg-[#227e6a] shadow-sm sticky top-0 z-50"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/img/logo-idam.png"
              alt="Logo IDAM"
              width={64}
              height={64}
              className="object-contain"
            />
            <div>
              <h1 className="text-[1.10rem] leading-none tracking-tight sm:text-[1.0rem] font-geomanist font-semibold text-white">
                INTRANET
              </h1>
              <p className="text-xs text-white font-geomanist font-normal">
                Instituto de Desenvolvimento Agropecuário e Florestal
                Sustentável do Amazonas
              </p>
            </div>
          </div>

          <Link href="./login">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            ></motion.button>
          </Link>
        </div>
      </motion.header>

      {/* ====== HERO ====== */}
      <section className=" py-12 text-center border-b bg-[#144b3f] border-gray-200">
        <h2 className="text-4xl  text-white font-geomanist font-semibold">
          Intranet IDAM
        </h2>
        <p className="text-white mt-2 text-sm md:text-base max-w-xl mx-auto font-geomanist font-normal">
          Acesse os principais links de serviços da instituição
        </p>
      </section>

      <section className="max-w-max mx-auto px-10 -mt--10 font-geomanist font-normal">
        <div className="grid grid-cols-1 md:grid-cols-8 gap-4 p-10">
          {quickLinks.map((q) => (
            <motion.a
              key={q.title}
              href={q.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-pointer bg-white rounded-xl p-4 shadow-md flex flex-col items-center gap-2 hover:bg-gray-100 hover:shadow-xl transition"
            >
        {/* Ícone com filtro hover */}
        <div className="icon-group w-12 h-12">
          <Image
            src={q.icon} // ex: "/img/cubos.ico"
            alt={q.title}
            width={48}
            height={48}
            className="transition duration-300 group-hover:filter-green"
          />
        </div>

              {/* Texto */}
              <span className="text-sm font-semibold text-slate-700 text-center group-hover:text-[#d0f8d7] transition-colors">
                {q.title}
              </span>
            </motion.a>
          ))}
        </div>
      </section>

      {/* ====== CONTEÚDO PRINCIPAL ====== */}
      <motion.main
        className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
      >
        {/* COLUNA ESQUERDA */}
        <div className="lg:col-span-2 space-y-8">
          {/* Documentos */}
          <motion.section variants={fadeUp}>
            <h3 className="text-xl font-semibold text-[#144b3f] mb-3">
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
                  <span className="text-xs mt-1 text-black">{doc.title}</span>
                </motion.a>
              ))}
            </div>
          </motion.section>

          {/* Departamentos */}
          <motion.section
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="font-geomanist font-normal"
          >
            <h3 className="text-xl text-[#144b3f] mb-3">Departamentos</h3>

            {/* Botões de departamentos */}
            <div className="flex flex-wrap gap-3 border-b-2 border-gray-200 mb-4">
              {(Object.keys(departamentos) as DepartmentKey[]).map((dep, i) => (
                <motion.button
                  key={dep}
                  custom={i}
                  variants={fadeUp}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDept(dep)}
                  className={`px-4 py-2 text-sm font-medium transition-colors rounded-md ${
                    selectedDept === dep
                      ? "border-b-2 border-[#144b3f] text-[#144b3f]"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {dep}
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
                  <span className="text-sm">{item.title}</span>
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
                    <div className="p-3">
                      <p className="text-sm font-semibold text-gray-800 leading-tight group-hover:text-[#144b3f] transition-colors">
                        {item.title}
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
                className="text-sm text-slate-500 pt-2 text-center bg-white p-4 rounded-lg shadow-sm border border-gray-100"
              >
                Nenhuma dica disponível no momento.
              </motion.div>
            )}
          </motion.section>
        </div>

        {/* COLUNA DIREITA */}
        <motion.aside className="space-y-8" variants={fadeUp}>
          {/* Calendário */}
          <div className="bg-white rounded-lg p-4 shadow">
            <h4 className="font-semibold mb-3">Calendário</h4>

            {loadingDate ? (
              <p className="text-sm text-gray-500 text-center">
                Carregando data...
              </p>
            ) : (
              <Calendar
                onChange={setDate}
                value={date}
                className="w-full rounded-lg border-0"
              />
            )}
          </div>

          {/* Ramais */}
          <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
            <h4 className="font-semibold text-green-800 mb-3 border-b pb-2">
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
            </motion.a>
            <p className="text-center text-xs text-slate-500 mt-2">
              O arquivo será aberto em uma nova aba.
            </p>
          </div>

          {/* Emails */}
          <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
            <h4 className="font-semibold text-green-800 mb-3 border-b pb-2">
              Lista de Emails
            </h4>
            <motion.a
              href={EMAILS_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, x: 2 }}
              className="flex items-center justify-center gap-3 p-4 mt-2 bg-[#144b3f] text-white rounded-lg font-medium hover:bg-[#227e6a] transition duration-200 shadow-md"
            >
              <File className="w-5 h-5" />
              Visualizar Lista de Emails (PDF)
            </motion.a>
            <p className="text-center text-xs text-slate-500 mt-2">
              O arquivo será aberto em uma nova aba.
            </p>
          </div>

          {/* Contatos */}
          <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
            <h4 className="font-semibold text-green-800 mb-3 border-b pb-2">
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
            </motion.a>
            <p className="text-center text-xs text-slate-500 mt-2">
              O arquivo será aberto em uma nova aba.
            </p>
          </div>
        </motion.aside>
      </motion.main>

      {/* ====== RODAPÉ ====== */}
      <footer className="bg-[#144b3f] text-white mt-10 font-geomanist font-normal">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
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
          <div className="text-center md:text-right">
            <p className="text-xs text-white font-geomanist font-normal ">
              Instituto de Desenvolvimento Agropecuário e Florestal Sustentável
              do Amazonas
            </p>
            <p className="text-xs mt-1 text-white font-geomanist font-normal">
              © {new Date().getFullYear()} NTI - Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
