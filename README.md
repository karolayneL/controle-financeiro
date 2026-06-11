# 💰 Mini App de Controle Financeiro - Hackathon Pontoenv

Uma WPA (Web Page Application) mobile-first para controle financeiro pessoal, desenvolvida para o desafio da Pontoenv.

## 🚀 Tecnologias Utilizadas
- React + TypeScript (via Vite)
- Tailwind CSS v4 (Estilização 100% manual, sem libs de componentes)
- LocalStorage (Persistência de dados)

## ⚙️ Decisões de Arquitetura
1. **Centralização de Estado:** Como o escopo do mini-app é focado, optei por centralizar o gerenciamento de estado (`transactions`, `filtros`) no componente principal (`App.tsx`). Isso evita a complexidade desnecessária de Context API ou prop drilling, mantendo o fluxo de dados simples e fácil de debugar.
2. **Estilização Mobile-First:** Utilizei classes utilitárias do Tailwind garantindo que a interface seja responsiva desde telas pequenas até monitores ultrawide.
3. **Persistência Nativa:** Uso do `localStorage` sincronizado via `useEffect` para garantir que os dados não se percam ao recarregar a página, atendendo ao requisito do desafio sem a necessidade de um backend externo no momento.

## 🛠️ Como rodar o projeto localmente

1. Clone este repositório:
   ```bash
   git clone [https://github.com/karolayneL/controle-financeiro.git]