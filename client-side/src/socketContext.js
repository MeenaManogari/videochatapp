import { createContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext();

let socket;
const ContextProvider = ({ children }) => {
  const backEndUrl = "http://localhost:8080";
  const [user, setUser] = useState("");
  const [room, setRoom] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [stream, setStream] = useState();
  const [me, setMe] = useState("");
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [isAudioMuted, setAudioMuted] = useState(false);
  const [isVideoMuted, setVideoMuted] = useState(false);
  const [isScreenSharing, setScreenSharing] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const screenPeer = useRef();

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const name = params.get("name");
    const room = params.get("room");

    console.log(name, room);

    setUser();
    setRoom();

    socket = io(backEndUrl);

    socket.emit("join", { name: name, room: room }, (error) => {
      if (error) {
        alert(error);
      }
    });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      });

    socket.on("me", (userId) => {
      setMe(userId);
      console.log("My socketID:", userId);
    });

    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivedCall: true, from, name: callerName, signal });
    });

    socket.on("message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on("activeUsers", (users) => {
      setActiveUsers(users);
    });
  }, []);

  const sendMessage = () => {
    socket.emit("sendMsg", msg, () => {
      setMsg("");
    });
  };

  const startScreenShare = () => {
    navigator.mediaDevices
      // Request screen sharing
      .getDisplayMedia({ video: { cursor: "always" }, audio: true })
      .then((screenStream) => {
        myVideo.current.srcObject = screenStream;
        screenPeer.current = new Peer({
          initiator: true,
          trickle: false,
          stream: screenStream,
        });

        screenPeer.current.on("signal", (data) => {
          socket.emit("join", { id: me, name: user, room: room }, data);
        });

        socket.on("connected", (id) => {
          const call = screenPeer.current.call(id, screenStream);
          call.on("stream", (userScreenStream) => {
            userVideo.current.srcObject = userScreenStream;
          });
        });

        setScreenSharing(true);
      })
      .catch((error) => {
        console.error("Error starting screen share:", error);
      });
  };

  const stopScreenShare = () => {
    myVideo.current.srcObject = stream;
    if (screenPeer.current) {
      screenPeer.current.destroy();
    }

    setScreenSharing(false);
  };

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: user,
      });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    //newly added if condition
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }

    window.location.reload();
  };

  // Function to toggle audio mute
  const toggleAudioMute = () => {
    stream.getAudioTracks().forEach((track) => {
      track.enabled = !isAudioMuted;
    });
    setAudioMuted(!isAudioMuted);
  };

  // Function to toggle video mute
  const toggleVideoMute = () => {
    stream.getVideoTracks().forEach((track) => {
      track.enabled = !isVideoMuted;
    });
    setVideoMuted(!isVideoMuted);
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        callEnded,
        callUser,
        user,
        setUser,
        room,
        activeUsers,
        msg,
        setMsg,
        setMessages,
        messages,
        myVideo,
        userVideo,
        stream,
        sendMessage,
        answerCall,
        toggleAudioMute,
        toggleVideoMute,
        leaveCall,
        isAudioMuted,
        isVideoMuted,
        startScreenShare,
        stopScreenShare,
        isScreenSharing,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
export { ContextProvider, SocketContext };
