export async function getPostById(id) {
  const url = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/posts/${id}.json`;
  const response = await fetch(url);
  const post = await response.json();
  post.id = id;
  return post;
}
