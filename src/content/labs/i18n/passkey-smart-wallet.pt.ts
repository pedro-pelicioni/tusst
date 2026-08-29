import type { LabTextOverlay } from "../localize";

export const labText = {
  meta: {
    title: "Smart Wallet com Passkey",
    tagline: "Uma carteira sem frase-semente — seu dispositivo assina.",
  },
  steps: {
    "intro": {
      body: `## A chave que você nunca vê

Uma carteira Stellar clássica começa com um segredo \`S…\`. Uma **carteira com passkey** começa dentro do hardware seguro do seu celular ou computador. O WebAuthn pede que esse hardware crie uma chave **secp256r1** e libera apenas a parte pública; Face ID, Touch ID, um PIN ou uma chave de segurança desbloqueiam cada assinatura.

Hoje você vai cadastrar uma passkey real, publicar um contrato de smart account na testnet e responder a um novo desafio de autenticação com ela. Nenhuma frase-semente será exibida — porque ela não existe.`,
    },
    "forge-deployer": {
      title: "Prepare a conta de lançamento",
      body: `Um contrato não consegue pagar a taxa do próprio nascimento. Por isso, a Forja precisa de uma pequena conta **G** comum para publicá-lo. Se você já criou uma, ela será reutilizada; caso contrário, um novo par de chaves exclusivo da testnet será criado neste navegador.

Essa conta de lançamento **não** assina pela smart wallet. Ela apenas paga a taxa e fornece o salt do deploy — nada mais.`,
      cta: "Prepare a conta de lançamento",
      successBody: `Conta de lançamento pronta:

\`{address}\`

Seu segredo permanece neste navegador. A passkey criada a seguir ficará separada, dentro do hardware seguro.`,
    },
    "fund-deployer": {
      title: "Alimente o lançamento",
      body: `Publicar um contrato Soroban consome XLM da testnet para a taxa do envelope e os recursos do ledger. O Friendbot financia a conta de lançamento; se ela já existir, a Forja simplesmente a reutiliza.`,
      cta: "Financiar com Friendbot",
      successBody: `{balance} XLM agora abastecem a conta de lançamento. É suficiente para publicar a smart wallet sem relayer e sem dar à chave de lançamento qualquer autoridade sobre ela.`,
    },
    "quiz-secret": {
      question: `Onde fica a parte privada de uma passkey?`,
      options: [
        "Dentro do hardware seguro do autenticador; o aplicativo recebe assinaturas, nunca a chave privada",
        "Criptografada no banco de dados do TUSST para que o servidor possa assinar depois",
        "Dentro do contrato de conta inteligente como dados públicos do ledger",
      ],
      explain: `Exatamente. O navegador entrega um desafio ao autenticador. A rede vê uma chave pública e uma assinatura; o TUSST nunca recebe material de chave privada.`,
    },
    "create-passkey-wallet": {
      title: "Cadastre a passkey e publique a carteira",
      body: `Seu dispositivo abrirá o pedido nativo de passkey. Depois da sua aprovação, a Forja monta uma **smart account do Protocolo 27**, cuja assinatura padrão é essa credencial, e a conta de lançamento paga a taxa do deploy diretamente via RPC.

O código da conta é o Wasm canônico baseado em OpenZeppelin publicado com \`smart-account-kit@0.6.2\`.`,
      cta: "Criar passkey e publicar a carteira",
      successBody: `Sua carteira sem frase-semente está ativa na testnet:

\`{contract}\`

O endereço começa com **C** porque a carteira é um contrato. Sua regra de autorização aponta para a passkey que você acabou de criar — não para a conta G que pagou o deploy.`,
    },
    "quiz-authority": {
      question: `A conta G pagou para publicar a smart wallet. Seu segredo pode autorizar gastos da nova conta C?`,
      options: [
        "Não — pagar o deploy não torna a conta uma signatária; as regras da própria smart account decidem",
        "Sim — o pagador de taxa possui permanentemente cada contrato que implanta",
        "Somente até o próximo fechamento de ledger",
      ],
      explain: `Correto. Conta de origem, pagador da taxa, salt do deployer e signatário da smart account são papéis separados. A assinatura padrão desta carteira é a credencial WebAuthn.`,
    },
    "authenticate-passkey": {
      title: "Deixe a passkey assinar",
      body: `O deploy registrou uma chave pública, mas uma carteira só é útil quando a rede aceita suas assinaturas. A Forja financia a nova conta C com XLM da testnet, monta uma **transferência de 1 XLM de volta para sua conta de lançamento** e pede que a credencial exata vinculada a \`{contract}\` a autorize.

Aprove o pedido do dispositivo. Desta vez, a assinatura vai para a rede, e o \`__check_auth\` da smart account precisa aceitá-la.`,
      cta: "Assinar e enviar 1 XLM com a passkey",
      successBody: `A transferência foi concluída. Seu hardware seguro assinou, o verificador WebAuthn conferiu a prova secp256r1 e \`__check_auth\` autorizou a smart wallet a enviar **1 XLM**.

Essa transação é prova pública de que a passkey controla \`{contract}\` — não apenas que um diálogo de navegador abriu.`,
    },
    "quiz-cap71": {
      question: `O que o CAP-71 no Protocol 27 facilitou para contas inteligentes?`,
      options: [
        "Delegar autenticação de forma limpa, reduzindo o peso e o custo de fluxos de autorização multi-assinante",
        "Transformar automaticamente toda conta G clássica em uma passkey",
        "Remover todas as taxas de transação da rede",
      ],
      explain: `Delegação é infraestrutura do protocolo: uma autoridade pode entregar o trabalho de autenticação a outra sem carregar o formato antigo completo em cada transação. Isso ajuda smart accounts; não elimina taxas nem reescreve contas clássicas.`,
    },
    "claim": {
      body: `Agora a Forja consultará a própria testnet: a conta G de lançamento deve existir, o endereço C deve resolver para o **código canônico da smart account do Protocolo 27**, e essa smart wallet ainda deve possuir XLM nativo após sua transferência assinada pela passkey. Só então o ledger libera o XP do lab.`,
    },
  },
} satisfies LabTextOverlay;
