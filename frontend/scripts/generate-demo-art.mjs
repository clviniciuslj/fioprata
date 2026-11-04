// Gera as ilustrações provisórias dos produtos de demonstração em public/demo-art.
// Uso: node scripts/generate-demo-art.mjs
// Cada produto ganha duas imagens: a peça inteira e um detalhe ampliado.
// Substitua por fotografias reais assim que existirem.

import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../public/demo-art/", import.meta.url));
const W = 800;
const H = 1000;

const defs = `
<defs>
  <linearGradient id="s" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#fdfdfe"/>
    <stop offset=".32" stop-color="#bcc3ca"/>
    <stop offset=".52" stop-color="#7b848e"/>
    <stop offset=".72" stop-color="#e2e6ea"/>
    <stop offset="1" stop-color="#959da6"/>
  </linearGradient>
  <linearGradient id="d" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#9aa2ab"/>
    <stop offset="1" stop-color="#5d656e"/>
  </linearGradient>
  <linearGradient id="old" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#c9ced3"/>
    <stop offset=".45" stop-color="#6c747c"/>
    <stop offset=".7" stop-color="#a7aeb5"/>
    <stop offset="1" stop-color="#4f565d"/>
  </linearGradient>
  <radialGradient id="g" cx=".35" cy=".3" r=".85">
    <stop offset="0" stop-color="#ffffff"/>
    <stop offset=".55" stop-color="#e6ecf1"/>
    <stop offset="1" stop-color="#b3bec9"/>
  </radialGradient>
  <filter id="blur" x="-20%" y="-50%" width="140%" height="200%">
    <feGaussianBlur stdDeviation="14"/>
  </filter>
</defs>`;

const shadow = (cx, cy, rx) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${Math.round(rx / 8)}" fill="#23272c" opacity=".10" filter="url(#blur)"/>`;

// Aro visto de cima, em perspectiva.
const band = (cx, cy, rx, ry, width) => `
  <ellipse cx="${cx}" cy="${cy + width * 0.8}" rx="${rx}" ry="${ry}" fill="none" stroke="url(#d)" stroke-width="${width}"/>
  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="url(#s)" stroke-width="${width}"/>
  <ellipse cx="${cx}" cy="${cy - width * 0.2}" rx="${rx - width * 0.3}" ry="${ry - width * 0.2}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="3" pathLength="100" stroke-dasharray="18 82" stroke-dashoffset="-58"/>`;

const CHAIN = "M210 120 C 250 640, 550 640, 590 120";
const chain = (width = 7, dash = "14 5", cap = "round") => `
  <path d="${CHAIN}" fill="none" stroke="#7b848e" stroke-width="${Math.max(2, width / 3)}"/>
  <path d="${CHAIN}" fill="none" stroke="url(#s)" stroke-width="${width}" stroke-dasharray="${dash}" stroke-linecap="${cap}"/>`;

const bail = (cx, cy, r = 12) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="url(#s)" stroke-width="6"/>`;

// Argola aberta no topo.
const hoop = (cx, cy, r, width) => `
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="url(#d)" stroke-width="${width}" pathLength="100" stroke-dasharray="95 5" stroke-dashoffset="-2.5" transform="rotate(-90 ${cx} ${cy}) translate(4 0)"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="url(#s)" stroke-width="${width}" pathLength="100" stroke-dasharray="95 5" stroke-dashoffset="-2.5" transform="rotate(-90 ${cx} ${cy})"/>`;

const stud = (cx, cy) => `
  <circle cx="${cx}" cy="${cy}" r="46" fill="url(#g)" stroke="url(#s)" stroke-width="12"/>
  <path d="M${cx - 22} ${cy} L${cx + 22} ${cy} M${cx} ${cy - 22} L${cx} ${cy + 22}" stroke="#9aa5b0" stroke-width="2" opacity=".6"/>
  <path d="M${cx + 40} ${cy - 58} l6 16 16 6 -16 6 -6 16 -6 -16 -16 -6 16 -6z" fill="#fff" opacity=".9"/>`;

const leaf = (cx, top) => `
  <path d="M${cx} ${top - 50} q-16 0 -16 18 q0 14 16 14" fill="none" stroke="url(#s)" stroke-width="5"/>
  <path d="M${cx} ${top} C ${cx + 64} ${top + 100}, ${cx + 62} ${top + 290}, ${cx} ${top + 390} C ${cx - 62} ${top + 290}, ${cx - 64} ${top + 100}, ${cx} ${top} Z" fill="url(#old)" stroke="#5d656e" stroke-width="2"/>
  <path d="M${cx} ${top + 20} L${cx} ${top + 370}" stroke="#454c53" stroke-width="3"/>
  ${[90, 160, 230, 300]
    .map(
      (y) =>
        `<path d="M${cx} ${top + y} l34 -34 M${cx} ${top + y + 18} l-34 -34" stroke="#454c53" stroke-width="2" opacity=".8"/>`,
    )
    .join("")}`;

const arts = [
  {
    slug: "anel-aparador-liso",
    body: shadow(400, 690, 200) + band(400, 560, 180, 68, 16),
  },
  {
    slug: "anel-trancado",
    body:
      shadow(400, 700, 210) +
      band(400, 560, 190, 72, 30) +
      `<ellipse cx="400" cy="560" rx="190" ry="72" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="30" stroke-dasharray="7 15"/>`,
  },
  {
    slug: "anel-solitario-zirconia",
    body: `
      ${shadow(400, 790, 170)}
      <circle cx="414" cy="600" r="150" fill="none" stroke="url(#d)" stroke-width="20"/>
      <circle cx="400" cy="600" r="150" fill="none" stroke="url(#s)" stroke-width="20"/>
      <path d="M372 452 L380 420 M428 452 L420 420" stroke="url(#s)" stroke-width="8" stroke-linecap="round"/>
      <polygon points="400,350 456,404 400,452 344,404" fill="url(#g)" stroke="#9aa3ad" stroke-width="3"/>
      <path d="M344 404 L456 404 M372 376 L400 452 L428 376" fill="none" stroke="#a9b3bd" stroke-width="2"/>`,
    detail: "250 300 300 375",
  },
  {
    slug: "anel-martelado",
    body:
      shadow(400, 710, 215) +
      band(400, 560, 190, 76, 42) +
      `<ellipse cx="400" cy="552" rx="190" ry="76" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="7" stroke-dasharray="1 17" stroke-linecap="round"/>
       <ellipse cx="400" cy="568" rx="190" ry="76" fill="none" stroke="#5d656e" stroke-opacity=".35" stroke-width="6" stroke-dasharray="1 23" stroke-linecap="round"/>`,
  },
  {
    slug: "anel-duas-voltas",
    body: shadow(400, 720, 220) + band(380, 520, 175, 66, 18) + band(425, 585, 175, 66, 18),
  },
  {
    slug: "colar-gota",
    body: `
      ${shadow(400, 760, 90)}
      ${chain()}
      ${bail(400, 522)}
      <path d="M400 535 C 368 600, 360 650, 400 674 C 440 650, 432 600, 400 535 Z" fill="url(#s)" stroke="#8b939c" stroke-width="2"/>
      <ellipse cx="388" cy="628" rx="9" ry="22" fill="#fff" opacity=".6"/>`,
    detail: "250 380 300 375",
  },
  {
    slug: "corrente-veneziana",
    body: shadow(400, 700, 160) + chain(11, "15 6", "butt"),
  },
  {
    slug: "colar-ponto-de-luz",
    body: `
      ${shadow(400, 700, 90)}
      ${chain(5, "10 4")}
      <circle cx="400" cy="532" r="22" fill="url(#g)" stroke="url(#s)" stroke-width="7"/>
      <path d="M430 498 l4 11 11 4 -11 4 -4 11 -4 -11 -11 -4 11 -4z" fill="#fff"/>`,
    detail: "280 420 240 300",
  },
  {
    slug: "colar-medalha-lisa",
    body: `
      ${shadow(400, 760, 110)}
      ${chain(6, "12 4")}
      ${bail(400, 522)}
      <circle cx="400" cy="604" r="72" fill="url(#s)" stroke="#8b939c" stroke-width="2"/>
      <circle cx="400" cy="604" r="60" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="3"/>`,
    detail: "250 430 300 375",
  },
  {
    slug: "argola-fina",
    body: shadow(400, 720, 280) + hoop(270, 540, 120, 10) + hoop(530, 540, 120, 10),
  },
  {
    slug: "argola-media",
    body: shadow(400, 740, 300) + hoop(260, 540, 135, 24) + hoop(540, 540, 135, 24),
  },
  {
    slug: "brinco-ponto-de-luz",
    body: shadow(400, 640, 200) + stud(300, 520) + stud(500, 520),
    detail: "220 400 360 450",
  },
  {
    slug: "brinco-longo-folha",
    body: shadow(400, 800, 200) + leaf(300, 330) + leaf(500, 330),
  },
  {
    slug: "pulseira-riviera",
    body: `
      ${shadow(400, 700, 260)}
      <ellipse cx="400" cy="568" rx="240" ry="110" fill="none" stroke="url(#d)" stroke-width="12"/>
      <ellipse cx="400" cy="560" rx="240" ry="110" fill="none" stroke="#8e97a1" stroke-width="28" stroke-dasharray="0 34" stroke-linecap="round"/>
      <ellipse cx="400" cy="558" rx="240" ry="110" fill="none" stroke="#f7f9fb" stroke-width="19" stroke-dasharray="0 34" stroke-linecap="round"/>`,
  },
  {
    slug: "bracelete-aberto-liso",
    body: `
      ${shadow(400, 710, 260)}
      <ellipse cx="400" cy="585" rx="230" ry="105" fill="none" stroke="url(#d)" stroke-width="34" pathLength="100" stroke-dasharray="88 12" stroke-dashoffset="-6"/>
      <ellipse cx="400" cy="560" rx="230" ry="105" fill="none" stroke="url(#s)" stroke-width="34" pathLength="100" stroke-dasharray="88 12" stroke-dashoffset="-6"/>`,
  },
  {
    slug: "pulseira-elos-portugueses",
    body: `
      ${shadow(400, 700, 260)}
      <ellipse cx="400" cy="570" rx="235" ry="108" fill="none" stroke="url(#d)" stroke-width="20" stroke-dasharray="26 8" stroke-linecap="round"/>
      <ellipse cx="400" cy="558" rx="235" ry="108" fill="none" stroke="url(#s)" stroke-width="22" stroke-dasharray="26 8" stroke-linecap="round"/>
      <ellipse cx="400" cy="554" rx="235" ry="108" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="4" stroke-dasharray="20 14" stroke-linecap="round"/>`,
  },
  {
    slug: "pingente-lua",
    body: `
      ${shadow(400, 760, 130)}
      <mask id="m"><rect width="${W}" height="${H}" fill="#fff"/><circle cx="470" cy="520" r="132" fill="#000"/></mask>
      <circle cx="400" cy="560" r="150" fill="url(#s)" mask="url(#m)"/>
      ${bail(318, 418, 16)}`,
  },
  {
    slug: "pingente-coracao-vazado",
    body: `
      ${shadow(400, 760, 150)}
      <path d="M400 700 C 250 600, 220 480, 290 430 C 340 395, 390 420, 400 470 C 410 420, 460 395, 510 430 C 580 480, 550 600, 400 700 Z" fill="none" stroke="url(#d)" stroke-width="18" transform="translate(5 6)"/>
      <path d="M400 700 C 250 600, 220 480, 290 430 C 340 395, 390 420, 400 470 C 410 420, 460 395, 510 430 C 580 480, 550 600, 400 700 Z" fill="none" stroke="url(#s)" stroke-width="18"/>
      ${bail(400, 448, 14)}`,
  },
];

function svg(body, viewBox, background) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${W}" height="${H}">${defs}
<rect x="-100" y="-100" width="${W + 200}" height="${H + 200}" fill="${background}"/>
${body}
</svg>
`;
}

mkdirSync(OUT, { recursive: true });
for (const art of arts) {
  writeFileSync(`${OUT}${art.slug}.svg`, svg(art.body, `0 0 ${W} ${H}`, "#edeff1"));
  writeFileSync(`${OUT}${art.slug}-detalhe.svg`, svg(art.body, art.detail ?? "160 260 480 600", "#e4e7ea"));
}
console.log(`${arts.length * 2} ilustrações geradas em ${OUT}`);
