import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  // Fetch data from the API
  useEffect(() => {
    async function fetchPosts() {
      const url =
        "https://react-user-crud-app-default-rtdb.firebaseio.com/posts.json";
      const response = await fetch(url);
      const data = await response.json(); // JSON.parse(response)
      console.log(data);
      // from object to array
      const postsArray = Object.keys(data).map(postId => ({
        id: postId,
        ...data[postId]
      }));
      console.log(postsArray);
      setPosts(postsArray);
    }

    fetchPosts();
  }, []);

  return (
    <section className="page">
      <div className="grid">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
