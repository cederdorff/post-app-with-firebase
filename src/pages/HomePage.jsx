import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { subscribeToPosts } from "../services/firestoreService";

export default function HomePage() {
  const [posts, setPosts] = useState([]); // set the initial state to an empty array
  const [searchQuery, setSearchQuery] = useState(""); // set the initial state to an empty string
  const [sortBy, setSortBy] = useState("createdAt"); // set the initial state to "createdAt"

  // Fetch data from the API
  useEffect(() => {
    // subscribeToPosts provides realtime updates; it returns an unsubscribe function
    const unsubscribe = subscribeToPosts(newPosts => setPosts(newPosts));
    return () => unsubscribe();
  }, []);

  // Filter posts based on the search query
  const filteredPosts = posts.filter(post => post.caption.toLowerCase().includes(searchQuery));

  // Sort posts based on the selected option
  filteredPosts.sort((postA, postB) => {
    if (sortBy === "createdAt") {
      // if the selected option is createdAt
      return postB.createdAt - postA.createdAt;
    }

    if (sortBy === "caption") {
      // if the selected option is caption
      return postA.caption.localeCompare(postB.caption);
    }
  });

  return (
    <section className="page">
      <form className="grid-filter" id="search-form" role="search">
        <label>
          Search by caption{" "}
          <input
            aria-label="Search by caption"
            defaultValue={searchQuery}
            onChange={event => setSearchQuery(event.target.value.toLowerCase())}
            placeholder="Search"
            type="search"
            name="searchQuery"
          />
        </label>
        <label>
          Sort by{" "}
          <select name="sort-by" defaultValue={sortBy} onChange={event => setSortBy(event.target.value)}>
            <option value="createdAt">newest</option>
            <option value="caption">caption</option>
          </select>
        </label>
      </form>
      <div className="grid">
        {filteredPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
