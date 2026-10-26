# Matching and trust additions

Implemented in shared events (/events), not the seeded home-page participant simulator.

- Optional participant preferences: sizes, style categories and garment chest circumference range. Empty size/style lists allow any. Without preferences, saved-piece matching remains compatible with existing events.
- New listings require structured chest and length measurements, style and an extra condition photo. Both media IDs must belong to the listing account and event. Older listings remain visible, but listings without measurements fail a configured measurement preference.
- Cycle discovery and proposal item selection apply the same preference predicate. Matching never crosses event boundaries.
- New shared proposals require public meeting details. Editing these while proposed clears approvals. Reserved meetings cannot be edited; withdraw before any receipt and repropose if necessary. Partial handovers remain protected.
- Completion still requires independent receipt confirmation by every member.

Validation: TypeScript, production build and 16 domain tests pass. Browser checks confirmed preference persistence, save feedback and listing form fields. Full independent-account pilot and real YouCam result/deletion remain separate checks.

No campus identity verification, distance calculation, fit guarantee, translations or pilot traction is claimed. Images and condition statements remain owner-supplied evidence. Membership is invitation-based.
