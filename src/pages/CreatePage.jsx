import { useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm";
export default function CreatePage() {
  const navigate = useNavigate();

  async function createPost(post) {
    post.uid = "ZfPTVEMQKf9vhNiUh0bj";

    const response = await fetch(
      "https://fb-rest-race-default-rtdb.firebaseio.com/posts.json",
      {
        method: "POST",
        body: JSON.stringify(post)
      }
    );

    if (response.ok) {
      navigate("/");
    } else {
      console.error("Error creating post");
    }
  }

  return (
    <section className="page">
      <div className="container">
        <h1>Create New Post</h1>
        <PostForm savePost={createPost} />
      </div>
    </section>
  );
}
