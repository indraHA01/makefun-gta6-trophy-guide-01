# Leonida Field Manual — GTA VI Trophy Guide & Tracker

[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/competitions/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/indraHA01/makefun-gta6-trophy-guide-01/rank.svg)](https://make.fun/competitions/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/indraHA01/makefun-gta6-trophy-guide-01/reward.svg)](https://make.fun/competitions/gta6-trophy-guide-01)

An offline web app — a guide and tracker for all **55 PlayStation 5 trophies** of
Grand Theft Auto VI (1 platinum, 2 gold, 6 silver, 46 bronze, 28 hidden).
Built for the [make.fun](https://make.fun/bounty/gta6-trophy-guide-01) bounty
**gta6-trophy-guide-01**.

## What it is

- **Every trophy** with its official name, description and grade as PlayStation
  publishes them, plus a field brief in our own words that cites its sources.
- **Tracker**: a checklist saved in the browser (localStorage), with export to a
  file and import back, and numeric counters for the trophies PSN tracks a
  count for (250 stunts, 42 Shooting Range challenges, 100 WAiNK spots…).
- **Filters** by kind (story, missable, collectibles, activities, crime,
  exploration, side) and by grade, plus search.
- **Spoiler setting** that hides the names and descriptions of story trophies
  until you earn them.
- **Roadmap to the platinum** as a mission timeline in 8 stages, and every
  missable trophy flagged — built from the official descriptions.
- **Offline**: static files under `app/`, no build step, no network request at
  run time. Open `app/index.html` in desktop Chrome with the network off.

## The one missable

GTA VI has **no mission replay**, so keep a manual save at the start of every
chapter. One trophy can be missed: **Positive Mental Attitude** — Lucia's
balcony meditation in Chapter 1 counts toward it and disappears after that
chapter. The app flags it and the Missables view explains the save discipline.

## How the guides are sourced

Trophy names, descriptions, grades and PSN counts come from the official list
as published on
[Exophase](https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/)
and [PSNProfiles](https://psnprofiles.com/trophies/43531-grand-theft-auto-vi).
Roadmap and missable facts are drawn from
[Sixshore's trophy list](https://sixshore.com/gta-6/guides/trophies-and-achievements/)
and [Output Lag's trophy list](https://outputlag.com/guides/gta-6-trophy-list/).
Every guide names its sources beside it; where a place or step has not been
checked in the game, the guide says so instead of inventing it. No guide text
is copied from another guide, and the app shows no Rockstar logo or official
artwork — the look is our own.

## Run it

```sh
node serve.ts        # serves app/ on http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes
`dossier.json` with the kit's `vendor/makefun-frontend.ts`.

## License

MIT — see [LICENSE](LICENSE).
