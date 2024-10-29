import { useEffect, useState } from "react";
import PostCard from "./PostCard";

export default function UserPosts({ uid }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function getPosts() {
      const url = `https://fb-rest-race-default-rtdb.firebaseio.com/posts.json?orderBy="uid"&equalTo="${uid}"`;
      // To make this work, you must create an index on "uid" in Firebase Realtime Database Rules
      const response = await fetch(url);
      const data = await response.json();
      const postsArray = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      })); // from object to array
      setPosts(postsArray);
    }
    if (uid) {
      getPosts();
    }
  }, [uid]);
  return (
    <section className="grid">
      {posts.length ? (
        posts.map(post => <PostCard post={post} key={post.id} />)
      ) : (
        <p>No posts yet</p>
      )}
    </section>
  );
}
