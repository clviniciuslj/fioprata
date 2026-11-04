import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Carrinho",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <Container className="py-10 lg:py-14">
      <h1 className="font-display text-5xl lg:text-6xl">Carrinho</h1>
      <div className="mt-8">
        <CartView />
      </div>
    </Container>
  );
}
