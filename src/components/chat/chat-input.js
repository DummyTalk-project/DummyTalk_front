import {Switch} from "@headlessui/react";
import axios from "axios";
import {ImagePlus} from "lucide-react";
import {useCallback, useEffect, useRef, useState} from "react";
import {useModal} from "../hooks/use-modal";
import {useSocket} from "../providers/socket-provider";
import {Button} from "../ui/button";
import {Label} from "../ui/label";
import {Textarea} from "src/components/ui/textarea";

const ChatInput = ({channelId, userInfo, setData}) => {
    const [enabled, setEnabled] = useState(false); // 채팅번역 기능
    const {socket, isConnected} = useSocket();
    const {onOpen} = useModal();

    const sendMessageRef = useRef(null);
    /***
     * 1. 채팅방 입장시 채팅방의 채팅 리스트를 불러온다.
     * - 채팅 리스트는 채팅방 입장시 한번만 불러온다.
     * - userId, channelId, message, language, timestamp, page
     * -- @RequestBody : { SendChatDto : sender, message, language, channelId }
     * -- @DestinationVariable : channelId
     * -- @Header : UserId
     * -- @RequestParam : page
     * endpoint : /websocket
     * subscribe : /topic/msg/{channelId}
     * send : /app/{channelId}/message
     */
    useEffect(() => {
        if (!channelId || !isConnected || !userInfo) return;

        const updateData = (chatData) => setData((prev) => [...prev, chatData]);

        const subscription = socket.subscribe(
            `/topic/msg/${channelId}`,
            async (msg) => {
                console.log("msg   :", msg)
                let result = JSON.parse(msg.body);

                if (enabled && result.chat.sender !== parseInt(userInfo?.sub)) {
                    const apiUrl = `${process.env.REACT_APP_API_URL}/chat/trans/${userInfo?.national_language}`;
                    const axiosConfig = {
                        url: apiUrl,
                        method: "POST",
                        data: {...result.chat},
                    };

                    const {data} = await axios(axiosConfig);
                    result = data;
                }
                updateData(result.chat);
            }
        );
        return () => subscription.unsubscribe();
    }, [
        enabled,
        isConnected,
        channelId,
        socket,
        userInfo,
        setData
    ]);


    // 엔터키 눌렀을 때 메시지 전송
    const enter_event = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    };

    const sendChatMessage = useCallback(() => {
        if (!isConnected || !userInfo) return;

        socket.send(
            `/app/${channelId}/message`,
            // `/app/audioMessage` //오디오로 담는부분
            JSON.stringify({
                message: sendMessageRef.current?.value,
                sender: userInfo?.sub,
                nickname: userInfo?.nickname,
                language: "en",
                channelId,
            })
        );
        sendMessageRef.current.value = "";
        // 메시지를 전송한 후에 메시지를 초기화
        // setsendMessageRef("");
    }, [channelId, isConnected, socket, userInfo]);

    return (
        <div className="flex flex-col h-1/4 relative overflow-hidden px-5 py-2 rounded-lg">
            {/* 채팅 번역 스위치 */}
            <div className="flex flex-row-reverse pb-2">
                <Label
                    htmlFor="airplane-mode"
                    className="font-bold text-2 self-center "
                >
                    채팅번역
                </Label>
                <Switch
                    id={"airplane-mode"}
                    checked={enabled}
                    onClick={() => {
                        console.log(!enabled);
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
            </div>
            {/* 메시지 입력란 */}
            <Textarea
                className="w-full h-full resize-none top-3 outline outline-zinc-300"
                maxLength="150"
                onKeyDown={enter_event}
                ref={sendMessageRef}
                placeholder="메시지를 입력하세요."
            />
            <div className="absolute right-[5%] bottom-[10%] ">
                {/* 사진 전송 버튼 */}
                <Button
                    className="place-self-center"
                    onClick={() => onOpen("imageSend", {channelId})}
                >
                    <ImagePlus/>
                </Button>
                {/* 메시지 전송 버튼 */}
                <Button
                    className="h-8 bg-sky-600 text-white"
                    onClick={sendChatMessage}
                >
                    Send
                </Button>
            </div>
        </div>
    );
};
export default ChatInput;