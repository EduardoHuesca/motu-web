# Plan: separar la web pública de Mótu

## Problema y usuario

La página pública vive hoy en una propuesta del repositorio de la app iOS. Aunque
su código está aislado en `website/`, comparte ramas, controles y ritmo de
publicación con Swift, Supabase y las migraciones. Eso obliga a ejecutar barreras
que no aportan seguridad a una web estática y hace más confuso publicar
`mootuapp.com`.

La separación beneficia a dos grupos:

- las personas que visitan `mootuapp.com`, porque la web puede publicarse y
  corregirse sin esperar una entrega de la app;
- quien mantiene Mótu, porque cada repositorio tendrá una responsabilidad clara.

Sabremos que funciona cuando la página conserve el diseño aprobado, tenga su
propio repositorio y controles, y pueda publicarse en el dominio sin modificar ni
compilar la app.

## Decisión recomendada

Crear `EduardoHuesca/motu-web` como repositorio público independiente y usar
GitHub Pages únicamente como vista previa comprobable. Squarespace seguirá
siendo el alojamiento final porque Mótu ya tiene allí un plan anual activo.

No integrar la propuesta #304 en `ciudad-desbloqueada`. Tras comprobar que el
nuevo repositorio contiene exactamente la misma página, cerrar esa propuesta como
reemplazada por `motu-web`.

El repositorio puede ser público porque todo lo que sirve una web pública —HTML,
CSS, JavaScript, tipografía y capturas— será descargable por cualquier visitante
de todos modos. No debe contener secretos ni datos privados.

## Experiencia visible

- El diseño aprobado no cambia.
- `mootuapp.com` y `www.mootuapp.com` mostrarán la nueva página.
- El botón «Solicitar acceso» seguirá preparando un correo a
  `support@mootuapp.com` mientras no exista un enlace real de TestFlight.
- `legal.mootuapp.com` seguirá funcionando desde su repositorio actual.

## Datos y procedencia

La web seguirá siendo estática y no guardará datos.

- Las pantallas proceden de capturas reales de la app ya aprobadas.
- El logo, Manrope y los colores proceden del sistema de marca de Mótu.
- El correo procede de la documentación legal y de TestFlight del proyecto.
- No hay conexión con Supabase, Cloud Run, HealthKit ni el motor de fuerza.

## Repositorios y archivos afectados

### Nuevo repositorio `motu-web`

Mover el contenido actual de `website/` a la raíz:

- `index.html`
- `styles.css`
- `script.js`
- `assets/`
- `package.json`
- `tests/`
- un `README.md` corto con vista previa, pruebas y publicación
- un flujo propio que ejecute `npm test`

Configurar GitHub Pages desde `main` como vista previa. Preparar además un paquete
HTML y CSS para Squarespace que no requiera JavaScript, de modo que funcione en
cualquier plan actual. GitHub conserva la fuente y las pruebas; Squarespace
conserva la página pública.

### Repositorio de la app

- No integrar la propuesta #304.
- Cerrarla únicamente después de comparar el nuevo repositorio con el commit
  `4eafcd2d6c059633e9cba7d7fa121f1f1d22112d` y confirmar que no falta ningún
  archivo.
- No tocar Swift, `project.yml`, el motor ni las migraciones.

### DNS y Squarespace

`mootuapp.com` y `www.mootuapp.com` permanecen en Squarespace. No se cambian DNS,
dominio, registros de correo ni proveedor. Eduardo sustituirá el contenido de la
página únicamente después de comprobar la vista previa y conservará la versión
anterior hasta validar escritorio y móvil.

## Riesgos concretos

- Una personalización de Squarespace puede alterar márgenes o estilos del
  mockup. Se mitiga con un paquete aislado, sin JavaScript obligatorio, y una
  comparación visual antes de sustituir la página actual.
- Integrar #304 y copiar también la web produciría dos fuentes de verdad. La
  propuesta debe cerrarse, no integrarse, cuando el nuevo repositorio esté listo.
- El repositorio será público y hará públicas las capturas. Esto es coherente con
  mostrarlas en la página, pero debe aceptarse de forma explícita.
- La publicación web no publica una nueva versión de la app ni crea un enlace de
  TestFlight.
- Los cambios futuros de marca deberán copiarse deliberadamente a `motu-web`; no
  habrá una dependencia automática con el proyecto iOS.

## Pruebas automáticas y manuales

Automáticas:

- ejecutar `npm test` en cada propuesta de `motu-web`;
- verificar que todas las imágenes y destinos internos existen;
- impedir que se añada el enlace ficticio de TestFlight.

Manuales antes de sustituir la página de Squarespace:

- comparar la vista publicada con el mockup aprobado;
- revisar escritorio, tableta y teléfono sin desplazamiento horizontal;
- abrir el menú móvil y recorrer los enlaces;
- comprobar que «Solicitar acceso» prepara el correo correcto;
- comprobar que las cuatro capturas se cargan y que Mótumotu sigue siendo
  secundario.

Manuales después de actualizar Squarespace:

- comprobar HTTPS en `mootuapp.com` y `www.mootuapp.com`;
- comprobar que `legal.mootuapp.com` no cambió;
- repetir una navegación completa desde una red distinta.

## Exclusiones

- No cambiar la app iOS ni Apple Watch.
- No modificar el motor, Supabase o Cloud Run.
- No lanzar TestFlight.
- No añadir analítica, cookies, formularios o cuentas.
- No migrar contenido de Squarespace que no forme parte del mockup aprobado.

## Estimación

- Extracción, controles y vista previa en GitHub Pages: entre una y dos horas.
- Revisión visual y preparación del bloque de Squarespace: alrededor de una hora.
- Sustitución manual de la página de inicio: unos minutos de trabajo de Eduardo,
  más una revisión final en escritorio y teléfono.

Son dos entregas independientes: primero el repositorio con una vista previa;
después, y solo con esa evidencia, la actualización manual en Squarespace.
