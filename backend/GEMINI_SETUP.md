# Configuração da API Gemini para Sugestões de Tarefas

Este documento explica como configurar e usar o recurso de sugestões de melhorias de tarefas com IA usando a API do Google Gemini.

## 📋 Pré-requisitos

1. Uma conta Google
2. Acesso ao [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🔑 Obter API Key do Gemini

1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. Copie a API Key gerada

## ⚙️ Configuração

### 1. Configurar no Backend

1. Na pasta `backend`, crie um arquivo `.env` (se ainda não existir):
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edite o arquivo `.env` e adicione sua API Key:
   ```env
   PORT=3001
   GEMINI_API_KEY=sua_api_key_aqui
   ```

3. Reinicie o servidor backend:
   ```bash
   npm run dev
   ```

### 2. Verificar Instalação

O servidor deve iniciar sem erros. Se você ver mensagens sobre a API Key do Gemini não estar configurada, verifique se:
- O arquivo `.env` está na pasta `backend`
- A variável `GEMINI_API_KEY` está corretamente definida
- O servidor foi reiniciado após adicionar a chave

## 🚀 Como Usar

### Na Interface Web

1. Faça login na aplicação Tasky
2. Na área de criar nova tarefa:
   - Digite um título para a tarefa
   - Opcionalmente, adicione uma descrição
3. Clique no botão **"✨ Sugerir Melhorias (IA)"**
4. Aguarde enquanto a IA analisa e gera sugestões
5. Revise as sugestões apresentadas:
   - **Título sugerido**: versão melhorada do título
   - **Descrição sugerida**: descrição mais clara e objetiva
   - **Melhorias aplicadas**: lista de mudanças feitas
6. Opções:
   - Clique em **"Aplicar Sugestões"** para usar o título e descrição sugeridos
   - Clique em **"Dispensar"** para ignorar as sugestões

### Via API (Programaticamente)

**Endpoint:** `POST /api/tasks/suggest-improvements`

**Autenticação:** Requer token Bearer

**Body:**
```json
{
  "name": "comprar pão",
  "description": "ir na padaria"
}
```

**Resposta de Sucesso (200):**
```json
{
  "suggestedTitle": "Comprar pão na padaria",
  "suggestedDescription": "Ir até a padaria do bairro para comprar pão fresco. Verificar horário de funcionamento antes de ir.",
  "improvements": [
    "Título mais específico incluindo o local",
    "Descrição expandida com detalhes da ação",
    "Adicionada sugestão de verificar horário"
  ]
}
```

**Erro (503) - API não configurada:**
```json
{
  "error": "Serviço de sugestões não disponível. Configure GEMINI_API_KEY no arquivo .env"
}
```

**Erro (400) - Nome não fornecido:**
```json
{
  "error": "O nome da tarefa é obrigatório"
}
```

## 💡 Dicas de Uso

1. **Seja específico**: Quanto mais informação você fornecer no título e descrição originais, melhores serão as sugestões
2. **Use contexto**: Adicione contexto relevante na descrição inicial para obter sugestões mais úteis
3. **Revise sempre**: As sugestões são geradas por IA e devem ser revisadas antes de serem aplicadas
4. **Economia de tokens**: O recurso usa a API do Gemini, que pode ter limites de uso gratuito

## 🔒 Segurança

- **NUNCA** compartilhe sua API Key do Gemini
- **NÃO** commite o arquivo `.env` no Git (ele já está no `.gitignore`)
- A API Key é armazenada apenas no servidor backend
- O frontend nunca tem acesso direto à API Key

## 🐛 Troubleshooting

### Erro: "Serviço de sugestões não disponível"
- Verifique se a API Key está configurada no arquivo `.env`
- Certifique-se de que o servidor foi reiniciado após adicionar a chave

### Erro: "Erro ao gerar sugestões"
- Verifique sua conexão com a internet
- Confirme se a API Key é válida
- Verifique se não excedeu o limite de requisições da API gratuita

### Sugestões não fazem sentido
- Tente fornecer mais contexto no título e descrição originais
- Verifique se o texto está em português (a IA está configurada para PT-BR)

## 📊 Limites da API Gratuita

A API do Google Gemini possui limites no plano gratuito:
- 60 requisições por minuto
- Consulte [Google AI Studio](https://makersuite.google.com/app/apikey) para detalhes atualizados

## 🆘 Suporte

Se encontrar problemas, verifique:
1. Logs do servidor backend para mensagens de erro detalhadas
2. Console do navegador para erros no frontend
3. Documentação oficial do [Google Gemini API](https://ai.google.dev/docs)
