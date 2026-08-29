// Strings for the bespoke lesson simulators. Typed against ../en like every
// other UI module, so a missing key is a build error in all four locales.
export const visuals = {
  ledgerTamper: {
    title: "Un libro encadenado",
    hint: "Cambia cualquier página. Todas las siguientes dejan de coincidir — que es justo el \"no puedes reescribir la historia en silencio\".",
    pageLabel: "página {n}",
    prevLabel: "viene de la página anterior",
    ownLabel: "huella de esta página",
    ok: "coincide",
    broken: "no coincide",
    reset: "restaurar las páginas originales",
    aria: "Una cadena editable de cuatro páginas del libro",
    pages: ["Ana debe 3.", "Bruno debe 5.", "Ana devolvió 3.", "Bruno debe 2 más."],
  },
  seal: {
    title: "Firmar y comprobar",
    hint: "El sello es ilustrativo, no es Ed25519 — pero se rompe exactamente como una firma real.",
    messageLabel: "mensaje",
    messagePlaceholder: "envía 10 a Bruno",
    keyLabel: "clave secreta (vive en esta página)",
    sealLabel: "sello",
    sign: "sellar",
    valid: "el sello coincide con este mensaje",
    invalid: "el sello no coincide con este mensaje",
    none: "// escribe un mensaje y séllalo",
    reset: "empezar de nuevo",
  },
};
