import UserAvatar from "./UserAvatar";

export default function PostCard({ post }) {
  return (
    <article key={post.id} className="post-card">
      <UserAvatar uid={post.uid} />
      <img src={post.image} alt={post.caption} />
      <h3>{post.caption}</h3>
    </article>
  );
}
