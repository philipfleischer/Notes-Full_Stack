const LS_KEY = 'note_groups_v1';

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { groups: {}, noteToGroup: {} };
    const parsed = JSON.parse(raw);
    return {
      groups: parsed.groups ?? {},
      noteToGroup: parsed.noteToGroup ?? {},
    };
  } catch {
    return { groups: {}, noteToGroup: {} };
  }
}

function saveState(state) {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

export function getGroupsState() {
  return loadState();
}

export function getGroupNames() {
  const { groups } = loadState();
  return Object.keys(groups).sort((a, b) => a.localeCompare(b));
}

export function getGroupForNote(noteId) {
  const { noteToGroup } = loadState();
  return noteToGroup[noteId] ?? null;
}

export function ensureGroup(name) {
  const trimmed = (name ?? '').trim();
  if (!trimmed) return;

  const state = loadState();
  if (!state.groups[trimmed]) state.groups[trimmed] = [];
  saveState(state);
}

export function addNoteToGroup(noteId, groupName) {
  const name = (groupName ?? '').trim();
  if (!noteId || !name) return;

  const state = loadState();
  if (!state.groups[name]) state.groups[name] = [];

  // remove from previous group if any
  const prev = state.noteToGroup[noteId];
  if (prev && state.groups[prev]) {
    state.groups[prev] = state.groups[prev].filter((id) => id !== noteId);
  }

  // add to new group
  if (!state.groups[name].includes(noteId)) state.groups[name].push(noteId);
  state.noteToGroup[noteId] = name;

  saveState(state);
}

export function removeNoteFromGroup(noteId) {
  if (!noteId) return;

  const state = loadState();
  const prev = state.noteToGroup[noteId];
  if (prev && state.groups[prev]) {
    state.groups[prev] = state.groups[prev].filter((id) => id !== noteId);
  }
  delete state.noteToGroup[noteId];
  saveState(state);
}
