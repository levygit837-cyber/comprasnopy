import { Suspense } from "react";

import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SettingsShell } from "./settings-shell";

export const metadata = { title: "Settings - Compraspy" };

export default function SettingsPage() {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main className="flex-grow w-full py-8">
        <div className="max-w-xl mx-auto px-4">
          <Suspense fallback={null}>
            <SettingsShellWrapper />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

/**
 * The SettingsShell renders its own translated <h1>. This wrapper exists
 * to keep the page-level title in sync with the active language once the
 * user has interacted with the language switcher, even though Next.js
 * metadata is set on the server. (Browser tab title still uses the static
 * metadata; the visible in-page title is fully reactive.)
 */
function SettingsShellWrapper() {
  return <SettingsShell />;
}
