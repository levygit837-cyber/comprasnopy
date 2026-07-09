import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getMyOrders } from "@/lib/orders";
import { OrdersList } from "./orders-list";
import { OrdersPageClient } from "./orders-page-client";

export const metadata = { title: "My orders - Viana" };
export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await getMyOrders();
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main className="flex-grow w-full py-8">
        <div className="max-w-2xl mx-auto px-4">
          <OrdersPageClient empty={orders.length === 0}>
            <OrdersList orders={orders} />
          </OrdersPageClient>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
