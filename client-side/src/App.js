import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Chat from "./pages/chat";
import Login from "./pages/login";
// import Vchat from "./pages/vchat";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route path="/vchat" element={<Vchat />} /> */}
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
