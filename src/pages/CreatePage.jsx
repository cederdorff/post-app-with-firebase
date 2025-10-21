import { useNavigate } from "react-router";
import PostForm from "../components/PostForm";
import { auth } from "../firebase-config";
import { createPost } from "../services/firestoreService";
export default function CreatePage() {
  const navigate = useNavigate();

  async function handleCreate(post, imageFile) {
    try {
      const postData = {
        ...post,
        uid: auth.currentUser.uid
      };
      await createPost(postData, imageFile);
      navigate("/");
    } catch (err) {
      console.error("Error creating post", err);
    }
  }

  return (
    <section className="page">
      <div className="container">
        <h1>Create New Post</h1>
        <PostForm savePost={handleCreate} />
      </div>
    </section>
  );
}
