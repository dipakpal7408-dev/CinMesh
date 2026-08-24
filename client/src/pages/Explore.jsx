import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import AppLayout from "../routes/AppLayout";
import Avatar from "../components/common/Avatar";
import Loader from "../components/common/Loader";
import { userApi } from "../services/userApi";
import { useDebounce } from "../hooks/useDebounce";
import { branchColor } from "../utils/branches";

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const debouncedQuery = useDebounce(query, 350);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSearchParams(debouncedQuery ? { q: debouncedQuery } : {});
    if (!debouncedQuery) {
      setResults([]);
      return;
    }
    setLoading(true);
    userApi
      .search(debouncedQuery)
      .then(({ data }) => setResults(data))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-xl font-bold mb-4">Explore</h1>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, branch, or skill…"
          className="w-full px-4 py-3 rounded-xl text-sm bg-[var(--panel)] border border-[var(--line)] focus:border-[var(--signal)] outline-none mb-5"
        />

        {loading && <Loader label="Searching" />}

        {!loading && debouncedQuery && results.length === 0 && (
          <p className="text-sm text-[var(--text-faint)] text-center py-8">No students match “{debouncedQuery}”.</p>
        )}

        <div className="space-y-2">
          {results.map((u) => (
            <Link
              key={u._id}
              to={`/profile/${u._id}`}
              className="card p-3 flex items-center gap-3 hover:border-[var(--signal)] transition-colors"
            >
              <Avatar user={u} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{u.name}</p>
                <p className="text-xs text-[var(--text-faint)]">{u.college}</p>
              </div>
              {u.branch && (
                <span
                  className="font-mono-tag text-[10px] px-2 py-0.5 rounded border"
                  style={{ color: branchColor(u.branch), borderColor: branchColor(u.branch) + "55" }}
                >
                  [{u.branch}]
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Explore;
