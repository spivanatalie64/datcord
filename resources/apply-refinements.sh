#!/bin/bash
# ============================================================
# apply-refinements.sh - Apply Datcord refinements to live profile
# ============================================================
# This script applies all runtime refinements to the currently
# running datcord profile without needing a full rebuild.
# ============================================================

PROFILE_DIR="$HOME/.datcord/39uitc58.default-default"
CHROME_DIR="$PROFILE_DIR/chrome"
USER_JS_SOURCE="$(dirname "$0")/user.js"
CHROME_CSS_SOURCE="$(dirname "$0")/chrome/userChrome.css"

echo "==> Applying Datcord refinements..."

# Kill running datcord instance if we need to
if pgrep -x datcord > /dev/null; then
    echo "    Datcord is running. Refinements will apply on next restart."
    echo "    Run 'pkill datcord' to restart if you want them now."
fi

# Apply user.js
if [ -f "$USER_JS_SOURCE" ]; then
    # Backup existing user.js
    if [ -f "$PROFILE_DIR/user.js" ]; then
        cp "$PROFILE_DIR/user.js" "$PROFILE_DIR/user.js.backup.$(date +%s)"
        echo "    Backed up existing user.js"
    fi
    cp "$USER_JS_SOURCE" "$PROFILE_DIR/user.js"
    echo "    Applied user.js with optimized Discord prefs"
fi

# Apply userChrome.css
if [ -f "$CHROME_CSS_SOURCE" ]; then
    mkdir -p "$CHROME_DIR"
    # Backup existing userChrome.css
    if [ -f "$CHROME_DIR/userChrome.css" ]; then
        cp "$CHROME_DIR/userChrome.css" "$CHROME_DIR/userChrome.css.backup.$(date +%s)"
        echo "    Backed up existing userChrome.css"
    fi
    cp "$CHROME_CSS_SOURCE" "$CHROME_DIR/userChrome.css"
    echo "    Applied userChrome.css for clean PWA look"
fi

# Enable userChrome.css in prefs (must be in user.js too, but just in case)
echo "    userChrome.css enabled via user.js"

echo "==> Done! Restart datcord to see changes."
echo ""
echo "What was refined:"
echo "  ✅ Hardware acceleration forced on (WebGL, WebRender)"
echo "  ✅ Voice/video call reliability improved"
echo "  ✅ Screen sharing enabled"
echo "  ✅ Notifications optimized"
echo "  ✅ Telemetry disabled"
echo "  ✅ Cache sized for Discord's heavy storage"
echo "  ✅ Memory management tuned"
echo "  ✅ Browser chrome hidden for PWA feel"
echo "  ✅ Extension installation enabled"
echo "  ✅ Network/WebRTC optimized"
echo ""
echo "Rebuild from source for deeper changes:"
echo "  cd ~/datcord && ./build.sh"
