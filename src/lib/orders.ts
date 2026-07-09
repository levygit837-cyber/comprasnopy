import { getSupabaseServerClient } from "@/lib/supabase/server";

export type OrderStatus = "pending" | "paid" | "completed" | "cancelled";

export interface OrderLine {
  productId: string;
  name: string;
  strength: string;
  qty: number;
  priceUSD: number;
}

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  totalUSD: number;
  currency: "USD" | "BRL" | "PYG";
  lines: OrderLine[];
}

/**
 * Returns the current user's orders with status `paid` or `completed`. When
 * Supabase isn't configured, returns an empty array so the page renders the
 * empty state instead of crashing. The query assumes the schema defined in
 * the README (orders + order_lines tables joined on order_id).
 */
export async function getMyOrders(): Promise<Order[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return [];

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, created_at, status, total_usd, currency, order_lines ( product_id, name, strength, qty, price_usd )",
    )
    .eq("user_id", user.id)
    .in("status", ["paid", "completed"])
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return (data as Record<string, unknown>[]).map((row) => {
    const lines = Array.isArray(row.order_lines) ? row.order_lines : [];
    return {
      id: String(row.id),
      createdAt: String(row.created_at ?? ""),
      status: (row.status as OrderStatus) ?? "paid",
      totalUSD: Number(row.total_usd ?? 0),
      currency: (row.currency as Order["currency"]) ?? "USD",
      lines: lines.map((l) => ({
        productId: String(l.product_id ?? ""),
        name: String(l.name ?? ""),
        strength: String(l.strength ?? ""),
        qty: Number(l.qty ?? 0),
        priceUSD: Number(l.price_usd ?? 0),
      })),
    };
  });
}
