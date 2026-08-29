import type { LabTextOverlay } from "../localize";

export const labText = {
  meta: {
    title: "SCP: O Conselho dos Nós",
    tagline: "Construa quóruns, observe o consenso convergir, quebre-o de propósito.",
  },
  steps: {
    "intro": {
      body: `## O conselho decide

Sem mineração. Sem staking. Stellar fecha um ledger a cada ~5 segundos porque seus validadores executam o **Stellar Consensus Protocol**: cada nó nomeia um pequeno **conselho** (seu *quorum slice*) e se move quando o suficiente desse conselho se move.

À sua frente está uma rede em miniatura — sete validadores em três organizações. Você vai fazer com que eles concordem… e depois vai quebrá-los.`,
    },
    "sim-first-close": {
      body: `### Primeiro: faça-os concordar

Aperte **Propor um ledger** e observe a aceitação se espalhar, conselho por conselho, até que todos os assentos se iluminem — isso é o fechamento de um ledger.

Feche alguns. Sinta o ritmo.`,
    },
    "quiz-local": {
      question: `Você observou a aceitação se espalhar nó por nó. O que fez cada nó se iluminar?`,
      options: [
        "Suficiente do próprio conselho já havia aceitado",
        "Ele recebeu permissão de um coordenador central",
        "Ele ganhou uma loteria aleatória ponderada por stake",
      ],
      explain: `Tudo local: um nó não precisa do censo da rede, apenas do seu conselho. Conselhos sobrepostos transformam confiança local em acordo global.`,
    },
    "sim-break-it": {
      body: `### Agora: quebre

Derrube um nó e proponha — a rede dá de ombros. Derrube outros, concentrados em uma região de confiança, e encontre o momento em que os sobreviventes **ficam parados**.

Observe o que eles *não* fazem: nunca se dividem em duas histórias concorrentes.`,
    },
    "quiz-safety": {
      question: `Você derrubou uma parte suficiente do conselho, e os sobreviventes pararam em vez de continuar. Por que isso é o comportamento *projetado* para uma rede de pagamentos?`,
      options: [
        "Um pagamento pausado é recuperável; um pagamento que depois desfaz não é",
        "Congelar economiza eletricidade durante falhas",
        "Isso dá tempo aos nós caídos para serem substituídos por mineradores",
      ],
      explain: `Segurança antes de vivacidade: o SCP para em vez de bifurcar. Um pagamento confirmado precisa continuar confirmado; quando o acordo é impossível, a Stellar espera.`,
    },
    "quiz-recovery": {
      question: `Você levanta os nós caídos novamente. O que acontece com os assentos parados?`,
      options: [
        "Seus conselhos podem ser satisfeitos novamente — a rede retoma o fechamento de ledgers",
        "Eles precisam refazer a cadeia desde o bloco gênese",
        "Nada; uma rede parada fica parada para sempre",
      ],
      explain: `Experimente no simulador: levante os caídos, proponha, e o ritmo retorna. Paradas são pausas, não mortes.`,
    },
    "claim": {
      body: `Você fechou ledgers, parou uma rede e a recuperou — o ciclo completo de acordo federado, em uma única sessão. Conclua o lab e receba seu XP.`,
    },
  },
} satisfies LabTextOverlay;
