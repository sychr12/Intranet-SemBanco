"use client";

import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Image from "next/image";
import Link from "next/link";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

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

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

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

const news = [
  { title: "Como Gerenciar sua Estratégia Digital", img: "/img/mariciu.png" },
  { title: "Decore seu Home Office!", img: "/image/mariciu.png" },
  { title: "Treinamento Interno - TI", img: "/img/usuarios.png" },
];

export default function Page() {
  const [openMenu, setOpenMenu] = useState(false);
  const [date, setDate] = useState<Value>(new Date());
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [ramais, setRamais] = useState<Registro[]>([]);
  const [emails, setEmails] = useState<Registro[]>([]);
  const [contatos, setContatos] = useState<Registro[]>([]);
  const [selectedDept, setSelectedDept] = useState<"PJ" | "RH" | "SGC">("PJ");

  const departamentos = {
    PJ: [
      {
        title: "Diário Oficial",
        icon: <Newspaper className="w-8 h-8 text-black" />,
        href: "https://diario.imprensaoficial.am.gov.br/",
      },
      {
        title: "Diário MP AM",
        icon: <FileText className="w-8 h-8 text-black" />,
        href: "https://diario.mpam.mp.br/pages/home.jsf",
      },
      {
        title: "Doe TCE",
        icon: <ClipboardList className="w-8 h-8 text-black" />,
        href: "https://doe.tce.am.gov.br/",
      },
      {
        title: "Comunica PJE",
        icon: <Gavel className="w-8 h-8 text-black" />,
        href: "https://comunica.pje.jus.br/",
      },
      {
        title: "DEJT",
        icon: <FileText className="w-8 h-8 text-black" />,
        href: "https://dejt.jt.jus.br/dejt/",
      },
      {
        title: "Imprensa Nacional",
        icon: <Newspaper className="w-8 h-8 text-black" />,
        href: "https://www.gov.br/imprensanacional/pt-br",
      },
      {
        title: "Diário da Justiça Eletrônico (SAJ)",
        icon: <Scale className="w-8 h-8 text-black" />,
        href: "https://consultasaj.tjam.jus.br/cdje/index.do",
      },
      {
        title: "DEC TCE",
        icon: <FileSearch className="w-8 h-8 text-black" />,
        href: "https://dec.tce.am.gov.br/dec/login.jsf",
      },
      {
        title: "Consulta e-SAJ",
        icon: <FileSearch className="w-8 h-8 text-black" />,
        href: "https://consultasaj.tjam.jus.br/esaj/portal.do?servico=740000",
      },
      {
        title: "PROJUDI",
        icon: <Gavel className="w-8 h-8 text-black" />,
        href: "https://projudi.tjam.jus.br/projudi/",
      },
      {
        title: "PJE TRT11",
        icon: <Scale className="w-8 h-8 text-black" />,
        href: "https://pje.trt11.jus.br/primeirograu/login.seam",
      },
    ],
    RH: [
      {
        title: "Prodam RH",
        icon: <Users2 className="w-8 h-8 text-black" />,
        href: "https://prodamrh.prodam.am.gov.br/",
      },
      {
        title: "SEAD",
        icon: <Building2 className="w-8 h-8 text-black" />,
        href: "http://servicos.sead.am.gov.br/passivosam/auth/login",
      },
      {
        title: "SISPREV",
        icon: <ClipboardList className="w-8 h-8 text-black" />,
        href: "https://www.portaldosegurado.am.gov.br/conectado.php",
      },
      {
        title: "CIEE",
        icon: <Users2 className="w-8 h-8 text-black" />,
        href: "https://web.ciee.org.br/empresa/relatorios/estudantes-contratados",
      },
      {
        title: "FAP",
        icon: <FileSpreadsheet className="w-8 h-8 text-black" />,
        href: "https://fap.dataprev.gov.br/consultar-fap",
      },
      {
        title: "E-SOCIAL",
        icon: <Briefcase className="w-8 h-8 text-black" />,
        href: "https://www.esocial.gov.br/portal/Assinadoc",
      },
      {
        title: "IOA NEWS",
        icon: <Newspaper className="w-8 h-8 text-black" />,
        href: "https://ioanews.imprensaoficial.am.gov.br/",
      },
    ],
    SGC: [
      {
        title: "Sistema de Gestão de Contratos (SGC)",
        icon: <FolderOpen className="w-8 h-8 text-black" />,
        href: "http://sistemas.sefaz.am.gov.br/sgc-am/login.do",
      },
    ],
  };

  useEffect(() => {
    const mockData: Colaborador[] = [
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
    setColaboradores(mockData);
  }, []);

  useEffect(() => {
    async function fetchDados() {
      try {
        const res = await fetch("/api/dados");
        const json = await res.json();
        setRamais(json.ramais || []);
        setEmails(json.emails || []);
        setContatos(json.contatos || []);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    }

    fetchDados();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-white-50 to-white-100 text-slate-800">
      {/* Cabeçalho */}
      <motion.header
        className="bg-white border-b shadow-sm relative z-50"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-4"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src="./img/logo-idam.png"
              alt="Logo IDAM"
              className="w-16 h-16 object-contain"
            />
            <div>
              <div className="text-xl font-bold text-green-800">INTRANET</div>
              <div className="text-xs text-slate-500">Bem-vindo à Intranet</div>
            </div>
          </motion.div>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6 font-medium text-slate-700">
              <a href="#" className="hover:text-green-700 transition">
                Sobre
              </a>
              <a href="#" className="hover:text-green-700 transition">
                Contato
              </a>
            </nav>

            <Link href="./login">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-green-100 hover:bg-green-200 transition"
                title="Configurações / Login"
              >
                <UserCircle className="w-7 h-7 text-green-800" />
              </motion.button>
            </Link>

            <motion.button
              onClick={() => setOpenMenu(!openMenu)}
              className="md:hidden p-2 rounded bg-slate-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu size={20} />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* === Hero === */}
      <motion.section
        className="bg-[url('/img/hero-leaves.jpg')] bg-cover bg-center h-52 flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            className="text-5xl font-extrabold text-green-800 drop-shadow-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Intranet IDAM
          </motion.h2>
        </div>
      </motion.section>

      {/* Links rápidos */}
      <section className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-8 gap-4">
          {quickLinks.map((q, i) => (
            <motion.div
              key={q.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open(q.href, "_blank")}
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
            </motion.div>
          ))}
        </div>
      </section>

      {/* Conteúdo principal */}
      <motion.main
        className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2 } },
        }}
      >
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-10">
          {/* Documentos */}
          <motion.section variants={fadeUp} custom={0}>
            <h3 className="text-2xl font-bold text-green-800 mb-6">
              Documentos
            </h3>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {officeApps.map((d, i) => (
                <motion.a
                  key={d.title}
                  href={d.href}
                  target="_blank"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  variants={fadeUp}
                  custom={i}
                  className="rounded-lg p-4 bg-white shadow hover:bg-green-100 flex flex-col items-center gap-2"
                >
                  <Image src={d.img} alt={d.title} width={48} height={48} />
                  <span className="font-medium text-green-700">{d.title}</span>
                </motion.a>
              ))}
            </div>
          </motion.section>

          {/* Departamentos */}
          <motion.section variants={fadeUp} custom={0.5} className="mt-12">
            <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">
              Departamentos
            </h3>

            <div className="flex justify-center mb-8 space-x-3">
              {["PJ", "RH", "SGC"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedDept(tab as "PJ" | "RH" | "SGC")}
                  className={`px-6 py-2 rounded-full border font-medium transition-all ${
                    selectedDept === tab
                      ? "bg-green-700 text-white border-green-700"
                      : "bg-white text-green-700 border-green-300 hover:bg-green-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {departamentos[selectedDept].map((item, i) => (
                <motion.a
                  key={i}
                  href={item.href}
                  target="_blank"
                  className="rounded-lg p-4 bg-white shadow flex flex-col items-center gap-2 hover:bg-green-50 transition"
                  whileHover={{ scale: 1.05 }}
                >
                  {item.icon}
                  <span className="font-medium text-black text-center">
                    {item.title}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.section>

          {/* Notícias */}
          <motion.section variants={fadeUp} custom={2}>
            <h3 className="text-2xl font-bold text-green-800 mb-4">
              O que há de novo?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {news.map((n, i) => (
                <motion.article
                  key={n.title}
                  className="rounded-lg overflow-hidden shadow bg-white"
                  variants={fadeUp}
                  custom={i}
                  whileHover={{ scale: 1.03 }}
                >
                  <Image
                    src={n.img}
                    alt={n.title}
                    width={400}
                    height={160}
                    className="w-full object-cover"
                  />
                  <div className="p-4">
                    <h4 className="font-semibold text-slate-800">{n.title}</h4>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.section>
        </div>
        {/* Sidebar */}
        <motion.aside
          className="space-y-6 lg:sticky lg:top-20 h-fit"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Calendário */}
          <motion.div
            className="bg-white rounded-lg p-4 shadow"
            variants={fadeUp}
            custom={4}
          >
            <h4 className="font-semibold mb-3">Calendário</h4>
            <Calendar
              onChange={setDate}
              value={date}
              className="w-full rounded-lg [&_.react-calendar__tile--active]:bg-green-700 [&_.react-calendar__tile--active]:text-white"
            />
          </motion.div>

          {/* Lista de Ramais */}
          <motion.div
            className="bg-white rounded-lg p-4 shadow"
            variants={fadeUp}
            custom={6}
          >
            <h4 className="font-semibold text-green-800 mb-3">
              Lista de Ramais
            </h4>
            {ramais.length > 0 ? (
              <ul className="space-y-2">
                {ramais.map((a) => (
                  <motion.li
                    key={a.id}
                    className="flex items-center gap-3 p-2 hover:bg-green-50 rounded-md"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Image
                      src={a.foto || ""}
                      alt={a.nome || ""}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium">{a.nome}</div>
                      <div className="text-xs text-slate-500">{a.cargo}</div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-slate-500">
                Nenhum ramal cadastrado
              </div>
            )}
          </motion.div>

          {/* Lista de Emails */}
          <motion.div
            className="bg-white rounded-lg p-4 shadow"
            variants={fadeUp}
            custom={6}
          >
            <h4 className="font-semibold text-green-800 mb-3">
              Lista de Emails
            </h4>
            {emails.length > 0 ? (
              <ul className="space-y-2">
                {emails.map((a) => (
                  <motion.li
                    key={a.id}
                    className="flex items-center gap-3 p-2 hover:bg-green-50 rounded-md"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Image
                      src={a.foto || ""}
                      alt={a.nome || ""}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium">{a.nome}</div>
                      <div className="text-xs text-slate-500">{a.cargo}</div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-slate-500">
                Nenhum e-mail cadastrado
              </div>
            )}
          </motion.div>

          {/* Lista de Contatos */}
          <motion.div
            className="bg-white rounded-lg p-4 shadow"
            variants={fadeUp}
            custom={6}
          >
            <h4 className="font-semibold text-green-800 mb-3">
              Lista de Contatos
            </h4>
            {contatos.length > 0 ? (
              <ul className="space-y-2">
                {contatos.map((a) => (
                  <motion.li
                    key={a.id}
                    className="flex items-center gap-3 p-2 hover:bg-green-50 rounded-md"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Image
                      src={a.foto || ""}
                      alt={a.nome || ""}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium">{a.nome}</div>
                      <div className="text-xs text-slate-500">{a.cargo}</div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-slate-500">
                Nenhum contato cadastrado
              </div>
            )}
          </motion.div>
        </motion.aside>
      </motion.main>

      {/* Rodapé minimalista: preto, verde e cinza */}
      <footer className="bg-neutral-950 text-slate-300 mt-6 rounded-t-lg border-t border-green-700/30 shadow-inner">
        <div className="max-w-6xl mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
          {/* INTRANET */}
          <div>
            <h4 className="font-semibold text-base text-green-400 tracking-wide">
              INTRANET
            </h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Comunicação e colaboração interna.
            </p>
          </div>

          {/* Colaboradores */}
          <motion.div
            className="bg-neutral-900 rounded-md p-2 border border-green-800/40"
            variants={fadeUp}
            custom={2}
          >
            <h4 className="font-medium text-green-400 mb-2 text-xs uppercase">
              Colaboradores
            </h4>
            <ul className="space-y-1">
              {colaboradores.map((c) => (
                <motion.li
                  key={c.id}
                  className="flex items-center gap-2 p-1 hover:bg-green-950/40 rounded-md transition-all duration-150"
                  whileHover={{ scale: 1.02 }}
                >
                  <Image
                    src={c.foto}
                    alt={c.nome}
                    width={26}
                    height={26}
                    className="rounded-full object-cover border border-green-700/40"
                  />
                  <div>
                    <div className="font-medium text-[11px] text-slate-200">
                      {c.nome}
                    </div>
                    <div className="text-[10px] text-slate-500">{c.cargo}</div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contato */}
          <div>
            <h5 className="font-medium text-green-400 text-xs uppercase">
              Contato
            </h5>
            <p className="text-[11px] text-slate-400 mt-1">ti@empresa.com.br</p>
          </div>
        </div>

        <div className="border-t border-green-800/40 mt-2">
          <div className="max-w-6xl mx-auto px-4 py-2 text-[10px] text-slate-500 flex flex-col md:flex-row items-center justify-between">
            <span>
              © {new Date().getFullYear()} Intranet — Todos os direitos
              reservados.
            </span>
            <span className="mt-1 md:mt-0 text-green-600">
              Feito com React ⚡
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
