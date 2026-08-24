import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppLayout from "../routes/AppLayout";
import PostForm from "../components/post/PostForm";
import PostCard from "../components/post/PostCard";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";
import Avatar from "../components/common/Avatar";
import { communityApi } from "../services/userApi";
import { postApi } from "../services/postApi";
import { useAuth } from "../hooks/useAuth";
import { branchColor } from "../utils/branches";

const CommunityDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    communityApi.get(slug).then(async ({ data }) => {
      setCommunity(data);
      const { data: feed } = await postApi.getFeed({ community: data._id, limit: 20 });
      setPosts(feed);
      setLoading(false);
    });
  }, [slug]);

  const handleJoin = async () => {
    const { joined } = await communityApi.toggleJoin(community._id);
    setCommunity((c) => ({
      ...c,
      members: joined ? [...c.members, { _id: user._id, name: user.name }] : c.members.filter((m) => m._id !== user._id),
    }));
  };

  if (loading) {
    return <AppLayout><Loader label="Loading community" /></AppLayout>;
  }
  if (!community) {
    return <AppLayout><p className="text-center text-sm text-[var(--text-faint)] py-10">Community not found.</p></AppLayout>;
  }

  const isMember = community.members?.some((m) => m._id === user?._id);

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="card p-6" style={{ borderLeft: `3px solid ${branchColor(community.branch)}` }}>
          <p className="font-mono-tag text-xs text-[var(--text-faint)]">[{community.branch}] · {community.category}</p>
          <h1 className="font-display text-2xl font-bold mt-1">{community.name}</h1>
          <p className="text-sm text-[var(--text-muted)] mt-2">{community.description}</p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex -space-x-2">
              {community.members?.slice(0, 6).map((m) => <Avatar key={m._id} user={m} size="xs" />)}
            </div>
            <Button variant={isMember ? "secondary" : "primary"} size="sm" onClick={handleJoin}>
              {isMember ? "Joined" : "Join community"}
            </Button>
          </div>
        </div>

        {isMember && <PostForm communityId={community._id} onCreated={(p) => setPosts((prev) => [p, ...prev])} />}

        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-center text-sm text-[var(--text-faint)] py-6">No posts here yet.</p>
          ) : (
            posts.map((post) => (
              <PostCard key={post._id} post={post} onDeleted={(id) => setPosts((prev) => prev.filter((p) => p._id !== id))} />
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default CommunityDetail;
