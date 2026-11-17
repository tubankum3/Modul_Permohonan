# 0001. Client-Side In-Memory State for Prototype

**Status**: accepted

All application state (permohonan, handling records, user accounts, role switching, audit trails, and simulated Nadine integrations) lives in a client-side Zustand store (`useAdvokasiStore.ts`) seeded from `initialData.ts`, while `server.js` only serves the static Vite build. We chose this over building a database-backed API right now so stakeholders can validate all Satker, e-Advokasi, and Nadine workflows immediately in a frontend prototype without backend provisioning or auth lock-in.

## Consequences

- State resets on page reload; role-based access control (`Super Admin`, `Manajer`, `Operator`, `Pegawai`) is enforced strictly in UI routing/guards rather than a server trust boundary.
- Currently, `PendampinganRecord`, `PerkaraRecord`, and `TelaahanRecord` inherit `Permohonan` and reuse `permohonan.id` (and `handleAssignToExisting` merges attachments without storing M:N `permohonanIds`). When migrating to a backend database, intake records and handling records should be separated into distinct entities with a many-to-many join table.
