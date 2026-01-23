import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import NoteCard from '../components/NoteCard';
import NotesNotFound from '../components/NotesNotFound';
import RateLimitedUI from '../components/RateLimitedUI';
import api from '../lib/axios';
import { getPinnedIds, togglePinnedId } from '../lib/localPrefs';

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Group filtering ---
  const ALL_GROUPS = '__ALL__';
  const [selectedGroup, setSelectedGroup] = useState(ALL_GROUPS);

  const groups = useMemo(() => {
    const set = new Set();
    for (const n of notes) {
      if (n.group) set.add(n.group);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'nb-NO'));
  }, [notes]);

  const visibleGroups = groups.slice(0, 3);
  const overflowGroups = groups.slice(3);

  const noteGroup = (note) => note.group ?? null;

  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('new'); // new | old | title
  const [pinnedIds, setPinnedIds] = useState(getPinnedIds());

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get('/notes');
        setNotes(res.data);
        setSelectedGroup(ALL_GROUPS);
        setIsRateLimited(false);
      } catch (error) {
        console.log('Error fetching notes', error);
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error('Failed to load notes');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const filteredAndSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pinnedSet = new Set(pinnedIds);

    let list = notes;

    if (selectedGroup !== ALL_GROUPS) {
      list = list.filter((n) => noteGroup(n) === selectedGroup);
    }

    if (q) {
      list = list.filter((n) => {
        const t = (n.title || '').toLowerCase();
        const c = (n.content || '').toLowerCase();
        return t.includes(q) || c.includes(q);
      });
    }

    list = [...list].sort((a, b) => {
      if (sort === 'title') return (a.title || '').localeCompare(b.title || '');
      if (sort === 'old') return new Date(a.createdAt) - new Date(b.createdAt);
      return new Date(b.createdAt) - new Date(a.createdAt); // new
    });

    list.sort((a, b) => Number(pinnedSet.has(b._id)) - Number(pinnedSet.has(a._id)));

    return list;
  }, [notes, query, sort, pinnedIds, selectedGroup]);

  const onTogglePin = (id) => {
    const next = togglePinnedId(id);
    setPinnedIds(next);
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar query={query} setQuery={setQuery} />

      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-7xl mx-auto p-4 mt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2 flex-wrap">
            {/* "All notes" */}
            <button
              type="button"
              className={`btn btn-sm ${selectedGroup === ALL_GROUPS ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedGroup(ALL_GROUPS)}
            >
              All notes
            </button>

            {/* 3 groups as buttons */}
            {visibleGroups.map((g) => {
              const active = selectedGroup === g;
              return (
                <button
                  key={g}
                  type="button"
                  className={`btn btn-sm ${active ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setSelectedGroup(g)}
                >
                  {g}
                </button>
              );
            })}

            {overflowGroups.length > 0 && (
              <div className="dropdown dropdown-bottom">
                <button
                  tabIndex={0}
                  type="button"
                  className="btn btn-sm bg-base-200 hover:bg-base-300 text-base-content/70 border border-base-content/20 flex items-center gap-1"
                >
                  More groups
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 opacity-60"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <ul
                  tabIndex={0}
                  className="dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56 mt-2"
                >
                  {overflowGroups.map((g) => (
                    <li key={g}>
                      <button
                        type="button"
                        className={selectedGroup === g ? 'active' : ''}
                        onClick={() => setSelectedGroup(g)}
                      >
                        {g}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* pinned badge */}
            {pinnedIds.length > 0 && (
              <span className="badge badge-ghost">{pinnedIds.length} pinned</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              className="select select-bordered bg-base-100"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="new">Newest first</option>
              <option value="old">Oldest first</option>
              <option value="title">Title A → Z</option>
            </select>

            <button
              className="btn btn-ghost"
              onClick={() => {
                setQuery('');
                setSort('new');
                setSelectedGroup(ALL_GROUPS);
                toast.success('Reset filters');
              }}
              type="button"
            >
              Reset
            </button>
          </div>
        </div>

        {selectedGroup !== ALL_GROUPS && (
          <div className="mb-4 text-sm text-base-content/70">
            Showing group: <span className="font-semibold text-base-content">{selectedGroup}</span>
          </div>
        )}

        {loading && <div className="text-center text-primary py-10">Loading Notes...</div>}

        {!loading && notes.length === 0 && !isRateLimited && <NotesNotFound />}

        {!loading && notes.length > 0 && !isRateLimited && filteredAndSorted.length === 0 && (
          <div className="card bg-base-100 border border-base-content/10">
            <div className="card-body">
              <h3 className="card-title">No matches</h3>
              <p className="text-base-content/70">
                Try a different search, choose “All”, or reset filters.
              </p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary" onClick={() => setQuery('')} type="button">
                  Clear search
                </button>
              </div>
            </div>
          </div>
        )}

        {filteredAndSorted.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSorted.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                setNotes={setNotes}
                pinned={pinnedIds.includes(note._id)}
                onTogglePin={onTogglePin}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
