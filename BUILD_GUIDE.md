# Tasky - Guia Rápido de Build Desktop

## Resposta à Questão Original

**Pergunta:** "Existiria alguma forma de buildar essa mesma aplicação como uma aplicação desktop para windows?"

**Resposta:** ✅ **Sim!** Agora o Tasky pode ser compilado como uma aplicação desktop para Windows usando Electron.

## Comandos Rápidos

### Compilar para Windows (Completo)
```bash
npm install
npm run build:electron
```
**Resultado:** Instalador NSIS + Versão Portable em `dist-desktop/`

### Compilar apenas Portable
```bash
npm install
npm run build:electron:portable
```
**Resultado:** Apenas executável portable em `dist-desktop/`

### Desenvolvimento Local
```bash
# Terminal 1
npm run dev:backend

# Terminal 2
npm run dev:frontend

# Terminal 3
npm run electron:dev
```

## Arquivos Gerados

Após executar `npm run build:electron`, você terá:

```
dist-desktop/
├── Tasky-1.0.0-win-x64.exe           # Instalador Windows (NSIS)
└── Tasky-1.0.0-win-x64-portable.exe  # Versão Portable
```

### Diferenças entre os Instaladores

| Tipo | Instalador NSIS | Portable |
|------|----------------|----------|
| **Instalação** | Sim, com wizard | Não necessária |
| **Tamanho** | ~100-150 MB | ~100-150 MB |
| **Atalhos** | Cria no Menu Iniciar e Desktop | Não cria |
| **Requer Admin** | Sim (para instalação) | Não |
| **Ideal para** | Instalação permanente | Testes, pen drive |

## Requisitos

- **Node.js**: 18.x ou superior
- **npm**: 9.x ou superior (vem com Node.js)
- **Sistema**: Windows, Linux ou macOS (para compilar)
- **Espaço**: ~500 MB para dependências + build

## O que foi Adicionado

1. ✅ Electron como runtime desktop
2. ✅ Electron Builder para criar instaladores
3. ✅ Scripts de build automatizados
4. ✅ Backend integrado (roda automaticamente)
5. ✅ Frontend otimizado para Electron
6. ✅ Documentação completa

## Documentação Completa

- **[DESKTOP.md](DESKTOP.md)** - Guia do usuário e instalação
- **[DESKTOP_DEV_GUIDE.md](DESKTOP_DEV_GUIDE.md)** - Guia de desenvolvimento detalhado
- **[README.md](README.md)** - Documentação principal do projeto

## Suporte a Outros Sistemas

Atualmente configurado apenas para Windows, mas Electron suporta:
- ✅ Windows (x64) - **Implementado**
- 🔄 macOS (x64, arm64) - Possível adicionar
- 🔄 Linux (x64, arm64) - Possível adicionar

Para adicionar suporte a outros sistemas, edite `package.json` seção `build.win` para incluir `build.mac` e `build.linux`.

## Problemas Comuns

### "Porta 3001 já em uso"
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <pid> /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

### "Erro ao instalar dependências"
```bash
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
npm install
```

### "Build falha"
```bash
rm -rf dist-electron dist-desktop
npm run build:frontend
npm run build:electron
```

## Próximos Passos Sugeridos

1. ⭐ Adicionar ícone personalizado em `build/icon.ico`
2. ⭐ Configurar auto-update (se publicar em GitHub Releases)
3. ⭐ Adicionar assinatura de código (para distribuição oficial)
4. ⭐ Criar builds para macOS e Linux

## Exemplo de Uso Completo

```bash
# 1. Clone o repositório (se ainda não fez)
git clone https://github.com/joao-pedro-gms/Tasky.git
cd Tasky

# 2. Instale as dependências (backend, frontend e electron)
npm install

# 3. Compile a versão desktop
npm run build:electron

# 4. Os instaladores estão em:
ls dist-desktop/

# 5. Distribua os arquivos .exe
```

## Licença

ISC - Código aberto, livre para usar e modificar
