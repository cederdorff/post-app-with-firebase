# Post App - Undersøgelsesspørgsmål med Authentication

## Introduktion

I har fået udleveret en færdig løsning af Post App med Firebase Authentication. Jeres opgave er at undersøge koden, forstå hvordan den virker, og kunne forklare de forskellige dele. 

---

## Del 1: READ - Hente og vise data

### 1.1 Posts fra Firebase

- **Opgave:** Åbn `HomePage.jsx` og find funktionen der henter posts fra Firebase.
  - Hvad er URL'en til Firebase?
  - Hvilken HTTP metode bruges?
  - Hvad returnerer Firebase når vi henter posts?

### 1.2 Data transformation

**Se på følgende kode i `HomePage.jsx`:**

```jsx
const postsArray = Object.keys(data).map(postId => ({
  id: postId,
  ...data[postId]
}));
```

**Spørgsmål:**

- Hvad returnerer Firebase - et objekt eller et array?
- Hvorfor skal vi konvertere data til et array?
- Hvad gør `Object.keys(data)`?
- Hvad betyder `...data[postId]` (spread operator)?
- Hvorfor tilføjer vi `id: postId` til hvert post?

### 1.3 Filtrering af posts

**Se på følgende kode:**

```jsx
const filteredPosts = posts.filter(post => post.caption.toLowerCase().includes(searchQuery));
```

**Spørgsmål:**

- Hvad gør `.filter()` funktionen?
- Hvorfor bruger vi `.toLowerCase()`?
- Hvad er `searchQuery` og hvor kommer den fra?
- Hvad returnerer denne linje kode?

### 1.4 Brugerinformation på posts

**Opgave:** Undersøg hvordan brugerens navn og billede vises på hver post.

**Spørgsmål:**

- Hvilken komponent viser brugerinformationen?
- Hvor er brugerinformationen gemt i Firebase? (på post-objektet eller separat?)
- Hvordan henter vi brugerinformation baseret på post's `uid`?
- Find komponenten `UserAvatar.jsx` - hvad gør den?
- Hvorfor er det smart at gemme brugerinformation separat fra posts?

---

## Del 2: CREATE - Opret nye posts

### 2.1 Oprettelse af posts

**Opgave:** Åbn `CreatePage.jsx` og undersøg hvordan nye posts oprettes.

**Spørgsmål:**

- Hvilken komponent håndterer form input? (hint: se `PostForm`)
- Hvilken HTTP metode bruges til at oprette posts?
- Hvad sendes til Firebase når vi opretter et post?
- Hvad sker der efter et post er oprettet succesfuldt?

### 2.2 Post data struktur

**Se på følgende kode i `createPost` funktionen:**

```jsx
post.uid = auth.currentUser.uid;
post.createdAt = Date.now();
```

**Spørgsmål:**

- Hvad er `auth.currentUser.uid`?
- Hvorfor gemmer vi uid på post objektet?
- Hvad returnerer `Date.now()`?
- Hvorfor gemmer vi `createdAt` på posten?
- Hvad kunne vi bruge `createdAt` til senere?

### 2.3 PostForm komponenten

**Opgave:** Åbn `components/PostForm.jsx`

**Spørgsmål:**

- Er det en "controlled" eller "uncontrolled" form?
- Hvilke props modtager PostForm?
- Hvordan håndteres form submission?
- Hvordan genbruges PostForm på både CreatePage og UpdatePage?

---

## Del 3: UPDATE - Opdatér eksisterende posts

### 3.1 Update flow

**Opgave:** Åbn `UpdatePage.jsx` og undersøg update processen.

**Spørgsmål:**

- Hvordan kommer vi til UpdatePage? (hvilken URL/route?)
- Hvordan ved UpdatePage hvilket post der skal opdateres?
- Hvordan hentes den eksisterende post data?
- Hvordan bliver form felterne pre-udfyldt med eksisterende data?

### 3.2 useParams hook

**Se på følgende kode:**

```jsx
const params = useParams();
```

**Spørgsmål:**

- Hvad returnerer `useParams()`?
- Hvad er `params.id`?
- Hvor kommer dette id fra? (hint: se URL'en)
- Hvorfor har vi brug for id'et?

### 3.3 PATCH metode

**Opgave:** Find den funktion der sender opdateringen til Firebase.

**Spørgsmål:**

- Hvilken HTTP metode bruges til at opdatere? (POST, PUT, PATCH eller DELETE?)
- Hvad er forskellen på PATCH og PUT?
- Hvorfor bruger vi netop PATCH i dette projekt?
- Hvad sendes til Firebase når vi opdaterer et post?
- Bliver alle felter opdateret eller kun nogle?

---

## Del 4: DELETE - Slet posts

### 4.1 Delete funktionalitet

**Opgave:** Find hvor delete funktionaliteten er implementeret.

**Spørgsmål:**

- På hvilken side/komponent findes delete knappen?
- Hvad sker der når man klikker "Delete"?
- Hvorfor viser vi en bekræftelsesdialog?
- Hvilken HTTP metode bruges til at slette?

### 4.2 Delete implementering

**Opgave:** Find `handleDelete` funktionen.

**Spørgsmål:**

- Hvilken Firebase URL kaldes når vi sletter?
- Hvad returnerer Firebase efter en succesfuld sletning?
- Hvad sker der efter posten er slettet? (navigation?)
- Hvordan håndteres fejl hvis sletningen fejler?

---

## Del 5: Authentication - Sign up, Sign in og Auth state

### 5.1 App struktur med authentication

**Opgave:** Åbn `App.jsx` og undersøg strukturen.

**Spørgsmål:**

- Hvad er `isAuth` state?
- Hvad gør `onAuthStateChanged` funktionen?
- Hvornår kaldes `onAuthStateChanged`?
- Hvorfor gemmer vi isAuth i localStorage?
- Hvad er forskellen på `privateRoutes` og `publicRoutes`?
- Hvilke routes er private og hvilke er public?
- Hvad sker der hvis en ikke-logget-ind bruger prøver at gå til "/"?

### 5.2 Sign Up - Opret ny bruger

**Opgave:** Åbn `SignUpPage.jsx`

**Spørgsmål:**

- Hvilken Firebase funktion bruges til at oprette en ny bruger?
- Hvilke informationer skal brugeren indtaste?
- Hvad gemmes i Firebase Authentication?
- Hvad gemmes i Firebase Realtime Database?
- Hvorfor gemmer vi brugerinformation to steder?
- Hvad er `uid` og hvordan bruges det?

### 5.3 Sign In - Log ind

**Opgave:** Åbn `SignInPage.jsx`

**Spørgsmål:**

- Hvilken Firebase funktion bruges til at logge ind?
- Hvad skal brugeren indtaste for at logge ind?
- Hvad returnerer Firebase efter succesfuldt login?
- Hvor gemmes information om den loggede ind bruger?
- Hvad sker der efter succesfuldt login?

### 5.4 Forbindelse mellem user og posts

**Opgave:** Undersøg hvordan posts knyttes til brugere.

**Spørgsmål:**

- Hvordan sikrer vi at nye posts knyttes til den loggede ind bruger?
- Hvad er `auth.currentUser.uid`?
- Hvorfor gemmer vi `uid` på hver post?
- Find et post i Firebase - kan du se hvilken bruger der har oprettet det?

---

## Del 6: Authorization - Kun egne posts

### 6.1 Edit/Delete permissions

**Opgave:** Åbn `PostDetailPage.jsx` og find hvor edit/delete knapperne vises.

**Spørgsmål:**

- Under hvilken betingelse vises edit og delete knapperne?
- Hvad betyder `auth.currentUser?.uid === post.uid`?
- Hvorfor er det vigtigt at tjekke dette?
- Hvad ville der ske hvis vi ikke havde denne check?
- Kan du slette andre brugeres posts?

### 6.2 Brugerens egne posts på profil

**Opgave:** Åbn `ProfilePage.jsx` og `components/UserPosts.jsx`

**Spørgsmål:**

- Hvordan henter vi kun den loggede ind brugers posts?
- Se på Firebase URL'en i `UserPosts` - hvad betyder `?orderBy="uid"&equalTo="${uid}"`?
- Hvad er query parameters og hvordan fungerer de?
- Hvad skulle der til i Firebase Rules for at denne query virker? (hint: indexing)
- Hvorfor viser vi kun brugerens egne posts på profilen?

---

## Del 7: Profile Page og User Management

### 7.1 Profil funktionalitet

**Opgave:** Åbn `ProfilePage.jsx`

**Spørgsmål:**

- Hvilke brugerinformationer kan redigeres på profilen?
- Hvordan gemmes ændringer til brugerprofilen?
- Hvordan logger man ud?
- Hvad sker der når man logger ud? (hint: se `signOut` funktionen)

### 7.2 Sign Out

**Spørgsmål:**

- Find hvor "Sign Out" knappen er
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

