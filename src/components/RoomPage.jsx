import "../styles/RoomPage.css";
import logo from "../images/logo2.png";
import micoff from '../images/micoff.png'
import micoon from "../images/micon.png";
import cameraoff from '../images/cameraoff.png'
import cameraon from "../images/cameraon.png";
import screenshare from "../images/screenshare.png";
import exit from "../images/exit.png";
import { UseSocket } from "../context/SocketProvider";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";


let pc = new RTCPeerConnection({
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
});

export default function RoomPage() {

  const navigate = useNavigate();
  const roomsocket = UseSocket();
  const [participants, setParticipants] = useState([]);
  const [messageinput, setmessageinput] = useState('');
  const messageContainer = useRef();
  const [mystream, setmystream] = useState(null);
  const [remoteVideoStream, setRemoteVideoStream] = useState(null);
  const [handlingcamera, sethandlingcamera] = useState(true);
  const [handlingaudio, sethandlingaudio] = useState(true);
  const [isFullScreen1, setIsFullScreen1] = useState(false);
  const [isFullScreen2, setIsFullScreen2] = useState(false);



  const handleExit = () => {
    roomsocket.emit('disconnected');
    navigate('/')
  }

  const handleaudio = () => {
    sethandlingaudio((prevState) => !prevState);
    const audioTracks = mystream.getAudioTracks();
    if (audioTracks.length > 0) {
      audioTracks[0].enabled = !audioTracks[0].enabled;
    }
  }

  const handlecamera = () => {
    sethandlingcamera((prevState) => !prevState);
    const videoTracks = mystream.getVideoTracks();
    if (videoTracks.length > 0) {
      videoTracks[0].enabled = !videoTracks[0].enabled;
    }
  }

  const handleScreenShare = async () => {
    navigator.mediaDevices.getDisplayMedia({ cursor: true }).then(screenStream => {
      const screenTrack = screenStream.getTracks()[0];

      // Replace the user's camera track with the screen-sharing track in your peer connection
      const videoSenders = pc.getSenders().filter(sender => sender.track && sender.track.kind === 'video');
      if (videoSenders.length > 0) {
        videoSenders[0].replaceTrack(screenTrack);
      }

      // Handle the screen-sharing track ending event
      screenTrack.onended = function () {
        // Replace the screen-sharing track with the user's camera track in your peer connection
        if (videoSenders.length > 0) {
          videoSenders[0].replaceTrack(mystream.getVideoTracks()[0]);
        }
      };
    });
  }
  const handleSendMessage = () => {
    const message = messageinput;
    appendMessage(`you: ${message}`, 'right');
    console.log(message);
    roomsocket.emit('send', message);
    setmessageinput('');
  }

  const appendMessage = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.current.appendChild(messageElement);
  }

  const toggleFullScreen = (videoElementId) => {
    const videoElement = document.getElementById(videoElementId);

    if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
      // Document is in full-screen mode, so exit full-screen.
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } else {
      // Document is not in full-screen mode, so request full-screen on the video element.
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      } else if (videoElement.mozRequestFullScreen) {
        videoElement.mozRequestFullScreen();
      } else if (videoElement.webkitRequestFullscreen) {
        videoElement.webkitRequestFullscreen();
      } else if (videoElement.msRequestFullscreen) {
        videoElement.msRequestFullscreen();
      }
    }

    if (videoElementId === "video1") {
      setIsFullScreen1(!isFullScreen1);
    } else if (videoElementId === "video2") {
      setIsFullScreen2(!isFullScreen2);
    }
  };
  useEffect(() => {
    const handleParticipants = (name) => {
      if (!participants.includes(name)) {
        setParticipants((prevParticipants) => [...prevParticipants, name]);
      }
    };

    const handleUserLeft = (name) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((participantName) => participantName !== name)
      );
      setRemoteVideoStream((prevStreams) => {
        const updatedStreams = { ...prevStreams };
        delete updatedStreams[name];
        return updatedStreams;
      });
      appendMessage(`${name} left the chat`, 'left');
    };

    const handleMessage = (message, name) => {
      console.log(message);
      appendMessage(`${name}: ${message}`, 'left');
    }

    roomsocket.emit('joining-room');
    roomsocket.on("join-room", handleParticipants);
    roomsocket.on("recieve", handleMessage);
    roomsocket.on("userleft", handleUserLeft);

    return () => {
      roomsocket.off("join-room", handleParticipants);
      roomsocket.off("userleft", handleUserLeft);
      roomsocket.off("recieve", handleMessage);
    };
  }, [roomsocket, participants]);

  useEffect(() => {
    const handleicecandidates = async () => {
      pc.onicecandidate = ({ candidate }) => {
        roomsocket.emit("iceCandidate", { candidate });
      }

      if (mystream && mystream.getTracks().length > 0) {
        mystream.getTracks().forEach((track) => {
          pc.addTrack(track, mystream);
        });
      }

      try {
        await pc.setLocalDescription(await pc.createOffer());
        console.log({ aa: pc.localDescription });
        roomsocket.emit("localDescription", { description: pc.localDescription });
      } catch (err) {
        console.log({ msg: err?.message });
      }
    }
    handleicecandidates();
  }, [mystream, roomsocket])

  useEffect(() => {
    const handlevideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setmystream(stream);
      } catch (error) {
        console.error("Error accessing user media:", error);
      }
    };
    handlevideo();

    roomsocket.on("localDescription", async ({ description }) => {
      console.log({ description });
      pc.setRemoteDescription(description);
      pc.ontrack = (e) => {
        setRemoteVideoStream(new MediaStream([e.track]));
      };

      roomsocket.on("iceCandidate", ({ candidate }) => {
        pc.addIceCandidate(candidate);
      });

      pc.onicecandidate = ({ candidate }) => {
        roomsocket.emit("iceCandidateReply", { candidate });
      };
      await pc.setLocalDescription(await pc.createAnswer());
      roomsocket.emit("remoteDescription", { description: pc.localDescription });
    });
    roomsocket.on("remoteDescription", async ({ description }) => {
      console.log({ description });
      pc.setRemoteDescription(description);
      pc.ontrack = (e) => {
        setRemoteVideoStream(new MediaStream([e.track]));
      };

      roomsocket.on("iceCandidate", ({ candidate }) => {
        pc.addIceCandidate(candidate);
      });

      pc.onicecandidate = ({ candidate }) => {
        roomsocket.emit("iceCandidateReply", { candidate });
      };

    });
  }, [])

  return (
    <>
      <div className="navbar">
        <img src={logo} alt="" />
      </div>

      <div className="room">
        <div className="participants-section">
          <div className="participants-section-heading">
            <h2>PARTICIPANTS</h2>
          </div>
          <div className="participant-name">
            {participants.map((name, index) => (
              <p className="single-participant-name" key={index}>
                {name}
              </p>
            ))}
          </div>
        </div>

        <div className="video-section">
          <div className="video-section-1">
            {mystream && <video id="video1" onClick={() => toggleFullScreen("video1")} ref={(videoRef) => { if (videoRef) videoRef.srcObject = mystream; }} autoPlay/>}
            {remoteVideoStream && <video id="video2" onClick={() => toggleFullScreen("video2")} ref={(videoRef) => { if (videoRef) videoRef.srcObject = remoteVideoStream; }} autoPlay />}
          </div>
          <div className="video-section-2">
            <img src={handlingaudio ? micoon : micoff} onClick={handleaudio} />
            <img src={handlingcamera ? cameraon : cameraoff} onClick={handlecamera} />
            <img src={screenshare} onClick={handleScreenShare} />
            <img src={exit} onClick={handleExit} />
          </div>
        </div>

        <div className="chat-section">
          <div className="chat-section-heading">
            <h2>CHAT SECTION</h2>
          </div>
          <div className="actual-chat">
            {participants.map((name, index) => (
              <h4 key={index}>{name} joined the chat 🎉 🎉</h4>
            ))}
            <div className="actual-chat-2" ref={messageContainer}>
            </div>
          </div>
          <div className="chat-section-input">
            <input className="merainput" value={messageinput} onChange={(e) => { setmessageinput(e.target.value) }} type="text" name="" placeholder="ENTER YOUR MESSAGE" />
            <button onClick={handleSendMessage}>send</button>
          </div>
        </div>
      </div>
    </>
  );
}
