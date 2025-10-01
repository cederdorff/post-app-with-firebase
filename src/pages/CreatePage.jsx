import { useNavigate } from "react-router";
import PostForm from "../components/PostForm";
import { auth } from "../firebase-config";
export default function CreatePage() {
  const navigate = useNavigate();

  async function createPost(post) {
    post.uid = auth.currentUser.uid;
    // Add the createdAt property to the post object - must be a timestamp
    post.createdAt = Date.now();

    console.log(post);

    const response = await fetch(`${import.meta.env.VITE_FIREBASE_DATABASE_URL}/posts.json`, {
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
