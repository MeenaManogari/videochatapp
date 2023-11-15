import React, { useState } from "react";
import Chat from "./chat";
import VideoChat from "./video";

function Vchat() {
  const [showChat, setShowChat] = useState(true);

  return (
    <div className="app">
      <div className="header">
        <button onClick={() => setShowChat(!showChat)}>
          Toggle Chat/Video
        </button>
      </div>
      <div className="main-container">
        {showChat ? <Chat /> : <VideoChat />}
      </div>
    </div>
  );
}

export default Vchat;
