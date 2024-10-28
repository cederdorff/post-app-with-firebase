import { useState, useEffect } from "react";

export default function PostForm({ savePost, post }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isCaptionError, setIsCaptionError] = useState(false);
  const [isImageError, setIsImageError] = useState(false);

  useEffect(() => {
    if (post?.caption && post?.image) {
      // if post, set the states with values from the post object.
      // The post object is a prop, passed from UpdatePage
      setCaption(post.caption);
      setImage(post.image);
    }
  }, [post]); // useEffect is called every time post changes.

  function handleSubmit(event) {
    event.preventDefault();

    if (!caption && !image) {
      setErrorMessage("Please fill out both caption and image.");
      setIsCaptionError(true);
      setIsImageError(true);
      return;
    }

    if (!caption) {
      setErrorMessage("Please enter a caption.");
      setIsCaptionError(true);
      return;
    }

    if (!image.includes("http")) {
      setErrorMessage("Please enter a valid image URL.");
      setIsImageError(true);
      return;
    }

    // if no errors, clear error message
    setErrorMessage("");
    setIsCaptionError(false);
    setIsImageError(false);

    const formData = { caption, image };
    // ... send formData to API or parent component
    savePost(formData); // <-- pass formData to parent component
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label htmlFor="caption">Caption</label>
      <input
        id="caption"
        name="caption"
        type="text"
        value={caption}
        aria-label="caption"
        placeholder="Write a caption..."
        onChange={e => setCaption(e.target.value)}
        className={isCaptionError ? "error" : ""}
      />
      <label htmlFor="image-url">Image</label>
      <input
        id="image-url"
        name="image-url"
        type="url"
        value={image}
        aria-label="image"
        placeholder="Paste an image url..."
        onChange={e => setImage(e.target.value)}
        className={isImageError ? "error" : ""}
      />
      <label htmlFor="image-preview"></label>
      <img
        id="image-preview"
        className="image-preview"
        src={
          image ? image : "https://placehold.co/600x400?text=Paste+an+image+URL"
        }
        alt="Choose"
        onError={e =>
          (e.target.src =
            "https://placehold.co/600x400?text=Error+loading+image")
        }
      />

      <div className="error-message">
        <p>{errorMessage}</p>
      </div>

      <div className="btns">
        <button>{post ? "Update Post" : "Create Post"}</button>
      </div>
    </form>
  );
}
