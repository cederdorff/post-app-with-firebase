import { NavLink } from "react-router-dom";

export default function Nav() {
  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/create">Create Post</NavLink>
      <NavLink to="/profile">Profile</NavLink>
    </nav>
  );
}
