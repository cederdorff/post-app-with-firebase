import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import PostForm from "../components/PostForm";
import { getPostById, updatePost } from "../services/firestoreService";

export default function UpdatePage() {
  const [post, setPost] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const p = await getPostById(params.id);
        if (mounted) setPost(p);
      } catch (err) {
        console.error("Failed to load post", err);
      }
    }

    load();
    return () => (mounted = false);
  }, [params.id]);

  async function handleUpdate(postToUpdate, imageFile) {
    try {
      await updatePost(params.id, postToUpdate, imageFile);
      navigate(`/posts/${params.id}`);
    } catch (err) {
      console.error("Error updating post", err);
    }
  }

  return (
    <section className="page" id="update-page">
      <div className="container">
        <h1>Update post</h1>
        {post ? <PostForm savePost={handleUpdate} post={post} /> : <p>Loading...</p>}
      </div>
    </section>
  );
}
