# 0002. Separate Penanganan Putusan Lifecycle Linked by perkaraId

**Status**: accepted

`Penanganan Putusan` (`putusanRecords`) is modeled as an independent lifecycle and module separate from `Penanganan Perkara` (`perkaraRecords`), linked back to its originating case via `perkaraId`. We chose a dedicated post-verdict module over keeping verdict follow-up (`tindakLanjut`, `tuntutanAkhir`, `statusBHT`) strictly as sub-fields inside `PerkaraRecord` because verdict execution, compliance tracking, and post-verdict reporting operate with their own workflow, team assignment, and completion criteria.

## Consequences

- `Monitoring` (`Monitoring Putusan`) currently merges `perkaraRecords` and `putusanRecords` by `id`; as the domain matures, `putusanRecords` should carry an explicit `perkaraId` reference instead of shallow-cloning `PerkaraRecord` on forward (`handleForwardPerkara`), preventing silent field drift between litigation updates and verdict follow-up.
