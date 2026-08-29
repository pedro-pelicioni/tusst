import type { JourneyConceptText } from "../types";

export const conceptText: JourneyConceptText = {
  title: "La llave y el sello",
  tagline: "Tu cuenta es una llave. Firmar es sellar. La idea es esa.",
  steps: [
    {
      kind: "theory",
      body: `## Una contraseña es una promesa que guarda otro

Cuando entras en tu banco, escribes una contraseña y el banco la *comprueba*. Cada parte de esa frase esconde una dependencia: el banco tiene la lista, el banco decide que eres tú, el banco puede bloquearte, y si la lista del banco se filtra, tu contraseña también.

El libro compartido del capítulo anterior no tiene ningún banco dentro. No hay nadie sentado detrás para comprobar nada.

Así que usa algo mejor: no un secreto que le *cuentas* a alguien, sino un secreto que *demuestras tener* — **sin enseñarlo nunca**.`,
    },
    {
      kind: "theory",
      body: `## Una llave, dos mitades

Tu cuenta es un par de mitades que encajan, creadas juntas, en tu propio dispositivo:

- La mitad **pública** es tu dirección. Se parece a \`GABC…7XQ\`. Compártela sin miedo — es adonde la gente te envía cosas, exactamente como una dirección de correo. Publicarla no es un riesgo; es su función.
- La mitad **secreta** nunca sale de tus manos. Se parece a \`SDXY…4KP\`. Es lo que *mueve* aquello que la dirección guarda.

Dos mitades, una relación: la mitad pública siempre puede derivarse de la secreta, y **nunca al revés**. Esa calle de sentido único es lo que sostiene todo el arreglo.

Una forma útil de recordarlo: tu dirección es el buzón que todos ven; tu clave secreta es la única llave que lo abre.`,
    },
    {
      kind: "quiz",
      question: `Un marketplace te pide "tu dirección de Stellar" para poder pagarte. ¿Qué mitad envías?`,
      options: [
        "La pública, la que empieza por G — es una dirección, hecha para compartirse",
        "La secreta, la que empieza por S — si no, el pago no puede llegar",
        "Ninguna: las direcciones son privadas y los pagos se acuerdan por correo",
      ],
      answer: 0,
      explain: `Recibir no necesita nada más que tu dirección. Si alguien afirma que un pago requiere tu clave secreta, la petición misma es el fraude — y ahora lo reconoces a la primera.`,
    },
    {
      kind: "theory",
      body: `## Firmar: un sello que nadie puede falsificar

Aquí es donde la mitad secreta se gana el sueldo. Para mover algo, escribes la instrucción — *«envía 10 a Bruno»* — y tu dispositivo la **sella** con tu clave secreta.

El sello tiene tres propiedades, y vale la pena leerlas despacio:

1. **Solo tu clave pudo hacerlo.** Nadie lo falsifica.
2. **Cualquiera puede comprobarlo** contra tu dirección pública, sin ver jamás tu mitad secreta.
3. **Cubre esa instrucción exacta.** Cambia un dígito del importe y el sello se deshace.

Eso es una **firma**. La red no te conoce, no confía en ti y no lo necesita — solo verifica que el sello encaje con la dirección de la que sale el dinero.`,
    },
    {
      kind: "widget",
      component: "seal-sign",
      body: `Pruébalo. Escribe algo, séllalo — y luego cambia un solo carácter y mira cómo el sello deja de coincidir.`,
    },
    {
      kind: "theory",
      body: `## La parte en la que la gente lo pierde todo

Como no hay banco detrás del libro, tampoco hay «he olvidado mi contraseña», ni atención al cliente, ni reversión. Eso corta por los dos lados, y ser honesto sobre el filo importa más que el entusiasmo:

- **Pierdes la clave secreta → los fondos se quedan ahí para siempre, visibles para todos, alcanzables por nadie.** No están «dentro» de la clave; la clave es simplemente lo único capaz de moverlos.
- **Otro consigue la clave secreta → esa persona es tú.** No hay a quién recurrir, porque para la red no ha pasado nada malo: un sello válido movió fondos válidos.

De ahí la única regla que sobrevive a todas las estafas de este mundo: **nadie legítimo necesita jamás tu clave secreta.** Ni el soporte, ni un sorteo, ni una «validación de cartera», ni un admin de un grupo. Ni una vez, ni nunca.`,
    },
    {
      kind: "quiz",
      question: `Alguien te escribe como «soporte de la red», dice que tu cuenta está bloqueada y te pide la clave secreta (o tus 24 palabras de recuperación) para desbloquearla. ¿Qué está pasando en realidad?`,
      options: [
        "Es un robo — nadie salvo tú necesita una clave secreta, y entregarla es entregar la cuenta",
        "Es rutina — el soporte necesita la clave para firmar el desbloqueo en tu nombre",
        "Es seguro mientras cambies la clave justo después",
      ],
      answer: 0,
      explain: `No hay tercera respuesta. Cada variación de ese mensaje — soporte, airdrops, «validación de cartera», un desconocido amable — es el mismo robo con otro disfraz. La regla no tiene excepciones que memorizar, y justo por eso funciona.`,
    },
    {
      kind: "fill",
      prompt: `Completa la regla que mantiene segura una cuenta:`,
      file: "NOTES.md",
      before: `Comparte la clave pública libremente; la clave secreta `,
      after: ` .`,
      choices: [
        "nunca sale de tu dispositivo",
        "solo se entrega al soporte verificado",
        "se envía por correo a ti mismo como copia de seguridad",
        "se publica junto con la transacción",
      ],
      answer: 0,
      explain: `Y «envíatela por correo» es la opción trampa: una bandeja de entrada es una copia de tu clave dentro del edificio de otra empresa, protegida por una contraseña. Respalda una clave sin conexión, en papel o en un dispositivo, o no la respaldes.`,
    },
    {
      kind: "labLink",
      labSlug: "wallet-onboarding",
      body: `Basta de teoría — ve a crear una. **Tu Primera Cartera**, en la Forja, genera un par de claves real, financia la cuenta en la red de pruebas de Stellar y te muestra la cuenta apareciendo como una línea en el libro compartido, segundos después de que firmes. Red de pruebas, dinero de juguete, maquinaria real.`,
    },
    {
      kind: "theory",
      body: `## Lo que ya tienes en la mano

Una cuenta es un par de claves. Una dirección es la mitad que se comparte. Una firma es el sello que solo tu mitad secreta puede hacer y cualquiera puede comprobar. Perder esa mitad es definitivo, y nadie honesto te la pedirá.

**A continuación:** el libro puede guardar algo más que saldos. Puede guardar *reglas* — y esas reglas se ejecutan solas, sin nadie en medio decidiendo si las honra.`,
    },
  ],
};
