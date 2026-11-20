// Save store: earned trophies and per-trophy counters in localStorage,
// with export to a file and import back. Nothing leaves the browser.
export const STORAGE_KEY = 'leonida-field-manual-v1';

function readRaw() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') ?? {};
  } catch {
    return {};
  }
}

export function loadSave() {
  const raw = readRaw();
  return {
    earned: new Set(Array.isArray(raw.earned) ? raw.earned.filter((n) => typeof n === 'string') : []),
    counters: typeof raw.counters === 'object' && raw.counters !== null ? raw.counters : {},
    spoilersHidden: raw.spoilersHidden === true,
  };
}

export function persistSave(save) {
  const payload = {
    earned: [...save.earned].sort(),
    counters: save.counters,
    spoilersHidden: save.spoilersHidden,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  return payload;
}

export function exportSave(save) {
  const blob = new Blob([JSON.stringify(persistSave(save), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'leonida-field-manual-progress.json';
  a.click();
  URL.revokeObjectURL(url);
}

export async function importSaveFile(file) {
  const text = await file.text();
  const data = JSON.parse(text);
  if (!data || typeof data !== 'object') throw new Error('not an object');
  const earned = new Set(Array.isArray(data.earned) ? data.earned.filter((n) => typeof n === 'string') : []);
  const counters = typeof data.counters === 'object' && data.counters !== null ? data.counters : {};
  return { earned, counters, spoilersHidden: data.spoilersHidden === true };
}
