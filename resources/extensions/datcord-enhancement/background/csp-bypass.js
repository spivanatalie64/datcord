// ============================================================
// Datcord Enhancement - CSP Bypass
// Strips Content Security Policy headers from Discord responses
// so we can inject scripts and styles into the page context.
// ============================================================

const DISCORD_DOMAINS = [
  "*://*.discord.com/*",
  "*://*.discordapp.com/*",
  "https://cdn.discordapp.com/*",
  "https://cdn.discord.com/*",
];

// Headers to strip from Discord responses
const HEADERS_TO_REMOVE = [
  "content-security-policy",
  "content-security-policy-report-only",
  "x-content-security-policy",
  "x-webkit-csp",
  "x-frame-options",        // Allow iframes if needed
  "cross-origin-opener-policy",  // Allow cross-origin access for mods
];

// CSP bypass listener
browser.webRequest.onHeadersReceived.addListener(
  (details) => {
    // Strip restrictive headers
    details.responseHeaders = (details.responseHeaders || []).filter(
      (header) => !HEADERS_TO_REMOVE.includes(header.name.toLowerCase())
    );

    // Add permissive CSP that allows our injections
    details.responseHeaders.push({
      name: "Content-Security-Policy",
      value: [
        "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;",
        "script-src * 'unsafe-inline' 'unsafe-eval' data: blob: 'wasm-unsafe-eval';",
        "style-src * 'unsafe-inline' data: blob:;",
        "img-src * data: blob:;",
        "connect-src * data: blob:;",
        "media-src * data: blob: mediastream:;",
        "font-src * data:;",
        "worker-src * data: blob:;",
      ].join(" "),
    });

    return { responseHeaders: details.responseHeaders };
  },
  { urls: DISCORD_DOMAINS, types: ["main_frame", "sub_frame", "stylesheet", "script", "xmlhttprequest"] },
  ["blocking", "responseHeaders"]
);

// Log that we're active
console.log("[Datcord Enhancement] CSP bypass active for Discord domains");
