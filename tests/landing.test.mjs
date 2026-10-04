import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(here, "..");
const html = readFileSync(resolve(siteRoot, "index.html"), "utf8");
const styles = readFileSync(resolve(siteRoot, "styles.css"), "utf8");
const script = readFileSync(resolve(siteRoot, "script.js"), "utf8");
const pagesWorkflow = readFileSync(resolve(siteRoot, ".github/workflows/pages.yml"), "utf8");
const squarespaceBlock = readFileSync(resolve(siteRoot, "squarespace/motu-code-block.html"), "utf8");

test("la página usa la marca y la promesa aprobadas", () => {
  assert.match(html, /Todo tu<br class="mobile-only-break"> movimiento\./);
  assert.match(html, /Por fin <span>conectado\.<\/span>/);
  assert.match(html, /Un loop simple\./);
  assert.match(html, /Resultados reales\./);
});

test("el sitio usa el símbolo de Mótu como favicon compatible con buscadores", () => {
  const favicon = "assets/motu-favicon.png";
  const faviconSource = readFileSync(resolve(siteRoot, "assets/motu-favicon-source.svg"), "utf8");
  assert.match(html, /<link rel="icon" href="assets\/motu-favicon\.png" type="image\/png" sizes="192x192">/);
  assert.equal(existsSync(resolve(siteRoot, favicon)), true, `${favicon} debe existir`);
  assert.doesNotMatch(faviconSource, /<rect\b/, "el favicon no debe incluir un fondo opaco");
});

test("la escena usa tres pantallas reales y una captura real del Apple Watch", () => {
  for (const asset of [
    "assets/fuerza-motu.jpg",
    "assets/mapa-motu.jpg",
    "assets/progreso-motu.jpg",
    "assets/apple-watch-motu.jpg"
  ]) {
    assert.match(html, new RegExp(asset.replace(".", "\\.")));
    assert.equal(existsSync(resolve(siteRoot, asset)), true, `${asset} debe existir`);
  }
  assert.match(html, /class="apple-watch apple-watch--hero"/);
  assert.match(html, /class="phone-scene reveal"/);
  assert.match(html, /cinema-phone--strength/);
  assert.match(html, /cinema-phone--map/);
  assert.match(html, /cinema-phone--progress/);
});

test("los dispositivos conservan una presentación física y el cierre tiene contraste", () => {
  assert.ok((html.match(/phone-button--action/g) ?? []).length >= 5);
  assert.ok((html.match(/phone-button--volume/g) ?? []).length >= 5);
  assert.match(styles, /\.phone,\s*\n\.cinema-phone\s*\{[^}]*linear-gradient[^}]*transform-style:\s*preserve-3d;/s);
  assert.match(styles, /@media \(max-width: 760px\)[\s\S]*?\.phone-scene\s*\{[^}]*display:\s*block;[^}]*perspective:\s*1100px;/);
  assert.match(styles, /\.closing h2\s*\{[^}]*color:\s*var\(--cream\);/s);
});

test("la cuadrícula anterior desapareció por completo", () => {
  assert.doesNotMatch(html, /class="steps"/);
  assert.doesNotMatch(html, /class="step-card/);
  assert.doesNotMatch(html, /class="loop-track"/);
  assert.doesNotMatch(html, /class="step-number"/);
  assert.doesNotMatch(html, /assets\/constancia-motu\.jpg/);
  assert.doesNotMatch(styles, /\.step-card\s*\{/);
  assert.doesNotMatch(styles, /\.loop-track\s*\{/);
});

test("cada imagen visible tiene texto alternativo", () => {
  const images = [...html.matchAll(/<img\s+[^>]*>/g)].map(([tag]) => tag);
  assert.ok(images.length >= 8);
  for (const image of images) {
    assert.match(image, /\salt="[^"]*"/);
  }
});

test("la navegación apunta a secciones existentes", () => {
  const localTargets = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
  for (const target of localTargets) {
    assert.match(html, new RegExp(`id="${target}"`), `falta #${target}`);
  }
});

test("solicitar acceso prepara un correo real y no inventa un enlace de TestFlight", () => {
  assert.match(html, /mailto:support@mootuapp\.com\?subject=Acceso%20a%20TestFlight/);
  assert.doesNotMatch(html, /testflight\.apple\.com\/join\/xxxx/);
});

test("el contenido sigue visible si JavaScript no se ejecuta", () => {
  assert.match(styles, /\.reveal\s*\{[^}]*opacity:\s*1;/s);
  assert.match(styles, /\.reveal\.is-pending\s*\{[^}]*opacity:\s*0;/s);
  assert.match(script, /classList\.add\("is-pending"\)/);
  assert.match(script, /classList\.remove\("is-pending"\)/);
});

test("la navegación móvil funciona con y sin JavaScript", () => {
  assert.match(script, /document\.documentElement\.classList\.add\("menu-ready"\)/);
  assert.match(styles, /html\.menu-ready \.menu-toggle\s*\{[^}]*display:\s*grid;/s);
  assert.match(styles, /\.site-nav\s*\{[^}]*visibility:\s*visible;/s);
  assert.match(styles, /html\.menu-ready \.site-nav\s*\{[^}]*visibility:\s*hidden;/s);
  assert.match(styles, /html\.menu-ready \.site-nav\.is-open\s*\{[^}]*visibility:\s*visible;/s);
});

test("GitHub Pages prueba la página antes de publicarla", () => {
  const testStep = pagesWorkflow.indexOf("run: npm test");
  const deployStep = pagesWorkflow.indexOf("uses: actions/deploy-pages");
  assert.notEqual(testStep, -1);
  assert.notEqual(deployStep, -1);
  assert.ok(testStep < deployStep);
});

test("la licencia OFL acompaña a Manrope", () => {
  const licensePath = resolve(siteRoot, "assets/OFL.txt");
  assert.equal(existsSync(licensePath), true);
  assert.match(readFileSync(licensePath, "utf8"), /SIL OPEN FONT LICENSE Version 1\.1/);
});

test("Squarespace recibe una copia aislada que funciona sin JavaScript", () => {
  assert.match(squarespaceBlock, /<meta charset="utf-8">/);
  assert.match(squarespaceBlock, /<div id="motu-landing">/);
  assert.match(squarespaceBlock, /#motu-landing \.hero/);
  assert.match(squarespaceBlock, /https:\/\/eduardohuesca\.github\.io\/motu-web\/assets\/apple-watch-motu\.jpg/);
  assert.match(squarespaceBlock, /cinema-phone--map/);
  assert.doesNotMatch(squarespaceBlock, /<script/i);
  assert.doesNotMatch(squarespaceBlock, /src="assets\//);
});

test("la portada lleva un botón de entrar al portal, visible también en móvil", () => {
  // Tiene que estar FUERA de <nav>: en móvil el menú se pliega detrás de la
  // hamburguesa, y un botón de entrar escondido en un menú no sirve de nada.
  assert.match(html, /<a class="portal-login" href="https:\/\/[^"]+\/acceso">/);
  assert.match(html, /Entrar al portal/);

  const nav = html.slice(html.indexOf('<nav class="site-nav"'), html.indexOf("</nav>"));
  assert.doesNotMatch(nav, /portal-login/, "el botón no puede vivir dentro del menú");

  // Y su destino es https, para que la sesión nunca viaje en claro.
  const destino = html.match(/class="portal-login" href="([^"]+)"/)[1];
  assert.match(destino, /^https:\/\//);

  // Estilos: alcanzable con el dedo y con foco visible para el teclado.
  // Ninguna regla puede bajar el boton de 44 px, que es el minimo para
  // tocarlo con el dedo sin fallar. La primera version lo dejaba en 40 px
  // dentro del media query del telefono, que es justo donde mas importa.
  // Las reglas que no mencionan min-height heredan el general y estan bien.
  const reglas = styles.match(/\.portal-login\s*\{[^}]*\}/gs) ?? [];
  assert.ok(reglas.length >= 2, "debe haber al menos la regla general y la de movil");
  const alturas = reglas
    .map((regla) => regla.match(/min-height:\s*(\d+)px;/))
    .filter(Boolean)
    .map((m) => Number(m[1]));
  assert.ok(alturas.length >= 2, "el general y el de movil deben fijar min-height");
  for (const alto of alturas) {
    assert.ok(alto >= 44, `una regla deja el boton en ${alto}px, por debajo de 44`);
  }
  assert.match(styles, /\.portal-login:focus-visible\s*\{[^}]*outline:/s);
});
