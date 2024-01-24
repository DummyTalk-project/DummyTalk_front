import { useMicVAD, utils } from "@ricky0123/vad-react";
import axios from "axios";
import { Activity, Mic } from "lucide-react";
import * as ort from "onnxruntime-web";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQueueState } from "rooks";
import { decodeJwt } from "src/lib/tokenUtils";
import "./AudioRecorder.css";

ort.env.wasm.wasmPaths = {
    "ort-wasm-simd-threaded.wasm": "/ort-wasm-simd-threaded.wasm",
    "ort-wasm-simd.wasm": "/ort-wasm-simd.wasm",
    "ort-wasm.wasm": "/ort-wasm.wasm",
    "ort-wasm-threaded.wasm": "/ort-wasm-threaded.wasm",
};

const AudioRecorderTest = ({ stream }) => {
    const [list, { enqueue, dequeue }] = useQueueState([]);
    const [isFirstEnqueue, setIsFirstEnqueue] = useState(false);
    const isLoading = useRef();
    const translatedAudioRef = useRef();
    const accessToken = localStorage.getItem("accessToken");
    const userInfo = useMemo(() => decodeJwt(accessToken), [accessToken]);
    const endedHandler = (e) => {
        if (list.length > 0) {
            const wavBuffer = dequeue();
            sendAudioToServer(wavBuffer);
        }
    };

    const sendAudioToServer = (wavBuffer) => {
        const formData = new FormData();
        formData.append("file", new Blob([wavBuffer]), "audio.wav");
        const apiUrl = `${process.env.REACT_APP_FASTAPI_URL}/api/v1/audio/audio/${userInfo?.national_language}`;
        const axiosConfig = {
            url: apiUrl,
            method: "POST",
            responseType: "blob",
            data: formData,
        };

        axios(axiosConfig).then((response) => {
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            translatedAudioRef.current.src = url;
            isLoading.current.textContent = "";
        });
    };

    const vad = useMicVAD({
        workletURL: "/vad.worklet.bundle.min.js",
        modelURL: "/silero_vad.onnx",
        positiveSpeechThreshold: 0.4,
        negativeSpeechThreshold: 0.25,
        startOnLoad: false,
        stream: stream,
        minSpeechFrames: 16,
        onVADMisfire: () => {
        },
        onSpeechStart: () => {
        },
        onSpeechEnd: (audio) => {
            isLoading.current.textContent = "번역중";
            const wavBuffer = utils.encodeWAV(audio);
            enqueue(wavBuffer);

            if (list.length === 0) {
                setIsFirstEnqueue(true);
            }
            // const base64 = utils.arrayBufferToBase64(wavBuffer);
            // const url = `data:audio/wav;base64,${base64}`;
            // setAudioList((old) => [url, ...old]);
        },
    });

    useEffect(() => {
        if (list.length > 0 && isFirstEnqueue) {
            const wavBuffer = dequeue();
            sendAudioToServer(wavBuffer);
            setIsFirstEnqueue(false);
        }
    }, [list]); // 큐(list)의 변경을 감지합니다.

    return (
        <>
            <audio
                autoPlay
                playsInline
                ref={translatedAudioRef}
                onEnded={endedHandler}
                hidden
            />
            <div className="lk-control-bar">
                <div
                    className={`lk-button-group ${
                        vad?.loading || !!vad?.errored ? "hidden" : "block"
                    }`}
                    onClick={() => vad.toggle()}
                >
                    {!vad?.listening && (
                        <button className="lk-button">
                            <Mic size={16} />
                        </button>
                    )}
                    {vad?.listening && (
                        <button className="lk-button">
                            <Activity size={16}/>
                        </button>
                    )}
                </div>
            </div>
            <div
                ref={isLoading}
                className="font-bold text-indigo-500"
            ></div>
        </>
    );
};

export default AudioRecorderTest;
