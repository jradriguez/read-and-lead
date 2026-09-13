# Native development smoke checks

Target: `com.readandlead.prototype`, using a locally compiled custom development
client and synthetic data only. `smoke.yaml` runs the first lesson, restart,
parent-gate rejection, second lesson and another restart in that order. A failure
stops dependent checks. **The first flow clears all data in this app install.**
Select a disposable simulator/emulator explicitly; never target a real learner.

Use the [authorized toolchain](../docs/toolchain.md#authorized-native-build-setup).
Start Metro against the same input copy used to build the installed app:

```sh
CI=1 NODE_OPTIONS=--dns-result-order=ipv4first scripts/native-tools.sh \
  node_modules/.bin/expo start outputs/native-build-EYvdgD \
  --dev-client --localhost --port 8081
```

For the dedicated Android emulator, map the loopback Metro port:

```sh
scripts/native-tools.sh adb -s emulator-5580 reverse tcp:8081 tcp:8081
scripts/native-tools.sh maestro --udid emulator-5580 test .maestro/smoke.yaml \
  --test-output-dir outputs/maestro-android
```

For iOS, substitute the UUID of the dedicated disposable simulator in Maestro's
`--udid` argument. `npm run test:native` also targets the ordered smoke flow, but
without an explicit device; prefer the command above whenever several are booted.
Do not run another Maestro command against a device while its test is active.

The shared startup helper enters the local Metro URL when the launcher is visible,
dismisses only Expo development onboarding/menu, and waits for the actual workshop.
It handles the iOS manual-URL disclosure and denies the AOSP keyboard's optional
contacts request if present. The test does not add permissions to Read to Lead,
change app gates, contact a cloud test service or approve draft lessons.

The initial native runs exposed launcher/deep-link, keyboard-dismissal and developer
menu setup failures, plus a finish control below the Android landscape viewport.
The flow now scrolls that control into view. Those attempts are retained as failed/interrupted evidence;
they are not app passes. Current results live in
[validation](../docs/validation.md) and [device validation](../docs/device-validation.md).

These checks prove only the exercised adult debug journeys. Physical touch/drag,
assistive technology, audio quality/interruption, confirmed reset, backup/transfer,
first launch without a network and release no-egress remain separate acceptance
checks. No hard-coded parent answer or content-approval bypass is used.
