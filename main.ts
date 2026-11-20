// Leonida Field Manual — entrypoint (Node 22, standard library only).
// The guide is plain static files in app/ (index.html, ES modules, CSS and
// app/data/trophies.json), offline by construction. This program hands it in:
// it copies app/ and screenshots/ beside this file into /output and writes
// /output/dossier.json with the kit's vendored library. vendor/makefun-frontend.ts
// stays exactly as the kit ships it — the scorer rebuilds the dossier with its
// own copy and requires the two to match byte for byte.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's caps for this bounty (reference/gate.json): at most 4 screenshots
// of 256 KiB, app/ at most 993 files and 48 MiB, dossier text at most 160 KiB.
const dossier = buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(out, 'dossier.json'), dossier);
console.log(`Leonida Field Manual handed in: dossier.json is ${dossier.length} bytes.`);
