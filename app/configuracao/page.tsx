"use client";

import React, { useState } from "react";
import { Upload, FileEdit, Bell, X, Link } from "lucide-react";

type UploadResult = { ok: boolean; message?: string };

function Card({
  title,
  icon,
  onClick,
}: {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-72 h-44 rounded-xl border border-gray-200 bg-white hover:bg-gray-500/5 transition 
                flex flex-col items-center justify-center text-gray-800 shadow-sm hover:shadow-md"
    >
      <div className="text-3xl text-slate-600 mb-2">{icon}</div>
      <div className="text-lg font-semibold tracking-wide">{title}</div>
    </button>
  );
}

export default function MaterialCards() {
  const [openUpload, setOpenUpload] = useState(false);
  const [openPdfEditor, setOpenPdfEditor] = useState(false);
  const [openPopap, setOpenPopap] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const [materiaTitulo, setMateriaTitulo] = useState("");
  const [materiaDescricao, setMateriaDescricao] = useState("");
  const [materiaLink, setMateriaLink] = useState("");
  const [materiaAgendamento, setMateriaAgendamento] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfTitle, setPdfTitle] = useState("");
  const [pdfDescription, setPdfDescription] = useState("");
  const [pdfAgendamento, setPdfAgendamento] = useState("");
  const [pdfUploading, setPdfUploading] = useState(false);
  const [pdfMessage, setPdfMessage] = useState<string | null>(null);

  const [avisoTitulo, setAvisoTitulo] = useState("");
  const [avisoTexto, setAvisoTexto] = useState("");
  const [avisoImagem, setAvisoImagem] = useState<File | null>(null);
  const [avisoAgendamento, setAvisoAgendamento] = useState("");
  const [sendingAviso, setSendingAviso] = useState(false);
  const [avisoMessage, setAvisoMessage] = useState<string | null>(null);

  const resetMaterialsState = () => {
    setFiles([]);
    setMateriaTitulo("");
    setMateriaDescricao("");
    setMateriaAgendamento("");
    setMateriaLink("");
  };

  const resetPdfState = () => {
    setPdfFile(null);
    setPdfTitle("");
    setPdfDescription("");
    setPdfAgendamento("");
  };

  const resetAvisoState = () => {
    setAvisoTitulo("");
    setAvisoTexto("");
    setAvisoImagem(null);
    setAvisoAgendamento("");
  };

  function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
    setUploadMessage(null);
  }

  async function sendMaterials() {
    if (files.length === 0 && !materiaLink.trim()) {
      setUploadMessage("Selecione ao menos um arquivo, PDF ou insira um link externo.");
      return;
    }
    setUploading(true);
    setUploadMessage(null);

    try {
      const fd = new FormData();
      fd.append("titulo", materiaTitulo);
      fd.append("descricao", materiaDescricao);
      fd.append("agendamento", materiaAgendamento);
      fd.append("link", materiaLink);

      files.forEach((f) => fd.append("files", f));

      const res = await fetch("/data/", {
        method: "POST",
        body: fd,
      });

      const data: UploadResult = await res.json();
      if (data.ok) {
        setUploadMessage("Material enviado/agendado com sucesso.");
        resetMaterialsState();
        setTimeout(() => setOpenUpload(false), 2000);
      } else {
        setUploadMessage(data.message || "Erro ao enviar.");
      }
    } catch (err) {
      console.error(err);
      setUploadMessage("Erro ao conectar com o servidor.");
    } finally {
      setUploading(false);
    }
  }

  function handlePdfSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0];
    if (f && f.type === "application/pdf") {
      setPdfFile(f);
      setPdfTitle(f.name.replace(/\.pdf$/i, ""));
      setPdfMessage(null);
    } else {
      setPdfFile(null);
      setPdfMessage("Selecione um PDF válido.");
    }
  }

  async function sendPdf() {
    if (!pdfFile) {
      setPdfMessage("Selecione um PDF antes de enviar.");
      return;
    }
    setPdfUploading(true);
    setPdfMessage(null);

    try {
      const fd = new FormData();
      fd.append("title", pdfTitle);
      fd.append("description", pdfDescription);
      fd.append("file", pdfFile);
      fd.append("agendamento", pdfAgendamento);

      const res = await fetch("/data/pdfs", {
        method: "POST",
        body: fd,
      });

      const data: UploadResult = await res.json();
      if (data.ok) {
        setPdfMessage("PDF enviado e agendado com sucesso.");
        resetPdfState();
        setTimeout(() => setOpenPdfEditor(false), 2000);
      } else {
        setPdfMessage(data.message || "Erro ao enviar PDF.");
      }
    } catch (err) {
      console.error(err);
      setPdfMessage("Erro ao conectar com o servidor.");
    } finally {
      setPdfUploading(false);
    }
  }

  async function sendAviso() {
    if (!avisoTitulo.trim() || !avisoTexto.trim()) {
      setAvisoMessage("Preencha título e texto.");
      return;
    }

    setSendingAviso(true);
    setAvisoMessage(null);

    try {
      const fd = new FormData();
      fd.append("titulo", avisoTitulo);
      fd.append("texto", avisoTexto);
      fd.append("agendamento", avisoAgendamento);
      if (avisoImagem) fd.append("imagem", avisoImagem);

      const res = await fetch("/data/avisos.json", { method: "POST", body: fd });
      const data: UploadResult = await res.json();

      if (data.ok) {
        setAvisoMessage("Aviso enviado e agendado com sucesso!");
        resetAvisoState();
        setTimeout(() => setOpenPopap(false), 2000);
      } else {
        setAvisoMessage(data.message || "Erro ao enviar aviso.");
      }
    } catch {
      setAvisoMessage("Erro ao conectar com o servidor.");
    } finally {
      setSendingAviso(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center gap-10 p-10 bg-gray-100">
      <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
        Gestão de Materiais
      </h2>

      <div className="flex flex-wrap justify-center gap-8">
        <Card title="Enviar Matérias" icon={<Upload className="w-12 h-12 text-slate-700" />} onClick={() => { resetMaterialsState(); setOpenUpload(true); }} />
        <Card title="Editar & Enviar PDF" icon={<FileEdit className="w-12 h-12 text-slate-700" />} onClick={() => { resetPdfState(); setOpenPdfEditor(true); }} />
        <Card title="Popap de Aviso" icon={<Bell className="w-12 h-12 text-slate-700" />} onClick={() => { resetAvisoState(); setOpenPopap(true); }} />
      </div>

      {/* MODAL DE UPLOAD DE MATÉRIAS */}
      {openUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="text-xl font-semibold">Mandar Matérias (Link e/ou PDF e/ou Arquivos)</h3>
              <button onClick={() => setOpenUpload(false)} className="text-gray-600 hover:text-gray-800"><X className="w-5 h-5"/></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Título</label>
                <input 
                  value={materiaTitulo} 
                  onChange={(e) => setMateriaTitulo(e.target.value)} 
                  className="mt-1 block w-full border rounded-md p-2" 
                  placeholder="Título da matéria" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea 
                  value={materiaDescricao} 
                  onChange={(e) => setMateriaDescricao(e.target.value)} 
                  className="mt-1 block w-full border rounded-md p-2" 
                  placeholder="Breve descrição" 
                />
              </div>

              {/* LINK EXTERNO */}
              <div>
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <Link className="w-4 h-4 mr-1"/> Link Externo (Opcional)
                </label>
                <input 
                  type="url" 
                  value={materiaLink} 
                  onChange={(e) => setMateriaLink(e.target.value)} 
                  className="mt-1 block w-full border rounded-md p-2" 
                  placeholder="https://www.exemplo.com/material"
                />
              </div>

              {/* PDF OPCIONAL */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Arquivo PDF (Opcional)</label>
                <input 
                  type="file" 
                  accept="application/pdf" 
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f && f.type === "application/pdf") {
                      setFiles([f]);
                      setUploadMessage(null);
                    } else if (f) {
                      setUploadMessage("Por favor, selecione um PDF válido.");
                    }
                  }} 
                  className="mt-2"
                />
                {files.length > 0 && files[0].type === "application/pdf" && (
                  <div className="mt-3 border rounded-md overflow-hidden h-64">
                    <iframe title="Pré-visualização PDF" src={URL.createObjectURL(files[0])} className="w-full h-full" />
                  </div>
                )}
              </div>

              {/* OUTROS ARQUIVOS */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Outros Arquivos (Opcional)</label>
                <input multiple type="file" onChange={handleFilesSelected} className="mt-2" />
                {files.length > 0 && (
                  <ul className="mt-2">
                    {files.map((f, i) => (
                      <li key={i} className="text-sm text-gray-700">{f.name} • {Math.round(f.size / 1024)} KB</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* AGENDAMENTO */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Agendar Data e Hora (Opcional)</label>
                <input 
                  type="datetime-local"
                  value={materiaAgendamento} 
                  onChange={(e) => setMateriaAgendamento(e.target.value)} 
                  className="mt-1 block w-full border rounded-md p-2" 
                />
              </div>

              {uploadMessage && (<div className={`text-sm ${uploadMessage.includes('sucesso') ? 'text-green-600' : 'text-red-500'}`}>{uploadMessage}</div>)}

              <div className="flex items-center gap-3 justify-end">
                <button onClick={() => setOpenUpload(false)} className="px-4 py-2 border rounded">Cancelar</button>
                <button 
                  onClick={sendMaterials} 
                  disabled={uploading || (files.length === 0 && !materiaLink.trim())} 
                  className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-60">
                  {uploading ? "Enviando..." : "Enviar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PDF */}
      {openPdfEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="text-xl font-semibold">Editar & Enviar PDF</h3>
              <button onClick={() => setOpenPdfEditor(false)} className="text-gray-600 hover:text-gray-800"><X className="w-5 h-5"/></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Arquivo PDF</label>
                <input type="file" accept="application/pdf" onChange={handlePdfSelected} className="mt-2" />

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Título</label>
                  <input value={pdfTitle} onChange={(e) => setPdfTitle(e.target.value)} className="mt-1 block w-full border rounded-md p-2" placeholder="Título do PDF" />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Descrição</label>
                  <textarea value={pdfDescription} onChange={(e) => setPdfDescription(e.target.value)} className="mt-1 block w-full border rounded-md p-2" placeholder="Descrição" />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Agendar Data e Hora</label>
                  <input 
                    type="datetime-local"
                    value={pdfAgendamento} 
                    onChange={(e) => setPdfAgendamento(e.target.value)} 
                    className="mt-1 block w-full border rounded-md p-2" 
                  />
                </div>

                {pdfMessage && (<div className={`mt-3 text-sm ${pdfMessage.includes('sucesso') ? 'text-green-600' : 'text-red-500'}`}>{pdfMessage}</div>)}

                <div className="flex gap-3 justify-end mt-6">
                  <button onClick={() => setOpenPdfEditor(false)} className="px-4 py-2 border rounded">Cancelar</button>
                  <button onClick={sendPdf} disabled={pdfUploading || !pdfFile} className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800 disabled:opacity-60">
                    {pdfUploading ? "Enviando..." : "Enviar PDF"}
                  </button>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Pré-visualização</div>
                <div className="border rounded-md h-80 overflow-hidden bg-gray-50 flex items-center justify-center">
                  {!pdfFile ? (
                    <div className="text-gray-500">Nenhum PDF selecionado</div>
                  ) : (
                    <iframe title="PDF Preview" src={URL.createObjectURL(pdfFile)} className="w-full h-full" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL AVISO */}
      {openPopap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg w-full max-w-lg p-8 shadow-xl border border-gray-200">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h3 className="text-xl font-semibold text-slate-800">Novo Aviso</h3>
              <button onClick={() => setOpenPopap(false)} className="text-gray-500 hover:text-gray-700 transition">✕</button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">Título</label>
                <input value={avisoTitulo} onChange={(e) => setAvisoTitulo(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-slate-500" placeholder="Título do aviso" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Texto</label>
                <textarea value={avisoTexto} onChange={(e) => setAvisoTexto(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-slate-500" placeholder="Digite o aviso..." />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Agendar Data e Hora</label>
                <input 
                  type="datetime-local"
                  value={avisoAgendamento} 
                  onChange={(e) => setAvisoAgendamento(e.target.value)} 
                  className="mt-1 block w-full border rounded-md p-2" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Imagem (opcional)</label>
                <input type="file" accept="image/*" onChange={(e) => setAvisoImagem(e.target.files?.[0] || null)} className="mt-1" />
              </div>

              {avisoMessage && (<div className={`text-sm ${avisoMessage.includes('sucesso') ? 'text-green-600' : 'text-red-500'}`}>{avisoMessage}</div>)}

              <div className="flex justify-end gap-3">
                <button onClick={() => setOpenPopap(false)} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100">Cancelar</button>
                <button onClick={sendAviso} disabled={sendingAviso} className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-60">
                  {sendingAviso ? "Enviando..." : "Enviar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
