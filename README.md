# 🌸 Associação Melhor Idade — v1.0.0

[![Versão](https://img.shields.io/badge/vers%C3%A3o-1.0.0-2A5C66.svg)](https://github.com/luiz5644/associacao_melhor_idade)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg)](https://vitejs.dev/)
[![Status](https://img.shields.io/badge/status-v1--conclu%C3%ADda-success.svg)](#)

Aplicação web oficial da **Associação Comunitária Melhor Idade**, desenvolvida em **React** e **Vite**, baseada fielmente no design do Figma com a paleta de cores oficial **Serene Care System**.

---

## 📌 Visão Geral da Versão 1.0 (v1)

Esta primeira versão contempla a estrutura completa do site, distribuída em 5 páginas principais, recursos interativos e ferramentas dedicadas de acessibilidade para o público da melhor idade:

1. **🏠 Início (`HomePage`)**:
   - Apresentação acolhedora e mensagem institucional.
   - Cards de *Próximos Encontros* da semana.
   - Resumo histórico *Nossa Caminhada* com foto de fundação.
   - Vitrine de *Momentos Recentes* com zoom de imagens.
   - Banner de *Doação e Apoio Comunitário*.

2. **📜 Nossa História (`HistoryPage`)**:
   - Linha do tempo interativa e ilustrada:
     - **2005**: O Início na Garagem (Dona Alzira e amigas).
     - **2012**: O Primeiro Coral (Maestro Roberto).
     - **2018**: A Conquista da Sede Própria (Restauração da chácara comunitária).

3. **🎉 Atividades Diárias (`ActivitiesPage`)**:
   - Catálogo das 6 atividades oficiais: *Forró da Melhor Idade*, *Canto & Coral*, *Viagens & Passeios*, *Rainha da Melhor Idade*, *Oficinas de Artesanato* e *Festas Temáticas*.
   - Botão **"Saiba Horários"** que abre modal com horários, dias, local, professor e orientações.

4. **📅 Calendário de Eventos (`CalendarPage`)**:
   - Calendário interativo de Outubro 2026 com navegação dinâmica entre meses.
   - Filtros de categoria por pílulas (*Todas*, *Música*, *Coral*, *Lazer*, *Artes*).
   - Painel lateral com *Destaques do Mês*.
   - Seleção de dia com exibição detalhada das atividades agendadas.

5. **📸 Galeria de Fotos (`GalleryPage`)**:
   - Grade de fotos com filtro por categorias (*Todos os Momentos*, *Forró*, *Coral*, *Viagens e Passeios*, *Celebrações*).
   - *Lightbox fullscreen* com navegação por teclado (setas e ESC) para ampliar fotos.

6. **🛠️ Recursos Especiais**:
   - **Barra de Acessibilidade**: Aumento progressivo de fonte (A+ / A++), modo Alto Contraste e leitor por voz em português.
   - **Modal de Doação / Voluntariado**: Chave PIX com botão de copiar, QR Code simulado e formulário para novos voluntários.
   - **Área do Administrador**: Tela de autenticação e painel de gestão para adicionar novos eventos em tempo real ao calendário.

---

## 🎨 Paleta de Cores (Serene Care System)

| Token | Código Hex | Aplicação Visual |
| :--- | :--- | :--- |
| **Primary** | `#2A5C66` | Logotipo, botões principais, cabeçalho e destaques. |
| **Secondary** | `#E8A87C` | Botões de apoio, doação e detalhes calorosos. |
| **Tertiary** | `#D1E8E2` | Pílulas de categorias, tags de seção e fundos suaves. |
| **Neutral** | `#4D4D4D` | Textos de leitura e bordas elegantes. |
| **Footer** | `#14272B` | Rodapé envolvente com cantos arredondados. |

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado no computador.

### Passo a passo:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/luiz5644/associacao_melhor_idade.git
   cd associacao_melhor_idade
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Abra no navegador:**
   Acesse [http://localhost:5173](http://localhost:5173)

---

## 📦 Scripts Disponíveis

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor de desenvolvimento local com HMR. |
| `npm run build` | Cria a versão de produção otimizada na pasta `dist/`. |
| `npm run preview` | Visualiza localmente o build de produção gerado. |

---

## 📄 Licença e Créditos

Desenvolvido para a **Associação Comunitária Melhor Idade** © 2026.  
Feito com afeto no Brasil 🇧🇷
