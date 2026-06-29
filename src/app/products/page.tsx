import Link from "next/link";
import { Suspense } from "react";

import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { ProductDetailDrawer } from "@/components/products/product-detail-drawer";
import { CatalogBrowser } from "@/components/products/catalog-browser";

export const dynamic = "force-dynamic";

export default function ProductsPage() {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />

      <main className="flex-grow w-full pb-16">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pt-4 pb-3 border-b border-[var(--bg-border)]">
          <div className="text-[10px] font-bold text-[var(--text-subtle)] uppercase tracking-widest mb-2 flex items-center gap-2">
            <Link href="/" className="hover:text-[var(--brand-green)]">
              Inicio
            </Link>
            <span>/</span>
            <span className="text-[var(--brand-green)]">Catalogo</span>
          </div>
          <h1 className="font-sans text-2xl md:text-3xl text-[var(--brand-green)] font-semibold tracking-tight">
            Todos los productos
          </h1>
        </div>

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
