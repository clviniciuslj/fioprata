import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { DemoBanner } from "@/components/layout/demo-banner";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { NotFoundContent } from "@/components/content/not-found-content";

/** Endereços que não correspondem a nenhuma rota: mesma moldura da loja. */
export default function RootNotFound() {
  return (
    <>
      <DemoBanner />
      <AnnouncementBar />
      <SiteHeader />
      <main id="conteudo" className="flex-1">
        <NotFoundContent />
      </main>
      <SiteFooter />
    </>
  );
}
