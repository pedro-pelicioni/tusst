// Strings for the bespoke lesson simulators. Typed against ../en like every
// other UI module, so a missing key is a build error in all four locales.
export const visuals = {
  ledgerTamper: {
    title: "Un livre chaîné",
    hint: "Modifiez n'importe quelle page. Toutes les suivantes cessent de correspondre — c'est tout le « on ne réécrit pas l'histoire en silence ».",
    pageLabel: "page {n}",
    prevLabel: "hérité de la page précédente",
    ownLabel: "empreinte de cette page",
    ok: "correspond",
    broken: "ne correspond pas",
    reset: "restaurer les pages d'origine",
    aria: "Une chaîne modifiable de quatre pages du livre",
    pages: ["Ana doit 3.", "Bruno doit 5.", "Ana a rendu 3.", "Bruno doit 2 de plus."],
  },
  seal: {
    title: "Signer et vérifier",
    hint: "Le sceau est illustratif, ce n'est pas Ed25519 — mais il casse exactement comme une vraie signature.",
    messageLabel: "message",
    messagePlaceholder: "envoie 10 à Bruno",
    keyLabel: "clé secrète (vit dans cette page)",
    sealLabel: "sceau",
    sign: "sceller",
    valid: "le sceau correspond à ce message",
    invalid: "le sceau ne correspond pas à ce message",
    none: "// écrivez un message, puis scellez-le",
    reset: "recommencer",
  },
};
