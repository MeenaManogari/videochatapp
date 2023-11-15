import React from "react";
import { useContext } from "react";
import { SocketContext } from "../socketContext";
import calling from "../assets/call-answer.svg";
import "./components.css";

const Notifications = () => {
  const { answerCall, call, callAccepted } = useContext(SocketContext);
  // if (!call) return <></>;

  return (
    <>
      {call.isReceivedCall && !callAccepted && (
        <div className="call_receiver">
          <h4>{call.name} is calling...</h4>
          <button onClick={answerCall}>
            <img src={calling} alt="answer" />
          </button>
        </div>
      )}
    </>
  );
};

export default Notifications;
