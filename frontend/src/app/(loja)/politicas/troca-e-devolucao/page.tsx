import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/config/brand";
import { Container } from "@/components/ui/container";
import { LegalReviewNotice, Prose } from "@/components/content/prose";

export const metadata: Metadata = {
  title: "Troca e devolução",
  description: "Como desistir de uma compra, trocar uma peça ou resolver um defeito.",
};

export default function ReturnsPolicyPage() {
  const { contact } = brand;
  return (
    <Container className="py-10 lg:py-14">
      <h1 className="font-display text-5xl lg:text-6xl">Troca e devolução</h1>
      <LegalReviewNotice />
      <Prose>
        <h2>Desistência da compra em até 7 dias</h2>
        <p>
          Pelo Código de Defesa do Consumidor (art. 49), você pode desistir de uma compra feita pela internet em
          até <strong>7 dias corridos depois de receber o pedido</strong>, sem precisar explicar o motivo.
        </p>
        <p>
          Nesse caso, devolvemos tudo o que foi pago, incluindo o frete. A peça deve voltar com a embalagem e os
          itens que a acompanham. [Condições de conservação a revisar com o jurídico.]
        </p>

        <h2>Peça com defeito</h2>
        <p>
          Joias são produtos duráveis: você tem <strong>90 dias</strong> para nos avisar de um defeito aparente,
          contados do recebimento (art. 26 do CDC). Se o defeito só aparecer com o uso, o prazo começa quando ele for
          percebido.
        </p>
        <p>
          Temos até 30 dias para resolver. Se não for resolvido nesse prazo, você escolhe entre a troca por outra peça
          igual, a devolução do valor pago ou um abatimento proporcional no preço.
        </p>

        <h2>Troca por tamanho ou modelo</h2>
        <p>
          Fora do prazo de desistência, aceitamos troca de numeração ou de modelo em até [prazo a preencher] depois
          do recebimento, desde que a peça não tenha sinais de uso. [Condições, número de trocas e quem paga o frete a
          preencher.]
        </p>

        <h2>Como pedir</h2>
        <ul>
          <li>
            Escreva para <a href={`mailto:${contact.email}`}>{contact.email}</a> com o número do pedido e o motivo.
            O número aparece em <Link href="/minha-conta/pedidos">Meus pedidos</Link>.
          </li>
          <li>Enviamos as instruções de envio da peça. [Forma de envio e logística reversa a preencher.]</li>
          <li>
            Ao receber e conferir a peça, fazemos a troca ou o reembolso pela mesma forma de pagamento usada na
            compra, em até [prazo a preencher].
          </li>
        </ul>
      </Prose>
    </Container>
  );
}
