// ============================================================
// Datcord Enhancement - Script Injector
// Injects the Vencord-compatible modding engine into Discord's
// page context at document_start, before any Discord code runs.
// ============================================================

(function () {
  "use strict";

  const DATCORD_BRAND = `
   ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄
  ▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌
  ▐░█▀▀▀▀▀▀▀▀▀ ▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀▀▀
  ▐░▌          ▐░▌       ▐░▌▐░▌       ▐░▌▐░▌       ▐░▌▐░▌
  ▐░█▄▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄█░▌▐░▌       ▐░▌▐░█▄▄▄▄▄▄▄█░▌▐░▌
  ▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░▌
   ▀▀▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀█░▌▐░▌       ▐░▌▐░█▀▀▀▀▀▀▀█░▌▐░▌
            ▐░▌▐░▌       ▐░▌▐░▌       ▐░▌▐░▌       ▐░▌▐░▌
   ▄▄▄▄▄▄▄▄▄█░▌▐░▌       ▐░▌▐░█▄▄▄▄▄▄▄█░▌▐░▌       ▐░▌▐░█▄▄▄▄▄▄▄▄▄
  ▐░░░░░░░░░░░▌▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░▌       ▐░▌▐░░░░░░░░░░░▌
   ▀▀▀▀▀▀▀▀▀▀▀  ▀         ▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀         ▀  ▀▀▀▀▀▀▀▀▀▀▀
  ==================================================================
        Datcord v0.7.0 - Firefox-based Discord client
        Enhancement Suite loaded at ${new Date().toISOString()}
  ==================================================================`;

  // Inject a script element into the page context
  function injectScript(code) {
    try {
      const script = document.createElement("script");
      if (typeof code === "string") {
        script.textContent = code;
      } else {
        script.src = browser.runtime.getURL(code);
      }
      script.id = "datcord-injected";
      document.documentElement.appendChild(script);
      // Don't remove - the page context script needs to persist
    } catch (e) {
      console.error("[Datcord] Failed to inject script:", e);
    }
  }

  // Inject CSS into the page
  function injectCSS(css) {
    try {
      const style = document.createElement("style");
      style.id = "datcord-styles";
      style.textContent = css;
      document.documentElement.appendChild(style);
    } catch (e) {
      console.error("[Datcord] Failed to inject CSS:", e);
    }
  }

  // Main injection sequence
  function init() {
    console.log("[Datcord] Injecting enhancement suite...");

    // Step 1: Patch the page to expose our API bridge
    injectScript(`
      (function() {
        'use strict';
        // Datcord API bridge - available as window.__DATCRD__
        window.__DATCRD__ = {
          version: '0.7.0',
          platform: 'firefox',
          build: 'gecko',
          nativeBridge: null,
          plugins: new Map(),
          settings: {},

          // Register a plugin
          registerPlugin(name, plugin) {
            this.plugins.set(name, plugin);
            if (typeof plugin.onLoad === 'function') {
              try { plugin.onLoad(); } catch(e) { console.error('[Datcord] Plugin ' + name + ' load error:', e); }
            }
          },

          // Log with datcord branding
          log(...args) { console.log('[Datcord]', ...args); },
          warn(...args) { console.warn('[Datcord]', ...args); },
          error(...args) { console.error('[Datcord]', ...args); },
        };

        console.log('%c%s', 'color: #5865F2; font-weight: bold; font-size: 14px;', 'Datcord Enhancement Suite loaded');
      })();
    `);

    // Step 2: Inject default styles
    injectCSS(`
      /* Datcord custom styles */
      .datcord-indicator {
        display: none !important;
      }
    `);

    // Step 3: Load Vencord-compatible modding engine
    // This will be loaded from the inject/ directory
    const vencordPatchUrl = browser.runtime.getURL("inject/vencord-patch.js");
    injectScript(vencordPatchUrl);

    console.log("[Datcord] Enhancement suite injection complete");
  }

  // Wait for document to be ready but fire immediately at document_start
  if (document.readyState === "loading") {
    init();
  } else {
    // document_start should always have loading state, but just in case
    init();
  }
})();
