import Avatar from "../common/Avatar";
import Button from "../common/Button";
import { branchColor } from "../../utils/branches";

const ProfileHeader = ({ profile, isOwn, isFollowing, onToggleFollow, onMessage, onEdit }) => {
  const accent = branchColor(profile.branch);

  return (
    <div className="card p-6">
      <div className="flex flex-col sm:flex-row items-start gap-5">
        <Avatar user={profile} size="xl" />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-display text-xl font-bold">{profile.name}</h1>
            {profile.branch && (
              <span
                className="font-mono-tag text-[11px] px-2 py-0.5 rounded border"
                style={{ color: accent, borderColor: accent + "55" }}
              >
                [{profile.branch}]
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">
            {profile.college} {profile.year ? `· Year ${profile.year}` : ""}
          </p>
          {profile.bio && <p className="text-sm mt-3 leading-relaxed">{profile.bio}</p>}

          {profile.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {profile.skills.map((s) => (
                <span key={s} className="font-mono-tag text-[11px] px-2 py-0.5 rounded-full bg-[var(--panel-raised)] text-[var(--text-muted)]">
                  {s}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mt-4 text-sm text-[var(--text-muted)]">
            <span><strong className="text-[var(--text-primary)]">{profile.followers?.length || 0}</strong> followers</span>
            <span><strong className="text-[var(--text-primary)]">{profile.following?.length || 0}</strong> following</span>
            <span><strong className="text-[var(--text-primary)]">{profile.communities?.length || 0}</strong> communities</span>
          </div>

          <div className="flex gap-2 mt-4">
            {isOwn ? (
              <Button variant="secondary" size="sm" onClick={onEdit}>Edit profile</Button>
            ) : (
              <>
                <Button variant={isFollowing ? "secondary" : "primary"} size="sm" onClick={onToggleFollow}>
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                <Button variant="secondary" size="sm" onClick={onMessage}>Message</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
