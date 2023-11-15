import React, { useContext } from "react";
import { SocketContext } from "../socketContext";
import "./chat.css";
import Notifications from "./Notifications";
import Options from "./Options";

const Chat = () => {
  const {
    name,
    call,
    callAccepted,
    callEnded,
    user,
    activeUsers,
    msg,
    setMsg,
    sendMessage,
    messages,
    myVideo,
    userVideo,
    stream,
  } = useContext(SocketContext);

  //const [inputMessage, setInputMessage] = useState("");

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chat_room">
      <div className="active_users">
        <p>Active Users</p>
        <ul>
          {activeUsers.map((each, idx) => (
            <li key={idx}>{each.name}</li>
          ))}
        </ul>
      </div>
      <div className="chats">
        <div className="chat_area">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message-container ${
                message.user !== user ? "sent-right" : "receive-left"
              }`}
            >
              <div className="msg_receive">
                <p>{message.text}</p>
                <h6>{message.user}</h6>
              </div>
            </div>
          ))}
        </div>
        <div className="send_msg">
          <input
            type="text"
            onKeyPress={handleKeyPress}
            name="text_input"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
        </div>
      </div>
      <div className="video_container">
        <div className="vchat-room">
          {stream && (
            <div className="our_video">
              <div>{name || "Name"}</div>
              <video ref={myVideo} muted autoPlay playsInline />
            </div>
          )}
          {callAccepted && !callEnded && (
            <div className="our_video">
              <div>{call.name || "Name"}</div>
              <video ref={userVideo} autoPlay playsInline />
            </div>
          )}
        </div>
        <Options>
          <Notifications />
        </Options>
      </div>
    </div>
  );
};

export default Chat;
