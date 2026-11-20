// The platinum roadmap: eight stages in play order, built from the official
// trophy descriptions. Each stage lists the trophy ids it covers.
export const ROADMAP_STAGES = [
  {
    num: 1,
    title: 'First steps',
    text: 'Play the opening mission Gone Fishing and finish Chapter 1. Before the chapter ends, meditate on Lucia\u2019s balcony — it counts toward Positive Mental Attitude and the spot is gone after Chapter 1.',
    ids: [2, 3],
  },
  {
    num: 2,
    title: 'The story',
    text: 'Chapters 2, 3 and 4, the named story missions and the final mission. All 12 story trophies unlock automatically as you play; none can be missed, but there is no mission replay, so keep a manual save at the start of every chapter.',
    ids: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  },
  {
    num: 3,
    title: 'Side characters',
    text: 'Finish the mission strands for Andy, Kenton, Billy, Randy and Tyrone, and close 8 stranger strands across Leonida. Strands stay open in free roam, so do them as you find them.',
    ids: [22, 23, 24, 25, 26, 27],
  },
  {
    num: 4,
    title: 'Activities & skills',
    text: 'Sample every activity, then grind the big ones: 250 stunts, gold in all 42 Shooting Range challenges, 14 drone-race wins, 20 race wins, the fishing challenge against Cal, one arcade game, 18 meditation spots and Bret\u2019s unique-animal hunt.',
    ids: [15, 16, 17, 18, 19, 20, 21, 28, 29],
  },
  {
    num: 5,
    title: 'Collectibles & the map',
    text: 'Three card sets, 100 WAiNK scans, 100 vehicles discovered, 52 areas explored, 50 challenges and a game of bowling at Kolt & Associates. Fold all of this into exploration instead of saving it for one sweep.',
    ids: [30, 31, 32, 35, 42, 44, 46],
  },
  {
    num: 6,
    title: 'Crime sprees',
    text: 'The robbery set: shops with your partner, bank vaults, armored trucks, one illegal operation per gang, the jewelry store job, the airport departure, the Rhino and the melee drive-by. Robbery trophies open up in Chapters 3 and 4.',
    ids: [33, 34, 36, 37, 38, 39, 40, 41, 43, 45, 51],
  },
  {
    num: 7,
    title: 'Money & the long tail',
    text: 'Launder $250,000 of Marked Bills, spend $100,000 in shops, buy all 8 garages, register 10 vehicles to Scooter Bros, and let the choice counter and the oddities land as you play.',
    ids: [47, 48, 49, 50, 52, 53, 54, 55],
  },
  {
    num: 8,
    title: 'The platinum',
    text: 'Reach 100% completion on the in-game checklist, which opens after the story — then Vice Got a Price! pops. Roughly 200 hours all in; no online trophies and no difficulty trophies stand in the way.',
    ids: [14, 1],
  },
];

export function renderRoadmap(timelineEl, trophies, earnedSet) {
  timelineEl.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const li = document.createElement('li');
    li.className = 'stage';
    const done = stage.ids.filter((id) => {
      const t = trophies.find((x) => x.id === id);
      return t && earnedSet.has(t.name);
    }).length;
    const num = document.createElement('span');
    num.className = 'stage-num';
    num.textContent = stage.num;
    const h = document.createElement('h3');
    h.textContent = `Stage ${stage.num} — ${stage.title}`;
    const p = document.createElement('p');
    p.textContent = stage.text;
    const prog = document.createElement('p');
    prog.className = 'stage-progress';
    prog.textContent = `${done} of ${stage.ids.length} trophies earned in this stage`;
    const list = document.createElement('ul');
    list.className = 'stage-trophies';
    for (const id of stage.ids) {
      const t = trophies.find((x) => x.id === id);
      if (!t) continue;
      const chip = document.createElement('li');
      if (earnedSet.has(t.name)) chip.className = 'done';
      chip.textContent = t.name;
      list.append(chip);
    }
    li.append(num, h, p, prog, list);
    timelineEl.append(li);
  }
}
