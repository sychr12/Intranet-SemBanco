import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração para aumentar o limite de upload para 50MB (resolvendo o erro 413)
  serverActions: {
    bodySizeLimit: '50mb', 
  },
  
  eslint: {
    ignoreDuringBuilds: true, // Ignora erros do ESLint durante o build (útil no Docker)
  },
};

export default nextConfig;
