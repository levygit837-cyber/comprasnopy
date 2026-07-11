import { Suspense } from "react";

import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { ProductDetailDrawer } from "@/components/products/product-detail-drawer";
import { CatalogBrowser } from "@/components/products/catalog-browser";
import { CatalogPageHeader } from "@/components/products/catalog-page-header";

export const dynamic = "force-dynamic";

export default function ProductsPage() {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />

      <main className="flex-grow w-full pb-16">
        <CatalogPageHeader />

        <Suspense fallback={<div className="max-w-[1400px] mx-auto p-8 text-center text-[var(--text-muted)] text-xs">Cargando...</div>}>
          <CatalogBrowser />
        </Suspense>
      </main>

      <SiteFooter />

      <CartDrawer />
      <ProductDetailDrawer />
    </>
  );
}
