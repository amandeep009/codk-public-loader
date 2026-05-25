(() => {
  "use strict";

  // Idempotent: prevent double-load if the wrapper tag appears twice in the theme.
  if (window.__codkWrapperLoaded) return;
  window.__codkWrapperLoaded = true;
  console.log(
    "%c████████████ codk-wrapper 4████████████",
    "font-weight: bold; font-size: 14px; background: pink; color: black; padding: 4px 8px; border-radius: 4px;",
  );

  const MAIN_SCRIPT_BASE =
    "https://cdn.shopify.com/s/files/1/1000/8018/9762/files/codk-dev-script.js";
  // Cache-buster: Date.now() forces a unique URL per page load, so Shopify CDN
  // can't return 304 Not Modified and the browser always gets the latest build.
  // Trade-off: every page load re-downloads the script (Shopify pays bandwidth).
  const SCRIPT_VERSION = "1779697165";
  const resolveShopDomain = () => {
    try {
      if (
        window.Shopify &&
        typeof window.Shopify.shop === "string" &&
        window.Shopify.shop
      ) {
        return window.Shopify.shop;
      }
    } catch (_e) {}

    // Fallback: derive from hostname if it's a *.myshopify.com origin.
    try {
      const host = (window.location && window.location.hostname) || "";
      if (host.endsWith(".myshopify.com")) return host;
    } catch (_e) {}

    return "";
  };

  const buildUrl = () => {
    const params = new URLSearchParams();
    params.set("v", SCRIPT_VERSION);
    const shop = resolveShopDomain();
    if (shop) params.set("shop", shop);
    return MAIN_SCRIPT_BASE + "?" + params.toString();
  };

  const inject = () => {
    const url = buildUrl();

    // Don't re-inject if a tag for the same base URL is already present.
    const existing = document.querySelector(
      'script[src^="' + MAIN_SCRIPT_BASE + '"]',
    );
    if (existing) return;

    const tag = document.createElement("script");
    tag.src = url;
    tag.defer = true;
    tag.async = false;
    (document.head || document.documentElement).appendChild(tag);
  };

  inject();
})();
