import { useEffect, useState } from "react";

export default function UserAvatar({ uid }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    async function getUser() {
      const response = await fetch(
        `${import.meta.env.VITE_FB_URL}/users/${uid}.json`
      );
      const data = await response.json();
      if (data) {
        setUser(data); // set the user state with the data from firebase
      }
    }
    getUser(); // call the getUser function
  }, [uid]); // <--- "[id]" VERY IMPORTANT!!!

  return (
    <div className="avatar">
      <img
        src={user?.image || "https://placehold.co/50x50.webp"}
        alt={user?.name}
      />
      <span>
        <h3>{user?.name}</h3>
        <p>{user?.title}</p>
      </span>
    </div>
  );
}
