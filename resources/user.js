// ============================================================
// Datcord - Optimized Firefox Preferences for Discord
// ============================================================
// These prefs are optimized for Discord as a PWA in the
// Datcord/Neutron Gecko engine. Apply to your profile or
// include in the build.
// ============================================================

// --- PERFORMANCE & HARDWARE ACCELERATION ---
// Enable WebGL for Discord's hardware-accelerated rendering
user_pref("webgl.disabled", false);
user_pref("webgl.force-enabled", true);
user_pref("layers.acceleration.force-enabled", true);
user_pref("gfx.webrender.all", true);
user_pref("gfx.webrender.enabled", true);
user_pref("media.hardware-video-decoding.force-enabled", true);
user_pref("media.hardware-video-decoding.enabled", true);
user_pref("media.navigator.mediadatadecoder.hardware-enabled", true);

// --- DISCORD-SPECIFIC FIXES ---
// Fix Discord's voice/video calls
user_pref("media.peerconnection.enabled", true);
user_pref("media.peerconnection.ice.obfuscate_host_addresses", false);
user_pref("media.getusermedia.browser.enabled", true);
user_pref("media.getusermedia.screensharing.enabled", true);
user_pref("media.navigator.permission.disabled", true);
user_pref("media.autoplay.default", 0); // Allow autoplay for voice channels
user_pref("media.autoplay.blocking_policy", 0);
user_pref("media.autoplay.allow-http-background", true);

// Enable screen sharing for Discord
user_pref("media.getusermedia.screensharing.allow_on_old_hosts", true);

// --- NOTIFICATIONS ---
user_pref("permissions.default.desktop-notification", 0); // Ask
user_pref("dom.webnotifications.enabled", true);
user_pref("dom.webnotifications.requireuserinteraction", false);
user_pref("alerts.useSystemBackend", true);
user_pref("alerts.enable_sound", true);
user_pref("alerts.showFavicons", true);

// --- PRIVACY & TELEMETRY (keep Discord happy, kill Mozilla tracking) ---
user_pref("datareporting.policy.dataSubmissionEnabled", false);
user_pref("datareporting.healthreport.uploadEnabled", false);
user_pref("datareporting.sessions.current.clean", true);
user_pref("devtools.onboarding.telemetry.logged", false);
user_pref("toolkit.telemetry.archive.enabled", false);
user_pref("toolkit.telemetry.batchPingEnabled", false);
user_pref("toolkit.telemetry.enabled", false);
user_pref("toolkit.telemetry.unified", false);
user_pref("toolkit.telemetry.server", "data:,");
user_pref("toolkit.telemetry.cachedClientID", "");
user_pref("browser.ping-centre.telemetry", false);
user_pref("browser.newtabpage.activity-stream.feeds.telemetry", false);
user_pref("browser.newtabpage.activity-stream.telemetry", false);

// --- TRACKING PROTECTION (discord needs some 3rd party) ---
user_pref("privacy.trackingprotection.enabled", false);
user_pref("privacy.trackingprotection.pbmode.enabled", true);
user_pref("privacy.trackingprotection.fingerprinting.enabled", false);
user_pref("privacy.trackingprotection.cryptomining.enabled", true);
user_pref("privacy.trackingprotection.socialtrack.enabled", false);
user_pref("browser.contentblocking.category", "custom");
user_pref("network.cookie.cookieBehavior", 0); // Accept all cookies (Discord needs this)

// --- CACHE & STORAGE (for Discord's heavy caching) ---
user_pref("browser.cache.disk.capacity", 512000); // 500MB cache
user_pref("browser.cache.memory.capacity", 65536); // 64MB memory cache
user_pref("browser.cache.disk.enable", true);
user_pref("browser.cache.disk_cache_ssl", true);
user_pref("browser.sessionhistory.max_total_viewers", 8);
user_pref("browser.sessionhistory.contentViewerTimeout", 3600);
user_pref("browser.sessionhistory.max_entries", 50);

// --- UI TWEAKS ---
user_pref("browser.tabs.loadInBackground", true);
user_pref("browser.tabs.loadBookmarksInBackground", true);
user_pref("browser.tabs.warnOnClose", false);
user_pref("browser.tabs.warnOnCloseOtherTabs", false);
user_pref("browser.tabs.warnOnOpen", false);
user_pref("browser.sessionstore.max_tabs_undo", 0);
user_pref("browser.sessionstore.restore_on_demand", true);
user_pref("browser.sessionstore.restore_tabs_lazily", true);

// --- DISABLE UNNECESSARY FIREFOX FEATURES ---
user_pref("extensions.pocket.enabled", false);
user_pref("browser.newtabpage.activity-stream.feeds.snippets", false);
user_pref("browser.newtabpage.activity-stream.feeds.section.topstories", false);
user_pref("browser.newtabpage.activity-stream.section.highlights.includePocket", false);
user_pref("browser.newtabpage.activity-stream.showSponsored", false);
user_pref("browser.newtabpage.activity-stream.showSponsoredTopSites", false);
user_pref("browser.newtabpage.activity-stream.default.sites", "");
user_pref("browser.newtabpage.enabled", false);
user_pref("browser.startup.page", 0);
user_pref("browser.startup.homepage", "about:blank");

// Disable password manager (Discord has its own)
user_pref("signon.rememberSignons", false);
user_pref("signon.autofillForms", false);
user_pref("signon.formlessCapture.enabled", false);

// Disable form autofill
user_pref("dom.forms.autocomplete.formautofill", false);

// --- NETWORK OPTIMIZATIONS ---
user_pref("network.http.max-connections", 256);
user_pref("network.http.max-connections-per-server", 64);
user_pref("network.http.max-persistent-connections-per-server", 16);
user_pref("network.http.pacing.requests.enabled", false);
user_pref("network.http.pacing.requests.burst", 100);
user_pref("network.websocket.max-connections", 200);
user_pref("network.websocket.timeout.ping.request", 0);
user_pref("network.dns.disablePrefetch", false);
user_pref("network.dns.disableIPv6", false);
user_pref("network.trr.mode", 0); // Use standard DNS, not DoH

// --- WEBRTC / VOICE OPTIMIZATIONS ---
user_pref("media.peerconnection.turn.disable", false);
user_pref("media.peerconnection.use_document_iceservers", true);
user_pref("media.peerconnection.ice.relay_only", false);
user_pref("media.peerconnection.ice.default_address_only", false);
user_pref("media.peerconnection.ice.no_host", false);
user_pref("media.peerconnection.ice.link_local", false);
user_pref("media.peerconnection.ice.obfuscate_host_addresses", false);
user_pref("media.peerconnection.ice.tcp", true);
user_pref("media.peerconnection.ice.stun_client_max_transmits", 8);

// --- DOWNLOADS ---
user_pref("browser.download.useDownloadDir", true);
user_pref("browser.download.dir", "/home/natalie/Downloads");
user_pref("browser.download.folderList", 1);
user_pref("browser.download.manager.addToRecentDocs", true);
user_pref("browser.download.manager.resumeOnWaking", true);

// --- ENABLE EXTENSIONS ---
user_pref("xpinstall.signatures.required", false);
user_pref("extensions.langpacks.signatures.required", false);
user_pref("extensions.allow-npn-auth", true);
user_pref("extensions.experiments.enabled", true);
user_pref("extensions.manifestV3.enabled", true);
user_pref("extensions.autoDisableScopes", 0);
user_pref("extensions.enabledScopes", 15);

// --- STORAGE (for Discord's IndexedDB) ---
user_pref("dom.indexedDB.enabled", true);
user_pref("dom.storage.default_quota", 2048); // 2GB storage quota
user_pref("dom.storage.snapshot_reusing", true);

// --- USER AGENT (identify as Firefox/Datcord) ---
// Keep default Firefox UA for Discord compatibility

// --- ALLOW POPUPS FOR DISCORD AUTH ---
user_pref("dom.disable_open_during_load", false);
user_pref("dom.popup_allowed_events", "click dblclick mousedown pointerdown");

// --- DISABLE AUTO-UPDATE (we manage updates) ---
user_pref("app.update.enabled", false);
user_pref("app.update.auto", false);
user_pref("browser.search.update", false);

// --- SMOOTHER SCROLLING ---
user_pref("general.smoothScroll", true);
user_pref("mousewheel.min_line_scroll_amount", 15);
user_pref("mousewheel.system_scroll_override_on_root_content.enabled", true);
user_pref("mousewheel.system_scroll_override_on_root_content.horizontal.factor", 200);
user_pref("mousewheel.system_scroll_override_on_root_content.vertical.factor", 200);

// --- MEMORY MANAGEMENT ---
user_pref("browser.sessionhistory.max_total_viewers", 4);
user_pref("browser.sessionhistory.contentViewerTimeout", 720);
user_pref("browser.sessionstore.interval", 60000); // Save session every 60s
user_pref("dom.ipc.processCount", 8); // More content processes for stability
user_pref("dom.ipc.processCount.extension", 4);
user_pref("dom.ipc.processCount.file", 4);

// --- FONTS ---
user_pref("gfx.downloadable_fonts.enabled", true);
user_pref("gfx.downloadable_fonts.woff2.enabled", true);
user_pref("gfx.font_rendering.graphite.enabled", true);
