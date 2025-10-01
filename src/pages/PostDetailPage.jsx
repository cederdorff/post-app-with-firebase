import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import PostCard from "./../components/PostCard";
import { auth } from "../firebase-config";
import Loader from "../components/Loader";

export default function PostDetailPage() {
  const [post, setPost] = useState({});
  const params = useParams();
  const url = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/posts/${params.id}.json`;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getPost() {
      const response = await fetch(url);
      const postData = await response.json();
      postData.id = params.id;
      setPost(postData);
    }

    getPost();
  }, [params.id, url]);

  function navigateToUpdate() {
    navigate(`/posts/${params.id}/update`);
  }

  async function handleDelete() {
    const shouldDelete = window.confirm("Are you sure you want to delete this post?");

    if (shouldDelete) {
      setIsLoading(true);
      const response = await fetch(url, {
        method: "DELETE"
      });

      if (response.ok) {
        navigate("/");
      } else {
        alert("Something went wrong");
      }
      setIsLoading(false);
    }
  }

  return (
    <section className="page" id="post-page">
      <div className="container">
        <h1>{post.caption}</h1>
        <PostCard post={post} />

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
