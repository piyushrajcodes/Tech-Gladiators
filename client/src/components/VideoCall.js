import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import { getDatabase, ref, set, onValue } from "firebase/database";

const VideoCall = () => {
  const [stream, setStream] = useState();
  const [call, ] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [receivingCall, setReceivingCall] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  const db = getDatabase();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setStream(stream);
      myVideo.current.srcObject = stream;
    });

    const callRef = ref(db, 'calls/some-call-id');
    onValue(callRef, (snapshot) => {
      if (snapshot.exists()) {
        setReceivingCall(true);
        setCaller(snapshot.val().from);
        setCallerSignal(snapshot.val().signal);
      }
    });
  }, [db]);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      const callRef = ref(db, 'calls/' + id);
      set(callRef, { from: 'my-id', signal: data });
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      const callRef = ref(db, 'calls/' + caller);
      set(callRef, { ...call, signal: data });
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  return (
    <div className="min-h-screen bg-dark-blue-bg p-4">
        <div>
            <div className="video-container">
                <div className="video">
                {stream && <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />}
                </div>
                <div className="video">
                {callAccepted && <video playsInline ref={userVideo} autoPlay style={{ width: "300px" }} />}
                </div>
            </div>
            <div>
                {receivingCall && !callAccepted ? (
                <div>
                    <h1>{caller} is calling...</h1>
                    <button onClick={answerCall}>Answer</button>
                </div>
                ) : null}
            </div>
            <button onClick={() => callUser('some-other-id')}>Call</button>
        </div>
    </div>
  );
};

export default VideoCall;