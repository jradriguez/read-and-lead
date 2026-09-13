# Security and privacy boundary

Use synthetic learner data in development. The M1 learner identifier is the constant
`local-learner`; never replace it with a child's name, email or birthday. Keep real
observations, database files, recordings, signing material and exports out of Git.

The child runtime has no application server, identity provider, microphone capture,
advertising, analytics service, remote content or generative model. Development tools
can use network connections; Expo Go is not a privacy or offline release test.

The release content check must reject unreviewed content and stale digests. Never
approve an asset based only on an automated test. The parent arithmetic gate is
friction, not authentication or legal consent.

Use [private vulnerability reporting](https://github.com/jradriguez/read-and-lead/security/advisories/new)
for security reports, or an already trusted private channel if GitHub is unavailable.
Do not open a public issue containing child information, device databases or secrets.
