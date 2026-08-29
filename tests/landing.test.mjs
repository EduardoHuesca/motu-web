import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(here, "..");
const html = readFileSync(resolve(siteRoot, "index.html"), "utf8");

test("la página usa la marca y la promesa aprobadas", () => {
  assert.match(html, /Todo tu movimiento\./);
  assert.match(html, /Por fin <span>conectado\.<\/span>/);
  assert.match(html, /Un loop simple\./);
  assert.match(html, /Resultados reales\./);
});

test("las cuatro pantallas reales están presentes", () => {
  for (const asset of [
    "assets/fuerza-motu.jpg",
    "assets/mapa-motu.jpg",
    "assets/progreso-motu.jpg",
    "assets/constancia-motu.jpg"
  ]) {
    assert.match(html, new RegExp(asset.replace(".", "\\.")));
    assert.equal(existsSync(resolve(siteRoot, asset)), true, `${asset} debe existir`);
  }
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
