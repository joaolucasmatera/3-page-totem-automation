# 🚀 Web Automation

Sistema de automação completa para aplicação web com 3 janelas organizadas verticalmente.

## 📋 Funcionalidades

- ✅ **3 Janelas Simultâneas:** Dashboard, Perfil e Staging
- ✅ **Login Automático:** Credenciais específicas por ambiente
- ✅ **Organização Vertical:** Layout empilhado otimizado
- ✅ **Múltiplos Ambientes:** Production e Staging
- ✅ **Execução com 1 Clique**

## 🎯 Layout Final

```
┌─────────────────────────────────────┐
│ TOPO    - Dashboard                 │
├─────────────────────────────────────┤  
│ MEIO    - Perfil                    │
├─────────────────────────────────────┤
│ BAIXO   - Staging                   │
└─────────────────────────────────────┘
```

## 🚀 Como Usar

### Execução Automática (Recomendado)
```bash
.\run-automation.bat
```

### Scripts NPM Disponíveis
```bash
npm run automation    # Executar automação Playwright
npm run organize      # Organizar janelas verticalmente
npm run run-all       # Executar tudo automaticamente
npm run test-config   # Testar configuração de variáveis
npm run setup         # Configurar ambiente inicial
```

## 🔐 Configuração de Credenciais

Este projeto usa variáveis de ambiente para manter as credenciais seguras:

1. **Copie o arquivo de exemplo:**
   ```bash
   copy .env.example .env
   ```

2. **Configure suas credenciais no arquivo `.env`:**
   - `PRODUCTION_EMAIL` e `PRODUCTION_PASSWORD` - Para Dashboard e Perfil
   - `STAGING_EMAIL` e `STAGING_PASSWORD` - Para ambiente Staging
   - URLs configuráveis para cada ambiente

3. **⚠️ IMPORTANTE:** O arquivo `.env` nunca deve ser commitado no Git!

## ⚙️ Requisitos

- Node.js 16+
- Windows 10/11
- PowerShell 5.1+
- Chrome/Chromium

## 🔧 Instalação

```bash
# 1. Clonar/baixar projeto
cd web-automation

# 2. Instalar dependências
npm install

# 3. Configurar credenciais
copy .env.example .env
# Edite o arquivo .env com suas credenciais

# 4. Executar automação
.\run-automation.bat
```

## 📁 Estrutura do Projeto

```
web-automation/
├── scripts/
│   ├── 1-playwright-automation.js    # Automação principal
│   ├── 2-organize-windows.ps1        # Organizador de janelas
│   └── test-config.js                # Teste de configuração
├── run-automation.bat                # Execução completa
├── .env.example                      # Exemplo de configuração
├── .gitignore                        # Arquivos ignorados
├── package.json                      # Configurações NPM
└── README.md                         # Esta documentação
```

## 📝 Observações

- O Playwright continuará rodando em background para manter as janelas abertas
- Para fechar completamente: `taskkill /f /im node.exe`
- As janelas são automaticamente desmaxizadas e posicionadas
- Sistema aguarda todas as 3 janelas ficarem prontas antes de organizar

## 🔒 Segurança

- ✅ Credenciais isoladas em arquivo `.env`
- ✅ Arquivo `.env` está no `.gitignore`
- ✅ Exemplo público em `.env.example`
- ⚠️ **NUNCA commite o arquivo `.env` no Git!**

---
✨ **Execução perfeita com 1 clique!** 🚀
