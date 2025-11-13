# Tasky Desktop - Aplicação Windows

Esta é a versão desktop do Tasky para Windows, construída com Electron.

## 📦 O que é Tasky Desktop?

Tasky Desktop é uma versão standalone da aplicação web Tasky que roda como um aplicativo nativo do Windows. Não é necessário ter um navegador aberto ou gerenciar servidores separadamente - tudo está empacotado em um único executável.

## 🚀 Como Executar em Modo de Desenvolvimento

### Pré-requisitos

- Node.js 18.x ou superior instalado
- npm (incluído com Node.js)

### Passos:

1. **Instalar dependências:**
```bash
npm install
```

Isso instalará as dependências do Electron e também das pastas `backend` e `frontend`.

2. **Executar o backend e frontend em modo de desenvolvimento:**

Em um terminal, execute o backend:
```bash
npm run dev:backend
```

Em outro terminal, execute o frontend:
```bash
npm run dev:frontend
```

3. **Iniciar a aplicação Electron:**

Em um terceiro terminal:
```bash
npm run electron:dev
```

A aplicação desktop será aberta e se conectará aos servidores de desenvolvimento.

## 📦 Como Compilar para Windows

### Gerar executável Windows:

```bash
npm run build:electron
```

Este comando irá:
1. Compilar o frontend React com Vite
2. Preparar os arquivos do backend
3. Empacotar tudo com Electron Builder
4. Gerar dois tipos de instaladores na pasta `dist-desktop/`:
   - **Instalador NSIS** (`Tasky-1.0.0-win-x64.exe`): Instalador tradicional do Windows
   - **Versão Portable** (`Tasky-1.0.0-win-x64-portable.exe`): Executável que roda sem instalação

### Gerar apenas a versão portable:

```bash
npm run build:electron:portable
```

## 📁 Estrutura do Projeto Desktop

```
Tasky/
├── electron-main.js          # Processo principal do Electron
├── electron-preload.js       # Script de preload para segurança
├── package.json              # Configuração do Electron e scripts
├── backend/                  # Backend Node.js/Express (incluído no app)
├── frontend/                 # Frontend React (compilado para o app)
├── dist-electron/            # Frontend compilado (gerado no build)
└── dist-desktop/             # Executáveis Windows (gerados no build)
```

## 🔧 Como Funciona

1. **Electron Main Process**: Gerencia a janela da aplicação e o ciclo de vida
2. **Backend Integrado**: O servidor Express é iniciado automaticamente em background
3. **Frontend**: A interface React é carregada na janela do Electron
4. **Comunicação**: O frontend se comunica com o backend via HTTP (localhost:3001)

## 🎯 Funcionalidades Desktop

- ✅ Aplicação standalone - não precisa de navegador
- ✅ Backend e frontend integrados em um único executável
- ✅ Ícone na barra de tarefas do Windows
- ✅ Atalhos no menu Iniciar e área de trabalho
- ✅ Instalador Windows tradicional (NSIS)
- ✅ Versão portable (não requer instalação)
- ✅ Auto-atualização (pode ser configurada)
- ✅ Dados armazenados localmente

## 🔐 Dados e Armazenamento

Os dados da aplicação (tarefas e usuários) são armazenados localmente no diretório da aplicação:

- **Em desenvolvimento**: `backend/data/`
- **Em produção**: Dentro do diretório de recursos da aplicação instalada

## 📝 Notas Importantes

1. **Primeira execução**: A aplicação pode levar alguns segundos para iniciar enquanto o backend é iniciado
2. **Porta do backend**: O backend roda na porta 3001 por padrão
3. **Configuração do Gemini AI**: Se você quiser usar as funcionalidades de IA, crie um arquivo `.env` na pasta `backend/` com sua chave API do Gemini
4. **Tamanho do executável**: O instalador terá aproximadamente 100-150MB devido ao Node.js e dependências incluídas

## 🐛 Solução de Problemas

### A aplicação não inicia:
- Verifique se a porta 3001 não está sendo usada por outro processo
- Execute em modo de desenvolvimento para ver os logs

### Erro ao compilar:
- Certifique-se de ter todas as dependências instaladas: `npm install`
- Limpe as pastas de build: `rm -rf dist-electron dist-desktop`
- Tente novamente

### Backend não conecta:
- O backend pode levar alguns segundos para iniciar
- Verifique os logs no console de desenvolvimento (F12)

## 🌐 Diferenças da Versão Web

A versão desktop é funcionalmente idêntica à versão web, mas oferece:
- Experiência nativa do Windows
- Não precisa de navegador aberto
- Inicialização mais rápida
- Melhor integração com o sistema operacional

## 📄 Licença

ISC - Mesma licença da aplicação web original
