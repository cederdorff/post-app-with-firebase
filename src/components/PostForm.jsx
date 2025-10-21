import { useState, useEffect, useRef } from "react";
import Loader from "./Loader";

export default function PostForm({ savePost, post }) {
  const [caption, setCaption] = useState("");
  // `image` holds the image URL if present; `imageFile` holds the raw File when selected
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCaptionError, setIsCaptionError] = useState(false);
  const [isImageError, setIsImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    // pass imageFile separately so caller can upload to Storage
    savePost(formData, imageFile); // <-- pass formData and raw file to parent
  }

  /**
   * handleImageChange is called every time the user chooses an image in the file system.
   * The event is fired by the input file field in the form
   */
  async function handleImageChange(event) {
    setIsLoading(true); // set isLoading state to true
    const file = event.target.files[0]; // get the first file in the array
    if (!file) return;
    if (file.size < 5000000) {
      // accept files up to ~5MB
      setImageFile(file);
      // show a local preview while upload happens on form submit
      const reader = new FileReader();
      reader.onload = e => setImage(e.target.result);
      reader.readAsDataURL(file);
      setErrorMessage("");
      setIsImageError(false);
    } else {
      setErrorMessage("The image file is too big!");
      setIsImageError(true);
    }
    setTimeout(() => setIsLoading(false), 300); // set isLoading state to false after preview
  }

  // Note: actual upload happens in the parent via `savePost(formData, imageFile)`

  return (
    <>
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
        <input type="file" className="hide" accept="image/*" onChange={handleImageChange} ref={fileInputRef} />
        <img
          id="image"
          className={isImageError ? "error image-preview" : "image-preview"}
          src={image ? image : "https://placehold.co/600x400?text=Click+here+to+select+an+image"}
          alt="Choose"
          onError={e => (e.target.src = "https://placehold.co/600x400?text=Error+loading+image")}
          onClick={() => fileInputRef.current.click()}
        />

        <div className="error-message">
          <p>{errorMessage}</p>
        </div>

        <div className="btns">
          <button>{post ? "Update Post" : "Create Post"}</button>
        </div>
      </form>
      <Loader show={isLoading} />
    </>
  );
}
