# Post App - Undersøgelsesspørgsmål med Authentication

## Introduktion

I har fået udleveret en færdig løsning af Post App med Firebase Authentication. Jeres opgave er at undersøge koden, forstå hvordan den virker, og kunne forklare de forskellige dele.

---

## Del 1: READ - Hente og vise data

### Data transformation fra Firebase

**Åbn `HomePage.jsx` og se på følgende kode:**

```jsx
const postsArray = Object.keys(data).map(postId => ({
  id: postId,
  ...data[postId]
}));
```

**Spørgsmål:**

- Hvad returnerer Firebase - et objekt eller et array?
- Hvad gør `Object.keys(data)` og hvorfor har vi brug for det?
- Hvad betyder `...data[postId]` (spread operator)?
- Hvorfor tilføjer vi `id: postId` til hvert post?

### Filtrering og søgning

**Se på følgende kode i `HomePage.jsx`:**

```jsx
const filteredPosts = posts.filter(post => post.caption.toLowerCase().includes(searchQuery));
```

**Spørgsmål:**

- Forklar hvordan filtrering fungerer
- Hvorfor bruger vi `.toLowerCase()`?

### Brugerinformation på posts

**Opgave:** Find komponenten `UserAvatar.jsx`

**Spørgsmål:**

- Hvor er brugerinformation gemt i Firebase - på post-objektet eller separat?
- Hvordan henter vi brugerinformation baseret på post's `uid`?
- Hvorfor er det smart at gemme brugerinformation separat fra posts?

---

## Del 2: CREATE - Opret nye posts

### Post data struktur

**Åbn `CreatePage.jsx` og se på følgende kode:**

```jsx
post.uid = auth.currentUser.uid;
post.createdAt = Date.now();
```

**Spørgsmål:**

- Hvad er `auth.currentUser.uid` og hvorfor gemmer vi det på posten?
- Hvad returnerer `Date.now()` og hvad kunne vi bruge det til?
- Hvilken HTTP metode bruges til at oprette posts i Firebase?

### Component reuse - PostForm

**Opgave:** Åbn `components/PostForm.jsx`

**Spørgsmål:**

- Hvordan genbruges PostForm på både CreatePage og UpdatePage?
- Hvilke props modtager PostForm?

---

## Del 3: UPDATE - Opdatér eksisterende posts

### useParams hook

**Åbn `UpdatePage.jsx` og se på følgende kode:**

```jsx
const params = useParams();
```

**Spørgsmål:**

- Hvad returnerer `useParams()` og hvad er `params.id`?
- Hvor kommer id'et fra? (hint: se URL'en)
- Hvordan hentes den eksisterende post data?

### HTTP metode

**Find funktionen der sender opdateringen til Firebase**

**Spørgsmål:**

- Hvilken HTTP metode bruges - POST, PUT, PATCH eller DELETE?
- Hvad er forskellen på PATCH og PUT?
- Hvorfor bruger vi PATCH i dette projekt?

---

## Del 4: DELETE - Slet posts

### Delete funktionalitet

**Åbn `PostDetailPage.jsx` og find `handleDelete` funktionen**

**Spørgsmål:**

- Hvorfor viser vi en bekræftelsesdialog før sletning?
- Hvilken HTTP metode bruges til at slette?
- Hvad sker der efter posten er slettet? (navigation?)

---

## Del 5: Authentication - Sign up, Sign in og Auth state

### App struktur med authentication

**Åbn `App.jsx` og se på denne kode:**

```jsx
onAuthStateChanged(auth, user => {
  if (user) {
    setIsAuth(true);
    localStorage.setItem("isAuth", true);
  } else {
    setIsAuth(false);
    localStorage.removeItem("isAuth");
  }
});
```

**Spørgsmål:**

- Hvad gør `onAuthStateChanged` og hvornår kaldes den?
- Hvorfor gemmer vi isAuth i localStorage?
- Hvad er forskellen på `privateRoutes` og `publicRoutes`?
- Hvad sker der hvis en ikke-logget-ind bruger prøver at gå til "/"?

### Sign Up og Sign In

**Åbn `SignUpPage.jsx` og `SignInPage.jsx`**

**Spørgsmål:**

- Hvilken Firebase funktion bruges til at oprette en ny bruger?
- Hvilken Firebase funktion bruges til at logge ind?
- Hvorfor gemmer vi brugerinformation to steder (Authentication + Database)?
- Hvad er `uid` og hvordan bruges det til at forbinde user og posts?

---

## Del 6: Authorization - Kun egne posts

### Edit/Delete permissions

**Åbn `PostDetailPage.jsx` og find hvor edit/delete knapperne vises:**

```jsx
{
  auth.currentUser?.uid === post.uid && (
    <div className="btns">
      <button onClick={handleDelete}>Delete</button>
      <button onClick={navigateToUpdate}>Update</button>
    </div>
  );
}
```

**Spørgsmål:**

- Hvad betyder `auth.currentUser?.uid === post.uid`?
- Hvorfor er det vigtigt at tjekke dette?
- Kan du slette andre brugeres posts?

### Brugerens egne posts på profil

**Åbn `components/UserPosts.jsx` og se på URL'en:**

```jsx
const url = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/posts.json?orderBy="uid"&equalTo="${uid}"`;
```

**Spørgsmål:**

- Hvad betyder `?orderBy="uid"&equalTo="${uid}"`?
- Hvordan henter vi kun den loggede ind brugers posts?

---

## Del 7: Profile og Sign Out

### Sign Out funktionalitet

**Åbn `ProfilePage.jsx` og find Sign Out knappen**

**Spørgsmål:**

- Hvad gør `signOut(auth)` funktionen?
- Hvad sker der med `isAuth` state når man logger ud?
- Hvor navigerer brugeren hen efter logout?

---

## Del 8: Bonus udfordringer

### 8.1 Refleksionsspørgsmål

1. **Sikkerhed:** Er denne app 100% sikker? Hvad mangler der for at gøre den mere sikker? (hint: Firebase Security Rules)
2. **User Experience:** Hvilke forbedringer kunne gøre appen bedre at bruge?
3. **Data struktur:** Hvordan er data struktureret i Firebase? Tegn evt. et diagram.
4. **Fejlhåndtering:** Hvor håndteres fejl i appen? Er det godt nok?
5. **Loading states:** Hvordan viser vi at data er ved at blive hentet?

### 8.2 Kode-udfordringer (valgfri)

Hvis I vil udfordre jer selv, prøv at:

1. Tilføj en "Like" funktion til posts
2. Tilføj mulighed for at kommentere på posts
3. Tilføj en "Forgot password" funktion
4. Vis antallet af posts hver bruger har lavet
5. Tilføj sortering af posts (nyeste først, ældste først, alfabetisk)

---
