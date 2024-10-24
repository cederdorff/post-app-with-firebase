import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function PostDetailPage() {
  const params = useParams();
  const url = `https://react-user-crud-app-default-rtdb.firebaseio.com/posts/${params.id}.json`;

  useEffect(() => {
    async function getPost() {
      const response = await fetch(url);
      const userData = await response.json();
      console.log(userData);
    }

    getPost();
  }, [url]);

  return (
    <section className="page">
      <div className="container">
        <h1>Post detail page</h1>
      </div>
    </section>
  );
}
