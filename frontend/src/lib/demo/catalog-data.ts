import type { Category, ProductSpec, ProductVariant, ShippingRule } from "@/lib/api/contract";

/**
 * Catálogo fictício usado enquanto o backend não existe.
 * As imagens são ilustrações provisórias geradas por scripts/generate-demo-art.mjs.
 */

export interface DemoProduct {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  publishedAt: string;
  isNew: boolean;
  description: string;
  specs: ProductSpec[];
  variantLabel: string | null;
  variants: ProductVariant[];
}

export const DEMO_CARE_TEXT =
  "Guarde a peça em local seco, separada das demais, de preferência no saquinho que a acompanha. " +
  "Limpe com flanela própria para prata e evite contato com perfume, cremes, cloro e água do mar.";

export const demoCategories: Category[] = [
  {
    slug: "aneis",
    name: "Anéis",
    description: "Aparadores, solitários e anéis de destaque, com numeração do 12 ao 22.",
  },
  {
    slug: "colares",
    name: "Colares",
    description: "Correntes e colares com pingente, em comprimentos de 40 a 50 cm.",
  },
  {
    slug: "brincos",
    name: "Brincos",
    description: "Argolas, pontos de luz e brincos longos para o dia a dia e para a noite.",
  },
  {
    slug: "pulseiras",
    name: "Pulseiras",
    description: "Pulseiras de elos, riviera e braceletes abertos.",
  },
  {
    slug: "pingentes",
    name: "Pingentes",
    description: "Pingentes avulsos para combinar com a corrente que você já tem.",
  },
];

export const demoShippingRule: ShippingRule = {
  defaultCents: 2490,
  byState: { SP: 1490, RJ: 1890, MG: 1890 },
  freeAboveCents: 39900,
};

const RING_SIZES = [12, 14, 16, 18, 20, 22] as const;

function ringVariants(id: string, sku: string, priceCents: number, stock: number[]): ProductVariant[] {
  return RING_SIZES.map((size, i) => ({
    id: `${id}-a${size}`,
    sku: `${sku}-${size}`,
    label: `Aro ${size}`,
    priceCents,
    available: stock[i] ?? 0,
  }));
}

function lengthVariants(
  id: string,
  sku: string,
  options: { cm: number; priceCents: number; available: number }[],
): ProductVariant[] {
  return options.map((o) => ({
    id: `${id}-${o.cm}`,
    sku: `${sku}-${o.cm}`,
    label: `${o.cm} cm`,
    priceCents: o.priceCents,
    available: o.available,
  }));
}

function single(id: string, sku: string, priceCents: number, available: number): ProductVariant[] {
  return [{ id: `${id}-u`, sku, label: null, priceCents, available }];
}

function specs(material: string, finish: string, weight: string, size: string): ProductSpec[] {
  return [
    { label: "Material", value: material },
    { label: "Acabamento", value: finish },
    { label: "Peso aproximado", value: weight },
    { label: "Medidas", value: size },
  ];
}

const SILVER = "Prata 925";
const SILVER_ZIRCON = "Prata 925 e zircônia";

export const demoProducts: DemoProduct[] = [
  {
    id: "p01",
    slug: "anel-aparador-liso",
    name: "Anel Aparador Liso",
    categorySlug: "aneis",
    publishedAt: "2026-10-28",
    isNew: true,
    description:
      "Aro fino e liso, pensado para usar sozinho ou acompanhar outros anéis no mesmo dedo.",
    specs: specs(SILVER, "Polido", "1,2 g", "Largura de 2 mm"),
    variantLabel: "Numeração",
    variants: ringVariants("p01", "AN-APL", 8900, [3, 5, 6, 4, 2, 0]),
  },
  {
    id: "p02",
    slug: "anel-trancado",
    name: "Anel Trançado",
    categorySlug: "aneis",
    publishedAt: "2026-09-15",
    isNew: false,
    description: "Dois fios de prata entrelaçados formam um aro com textura e brilho em todos os ângulos.",
    specs: specs(SILVER, "Polido", "2,8 g", "Largura de 4 mm"),
    variantLabel: "Numeração",
    variants: ringVariants("p02", "AN-TRA", 14900, [1, 2, 3, 3, 1, 1]),
  },
  {
    id: "p03",
    slug: "anel-solitario-zirconia",
    name: "Anel Solitário Zircônia",
    categorySlug: "aneis",
    publishedAt: "2026-08-20",
    isNew: false,
    description: "Uma zircônia de 5 mm presa por quatro garras sobre um aro delicado.",
    specs: [
      ...specs(SILVER_ZIRCON, "Polido", "2,1 g", "Pedra de 5 mm"),
      { label: "Pedra", value: "Zircônia incolor" },
    ],
    variantLabel: "Numeração",
    variants: ringVariants("p03", "AN-SOL", 16900, [2, 4, 4, 2, 1, 0]),
  },
  {
    id: "p04",
    slug: "anel-martelado",
    name: "Anel Martelado",
    categorySlug: "aneis",
    publishedAt: "2026-07-02",
    isNew: false,
    description: "Aro largo com superfície martelada à mão, que reflete a luz em pequenos pontos.",
    specs: specs(SILVER, "Martelado e fosco", "3,4 g", "Largura de 6 mm"),
    variantLabel: "Numeração",
    variants: ringVariants("p04", "AN-MAR", 18900, [0, 0, 0, 0, 0, 0]),
  },
  {
    id: "p05",
    slug: "anel-duas-voltas",
    name: "Anel Duas Voltas",
    categorySlug: "aneis",
    publishedAt: "2026-10-05",
    isNew: false,
    description: "Dois aros unidos em um só, com leve desencontro entre eles.",
    specs: specs(SILVER, "Polido", "2,6 g", "Largura total de 5 mm"),
    variantLabel: "Numeração",
    variants: ringVariants("p05", "AN-DUV", 15900, [2, 2, 3, 2, 0, 1]),
  },
  {
    id: "p06",
    slug: "colar-gota",
    name: "Colar Gota",
    categorySlug: "colares",
    publishedAt: "2026-10-30",
    isNew: true,
    description: "Pingente em formato de gota, polido dos dois lados, em corrente veneziana fina.",
    specs: specs(SILVER, "Polido", "3,1 g", "Pingente de 12 mm"),
    variantLabel: "Comprimento",
    variants: lengthVariants("p06", "CO-GOT", [
      { cm: 40, priceCents: 19900, available: 3 },
      { cm: 45, priceCents: 19900, available: 4 },
      { cm: 50, priceCents: 19900, available: 2 },
    ]),
  },
  {
    id: "p07",
    slug: "corrente-veneziana",
    name: "Corrente Veneziana",
    categorySlug: "colares",
    publishedAt: "2026-06-18",
    isNew: false,
    description: "Corrente de elos quadrados, firme e discreta, que recebe qualquer pingente.",
    specs: specs(SILVER, "Polido", "2,4 g a 3,0 g", "Espessura de 1 mm"),
    variantLabel: "Comprimento",
    variants: lengthVariants("p07", "CO-VEN", [
      { cm: 40, priceCents: 12900, available: 6 },
      { cm: 45, priceCents: 13900, available: 5 },
      { cm: 50, priceCents: 14900, available: 3 },
    ]),
  },
  {
    id: "p08",
    slug: "colar-ponto-de-luz",
    name: "Colar Ponto de Luz",
    categorySlug: "colares",
    publishedAt: "2026-09-01",
    isNew: false,
    description: "Uma zircônia em aro de prata, presa diretamente à corrente.",
    specs: specs(SILVER_ZIRCON, "Polido", "1,9 g", "Pedra de 4 mm"),
    variantLabel: "Comprimento",
    variants: lengthVariants("p08", "CO-PDL", [
      { cm: 40, priceCents: 15900, available: 4 },
      { cm: 45, priceCents: 15900, available: 0 },
    ]),
  },
  {
    id: "p09",
    slug: "colar-medalha-lisa",
    name: "Colar Medalha Lisa",
    categorySlug: "colares",
    publishedAt: "2026-05-10",
    isNew: false,
    description: "Medalha redonda e lisa, com espaço para gravação, em corrente cartier.",
    specs: specs(SILVER, "Polido", "4,2 g", "Medalha de 15 mm"),
    variantLabel: "Comprimento",
    variants: lengthVariants("p09", "CO-MED", [
      { cm: 45, priceCents: 22900, available: 2 },
      { cm: 50, priceCents: 22900, available: 2 },
    ]),
  },
  {
    id: "p10",
    slug: "argola-fina",
    name: "Argola Fina",
    categorySlug: "brincos",
    publishedAt: "2026-04-22",
    isNew: false,
    description: "Argola leve de fio redondo, com fecho de pressão.",
    specs: specs(SILVER, "Polido", "1,6 g o par", "Diâmetro de 15 mm"),
    variantLabel: null,
    variants: single("p10", "BR-ARF", 9900, 8),
  },
  {
    id: "p11",
    slug: "argola-media",
    name: "Argola Média",
    categorySlug: "brincos",
    publishedAt: "2026-10-25",
    isNew: true,
    description: "Argola tubular de 25 mm, encorpada e leve ao mesmo tempo.",
    specs: specs(SILVER, "Polido", "3,2 g o par", "Diâmetro de 25 mm"),
    variantLabel: null,
    variants: single("p11", "BR-ARM", 12900, 5),
  },
  {
    id: "p12",
    slug: "brinco-ponto-de-luz",
    name: "Brinco Ponto de Luz",
    categorySlug: "brincos",
    publishedAt: "2026-08-08",
    isNew: false,
    description: "Zircônia de 4 mm em aro de prata, com tarraxa.",
    specs: specs(SILVER_ZIRCON, "Polido", "0,9 g o par", "Pedra de 4 mm"),
    variantLabel: null,
    variants: single("p12", "BR-PDL", 8900, 1),
  },
  {
    id: "p13",
    slug: "brinco-longo-folha",
    name: "Brinco Longo Folha",
    categorySlug: "brincos",
    publishedAt: "2026-03-14",
    isNew: false,
    description: "Folhas alongadas com nervuras marcadas e acabamento envelhecido.",
    specs: specs(SILVER, "Envelhecido", "3,8 g o par", "Comprimento de 45 mm"),
    variantLabel: null,
    variants: single("p13", "BR-FOL", 17900, 3),
  },
  {
    id: "p14",
    slug: "pulseira-riviera",
    name: "Pulseira Riviera",
    categorySlug: "pulseiras",
    publishedAt: "2026-07-27",
    isNew: false,
    description: "Zircônias de 2 mm lado a lado em toda a volta, com extensor de 2 cm.",
    specs: specs(SILVER_ZIRCON, "Polido", "6,5 g", "18 cm + extensor de 2 cm"),
    variantLabel: null,
    variants: single("p14", "PU-RIV", 28900, 2),
  },
  {
    id: "p15",
    slug: "bracelete-aberto-liso",
    name: "Bracelete Aberto Liso",
    categorySlug: "pulseiras",
    publishedAt: "2026-02-11",
    isNew: false,
    description: "Bracelete rígido com abertura lateral, que se ajusta levemente ao pulso.",
    specs: specs(SILVER, "Polido", "9,0 g", "Largura de 5 mm, ajustável"),
    variantLabel: null,
    variants: single("p15", "PU-BRA", 21900, 4),
  },
  {
    id: "p16",
    slug: "pulseira-elos-portugueses",
    name: "Pulseira Elos Portugueses",
    categorySlug: "pulseiras",
    publishedAt: "2026-10-18",
    isNew: true,
    description: "Elos ovais entrelaçados, com fecho lagosta.",
    specs: specs(SILVER, "Polido", "7,8 g a 8,6 g", "Elos de 6 mm"),
    variantLabel: "Comprimento",
    variants: lengthVariants("p16", "PU-ELO", [
      { cm: 18, priceCents: 24900, available: 3 },
      { cm: 20, priceCents: 26900, available: 2 },
    ]),
  },
  {
    id: "p17",
    slug: "pingente-lua",
    name: "Pingente Lua",
    categorySlug: "pingentes",
    publishedAt: "2026-10-12",
    isNew: true,
    description: "Lua crescente polida, com argola que passa por correntes de até 2 mm.",
    specs: specs(SILVER, "Polido", "1,4 g", "Altura de 14 mm"),
    variantLabel: null,
    variants: single("p17", "PI-LUA", 7900, 7),
  },
  {
    id: "p18",
    slug: "pingente-coracao-vazado",
    name: "Pingente Coração Vazado",
    categorySlug: "pingentes",
    publishedAt: "2026-01-30",
    isNew: false,
    description: "Contorno de coração em fio de prata, leve e delicado.",
    specs: specs(SILVER, "Polido", "1,1 g", "Altura de 13 mm"),
    variantLabel: null,
    variants: single("p18", "PI-COR", 8900, 0),
  },
];
