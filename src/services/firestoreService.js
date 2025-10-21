import { db, storage } from "../firebase-config";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Posts collection reference
const postsCol = collection(db, "posts");

export async function createPost(postData, imageFile) {
  try {
    let imageUrl = null;
    if (imageFile) {
      const storageRef = ref(storage, `posts/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }

    const docRef = await addDoc(postsCol, {
      ...postData,
      createdAt: serverTimestamp(),
      // store image under `image` field for compatibility with existing code
      image: imageUrl
    });

    return { id: docRef.id };
  } catch (err) {
    console.error("createPost error", err);
    throw err;
  }
}

export async function getAllPosts() {
  const q = query(postsCol, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export function subscribeToPosts(onUpdate) {
  const q = query(postsCol, orderBy("createdAt", "desc"));
  return onSnapshot(q, snapshot => {
    const posts = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    onUpdate(posts);
  });
}

export async function getPostById(id) {
  const d = await getDoc(doc(db, "posts", id));
  if (!d.exists()) throw new Error("Post not found");
  return { id: d.id, ...d.data() };
}

export async function updatePost(id, updates, newImageFile) {
  try {
    const postRef = doc(db, "posts", id);
    if (newImageFile) {
      // upload new image
      const storageRef = ref(storage, `posts/${Date.now()}_${newImageFile.name}`);
      await uploadBytes(storageRef, newImageFile);
      const imageUrl = await getDownloadURL(storageRef);
      // store under `image` key
      updates.image = imageUrl;
    }
    await updateDoc(postRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    console.error("updatePost error", err);
    throw err;
  }
}

export async function deletePost(id) {
  try {
    await deleteDoc(doc(db, "posts", id));
  } catch (err) {
    console.error("deletePost error", err);
    throw err;
  }
}

export async function getUserPosts(uid) {
  const q = query(postsCol, where("uid", "==", uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function uploadImage(file) {
  const storageRef = ref(storage, `posts/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}
