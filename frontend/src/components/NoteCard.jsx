import {
  ChevronDownIcon,
  ChevronUpIcon,
  FolderIcon,
  PenSquareIcon,
  Trash2Icon,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router';
import api from '../lib/axios';
import { formatDate } from '../lib/utils';

function looksLongOrHasNewlines(text = '') {
  if (!text) return false;
  if (text.includes('\n')) return true;
  return text.includes('\n');
}

const NoteCard = ({ note, setNotes, pinned, onTogglePin }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [groupMenuOpen, setGroupMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [groupNames, setGroupNames] = useState([]);
  const currentGroup = note.group ?? null;

  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setGroupMenuOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const refreshGroupsFromDB = async () => {
    try {
      const res = await api.get('/notes');
      const set = new Set();
      for (const n of res.data) if (n.group) set.add(n.group);
      setGroupNames(Array.from(set).sort((a, b) => a.localeCompare(b, 'nb-NO')));
    } catch (err) {
      console.log('Failed to load groups', err);
    }
  };

  const handleOpenGroupMenu = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await refreshGroupsFromDB();
    setGroupMenuOpen((v) => !v);
  };

  const handleChooseGroup = async (e, name) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const updated = { ...note, group: name };
      const res = await api.put(`/notes/${note._id}`, updated);

      setNotes((prev) => prev.map((n) => (n._id === note._id ? res.data : n)));

      setGroupMenuOpen(false);
      toast.success(`Saved to "${name}"`);
    } catch (error) {
      console.log('Failed to save group', error);
      toast.error('Failed to save group');
    }
  };

  const handleAddNewGroup = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const name = window.prompt('New group name:');
    if (!name || !name.trim()) return;

    const trimmed = name.trim();

    setGroupNames((prev) =>
      Array.from(new Set([...prev, trimmed])).sort((a, b) => a.localeCompare(b, 'nb-NO')),
    );

    // Save in db
    await handleChooseGroup(e, trimmed);
  };

  const handleRemoveFromGroup = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const updated = { ...note, group: null };
      const res = await api.put(`/notes/${note._id}`, updated);

      setNotes((prev) => prev.map((n) => (n._id === note._id ? res.data : n)));

      setGroupMenuOpen(false);
      toast.success('Removed from group');
    } catch (error) {
      console.log('Failed to remove group', error);
      toast.error('Failed to remove group');
    }
  };

  const showToggle = useMemo(() => looksLongOrHasNewlines(note?.content || ''), [note?.content]);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      toast.success('Note deleted successfully!');
    } catch (error) {
      console.log('Error in handleDelete', error);
      toast.error('Failed to delete note');
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/note/${note._id}`);
  };

  const handleToggleExpanded = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanded((v) => !v);
  };

  return (
    <Link
      to={`/note/${note._id}`}
      className={`card bg-base-100 hover:shadow-lg transition-all duration-200 border border-base-content/10 relative overflow-hidden ${
        pinned ? 'ring-2 ring-primary/30' : ''
      }`}
    >
      <div className="absolute top-0 left-0 h-1 w-full bg-sky-200" />
      <div className="card-body">
        <div className="flex items-start justify-between gap-3">
          <h3 className="card-title text-base-content leading-snug">{note.title}</h3>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              className="btn btn-ghost btn-sm -mt-1 -mr-2"
              onClick={handleOpenGroupMenu}
              title="Save to group"
              aria-label="Save to group"
            >
              <FolderIcon className="size-4" />
              <span className="hidden sm:inline">{currentGroup ? currentGroup : 'Group'}</span>
              <ChevronDownIcon className="size-4 opacity-70" />
            </button>

            {groupMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-base-content/10 bg-base-100 shadow-xl z-20 overflow-hidden">
                <div className="px-3 py-2 text-xs opacity-70 border-b border-base-content/10">
                  Choose a group
                </div>

                <div className="max-h-56 overflow-auto">
                  {groupNames.length === 0 && (
                    <div className="px-3 py-2 text-sm opacity-70">No groups yet</div>
                  )}

                  {groupNames.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={(e) => handleChooseGroup(e, name)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-base-200 ${
                        currentGroup === name ? 'bg-primary/10' : ''
                      }`}
                    >
                      {name}
                      {currentGroup === name && <span className="ml-2 opacity-60">(selected)</span>}
                    </button>
                  ))}
                </div>

                <div className="border-t border-base-content/10">
                  <button
                    type="button"
                    onClick={handleAddNewGroup}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-base-200"
                  >
                    + Add new group
                  </button>

                  {currentGroup && (
                    <button
                      type="button"
                      onClick={handleRemoveFromGroup}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-base-200 text-error"
                    >
                      Remove from group
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview/expanded content */}
        <div className="mt-1">
          <p
            className={`text-base-content/70 whitespace-pre-wrap ${expanded ? '' : 'line-clamp-3'}`}
          >
            {note.content}
          </p>

          {showToggle && (
            <button
              type="button"
              className="btn btn-ghost btn-sm mt-2 px-2"
              onClick={handleToggleExpanded}
            >
              {expanded ? (
                <>
                  <ChevronUpIcon className="size-4" />
                  Hide
                </>
              ) : (
                <>
                  <ChevronDownIcon className="size-4" />
                  More
                </>
              )}
            </button>
          )}
        </div>

        <div className="card-actions justify-between items-center mt-4">
          <span className="text-sm text-base-content/60">
            {formatDate(new Date(note.createdAt))}
          </span>

          <div className="flex items-center gap-2">
            <span className="badge badge-ghost">{note.content?.length || 0} chars</span>
            {currentGroup && (
              <span className="badge badge-primary badge-outline">{currentGroup}</span>
            )}

            {/* EDIT button */}
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={handleEdit}
              title="Edit"
              aria-label="Edit note"
            >
              <PenSquareIcon className="size-4" />
            </button>

            {/* DELETE button */}
            <button
              type="button"
              className="btn btn-ghost btn-sm text-error"
              onClick={(e) => handleDelete(e, note._id)}
              title="Delete"
              aria-label="Delete note"
            >
              <Trash2Icon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;
