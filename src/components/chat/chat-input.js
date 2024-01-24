import { Switch } from "@headlessui/react";
import axios from "axios";
import { ImagePlus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useUrlQuery } from "src/components/hooks/use-url-query";
import { Textarea } from "src/components/ui/textarea";
import { useChatData } from "../hooks/use-chat-data";
import { useModal } from "../hooks/use-modal";
import { useSocket } from "../hooks/use-socket";
import { Button } from "../ui/button";
import { Label } from "../ui/label";


const ChatInput = ({ userInfo }) => {
    const [enabled, setEnabled] = useState(false); // 채팅번역 기능
    const { socket, isConnected } = useSocket();
    const { onOpen } = useModal();
    const query = useUrlQuery();
    const channelId = query.get("channel");
    const [summary, setSummary] = useState(false); // 채팅 요약기능;
    const user = useSelector((state) => state.userReducer);
    const { updateData } = useChatData();
    const sendMessageRef = useRef(null);
    const userLanguage = userInfo.national_language;
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSummaryLoading, setIsSummaryLoading] = useState(false); // State for tracking summary API loading


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

        const subscription = socket.subscribe(
            `/topic/msg/${channelId}`,
            async (msg) => {
                let result = JSON.parse(msg.body);

                if (enabled && result.chat.sender?.userId !== parseInt(userInfo?.sub)) {
                    const apiUrl = `${process.env.REACT_APP_FASTAPI_URL}/api/v1/trans/${userInfo?.national_language}`;
                    const axiosConfig = {
                        url: apiUrl,
                        method: "POST",
                        data: { ...result.chat },
                    };

                    const { data } = await axios(axiosConfig);
                    result = data;
                }

                updateData(result.chat);
            }
        );
        return () => subscription.unsubscribe();
    }, [enabled, isConnected, channelId, socket, userInfo]);

    /* 채팅 요약 요청 */
    const summaryData = async () => {
        setIsSummaryLoading(true);
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_FASTAPI_URL}/api/summary/${channelId}/summary`,
                { nation_language: userLanguage },
                { headers: { 'Content-Type': 'application/json' } }
            );
            setSummary(currentSummaryState => !currentSummaryState);
        } catch (error) {
            console.error("summary 요청 실패:", error.response || error.message, ">>>>>>", userLanguage);
        } finally {
            setIsSummaryLoading(false);
        }
    };

    useEffect(() => {
        if (summary) {
            summaryData();
        }
    }, [summary]);


    const enter_event = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    };

    const sendChatMessage = useCallback(() => {
        if (!isConnected || sendMessageRef.current?.value === "" || !userInfo) return;

        socket.send(`/app/${channelId}/message`, JSON.stringify({
            message: sendMessageRef.current?.value,
            sender: {
                userId: userInfo?.sub
            },
            nickname: user?.nickname,
            langague: userInfo?.national_language,
            channelId,
            type: "TEXT",
        }));
        sendMessageRef.current.value = "";
    }, [channelId, isConnected, socket, userInfo]);


    return (
        <div className="relative flex flex-col px-5 pb-2 mt-auto overflow-hidden rounded-lg">
            <div className="flex flex-row-reverse pb-2">
                <div className="flex items-center space-x-4">
                    {/* Summary Toggle */}
                    <div className="flex items-center">
                        <Label htmlFor="summary-mode" className="font-bold text-2 text-zinc-300 mr-2">
                            요약
                        </Label>
                        <Switch
                            id={"summary-mode"}
                            checked={summary}
                            onClick={() => {
                                if (!isSummaryLoading) {
                                    setSummary((prev) => !prev);
                                }
                            }}
                            disabled={isSummaryLoading}
                            className={`${summary ? "bg-yellow-400" : "bg-gray-400"} relative inline-flex h-[25px] w-[50px] rounded-full border-2 border-transparent transition-colors ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
                        >
                            <span className="sr-only">Use setting</span>
                            <span
                                aria-hidden="true"
                                className={`${summary ? "translate-x-6" : "translate-x-0"} pointer-events-none inline-block h-[21px] w-[21px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                            />
                        </Switch>
                    </div>

                    {/* 채팅 번역 스위치 */}
                    <div className="flex items-center">
                        <Label htmlFor="translation-mode" className="font-bold text-2 text-zinc-300 mr-2">
                            번역
                        </Label>
                        <Switch
                            id={"translation-mode"}
                            checked={enabled}
                            onClick={() => {
                                setEnabled((prev) => !prev);
                            }}
                            className={`${
                                enabled ? "bg-yellow-400" : "bg-gray-400"
                            } relative inline-flex h-[25px] w-[50px] rounded-full border-2 border-transparent transition-colors ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
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
                </div>
            </div>
            {/* 메시지 입력란 */}
            <Textarea
                className="border-[1px] w-full resize-none top-3 outline-none outline-[#3F3F4680] bg-[#f2f3f5] bg-opacity-10 text-[#DBDEE1] font-semibold"
                maxLength="300"
                onKeyDown={enter_event}
                ref={sendMessageRef}
                placeholder="메시지를 입력하세요."
            />
            <div className="absolute right-[3%] bottom-[10%] ">
                {/* 사진 전송 버튼 */}
                <Button
                    className="absolute right-[95%] bottom-[-20%] border-none"
                    onClick={() =>
                        onOpen("imageSend", { channelId, socket, isConnected })
                    }
                >
                    <ImagePlus className={"text-zinc-300"}/>
                </Button>
                {/* 메시지 전송 버튼 */}
                <Button
                    className="h-7 text-white bg-teal-500 "
                    onClick={sendChatMessage}
                >
                    Send
                </Button>
            </div>
        </div>
    );
};
export default ChatInput;
