const PINNED_KEY = 'notes:pinned';

export function getPinnedIds() {
  try {
    return JSON.parse(localStorage.getItem(PINNED_KEY) || '[]');
  } catch {
    return [];
  }
}

export function togglePinnedId(id) {
  const set = new Set(getPinnedIds());
  if (set.has(id)) set.delete(id);
  else set.add(id);
  localStorage.setItem(PINNED_KEY, JSON.stringify([...set]));
  return [...set];
}

export function isPinned(id) {
  return getPinnedIds().includes(id);
}
