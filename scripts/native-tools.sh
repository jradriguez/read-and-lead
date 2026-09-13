#!/bin/sh
# Run an existing local command with the authorized macOS native toolchain.
# This wrapper installs nothing and does not edit shell profiles.
# The selected command retains its own side effects and authorization boundary.
set -eu
read_lead_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
read_lead_tools="$read_lead_root/outputs/native-tools"

if [ "$#" -eq 0 ]; then
  echo "Usage: scripts/native-tools.sh <command> [arguments...]" >&2
  exit 2
fi

case "$1" in
  -h|--help)
    echo "Usage: scripts/native-tools.sh <command> [arguments...]"
    exit 0
    ;;
  -*)
    echo "Expected a command, not an option. Use --help for usage." >&2
    exit 2
    ;;
esac

export DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer
export JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home
export ANDROID_HOME="$read_lead_tools/android-sdk"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export ANDROID_USER_HOME="$read_lead_tools/android-user"
export ANDROID_AVD_HOME="$read_lead_tools/avd"
export GRADLE_USER_HOME="$read_lead_tools/gradle-cache"
export EXPO_NO_TELEMETRY=1
export COCOAPODS_DISABLE_STATS=true
export MAESTRO_CLI_NO_ANALYTICS=true
export MAESTRO_DISABLE_UPDATE_CHECK=true
export MAESTRO_CLI_ANALYSIS_NOTIFICATION_DISABLED=true
export PATH="$JAVA_HOME/bin:/opt/homebrew/bin:$ANDROID_HOME/cmdline-tools/15859902/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$read_lead_tools/maestro-2.10.0/maestro/bin:$PATH"

if [ ! -x "$JAVA_HOME/bin/java" ] || [ ! -x "$ANDROID_HOME/cmdline-tools/15859902/bin/sdkmanager" ]; then
  echo "Native tools are missing. See docs/toolchain.md; this wrapper does not install them." >&2
  exit 1
fi
mkdir -p "$ANDROID_USER_HOME" "$ANDROID_AVD_HOME" "$GRADLE_USER_HOME"
exec "$@"
