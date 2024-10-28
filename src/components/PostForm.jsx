import { useState } from "react";

export default function PostForm({ savePost }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
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
      <div className="btns">
        <button>Save</button>
      </div>
    </form>
  );
}