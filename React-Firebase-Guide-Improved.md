# React CRUD App with Firebase REST - Forbedret Guide

**Rasmus Cederdorff (RACE)**  
Senior Lecturer & Web App Developer  
race@eaaa.dk

---

## 📚 Hvad lærer du i denne guide?

- React komponenter og hooks
- Firebase Realtime Database REST API
- CRUD operationer (Create, Read, Update, Delete)
- React Router og navigation
- Form handling og validation
- Component reuse patterns
- File upload til Firebase Storage

---

## 🎯 Læringsmål

Efter denne guide kan du:

- Bygge en komplet React app med Firebase backend
- Håndtere data med REST API calls
- Implementere navigation mellem sider
- Genbruge komponenter effektivt
- Upload og håndtere billeder

---

## Del 1: Grundlæggende Setup

### 0. Project Template

- Sørg for at have en fungerende React SPA template med React Router
- Du kan bruge [react-vite-spa](https://github.com/cederdorff/react-vite-spa) som template
- Hvis du bruger GitHub template, kør `npm install` for at installere dependencies

💡 **Tip:** Check at din development server virker med `npm run dev`

---

### 1. Setup Firebase Database

#### 1.1 Opret Firebase projekt

- Følg [Setup Your Own Firebase Database REST API](https://www.notion.so/Setup-Your-Own-Firebase-Database-REST-API-138036a6562548049d5942cea329b61f?pvs=21)
- Sørg for at have data på disse endpoints:
  - `https://[dit-projekt]-default-rtdb.firebaseio.com/posts.json`
  - `https://[dit-projekt]-default-rtdb.firebaseio.com/users.json`

#### 1.2 Test dine endpoints

Før du går videre, test dine URLs i browseren. Du skulle se JSON data.

💡 **Hvorfor .json?** Firebase REST API kræver `.json` extension for at returnere data i JSON format.

---

### 2. Opret komponenter

Implementer den overordnede struktur med følgende komponenter:

- `pages/HomePage.jsx`
- `pages/CreatePage.jsx`
- `pages/UpdatePage.jsx`
- `components/NavBar.jsx` med NavLinks til Home og Create

💡 **Organisering:** Hold pages og components adskilt for bedre struktur.

---

## Del 2: Data Læsning og Visning

### 3. Læs og vis posts

#### 3.1 Grundlæggende data fetching

I `HomePage.jsx`, implementer logik til at hente posts:

```jsx
// 📁 pages/HomePage.jsx
import { useEffect, useState } from "react";

export default function HomePage() {
  const [posts, setPosts] = useState([]); // Tom array som start

  useEffect(() => {
    async function getPosts() {
      // Udskift med din Firebase URL
      const url = "https://[dit-projekt]-default-rtdb.firebaseio.com/posts.json";
      const response = await fetch(url);
      const data = await response.json();

      // Firebase returnerer et objekt - vi konverterer til array
      const postsArray = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
      setPosts(postsArray);
    }
    getPosts();
  }, []); // Tom array = kør én gang ved mount

  return (
    <section className="page">
      <section className="grid">
        {posts.map(post => (
          <article key={post.id} className="post-card">
            <img src={post.image} alt={post.caption} />
            <h2>{post.caption}</h2>
          </article>
        ))}
      </section>
    </section>
  );
}
```

#### 3.2 Test dit setup

- Check browser developer tools console
- Se om `postsArray` indeholder data
- Hvis ikke, dobbelcheck din Firebase URL

💡 **Object.keys() forklaring:** Firebase gemmer data som objekter med auto-genererede keys. Vi konverterer til array så vi kan bruge `.map()`.

#### 3.3 Ekstraktér til PostCard komponent

Opret `components/PostCard.jsx`:

```jsx
// 📁 components/PostCard.jsx
export default function PostCard({ post }) {
  return (
    <article className="post-card">
      <img src={post.image} alt={post.caption} />
      <h2>{post.caption}</h2>
    </article>
  );
}
```

Opdatér `HomePage.jsx` til at bruge komponenten:

```jsx
// I HomePage.jsx
import PostCard from "../components/PostCard";

// I JSX:
{
  posts.map(post => <PostCard post={post} key={post.id} />);
}
```

💡 **Hvorfor key={post.id}?** React bruger keys til at identificere komponenter når listen ændres.

---

### 4. Vis User Avatar

#### 4.1 Opret UserAvatar komponent

```jsx
// 📁 components/UserAvatar.jsx
import { useEffect, useState } from "react";

export default function UserAvatar({ uid }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    async function getUser() {
      // Brug uid i URL'en
      const url = `https://[dit-projekt]-default-rtdb.firebaseio.com/users/${uid}.json`;
      const response = await fetch(url);
      const data = await response.json();
      setUser(data);
    }
    getUser();
  }, [uid]); // VIGTIGT: uid i dependency array

  return (
    <div className="avatar">
      <img src={user.image} alt={user.name} />
      <div>
        <h3>{user.name}</h3>
        <p>{user.title}</p>
      </div>
    </div>
  );
}
```

#### 4.2 Tilføj til PostCard

```jsx
// 📁 components/PostCard.jsx
import UserAvatar from "./UserAvatar";

export default function PostCard({ post }) {
  return (
    <article className="post-card">
      <UserAvatar uid={post.uid} />
      <img src={post.image} alt={post.caption} />
      <h2>{post.caption}</h2>
    </article>
  );
}
```

💡 **Dependency array:** `[uid]` sikrer at useEffect kun køres når uid ændres, ikke ved hver re-render.

---

## Del 3: CRUD Operationer

### 5. Opret posts

#### 5.1 Grundlæggende form

I `CreatePage.jsx`:

```jsx
// 📁 pages/CreatePage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreatePage() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    // Opret post objekt
    const newPost = {
      caption: caption,
      image: image,
      uid: "fTs84KRoYw5pRZEWCq2Z", // Hardcoded indtil vi tilføjer auth
      createdAt: Date.now()
    };

    // POST request til Firebase
    const url = "https://[dit-projekt]-default-rtdb.firebaseio.com/posts.json";
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(newPost)
    });

    if (response.ok) {
      navigate("/"); // Gå tilbage til forsiden
    }
  }

  return (
    <section className="page">
      <div className="container">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label htmlFor="caption">Caption</label>
          <input
            id="caption"
            type="text"
            value={caption}
            placeholder="Skriv en caption..."
            onChange={e => setCaption(e.target.value)}
          />

          <label htmlFor="image-url">Image URL</label>
          <input
            id="image-url"
            type="url"
            value={image}
            placeholder="Indsæt billede URL..."
            onChange={e => setImage(e.target.value)}
          />

          <label htmlFor="image-preview"></label>
          <img
            id="image-preview"
            className="image-preview"
            src={image || "https://placehold.co/600x400?text=Paste+image+URL"}
            alt="Preview"
            onError={e => (e.target.src = "https://placehold.co/600x400?text=Error+loading")}
          />

          <div className="btns">
            <button type="submit">Gem</button>
          </div>
        </form>
      </div>
    </section>
  );
}
```

#### 5.2 Test oprettelse

- Udfyld formularen og gem
- Check om du bliver navigeret tilbage
- Se om det nye post vises på forsiden

💡 **Date.now():** Giver et timestamp vi kan sortere efter senere.

---

### 6. Post Detail Page

#### 6.1 Forstå konceptet

Vi vil have URLs som `/posts/abc123` hvor `abc123` er post ID'et.

#### 6.2 Tilføj route

I `App.jsx`:

```jsx
<Route path="/posts/:id" element={<PostDetailPage />} />
```

#### 6.3 Opret PostDetailPage

```jsx
// 📁 pages/PostDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";

export default function PostDetailPage() {
  const [post, setPost] = useState({});
  const params = useParams();

  useEffect(() => {
    async function getPost() {
      const url = `https://[dit-projekt]-default-rtdb.firebaseio.com/posts/${params.id}.json`;
      const response = await fetch(url);
      const postData = await response.json();
      setPost({ id: params.id, ...postData });
    }
    getPost();
  }, [params.id]);

  return (
    <section className="page" id="post-page">
      <div className="container">
        <PostCard post={post} />
        <div className="btns">
          <button className="btn-outline">Redigér</button>
          <button className="btn-outline">Slet</button>
        </div>
      </div>
    </section>
  );
}
```

#### 6.4 Tilføj navigation fra PostCard

```jsx
// 📁 components/PostCard.jsx
import { useNavigate } from "react-router-dom";

export default function PostCard({ post }) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/posts/${post.id}`);
  }

  return (
    <article className="post-card" onClick={handleClick}>
      {/* eksisterende indhold */}
    </article>
  );
}
```

💡 **useParams():** Læser URL parametere. `/posts/abc123` giver `params.id = "abc123"`.

---

### 7. Opdatér posts

#### 7.1 Opret UpdatePage

```jsx
// 📁 pages/UpdatePage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function UpdatePage() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getPost() {
      const url = `https://[dit-projekt]-default-rtdb.firebaseio.com/posts/${params.id}.json`;
      const response = await fetch(url);
      const postData = await response.json();

      // Udfyld form med eksisterende data
      setCaption(postData.caption);
      setImage(postData.image);
    }
    getPost();
  }, [params.id]);

  async function handleSubmit(event) {
    event.preventDefault();

    const postToUpdate = {
      caption: caption,
      image: image,
      uid: "fTs84KRoYw5pRZEWCq2Z"
    };

    // PATCH request for at opdatere
    const url = `https://[dit-projekt]-default-rtdb.firebaseio.com/posts/${params.id}.json`;
    const response = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify(postToUpdate)
    });

    if (response.ok) {
      navigate(`/posts/${params.id}`);
    }
  }

  // Form er identisk med CreatePage (vi optimerer dette senere)
  return <section className="page">{/* Samme form som CreatePage */}</section>;
}
```

#### 7.2 Tilføj navigation fra PostDetailPage

```jsx
// I PostDetailPage.jsx
function handleUpdate() {
  navigate(`/posts/${params.id}/update`);
}

// I JSX:
<button onClick={handleUpdate}>Redigér</button>;
```

💡 **PATCH vs POST:** POST opretter ny data, PATCH opdaterer eksisterende.

---

### 8. Slet posts

I `PostDetailPage.jsx`:

```jsx
async function handleDelete() {
  const confirmDelete = window.confirm("Er du sikker på du vil slette dette post?");

  if (confirmDelete) {
    const url = `https://[dit-projekt]-default-rtdb.firebaseio.com/posts/${params.id}.json`;
    const response = await fetch(url, {
      method: "DELETE"
    });

    if (response.ok) {
      navigate("/");
    }
  }
}

// I JSX:
<button onClick={handleDelete}>Slet</button>;
```

💡 **window.confirm():** Simpel måde at få bruger bekræftelse.

---

## Del 4: Forbedringer

### 9. Component Reuse - PostForm

Nu har vi duplikeret form kode i CreatePage og UpdatePage. Lad os fikse det!

#### 9.1 Opret PostForm komponent

```jsx
// 📁 components/PostForm.jsx
import { useState, useEffect } from "react";

export default function PostForm({ savePost, post }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");

  // Hvis post prop findes, udfyld form
  useEffect(() => {
    if (post?.caption && post?.image) {
      setCaption(post.caption);
      setImage(post.image);
    }
  }, [post]);

  function handleSubmit(event) {
    event.preventDefault();

    const formData = {
      caption: caption,
      image: image
    };

    // Kald den funktion der blev sendt som prop
    savePost(formData);
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label htmlFor="caption">Caption</label>
      <input
        id="caption"
        type="text"
        value={caption}
        placeholder="Skriv en caption..."
        onChange={e => setCaption(e.target.value)}
      />

      <label htmlFor="image-url">Image URL</label>
      <input
        id="image-url"
        type="url"
        value={image}
        placeholder="Indsæt billede URL..."
        onChange={e => setImage(e.target.value)}
      />

      <label htmlFor="image-preview"></label>
      <img
        id="image-preview"
        className="image-preview"
        src={image || "https://placehold.co/600x400?text=Paste+image+URL"}
        alt="Preview"
      />

      <div className="btns">
        <button type="submit">Gem</button>
      </div>
    </form>
  );
}
```

#### 9.2 Opdatér CreatePage

```jsx
// 📁 pages/CreatePage.jsx
import PostForm from "../components/PostForm";
import { useNavigate } from "react-router-dom";

export default function CreatePage() {
  const navigate = useNavigate();

  async function createPost(formData) {
    const newPost = {
      ...formData,
      uid: "fTs84KRoYw5pRZEWCq2Z",
      createdAt: Date.now()
    };

    const url = "https://[dit-projekt]-default-rtdb.firebaseio.com/posts.json";
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(newPost)
    });

    if (response.ok) {
      navigate("/");
    }
  }

  return (
    <section className="page">
      <div className="container">
        <h1>Opret Post</h1>
        <PostForm savePost={createPost} />
      </div>
    </section>
  );
}
```

#### 9.3 Opdatér UpdatePage

```jsx
// 📁 pages/UpdatePage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm";

export default function UpdatePage() {
  const [post, setPost] = useState({});
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getPost() {
      const url = `https://[dit-projekt]-default-rtdb.firebaseio.com/posts/${params.id}.json`;
      const response = await fetch(url);
      const postData = await response.json();
      setPost({ id: params.id, ...postData });
    }
    getPost();
  }, [params.id]);

  async function updatePost(formData) {
    const postToUpdate = {
      ...formData,
      uid: post.uid // Bevar original uid
    };

    const url = `https://[dit-projekt]-default-rtdb.firebaseio.com/posts/${params.id}.json`;
    const response = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify(postToUpdate)
    });

    if (response.ok) {
      navigate(`/posts/${params.id}`);
    }
  }

  return (
    <section className="page">
      <div className="container">
        <h1>Redigér Post</h1>
        <PostForm savePost={updatePost} post={post} />
      </div>
    </section>
  );
}
```

💡 **Component reuse:** Samme form bruges til både oprettelse og opdatering ved at sende forskellige funktioner som props.

---

### 10. Grundlæggende validation

Tilføj til `PostForm.jsx`:

```jsx
import { useState, useEffect } from "react";

export default function PostForm({ savePost, post }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ... eksisterende useEffect

  function handleSubmit(event) {
    event.preventDefault();

    // Simpel validation
    if (!caption.trim()) {
      setErrorMessage("Caption er påkrævet");
      return;
    }

    if (!image.trim()) {
      setErrorMessage("Billede URL er påkrævet");
      return;
    }

    // Clear error og gem
    setErrorMessage("");
    const formData = { caption: caption.trim(), image: image.trim() };
    savePost(formData);
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      {/* Eksisterende form felter */}

      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="btns">
        <button type="submit">Gem</button>
      </div>
    </form>
  );
}
```

---

### 11. Søgning og sortering

Tilføj til `HomePage.jsx`:

```jsx
export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");

  // ... eksisterende useEffect

  // Filtrer posts baseret på søgning
  const filteredPosts = posts.filter(post => post.caption.toLowerCase().includes(searchQuery.toLowerCase()));

  // Sortér posts
  filteredPosts.sort((postA, postB) => {
    if (sortBy === "createdAt") {
      return postB.createdAt - postA.createdAt; // Nyeste først
    }
    if (sortBy === "caption") {
      return postA.caption.localeCompare(postB.caption);
    }
    return 0;
  });

  return (
    <section className="page">
      <form className="grid-filter" role="search">
        <label>
          Søg i captions
          <input type="text" placeholder="Søg..." onChange={e => setSearchQuery(e.target.value)} />
        </label>

        <label>
          Sortér efter
          <select onChange={e => setSortBy(e.target.value)}>
            <option value="createdAt">Dato</option>
            <option value="caption">Caption</option>
          </select>
        </label>
      </form>

      <section className="grid">
        {filteredPosts.map(post => (
          <PostCard post={post} key={post.id} />
        ))}
      </section>
    </section>
  );
}
```

---

## Del 5: Advanced Features (Valgfri)

### 12. Environment Variables

Opret `.env` fil i rod mappen:

```env
VITE_FIREBASE_DATABASE_URL=https://dit-projekt-default-rtdb.firebaseio.com
```

Brug i komponenter:

```jsx
const url = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/posts.json`;
```

### 13. Loading States

```jsx
const [loading, setLoading] = useState(true);

// I useEffect:
useEffect(() => {
  async function getPosts() {
    setLoading(true);
    try {
      // ... fetch logic
      setPosts(postsArray);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }
  getPosts();
}, []);

// I JSX:
if (loading) return <div>Loading...</div>;
```

### 14. File Upload

Følg den eksisterende guide for Firebase Storage integration.

---

## 🎉 Tillykke!

Du har nu bygget en komplet React CRUD app med Firebase!

### Næste skridt:

- Tilføj authentication
- Implementer real-time updates
- Forbedre UI/UX
- Deploy til production

---

## 📚 Læring checks

- [ ] Forstår du hvordan useEffect virker?
- [ ] Kan du forklare forskellen mellem POST, PATCH og DELETE?
- [ ] Forstår du hvordan component props virker?
- [ ] Kan du implementere en ny feature selvstændigt?
