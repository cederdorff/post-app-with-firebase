import { useState, useEffect, useRef } from "react";

export default function PostForm({ savePost, post }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isCaptionError, setIsCaptionError] = useState(false);
  const [isImageError, setIsImageError] = useState(false);

  const fileInputRef = useRef(null);

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

    if (!image) {
      setErrorMessage("Please choose an image.");
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

  /**
   * handleImageChange is called every time the user chooses an image in the fire system.
   * The event is fired by the input file field in the form
   */
  function handleImageChange(event) {
    const file = event.target.files[0];
    if (file.size < 500000) {
      // image file size must be below 0,5MB
      const reader = new FileReader();
      reader.onload = event => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
      setErrorMessage(""); // reset errorMessage state
      setIsImageError(false); // reset isImageError state
    } else {
      // if not below 0.5MB display an error message using the errorMessage state
      setErrorMessage("The image file is too big!");
      setIsImageError(true); // set isImageError to true
    }
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
        type="file"
        className="hide"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
      />
      <img
        id="image"
        className={isImageError ? "error image-preview" : "image-preview"}
        src={
          image
            ? image
            : "https://placehold.co/600x400?text=Click+here+to+select+an+image"
        }
        alt="Choose"
        onError={e =>
          (e.target.src =
            "https://placehold.co/600x400?text=Error+loading+image")
        }
        onClick={() => fileInputRef.current.click()}
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
