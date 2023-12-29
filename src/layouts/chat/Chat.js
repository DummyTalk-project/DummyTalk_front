import ChatHeader from "src/components/chat/chat-header";
import ChatInput from "src/components/chat/chat-input";
import ChatVoiceInput from "src/components/chat/chat-inputvoice";
import ChatMessages from "src/components/chat/chat-messages";
import RightBar from "../MainLayout/RightBar";
import { useEffect, useMemo, useState } from "react";
import { useUrlQuery } from "src/components/hooks/use-url-query";
import { decodeJwt } from "src/lib/tokenUtils";
import ChatEmpty from "src/components/chat/ChatEmpty";
import axios from 'axios'
import ChatVoiceInputTest from "src/components/chat/chat-inputvoiceTest";
import {jwtDecode} from "jwt-decode";

function Chat() {
    const [isOpen, setOpen] = useState(false);
    const [channelType, setChannelType] = useState(null);

    const query = useUrlQuery();
    const channelId = query.get("channel");

    const accessToken = window.localStorage.getItem('accessToken');
    const decodedToken = accessToken ? jwtDecode(accessToken) : null;

    useEffect(() => {
        axios.post(`${process.env.REACT_APP_API_URL}/channel/type?channelId=${channelId}`)
        .then(response => {
                setChannelType(response.data.channelType);
            })
            .catch(error => {
                console.error('Error fetching channel type', error);
            });
    }, [channelId]);

    if (!channelId) return <ChatEmpty />;

    return (
        <>
            <div className="flex w-full flex-col h-full bg-[#122236]">
                {/* 채널명 */}
                <ChatHeader
                    isOpen={isOpen}
                    setOpen={setOpen}
                />
                {/* 채팅방 스크롤 바 구역 */}
                <ChatMessages userInfo={decodedToken} />
                {channelType === "TEXT" && (
                    <>
                        {/* 메시지 입력 */}
                        <ChatInput userInfo={decodedToken}/>
                    </>
                )}
                {channelType === "VOICE" && (
                    <>
                        {/* 메시지 입력 */}
                        <ChatVoiceInputTest userInfo={decodedToken} />
                    </>
                )}
            </div>
            {isOpen && <RightBar />}
        </>
    );
}

export default Chat;
