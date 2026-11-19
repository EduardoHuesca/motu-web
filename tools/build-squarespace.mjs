import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const toolsDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(toolsDirectory, "..");
// Las fotos y la letra se sirven desde un subdominio propio, no desde
// `<cuenta>.github.io`. Cuando apuntaban a `eduardohuesca.github.io`, mudar el
// repo a la organización las habría dejado en blanco: GitHub no redirige
// Pages al cambiar de dueño. Con el dominio propio da igual quién sea el dueño.
const assetBase = "https://recursos.mootuapp.com/assets/";
const wrapper = "#motu-landing";

const index = readFileSync(resolve(siteRoot, "index.html"), "utf8");
const sourceStyles = readFileSync(resolve(siteRoot, "styles.css"), "utf8");

const body = index.match(/<body>([\s\S]*?)<\/body>/)?.[1];
if (!body) throw new Error("No se encontró el contenido de <body> en index.html");

const scopeSelector = (selector) => {
  const clean = selector.trim();
  if (clean === ":root" || clean === "html" || clean === "body") return wrapper;
  if (clean.startsWith("html.menu-ready")) {
    return clean.replace("html.menu-ready", `${wrapper}.menu-ready`);
  }
  if (clean.startsWith(wrapper)) return clean;
  return `${wrapper} ${clean}`;
};

// Squarespace comparte estilos con su editor. Aislamos cada selector para que
// la landing no cambie la navegación, las páginas o el pie propios del sitio.
const scopedStyles = sourceStyles
  .replaceAll('url("assets/', `url("${assetBase}`)
  .replace(/([^{}]+)\{/g, (match, prelude) => {
    const selector = prelude.trim();
    if (selector.startsWith("@")) return match;
    const leadingSpace = prelude.match(/^\s*/)?.[0] ?? "";
    const scoped = selector.split(",").map(scopeSelector).join(",\n");
    return `${leadingSpace}${scoped} {`;
  });

const squarespaceReset = `
html:has(${wrapper}),
body:has(${wrapper}) {
  margin: 0 !important;
  overflow-x: hidden !important;
  background: #080d0b !important;
}

body:has(${wrapper}) #header,
body:has(${wrapper}) footer.sections {
  display: none !important;
}

body:has(${wrapper}) #page,
body:has(${wrapper}) .page-section:has(${wrapper}) > .content-wrapper {
  max-width: none !important;
  padding: 0 !important;
}

body:has(${wrapper}) .sqs-block-code:has(${wrapper}),
body:has(${wrapper}) .sqs-block-code:has(${wrapper}) .sqs-block-content {
  padding: 0 !important;
}
`;

// Ancho completo, medido en Squarespace el 19 nov 2026.
//
// Antes se estiraba la portada con `width: 100vw; margin-left: calc(50% - 50vw)`.
// Eso solo funciona si la caja que la contiene está centrada, y aquí no lo
// está: el editor de Squarespace (Fluid Engine) mete el bloque en una celda de
// su rejilla — en computadora, 161 px pegada a la izquierda; en el teléfono,
// a 26 px del borde. Además `body { margin: 0 }` de styles.css, que aquí se
// vuelve `#motu-landing { margin: 0 }`, anulaba el margen. Resultado: la
// portada empezaba en la celda y medía 100vw desde ahí, así que su borde
// derecho quedaba fuera de la pantalla y «Entrar al portal» salía cortado.
//
// Ahora la celda ocupa la rejilla entera (con sus márgenes laterales) y la
// portada la llena al 100 %. No depende de dónde esté la celda ni del ancho de
// la barra de desplazamiento. Va al final para que nada lo pise.
const fullBleed = `
body:has(${wrapper}) .fe-block:has(${wrapper}) {
  grid-column: 1 / -1 !important;
}

${wrapper} {
  width: 100%;
  margin-left: 0;
}
`;

const squarespaceBody = body
  .replaceAll('src="assets/', `src="${assetBase}`)
  .trim();

const output = `<!--
  Generado por npm run build:squarespace.
  No editar a mano: index.html y styles.css son la fuente.
-->
<meta charset="utf-8">
<style>
${squarespaceReset}
${scopedStyles}
${fullBleed}
</style>

<div id="motu-landing">
${squarespaceBody}
</div>
`;

const destination = resolve(siteRoot, "squarespace/motu-code-block.html");
mkdirSync(dirname(destination), { recursive: true });
writeFileSync(destination, output);

console.log("Paquete de Squarespace actualizado.");
