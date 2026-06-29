import { notFound } from "next/navigation";

import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { ProductDetailView } from "@/components/products/product-detail-view";
import { products } from "@/lib/products";
import { getGroupedProducts } from "@/lib/variants";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const allGroups = getGroupedProducts(products);
  const match = allGroups.find((g) => g.primary.id === product.id);
  const variants = match?.isGroup ? match.variants : [product];

  return (
    <>
      <AnnouncementBar />
      <SiteHeader />

      <main className="flex-grow w-full">
        <ProductDetailView product={product} variants={variants} />
      </main>

      <SiteFooter />

      <CartDrawer />
    </>
  );
}
