# Guia de Desenvolvimento Desktop - Tasky

## Testando a aplicação desktop localmente

### Modo de Desenvolvimento

Para testar a aplicação Electron em modo de desenvolvimento:

1. **Instalar todas as dependências:**
```bash
npm install
```

2. **Iniciar o backend em um terminal:**
```bash
npm run dev:backend
```

3. **Iniciar o frontend em outro terminal:**
```bash
npm run dev:frontend
```

4. **Iniciar o Electron em um terceiro terminal:**
```bash
npm run electron:dev
```

A aplicação desktop abrirá e se conectará aos servidores de desenvolvimento.

### Build de Produção

Para criar um executável Windows completo:

```bash
npm run build:electron
```

Isso irá:
1. Compilar o frontend React (pasta `dist-electron/`)
2. Preparar os arquivos do backend
3. Empacotar tudo com Electron Builder
4. Gerar instaladores em `dist-desktop/`

### Tipos de Instaladores Gerados

1. **NSIS Installer** (`Tasky-1.0.0-win-x64.exe`):
   - Instalador tradicional do Windows
   - Permite ao usuário escolher local de instalação
   - Cria atalhos no menu Iniciar e área de trabalho
   - Requer privilégios de administrador

2. **Portable** (`Tasky-1.0.0-win-x64-portable.exe`):
   - Executável standalone
   - Não requer instalação
   - Pode ser executado de um pen drive
   - Ideal para testes ou uso temporário

## Estrutura do Projeto Desktop

```
Tasky/
├── electron-main.js          # Processo principal do Electron
│                            # - Gerencia a janela da aplicação
│                            # - Inicia o backend Node.js
│                            # - Controla o ciclo de vida
│
├── electron-preload.js       # Script de preload
│                            # - Ponte segura entre renderer e main
│                            # - Expõe APIs controladas
│
├── package.json              # Configuração do Electron
│                            # - Scripts de build
│                            # - Configuração do electron-builder
│
├── backend/                  # Backend Node.js/Express
│                            # - Será executado em background
│                            # - Porta 3001 por padrão
│
├── frontend/                 # Frontend React
│                            # - Compilado com Vite
│                            # - Base path configurado para Electron
│
└── build/                    # Assets de build (ícones, etc.)
```

## Como Funciona o Electron

### Arquitetura

O Electron usa dois tipos de processos:

1. **Main Process** (electron-main.js):
   - Único processo principal
   - Gerencia janelas e ciclo de vida da aplicação
   - Tem acesso completo ao Node.js e APIs do sistema operacional
   - Inicia o servidor backend

2. **Renderer Process** (Frontend React):
   - Um ou mais processos de renderização
   - Cada janela é um processo separado
   - Executa o código do frontend
   - Comunicação com main process via IPC

### Fluxo de Inicialização

```
1. Electron inicia (electron-main.js)
   ↓
2. Backend Express é iniciado (spawn process)
   ↓
3. Aguarda 2 segundos para backend inicializar
   ↓
4. Cria janela do BrowserWindow
   ↓
5. Carrega o frontend (dev server ou arquivo local)
   ↓
6. Frontend se conecta ao backend via HTTP (localhost:3001)
```

### Comunicação

```
Frontend (React) ←→ HTTP ←→ Backend (Express)
       ↓                          ↑
    Renderer Process         Spawn Process
       ↓                          ↑
    IPC (opcional)                |
       ↓                          |
    Main Process ────────────────┘
   (electron-main.js)
```

## Customizações

### Alterar o Ícone

1. Crie ou obtenha um ícone 256x256 pixels
2. Converta para formato .ico (Windows)
3. Coloque em `build/icon.ico`
4. Rebuild a aplicação

### Configurar Auto-Update

Adicione ao `package.json`:

```json
{
  "build": {
    "publish": {
      "provider": "github",
      "owner": "seu-usuario",
      "repo": "Tasky"
    }
  }
}
```

E adicione código no `electron-main.js` para verificar atualizações.

### Mudar a Porta do Backend

Edite `electron-main.js`:

```javascript
env: {
  ...process.env,
  PORT: '3002', // Mude aqui
}
```

E atualize o frontend `.env` para:
```
VITE_API_URL=http://localhost:3002
```

## Problemas Comuns e Soluções

### 1. "Backend não conecta"

**Sintoma:** Frontend carrega mas não mostra dados

**Soluções:**
- Verifique se a porta 3001 não está em uso
- Aumente o timeout em `electron-main.js` (linha do setTimeout)
- Verifique os logs no console do DevTools (F12)

### 2. "Instalador não funciona"

**Sintoma:** Erro ao executar o instalador

**Soluções:**
- Execute como administrador
- Desabilite antivírus temporariamente
- Verifique se tem espaço em disco

### 3. "Build falha"

**Sintoma:** `npm run build:electron` retorna erro

**Soluções:**
- Limpe as pastas: `rm -rf dist-electron dist-desktop`
- Reinstale dependências: `rm -rf node_modules && npm install`
- Verifique Node.js versão >= 18.x

### 4. "Aplicação muito lenta"

**Sintoma:** Aplicação demora para abrir

**Soluções:**
- Normal no primeiro start (backend inicializando)
- Em produção, considere otimizar o bundle
- Verifique se não há processos em background consumindo recursos

### 5. "Erro ao abrir DevTools"

**Sintoma:** F12 não funciona

**Soluções:**
- DevTools só funciona em modo desenvolvimento
- Em produção, remova a linha `mainWindow.webContents.openDevTools()`

## Melhorias Futuras

### Performance
- [ ] Implementar lazy loading no frontend
- [ ] Adicionar cache para requisições
- [ ] Otimizar bundle size

### Funcionalidades
- [ ] Adicionar system tray icon
- [ ] Implementar notificações desktop
- [ ] Adicionar atalhos de teclado globais
- [ ] Suporte para tema claro/escuro nativo do SO

### Deployment
- [ ] Configurar assinatura de código
- [ ] Implementar auto-update
- [ ] Criar builds para macOS e Linux
- [ ] Adicionar CI/CD para builds

## Recursos Úteis

- [Documentação do Electron](https://www.electronjs.org/docs)
- [Electron Builder](https://www.electron.build/)
- [Electron Forge](https://www.electronforge.io/)
- [Awesome Electron](https://github.com/sindresorhus/awesome-electron)

## Licença

ISC - Mesma licença da aplicação original
