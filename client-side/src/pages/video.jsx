// VideoChat.js (Video Call Component)
import React, { useRef, useEffect } from "react";
import simplePeer from "simple-peer";

const VideoChat = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peer = new simplePeer({ initiator: true, trickle: false });

  useEffect(() => {
    // Get user media (camera and microphone) and display it locally
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;

        // Add the local stream to the peer connection
        peer.addStream(stream);
      });

    // Handle incoming data from the remote peer
    peer.on("data", (data) => {
      // Handle data from the remote peer
    });

    // Handle incoming stream from the remote peer and display it
    peer.on("stream", (stream) => {
      remoteVideoRef.current.srcObject = stream;
    });
  }, []);

  return (
    <div>
      <video ref={localVideoRef} autoPlay muted />
      <video ref={remoteVideoRef} autoPlay />
    </div>
  );
};

export default VideoChat;
