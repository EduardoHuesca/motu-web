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
  assert.match(html, /<link rel="icon" href="assets\/motu-favicon\.png" type="image\/png" sizes="192x192">/);
  assert.equal(existsSync(resolve(siteRoot, favicon)), true, `${favicon} debe existir`);
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
