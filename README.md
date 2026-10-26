# LoopFit

A fashion exchange prototype combining YouCam AI appearance previews with two- and three-person clothing exchanges. Built for the YouCam hackathon.

## Deployed website

[Open LoopFit](https://loopfit-exchange.ananyadn678.chatgpt.site/)

The deployment is private. Sign in with an authorized account; judges must be granted access before testing.

## What works
- Editorial wardrobe demo with clearly labeled seeded participants.
- AI Studio: consenting person photo + garment photo, authenticated YouCam request, task polling and deletion.
- Shared invitation-only events: accounts list their own pieces, save preferences, approve exchanges and confirm receipt independently.
- New listings include chest circumference, length, style and front/condition photos.
- Matching respects saved pieces and any configured size/style/measurement preferences within the same event.
- Meeting details require agreement; changing a pending proposal resets approvals.

## Consumer value
A direct swap needs two people to want each other's garments. LoopFit can connect a three-person cycle, creating additional exchange possibilities. Appearance previews help people picture a piece, while measurements and condition photos help them decide whether to inspect it in person. Preview images do not guarantee physical fit. No environmental savings or pilot traction is claimed.

## YouCam integration
Uses Perfect Corp YouCam AI Clothes Try-On V3, via its server-to-server API. The server prepares upload slots, uploads the consenting person's photo and garment, submits a clothes task, polls its status and supports task deletion. The key stays server-side. See `app/api/preview/route.ts` for the exact endpoints. Generation consumes provider credits; no automatic generation retry is made after an uncertain submission.

## Run locally
Requires Node.js >=22.13, npm and Git.

```sh
npm ci
```

Create an untracked `.dev.vars` file in the root containing your own API key:

```dotenv
YOUCAM_API_KEY=your_key_here
```

Build, then apply the schema to the local D1 database:

```sh
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_swift_joseph.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_shocking_malcolm_colcord.sql
npm run dev
```

Apply each migration only once per local database. Open the printed localhost URL (normally http://127.0.0.1:5173).

Local sign-in uses a loopback-only development identity. It cannot demonstrate three independent accounts. Hosted authentication is supplied by Sites; deploying on another host requires an equivalent trusted identity integration. Do not expose the local development server to the internet.

## Verify
```sh
npx tsc --noEmit
node --experimental-strip-types --test tests/*.test.ts
npm run build
```

16 domain tests cover exchange discovery, approvals, ownership, preferences, condition requirements and handover protection. Browser checks covered listing upload and preference persistence. A real three-account rehearsal and a completed YouCam generation/deletion still require end-to-end verification.

## Hosting
This project targets Sites on Cloudflare Workers with D1 (`DB`) and R2 (`BUCKET`). `.openai/hosting.json` identifies the original Site. Register a separate Site for your own deployment rather than publishing to that ID. Configure `YOUCAM_API_KEY` through hosting secrets. Production migrations apply during Sites deployment. Runtime data, API keys and local test databases are not in this repository.

## Submission material
- `docs/SUBMISSION.md`: project description and submission checklist.
- `docs/screenshots/`: application screenshots.
- `presentation/LoopFit-demo.pptx`: two-slide visual introduction.
- `presentation/demo-script.md`: recording sequence, including the new matching features.

The slide artwork and seeded garments are AI-generated illustrations, not real users or successful YouCam outputs. A public demo-video link must be added to the hackathon submission after recording. Avoid showing API keys, private participant information or unlicensed music.

## License and attribution
Original project code is MIT licensed; see LICENSE. Third-party packages retain their own licenses. Vendored Sites integrations retain their included license notices. AI-generated sample imagery is supplied for the prototype and is labeled in the interface. Fonts load from Google Fonts with system fallbacks.
