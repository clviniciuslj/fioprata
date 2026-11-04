/**
 * Identidade provisória da loja. O nome comercial ainda não foi definido:
 * troque os valores abaixo e o site inteiro acompanha.
 */
export const brand = {
  name: "Sua Marca",
  tagline: "Joias em prata 925",
  description:
    "Anéis, colares, brincos, pulseiras e pingentes em prata 925, com envio para todo o Brasil.",
  contact: {
    email: "contato@example.com",
    /** Número completo com DDI e DDD, só dígitos (ex.: 5511999999999). Vazio oculta o canal. */
    whatsapp: "",
    whatsappDisplay: "",
    /** Usuário sem @. Vazio oculta o canal. */
    instagram: "",
    hours: "Segunda a sexta, das 9h às 18h",
  },
  legal: {
    companyName: "[Razão social a preencher]",
    cnpj: "[CNPJ a preencher]",
    address: "[Endereço a preencher]",
  },
} as const;

export type Brand = typeof brand;
