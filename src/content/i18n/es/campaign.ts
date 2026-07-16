import type { ActText, CardText, SkirmishText } from "../types";

// Localized campaign narrative. Card NAMES and act numerals stay as-is.
export const actText: Record<string, ActText> = {
  "rust-fundamentals": {
    title: "La Ciudadela Oxidada",
    territory: "Capital en ruinas del arte rúnico",
    synopsis:
      "Despiertas entre las ruinas oxidadas de la Ciudadela. Ferrisia, la Madre Cangrejo, te enseña las palabras del despertar, la atadura de los nombres y la ley de la Hoja Inflexible. Reenciende el faro, Forgeborn.",
  },
  "control-flow": {
    title: "El Salón de los Caminos Bifurcados",
    territory: "Laberinto de espejos",
    overlord: "El Señor de los Espejos",
    synopsis:
      "Un laberinto donde cada corredor corresponde a un destino distinto. El Señor de los Espejos atrapa a los viajeros en bucles infinitos. Bifurca con sabiduría, haz match con cada reflejo y rompe el bucle eterno.",
  },
  "rust-standard-library": {
    title: "Las Bóvedas Infinitas",
    territory: "Archivo-mazmorra bajo el reino",
    overlord: "El Acaparador",
    synopsis:
      "Bajo el reino duerme cada herramienta que los viejos Stroopies forjaron: morrales que crecen, libros de cuentas encantados, cadenas de espíritus perezosos que no trabajan hasta que los recolectas. El Acaparador lo custodia todo — y todo lo indexa con un desfase de uno.",
  },
  "mastering-option": {
    title: "El Pantano Evanescente",
    territory: "Humedales embrujados del quizá",
    synopsis:
      "Aquí las cosas pueden ser o no ser. Los aldeanos se desvanecen en None; los necios hacen unwrap a ciegas y nadie vuelve a verlos. En el pantano haces la única pregunta que importa: ¿Some o None?",
  },
  "mastering-result": {
    title: "El Juicio de los Dos Destinos",
    territory: "La Alta Corte del reino",
    synopsis:
      "Aquí se juzga cada runa: Ok o Err. El lema de la Corte está tallado sobre la puerta — #[must_use]. Aprende a propagar el juicio con ?, a recuperarte de Err con elegancia y a nunca entrar en pánico ante la corte.",
  },
  "stellar-101": {
    title: "La Puerta de la Constelación",
    territory: "El cielo quebrado",
    synopsis:
      "Con cinco campeones reunidos, asciendes. Torreones estelares como cuentas, sigilo y secreto como keypairs, puentes de luz como trustlines — y lumens fluyendo de nuevo por primera vez desde el Pánico.",
  },
  "soroban-smart-contracts": {
    title: "La Guarida del Beholder",
    territory: "Fortaleza de errores sin manejar",
    overlord: "El Stroopbeholder",
    synopsis:
      "Más allá de la Puerta te espera, en una fortaleza construida con cada error que nadie manejó jamás. Forja runas Soroban, despliégalas en el cielo viviente y vuelve los contratos corruptos del Beholder en su contra.",
  },
  "stellar-protocol-27": {
    title: "El Cielo Reescrito",
    territory: "El propio firmamento, en plena reforja",
    overlord: "El Espectro del Eco",
    synopsis:
      "El Beholder yace roto — pero el cielo viviente no guarda luto; se reforja a sí mismo, costura a costura. Las estrellas lo llaman el Zipper: Protocol 27. Sin embargo, entre los escombros de la Guarida, un ojo nunca se cerró. Aprendió a copiar el sello del firmante y a pronunciarlo dos veces. Domina las leyes reescritas del cielo, Forgeborn, y silencia al Espectro del Eco.",
  },
};

export const skirmishText: Record<string, SkirmishText> = {
  "rust-fundamentals-1": {
    title: "Las Palabras del Despertar",
    intro:
      "El faro de la Ciudadela lleva apagado desde el Gran Pánico, y solo responde a una runa hablada. Ferrisia te entrega un cincel. «Toda runa jamás forjada comienza en `main`», dice. «Habla, Forgeborn — y cuida tus puntos y coma. El faro es pedante.»",
  },
  "rust-fundamentals-2": {
    title: "La Hoja Inflexible",
    intro:
      "En la armería, cada hoja está atada como inmutable por la vieja ley: una vez forjada, jamás cambiada. Para reforjar una debes declarar tu intención al propio acero. El Guardián de los Préstamos observa desde la puerta, de brazos cruzados, esperando a que intentes cambiarla sin `mut`.",
  },
  "rust-fundamentals-3": {
    title: "Las Formas de la Materia",
    intro:
      "Ferrisia abre un gabinete de frascos etiquetados: números enteros, números quebrados, verdades y mentiras. «La Ciudadela rechaza toda runa cuya forma no pueda nombrar», dice. «Etiqueta tus frascos, Forgeborn: el faro solo lee lo que está tipado.»",
  },
  "rust-fundamentals-4": {
    title: "La Receta del Herrero Rúnico",
    intro:
      "En la pared de la forja cuelga una receta: toma dos lingotes, fúndelos, devuelve la aleación. «Una receta escrita una vez sirve para mil forjas», dice Ferrisia. «Los herreros las llamaban funciones. Escribe la tuya, y la forja la llamará por su nombre.»",
  },
  "rust-fundamentals-5": {
    title: "La Ley del Único Guardián",
    intro:
      "La puerta de la bóveda lleva la ley más antigua de la Ciudadela: todo tesoro tiene exactamente un guardián. Entrega un tesoro a otro y deja de ser tuyo — vuelve a tocarlo y las guardas te quemarán. Esta noche aprenderás por qué los viejos herreros a veces forjaban una copia verdadera en su lugar.",
  },
  "rust-fundamentals-6": {
    title: "La Hoja Prestada",
    intro:
      "El Guardián de los Préstamos por fin habla: «No hace falta entregar una hoja para que otro lea su inscripción. Préstala — una referencia — y volverá a tu mano cuando terminen.» Golpea el sigilo `&` grabado en su guantelete. «Esta marca. Apréndela.»",
  },
  "control-flow-1": {
    title: "Las Dos Puertas",
    intro:
      "La primera cámara del laberinto guarda dos puertas y una sola antorcha. «Cada camino aquí es una pregunta», susurra un reflejo que casi eres tú. «Si la antorcha arde, una puerta. Si no, la otra. El laberinto solo respeta al viajero que sabe decidir.»",
  },
  "control-flow-2": {
    title: "El Salón de Todos los Reflejos",
    intro:
      "Un corredor de espejos, cada uno mostrando una puerta distinta que pudiste haber tomado. La regla del Señor de los Espejos es absoluta: nombra lo que ves en cada espejo — en todos y cada uno — o quedarás atrapado entre ellos. El viejo arte rúnico lo llama `match`, y no olvida nada.",
  },
  "control-flow-3": {
    title: "El Corredor Sin Fin",
    intro:
      "Este corredor se repite. El mismo candelabro, la misma grieta en la piedra, una y otra vez. Los viajeros que lo recorren para siempre acaban formando parte del muro. La única salida es contar tus ecos — y cuando la cuenta sea la correcta, romper el hechizo con `break` a mitad de paso.",
  },
  "control-flow-4": {
    title: "La Galería que se Hunde",
    intro:
      "El suelo desciende un piso a la vez, y el agua sube. «Mientras queden pisos por encima de la marea, sigue bajando hacia la bóveda», dice el reflejo, sin ayudar demasiado. Comprueba la condición antes de cada paso: la galería ahoga a los descuidados.",
  },
  "control-flow-5": {
    title: "Los Pasos Contados",
    intro:
      "Cinco piedras cruzan el lago de espejos, numeradas del uno al cinco. Pisa cada una exactamente una vez, en orden, anunciándolo en voz alta — el lago escucha. Los viejos herreros tenían una runa para recorrer un camino conocido sin contar con los dedos: `for`.",
  },
  "control-flow-6": {
    title: "El Laberinto del Señor de los Espejos",
    intro:
      "La galería final: diez espejos, y el Señor de los Espejos escondido detrás de cada tercero. Recorre la fila; anuncia el número de cada espejo — pero donde se esconda el Señor, grita «mirror» en su lugar. Bifurca dentro de tu bucle, Forgeborn. Rompe el corazón del laberinto.",
  },
  "rust-standard-library-1": {
    title: "El Morral Sin Fondo",
    intro:
      "La primera bóveda guarda la herramienta favorita de los Stroopies: un morral que crece hasta abarcar todo lo que metas en él. «Un `Vec`», dice el Stroopkeeper mientras abre la vitrina. «Todo aventurero lleva uno. Pocos lo respetan. Cuenta desde cero, como querían los dioses antiguos.»",
  },
  "rust-standard-library-2": {
    title: "La Cadena de Espíritus Perezosos",
    intro:
      "Más adentro, espíritus cuelgan en cadenas — cada uno sosteniendo un valor, sin hacer absolutamente nada. «Iteradores», susurra el Guardián. «Los trabajadores más perezosos del reino. No mueven un dedo hasta que los recolectas. Encadénalos bien y sumarán una fortuna en un solo aliento.»",
  },
  "rust-standard-library-3": {
    title: "El Estante que Puede Estar Vacío",
    intro:
      "La trampa del Acaparador: un estante con cinco ranuras, y aventureros que buscan la sexta. En los viejos tiempos, ese gesto derrumbaba la bóveda entera. El `.get` del morral pregunta con cortesía en su lugar — y la respuesta, Forgeborn, puede ser nada en absoluto.",
  },
  "rust-standard-library-4": {
    title: "El Libro Encantado",
    intro:
      "Un libro que responde preguntas: pregúntale «gold?» y contesta «100». Cada entrada es una clave atada a un valor, sin orden particular — el encantamiento cambia orden por velocidad. Los herreros lo llamaban `HashMap`. El Acaparador lo llama su memoria.",
  },
  "rust-standard-library-5": {
    title: "La Inscripción Viviente",
    intro:
      "Algunas inscripciones se tallan una vez y nunca cambian — y otras crecen, letra a letra, igual que su historia. Esta noche trabajas con las vivas: `String`, el texto creciente del reino, y `format!`, el hechizo que teje muchos en uno.",
  },
  "rust-standard-library-6": {
    title: "Una Ventana al Tesoro",
    intro:
      "El Acaparador no te dejará sacar el tesoro — pero sí te dejará mirar. Un slice es una ventana a un tramo del tesoro: sin copia, sin robo, solo una vista de aquí hasta allá. Cuidado con los bordes; la ventana incluye su inicio y excluye su final.",
  },
  "mastering-option-1": {
    title: "¿Some o None?",
    intro:
      "El Stroophantom se materializa — o no. Difícil saberlo. «En el pantano, toda respuesta viene envuelta», dice desde algún lugar. «`Some(thing)`, o `None`. Otros reinos fingen que la ausencia no existe y chocan contra ella a medianoche. Aquí, la ponemos en el tipo.»",
  },
  "mastering-option-2": {
    title: "Los Necios que Hicieron Unwrap",
    intro:
      "Lápidas bordean el sendero, cada una tallada con la misma última palabra: `.unwrap()`. «Asumieron», suspira el Fantasma. «Sobre `None`, unwrap entra en pánico — el programa entero se ahoga. Lleva un valor por defecto en su lugar, y el pantano no podrá tocarte.»",
  },
  "mastering-option-3": {
    title: "Pregúntale al Propio Pantano",
    intro:
      "En el corazón del pantano, una linterna que puede o no estar encendida. El Fantasma enseña la última cortesía: «`if let Some(light)` — si hay algo, tómalo por su nombre y úsalo. Si no, camina por el sendero del else. Nunca asumas. Pregunta.»",
  },
  "mastering-result-1": {
    title: "Los Dos Veredictos",
    intro:
      "La Strooracle preside, y su corte conoce exactamente dos fallos: `Ok(value)` y `Err(reason)`. «El pantano te enseñó la ausencia», dice. «Yo te enseño el fracaso — y el fracaso, Forgeborn, siempre declara su motivo para que conste en actas.»",
  },
  "mastering-result-2": {
    title: "La Lectura del Fallo",
    intro:
      "Llega un pergamino sellado con un veredicto dentro. En esta corte los veredictos no se adivinan — se les hace `match`: un brazo para `Ok`, un brazo para `Err`, ambos manejados, nada ignorado. El lema sobre la puerta brilla cuando entras: `#[must_use]`.",
  },
  "mastering-result-3": {
    title: "La Marca de la Propagación",
    intro:
      "No toda corte debe dictar sentencia; algunas elevan el caso. La Oráculo te muestra la runa más pequeña del reino: `?`. «Con Ok, desenvuelve y continúa. Con Err, devuélvelo a quien te llamó — al instante. Una sola marca, y el juicio fluye cuesta arriba.»",
  },
  "stellar-101-1": {
    title: "La Carta del Torreón Estelar",
    intro:
      "Astrostroopie te recibe en la Puerta con una carta constitutiva y dos llaves. «Toda alma en el cielo es un torreón estelar — una cuenta. El sigilo `G` puedes gritarlo desde las torres; la semilla `S` la guardas con tu vida. Pierde la primera: incómodo. Pierde la segunda: todo.»",
  },
  "stellar-101-2": {
    title: "El Peaje de la Puerta",
    intro:
      "«La moneda del cielo es el lumen», dice el Viajero, lanzando una moneda que se divide en diez millones de chispas. «Cada chispa, un stroop. Cada cruce paga un pequeño peaje — cien stroops, más o menos según el tráfico — para que nadie inunde el cielo de ruido.»",
  },
  "stellar-101-3": {
    title: "El Puente de Luz",
    intro:
      "Más allá de los lumens, el cielo transporta cada activo que un torreón estelar se atreva a emitir — pero solo por puentes que tú mismo construyes. «Una trustline», dice Astrostroopie, «eres tú diciéndole al cielo: acepto ESTE activo, de ESTE emisor. Sin puente no hay carga. El cielo se toma el consentimiento en serio.»",
  },
  "stellar-101-4": {
    title: "Primera Luz a Través del Cielo",
    intro:
      "Todo converge: un torreón estelar de destino, un activo, un monto. El Viajero se aparta de la consola. «Ningún lumen ha cruzado esta Puerta desde el Pánico. Traza el pago, Forgeborn. Que haya tráfico.»",
  },
  "soroban-smart-contracts-1": {
    title: "La Primera Runa Celeste",
    intro:
      "La puerta de la fortaleza lee runas, no acero. Aquí tu Rust ya no es un programa — es un contrato, tallado en el cielo viviente donde cualquier estrella puede llamarlo. Sin biblioteca estándar, sin sistema operativo: solo `#![no_std]`, el Env y tu palabra. Talla la primera runa celeste.",
  },
  "soroban-smart-contracts-2": {
    title: "El Libro que Recuerda",
    intro:
      "Dentro de la fortaleza, un libro de cuentas se escribe solo. Todo lo que el Beholder contó alguna vez está guardado aquí — pero el almacenamiento en el cielo se alquila, no se posee. Lee, incrementa, vuelve a escribir. El libro recuerda lo que tu contrato le dice que recuerde, y nada más.",
  },
  "soroban-smart-contracts-3": {
    title: "El Sello del Firmante",
    intro:
      "La corrupción del Beholder comenzó con una sola función sin custodia — cualquiera podía retirar lo que no era suyo. Una sola línea lo habría impedido. Exige el sello del firmante antes de mover un solo lumen: `require_auth`. Vuelve su propia bóveda en su contra.",
  },
  "stellar-protocol-27-1": {
    title: "El Giro del Cielo",
    intro:
      "Con el Beholder derrotado, las estrellas-validadoras se reúnen. No remiendan el cielo — votan, y en un ledger señalado el firmamento entero gira de una vez. Las estrellas llaman a esta reforja el Zipper: Protocol 27. Observa una actualización desde dentro, Forgeborn.",
  },
  "stellar-protocol-27-2": {
    title: "El Sello, Recordado",
    intro:
      "Vuelve a la bóveda que sellaste en la Guarida. `require_auth` resistió — pero una pregunta flota en los salones reconstruidos: ¿y si quien sostiene el sello no es un par de claves, sino un *contrato*? Las cuentas que son contratos escriben su propia ley de firmas: `__check_auth`.",
  },
  "stellar-protocol-27-3": {
    title: "La Corona Delegada",
    intro:
      "Ningún guardián vigila todas las bóvedas solo. Bajo el cielo antiguo, prestar el sello exigía frágiles rondas de adivinación — simula, propaga, reza. El cielo reescrito hace de la delegación una ley: `delegate_account_auth`, pronunciado dentro de `__check_auth`, entrega la verificación a un custodio de confianza.",
  },
  "stellar-protocol-27-4": {
    title: "El Eco Que Firma Dos Veces",
    intro:
      "Por fin se revela: el ojo que nunca se cerró. El Espectro del Eco roba un sello verdadero y lo pronuncia de nuevo — ante una bóveda distinta, firmada por la misma pluma. El cielo reescrito responde con un sello atado a su propia puerta: credenciales que nombran su dirección.",
  },
  "stellar-protocol-27-5": {
    title: "La Caravana de la Migración",
    intro:
      "Las caravanas hacen fila ante la Puerta, carretas cargadas con cada herramienta forjada bajo el cielo antiguo. Nada cruza al firmamento reforjado sin cambiar — cada SDK reforjado, cada import renombrado. Recorre el camino de la caravana, Forgeborn, y no dejes atrás nada que aún hable la lengua antigua.",
  },
  "stellar-protocol-27-6": {
    title: "El Último Eco del Espectro",
    intro:
      "El Espectro viene por tu bóveda con un sello robado y un eco perfecto. Pero tu cuenta ya no es una puerta con una sola llave — es ley: un `__check_auth` que verifica a su firmante y delega en una corona custodia. Ata el sello. Silencia el eco. Cierra la campaña.",
  },
};

export const cardText: Record<string, CardText> = {
  stroowarrior: {
    type: "Guerrero",
    flavor:
      "Solo cuando el mundo tiembla, el verdadero guerrero revela su luz inquebrantable.",
  },
  stropillusion: {
    epithet: "Explorador del Salón de los Espejos",
    type: "Stropie · Ilusionista",
    flavor:
      "Los reflejos engañan, los secretos permanecen ocultos: él dobla la realidad dentro de los espejos infinitos.",
  },
  stroopkeeper: {
    epithet: "Guardián de las Bóvedas Infinitas",
    type: "Stropie · Archivista",
    flavor:
      "Cada herramienta jamás forjada duerme en sus bóvedas — indexada desde cero, como querían los dioses antiguos.",
  },
  stroophantom: {
    epithet: "El Caballero Que Quizá No Sea",
    type: "Stropie · Espectro",
    flavor:
      "Pregúntale si está ahí. Nunca lo asumas. El pantano está lleno de los que hicieron unwrap.",
  },
  strooracle: {
    epithet: "Árbitro de los Dos Destinos",
    type: "Stropie · Oráculo",
    flavor:
      "Dos puertas, un veredicto. Ella jamás ha ignorado un Result, y no va a empezar con el tuyo.",
  },
  astrostroopie: {
    epithet: "Viajero de la Puerta de la Constelación",
    type: "Stropie · Viajero",
    flavor:
      "Cartografió el cielo por sus heridas y cruzó la Puerta donde la luz había fallado.",
  },
  stroopbeholder: {
    type: "Stropie · Aberración",
    flavor: "Desde las profundidades de la ruina, sus muchos ojos solo ven conquista.",
  },
  stroopzipper: {
    epithet: "Heraldo del Cielo Reescrito",
    type: "Stropie · Heraldo",
    flavor:
      "El cielo no se rompe cuando cambia — vuelve a cerrarse sobre sí mismo, costura a costura luminosa.",
  },
};
