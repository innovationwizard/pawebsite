import { Toaster } from "react-hot-toast";
import { UtmNav } from "@/components/admin/utm-nav";

// UTM feature layout — sub-nav + toaster for the ported UTM screens.
// Auth is already enforced by the /admin middleware.
export default function UtmLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl">
      <Toaster position="top-right" />
      <UtmNav />
      {children}
    </div>
  );
}
