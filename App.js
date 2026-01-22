import { useState } from "react";
import Login from "./Login";
import Chat from "./Chat";

export default function App() {
  const [user, setUser] = useState(null);
  return user ? <Chat user={user} /> : <Login setUser={setUser} />;
}


/*

<button
  onClick={() => {
    localStorage.clear();
    window.location.reload();
  }}
>
  Logout
</button>
*/
