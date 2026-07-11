# Decisões futuras de implementação

Este documento registra decisões de produto que **serão implementadas no
futuro**, quando o site estiver integrado à operação e disponível para clientes
ativos. Ele não descreve funcionalidades existentes no estado atual do projeto.

## 1. Infraestrutura já adquirida

- O domínio do site da Farmácia Viana foi comprado na Hostinger.
- Também foi contratado um serviço de e-mail profissional da Hostinger para a
  empresa. O nome e os limites exatos do plano ainda devem ser confirmados
  antes da integração.
- O domínio e o e-mail profissional serão configurados na fase de publicação
  e integração do site com a operação real.

## 2. E-mail de marketing e relacionamento

Será implementado um canal de e-mail para clientes que autorizarem o
recebimento de comunicações. Os principais usos previstos são:

- envio automático e recorrente de promoções;
- atualizações de disponibilidade, novidades e lançamentos de produtos;
- campanhas segmentadas de acordo com o perfil e o histórico do cliente;
- fluxos de relacionamento, reativação e recompra.

Antes de ativar o canal, a implementação deverá incluir autenticação do
domínio de envio (SPF, DKIM e DMARC), registro de consentimento, preferências
de comunicação, descadastro simples e controle de frequência.

## 3. WhatsApp como principal canal de vendas

O WhatsApp continuará sendo a principal fonte e o principal destino das
vendas. As jornadas de compra iniciadas no site devem direcionar o cliente
para o atendimento e a conclusão do pedido no WhatsApp.

A integração futura deverá permitir que cada intenção originada no site seja
identificada, sempre que possível, com contexto como produto, campanha,
idioma, origem e carrinho. Isso permitirá medir o caminho entre visita,
conversa, pedido e recompra.

### 3.1 Análise de pedidos e comportamento

Os pedidos concluídos pelo WhatsApp deverão alimentar uma base estruturada de
clientes e pedidos. A análise deverá considerar, no mínimo:

- volume de produtos comprados, tanto por pedido quanto no período;
- frequência e intervalo entre compras;
- quantidade de pedidos concluídos;
- categorias, produtos, combinações e padrões de compra;
- data da última compra e sinais de inatividade;
- resposta a campanhas, recomendações e chamadas para ação;
- potencial de recorrência, aumento de volume, venda complementar e
  reativação.

O sistema deverá distinguir uma conversa de um pedido efetivamente confirmado
para não tratar intenções ou carrinhos abandonados como vendas realizadas.

### 3.2 Segmentação e prioridade comercial

Os perfis de clientes serão categorizados por potencial de venda e
comportamento observado. A ordem de prioridade definida para o modelo é:

1. **Volume** — quantidade de unidades compradas;
2. **Frequência** — regularidade e recorrência das compras;
3. **Valor financeiro** — gasto ou ticket, com peso menor que os dois fatores
   anteriores.

Em forma resumida, o princípio comercial é:

> **volume > frequência > valor**

O objetivo é desenvolver clientes que comprem um volume relevante e mantenham
boa frequência. O crescimento do valor financeiro deve surgir principalmente
como consequência do aumento sustentável desses dois fatores.

O modelo de pontuação deverá usar janelas de tempo comparáveis e normalização
por categoria, para que produtos naturalmente vendidos em maior quantidade ou
com ciclos diferentes não distorçam a classificação. As regras, pesos e motivos
da categoria atribuída devem ser auditáveis.

### 3.3 Mensagens automáticas personalizadas

Serão implementados envios automáticos pelo WhatsApp de acordo com o perfil,
o comportamento e o momento provável de compra do cliente. As mensagens
poderão incluir:

- promoções relevantes para o perfil;
- chamadas para ação (CTA);
- recomendações de produtos e vendas complementares;
- lembretes de recompra baseados em recorrência preditiva;
- campanhas de reativação;
- novidades e atualizações de disponibilidade.

A personalização deverá buscar aumento de vendas sem mensagens enganosas,
pressão indevida ou alegações de saúde não autorizadas. Antes do disparo em
produção, cada fluxo deverá ter objetivo, público, gatilho, limite de
frequência, critério de saída e texto aprovados.

## 4. Requisitos obrigatórios para a integração futura

Como a operação envolve clientes, comunicações comerciais e produtos de
farmácia, a implementação deverá contemplar desde o início:

- consentimento comprovável e separado por canal (e-mail e WhatsApp);
- opção clara e simples para interromper mensagens;
- identificação do remetente e registro de quando e por que cada mensagem foi
  enviada;
- limites de frequência, horários adequados e prevenção de mensagens
  duplicadas;
- coleta apenas dos dados necessários, controle de acesso e política de
  retenção;
- tratamento especialmente restrito para qualquer dado que possa revelar
  informações de saúde;
- revisão das normas aplicáveis no Paraguai, das regras de publicidade de
  produtos farmacêuticos e das políticas oficiais de e-mail e WhatsApp antes
  da ativação;
- uso de integrações oficiais e autorizadas, sem depender de extração informal
  de conversas pessoais;
- revisão humana e canal de atendimento para casos sensíveis, ambiguidades ou
  reclamações.

## 5. Sequência futura sugerida

1. Confirmar o domínio, o plano de e-mail contratado e as contas remetentes.
2. Publicar o site e substituir todas as configurações provisórias pelos dados
   reais da farmácia.
3. Integrar o site ao WhatsApp com identificação de origem e contexto do
   pedido.
4. Estruturar clientes, consentimentos, pedidos e itens de pedido em uma base
   confiável.
5. Criar os indicadores de volume, frequência, valor, recorrência e potencial.
6. Validar a segmentação inicialmente sem disparos automáticos.
7. Ativar campanhas piloto com revisão humana, limites conservadores e medição
   de resultado.
8. Somente depois, ampliar automações, recomendações e previsão de recompra.

## 6. Estado da decisão

- **Decidido para implementação futura:** domínio e e-mail profissional,
  campanhas de e-mail, WhatsApp como principal canal de vendas, análise de
  pedidos, segmentação e mensagens personalizadas.
- **Prioridade comercial decidida:** volume > frequência > valor.
- **Ainda não implementado:** integrações, coleta operacional de dados,
  pontuação de clientes e disparos automáticos.
- **Pendente de definição futura:** fornecedores, APIs, pesos exatos do modelo,
  textos das campanhas, limites de frequência e regras operacionais.
