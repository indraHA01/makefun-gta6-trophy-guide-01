// Leonida Field Manual — boot, views and wiring.
// Loads app/data/trophies.json, renders the checklist, roadmap and missables,
// and keeps progress in localStorage through js/store.js.
import { loadSave, persistSave, exportSave, importSaveFile } from './store.js';
import { KINDS, isSpoilerTrophy, trophyMatchesKind, trophyMatchesQuery, trophyMatchesGrade, trophyMatchesEarned, gradeLabel, kindLabel } from './filters.js';
import { ROADMAP_STAGES, renderRoadmap } from './roadmap.js';

const save = loadSave();
let trophies = [];
let activeKind = 'all';

const $ = (id) => document.getElementById(id);
const listEl = $('trophyList');
const searchEl = $('search');
const gradeEl = $('gradeFilter');
const earnedEl = $('earnedFilter');
const spoilerEl = $('spoilerToggle');
const spoilerEl2 = $('spoilerToggle2');

function saveState() {
  persistSave(save);
  renderProgress();
}

function renderProgress() {
  const earned = save.earned.size;
  $('earnedCount').textContent = earned;
  const fill = $('progressFill');
  fill.style.width = `${(earned / 55) * 100}%`;
  const bar = $('progressBar');
  bar.setAttribute('aria-valuenow', String(earned));
}

function counterValue(trophy) {
  return save.counters[trophy.id] ?? 0;
}

function setCounter(trophy, value) {
  const clamped = Math.max(0, Math.min(trophy.target, value));
  if (clamped === 0) delete save.counters[trophy.id];
  else save.counters[trophy.id] = clamped;
  saveState();
  renderList();
}

function buildTrophyCard(trophy) {
  const li = document.createElement('li');
  li.className = 'trophy';
  const earned = save.earned.has(trophy.name);
  if (earned) li.classList.add('earned');
  const spoiled = save.spoilersHidden && isSpoilerTrophy(trophy) && !earned;
  if (spoiled) li.classList.add('spoiled');

  const head = document.createElement('div');
  head.className = 'trophy-head';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.className = 'trophy-check';
  box.checked = earned;
  box.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
  box.addEventListener('change', () => {
    if (box.checked) save.earned.add(trophy.name);
    else save.earned.delete(trophy.name);
    saveState();
    renderList();
    renderRoadmap($('timeline'), trophies, save.earned);
  });
  const titles = document.createElement('div');
  titles.className = 'trophy-titles';
  const name = document.createElement('h3');
  name.className = 'trophy-name';
  name.textContent = spoiled ? 'Hidden story trophy' : trophy.name;
  const desc = document.createElement('p');
  desc.className = 'trophy-desc';
  desc.textContent = spoiled ? 'Earn this trophy to reveal its name and description.' : trophy.description;
  titles.append(name, desc);
  head.append(box, titles);
  li.append(head);

  const badges = document.createElement('div');
  badges.className = 'trophy-badges';
  const gradeBadge = document.createElement('span');
  gradeBadge.className = `badge grade-${trophy.grade}`;
  gradeBadge.textContent = gradeLabel(trophy.grade);
  badges.append(gradeBadge);
  const kindBadge = document.createElement('span');
  kindBadge.className = 'badge kind';
  kindBadge.textContent = kindLabel(trophy.kind);
  badges.append(kindBadge);
  if (trophy.hidden) {
    const b = document.createElement('span');
    b.className = 'badge hidden-flag';
    b.textContent = 'Hidden on PSN';
    badges.append(b);
  }
  if (trophy.missable) {
    const b = document.createElement('span');
    b.className = 'badge missable';
    b.textContent = 'Missable';
    badges.append(b);
  }
  const stage = ROADMAP_STAGES.find((s) => s.ids.includes(trophy.id));
  if (stage) {
    const b = document.createElement('span');
    b.className = 'badge';
    b.textContent = `Roadmap stage ${stage.num}`;
    badges.append(b);
  }
  li.append(badges);

  if (spoiled) {
    const note = document.createElement('p');
    note.className = 'spoiler-note';
    note.textContent = 'Spoiler hidden — tick the box when you earn it to reveal the guide.';
    li.append(note);
    return li;
  }

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'brief-toggle';
  toggle.textContent = 'Field brief ▾';
  const brief = document.createElement('div');
  brief.className = 'brief';
  brief.hidden = true;
  const label = document.createElement('p');
  label.innerHTML = '<span class="label">Field brief</span>';
  const guide = document.createElement('p');
  guide.textContent = trophy.guide;
  brief.append(label, guide);
  const srcLabel = document.createElement('p');
  srcLabel.innerHTML = '<span class="label">Sources</span>';
  const srcList = document.createElement('ul');
  srcList.className = 'source-list';
  for (const s of trophy.sources ?? []) {
    const item = document.createElement('li');
    const a = document.createElement('a');
    a.href = s.url;
    a.rel = 'noopener';
    a.textContent = s.name;
    item.append(a);
    srcList.append(item);
  }
  brief.append(srcLabel, srcList);
  toggle.addEventListener('click', () => {
    brief.hidden = !brief.hidden;
    toggle.textContent = brief.hidden ? 'Field brief ▾' : 'Field brief ▴';
  });
  li.append(toggle, brief);

  if (trophy.target) {
    const counter = document.createElement('div');
    counter.className = 'counter';
    const minus = document.createElement('button');
    minus.type = 'button';
    minus.textContent = '−';
    minus.setAttribute('aria-label', `Decrease ${trophy.name} progress`);
    minus.addEventListener('click', () => setCounter(trophy, counterValue(trophy) - 1));
    const plus = document.createElement('button');
    plus.type = 'button';
    plus.textContent = '+';
    plus.setAttribute('aria-label', `Increase ${trophy.name} progress`);
    plus.addEventListener('click', () => setCounter(trophy, counterValue(trophy) + 1));
    const value = document.createElement('strong');
    value.textContent = `${counterValue(trophy)} / ${trophy.target.toLocaleString('en-US')} ${trophy.targetLabel ?? ''}`;
    counter.append(minus, value, plus);
    li.append(counter);
  }
  return li;
}

function renderList() {
  const query = searchEl.value;
  const shown = trophies.filter(
    (t) =>
      trophyMatchesKind(t, activeKind) &&
      trophyMatchesQuery(t, query) &&
      trophyMatchesGrade(t, gradeEl.value) &&
      trophyMatchesEarned(t, save.earned, earnedEl.value),
  );
  listEl.replaceChildren();
  for (const t of shown) listEl.append(buildTrophyCard(t));
  $('resultCount').textContent = `Showing ${shown.length} of ${trophies.length} trophies — ${save.earned.size} earned`;
  $('emptyState').hidden = shown.length !== 0;
  if (activeKind === 'online') {
    $('emptyState').hidden = false;
    $('emptyState').textContent = 'No online trophies: all 55 are single-player. Sources: PowerPyx and Push Square via Sixshore\u2019s trophy list.';
  } else {
    $('emptyState').textContent = 'No trophies match these filters. Try clearing the search or choosing another kind.';
  }
}

function renderKindChips() {
  const wrap = $('kindChips');
  wrap.replaceChildren();
  for (const kind of KINDS) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.textContent = kind.label;
    chip.setAttribute('aria-pressed', String(activeKind === kind.id));
    chip.addEventListener('click', () => {
      activeKind = kind.id;
      renderKindChips();
      renderList();
    });
    wrap.append(chip);
  }
}

function renderMissables() {
  const wrap = $('missableList');
  wrap.replaceChildren();
  const missable = trophies.filter((t) => t.missable);
  for (const t of missable) wrap.append(buildTrophyCard(t));
  if (missable.length === 0) {
    const p = document.createElement('p');
    p.textContent = 'No missable trophies recorded.';
    wrap.append(p);
  }
}

function switchView(view) {
  for (const tab of document.querySelectorAll('.tab')) {
    tab.classList.toggle('active', tab.dataset.view === view);
  }
  for (const section of document.querySelectorAll('.view')) {
    const isActive = section.id === `view-${view}`;
    section.classList.toggle('active', isActive);
    section.hidden = !isActive;
  }
  if (view === 'roadmap') renderRoadmap($('timeline'), trophies, save.earned);
  if (view === 'missables') renderMissables();
}

function syncSpoilerToggles() {
  spoilerEl.checked = save.spoilersHidden;
  spoilerEl2.checked = save.spoilersHidden;
}

function onSpoilerChange(checked) {
  save.spoilersHidden = checked;
  saveState();
  syncSpoilerToggles();
  renderList();
}

async function boot() {
  const response = await fetch('data/trophies.json');
  const data = await response.json();
  trophies = data.trophies;

  renderKindChips();
  renderList();
  renderProgress();
  syncSpoilerToggles();

  for (const tab of document.querySelectorAll('.tab')) {
    tab.addEventListener('click', () => switchView(tab.dataset.view));
  }
  searchEl.addEventListener('input', renderList);
  gradeEl.addEventListener('change', renderList);
  earnedEl.addEventListener('change', renderList);
  // Press / anywhere to jump to search.
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchEl) {
      e.preventDefault();
      searchEl.focus();
    }
  });
  spoilerEl.addEventListener('change', (e) => onSpoilerChange(e.target.checked));
  spoilerEl2.addEventListener('change', (e) => onSpoilerChange(e.target.checked));

  $('exportBtn').addEventListener('click', () => {
    exportSave(save);
    $('saveStatus').textContent = 'Progress exported as leonida-field-manual-progress.json.';
  });
  $('importFile').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const imported = await importSaveFile(file);
      save.earned = imported.earned;
      save.counters = imported.counters;
      save.spoilersHidden = imported.spoilersHidden;
      saveState();
      syncSpoilerToggles();
      renderList();
      $('saveStatus').textContent = `Imported ${save.earned.size} earned trophies from ${file.name}.`;
    } catch {
      $('saveStatus').textContent = 'That file could not be imported — it is not a Leonida Field Manual progress file.';
    }
    e.target.value = '';
  });
  $('resetBtn').addEventListener('click', () => {
    if (!window.confirm('Reset all progress? This clears every tick and counter.')) return;
    save.earned.clear();
    save.counters = {};
    saveState();
    renderList();
    $('saveStatus').textContent = 'Progress reset.';
  });

  const initial = location.hash.replace('#/', '') || 'guide';
  if (['guide', 'roadmap', 'missables', 'settings'].includes(initial)) switchView(initial);
  window.addEventListener('hashchange', () => {
    const view = location.hash.replace('#/', '');
    if (['guide', 'roadmap', 'missables', 'settings'].includes(view)) switchView(view);
  });
}

boot();
