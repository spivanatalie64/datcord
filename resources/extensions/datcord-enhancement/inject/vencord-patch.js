// ============================================================
// Datcord - Webpack Patching Engine (Vencord-compatible)
// 
// This runs in the PAGE context (not isolated) and intercepts
// Discord's Webpack module system to enable plugin injection.
// Based on Vencord's patching architecture.
// ============================================================

(function () {
  "use strict";

  const DATCORD = window.__DATCRD__;
  if (!DATCORD) return;

  // ============================================================
  // Webpack Module Interceptor
  // ============================================================
  const WebpackInterceptor = {
    _originalPush: null,
    _moduleCache: new Map(),
    _patches: new Map(),
    _listeners: new Map(),

    // Intercept webpack chunk push
    init() {
      // Discord uses webpackJsonp or push on webpackChunkdiscord_app
      const webpackChunk = window.webpackChunkdiscord_app || [];

      // Save original push
      if (webpackChunk.push) {
        this._originalPush = webpackChunk.push.bind(webpackChunk);
      }

      // Replace with our interceptor
      webpackChunk.push = (...args) => {
        // Call original first
        if (this._originalPush) {
          this._originalPush(...args);
        }

        // Extract module factories
        const chunks = args[0];
        if (chunks && chunks[1]) {
          const moduleId = Object.keys(chunks[1])[0];
          if (moduleId) {
            const factory = chunks[1][moduleId];
            this._onModuleLoaded(moduleId, factory);
          }
        }

        return args[0];
      };

      // Also hook into webpack require for already-loaded modules
      this._hookWebpackRequire();

      DATCORD.log("Webpack interceptor initialized");
    },

    // Hook into webpack require function
    _hookWebpackRequire() {
      const findWebpackRequire = () => {
        // Look for webpackJsonp or similar
        const wp = window.webpackChunkdiscord_app;
        if (wp && wp.push && wp.push.toString) {
          // Get the webpack require function
          const requireFn = Object.values(wp).find(
            (v) => typeof v === "function" && v.toString().includes("webpack")
          );
          return requireFn;
        }
        return null;
      };

      // Try to find webpack require periodically
      let attempts = 0;
      const maxAttempts = 50;
      const checkInterval = setInterval(() => {
        const wreq = findWebpackRequire();
        if (wreq || attempts > maxAttempts) {
          clearInterval(checkInterval);
          if (wreq) {
            DATCORD.log("Webpack require found, applying patches");
            this._applyPendingPatches();
          }
        }
        attempts++;
      }, 100);
    },

    // Called when a new module is loaded
    _onModuleLoaded(id, factory) {
      this._moduleCache.set(id, factory);

      // Notify listeners
      const listeners = this._listeners.get(id);
      if (listeners) {
        listeners.forEach((cb) => cb(factory));
      }

      // Apply any pending patches for this module
      if (this._patches.has(id)) {
        const patches = this._patches.get(id);
        patches.forEach((patch) => {
          try {
            patch(factory);
          } catch (e) {
            DATCORD.error("Patch failed for module", id, e);
          }
        });
      }
    },

    // Apply patches that couldn't be applied yet
    _applyPendingPatches() {
      DATCORD.log("Applying pending patches...");
      // This would iterate pending patches and apply them
    },

    // Wait for a module to load
    waitFor(moduleId, callback) {
      if (this._moduleCache.has(moduleId)) {
        callback(this._moduleCache.get(moduleId));
        return;
      }
      if (!this._listeners.has(moduleId)) {
        this._listeners.set(moduleId, []);
      }
      this._listeners.get(moduleId).push(callback);
    },

    // Find a module by filter
    find(filter) {
      for (const [id, factory] of this._moduleCache) {
        try {
          const mod = factory();
          if (filter(mod)) return mod;
        } catch (e) {
          // Module threw, skip
        }
      }
      return null;
    },

    // Find all modules matching filter
    findAll(filter) {
      const results = [];
      for (const [id, factory] of this._moduleCache) {
        try {
          const mod = factory();
          if (filter(mod)) results.push(mod);
        } catch (e) {
          // skip
        }
      }
      return results;
    },
  };

  // ============================================================
  // Plugin System
  // ============================================================
  const PluginManager = {
    _plugins: new Map(),

    register(plugin) {
      if (!plugin.name) {
        DATCORD.error("Plugin must have a name");
        return;
      }

      this._plugins.set(plugin.name, plugin);
      DATCORD.registerPlugin(plugin.name, plugin);

      // Initialize plugin
      if (plugin.start) {
        try {
          plugin.start();
          DATCORD.log(`Plugin "${plugin.name}" started`);
        } catch (e) {
          DATCORD.error(`Plugin "${plugin.name}" failed to start:`, e);
        }
      }
    },

    get(name) {
      return this._plugins.get(name);
    },

    getAll() {
      return Array.from(this._plugins.values());
    },
  };

  // ============================================================
  // Built-in Plugins
  // ============================================================

  // Plugin: Message Logger (logs deleted/edited messages)
  PluginManager.register({
    name: "MessageLogger",
    description: "Logs deleted and edited messages",
    version: "1.0.0",
    enabled: true,

    start() {
      DATCORD.log("MessageLogger: Ready");
      // Would hook into Discord's message store
    },
  });

  // Plugin: Better Voice (noise suppression, echo cancellation)
  PluginManager.register({
    name: "BetterVoice",
    description: "Enhanced voice call quality",
    version: "1.0.0",
    enabled: true,

    start() {
      DATCORD.log("BetterVoice: Ready");
      // Would enhance WebRTC settings
    },
  });

  // Plugin: Custom CSS
  PluginManager.register({
    name: "CustomCSS",
    description: "Load custom CSS themes",
    version: "1.0.0",
    enabled: true,

    _styleElement: null,

    start() {
      this._styleElement = document.createElement("style");
      this._styleElement.id = "datcord-custom-css";
      document.head.appendChild(this._styleElement);
      DATCORD.log("CustomCSS: Ready");
    },

    loadCSS(css) {
      if (this._styleElement) {
        this._styleElement.textContent = css;
      }
    },
  });

  // Plugin: Spotify Controls
  PluginManager.register({
    name: "SpotifyControls",
    description: "Enhanced Spotify integration",
    version: "1.0.0",
    enabled: true,

    start() {
      DATCORD.log("SpotifyControls: Ready");
    },
  });

  // ============================================================
  // Native Bridge (communicates with the C++ launch-app)
  // ============================================================
  const NativeBridge = {
    _connected: false,

    async connect() {
      try {
        // Try to connect via native messaging
        const port = browser.runtime.connectNative("datcord.native");
        if (port) {
          port.onMessage.addListener((msg) => {
            this._handleMessage(msg);
          });
          this._port = port;
          this._connected = true;
          DATCORD.nativeBridge = this;
          DATCORD.log("Native bridge connected");
        }
      } catch (e) {
        DATCORD.warn("Native bridge not available:", e.message);
      }
    },

    _handleMessage(msg) {
      DATCORD.log("Native message:", msg);
    },

    send(message) {
      if (this._port) {
        this._port.postMessage(message);
      }
    },
  };

  // ============================================================
  // Initialize Everything
  // ============================================================
  function init() {
    DATCORD.log("Initializing Webpack patching engine...");

    // Export API
    window.__DATCRD__.webpack = WebpackInterceptor;
    window.__DATCRD__.plugins = PluginManager;

    // Start webpack interceptor
    WebpackInterceptor.init();

    // Try native bridge
    NativeBridge.connect();

    DATCORD.log("Datcord Enhancement Engine fully initialized");
    DATCORD.log("Plugins loaded:", PluginManager.getAll().length);
  }

  // Fire at document_start BEFORE Discord loads
  init();
})();
