import { useEffect, useState } from "react";

export default function UserAvatar({ uid }) {
  const [user, setUser] = useState({}); // create a state to store the user data

  useEffect(() => {
    getUser(); // call the getUser function

    async function getUser() {
      const response = await fetch(
        `https://react-user-crud-app-default-rtdb.firebaseio.com/users/${uid}.json`
      );
      const data = await response.json();
      setUser(data); // set the user state with the data from firebase
    }
  }, [uid]); // <--- "[id]" VERY IMPORTANT!!!
  return (
    <div className="avatar">
      <img src={user?.image} alt={user?.id} />
      <span>
        <h3>{user?.name}</h3>
        <p>{user?.title}</p>
      </span>
    </div>
  );
}
