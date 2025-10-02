import { useEffect, useRef, useState } from "react";
import { auth } from "../firebase-config";
import { signOut } from "firebase/auth";
import UserPosts from "../components/UserPosts";
import Loader from "../components/Loader";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [mail, setMail] = useState("");
  const [image, setImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fileInputRef = useRef(null);

  const url = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/users/${auth.currentUser?.uid}.json`; // replace YOUR-FIREBASE-URL with your Firebase URL

  useEffect(() => {
    async function getUser() {
      const response = await fetch(url);
      const data = await response.json();

      if (data) {
        setName(data.name);
        setTitle(data.title);
        setMail(data.mail);
        setImage(data.image);
      }
      setIsLoading(false);
    }
    getUser();
  }, [url]);

  async function handleSaveUser(event) {
    event.preventDefault();
    setIsLoading(true);

    const user = {
      name,
      title,
      mail,
      image
    };

    const response = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify(user)
    });

    if (!response.ok) {
      setErrorMessage("Sorry, something went wrong. Please try again.");
    }
    setIsLoading(false);
  }

  /**
   * handleImageChange is called every time the user chooses an image in the file system.
   * The event is fired by the input file field in the form
   */
  async function handleImageChange(event) {
    const file = event.target.files[0]; // get the first file in the array
    if (file.size < 500000) {
      // if file size is below 0.5MB
      const imageUrl = await uploadImage(file); // call the uploadImage function
      setImage(imageUrl); // set the image state with the image URL
      setErrorMessage(""); // reset errorMessage state
    } else {
      // if not below 0.5MB display an error message using the errorMessage state
      setErrorMessage("The image file is too big!");
    }
  }

  async function uploadImage(imageFile) {
    const firebaseProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
    const url = `https://firebasestorage.googleapis.com/v0/b/${firebaseProjectId}.appspot.com/o/${imageFile.name}`;
    // POST request to upload image
    const response = await fetch(url, {
      method: "POST",
      body: imageFile,
      headers: { "Content-Type": imageFile.type }
    });

    if (!response.ok) {
      setErrorMessage("Upload image failed"); // set errorMessage state with error message
      throw new Error("Upload image failed"); // throw an error
    }

    const imageUrl = `${url}?alt=media`; // get the image URL
    return imageUrl; // return the image URL
  }

  function handleSignOut() {
    signOut(auth); // sign out from firebase/auth
  }

  return (
    <section className="page">
      <div className="container">
        <h1>Profile Page</h1>
        <form className="form-grid" onSubmit={handleSaveUser}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            name="name"
            placeholder="Type name"
          />

          <label htmlFor="email">Mail</label>
          <input
            type="email"
            value={mail}
            onChange={e => setMail(e.target.value)}
            name="email"
            placeholder="Type email"
            disabled
          />

          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            name="title"
            placeholder="Type your title"
          />

          <label htmlFor="image-url">Image</label>
          <input type="file" className="hide" accept="image/*" onChange={handleImageChange} ref={fileInputRef} />
          <img
            id="image"
            className={"image-preview"}
            src={image ? image : "https://placehold.co/600x400?text=Click+here+to+select+an+image"}
            alt="Choose"
            onError={e => (e.target.src = "https://placehold.co/600x400?text=Error+loading+image")}
            onClick={() => fileInputRef.current.click()}
          />
          <div className="error-message">
            <p>{errorMessage}</p>
          </div>
          <div className="btns">
            <button>Save User</button>
          </div>
        </form>
        <div className="btns">
          <button className="btn-cancel" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>
      <h2>Posts</h2>
      <UserPosts uid={auth.currentUser?.uid} />
      <Loader show={isLoading} />
    </section>
  );
}
