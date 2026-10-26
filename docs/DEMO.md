# LoopFit — demo and launch notes

## The pitch
Most clothing swaps need two people to want each other's clothes. LoopFit connects a third wardrobe: Asha wants Maya's cardigan, Maya wants Noor's overshirt, and Noor wants Asha's shirt. A closed loop gives each person a piece they actually chose.

## 90-second demo
1. Show Discover and the condition notes on an original listing (15 seconds).
2. Explain the three connected wishes and press Find my loop (15 seconds).
3. Preview as each fictional participant and approve. Two approvals are insufficient; the third reserves all pieces (25 seconds).
4. Show the YouCam preview form if configured. Use only consented real photos. Explain that appearance preview is not a fit guarantee (20 seconds).
5. Inspect, confirm handover, and complete the exchange (15 seconds).

Reset in About this demo. Test withdrawal too: it releases the pieces and permits a new proposal. Removing a saved preference cancels that participant's pending proposals.

## What is real now
- Responsive interactive wardrobe, search, size filtering, save preferences, listing form and local photo upload.
- Deterministic two/three-person cycle search, unique approvals, reservation, cancellation and handover demo.
- Browser-local persistence, clearly fictional role switching, sample imagery labels.
- Authenticated server-side YouCam V3 upload, task creation, status and delete endpoints; owner-scoped D1 job ledger, atomic daily limit of ten attempts, request-ID deduplication. Credentials never enter browser code.

## Remaining before a live hackathon submission
- Configure YOUCAM_API_KEY as a Sites runtime secret (or ignored .dev.vars for local work). Never put it in Git, a screenshot or the client bundle. Run one live generation and deletion with consenting photos. The integration has not been verified against a funded API account.
- The swap workflow is an isolated local demo, NOT a multi-user event service. Add authenticated membership, server-owned wardrobe/preferences and transactional exchange records before real participants use it.
- Add original real garment photos and condition evidence. The sage shirt is AI sample catalogue photography, the other two garments are SVG sample illustrations.
- Test provider timeouts and image quality. A task-creation timeout is ambiguous: consult the YouCam console before retrying. Uploads that fail before a task ID exists can persist until the provider's retention expiry. Completed tasks can be deleted in the UI.
- Polling resumes within the same browser session. Raw input files are sent to the provider and not kept in D1. D1 stores task IDs, owner IDs, status and timestamps. Output signed URLs are displayed only to the authorized caller; no permanent output gallery is stored.
- Replace browser-local state with versioned server records and exercise concurrent real-user approvals before any public launch.

## Developer checks
`node --experimental-strip-types --test tests/exchange.test.ts`
`npx tsc --noEmit`
`npm run dev`

Framework build and publication use the Sites helpers. D1 schema lives in db/schema.ts; migrations are tracked in drizzle/. YOUCAM_API_KEY is optional for browsing and the swap demo.

## Official integration reference
https://docs.perfectcorp.com/reference/ai_clothes
OpenAPI: https://docs.perfectcorp.com/_bundle/reference/ai_clothes.json?download=
Model: cloth-v3, upper_body. Documented cost: 2 units per task. Validate account pricing and framing guidelines before recording the final submission.

## Asset provenance
public/images/sage-shirt.png was generated with OpenAI image generation for this demo. Prompt: Single unbranded sage olive-green linen long-sleeve button-down shirt, front-facing flat lay on warm pale cream background, whole garment visible, natural soft folds, sustainable-fashion studio photography, no text, logos, props or person. It is sample catalogue imagery, never a claimed YouCam result.
