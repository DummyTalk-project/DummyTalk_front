import { Switch } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import AudioRecorderTest from "../AudioRecorder/AudioRecorderTest";
import { useSocket } from "../hooks/use-socket";
import { useUrlQuery } from "../hooks/use-url-query";
import { Label } from "../ui/label";

const ChatVoiceInputTest = () => {
    const [otherUserStream, setOtherUserStream] = useState(null);
    const [enabled, setEnabled] = useState(false);
    const { socket, isConnected } = useSocket();
    const partnerAudio = useRef();
    const otherUser = useRef();
    const userStream = useRef();
    const peerRef = useRef();

    const query = useUrlQuery();
    const channelId = query.get("channel");

    // 미디어 스트림 처리 함수
    const handleMediaStream = (stream) => {
        userStream.current = stream;
        socket.send(
            `/app/${channelId}/audio`,
            JSON.stringify({
                type: "join-room",
                source: socket.id,
                channelId,
            })
        );
    };

    // 에러 처리 함수
    const handleError = (err) => {
        console.error("미디어 스트림을 가져오는 데 실패했습니다:", err);
    };

    // 미디어 스트림 요청 함수
    const requestMediaStream = () => {
        navigator.mediaDevices
            .getUserMedia({ audio: { sampleRate: 16000 } })
            .then(handleMediaStream)
            .catch(handleError);
    };

    const sendMessage = (payload) => {
        socket.send(`/app/${channelId}/audio`, JSON.stringify(payload));
    };

    const callUser = (sessionId) => {
        peerRef.current = createPeer(sessionId);
        userStream.current
            .getTracks()
            .forEach((track) =>
                peerRef.current.addTrack(track, userStream.current)
            );
    };

    const createPeer = (sessionId) => {
        const peer = new RTCPeerConnection({
            iceServers: [
                // {
                //     urls: [
                //         "stun:stun1.l.google.com:19302",
                //         "stun:stun2.l.google.com:19302",
                //     ],
                // },
                {
                    urls: "turns:freeturn.net:5349",
                    credential: "free",
                    username: "free",
                },
                {
                    urls: "turn:freeturn.net:3478",
                    credential: "free",
                    username: "free",
                },
            ],
        });

        peer.onicecandidate = handleICECandidateEvent;
        peer.ontrack = handleTrackEvent;
        peer.onnegotiationneeded = () =>
            handleNegotiationNeededEvent(sessionId);

        return peer;
    };

    const handleNegotiationNeededEvent = async (sessionId) => {
        const offer = await peerRef.current.createOffer();

        peerRef.current.setLocalDescription(offer);

        const payload = {
            type: "offer",
            dest: sessionId,
            source: socket.id,
            channelId,
            data: {
                sdp: offer,
            },
        };

        sendMessage(payload);
    };

    const handleReceiveCall = async (incoming) => {
        peerRef.current = createPeer(incoming.dest);
        const desc = new RTCSessionDescription(incoming.data.sdp);
        peerRef.current.setRemoteDescription(desc);
        userStream.current
            .getTracks()
            .forEach((track) =>
                peerRef.current.addTrack(track, userStream.current)
            );

        try {
            const answer = await peerRef.current.createAnswer();
            peerRef.current.setLocalDescription(answer);
            const payload = {
                type: "answer",
                dest: incoming.source,
                source: socket.id,
                channelId,
                data: {
                    sdp: answer,
                },
            };
            sendMessage(payload);
        } catch (e) {
            console.log(e);
        }
    };

    const handleAnswer = (message) => {
        const desc = new RTCSessionDescription(message.data.sdp);
        peerRef.current.setRemoteDescription(desc).catch((e) => console.log(e));
    };

    const handleICECandidateEvent = (e) => {
        if (e.candidate) {
            const payload = {
                type: "ice-candidate",
                dest: otherUser.current,
                source: socket.id,
                channelId,
                data: {
                    candidate: e.candidate,
                },
            };
            sendMessage(payload);
        }
    };

    const handleNewIceCandidate = (incoming) => {
        console.log("incoming: ", incoming);
        const candidate = new RTCIceCandidate(incoming);

        peerRef.current.addIceCandidate(candidate).catch((e) => console.log(e));
    };

    const handlePeerDisconnected = () => {

        console.log('user leave');
        
        if (peerRef.current) {
            peerRef.current.close();
            peerRef.current = null;
        }

        setOtherUserStream(null);
    };

    const handleTrackEvent = (e) => {
        // Web Audio API 초기화
        // const audioContext = new AudioContext();
        // const source = audioContext.createMediaStreamSource(e.streams[0]);
        // const compressor = audioContext.createDynamicsCompressor();
        // const biquadFilter = audioContext.createBiquadFilter();
        // const gainNode = audioContext.createGain();

        // // 노이즈 감소 설정
        // biquadFilter.type = "lowshelf";
        // biquadFilter.frequency.setValueAtTime(1000, audioContext.currentTime);
        // biquadFilter.gain.setValueAtTime(25, audioContext.currentTime); // 값을 낮춰보세요

        // compressor.threshold.setValueAtTime(-40, audioContext.currentTime); // 값을 조정해보세요
        // compressor.ratio.setValueAtTime(8, audioContext.currentTime); // 값을 낮춰보세요
        // compressor.knee.setValueAtTime(40, audioContext.currentTime);
        // compressor.attack.setValueAtTime(0, audioContext.currentTime);
        // compressor.release.setValueAtTime(0.25, audioContext.currentTime);

        // gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        // // 오디오 노드 연결
        // const destination = audioContext.createMediaStreamDestination();
        // source.connect(biquadFilter);
        // biquadFilter.connect(compressor);
        // compressor.connect(destination);
        // gainNode.connect(destination);

        // const destination = audioContext.createMediaStreamDestination();
        // source.connect(compressor);
        // biquadFilter.connect(compressor);
        // compressor.connect(gainNode);
        // gainNode.connect(destination);
        // console.log("필터적용");
        partnerAudio.current.srcObject = e.streams[0];
        setOtherUserStream(e.streams[0]);
    };

    const handleSocketMessage = (msg) => {
        const message = JSON.parse(msg.body);

        if (!message.dest || socket.id === message.dest) return;

        if (message.type === "other-user") {
            callUser(message.dest);
            otherUser.current = message.dest;
        } else if (message.type === "user-joined") {
            otherUser.current = message.dest;

            const welcomePayload = {
                type: "welcome",
                dest: otherUser.current,
                source: socket.id,
                channelId,
                data: {
                    message: "채팅에 참여하신 것을 환영합니다!",
                },
            };

            sendMessage(welcomePayload);
        } else if (message.type === "offer") {
            handleReceiveCall(message);
        } else if (message.type === "answer") {
            handleAnswer(message);
        } else if (message.type === "ice-candidate") {
            handleNewIceCandidate(message.data.candidate);
        } else if (message.type === "leave") {
            handlePeerDisconnected();
        }
    };

    useEffect(() => {
        if (!isConnected || peerRef.current) return;
        requestMediaStream();

        // 장치 변경 감지
        navigator.mediaDevices.ondevicechange = () => {
            requestMediaStream(); // 장치 변경 시 미디어 스트림을 다시 요청
        };

        const subscription = socket.subscribe(
            `/topic/audio/${channelId}`,
            handleSocketMessage
        );

        return () => {
            if (peerRef.current) {
                peerRef.current.close();
                peerRef.current = null;
            }

            
            setOtherUserStream(null);

            subscription.unsubscribe();
            navigator.mediaDevices.ondevicechange = null; // 장치 변경 감지 해제
        };
    }, [channelId]);

    return (
        <div className="relative flex flex-col px-5 py-2 overflow-hidden rounded-lg h-1/4">
            {/* 채팅 번역 스위치 */}
            <div className="flex flex-row-reverse pb-2">
                <Label
                    htmlFor="airplane-mode"
                    className="self-center font-bold text-2 "
                >
                    음성번역
                </Label>
                <Switch
                    id={"airplane-mode"}
                    checked={enabled}
                    onClick={() => {
                        setEnabled((prev) => !prev);
                    }}
                    className={`${
                        enabled ? "bg-yellow-400 mr-1" : "bg-gray-400 mr-1"
                    } relative inline-flex h-[25px] w-[50px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
                >
                    <span className="sr-only">Use setting</span>
                    <span
                        aria-hidden="true"
                        className={`${
                            enabled ? "translate-x-6" : "translate-x-0"
                        } pointer-events-none inline-block h-[21px] w-[21px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                    />
                </Switch>
                {otherUserStream && (
                    <AudioRecorderTest stream={otherUserStream} />
                )}
            </div>
            {/* 메시지 입력란 */}
            {/* <Textarea
                className="w-full h-full resize-none top-3 outline outline-zinc-300"
                maxLength="150"
                onKeyDown={enter_event}
                ref={sendMessageRef}
                placeholder="메시지를 입력하세요."
            /> */}
            <div className="absolute right-[5%] bottom-[10%] ">
                {/* 사진 전송 버튼 */}
                {/* <Button
                    className="absolute right-[95%] bottom-[-20%] "
                    onClick={() => onOpen("imageSend", { channelId })}
                >
                    <ImagePlus />
                </Button> */}
                {/* 메시지 전송 버튼 */}
                {/* <Button
                    className="h-8 text-white bg-sky-600"
                    onClick={sendChatMessage}
                >
                    Send
                </Button> */}
            </div>
            <audio
                autoPlay
                playsInline
                ref={partnerAudio}
                hidden
            />
        </div>
    );
};
export default ChatVoiceInputTest;
