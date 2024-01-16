import { Activity, Mic } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import "./AudioRecorder.css";
import axios from "axios";
import { useSocket } from "../hooks/use-socket";

const AudioRecorder = () => {
  const [stream, setStream] = useState(null);
  const [media, setMedia] = useState(null);
  const [onRec, setOnRec] = useState(true);
  const [source, setSource] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const { socket, isConnected } = useSocket();

  const ondataavailableCallback = useCallback(async (e) => {
    setAudioUrl(e.data);
    setOnRec(true);

    const reader = new FileReader();
    reader.onload = function (event) {

      socket.send('/app/audioMessage', {}, event.target.result);
    };
    reader.readAsBinaryString(e.data);
  }, [socket]);

  useEffect(() => {
    if (analyser) {
      analyser.onaudioprocess = function (e) {
        if (e.playbackTime > 180) {
          stopRecording();
        } else {
          setOnRec(false);
        }
      };
    }
  }, [analyser]);

  const startRecording = () => {
    setDisabled(true);

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const newAnalyser = audioCtx.createScriptProcessor(0, 1, 1);
    setAnalyser(newAnalyser);

    function makeSound(stream) {
      const newSource = audioCtx.createMediaStreamSource(stream);
      setSource(newSource);
      newSource.connect(newAnalyser);
      newAnalyser.connect(audioCtx.destination);
    }

    navigator.mediaDevices.getUserMedia({ audio: true }).then((newStream) => {
      const newMediaRecorder = new MediaRecorder(newStream);
      newMediaRecorder.start();
      setStream(newStream);
      setMedia(newMediaRecorder);
      makeSound(newStream);
    });

  };

  const stopRecording = () => {
    media.ondataavailable = function (e) {
      setAudioUrl(e.data);
      setOnRec(true);


      const formData = new FormData();
      formData.append("file", e.data)
      axios.post(`${process.env.REACT_APP_API_URL}/audio/upload`, formData)
    };

    stream.getAudioTracks().forEach(function (track) {
      track.stop();
    });

    media.stop();

    analyser.disconnect();
    source.disconnect();

    if (audioUrl) {
      URL.createObjectURL(audioUrl);
    }

    const sound = new File([audioUrl], 'soundBlob', {
      lastModified: new Date().getTime(),
      type: 'audio',
    });

    setDisabled(false);
  };

  const play = () => {
    const audio = new Audio(URL.createObjectURL(audioUrl));
    audio.loop = false;
    audio.volume = 1;
    audio.play();
  };

  const download = () => {
    const blob = new Blob([audioUrl], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = 'recordedAudio.wav';
    a.click();
    window.URL.revokeObjectURL(url);
  };

      // <button className={`record_btn ${isRecording ? 'recording' : ''}`} onClick={onRec ? startRecording : stopRecording}>
      //   {onRec ? "" : ""} {/* 버튼 텍스트 수정 */}
      // </button>
  return (
    <>
      <Button variant="ghost" className='w-[70px] h-[70px] bg-transparent border-2 border-[#8e44ad] rounded-full hover:scale-105 transition-transform' onClick={onRec ? startRecording : stopRecording}>
        {onRec && <Mic className="text-[#8e44ad] w-full h-full font-bold " />}
        {!onRec && <Activity className="text-[#8e44ad] w-full h-full font-bold" />}
      </Button>
      <button onClick={play} className={`${disabled ? "hidden" : "block"}`}>
        Play
      </button>
      <button onClick={download} className={`${disabled ? "hidden" : "block"}`}>
        Download
      </button>
    </>
  );
};

export default AudioRecorder;