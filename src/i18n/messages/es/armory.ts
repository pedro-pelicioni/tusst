// El Arsenal — la tienda que el oro escondido por fin abre.
// Los nombres y el texto de ambiente van indexados por los ids de
// src/content/armory.ts: los ids nunca se traducen.

export const armory = {
  metaTitle: "El Arsenal — TUSST",
  kicker: "el arsenal",
  title: "Gasta lo que te pagaron las lecciones",
  intro:
    "Cada lección terminada deposita 10 de oro en tu bolsa. Esto es lo que compra: una hoja, una pieza de equipo, una criatura pegada a tus talones. Nada de esto te hace más fuerte.",

  // Se muestra en lugar de la tienda mientras la capa de monedas sigue oculta.
  locked: {
    title: "Las puertas están cerradas",
    body: "El Arsenal abre tras tu primera lección terminada.",
    cta: "Elegir una lección",
  },

  pouch: "{gold} de oro",
  collection: "{owned} de {total} piezas",
  artPending: "Forjada, todavía sin pintar — el arte de esta pieza está en camino.",

  slots: {
    weapon: "armas",
    equipment: "equipo",
    mascot: "mascotas",
  },
  slotIntro: {
    weapon: "Lo que tu campeón lleva en la mano.",
    equipment: "Lo que tu campeón viste.",
    mascot: "Quién camina pegado a los talones de tu campeón.",
  },
  slotsNav: "Ranuras de objetos",

  rarity: {
    common: "calidad común",
    uncommon: "calidad poco común",
    rare: "calidad rara",
    epic: "calidad épica",
    legendary: "calidad legendaria",
  },

  buy: "Comprar",
  buying: "Pagando…",
  equip: "Equipar",
  equipping: "Equipando…",
  equipped: "En uso",
  unequip: "Desequipar",
  missing: "Te faltan {missing} de oro",
  buyAria: "Comprar {name} por {price} de oro",
  equipAria: "Equipar {name}",
  unequipAria: "Desequipar {name}",

  loadout: {
    title: "Tu equipamiento",
    empty: "Todavía no llevas nada. Todo lo de abajo se abre con oro, no con nivel.",
    slotEmpty: "vacío",
    open: "Abrir el Arsenal",
  },

  err: {
    funds: "Aún no te alcanza el oro para esa. Termina otra lección y vuelve.",
    locked: "El Arsenal todavía no está abierto para ti — termina una lección primero.",
    "unknown-item": "Esa pieza no está en el catálogo.",
  },

  items: {
    // ── armas ──────────────────────────────────────────────────────────────
    "rune-dagger": {
      name: "Daga Rúnica",
      detail: "Tu primer acero. Pequeña, honesta y lo bastante afilada para empezar.",
    },
    "iron-shortsword": {
      name: "Espada Corta de Hierro",
      detail: "Nada prestado, nada movido. La hoja que todo escudero deja atrás.",
    },
    "trustline-spear": {
      name: "Lanza de Trustline",
      detail: "El alcance es confianza. Solo golpea lo que aceptó ser golpeado.",
    },
    "twin-lumens": {
      name: "Lúmenes Gemelos",
      detail: "Dos hojas, un solo equilibrio. Ninguna se mueve sin la otra.",
    },
    "forge-hammer": {
      name: "Martillo de la Forja",
      detail: "Fundido en las junturas. Lo que rompe, lo rompe en partes que puedes nombrar.",
    },
    "soroban-staff": {
      name: "Bastón de Soroban",
      detail: "Un contrato en un palo. Di las palabras y el mundo cumple su promesa.",
    },
    "ledger-scythe": {
      name: "Guadaña del Libro Mayor",
      detail: "Su hoja es una página. Lo que siega, nadie puede borrarlo.",
    },
    "consensus-greatsword": {
      name: "Mandoble del Consenso",
      detail: "Demasiado pesado para una mano. Solo cae cuando todo el reino está de acuerdo.",
    },

    // ── equipo ─────────────────────────────────────────────────────────────
    patchcloak: {
      name: "Capa de Remiendos del Escudero",
      detail: "Cálida, fea y tuya. Todo Forgeborn empieza entre remiendos.",
    },
    "keeper-lantern": {
      name: "Linterna del Guardián",
      detail: "Guarda una luz que también lee. Nada se archiva en la oscuridad.",
    },
    "runed-bracers": {
      name: "Brazales Rúnicos",
      detail: "Grabados con las reglas que atrapan un resbalón antes de que te cueste.",
    },
    "sigil-pauldrons": {
      name: "Hombreras del Sello",
      detail: "Acero que recuerda por qué puertas te dejaron pasar.",
    },
    "gem-cuirass": {
      name: "Coraza de Gema",
      detail: "Una sola piedra en el centro, cargando cada estado que has sostenido.",
    },
    "starweave-cloak": {
      name: "Capa de Tejido Estelar",
      detail: "Tejida con el grafo mismo — el cielo cambia cuando te giras.",
    },
    "golden-aegis": {
      name: "Égida del Bastión Limpio",
      detail: "Un escudo sin piezas de sobra. Nada en él queda sin rendir cuentas.",
    },
    "protocol-crown": {
      name: "Corona del Protocolo",
      detail: "Los glifos orbitan la cabeza que al fin aprendió a leerlos.",
    },

    // ── mascotas ───────────────────────────────────────────────────────────
    "ember-wyrmling": {
      name: "Dragonzuelo de Brasas",
      detail: "Nacido en la ceniza de la forja. Mastica tus errores de compilación.",
    },
    "rune-sprite": {
      name: "Duende Rúnico",
      detail: "Pequeño, turquesa e insistente. Señala la línea que hiciste mal.",
    },
    "lumen-moth": {
      name: "Polilla de Lumen",
      detail: "Sigue el valor como las polillas siguen la luz — directo al pago.",
    },
    "golem-pup": {
      name: "Cachorro de Gólem",
      detail: "Piedra, runas y cero modales. Te trae todo lo que reservas.",
    },
    "frost-drake": {
      name: "Draco de Escarcha",
      detail: "Congela un instante para que puedas leerlo. Y no deja de presumirlo.",
    },
    "void-beholder": {
      name: "Contemplador del Vacío",
      detail: "Un gran ojo y muchos pequeños. Ve lo que ve el gólem.",
    },
    "sky-leviathan": {
      name: "Leviatán del Cielo",
      detail: "Una cría de nube y estrella, ya demasiado grande para la sala.",
    },
    "solar-dragon": {
      name: "Dragón Solar",
      detail: "Lo último que hace la Forja. Solo obedece a un héroe terminado.",
    },
  },
};
