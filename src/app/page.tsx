import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { ProductDetailDrawer } from "@/components/products/product-detail-drawer";
import { HeroSection } from "@/components/home/hero-section";
import { MarqueePartners } from "@/components/home/marquee-partners";
import { BentoCategories } from "@/components/home/bento-categories";
import { BestSellers } from "@/components/home/best-sellers";
import { FirstBuyGuide } from "@/components/home/first-buy-guide";

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />

      <main className="flex-grow w-full pb-12">
        <div className="h-3 md:h-4" />
        <HeroSection />
        <MarqueePartners />
        <BentoCategories />
        <BestSellers />
        <FirstBuyGuide />
      </main>

      <SiteFooter />

      <CartDrawer />
      <ProductDetailDrawer />
    </>
  );
}
