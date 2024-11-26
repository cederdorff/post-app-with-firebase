import { useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm";
import { auth } from "../firebase-config";
export default function CreatePage() {
  const navigate = useNavigate();

  async function createPost(post) {
    post.uid = auth.currentUser.uid;

    const response = await fetch(`${import.meta.env.VITE_FB_URL}/posts.json`, {
      method: "POST",
      body: JSON.stringify(post)
    });

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
