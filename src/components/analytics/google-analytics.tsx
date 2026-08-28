"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Google tag (gtag.js) for GA4, loaded on every public route.
 *
 * The tag is not rendered under /admin so internal dashboard sessions never
 * reach the property. Because GA4 Enhanced Measurement keeps auto-tracking
 * client-side navigations through browser history events once gtag has loaded,
 * unmounting alone is not enough: we also flip Google's documented
 * `window['ga-disable-<MEASUREMENT_ID>']` opt-out flag while inside /admin.
 */
export function GoogleAnalytics() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    (window as unknown as Record<string, boolean>)[
      `ga-disable-${GA_MEASUREMENT_ID}`
    ] = isAdmin;
  }, [isAdmin]);

  if (!GA_MEASUREMENT_ID || isAdmin) return null;

  return (
    <>
      <Script
        id="google-tag"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
