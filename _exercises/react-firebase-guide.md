# React CRUD App with Firebase REST

**Rasmus Cederdorff (RACE)**  
Senior Lecturer & Web App Developer  
race@eaaa.dk

---

## ⚠️ VIGTIGT - Læs dette først!

**Denne guide bruger placeholder URLs for Firebase.**

Overalt hvor du ser `[dit-projekt-navn]` skal du udskifte det med dit faktiske Firebase projekt navn!

**Eksempel:**

- I guiden: `https://[dit-projekt-navn]-default-rtdb.firebaseio.com/posts.json`
- Din URL: `https://min-super-app-default-rtdb.firebaseio.com/posts.json`

Find dit projekt navn i Firebase Console → Project Settings eller i din database URL.

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

### 0. Project Template - Start med React Vite SPA

For at sikre at alle starter fra det samme udgangspunkt, skal vi bruge det specifikke React template.

#### 0.1 Brug GitHub Template

**Opgave:** Gå til [react-vite-spa template](https://github.com/cederdorff/react-vite-spa) og opret dit eget projekt:

1. **Klik "Use this template"** knappen på GitHub
2. **Vælg "Create a new repository"**
3. **Giv dit repository et navn** (f.eks. "min-post-app")
4. **Sæt til Public eller Private** efter eget ønske
5. **Klik "Create repository"**

💡 **Hvorfor template?** Det giver dig React Router, folder struktur og basic setup automatisk.

#### 0.2 Clone og installer

**Opgave:** Download dit nye projekt til din computer:

```bash
# Clone dit nye repository (udskift med dit repository URL)
git clone https://github.com/[dit-github-navn]/[dit-repository-navn].git

# Gå ind i mappen
cd [dit-repository-navn]

# Installer dependencies
npm install
```

**Test dit setup:**

```bash
# Start development server
npm run dev
```

Du skulle nu se en fungerende React app på `http://localhost:5173` med navigation mellem Home og About sider.

#### 0.3 Bekræft projektet virker

**Tjek at følgende fungerer:**

- ✅ React app starter uden fejl
- ✅ Navigation mellem sider virker
- ✅ Du kan se "Home" og "About" sider
- ✅ Hot reload virker (prøv at ændre noget tekst)

**Folder struktur du skulle have:**

```
dit-projekt/
├── src/
│   ├── components/
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   └── AboutPage.jsx
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

💡 **Hvis noget ikke virker:** Stop serveren (Ctrl+C) og kør `npm install` igen.

#### 0.4 Forbered til Firebase integration

**Opgave:** Nu er dit projekt klar til at tilføje Firebase funktionalitet. I næste step sætter vi Firebase op.

**Hvad har vi nu:**

- ✅ React med Vite (hurtig development)
- ✅ React Router (navigation mellem sider)
- ✅ Grundlæggende folder struktur
- ✅ Pages og components adskilt

**Hvad kommer næst:**

- Firebase database setup
- REST API calls
- CRUD operationer

⚠️ **Vigtigt:** Sørg for at dit projekt kører uden fejl før du går videre!

---

### 1. Setup Firebase Database

#### 1.1 Opret Firebase projekt

- Følg [Setup Your Own Firebase Database REST API](https://www.notion.so/Setup-Your-Own-Firebase-Database-REST-API-138036a6562548049d5942cea329b61f?pvs=21)
- Sørg for at have data på disse endpoints:
  - `https://[dit-projekt-navn]-default-rtdb.firebaseio.com/posts.json`
  - `https://[dit-projekt-navn]-default-rtdb.firebaseio.com/users.json`

⚠️ **VIGTIGT:** Udskift `[dit-projekt-navn]` med dit faktiske Firebase projekt navn!

#### 1.2 Find din Firebase URL

Din Firebase Realtime Database URL finder du i Firebase Console:

1. **Gå til Firebase Console** → Dit projekt
2. **Vælg "Realtime Database"** i venstre menu
3. **Se din database URL** øverst på siden

**Eksempel på hvordan URL'en ser ud:**

- Komplet URL: `https://min-super-app-default-rtdb.firebaseio.com/`
- Dit projekt navn er: `min-super-app`
- Posts endpoint: `https://min-super-app-default-rtdb.firebaseio.com/posts.json`

**💡 Nemt trick til at huske det:**
Kopier din database URL fra Firebase Console og gem den i en note eller kommentar øverst i dine filer, så du nemt kan copy-paste den.

```javascript
// MIN FIREBASE URL: https://mit-projekt-navn-default-rtdb.firebaseio.com/
```

#### 1.3 Test dine endpoints

Før du går videre, test dine URLs i browseren med `.json` tilføjet:

**Test disse URLs i din browser:**

- `https://[dit-projekt-navn]-default-rtdb.firebaseio.com/posts.json`
- `https://[dit-projekt-navn]-default-rtdb.firebaseio.com/users.json`

Du skulle se JSON data. Hvis ikke, check:

- Er dit Firebase projekt oprettet korrekt?
- Har du tilføjet sample data?
- Er database reglerne sat til test mode?

💡 **Hvorfor .json?** Firebase REST API kræver `.json` extension for at returnere data i JSON format.

---

### 2. Opret komponenter

Implementer den overordnede struktur for projektet med følgende komponenter:

- `pages/HomePage.jsx` - her kommer du til at vise alle `posts`
- `pages/CreatePage.jsx` - her skal du kunne oprette en ny `post`
- `pages/UpdatePage.jsx` - her skal du kunne opdatere et eksisterende `post`
- `components/NavBar.jsx` med NavLinks til Home og Create - og senere Profile

💡 **Organisering:** Hold pages og components adskilt for bedre struktur.

---

## Del 2: Data Læsning og Visning

### 3. Læs og vis posts

#### 3.1 Forstå data strukturen

Før vi begynder at kode, lad os forstå hvad vi arbejder med:

**Firebase data struktur:**

- Firebase Realtime Database gemmer data som JSON objekter
- Hver post får et unikt, auto-genereret ID som key
- Data ser sådan ud: `{"-abc123": {caption: "...", image: "..."}}`

**React krav:**

- Vi skal bruge et array til `.map()` funktionen
- Hver post skal have et unikt `id` felt
- Vi skal konvertere fra objekt til array format

💡 **Hvorfor denne konvertering?** React's `.map()` fungerer bedst med arrays, ikke objekter.

#### 3.2 Opret grundlæggende komponent struktur

Start med en simpel `HomePage.jsx`:

**Opgave:** Opret en HomePage komponent der:

- Importerer `useState` og `useEffect` fra React
- Har en `posts` state der starter som tom array
- Returnerer en simpel sektion med teksten "Posts kommer her"

<details>
<summary>🔍 Se løsning</summary>

```jsx
// 📁 pages/HomePage.jsx
import { useEffect, useState } from "react";

export default function HomePage() {
  const [posts, setPosts] = useState([]);

  return (
    <section className="page">
      <h1>Posts kommer her</h1>
    </section>
  );
}
```

</details>

#### 3.3 Tilføj data fetching

Nu skal vi hente data fra Firebase.

**Tænk over:**

- Hvornår skal vi hente data? (Når komponenten loader)
- Hvordan henter vi data? (fetch API)
- Hvor gemmer vi data? (i posts state)

**Opgave:** Tilføj en `useEffect` der:

- Kører når komponenten mounter
- Henter data fra din Firebase URL
- Logger data til console (så du kan se strukturen)

⚠️ **HUSK:** Udskift `[dit-projekt-navn]` med dit faktiske Firebase projekt navn!

<details>
<summary>🔍 Se løsning</summary>

```jsx
useEffect(() => {
  async function getPosts() {
    // UDSKIFT [dit-projekt-navn] med dit faktiske Firebase projekt navn!
    const url = "https://[dit-projekt-navn]-default-rtdb.firebaseio.com/posts.json";
    const response = await fetch(url);
    const data = await response.json();
    console.log("Data fra Firebase:", data);
  }
  getPosts();
}, []);
```

</details>

**Test:** Åbn browser developer tools og se console output. Hvad ser du?

#### 3.4 Konvertér data til array format

Nu har du set Firebase data strukturen. Tid til at konvertere den.

**Tænk over:**

- Firebase data: `{"-abc123": {caption: "...", image: "..."}, "-def456": {...}}`
- Vi vil have: `[{id: "-abc123", caption: "...", image: "..."}, {...}]`

**Nøgle koncepter:**

- `Object.keys(data)` giver os alle keys (ID'erne)
- `.map()` lader os transformere hvert element
- Spread operator `...` kopierer alle properties

**Opgave:** Udvid din `getPosts` funktion til at:

- Bruge `Object.keys()` til at få alle post ID'er
- Mappe over ID'erne og skabe nye objekter
- Hver post skal have `id` + alle original properties
- Gemme resultatet i `posts` state

<details>
<summary>🔍 Se løsning</summary>

```jsx
async function getPosts() {
  // UDSKIFT [dit-projekt-navn] med dit faktiske Firebase projekt navn!
  const url = "https://[dit-projekt-navn]-default-rtdb.firebaseio.com/posts.json";
  const response = await fetch(url);
  const data = await response.json();

  // Fra objekt til array
  const postsArray = Object.keys(data).map(key => ({
    id: key,
    ...data[key]
  }));

  console.log("Posts array:", postsArray);
  setPosts(postsArray);
}
```

</details>

💡 **Spread operator forklaring:** `...data[key]` tager alle properties fra post objektet og "spreder" dem ind i det nye objekt.

#### 3.5 Vis posts som simpel liste

Før vi laver fancy styling, lad os se om vores data virker.

**Opgave:** I din `return` statement:

- Map over `posts` arrayet
- For hver post, vis en `<div>` med caption tekst
- Husk `key` prop!

<details>
<summary>🔍 Se løsning</summary>

```jsx
return (
  <section className="page">
    <h1>Mine Posts</h1>
    {posts.map(post => (
      <div key={post.id}>
        <p>{post.caption}</p>
      </div>
    ))}
  </section>
);
```

</details>

**Test:** Kan du se dine post captions på siden?

#### 3.6 Tilføj billeder og styling

Nu hvor data virker, lad os gøre det pænere.

**Opgave:** Opdatér din mapping til at vise:

- Et `<article>` element med class "post-card"
- Et `<img>` element med post billedet
- En `<h2>` med caption
- Tilføj grundlæggende grid styling til container

<details>
<summary>🔍 Se løsning</summary>

```jsx
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
```

</details>

#### 3.7 Debug common issues

**Problem 1: Ingen posts vises**

- Check Firebase URL
- Check console for fejl
- Ensure din Firebase database har data

**Problem 2: "Cannot read property of undefined"**

- Data er måske ikke loaded endnu
- Tilføj conditional rendering: `{posts && posts.map(...)}`

**Problem 3: Billeder vises ikke**

- Check om image URLs er gyldige
- Tilføj `onError` handler til img tags

#### 3.8 Komplet HomePage komponent

Når du har gennemført alle steps, skulle din HomePage se sådan ud:

```jsx
// 📁 pages/HomePage.jsx
import { useEffect, useState } from "react";

export default function HomePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function getPosts() {
      // UDSKIFT [dit-projekt-navn] med dit faktiske Firebase projekt navn!
      const url = "https://[dit-projekt-navn]-default-rtdb.firebaseio.com/posts.json";
      const response = await fetch(url);
      const data = await response.json();

      const postsArray = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
      setPosts(postsArray);
    }
    getPosts();
  }, []);

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

#### 3.9 Ekstraktér til PostCard komponent

For bedre code organisation skal vi ekstrahere post visningen til en separat komponent.

**Opgave:** Opret `components/PostCard.jsx`:

- Modtag `post` som prop
- Returnér article med post data
- Vis billede og caption (UserAvatar kommer i næste sektion)

<details>
<summary>🔍 Se løsning</summary>

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

</details>

**Opdatér HomePage.jsx** til at bruge komponenten:

```jsx
// I HomePage.jsx
import PostCard from "../components/PostCard";

// I JSX:
{
  posts.map(post => <PostCard post={post} key={post.id} />);
}
```

💡 **Hvorfor key={post.id}?** React bruger keys til at identificiere komponenter når listen ændres.

**Test din løsning:**

- Kan du se alle posts?
- Vises billeder og captions korrekt?
- Er komponent koden nu mere organiseret?

💡 **Note:** I næste sektion tilføjer vi UserAvatar til PostCard komponenten.

---

### 4. Vis User Avatar

#### 4.1 Forstå user-post relationerne

Før vi koder, lad os forstå hvordan users og posts hænger sammen:

**Data struktur i Firebase:**

- **Posts** har et `uid` felt der refererer til en bruger
- **Users** har deres egen collection med bruger information
- Vi skal "joine" data ved at bruge uid til at hente user info

**Hvorfor gør vi dette?**

- Normaliseret data (ingen duplikering)
- Hvis en bruger ændrer navn, skal vi kun opdatere ét sted
- Mindre data at overføre

💡 **Tænk over:** Hvordan ville du vise bruger info ved hver post?

#### 4.2 Planlæg UserAvatar komponent

**Hvad skal komponenten gøre?**

- Modtage en `uid` som prop
- Hente user data fra Firebase baseret på uid
- Vise user's billede, navn og titel

**Hvad skal komponenten returnere?**

- Et div med user billede og info
- Fallback hvis data ikke er loaded endnu

**Opgave:** Tænk over hvilke React hooks du skal bruge:

- Til at gemme user data?
- Til at hente data når komponenten loader?

<details>
<summary>🔍 Se løsning</summary>

- `useState` til at gemme user data
- `useEffect` til at hente data når uid ændres

</details>

#### 4.3 Opret grundlæggende UserAvatar struktur

**Opgave:** Opret `components/UserAvatar.jsx` der:

- Importerer nødvendige React hooks
- Tager `uid` som prop
- Har en `user` state (start med tomt objekt)
- Returnerer en simpel div med teksten "User info kommer her"

<details>
<summary>🔍 Se løsning</summary>

```jsx
// 📁 components/UserAvatar.jsx
import { useEffect, useState } from "react";

export default function UserAvatar({ uid }) {
  const [user, setUser] = useState({});

  return <div>User info kommer her (uid: {uid})</div>;
}
```

</details>

#### 4.4 Tilføj data fetching

Nu skal vi hente user data fra Firebase.

**Tænk over:**

- Hvilken URL skal vi bruge? (Hint: `/users/${uid}.json`)
- Hvornår skal vi hente data? (Når uid ændres)
- Hvordan håndterer vi at uid kan ændre sig?

**Opgave:** Tilføj `useEffect` der:

- Henter user data baseret på uid prop
- Gemmer data i user state
- Logger data til console først (for at se strukturen)

⚠️ **VIGTIGT:** Husk dependency array med `[uid]`!

<details>
<summary>🔍 Se løsning</summary>

```jsx
useEffect(() => {
  async function getUser() {
    // UDSKIFT [dit-projekt-navn] med dit faktiske Firebase projekt navn!
    const url = `https://[dit-projekt-navn]-default-rtdb.firebaseio.com/users/${uid}.json`;
    const response = await fetch(url);
    const data = await response.json();
    console.log("User data:", data);
    setUser(data);
  }
  getUser();
}, [uid]); // KRITISK: uid i dependency array!
```

</details>

**Test:** Tilføj UserAvatar til en post og check console. Ser du user data?

#### 4.5 Forstå dependency arrays

**Hvorfor `[uid]` i useEffect?**

Uden dependency array:

```jsx
useEffect(() => {
  getUser(); // Kører ved HVER re-render! 🚫
});
```

Med tomt array:

```jsx
useEffect(() => {
  getUser(); // Kører kun én gang, men uid kan ændre sig! 🚫
}, []);
```

Med uid dependency:

```jsx
useEffect(() => {
  getUser(); // Kører når uid ændres - perfekt! ✅
}, [uid]);
```

💡 **Regel:** Alle variabler fra props/state der bruges i useEffect skal være i dependency array.

#### 4.6 Implementer UI struktur

Nu skal vi vise user data på en pæn måde.

**Design overvejelser:**

- Vis user billede som lille cirkulær avatar
- Vis navn som heading
- Vis titel som mindre tekst
- Lav det som en horisontalt layout

**Opgave:** Opdatér dit return statement til at:

- Bruge CSS class "avatar"
- Vise user.image i et img tag
- Vise user.name i et h3 tag
- Vise user.title i et p tag
- Wrap navn og titel i et span/div

<details>
<summary>🔍 Se løsning</summary>

```jsx
return (
  <div className="avatar">
    <img src={user.image} alt={user.name} />
    <span>
      <h3>{user.name}</h3>
      <p>{user.title}</p>
    </span>
  </div>
);
```

</details>

#### 4.7 Håndtér loading states

**Problem:** Hvad hvis user data ikke er loaded endnu?

**Opgave:** Tilføj fallback values:

- Hvis user.image ikke findes, vis placeholder billede
- Hvis user.name ikke findes, vis "Loading..."
- Tjek med optional chaining (`user?.name`)

<details>
<summary>🔍 Se løsning</summary>

```jsx
return (
  <div className="avatar">
    <img src={user?.image || "https://placehold.co/50x50.webp"} alt={user?.name || "User"} />
    <span>
      <h3>{user?.name || "Loading..."}</h3>
      <p>{user?.title || ""}</p>
    </span>
  </div>
);
```

</details>

#### 4.8 Integrer med PostCard

Nu skal vi tilføje UserAvatar til vores posts.

**Tænk over:**

- Hvor i PostCard skal avatar vises? (Øverst)
- Hvilken prop skal vi sende til UserAvatar? (post.uid)
- Hvordan importerer vi komponenten?

**Opgave:** Opdatér `PostCard.jsx` til at:

- Importere UserAvatar komponent
- Vise UserAvatar øverst i hver post
- Sende `post.uid` som prop

<details>
<summary>🔍 Se løsning</summary>

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

</details>

#### 4.9 Debug almindelige problemer

**Problem 1: "Cannot read property of undefined"**

- User data er ikke loaded endnu
- Brug optional chaining: `user?.name`
- Eller conditional rendering: `{user && <h3>{user.name}</h3>}`

**Problem 2: useEffect kører i loop**

- Check dependency array
- Skal indeholde `[uid]`, ikke være tom eller manglende

**Problem 3: Alle posts viser samme user**

- Check om du sender den rigtige uid prop
- Console.log uid i UserAvatar for at debugge

**Problem 4: Styling ser forkert ud**

- Check at CSS classes matcher (`.avatar`)
- Tjek om billedet har rigtig størrelse

#### 4.10 Komplet UserAvatar komponent

Når alle steps er gennemført, skulle din komponent se sådan ud:

```jsx
// 📁 components/UserAvatar.jsx
import { useEffect, useState } from "react";

export default function UserAvatar({ uid }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    async function getUser() {
      // UDSKIFT [dit-projekt-navn] med dit faktiske Firebase projekt navn!
      const url = `https://[dit-projekt-navn]-default-rtdb.firebaseio.com/users/${uid}.json`;
      const response = await fetch(url);
      const data = await response.json();
      if (data) {
        setUser(data);
      }
    }
    getUser();
  }, [uid]);

  return (
    <div className="avatar">
      <img src={user?.image || "https://placehold.co/50x50.webp"} alt={user?.name} />
      <span>
        <h3>{user?.name}</h3>
        <p>{user?.title}</p>
      </span>
    </div>
  );
}
```

**Test din løsning:**

- Kan du se user avatars ved alle posts?
- Vises rigtige navne og titler?
- Fungerer placeholder billeder hvis noget mangler?

💡 **Dependency array:** `[uid]` sikrer at useEffect kun køres når uid ændres, ikke ved hver re-render.

---

## Del 3: CRUD Operationer

### 5. Opret posts

#### 5.1 Forstå form handling i React

Før vi bygger vores create form, lad os forstå grundprincipperne:

**Controlled vs Uncontrolled components:**

- **Controlled:** React styrer input værdierne via state
- **Uncontrolled:** DOM'en styrer input værdierne direkte
- Vi bruger **controlled** for bedre kontrol

**Form submission process:**

1. User udfylder form
2. User klikker submit
3. `handleSubmit` function kaldes
4. Vi laver API call til Firebase
5. Ved success: navigér til anden side

💡 **Hvorfor controlled components?** Vi kan validere, formatere og reagere på ændringer i real-time.

#### 5.2 Planlæg CreatePage struktur

**Hvad skal siden indeholde?**

- Form med input felter (caption, image URL)
- Image preview
- Submit button
- Navigation efter success

**Hvilke React hooks skal vi bruge?**

- `useState` for form data
- `useNavigate` for navigation efter submit
- Eventuel `useEffect` for cleanup

**Opgave:** Tænk over data strukturen. Hvad skal et nyt post objekt indeholde?

<details>
<summary>🔍 Se løsning</summary>

```javascript
{
  caption: "Bruger indtastet tekst",
  image: "URL til billede",
  uid: "Bruger ID (hardcoded indtil vi har auth)",
  createdAt: "Timestamp for sortering"
}
```

</details>

#### 5.3 Opret grundlæggende CreatePage struktur

**Opgave:** Opret `pages/CreatePage.jsx` der:

- Importerer nødvendige hooks og komponenter
- Har states for `caption` og `image`
- Har en `navigate` instans
- Returnerer en simpel form struktur

<details>
<summary>🔍 Se løsning</summary>

```jsx
// 📁 pages/CreatePage.jsx
import { useState } from "react";
import { useNavigate } from "react-router";

export default function CreatePage() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  return (
    <section className="page">
      <div className="container">
        <h1>Opret nyt post</h1>
        <form>
          <p>Form kommer her</p>
          <button type="submit">Gem</button>
        </form>
      </div>
    </section>
  );
}
```

</details>

#### 5.4 Implementer controlled inputs

Nu skal vi forbinde input felterne med vores state.

**Controlled input pattern:**

```jsx
<input value={state} onChange={e => setState(e.target.value)} />
```

**Opgave:** Tilføj input felter til din form:

- Caption input (type="text")
- Image URL input (type="url")
- Begge skal være connected til state
- Tilføj labels og placeholders

<details>
<summary>🔍 Se løsning</summary>

```jsx
<form className="form-grid">
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

  <div className="btns">
    <button type="submit">Gem</button>
  </div>
</form>
```

</details>

**Test:** Kan du skrive i input felterne og se værdierne opdatere i real-time?

#### 5.5 Tilføj image preview

En god UX feature er at vise preview af billedet.

**Tænk over:**

- Hvornår skal preview opdateres? (Når image state ændres)
- Hvad hvis URL er ugyldig? (Fallback billede)
- Hvad hvis feltet er tomt? (Placeholder)

**Opgave:** Tilføj image preview:

- Vis billede baseret på `image` state
- Brug placeholder hvis `image` er tom
- Tilføj `onError` handler for ugyldig URLs

<details>
<summary>🔍 Se løsning</summary>

```jsx
<label htmlFor="image-preview">Preview</label>
<img
  id="image-preview"
  className="image-preview"
  src={image || "https://placehold.co/600x400?text=Indsæt+billede+URL"}
  alt="Preview"
  onError={e => {
    e.target.src = "https://placehold.co/600x400?text=Ugyldigt+billede";
  }}
/>
```

</details>

#### 5.6 Implementer form submission

Nu skal vi håndtere når brugeren submitter formen.

**Form submission pattern:**

1. Prevent default browser behavior
2. Validate input
3. Create data object
4. Send to API
5. Handle response

**Opgave:** Opret `handleSubmit` function der:

- Tager `event` som parameter
- Kalder `event.preventDefault()`
- Logger form data til console først
- Tilføj `onSubmit={handleSubmit}` til form

<details>
<summary>🔍 Se løsning</summary>

```jsx
async function handleSubmit(event) {
  event.preventDefault();

  console.log("Form submitted:", { caption, image });
  // API call kommer senere
}

// I JSX:
<form className="form-grid" onSubmit={handleSubmit}>
```

</details>

**Test:** Submit formen og check console. Ser du form data?

#### 5.7 Opret post objekt

Nu skal vi strukturere vores data korrekt.

**Tænk over:**

- Hvilke felter skal et post have?
- Hvordan genererer vi et timestamp?
- Hvad med user ID (inden vi har authentication)?

**Opgave:** I din `handleSubmit`, opret et `newPost` objekt med:

- caption fra state
- image fra state
- uid (hardcode til "fTs84KRoYw5pRZEWCq2Z" indtil videre)
- createdAt (brug `Date.now()` for timestamp)

<details>
<summary>🔍 Se løsning</summary>

```jsx
async function handleSubmit(event) {
  event.preventDefault();

  const newPost = {
    caption: caption,
    image: image,
    uid: "fTs84KRoYw5pRZEWCq2Z", // Hardcoded indtil auth
    createdAt: Date.now()
  };

  console.log("New post:", newPost);
}
```

</details>

#### 5.8 Implementer Firebase POST request

Nu skal vi sende data til Firebase.

**Firebase POST pattern:**

- URL: `https://dit-projekt.firebaseio.com/posts.json`
- Method: "POST"
- Body: JSON.stringify(data)
- Content-Type sættes automatisk

**Opgave:** Tilføj fetch call i `handleSubmit`:

- POST til din Firebase posts endpoint
- Send `newPost` som JSON i body
- Log response for at teste

⚠️ **HUSK:** Udskift Firebase URL med dit projekt navn!

<details>
<summary>🔍 Se løsning</summary>

```jsx
// POST request til Firebase
// UDSKIFT [dit-projekt-navn] med dit faktiske Firebase projekt navn!
const url = "https://[dit-projekt-navn]-default-rtdb.firebaseio.com/posts.json";
const response = await fetch(url, {
  method: "POST",
  body: JSON.stringify(newPost)
});

console.log("Response:", response.ok);
```

</details>

**Test:** Udfyld og submit formen. Check Firebase Console - er det nye post der?

#### 5.9 Håndtér success og navigation

Efter succesfuld oprettelse skal vi navigere brugeren tilbage.

**Success handling pattern:**

- Check om response er OK
- Reset form (optional)
- Navigate til relevant side
- Evt. vis success besked

**Opgave:** Udvid `handleSubmit` til at:

- Tjekke om `response.ok` er true
- Navigere til forsiden ved success
- Console.log fejl ved failure

<details>
<summary>🔍 Se løsning</summary>

```jsx
if (response.ok) {
  console.log("Post oprettet succesfuldt!");
  navigate("/"); // Gå tilbage til forsiden
} else {
  console.error("Fejl ved oprettelse af post");
}
```

</details>

#### 5.10 Tilføj grundlæggende validation

Lad os tilføje simpel validation før vi sender data.

**Validation checks:**

- Er caption udfyldt?
- Er image URL udfyldt?
- Evt. minimum længde på caption

**Opgave:** Tilføj validation i `handleSubmit`:

- Check om caption og image er udfyldt
- Return early hvis validation fejler
- Log fejlbesked til console

<details>
<summary>🔍 Se løsning</summary>

```jsx
async function handleSubmit(event) {
  event.preventDefault();

  // Simpel validation
  if (!caption.trim()) {
    console.error("Caption er påkrævet");
    return;
  }

  if (!image.trim()) {
    console.error("Billede URL er påkrævet");
    return;
  }

  // ... resten af submit logikken
}
```

</details>

#### 5.11 Komplet CreatePage komponent

Når alle steps er gennemført, skulle din komponent se sådan ud:

```jsx
// 📁 pages/CreatePage.jsx
import { useState } from "react";
import { useNavigate } from "react-router";

export default function CreatePage() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    // Validation
    if (!caption.trim() || !image.trim()) {
      console.error("Alle felter skal udfyldes");
      return;
    }

    // Opret post objekt
    const newPost = {
      caption: caption.trim(),
      image: image.trim(),
      uid: "fTs84KRoYw5pRZEWCq2Z",
      createdAt: Date.now()
    };

    // POST request til Firebase
    // UDSKIFT [dit-projekt-navn] med dit faktiske Firebase projekt navn!
    const url = "https://[dit-projekt-navn]-default-rtdb.firebaseio.com/posts.json";
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(newPost)
    });

    if (response.ok) {
      navigate("/");
    } else {
      console.error("Fejl ved oprettelse af post");
    }
  }

  return (
    <section className="page">
      <div className="container">
        <h1>Opret nyt post</h1>
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

          <label htmlFor="image-preview">Preview</label>
          <img
            id="image-preview"
            className="image-preview"
            src={image || "https://placehold.co/600x400?text=Indsæt+billede+URL"}
            alt="Preview"
            onError={e => (e.target.src = "https://placehold.co/600x400?text=Ugyldigt+billede")}
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

**Test din løsning:**

- Kan du oprette nye posts?
- Bliver du navigeret tilbage til forsiden?
- Vises det nye post i listen?

---

**Test din løsning:**

- Kan du oprette nye posts?
- Bliver du navigeret tilbage til forsiden?
- Vises det nye post i listen?

💡 **Date.now():** Giver et timestamp vi kan sortere efter senere.

---

### 6. Post Detail Page

#### 6.1 Forstå routing og URL parametere

Før vi bygger detail page, lad os forstå konceptet:

**Dynamiske routes:**

- `/posts/abc123` - `abc123` er et dynamisk parameter
- React Router kan "fange" dette parameter
- Vi kan bruge parameteret til at hente specifik data

**URL struktur:**

- Liste side: `/` (viser alle posts)
- Detail side: `/posts/:id` (viser én specifik post)
- `:id` er en placeholder for det faktiske post ID

💡 **Hvorfor denne struktur?** Det giver brugervenlige URLs og gør det muligt at dele links til specifikke posts.

#### 6.2 Planlæg PostDetailPage

**Hvad skal siden gøre?**

- Læse post ID fra URL
- Hente post data fra Firebase baseret på ID
- Vise post information (genbruge PostCard?)
- Tilbyde Update og Delete knapper

**Hvilke React hooks skal vi bruge?**

- `useParams()` til at læse URL parameter
- `useState()` til at gemme post data
- `useEffect()` til at hente data når siden loader
- `useNavigate()` til navigation fra knapper

#### 6.3 Setup routing først

Før vi kan bygge komponenten, skal vi definere routen.

**Opgave:** I din `App.jsx`, tilføj en route for post detail:

- Path: `/posts/:id`
- Element: `<PostDetailPage />`
- Husk at importere komponenten

<details>
<summary>🔍 Se løsning</summary>

```jsx
// I App.jsx
import PostDetailPage from "./pages/PostDetailPage";

// I din routing:
<Route path="/posts/:id" element={<PostDetailPage />} />;
```

</details>

#### 6.4 Test routing strukturen

**Test:** Naviger manuelt til `/posts/test-id` i browser URL bar.

- Får du en fejl? (Det er forventet - komponenten findes ikke endnu)
- Kan du se `:id` parameter i URL'en?

#### 6.5 Opret grundlæggende PostDetailPage

**Opgave:** Opret `pages/PostDetailPage.jsx` der:

- Importerer nødvendige hooks
- Bruger `useParams()` til at få post ID
- Logger post ID til console
- Returnerer simpel struktur med ID

<details>
<summary>🔍 Se løsning</summary>

```jsx
// 📁 pages/PostDetailPage.jsx
import { useParams } from "react-router";

export default function PostDetailPage() {
  const params = useParams();

  console.log("Post ID:", params.id);

  return (
    <section className="page">
      <div className="container">
        <h1>Post Detail</h1>
        <p>Post ID: {params.id}</p>
      </div>
    </section>
  );
}
```

</details>

**Test:** Gå til `/posts/abc123` i browseren. Ser du "abc123" på siden og i console?

#### 6.6 Tilføj navigation fra PostCard

Nu skal vi gøre det muligt at klikke på posts for at gå til detail siden.

**Navigation pattern:**

- Tilføj click handler til PostCard
- Brug `useNavigate()` til programmatisk navigation
- Naviger til `/posts/${post.id}`

**Opgave:** Opdatér `PostCard.jsx` til at:

- Importere `useNavigate`
- Tilføje click handler der navigerer til detail page
- Gøre kortet klikbart (cursor pointer)

<details>
<summary>🔍 Se løsning</summary>

```jsx
// 📁 components/PostCard.jsx
import { useNavigate } from "react-router";
import UserAvatar from "./UserAvatar";

export default function PostCard({ post }) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/posts/${post.id}`);
  }

  return (
    <article className="post-card" onClick={handleClick} style={{ cursor: "pointer" }}>
      <UserAvatar uid={post.uid} />
      <img src={post.image} alt={post.caption} />
      <h2>{post.caption}</h2>
    </article>
  );
}
```

</details>

**Test:** Klik på et post på forsiden. Bliver du navigeret til detail siden med det rigtige ID?

#### 6.7 Implementer data fetching i PostDetailPage

Nu skal vi hente den specifikke post data.

**Tænk over:**

- Hvilken Firebase URL skal vi bruge? `/posts/${id}.json`
- Hvornår skal vi hente data? (Når komponenten mounter)
- Hvad hvis ID ændres? (Skal vi re-fetch?)

**Opgave:** Tilføj data fetching til PostDetailPage:

- Tilføj `useState` for post data
- Tilføj `useEffect` der fetcher baseret på params.id
- Log den hentede data først

<details>
<summary>🔍 Se løsning</summary>

```jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function PostDetailPage() {
  const [post, setPost] = useState({});
  const params = useParams();

  useEffect(() => {
    async function getPost() {
      // UDSKIFT [dit-projekt-navn] med dit faktiske Firebase projekt navn!
      const url = `https://[dit-projekt-navn]-default-rtdb.firebaseio.com/posts/${params.id}.json`;
      const response = await fetch(url);
      const postData = await response.json();

      console.log("Post data:", postData);

      // Tilføj ID til post objektet
      setPost({ id: params.id, ...postData });
    }
    getPost();
  }, [params.id]); // Re-fetch hvis ID ændres

  return (
    <section className="page">
      <div className="container">
        <h1>{post.caption || "Loading..."}</h1>
        <p>Post ID: {params.id}</p>
      </div>
    </section>
  );
}
```

</details>

**Test:** Klik på et post. Ser du post data i console og caption som title?

#### 6.8 Genbruge PostCard komponenten

I stedet for at duplikere UI kode, kan vi genbruge PostCard til at vise post'et.

**Tænk over:**

- Hvordan sender vi post data til PostCard?
- Skal vi disable click navigation på detail siden?
- Hvordan håndterer vi at post endnu ikke er loaded?

**Opgave:** Opdatér PostDetailPage til at:

- Importere PostCard komponent
- Vise PostCard med post data
- Kun vise PostCard når post data er loaded

<details>
<summary>🔍 Se løsning</summary>

```jsx
import PostCard from "../components/PostCard";

// I JSX:
return (
  <section className="page" id="post-page">
    <div className="container">
      {post.id && <PostCard post={post} />}
      {/* Action buttons kommer senere */}
    </div>
  </section>
);
```

</details>

**Problem:** PostCard navigerer stadig når du klikker! Hvordan løser vi det?

#### 6.9 Håndtér PostCard navigation problem

Vi skal disable navigation når PostCard bruges på detail siden.

**Løsningsstrategier:**

1. Tilføj `disableNavigation` prop til PostCard
2. Check hvor komponenten bruges
3. Conditional navigation logic

**Opgave:** Vælg en løsning og implementer den:

<details>
<summary>🔍 Se løsning (Option 1)</summary>

```jsx
// 📁 components/PostCard.jsx
export default function PostCard({ post, disableNavigation = false }) {
  const navigate = useNavigate();

  function handleClick() {
    if (!disableNavigation) {
      navigate(`/posts/${post.id}`);
    }
  }

  return (
    <article className="post-card" onClick={handleClick} style={{ cursor: disableNavigation ? "default" : "pointer" }}>
      {/* ... existing content */}
    </article>
  );
}

// I PostDetailPage:
<PostCard post={post} disableNavigation={true} />;
```

</details>

#### 6.10 Tilføj Update og Delete knapper

Nu skal vi tilføje handlingsknapper til detail siden.

**Design overvejelser:**

- Knapperne skal være tydeligt placeret
- Update knap skal navigere til edit siden
- Delete knap skal slette og navigere tilbage

**Opgave:** Tilføj action buttons:

- Update knap der navigerer til `/posts/${post.id}/update`
- Delete knap (logik kommer i næste step)
- Style med "btns" CSS class

<details>
<summary>🔍 Se løsning</summary>

```jsx
import { useNavigate } from "react-router";

export default function PostDetailPage() {
  const navigate = useNavigate();
  // ... existing code

  function handleUpdate() {
    navigate(`/posts/${params.id}/update`);
  }

  function handleDelete() {
    // Delete logik kommer senere
    console.log("Delete clicked");
  }

  return (
    <section className="page" id="post-page">
      <div className="container">
        {post.id && <PostCard post={post} disableNavigation={true} />}

        <div className="btns">
          <button onClick={handleUpdate} className="btn-outline">
            Redigér
          </button>
          <button onClick={handleDelete} className="btn-outline btn-delete">
            Slet
          </button>
        </div>
      </div>
    </section>
  );
}
```

</details>

#### 6.11 Implementer delete funktionalitet

Nu skal vi implementere delete logikken.

**Delete pattern:**

1. Vis konfirmation dialog
2. Send DELETE request til Firebase
3. Håndtér response
4. Navigér tilbage til liste

**Opgave:** Implementer `handleDelete` function:

- Vis `window.confirm()` dialog
- Send DELETE request hvis bekræftet
- Navigér til "/" ved success

<details>
<summary>🔍 Se løsning</summary>

```jsx
async function handleDelete() {
  const confirmDelete = window.confirm("Er du sikker på du vil slette dette post?");

  if (confirmDelete) {
    // UDSKIFT [dit-projekt-navn] med dit faktiske Firebase projekt navn!
    const url = `https://[dit-projekt-navn]-default-rtdb.firebaseio.com/posts/${params.id}.json`;
    const response = await fetch(url, {
      method: "DELETE"
    });

    if (response.ok) {
      console.log("Post slettet succesfuldt");
      navigate("/");
    } else {
      console.error("Fejl ved sletning af post");
    }
  }
}
```

</details>

#### 6.12 Komplet PostDetailPage komponent

Når alle steps er gennemført, skulle din komponent se sådan ud:

```jsx
// 📁 pages/PostDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import PostCard from "../components/PostCard";

export default function PostDetailPage() {
  const [post, setPost] = useState({});
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getPost() {
      // UDSKIFT [dit-projekt-navn] med dit faktiske Firebase projekt navn!
      const url = `https://[dit-projekt-navn]-default-rtdb.firebaseio.com/posts/${params.id}.json`;
      const response = await fetch(url);
      const postData = await response.json();
      setPost({ id: params.id, ...postData });
    }
    getPost();
  }, [params.id]);

  function handleUpdate() {
    navigate(`/posts/${params.id}/update`);
  }

  async function handleDelete() {
    const confirmDelete = window.confirm("Er du sikker på du vil slette dette post?");

    if (confirmDelete) {
      // UDSKIFT [dit-projekt-navn] med dit faktiske Firebase projekt navn!
      const url = `https://[dit-projekt-navn]-default-rtdb.firebaseio.com/posts/${params.id}.json`;
      const response = await fetch(url, {
        method: "DELETE"
      });

      if (response.ok) {
        navigate("/");
      } else {
        console.error("Fejl ved sletning af post");
      }
    }
  }

  return (
    <section className="page" id="post-page">
      <div className="container">
        {post.id && <PostCard post={post} disableNavigation={true} />}

        <div className="btns">
          <button onClick={handleUpdate} className="btn-outline">
            Redigér
          </button>
          <button onClick={handleDelete} className="btn-outline btn-delete">
            Slet
          </button>
        </div>
      </div>
    </section>
  );
}
```

**Test din løsning:**

- Kan du navigere til detail sider?
- Vises post information korrekt?
- Virker Update navigation?
- Virker Delete funktionalitet?

💡 **useParams() forklaring:** Læser URL parametere. `/posts/abc123` giver `params.id = "abc123"`.

---

### 7. Opdatér posts

#### 7.1 Forstå update pattern

Før vi bygger update funktionalitet, lad os forstå hvad der skal ske:

**Update workflow:**

1. Navigér til `/posts/abc123/update`
2. Læs eksisterende post data fra Firebase
3. Pre-udfyld form med eksisterende værdier
4. Brugeren redigerer og submitter
5. Send PATCH request til Firebase
6. Navigér tilbage til post detail page

**HTTP metoder:**

- `POST` = Opret ny ressource (får auto-genereret ID)
- `PATCH` = Opdatér dele af eksisterende ressource
- `PUT` = Erstatte hele ressource
- `DELETE` = Slet ressource

💡 **Hvorfor PATCH?** Vi opdaterer kun caption og image, ikke hele post objektet.

#### 7.2 Setup routing for UpdatePage

Først skal vi definere routen for update siden.

**Opgave:** I din `App.jsx`, tilføj en route:

- Path: `/posts/:id/update`
- Element: `<UpdatePage />`
- Husk at importere komponenten

<details>
<summary>🔍 Se løsning</summary>

```jsx
// I App.jsx
import UpdatePage from "./pages/UpdatePage";

// I din routing:
<Route path="/posts/:id/update" element={<UpdatePage />} />;
```

</details>

#### 7.3 Test routing og navigation

Før vi bygger komponenten, lad os teste navigation.

**Test fra PostDetailPage:**

- Klik på "Redigér" knappen
- Bliver du navigeret til `/posts/[id]/update`?
- Får du fejl? (Forventet - komponenten findes ikke endnu)

#### 7.4 Opret grundlæggende UpdatePage struktur

**Opgave:** Opret `pages/UpdatePage.jsx` der:

- Importerer nødvendige hooks
- Bruger `useParams()` til at få post ID
- Logger post ID til console
- Returnerer simpel form struktur

<details>
<summary>🔍 Se løsning</summary>

```jsx
// 📁 pages/UpdatePage.jsx
import { useParams } from "react-router";

export default function UpdatePage() {
  const params = useParams();

  console.log("Update post ID:", params.id);

  return (
    <section className="page">
      <div className="container">
        <h1>Opdatér Post</h1>
        <p>Post ID: {params.id}</p>
        {/* Form kommer senere */}
      </div>
    </section>
  );
}
```

</details>

**Test:** Navigér til en update side. Ser du det rigtige post ID?

#### 7.5 Tilføj state for form data

Nu skal vi tilføje state til at håndtere form input.

**Tænk over:**

- Hvilke felter skal kunne redigeres? (caption, image)
- Hvad skal default værdier være? (tomme eller eksisterende data?)
- Hvornår skal vi loade eksisterende data?

**Opgave:** Tilføj state hooks:

- `useState` for caption
- `useState` for image
- `useState` for loading state (optional)

<details>
<summary>🔍 Se løsning</summary>

```jsx
import { useState } from "react";
import { useParams } from "react-router";

export default function UpdatePage() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();

  return (
    <section className="page">
      <div className="container">
        <h1>Opdatér Post</h1>
        {isLoading ? <p>Loading...</p> : <p>Post ID: {params.id}</p>}
      </div>
    </section>
  );
}
```

</details>

#### 7.6 Implementer data fetching

Nu skal vi hente den eksisterende post data og pre-udfylde formen.

**Fetch pattern for updates:**

1. Fetch eksisterende data når komponenten mounter
2. Sæt state med eksisterende værdier
3. Vis form med pre-udfyldt data

**Opgave:** Tilføj `useEffect` der:

- Fetcher post data baseret på `params.id`
- Sætter caption og image state
- Håndterer loading state

<details>
<summary>🔍 Se løsning</summary>

```jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function UpdatePage() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    async function getPost() {
      try {
        // UDSKIFT [dit-projekt-navn] med dit faktiske Firebase projekt navn!
        const url = `https://[dit-projekt-navn]-default-rtdb.firebaseio.com/posts/${params.id}.json`;
        const response = await fetch(url);
        const postData = await response.json();

        console.log("Loaded post data:", postData);

        // Pre-udfyld form felter
        setCaption(postData.caption || "");
        setImage(postData.image || "");
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading post:", error);
        setIsLoading(false);
      }
    }
    getPost();
  }, [params.id]);

  if (isLoading) {
    return (
      <section className="page">
        <div className="container">
          <h1>Loading...</h1>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="container">
        <h1>Opdatér Post</h1>
        <p>Caption: {caption}</p>
        <p>Image: {image}</p>
      </div>
    </section>
  );
}
```

</details>

**Test:** Navigér til update siden. Ser du eksisterende caption og image værdier?

</details>

#### 7.6 Implementer data fetching

Nu skal vi hente den eksisterende post data og pre-udfylde formen.

**Fetch pattern for updates:**

1. Fetch eksisterende data når komponenten mounter
2. Sæt state med eksisterende værdier
3. Vis form med pre-udfyldt data

**Opgave:** Tilføj `useEffect` der:

- Fetcher post data baseret på `params.id`
- Sætter caption og image state
- Håndterer loading state

<details>
<summary>🔍 Se løsning</summary>

```jsx
// 📁 pages/UpdatePage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

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

#### 7.7 Byg update form

Nu skal vi opbygge selve formen - meget lig CreatePage formen.

**Form requirements:**

- Caption input field (pre-filled)
- Image URL input field (pre-filled)
- Submit knap
- Cancel/tilbage navigation

**Opgave:** Tilføj form til JSX:

- Form med onSubmit handler
- Caption input connected til state
- Image input connected til state
- Submit og Cancel knapper

<details>
<summary>🔍 Se løsning</summary>

```jsx
return (
  <section className="page">
    <div className="container">
      <h1>Opdatér Post</h1>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label htmlFor="caption">Beskrivelse:</label>
        <input
          type="text"
          id="caption"
          value={caption}
          onChange={e => setCaption(e.target.value)}
          placeholder="Hvad sker der på billedet?"
          required
        />

        <label htmlFor="image">Billede URL:</label>
        <input
          type="url"
          id="image"
          value={image}
          onChange={e => setImage(e.target.value)}
          placeholder="https://example.com/image.jpg"
          required
        />

        <div className="btns">
          <button type="button" onClick={handleCancel} className="btn-outline">
            Annullér
          </button>
          <button type="submit">Gem ændringer</button>
        </div>
      </form>

      {/* Preview som i CreatePage */}
      {image && (
        <div className="image-preview">
          <img src={image} alt="Preview" />
        </div>
      )}
    </div>
  </section>
);
```

</details>

#### 7.8 Implementer form handlers

Nu skal vi implementere submit og cancel funktionalitet.

**Handler functions:**

- `handleSubmit` - opdatér post og navigér til detail
- `handleCancel` - navigér tilbage til detail uden at gemme

**Opgave:** Implementer handler functions:

- `handleSubmit` med preventDefault og console log først
- `handleCancel` der navigerer tilbage til post detail
- Tilføj `useNavigate` import

<details>
<summary>🔍 Se løsning</summary>

```jsx
import { useNavigate } from "react-router";

export default function UpdatePage() {
  // ... existing state
  const navigate = useNavigate();

  // ... existing useEffect

  async function handleSubmit(event) {
    event.preventDefault();

    console.log("Updating post:", { caption, image });
    // API call kommer i næste step
  }

  function handleCancel() {
    // Navigér tilbage til post detail page
    navigate(`/posts/${params.id}`);
  }

  // ... rest of component
}
```

</details>

**Test:** Submit formen og check console. Virker cancel knappen?

#### 7.9 Implementer PATCH request til Firebase

Nu skal vi sende update data til Firebase.

**PATCH vs POST forskellen:**

- POST til `/posts.json` = Opret ny post (får auto ID)
- PATCH til `/posts/abc123.json` = Opdatér eksisterende post

**Opgave:** Implementer PATCH logic i `handleSubmit`:

- Opret `postToUpdate` objekt med caption, image, uid
- Send PATCH request til Firebase
- Håndtér success/error responses
- Navigér til post detail ved success

<details>
<summary>🔍 Se løsning</summary>

```jsx
async function handleSubmit(event) {
  event.preventDefault();

  const postToUpdate = {
    caption: caption,
    image: image,
    uid: "fTs84KRoYw5pRZEWCq2Z" // Hardcoded indtil auth
    // Bemærk: vi opdaterer IKKE createdAt eller id
  };

  try {
    // UDSKIFT [dit-projekt-navn] med dit faktiske Firebase projekt navn!
    const url = `https://[dit-projekt-navn]-default-rtdb.firebaseio.com/posts/${params.id}.json`;
    const response = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify(postToUpdate),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (response.ok) {
      console.log("Post updated successfully");
      // Navigér tilbage til post detail page
      navigate(`/posts/${params.id}`);
    } else {
      console.error("Error updating post");
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}
```

</details>

#### 7.10 Tilføj form validation og UX forbedringer

Lad os forbedre brugeroplevelsen med validation og loading states.

**UX forbedringer:**

- Disable submit knap under loading
- Vis loading state under submit
- Validation af required felter
- Prevent double-submission

**Opgave:** Tilføj forbedringer:

- Loading state under submit
- Basic validation
- Disable knapper under loading

<details>
<summary>🔍 Se løsning</summary>

```jsx
export default function UpdatePage() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ... existing code

  async function handleSubmit(event) {
    event.preventDefault();

    // Basic validation
    if (!caption.trim() || !image.trim()) {
      alert("Udfyld venligst alle felter");
      return;
    }

    setIsSubmitting(true);

    const postToUpdate = {
      caption: caption.trim(),
      image: image.trim(),
      uid: "fTs84KRoYw5pRZEWCq2Z"
    };

    try {
      const url = `https://[dit-projekt-navn]-default-rtdb.firebaseio.com/posts/${params.id}.json`;
      const response = await fetch(url, {
        method: "PATCH",
        body: JSON.stringify(postToUpdate),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        navigate(`/posts/${params.id}`);
      } else {
        alert("Der opstod en fejl ved opdatering");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Netværksfejl - prøv igen");
    } finally {
      setIsSubmitting(false);
    }
  }

  // I JSX:
  <div className="btns">
    <button
      type="button"
      onClick={handleCancel}
      className="btn-outline"
      disabled={isSubmitting}
    >
      Annullér
    </button>
    <button
      type="submit"
      disabled={isSubmitting}
    >
      {isSubmitting ? "Gemmer..." : "Gem ændringer"}
    </button>
  </div>
```

</details>

#### 7.11 Komplet UpdatePage komponent

Når alle steps er gennemført, skulle din komponent se sådan ud:

```jsx
// � pages/UpdatePage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

export default function UpdatePage() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getPost() {
      try {
        // UDSKIFT [dit-projekt-navn] med dit faktiske Firebase projekt navn!
        const url = `https://[dit-projekt-navn]-default-rtdb.firebaseio.com/posts/${params.id}.json`;
        const response = await fetch(url);
        const postData = await response.json();

        setCaption(postData.caption || "");
        setImage(postData.image || "");
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading post:", error);
        setIsLoading(false);
      }
    }
    getPost();
  }, [params.id]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!caption.trim() || !image.trim()) {
      alert("Udfyld venligst alle felter");
      return;
    }

    setIsSubmitting(true);

    const postToUpdate = {
      caption: caption.trim(),
      image: image.trim(),
      uid: "fTs84KRoYw5pRZEWCq2Z"
    };

    try {
      // UDSKIFT [dit-projekt-navn] med dit faktiske Firebase projekt navn!
      const url = `https://[dit-projekt-navn]-default-rtdb.firebaseio.com/posts/${params.id}.json`;
      const response = await fetch(url, {
        method: "PATCH",
        body: JSON.stringify(postToUpdate),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        navigate(`/posts/${params.id}`);
      } else {
        alert("Der opstod en fejl ved opdatering");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Netværksfejl - prøv igen");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    navigate(`/posts/${params.id}`);
  }

  if (isLoading) {
    return (
      <section className="page">
        <div className="container">
          <h1>Loading...</h1>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="container">
        <h1>Opdatér Post</h1>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label htmlFor="caption">Beskrivelse:</label>
          <input
            type="text"
            id="caption"
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="Hvad sker der på billedet?"
            required
            disabled={isSubmitting}
          />

          <label htmlFor="image">Billede URL:</label>
          <input
            type="url"
            id="image"
            value={image}
            onChange={e => setImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
            required
            disabled={isSubmitting}
          />

          <div className="btns">
            <button type="button" onClick={handleCancel} className="btn-outline" disabled={isSubmitting}>
              Annullér
            </button>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Gemmer..." : "Gem ændringer"}
            </button>
          </div>
        </form>

        {image && (
          <div className="image-preview">
            <img
              src={image}
              alt="Preview"
              onError={e => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
```

**Test din løsning:**

- Kan du navigere til update siden?
- Bliver formen pre-udfyldt med eksisterende data?
- Virker form submission og navigation?
- Fungerer cancel funktionalitet?

💡 **PATCH forklaring:** Opdaterer kun de felter du sender, bevarer resten af objektet.

---

### 8. Slet posts

#### 8.1 Forstå delete funktionalitet

Delete operationen er allerede implementeret i PostDetailPage (sektion 6.11), men lad os forstå koncepterne bedre:

**Delete workflow:**

1. Bruger klikker "Slet" knap på detail siden
2. Vis bekræftelse dialog til brugeren
3. Hvis bekræftet: send DELETE request til Firebase
4. Ved success: navigér tilbage til liste siden
5. Håndtér fejl hvis delete fejler

**Sikkerhedsovervejelser:**

- Altid vis bekræftelse før sletning
- Giv brugeren mulighed for at fortryde
- Vis clear feedback ved success/fejl
- Overvej soft delete vs hard delete

💡 **Hvorfor bekræftelse?** Sletning kan ikke fortrydes - vi skal sikre at brugeren virkelig vil slette.

#### 8.2 Implementér delete i PostDetailPage

Denne funktionalitet er allerede implementeret i sektion 6.11, men lad os gennemgå den igen:

**Opgave:** Tjek din `PostDetailPage.jsx` og bekræft at `handleDelete` function:

- Viser bekræftelse dialog
- Sender DELETE request til korrekt Firebase URL
- Navigerer tilbage ved success
- Håndterer fejl korrekt

<details>
<summary>🔍 Se komplet handleDelete implementering</summary>

```jsx
async function handleDelete() {
  const confirmDelete = window.confirm("Er du sikker på du vil slette dette post?");

  if (confirmDelete) {
    try {
      // UDSKIFT [dit-projekt-navn] med dit faktiske Firebase projekt navn!
      const url = `https://[dit-projekt-navn]-default-rtdb.firebaseio.com/posts/${params.id}.json`;
      const response = await fetch(url, {
        method: "DELETE"
      });

      if (response.ok) {
        console.log("Post slettet succesfuldt");
        navigate("/");
      } else {
        console.error("Fejl ved sletning af post");
        alert("Der opstod en fejl ved sletning");
      }
    } catch (error) {
      console.error("Netværksfejl:", error);
      alert("Netværksfejl - prøv igen");
    }
  }
}
```

</details>

#### 8.3 Forbedre delete UX med loading state

Lad os forbedre brugeroplevelsen ved at tilføje loading state:

**UX forbedringer:**

- Vis loading state mens delete er i gang
- Disable knapper under loading
- Vis clear success/fejl beskeder
- Prevent double-click på delete knap

**Opgave:** Forbedre din `handleDelete` med loading state:

- Tilføj `isDeleting` state
- Disable knapper under loading
- Vis loading tekst på knap

<details>
<summary>🔍 Se forbedret implementering</summary>

```jsx
// I component state:
const [isDeleting, setIsDeleting] = useState(false);

async function handleDelete() {
  const confirmDelete = window.confirm("Er du sikker på du vil slette dette post?");

  if (confirmDelete) {
    setIsDeleting(true);

    try {
      const url = `https://[dit-projekt-navn]-default-rtdb.firebaseio.com/posts/${params.id}.json`;
      const response = await fetch(url, {
        method: "DELETE"
      });

      if (response.ok) {
        // Success - navigate away
        navigate("/");
      } else {
        alert("Der opstod en fejl ved sletning");
      }
    } catch (error) {
      console.error("Netværksfejl:", error);
      alert("Netværksfejl - prøv igen");
    } finally {
      setIsDeleting(false);
    }
  }
}

// I JSX:
<button onClick={handleDelete} className="btn-outline btn-delete" disabled={isDeleting}>
  {isDeleting ? "Sletter..." : "Slet"}
</button>;
```

</details>

#### 8.4 Alternativ: Custom bekræftelse dialog

I stedet for `window.confirm()` kan vi lave en bedre bekræftelse dialog:

**Fordele ved custom dialog:**

- Bedre design kontrol
- Kan matche app's styling
- Mere fleksibel tekst og knapper
- Bedre accessibility

**Opgave:** Overvej at implementere en `ConfirmDialog` komponent:

- Modal overlay
- Flot styling
- Bekræft/Annuller knapper
- Escape key support

<details>
<summary>🔍 Se ConfirmDialog eksempel</summary>

```jsx
// 📁 components/ConfirmDialog.jsx
export default function ConfirmDialog({ isOpen, onConfirm, onCancel, message }) {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <h3>Bekræft handling</h3>
        <p>{message}</p>
        <div className="dialog-buttons">
          <button onClick={onCancel} className="btn-outline">
            Annuller
          </button>
          <button onClick={onConfirm} className="btn-delete">
            Slet
          </button>
        </div>
      </div>
    </div>
  );
}

// I PostDetailPage:
const [showDeleteDialog, setShowDeleteDialog] = useState(false);

function handleDeleteClick() {
  setShowDeleteDialog(true);
}

function confirmDelete() {
  setShowDeleteDialog(false);
  // Fortsæt med delete logic...
}
```

</details>

#### 8.5 Test delete funktionalitet

**Test scenarie:**

1. Navigér til en post detail side
2. Klik "Slet" knappen
3. Test både "OK" og "Annuller" i dialog
4. Bekræft at post forsvinder fra liste
5. Test fejlhåndtering (prøv med ugyldig URL)

**Troubleshooting:**

- Virker bekræftelse dialogen?
- Bliver post slettet fra Firebase?
- Bliver du navigeret tilbage?
- Forsvinder post fra listen?

#### 8.6 Batch delete (Avanceret)

For avancerede brugere kan I implementere bulk delete:

**Koncept:**

- Vælg multiple posts på listen
- Slet flere posts på én gang
- Progress indicator for batch operationer

**Implementering overvejelser:**

- Checkboxes på hver post
- "Slet valgte" knap
- Bulk API calls eller parallel single deletes
- Rollback hvis nogle fejler

<details>
<summary>🔍 Se batch delete eksempel</summary>

```jsx
// I HomePage:
const [selectedPosts, setSelectedPosts] = useState(new Set());

async function handleBatchDelete() {
  const confirmDelete = window.confirm(`Er du sikker på du vil slette ${selectedPosts.size} posts?`);

  if (confirmDelete) {
    const deletePromises = Array.from(selectedPosts).map(postId =>
      fetch(`https://[dit-projekt]-default-rtdb.firebaseio.com/posts/${postId}.json`, {
        method: "DELETE"
      })
    );

    try {
      await Promise.all(deletePromises);
      // Refresh posts list
      getPosts();
      setSelectedPosts(new Set());
    } catch (error) {
      console.error("Batch delete failed:", error);
    }
  }
}
```

</details>

#### 8.7 Delete permissions (Fremtidigt)

Når I tilføjer authentication senere, overvej:

**Sikkerhedsregler:**

- Kun post author kan slette eget post
- Admin kan slette alle posts
- Log delete aktiviteter

**Implementation hints:**

```javascript
// Check if current user owns the post
if (post.uid !== currentUser.uid && !currentUser.isAdmin) {
  alert("Du kan kun slette dine egne posts");
  return;
}
```

**Test din delete funktionalitet:**

- Virker bekræftelse dialogen korrekt?
- Bliver posts slettet fra Firebase?
- Fungerer navigation tilbage til listen?
- Er der passende fejlhåndtering?

💡 **DELETE method:** HTTP DELETE metoden fjerner ressourcen permanent fra serveren.

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
import { useNavigate } from "react-router";

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
import { useParams, useNavigate } from "react-router";
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
