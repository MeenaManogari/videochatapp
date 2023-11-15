import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [user, setUser] = useState("");
  const [room, setRoom] = useState("");

  return (
    <div className="login_main">
      <h3>Login</h3>
      <form>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUser(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Room Id"
          onChange={(e) => setRoom(e.target.value)}
          required
        />
        <Link
          onClick={(e) => (!user || !room ? e.preventDefault() : null)}
          to={`/chat?name=${user}&room=${room}`}
        >
          <input type="button" value="Login" />
        </Link>
      </form>
    </div>
  );
};

export default Login;
