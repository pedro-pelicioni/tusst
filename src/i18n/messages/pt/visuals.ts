// Strings for the bespoke lesson simulators. Typed against ../en like every
// other UI module, so a missing key is a build error in all four locales.
export const visuals = {
  ledgerTamper: {
    title: "Um livro encadeado",
    hint: "Altere qualquer página. Todas as seguintes deixam de bater — que é justamente o \"não dá para reescrever a história em silêncio\".",
    pageLabel: "página {n}",
    prevLabel: "carrega da página anterior",
    ownLabel: "impressão digital desta página",
    ok: "bate",
    broken: "não bate",
    reset: "restaurar as páginas originais",
    aria: "Uma cadeia editável de quatro páginas do livro",
    pages: ["Ana deve 3.", "Bruno deve 5.", "Ana pagou 3 de volta.", "Bruno deve mais 2."],
  },
  seal: {
    title: "Assinar e conferir",
    hint: "O selo é ilustrativo, não é Ed25519 — mas quebra exatamente como uma assinatura de verdade.",
    messageLabel: "mensagem",
    messagePlaceholder: "envie 10 para o Bruno",
    keyLabel: "chave secreta (vive nesta página)",
    sealLabel: "selo",
    sign: "selar",
    valid: "o selo confere com esta mensagem",
    invalid: "o selo não confere com esta mensagem",
    none: "// escreva uma mensagem e sele",
    reset: "recomeçar",
  },
};
