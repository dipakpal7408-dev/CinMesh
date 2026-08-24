import { useEffect, useState, useCallback } from "react";
import AppLayout from "../routes/AppLayout";
import PostForm from "../components/post/PostForm";
import PostCard from "../components/post/PostCard";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";
import { postApi } from "../services/postApi";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadFeed = useCallback(async (pageNum = 1) => {
    const { data, pagination } = await postApi.getFeed({ page: pageNum, limit: 10 });
    setPages(pagination.pages);
    return data;
  }, []);

  useEffect(() => {
    setLoading(true);
    loadFeed(1)
      .then(setPosts)
      .finally(() => setLoading(false));
  }, [loadFeed]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    const next = page + 1;
    const data = await loadFeed(next);
    setPosts((prev) => [...prev, ...data]);
    setPage(next);
    setLoadingMore(false);
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-4">
        <PostForm onCreated={(post) => setPosts((prev) => [post, ...prev])} />

        {loading ? (
          <Loader label="Loading feed" />
        ) : posts.length === 0 ? (
          <div className="card p-8 text-center text-sm text-[var(--text-muted)]">
            No posts yet. Be the first to share something with the mesh.
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onDeleted={(id) => setPosts((prev) => prev.filter((p) => p._id !== id))}
              />
            ))}
            {page < pages && (
              <div className="flex justify-center py-2">
                <Button variant="secondary" onClick={handleLoadMore} disabled={loadingMore}>
                  {loadingMore ? "Loading…" : "Load more"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Feed;
