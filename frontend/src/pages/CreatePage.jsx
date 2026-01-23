import { ArrowLeftIcon, ChevronDownIcon, FolderIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router';
import api from '../lib/axios';
import { ensureGroup, getGroupNames } from '../lib/groups';

const CreatePage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // group UI
  const [groupMenuOpen, setGroupMenuOpen] = useState(false);
  const [groupNames, setGroupNames] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const menuRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setGroupNames(getGroupNames());
  }, []);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setGroupMenuOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const openGroupMenu = (e) => {
    e.preventDefault();
    setGroupNames(getGroupNames());
    setGroupMenuOpen((v) => !v);
  };

  const chooseGroup = (e, name) => {
    e.preventDefault();
    setSelectedGroup(name);
    setGroupMenuOpen(false);
    toast.success(`Selected "${name}"`);
  };

  const addNewGroup = (e) => {
    e.preventDefault();
    const name = window.prompt('New group name:');
    if (!name || !name.trim()) return;

    ensureGroup(name.trim());
    setGroupNames(getGroupNames());
    setSelectedGroup(name.trim());
    setGroupMenuOpen(false);
    toast.success(`Created "${name.trim()}"`);
  };

  const clearGroup = (e) => {
    e.preventDefault();
    setSelectedGroup(null);
    setGroupMenuOpen(false);
    toast.success('No group selected');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('All fields are required');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/notes', { title, content, group: selectedGroup ?? null });
      const created = res.data;
      const id = created?._id;

      // if (selectedGroup && id) {
      //   addNoteToGroup(id, selectedGroup);
      // }

      toast.success('Note created successfully!');
      navigate('/');
    } catch (error) {
      console.log('Error creating note', error);
      if (error.response?.status === 429) {
        toast.error('Slow down! Rate Limiting initiated', { duration: 4000, icon: '🛑' });
      } else {
        toast.error('Failed to create note');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to={'/'} className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5" />
            Back to Notes
          </Link>

          <div className="card bg-base-100 border border-base-content/10">
            <div className="card-body">
              <div className="flex items-center justify-between gap-3 mb-2">
                <h2 className="card-title text-2xl">Create New Note</h2>

                {/* Group selector */}
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={openGroupMenu}
                    title="Save to group"
                  >
                    <FolderIcon className="size-4" />
                    <span className="hidden sm:inline">
                      {selectedGroup ? selectedGroup : 'No group'}
                    </span>
                    <ChevronDownIcon className="size-4 opacity-70" />
                  </button>

                  {groupMenuOpen && (
                    <div className="absolute right-0 mt-2 w-60 rounded-xl border border-base-content/10 bg-base-100 shadow-xl z-20 overflow-hidden">
                      <div className="px-3 py-2 text-xs opacity-70 border-b border-base-content/10">
                        Save note into group
                      </div>

                      <div className="max-h-56 overflow-auto">
                        {groupNames.length === 0 && (
                          <div className="px-3 py-2 text-sm opacity-70">No groups yet</div>
                        )}

                        {groupNames.map((name) => (
                          <button
                            key={name}
                            type="button"
                            onClick={(e) => chooseGroup(e, name)}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-base-200 ${
                              selectedGroup === name ? 'bg-primary/10' : ''
                            }`}
                          >
                            {name}
                            {selectedGroup === name && (
                              <span className="ml-2 opacity-60">(selected)</span>
                            )}
                          </button>
                        ))}
                      </div>

                      <div className="border-t border-base-content/10">
                        <button
                          type="button"
                          onClick={addNewGroup}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-base-200"
                        >
                          + Add new group
                        </button>

                        <button
                          type="button"
                          onClick={clearGroup}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-base-200"
                        >
                          No group
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Note Title"
                    className="input input-bordered"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Content</span>
                  </label>
                  <textarea
                    placeholder="Write your note here..."
                    className="textarea textarea-bordered h-32"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                <div className="card-actions justify-end">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Note'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
