"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

const META_PIXEL_ID = (
  process.env.NEXT_PUBLIC_META_PIXEL_ID || "1504237678012206"
).replace(/\D/g, "");

type Fbq = (...args: unknown[]) => void;

/**
 * Meta Pixel base code, loaded on every public route next to Google Analytics.
 *
 * The snippet fires one PageView on load. Client-side navigations are tracked
 * by the pixel's own history listener, so PageView is not called again from
 * the router. The tag is not rendered under /admin. Because that listener
 * keeps sending after the script has loaded, unmounting is not enough: while
 * the path is /admin we pause fires with Meta's `fbq('consent', 'revoke')`.
 */
export function MetaPixel() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    const fbq = (window as Window & { fbq?: Fbq }).fbq;
    if (!fbq) return;
    fbq("consent", isAdmin ? "revoke" : "grant");
  }, [isAdmin]);

  if (!META_PIXEL_ID || isAdmin) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height={1}
          width={1}
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
