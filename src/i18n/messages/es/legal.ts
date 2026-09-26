// Traducción al español de ../en/legal.ts; el archivo en inglés es la fuente de verdad.
export const legal = {
  privacy: {
    metaTitle: "Política de privacidad — TUSST",
    metaDescription:
      "Qué datos personales recopila TUSST, por qué, quién los recibe y cómo ejercer tus derechos.",
    kicker: "legal",
    title: "Política de privacidad",
    updated: "Última actualización: {date}",
    body: `TUSST es una plataforma de aprendizaje gratuita y de código abierto para Rust y la red Stellar, disponible en tusst.xyz. Esta política explica qué datos personales recopilamos cuando la usas, por qué los recopilamos, quién los recibe y cuáles son tus derechos.

## Quién es el responsable

TUSST lo mantiene Pedro Pelicioni, en Brasil. Él es el responsable del tratamiento de tus datos personales y el contacto para cualquier pregunta o solicitud sobre privacidad (el "encarregado", delegado de protección de datos según la LGPD de Brasil): [pedro@vants.xyz](mailto:pedro@vants.xyz).

## Qué recopilamos

- **Tu cuenta.** Cuando inicias sesión con GitHub o Discord, guardamos tu nombre visible (o tu nombre de usuario, si no configuraste uno), tu dirección de email principal en ese proveedor (aunque sea privada en GitHub) y el id numérico de tu cuenta allí. No guardamos tu foto de perfil ni otros datos de tu perfil. La biblioteca de inicio de sesión también guarda los tokens que el proveedor emitió en tu primer inicio de sesión (en el caso de Discord, incluido un refresh token). Esos tokens solo permiten leer tu perfil y tu dirección de email, y nunca los usamos para acceder a tu cuenta de GitHub o de Discord.
- **Tu progreso.** Las lecciones, los capítulos del Viaje y los labs que completaste y cuándo, los puntos de experiencia (XP) que ganaste con cada uno y tu nivel, el héroe que elegiste, tu oro dentro del juego, los objetos del Arsenal que compraste y cuánto pagaste por ellos, y tu idioma preferido.
- **El código que envías.** Cuando ejecutas el código de una lección, guardamos el código, los resultados de la evaluación y la salida del programa, con la fecha y la hora. Así conservamos tu progreso y podemos arreglar las lecciones que están rotas o son demasiado difíciles.
- **Respuestas del mentor y del examinador.** Cuando le pides una pista al mentor de IA o envías una spec al examinador del Viaje, guardamos el texto con el que te respondió (que puede citar tu código), el modelo que lo escribió, tu idioma, la lección a la que se refiere (si la hay) y cuándo. No guardamos los archivos de la Forja ni la spec que le enviaste.
- **Evidencia de los labs.** Cuando reclamas un lab, guardamos la dirección pública de la testnet de Stellar, el id del contrato y los hashes de transacción involucrados.
- **Estadísticas de uso.** Usamos Vercel Web Analytics, que registra las páginas que visitas, el sitio del que vienes, tu país, navegador, sistema operativo y tipo de dispositivo, y algunos eventos de la interfaz (por ejemplo, en qué botón de inicio de sesión se hizo clic o qué héroe elegiste). No usa cookies y no está vinculado a tu cuenta; los visitantes se cuentan con un hash, que cambia cada día, de la dirección IP y del navegador.
- **Datos técnicos.** Como en cualquier sitio web, nuestro hosting (Vercel) y nuestro ejecutor de código (DigitalOcean) reciben tu dirección IP e información básica de tu navegador con cada solicitud, para servir el sitio y mantenerlo seguro. El ejecutor de código también usa tu dirección IP para limitar cuántos builds, tests y auditorías puede iniciar cada visitante; esa dirección se guarda solo en la memoria de ese servidor y nunca se escribe en nuestra base de datos.

Necesitas una cuenta de GitHub o Discord para iniciar sesión. Sin iniciar sesión, aún puedes leer las lecciones, ejecutar la primera lección y usar la Forja: el código que ejecutas de esta forma se envía a nuestro ejecutor de código para evaluarlo o compilarlo, no se guarda y no se vincula a nadie. Tu progreso no se guarda, y el mentor y el examinador no están disponibles.

## Qué se queda en tu navegador

Algunos datos se guardan solo en el almacenamiento de tu navegador, en tu dispositivo, y no conservamos ninguna copia de ellos: tus borradores no enviados de código de las lecciones y de specs del Viaje, tus proyectos, tu historial de despliegues y la disposición de la interfaz en el IDE de la Forja, tu progreso en los labs antes de reclamarlo, los datos de la billetera con passkey creada en el lab de passkeys (la passkey en sí la guarda tu dispositivo o tu gestor de contraseñas), tu posición en los mapas, la configuración del tutorial y de la música, y la clave secreta de cualquier billetera de testnet que crees o importes en los labs y en la Forja. Nunca recibimos esa clave.

Parte de estos datos se nos envía solo cuando usas una función que los necesita: el código de tu lección cuando lo ejecutas, los archivos de tu proyecto de la Forja o de un lab cada vez que los compilas, los pruebas o los auditas (van a nuestro ejecutor de código y se eliminan cuando termina la ejecución), tus archivos de la Forja y la salida de la consola cuando le pides ayuda al mentor, y la dirección y los hashes de transacción cuando reclamas un lab. Borrar los datos del sitio en tu navegador elimina todo lo que se guarda solo en tu navegador.

## Cookies

Solo usamos las cookies que el sitio necesita para funcionar: la cookie de sesión de acceso (cifrada; contiene tu nombre, tu dirección de email y el id de tu cuenta, y caduca tras 30 días sin uso), cookies de corta duración que protegen el paso de inicio de sesión y una cookie que recuerda tu idioma durante un año. Una cookie más antigua que registraba una respuesta del onboarding todavía se lee si tu navegador la tiene, pero ya no se crea. No usamos cookies de publicidad ni de rastreo entre sitios; por eso no hay banner de cookies.

## Cómo usamos tus datos

- Para hacer funcionar TUSST: iniciar tu sesión, guardar tu progreso, evaluar tu código y otorgarte XP, oro y objetos.
- Para generar las pistas del mentor que pides y para que un examinador de IA revise, según los criterios de evaluación del capítulo, las specs que envías en los ejercicios del Viaje. El veredicto del examinador, por sí solo, decide si ganas el XP de ese ejercicio; puedes pedirnos que revisemos un veredicto y que te expliquemos los criterios usados (consulta "Tus derechos").
- Para responder a las solicitudes de soporte y arreglar lecciones, lo que incluye revisar los intentos enviados en ellas.
- Para mantener la plataforma segura y justa, evitando trampas, abusos y sobrecarga.
- Para entender, de forma agregada, cómo se usa la plataforma y mejorar las lecciones.

No vendemos tus datos, no mostramos anuncios y no enviamos emails de marketing.

## Bases legales

Tratamos tus datos para prestarte el servicio que usas o en el que te registraste (LGPD art. 7, V; RGPD art. 6(1)(b)). Para la seguridad, la prevención de abusos y la limitación de uso, el soporte, el arreglo de lecciones a partir de los intentos enviados y las estadísticas agregadas, nos basamos en nuestro interés legítimo en operar una plataforma gratuita segura y útil (LGPD art. 7, IX; RGPD art. 6(1)(f)).

## Quién recibe tus datos

- **Vercel**: aloja el sitio y proporciona las estadísticas de uso.
- **Neon**: aloja nuestra base de datos.
- **DigitalOcean**: en sus servidores funciona nuestro ejecutor de código (forge.tusst.xyz, en Estados Unidos), que compila y ejecuta tu código en sandboxes aislados. El código de las lecciones le llega a través de nuestro sitio; los builds de la Forja y de los labs se le envían directamente desde tu navegador, por lo que también ve tu dirección IP. El código que se envía allí se elimina en cuanto termina la ejecución y no se vincula a tu cuenta.
- **Groq** (proveedor de modelos de IA): cuando le pides una pista al mentor, recibe el código, los nombres de las comprobaciones que fallaron y la salida del compilador o del programa de tu último intento fallido, o hasta seis archivos de tu proyecto de la Forja y la salida de su consola. Cuando envías una spec al examinador del Viaje, recibe esa spec. También se le indica en qué idioma debe responder. Nunca recibe tu nombre, tu dirección de email, el id de tu cuenta ni tu dirección IP.
- **Raven (raven.stellar.buzz)**: un servicio de búsqueda en la documentación de Stellar. Para fundamentar algunas pistas del mentor, nuestro servidor puede enviarle una consulta breve, como el título de una lección o la primera línea de un error.
- **GitHub y Discord**: cuando los eliges para iniciar sesión, nos confirman tu identidad. Tratan tus datos según sus propias políticas de privacidad, no en nuestro nombre.
- **Stellar Development Foundation (SDF)**: los labs y la Forja se conectan directamente desde tu navegador a los servidores públicos de testnet de la SDF (Horizon, RPC y Friendbot), que ven tu dirección IP y tu dirección de testnet. Cuando reclamas un lab, nuestro servidor consulta tu dirección de testnet en esos servidores para verificar tu trabajo. Las transacciones que haces, las direcciones involucradas y cualquier contrato que despliegues (incluido su código compilado) son públicos por diseño en la testnet de Stellar, que se reinicia periódicamente. La dirección que guardamos vincula esa actividad pública con tu cuenta de TUSST.

## Servicios con los que tu navegador se conecta directamente

Algunas funciones hacen que tu navegador se conecte directamente con otros servicios. Esos servicios ven tu dirección IP y lo que se solicitó, según sus propias políticas de privacidad:

- **jsDelivr**, que distribuye el editor de código que se usa en las lecciones y en la Forja.
- **GitHub**, cuando importas un repositorio público a la Forja.
- **La billetera que elijas** en el menú de billeteras de la Forja (por ejemplo, Freighter o Albedo), y Creit Tech (stellar.creit.tech), que sirve los íconos de ese menú.

## Transferencias internacionales

La mayoría de estos servicios están ubicados fuera de Brasil y de la Unión Europea, principalmente en Estados Unidos. Les transferimos datos porque es necesario para prestar el servicio que pediste (LGPD art. 33, IX). Cuando un proveedor los ofrece, también nos basamos en sus términos de tratamiento de datos, en cláusulas contractuales tipo o en su certificación bajo el EU–U.S. Data Privacy Framework. Escríbenos para saber qué garantía se aplica a cada proveedor o para obtener una copia.

## Cuánto tiempo los conservamos

Conservamos los datos de tu cuenta, tu progreso, el código enviado y las respuestas del mentor y del examinador mientras tu cuenta exista. Nuestro ejecutor de código guarda las direcciones IP solo en memoria, hasta que se reinicia; los demás datos técnicos se conservan solo mientras nuestros proveedores de hosting conserven sus registros de solicitudes. La cookie de sesión de acceso caduca tras 30 días sin uso y la cookie de idioma, tras un año. Cuando nos pides que eliminemos tu cuenta, la eliminamos junto con todos los datos asociados en un plazo de 30 días; las copias que queden en los respaldos de corto plazo de nuestro proveedor de base de datos desaparecen cuando esos respaldos caducan. Lo que es público en la testnet de Stellar está fuera de nuestro control.

## Tus derechos

Puedes pedirnos que confirmemos si tratamos tus datos; que te demos acceso a ellos o que los corrijamos, exportemos o eliminemos; que anonimicemos, bloqueemos o restrinjamos los datos innecesarios, excesivos o tratados de forma ilícita, y que te informemos con quién los compartimos. También puedes oponerte al tratamiento basado en el interés legítimo y pedir que se revise una decisión automatizada, como un veredicto del examinador del Viaje. Escribe a [pedro@vants.xyz](mailto:pedro@vants.xyz) desde la dirección de email vinculada a tu cuenta; te respondemos en un plazo de 15 días. También puedes presentar una reclamación ante la autoridad de protección de datos de Brasil (ANPD) o ante la autoridad de tu país.

## Menores de edad

TUSST no está dirigido a menores de 13 años, y no permitimos a sabiendas que creen cuentas. Si tienes menos de 18 años, usa TUSST con el conocimiento de tu madre, tu padre o tu tutor. Si crees que un menor de 13 años tiene una cuenta, escríbenos y la eliminaremos.

## Seguridad

El tráfico está cifrado (HTTPS), tu código se ejecuta en sandboxes aislados sin acceso a la red y el acceso a los sistemas de producción está restringido al mantenedor. Ningún sistema es perfectamente seguro: si nos enteramos de un incidente que afecte tus datos, te lo notificaremos a ti y a la autoridad competente, según lo exija la ley.

## Cambios en esta política

Actualizamos esta página cuando cambian nuestras prácticas y actualizamos la fecha que aparece arriba. Los cambios significativos también se anunciarán en el sitio.`,
  },
};
