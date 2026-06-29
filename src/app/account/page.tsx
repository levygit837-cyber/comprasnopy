import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AccountShell } from "@/components/auth/account-shell";

export const metadata = { title: "Mi cuenta - Viana" };

export default function AccountPage() {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />

      <main className="flex-grow w-full py-12">
        <div className="max-w-xl mx-auto px-4">
          <h1 className="font-sans text-3xl font-semibold text-[var(--brand-green)] tracking-tight mb-6">
            Mi cuenta
          </h1>
          <AccountShell />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
