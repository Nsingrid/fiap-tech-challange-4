# 🚀 FIAP Tech Challenge 4

Sistema de gerenciamento financeiro construído com Next.js 15, React 19, Tailwind CSS 4 e TypeScript.

## ✨ Principais Features

- 🎨 **UI Moderna** com Tailwind CSS 4
- ⚡ **Performance Otimizada** com lazy loading e cache strategies
- 🔒 **Segurança Avançada** com criptografia AES-GCM
- 🏗️ **Clean Architecture** com separação de camadas
- 📱 **Design Responsivo** para todos os dispositivos
- 🎯 **Type-Safe** com TypeScript strict mode

## 🛠️ Stack Tecnológica

- **Framework**: Next.js 15.4 (App Router)
- **UI Library**: React 19.1
- **Styling**: Tailwind CSS 4.0
- **Language**: TypeScript 5.8
- **State**: Zustand + TanStack Query
- **Forms**: TanStack Form + Zod
- **HTTP**: Axios + Custom Cache Layer

## 🚀 Quick Start

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Rodar produção
npm start
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
src/
├── app/              # Next.js Pages (App Router)
├── components/       # Componentes React
├── domain/          # Entities & Repositories (Clean Arch)
├── infrastructure/  # Services & Security
├── hooks/           # Custom Hooks
├── stores/          # Global State (Zustand)
└── utils/           # Utilities
```

## 🎯 Principais Melhorias

### ✅ Implementado

- **Tailwind CSS 4**: Migração completa de CSS Modules
- **Clean Architecture**: Organização em camadas
- **Performance**: 
  - Lazy loading de componentes
  - Cache HTTP + React Query
  - Code splitting automático
  - Image optimization
- **Segurança**:
  - Criptografia client-side (AES-GCM)
  - Storage seguro
  - Headers de segurança
  - Validação com Zod
- **DX**: TypeScript strict, ESLint, Prettier


## 🔒 Segurança

- ✅ Criptografia AES-256-GCM
- ✅ HTTPS enforcement
- ✅ Secure headers (CSP, HSTS, etc)
- ✅ Input validation
- ✅ XSS protection


## 🧪 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento (Turbopack)
npm run build        # Build produção
npm start            # Rodar produção
npm run lint         # ESLint
npm run format:check # Prettier check
npm run format:write # Prettier format
npm run storybook    # Component docs
```

## 🌟 Highlights Técnicos

### Lazy Loading
```typescript
const Modal = lazy(() => import('./Modal'));
```

### Cache Strategies
```typescript
await httpService.fetch('/api/data', {
  cacheConfig: { ttl: 300000, strategy: 'cache-first' }
});
```

### Segurança
```typescript
const encrypted = await encryptionService.encrypt(data, password);
```

### Deploy 
```
https://fiap-tech-challange-4.vercel.app/
```



