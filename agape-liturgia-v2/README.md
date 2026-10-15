# Ágape Liturgia V2

Aplicação web voltada à vida de oração de jovens católicos, desenvolvida para reunir recursos como liturgia diária, Bíblia e ferramentas de espiritualidade em uma experiência acessível por celular e computador.

**Aplicação:** https://liturgia-agape.vercel.app

## Sobre o projeto

O Ágape Liturgia nasceu de uma necessidade real da comunidade Ágape de Jovens: facilitar o acesso a conteúdos de oração e liturgia em um só lugar. A V2 é uma evolução do projeto, construída com uma estrutura baseada em Next.js, React e TypeScript.

O projeto foi pensado para uso em dispositivos móveis e inclui recursos de instalação como Progressive Web App (PWA), preferências visuais e mecanismos de cache para melhorar a experiência de acesso.

## Recursos

Entre os recursos presentes no código desta versão estão:

- **Liturgia diária:** busca de conteúdo litúrgico por meio de uma API externa, com cache e tratamento de falhas.
- **Experiência de leitura:** apresentação dos conteúdos litúrgicos e recursos de interface voltados à leitura.
- **Bíblia e oração:** áreas dedicadas à Bíblia, ao Terço e a outros conteúdos de espiritualidade.
- **Preferências de usuário:** estado de interface e preferências gerenciadas no aplicativo.
- **Avisos da comunidade:** consulta de avisos gerais armazenados no Firebase.
- **Experiência PWA:** manifesto e configuração para instalação em dispositivos compatíveis.
- **Temas visuais:** suporte a temas claro, escuro e sépia.
- **Acessibilidade de uso:** opções de interface, como ajuste do tamanho do texto, e elementos de interação para dispositivos móveis.
- **Métricas:** integração com ferramentas de análise e monitoramento de desempenho.

A lista descreve recursos identificados na estrutura e nos arquivos do projeto; a disponibilidade de cada recurso pode depender da configuração do ambiente e dos serviços externos.

## Tecnologias

- **Next.js 16** — framework React para a aplicação.
- **React 19** — construção de componentes e interfaces.
- **TypeScript** — tipagem estática no código.
- **Tailwind CSS 4** — estilização da interface.
- **Firebase** — serviços de autenticação, banco de dados e recursos relacionados.
- **Firestore** — armazenamento de dados, com configuração de persistência local.
- **API externa de liturgia** — consulta dos dados da liturgia diária.
- **PWA** — manifesto e configuração de instalação.
- **Vercel Analytics e Speed Insights** — métricas de uso e desempenho.
- **Framer Motion** — animações de interface.
- **Zustand** — gerenciamento de estado.

## Executar localmente

### Requisitos

- Node.js compatível com a versão do Next.js utilizada.
- npm ou outro gerenciador compatível.
- Variáveis de ambiente e configurações dos serviços externos necessários, especialmente Firebase e autenticação Google, quando aplicável.

### Instalação

Entre na pasta do projeto:

```bash
cd agape-liturgia-v2
npm install
```

Crie um arquivo `.env.local` com as variáveis de ambiente exigidas pelo projeto. Os nomes utilizados incluem variáveis como `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` e `NEXT_PUBLIC_FIREBASE_APP_ID`. Confira os arquivos de configuração antes de executar e não publique credenciais privadas.

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

Para verificar a compilação de produção:

```bash
npm run build
npm run start
```

## Desenvolvimento do projeto

O desenvolvimento contou com apoio significativo de ferramentas de inteligência artificial para gerar e modificar código. Minha contribuição envolveu identificar a necessidade da comunidade, definir funcionalidades e regras, orientar decisões de experiência de uso, testar o comportamento da aplicação e solicitar ajustes conforme os resultados e o feedback recebido.

Por transparência, não apresento o projeto como se todo o código tivesse sido escrito manualmente por mim. Ele representa uma experiência prática de transformar uma necessidade real em uma solução digital, definir requisitos, avaliar resultados e iterar sobre o produto.

## Autor

**Gabriel Wolney Drumond**  
Estudante de Engenharia de Software — Universidade Católica de Brasília (UCB)

- GitHub: https://github.com/GabrielWolney
- LinkedIn: https://www.linkedin.com/in/gabrielwolney
