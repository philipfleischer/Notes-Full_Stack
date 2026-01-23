import { PlusIcon, SearchIcon, XIcon } from 'lucide-react';
import { Link } from 'react-router';

function Navbar({ query = '', setQuery }) {
  return (
    <header className="bg-base-100 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-primary font-mono tracking-tight">
              Notes Collection
            </h1>

            <Link to={'/create'} className="btn btn-primary md:hidden">
              <PlusIcon className="size-5" />
              <span>New</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <label className="input input-bordered flex items-center gap-2 w-full md:w-[420px] bg-base-200">
              <SearchIcon className="size-4 opacity-70" />
              <input
                value={query}
                onChange={(e) => setQuery?.(e.target.value)}
                type="text"
                className="grow"
                placeholder="Search notes (title/content)…"
              />
              {query?.length > 0 && (
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={() => setQuery?.('')}
                  aria-label="Clear search"
                >
                  <XIcon className="size-4" />
                </button>
              )}
            </label>

            <Link to={'/create'} className="btn btn-primary hidden md:inline-flex">
              <PlusIcon className="size-5" />
              <span>New Note</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
