// Filters and the spoiler rule: which trophies a filter shows, and which
// names the spoiler setting hides until the trophy is earned.
export const KINDS = [
  { id: 'all', label: 'All' },
  { id: 'story', label: 'Story' },
  { id: 'missable', label: 'Missable' },
  { id: 'collectible', label: 'Collectibles' },
  { id: 'activity', label: 'Activities' },
  { id: 'crime', label: 'Crime & Heists' },
  { id: 'exploration', label: 'Exploration' },
  { id: 'side', label: 'Side Characters' },
  { id: 'money', label: 'Money' },
  { id: 'online', label: 'Online' },
];

// Story trophies are the spoiler-bearing kind: hidden names until earned.
export function isSpoilerTrophy(trophy) {
  return trophy.kind === 'story';
}

export function trophyMatchesKind(trophy, kind) {
  if (kind === 'all') return true;
  if (kind === 'missable') return trophy.missable === true;
  if (kind === 'online') return false; // GTA VI has no online trophies.
  return trophy.kind === kind;
}

export function trophyMatchesQuery(trophy, query) {
  if (!query) return true;
  const hay = `${trophy.name} ${trophy.description}`.toLowerCase();
  return hay.includes(query.toLowerCase().trim());
}

export function trophyMatchesGrade(trophy, grade) {
  return grade === 'all' || trophy.grade === grade;
}

export function trophyMatchesEarned(trophy, earnedSet, mode) {
  if (mode === 'earned') return earnedSet.has(trophy.name);
  if (mode === 'unearned') return !earnedSet.has(trophy.name);
  return true;
}

export function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

export function kindLabel(kind) {
  const found = KINDS.find((k) => k.id === kind);
  return found ? found.label : kind;
}
