import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import PostCard from "./../components/PostCard";
import { auth } from "../firebase-config";
import { getPostById, deletePost } from "../services/firestoreService";
import Loader from "../components/Loader";

export default function PostDetailPage() {
  const [post, setPost] = useState(null);
  const params = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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

  function navigateToUpdate() {
    navigate(`/posts/${params.id}/update`);
  }

  async function handleDelete() {
    const shouldDelete = window.confirm("Are you sure you want to delete this post?");

    if (shouldDelete) {
      setIsLoading(true);
      try {
        await deletePost(params.id);
        navigate("/");
      } catch (err) {
        alert("Something went wrong");
      }
      setIsLoading(false);
    }
  }

  return (
    <section className="page" id="post-page">
      <div className="container">
        {post ? (
          <>
            <h1>{post.caption}</h1>
            <PostCard post={post} />
          </>
        ) : (
          <p>Loading...</p>
        )}

        {auth.currentUser?.uid === post.uid && (
          <div className="btns">
            <button className="btn-cancel" onClick={handleDelete}>
              Delete post
            </button>
            <button onClick={navigateToUpdate}>Update post</button>
          </div>
        )}
      </div>
      <Loader show={isLoading} />
    </section>
  );
}
