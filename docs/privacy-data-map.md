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

The custom iOS config plugin creates Documents/SQLite before React starts and sets
isExcludedFromBackup on the directory, covering its database and sidecars. Failure
halts startup rather than creating an unprotected learner database. Android generated
manifest uses allowBackup=false and fullBackupContent=false. Device-to-device transfer
behavior on supported manufacturers still needs a physical-device audit.

Only native source/config generation was verified. Expo Go uses its own host
configuration, so its data may be covered by its host's backup rules. Do not use real
child data in Expo Go. A standalone build, backup inspection and network capture are
pending; no claim of proven no-egress or store compliance is made.
