import { redirect } from "next/navigation";

import { getSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = { title: "Mi cuenta - Viana" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) redirect("/#signin");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/account/orders");
  redirect("/#signin");
}
