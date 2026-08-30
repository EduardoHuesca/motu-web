import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const toolsDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(toolsDirectory, "..");
const assetBase = "https://eduardohuesca.github.io/motu-web/assets/";
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

${wrapper} {
  width: 100vw;
  margin-left: calc(50% - 50vw);
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
</style>

<div id="motu-landing">
${squarespaceBody}
</div>
`;

const destination = resolve(siteRoot, "squarespace/motu-code-block.html");
mkdirSync(dirname(destination), { recursive: true });
writeFileSync(destination, output);

console.log("Paquete de Squarespace actualizado.");
