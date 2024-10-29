import { useState, useEffect, useRef } from "react";
import Loader from "./Loader";

export default function PostForm({ savePost, post }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
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
    // ... send formData to API or parent component
    savePost(formData); // <-- pass formData to parent component
  }

  /**
   * handleImageChange is called every time the user chooses an image in the file system.
   * The event is fired by the input file field in the form
   */
  async function handleImageChange(event) {
    setIsLoading(true); // set isLoading state to true
    const file = event.target.files[0]; // get the first file in the array
    if (file.size < 500000) {
      // if file size is below 0.5MB
      const imageUrl = await uploadImage(file); // call the uploadImage function
      setImage(imageUrl); // set the image state with the image URL
      setErrorMessage(""); // reset errorMessage state
      setIsImageError(false); // reset isImageError state
    } else {
      // if not below 0.5MB display an error message using the errorMessage state
      setErrorMessage("The image file is too big!");
      setIsImageError(true); // set isImageError to true
    }
    setTimeout(() => setIsLoading(false), 500); // set isLoading state to false after 500ms
  }

  async function uploadImage(imageFile) {
    const firebaseProjectId = "fb-rest-race"; // replace with your own firebase project id
    const url = `https://firebasestorage.googleapis.com/v0/b/${firebaseProjectId}.appspot.com/o/${imageFile.name}`;
    // POST request to upload image
    const response = await fetch(url, {
      method: "POST",
      body: imageFile,
      headers: { "Content-Type": imageFile.type }
    });

    if (!response.ok) {
      setErrorMessage("Upload image failed"); // set errorMessage state with error message
      setIsImageError(true); // set isImageError to true
      throw new Error("Upload image failed"); // throw an error
    }

    const imageUrl = `${url}?alt=media`; // get the image URL
    return imageUrl; // return the image URL
  }

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
      <Loader show={isLoading} />
    </>
  );
}
