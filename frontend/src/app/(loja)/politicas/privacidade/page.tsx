import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/config/brand";
import { Container } from "@/components/ui/container";
import { LegalReviewNotice, Prose } from "@/components/content/prose";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como tratamos seus dados pessoais, de acordo com a LGPD.",
};

export default function PrivacyPolicyPage() {
  const { legal, contact } = brand;
  return (
    <Container className="py-10 lg:py-14">
      <h1 className="font-display text-5xl lg:text-6xl">Política de Privacidade</h1>
      <LegalReviewNotice />
      <Prose>
        <p>
          Esta política explica quais dados pessoais coletamos, para que usamos e quais são os seus direitos, de
          acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Última atualização: [data a preencher].
        </p>

        <h2>Quem é responsável pelos seus dados</h2>
        <p>
          {legal.companyName}, CNPJ {legal.cnpj}, com sede em {legal.address}, responsável pela loja {brand.name}.
          Contato: <a href={`mailto:${contact.email}`}>{contact.email}</a>.
        </p>

        <h2>Quais dados coletamos</h2>
        <ul>
          <li>
            <strong>Cadastro:</strong> nome, e-mail e senha. A senha é guardada de forma protegida (hash) e nunca
            fica visível para ninguém, nem para nossa equipe.
          </li>
          <li>
            <strong>Pedidos:</strong> endereço de entrega, peças compradas, valores e o histórico de cada pedido.
          </li>
          <li>
            <strong>Navegação:</strong> um cookie de sessão, necessário para manter você conectado, e o carrinho,
            guardado no seu próprio navegador.
          </li>
        </ul>
        <p>
          Não usamos cookies de publicidade nem ferramentas de análise de terceiros. Não guardamos dados de cartão
          de crédito.
        </p>

        <h2>Para que usamos e com que base legal</h2>
        <ul>
          <li>Processar, entregar e dar suporte aos seus pedidos (execução de contrato).</li>
          <li>Emitir documentos fiscais e cumprir obrigações legais (cumprimento de obrigação legal).</li>
          <li>Proteger sua conta e prevenir fraudes (legítimo interesse).</li>
        </ul>

        <h2>Com quem compartilhamos</h2>
        <p>
          Apenas com quem precisa dos dados para concluir sua compra: transportadoras, empresa de pagamento (quando
          disponível), contabilidade e serviços de hospedagem da loja ([fornecedores a preencher]). Também podemos
          compartilhar dados quando a lei ou uma autoridade exigir.
        </p>

        <h2>Por quanto tempo guardamos</h2>
        <p>
          Os dados da conta ficam guardados enquanto ela estiver ativa. Os dados de pedidos são mantidos pelo prazo
          exigido pela legislação fiscal e de defesa do consumidor ([prazo a preencher]). Depois disso, são
          eliminados ou anonimizados.
        </p>

        <h2>Seus direitos</h2>
        <p>Você pode, a qualquer momento:</p>
        <ul>
          <li>confirmar se tratamos seus dados e ter acesso a eles;</li>
          <li>corrigir dados incompletos, inexatos ou desatualizados;</li>
          <li>pedir a anonimização, o bloqueio ou a eliminação de dados desnecessários;</li>
          <li>pedir a portabilidade dos seus dados;</li>
          <li>saber com quem compartilhamos seus dados;</li>
          <li>pedir a exclusão da sua conta, respeitados os prazos legais de guarda.</li>
        </ul>
        <p>
          Para exercer qualquer direito, escreva para <a href={`mailto:${contact.email}`}>{contact.email}</a>.
          Encarregado pelo tratamento de dados: [nome e contato a preencher].
        </p>

        <h2>Segurança</h2>
        <p>
          A loja usa conexão criptografada (HTTPS), senhas protegidas com hash e acesso restrito aos dados por
          parte da equipe. Nenhum sistema é totalmente imune a falhas; se algo acontecer, você será informado
          conforme a lei.
        </p>

        <h2>Dúvidas</h2>
        <p>
          Fale com a gente pela página de <Link href="/contato">contato</Link>.
        </p>
      </Prose>
    </Container>
  );
}
