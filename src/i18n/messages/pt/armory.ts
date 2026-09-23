// O Arsenal — a loja que o ouro escondido finalmente abre.
// Nomes e textos dos itens são indexados pelos ids de src/content/armory.ts,
// exatamente como a cópia dos heróis em overworld.ts. Os ids nunca mudam:
// não renomeie uma chave aqui sem renomeá-la lá.

export const armory = {
  metaTitle: "O Arsenal — TUSST",
  kicker: "o arsenal",
  title: "Gaste o que as lições te pagaram",
  intro:
    "Cada lição concluída pinga 10 de ouro na sua bolsa. Aqui está o que ela compra — uma lâmina, uma peça de equipamento, uma criatura na sua cola. Nada disso te deixa mais forte. Tudo isso te deixa mais você.",

  // Aparece no lugar da loja enquanto a camada de moedas segue escondida.
  locked: {
    title: "As portas estão fechadas",
    body: "O Arsenal abre depois da sua primeira lição concluída. Vá concluir uma, e as portas vão saber.",
    cta: "Escolher uma lição",
  },

  pouch: "{gold} de ouro",
  collection: "{owned} de {total} peças",
  artPending: "Forjada, ainda não pintada — a arte desta peça está a caminho.",

  slots: {
    weapon: "armas",
    equipment: "equipamento",
    mascot: "mascotes",
  },
  slotIntro: {
    weapon: "O que seu campeão empunha.",
    equipment: "O que seu campeão veste.",
    mascot: "Quem anda na cola do seu campeão.",
  },
  slotsNav: "Espaços de itens",

  rarity: {
    common: "qualidade comum",
    uncommon: "qualidade incomum",
    rare: "qualidade rara",
    epic: "qualidade épica",
    legendary: "qualidade lendária",
  },

  buy: "Comprar",
  buying: "Pagando…",
  equip: "Equipar",
  equipping: "Equipando…",
  equipped: "Em uso",
  unequip: "Desequipar",
  missing: "Faltam {missing} de ouro",
  buyAria: "Comprar {name} por {price} de ouro",
  equipAria: "Equipar {name}",
  unequipAria: "Desequipar {name}",

  loadout: {
    title: "Seu conjunto",
    empty: "Nada vestido ainda. Tudo aqui embaixo se abre com ouro, não com nível.",
    slotEmpty: "vazio",
    open: "Abrir o Arsenal",
  },

  err: {
    funds: "Ainda não há ouro suficiente para essa. Conclua outra lição e volte.",
    locked: "O Arsenal ainda não está aberto para você — conclua uma lição primeiro.",
    "unknown-item": "Essa peça não está no catálogo.",
  },

  items: {
    // ── armas ──────────────────────────────────────────────────────────────
    "rune-dagger": {
      name: "Adaga Rúnica",
      detail: "O primeiro aço. Pequena, honesta e afiada o bastante para um começo.",
    },
    "iron-shortsword": {
      name: "Espada Curta de Ferro",
      detail: "Nada emprestado, nada movido. A lâmina que todo escudeiro deixa para trás.",
    },
    "trustline-spear": {
      name: "Lança da Trustline",
      detail: "Alcance é confiança. Só acerta quem concordou em ser acertado.",
    },
    "twin-lumens": {
      name: "Lumens Gêmeos",
      detail: "Duas lâminas, um só equilíbrio. Nenhuma se move sem a outra.",
    },
    "forge-hammer": {
      name: "Martelo da Forja",
      detail: "Derretido nas emendas. O que ele quebra, quebra em partes que você sabe nomear.",
    },
    "soroban-staff": {
      name: "Cajado de Soroban",
      detail: "Um contrato num pedaço de pau. Diga as palavras e o mundo cumpre a promessa.",
    },
    "ledger-scythe": {
      name: "Foice do Ledger",
      detail: "A lâmina dela é uma página. O que ela colhe, ninguém apaga.",
    },
    "consensus-greatsword": {
      name: "Espadão do Consenso",
      detail: "Pesado demais para uma só mão. Só desce quando o reino inteiro concorda.",
    },

    // ── equipamento ────────────────────────────────────────────────────────
    patchcloak: {
      name: "Capa de Retalhos do Escudeiro",
      detail: "Quente, feia e sua. Todo Forgeborn começa nos retalhos.",
    },
    "keeper-lantern": {
      name: "Lanterna do Guardião",
      detail: "Guarda uma luz que lê de volta. Nada se arquiva no escuro.",
    },
    "runed-bracers": {
      name: "Braçadeiras Rúnicas",
      detail: "Gravadas com as regras que pegam o deslize antes que ele te custe caro.",
    },
    "sigil-pauldrons": {
      name: "Ombreiras do Sigilo",
      detail: "Aço que lembra por quais portões você foi deixado passar.",
    },
    "gem-cuirass": {
      name: "Couraça de Gema",
      detail: "Uma só pedra no peito, carregando todo estado que você já guardou.",
    },
    "starweave-cloak": {
      name: "Manto Tecido de Estrelas",
      detail: "Tecido do próprio grafo — o céu muda quando você se vira.",
    },
    "golden-aegis": {
      name: "Égide da Fortaleza Limpa",
      detail: "Um escudo sem peças sobrando. Nada nele está sem explicação.",
    },
    "protocol-crown": {
      name: "Coroa do Protocolo",
      detail: "Glifos orbitam a cabeça que finalmente aprendeu a lê-los.",
    },

    // ── mascotes ───────────────────────────────────────────────────────────
    "ember-wyrmling": {
      name: "Dragonete de Brasa",
      detail: "Nasceu na cinza da forja. Mastiga os seus erros de compilação.",
    },
    "rune-sprite": {
      name: "Duende Rúnico",
      detail: "Pequeno, verde-azulado e insistente. Aponta a linha que você errou.",
    },
    "lumen-moth": {
      name: "Mariposa de Lumen",
      detail: "Segue o valor como mariposa segue a luz — direto até o pagamento.",
    },
    "golem-pup": {
      name: "Filhote de Golem",
      detail: "Pedra, runas e nenhuma educação. Busca tudo o que você aloca.",
    },
    "frost-drake": {
      name: "Draco Gélido",
      detail: "Congela um instante para você poder ler. Insuportavelmente orgulhoso disso.",
    },
    "void-beholder": {
      name: "Beholder do Vazio",
      detail: "Um olho grande, muitos olhinhos. Vê o que o golem vê.",
    },
    "sky-leviathan": {
      name: "Leviatã do Céu",
      detail: "Um filhote de nuvem e estrela, já grande demais para a sala.",
    },
    "solar-dragon": {
      name: "Dragão Solar",
      detail: "A última coisa que a Forja faz. Só obedece a um herói pronto.",
    },
  },
};
