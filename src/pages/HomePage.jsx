import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

export default function HomePage() {
  const [posts, setPosts] = useState([]); // set the initial state to an empty array

  // Fetch data from the API
  useEffect(() => {
    async function fetchPosts() {
      const response = await fetch(
        "https://fb-rest-race-default-rtdb.firebaseio.com/posts.json"
      ); // fetch data from the url
      const data = await response.json(); // get the data from the response and parse it
      // from object to array
      const postsArray = Object.keys(data).map(postId => ({
        id: postId,
        ...data[postId]
      })); // map the data to an array of objects

      setPosts(postsArray); // set the posts state with the postsArray
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
