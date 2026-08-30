# Plan: escena premium de dispositivos

## Problema y usuario

La página presenta correctamente las pantallas reales de Mótu, pero la sección
«Un loop simple. Resultados reales.» las encierra en cuatro tarjetas planas que
se sienten rígidas y poco premium. La persona que llega por primera vez debe ver
un producto físico, cuidado y deseable, no una cuadrícula de documentación.

Sabremos que funciona cuando la sección se perciba como una fotografía de
producto, las pantallas sigan siendo legibles y reales, y el hero comunique de
inmediato que Mótu también acompaña desde Apple Watch.

## Experiencia visible

### Hero

- Mantener el texto «Todo tu movimiento. Por fin conectado.» y los dos iPhones.
- Añadir un Apple Watch delante y a la derecha, sin tapar el CTA ni la pantalla
  principal.
- Usar luz de estudio suave, reflejos controlados y una sombra común que conecte
  los tres dispositivos.
- La pantalla del reloj mostrará una vista real de una sesión de fuerza de Mótu.

### «Un loop simple. Resultados reales.»

- Mantener el título y el texto introductorio.
- Eliminar las cuatro tarjetas, sus números y la línea punteada.
- Sustituirlas por una sola escena cinematográfica de tres iPhones superpuestos:
  Fuerza, Mapa y Progreso.
- Dar profundidad con rotaciones pequeñas, escalas distintas, sombras, reflejos
  y una luz verde secundaria; ninguna pantalla quedará deformada.
- En teléfono, mostrar el iPhone central completo y los otros dos parcialmente
  detrás, sin carrusel ni desplazamiento horizontal.

## Datos y procedencia

- Fuerza: `assets/fuerza-motu.jpg`.
- Mapa: `assets/mapa-motu.jpg`.
- Progreso: `assets/progreso-motu.jpg`.
- Apple Watch: captura nueva obtenida del simulador de
  `CiudadDesbloqueadaWatch`, usando una sesión de fuerza controlada y sin datos
  privados.
- Los marcos, luces y sombras se construirán en HTML y CSS. No se generarán
  pantallas de la app con IA ni se alterará el contenido de las capturas.

## Archivos, motor y base de datos afectados

En `motu-web`:

- `index.html`: nueva composición del hero y de la sección de tres iPhones.
- `styles.css`: marcos de iPhone y Apple Watch, iluminación, profundidad y
  adaptación móvil.
- `assets/`: una captura real del Watch y, si hace falta, una versión web
  optimizada de esa captura.
- `tests/landing.test.mjs`: comprobar las tres pantallas, el Watch y la ausencia
  de la cuadrícula anterior.
- `squarespace/` y `tools/build-squarespace.mjs`: regenerar el bloque final para
  Squarespace sin JavaScript obligatorio.

En la app solo se usará el simulador para capturar una pantalla; no se cambiará
Swift, el motor, Supabase, Cloud Run ni ninguna base de datos.

La propuesta #2 no debe integrarse tal como está. Este rediseño incorporará la
decisión de alojar la página final en Squarespace y la reemplazará con una sola
propuesta coherente.

## Riesgos concretos

- Un render demasiado decorativo puede volver ilegibles las pantallas. Se limita
  la rotación y se comprueba cada captura al tamaño real de escritorio.
- El Apple Watch puede competir con los iPhones. Será más pequeño y quedará como
  apoyo visual en el hero.
- La captura del simulador puede contener datos de prueba poco creíbles. Se usará
  una sesión controlada con valores coherentes y sin información personal.
- El CSS propio de Squarespace puede añadir márgenes. El bloque seguirá aislado
  y se probará primero en una página no enlazada.
- En móvil, tres dispositivos pueden producir desbordamiento. La composición
  cambiará de posición y escala sin depender de JavaScript.

## Pruebas automáticas y manuales

Automáticas:

- `npm test` debe comprobar que aparecen Fuerza, Mapa, Progreso y Apple Watch;
- impedir que regresen las cuatro tarjetas o una pantalla ficticia;
- comprobar textos alternativos, enlaces internos y CTA de TestFlight;
- regenerar y comprobar el bloque de Squarespace sin JavaScript obligatorio.

Manuales:

- comparar escritorio a 1600 × 900 con el mockup aprobado;
- revisar tableta y teléfono sin desplazamiento horizontal;
- confirmar que las cuatro pantallas visibles son capturas reales;
- revisar reflejos, recortes y legibilidad con modo de movimiento reducido;
- pegar el bloque en una página no enlazada de Squarespace y comparar allí antes
  de convertirla en inicio.

## Exclusiones

- No conectar la web con Supabase ni guardar información de visitantes.
- No cambiar DNS, dominio, correo o producción.
- No modificar la app iOS o watchOS para fabricar la captura.
- No añadir formularios, analítica, cookies ni un enlace ficticio de TestFlight.
- No usar una imagen generada que invente o deforme la interfaz de Mótu.

## Estimación

Entre uno y dos días: captura controlada del Watch, construcción de ambas escenas,
adaptación responsive, paquete de Squarespace y comparación visual.
