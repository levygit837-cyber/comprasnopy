<div align="center">

# Compraspy

**Protótipo cross-border de catálogo farmacêutico em três idiomas.**

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-37%20passing-2ea44f)](#rodar)

</div>

## Navegação rápida

[Problema](#problema-de-produto) · [Implementação](#o-que-está-implementado) · [Arquitetura](#arquitetura) · [Execução](#rodar) · [Limites](#limites-importantes)

Protótipo de marketplace cross-border para uma farmácia no Paraguai, com catálogo pesquisável,
páginas por produto, localização em três idiomas e fechamento do pedido por WhatsApp.

## Problema de produto

Catálogos grandes ficam difíceis de navegar quando nomes, apresentações, moedas e idiomas variam.
O Compraspy organiza essa jornada desde descoberta e busca até um carrinho compartilhável, mantendo
o pagamento fora do sistema enquanto a operação ainda não possui checkout integrado.

## O que está implementado

- 218 SKUs com IDs estáveis e páginas compartilháveis por slug;
- catálogo com busca local, sinônimos, trigramas, categorias, preço e ofertas;
- detalhe de produto, variantes, imagens, carrinho persistente e mensagem de pedido;
- interface em espanhol, português e inglês;
- exibição em USD, BRL e PYG a partir de preço canônico em USD;
- autenticação, perfil e schema de pedidos preparados com Supabase;
- proxy do Next.js para idioma e refresh de sessão;
- layout responsivo, temas e componentes acessíveis baseados em Radix UI;
- build para Next.js e configuração separada para Cloudflare/OpenNext.

## Limites importantes

- taxas de câmbio são valores estáticos de exibição, não cotação em tempo real;
- o botão final monta uma intenção de compra no WhatsApp; não há checkout ou pagamento integrado;
- o catálogo atual é local; o schema Supabase existe, mas ainda não é a fonte principal dos produtos;
- disponibilidade, conteúdo regulado e alegações dos produtos precisam de revisão operacional e
  jurídica antes de qualquer uso comercial;
- imagens e dados de fornecedores possuem direitos separados do código.

## Arquitetura

```text
src/app/                 # App Router, conta, catálogo e páginas por slug
src/components/          # home, busca, produtos, carrinho, auth e layout
src/lib/                 # catálogo, busca, moedas, i18n, Supabase e stores
supabase/                # migration inicial e seed
public/images/products/  # recortes usados pelo catálogo
design/                  # referências HTML de direção visual
docs/                    # decisões e limites futuros
```

As principais costuras são explícitas: o catálogo local não depende da interface, moedas partem de
um preço canônico, busca é um módulo puro testável e o adapter Supabase pode substituir a fonte local
sem mudar os componentes de apresentação.

Stack: Next.js 16, React 19, TypeScript strict, Tailwind CSS 4, Radix UI, Zustand, Supabase e Vitest.

## Rodar

Pré-requisitos: Node.js 24 e npm.

```bash
cp .env.example .env.local
npm ci
npm run dev
```

Verificação completa:

```bash
npm run typecheck
npm run test
npm run lint
npm run build
```

Em 4 de agosto de 2026, typecheck, lint, build e 37 testes passaram. O audit de dependências de
produção não encontrou advisories nessa data. Advisories restantes pertencem às ferramentas locais
de Cloudflare e devem ser revistos antes do primeiro deploy.

## Configuração

`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` habilitam autenticação. Sem elas,
o catálogo continua navegável e as áreas de conta degradam para um estado desabilitado.

Nome da loja, WhatsApp e endereço podem ser definidos em `.env.local`. Nenhum domínio customizado é
versionado no `wrangler.jsonc`; ele deve ser adicionado somente quando houver uma URL aprovada.

Algumas chaves de `localStorage` ainda usam o prefixo legado `viana.*` para preservar sessões de
desenvolvimento existentes. Isso não representa a marca pública atual.

## Desenvolvimento

Projeto conduzido com desenvolvimento assistido por agentes de IA. O trabalho humano incluiu
definição do produto, direção visual, reconciliação do catálogo, especificação dos fluxos, supervisão
da implementação e validação por testes, build e revisão responsiva.

## Licença

Nenhuma licença de reutilização é concedida. Conteúdo, catálogo e assets exigem autorização separada.
