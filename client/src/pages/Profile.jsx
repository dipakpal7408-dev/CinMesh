import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../routes/AppLayout";
import ProfileHeader from "../components/profile/ProfileHeader";
import PostCard from "../components/post/PostCard";
import Loader from "../components/common/Loader";
import { useAuth } from "../hooks/useAuth";
import { userApi } from "../services/userApi";
import { postApi } from "../services/postApi";
import { chatApi } from "../services/chatApi";

const Profile = () => {
  const { id } = useParams();
  const { user, updateCachedUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const isOwn = user?._id === id;

  useEffect(() => {
    setLoading(true);
    Promise.all([userApi.getProfile(id), postApi.getFeed({ author: id, limit: 20 })])
      .then(([profileRes, feedRes]) => {
        setProfile(profileRes.data);
        setPosts(feedRes.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleToggleFollow = async () => {
    const { following } = await userApi.toggleFollow(id);
    setProfile((p) => ({
      ...p,
      followers: following
        ? [...p.followers, user._id]
        : p.followers.filter((f) => f !== user._id),
    }));
  };

  const handleMessage = async () => {
    navigate(`/chat?with=${id}`);
  };

  if (loading) {
    return (
      <AppLayout>
        <Loader label="Loading profile" />
      </AppLayout>
    );
  }

  if (!profile) {
    return (
      <AppLayout>
        <p className="text-center text-sm text-[var(--text-faint)] py-10">Profile not found.</p>
      </AppLayout>
    );
  }

  const isFollowing = profile.followers?.some((f) => (f._id || f) === user?._id);

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-5">
        <ProfileHeader
          profile={profile}
          isOwn={isOwn}
          isFollowing={isFollowing}
          onToggleFollow={handleToggleFollow}
          onMessage={handleMessage}
          onEdit={() => navigate("/settings")}
        />

        <div className="trace-divider" />

        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-center text-sm text-[var(--text-faint)] py-6">No posts yet.</p>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onDeleted={(pid) => setPosts((prev) => prev.filter((p) => p._id !== pid))}
              />
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
