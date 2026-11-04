import type { Metadata } from "next";
import { dataSource } from "@/lib/api/data-source";
import { Container } from "@/components/ui/container";
import { CheckoutFlow } from "@/components/checkout/checkout-flow";

export const metadata: Metadata = { title: "Finalizar compra", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <Container className="py-10 lg:py-14">
      <h1 className="font-display text-5xl lg:text-6xl">Finalizar compra</h1>
      <div className="mt-8">
        <CheckoutFlow demo={dataSource() === "demo"} />
      </div>
    </Container>
  );
}
