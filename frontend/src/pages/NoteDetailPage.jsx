import { ArrowLeftIcon, LoaderIcon, SaveIcon, Trash2Icon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router';
import api from '../lib/axios';

const AUTOSAVE_MS = 1200;

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const timerRef = useRef(null);

  const isDirty =
    !!note && !!original && (note.title !== original.title || note.content !== original.content);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`, note);
        setNote(res.data);
        setOriginal(res.data);
      } catch (error) {
        console.log('Error in fetching note', error);
        toast.error('Failed to fetch the note');
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  // Autosave
  useEffect(() => {
    if (!note || !original) return;
    if (!isDirty) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      setSaving(true);
      try {
        await api.put(`/notes/${id}`, note);
        setOriginal(note);
        toast.success('Autosaved', { duration: 900 });
      } catch (error) {
        console.log('Autosave failed:', error);
        toast.error('Autosave failed');
      } finally {
        setSaving(false);
      }
    }, AUTOSAVE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [note, original, id, isDirty]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await api.delete(`/notes/${id}`);
      toast.success('Note deleted');
      navigate('/');
    } catch (error) {
      console.log('Error deleting the note:', error);
      toast.error('Failed to delete note');
    }
  };

  const handleManualSave = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      toast.error('Please add a title or content');
      return;
    }

    setSaving(true);
    try {
      await api.put(`/notes/${id}`, note);
      setOriginal(note);
      toast.success('Saved');
    } catch (error) {
      console.log('Error saving the note:', error);
      toast.error('Failed to update note');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
            <Link to="/" className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Notes
            </Link>

            <div className="flex items-center gap-2">
              <span className={`badge ${isDirty ? 'badge-warning' : 'badge-ghost'}`}>
                {saving ? 'Saving…' : isDirty ? 'Unsaved changes' : 'Saved'}
              </span>

              <button
                onClick={handleManualSave}
                className="btn btn-primary"
                disabled={saving || !isDirty}
              >
                <SaveIcon className="size-4" />
                Save
              </button>

              <button onClick={handleDelete} className="btn btn-error btn-outline">
                <Trash2Icon className="h-5 w-5" />
                Delete
              </button>
            </div>
          </div>

          <div className="card bg-base-100 border border-base-content/10">
            <div className="card-body">
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Note title"
                  className="input input-bordered bg-base-200"
                  value={note.title}
                  onChange={(e) => setNote({ ...note, title: e.target.value })}
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Content</span>
                </label>
                <textarea
                  placeholder="Write your note here..."
                  className="textarea textarea-bordered min-h-[220px] bg-base-200"
                  value={note.content}
                  onChange={(e) => setNote({ ...note, content: e.target.value })}
                />
                <div className="mt-2 text-xs text-base-content/60">
                  Tip: autosaves after you stop typing.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;
