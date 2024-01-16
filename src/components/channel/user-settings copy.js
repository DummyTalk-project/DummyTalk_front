// src/layouts/LeftSide/Settings.js
import axios from "axios";
import { useState } from "react";

import "../../components/modals/VideoModal.css";
import { useModal } from "../hooks/use-modal"; // Update the path
import { useUrlQuery } from "../hooks/use-url-query"; // Update the path
import "./css/Settings.css";

function UserSetting() {
  const { onOpen, onClose } = useModal();
  const query = useUrlQuery();
  const serverId = query.get("server");
  const [serverSettings, setServerSettings] = useState({});
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharingOn, setIsScreenSharingOn] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isMicrophoneMuted, setIsMicrophoneMuted] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false); // New state for VideoModal



  const handleVideoToggle = () => {
    setIsVideoOn(!isVideoOn);
  };

  const handleScreenShare = () => {
    setIsScreenSharingOn(!isScreenSharingOn);
  };

  const handleMuteAudio = () => {
    setIsAudioMuted(!isAudioMuted);
  };

  const handleMuteMicrophone = () => {
    setIsMicrophoneMuted(!isMicrophoneMuted);
  };

  const updateServerSettings = async (settings) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/server/setting`,
        settings
      );
    } catch (error) {
      console.log("서버 업데이트 오류", error);
    }
  };

  const handleOpenVideoModal = () => {
    setIsVideoModalOpen(true);
  };

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
  };

  return (
    <div className="mt-auto h-16 w-full border-t-[1px] border-black">
      <div>
        {/* <button
          className={`icon-btn ${isVideoOn ? "active" : ""} w-1/4`}
          onClick={handleVideoToggle}
        >
          <FontAwesomeIcon icon={faVideo} />
          <p>Video</p>
        </button>
        <button
          className={`icon-btn ${isScreenSharingOn ? "active" : ""} w-1/4`}
          onClick={handleScreenShare}
        >
          <FontAwesomeIcon icon={faDesktop} />
          <p>Screen Share</p>
        </button>
        <button
          className={`icon-btn ${isAudioMuted ? "active" : ""} w-1/4`}
          onClick={handleMuteAudio}
        >
          <FontAwesomeIcon icon={faVolumeMute} />
          <p>Mute Audio</p>
        </button>
        <button
          className={`icon-btn ${isMicrophoneMuted ? "active" : ""} w-1/4`}
          onClick={handleMuteMicrophone}
        >
          <FontAwesomeIcon icon={faMicrophone} />
          <p>Mute Microphone</p>
        </button> */}
      </div>
      {/* <AudioRecorder /> */}
      {/* <button
        className={`icon-btn ${isVideoOn ? "active" : ""}`}
        onClick={handleOpenVideoModal}
      >
        <FontAwesomeIcon icon={faVideo} />
        <p>Video</p>
      </button> */}
      {/* {isVideoModalOpen && (
        <VideoModal onClose={handleCloseVideoModal} />
      )} */}
      <button
          className="open-settings-btn"
          onClick={() => onOpen("settings", { serverId })}
      >
      </button>
    </div>
  );
}

export default UserSetting;