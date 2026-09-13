# Prototype data map

| Data | Storage / retention | Transmission |
| --- | --- | --- |
| One anonymous learner slot | Fixed local key, no name or demographic fields | None by application logic |
| Attempt ID, session ID, activity/lesson version, outcome, hint count, timestamp | SQLite details retained 90 days; pruning on open aggregates outcomes then removes details transactionally | None by application logic |
| Completed lesson versions / robot parts | SQLite until parent reset; each lesson earns at most one displayed part | None |
| Aggregate outcome counts | SQLite until parent reset | None |
| Audio / motion preferences | In memory for this session; OS reduced motion also honored | None |
| Bundled lesson media | Local draft speech files for adult development; future reviewed recordings bundled in app | No CDN or runtime model call |
| Microphone audio | Not requested or collected in M1 | None |

SQLite writes are parameterized and serialized. Completion and its terminal attempt
share a transaction. A failed save leaves the current activity and event ID available
for retry. Unknown newer database versions are rejected rather than reset. Parent
reset clears attempts, aggregates and completions for the local learner.

Opening progress enables and verifies SQLite `secure_delete`. Reset and pruning
also enable and verify it on their transaction connection: Expo's exclusive
transactions open a separate connection. Ordinary deleted table values are scrubbed
rather than left readable on reusable database pages. File-backed tests cover shared
and separate connections, retention boundaries and preservation of other synthetic
slots. This does not promise forensic erasure from WAL/journals, filesystem snapshots,
flash storage or previous copies. No schema change or migration is involved.

The 90-day conversion occurs when progress opens, not through a background timer
while the app is closed. Aggregate counts and completions remain until reset.
Parent information now states this timing, local reset limits and session-only
preferences. Its embedded prototype notice has no outbound link and is not an
approved public privacy policy. The arithmetic check is not legal consent.

The custom iOS config plugin creates Documents/SQLite before React starts and sets
isExcludedFromBackup on the directory, covering its database and sidecars. Failure
halts startup rather than creating an unprotected learner database. A stale or altered
protection block fails generation rather than passing on its marker alone. Android
uses `allowBackup=false` plus explicit legacy backup and modern `cloud-backup` and
`device-transfer` exclusions for all nine documented storage domains. The release
manifest removes Internet/network-state, microphone, overlay, external-storage and
advertising-ID permissions; development Metro access is separate. The generator
refuses conflicting native files and symbolic-link destinations.

These are generated-source controls. The merged release manifest, iOS protection
classes and entitlements, OS backup/restore, Android cross-platform transfer and
Samsung transfer still require native/device acceptance. No store disclosure may
claim these passed from the source alone. References:
[Android backup rules](https://developer.android.com/identity/data/autobackup),
[SQLite secure deletion](https://www.sqlite.org/pragma.html#pragma_secure_delete),
[Expo transactions](https://docs.expo.dev/versions/v57.0.0/sdk/sqlite/#withexclusivetransactionasynctask).

Only native source/config generation was verified. Expo Go uses its own host
configuration, so its data may be covered by its host's backup rules. Do not use real
child data in Expo Go. A standalone build, backup inspection and network capture are
pending; no claim of proven no-egress or store compliance is made.

## Flows outside the lesson database

| Boundary | Present behavior / remaining decision |
| --- | --- |
| Development | Expo Go/Metro and native development launcher can use local networking and host diagnostics; synthetic data only. Do not derive production privacy answers from Expo Go. |
| Native dependencies / OS | App code has no analytics collector. Actual packaged SDK behavior, system diagnostics, privacy manifests and backup/transfer need artifact inspection and connected tests; OS traffic must be distinguished from app traffic. |
| Support / website | No in-app support upload, website tracker or public privacy/support site is implemented. Before publishing, define recipient, fields, logs, retention, deletion and processor terms; prohibit unsolicited child recordings/databases. |
| Pilot observations | No child pilot has run. Keep any later approved observations outside Git and the app under the reviewed pilot procedure in the readiness plan; no names or recordings by default. |
| Signing and review | Signing keys, account access, private contracts and consent evidence remain outside Git. Build input reports contain hashes and public package metadata, not secret values or learner records. |
