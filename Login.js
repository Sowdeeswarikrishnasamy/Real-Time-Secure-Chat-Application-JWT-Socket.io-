import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      { username, password }
    );

    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);

  } catch (err) {
    alert(err.response?.data?.msg || "Login failed");
  }
};

  return (
    <>
      <input onChange={e=>setUsername(e.target.value)} placeholder="username"/>
      <input type="password" onChange={e=>setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
    </>
  );
}
