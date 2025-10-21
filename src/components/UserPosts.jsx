import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { getUserPosts } from "../services/firestoreService";

export default function UserPosts({ uid }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const userPosts = await getUserPosts(uid);
        if (mounted) setPosts(userPosts);
      } catch (err) {
        console.error("Failed to load user posts", err);
      }
    }
    if (uid) load();
    return () => (mounted = false);
  }, [uid]);
  return (
    <section className="grid">
      {posts.length ? posts.map(post => <PostCard post={post} key={post.id} />) : <p>No posts yet</p>}
    </section>
  );
}
