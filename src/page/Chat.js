import {Switch} from "@headlessui/react";
import {ChevronLeft, ChevronsLeft, ChevronsRight, icons, ImagePlus} from "lucide-react";
import {useEffect, useMemo, useState} from "react";
import ChatItem from "src/components/chat/chat-item";
import {Button} from "src/components/ui/button";
import {Label} from "src/components/ui/label";
import {Textarea} from "src/components/ui/textarea";
import {useModal} from "src/components/hooks/use-modal";
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import {useUrlQuery} from "src/components/hooks/use-url-query";
import axios from "axios";
import ChatEmpty from "src/components/chat/ChatEmpty";
import {decodeJwt} from "src/util/tokenUtils";

function Chat({isOpen, setOpen}) {
    const { onOpen, onClose } = useModal();

    const query = useUrlQuery()
    const channelId = query.get("channel")

    const accessToken = localStorage.getItem("accessToken")
    const userId = useMemo(() => decodeJwt(accessToken).sub, [accessToken]);

    const [enabled, setEnabled] = useState(false); // 채팅번역 기능
    const [data, setData] = useState([]);
    const [sendMessage, setSendMessage] = useState('');

    const SOCKET_HOST = new SockJS('http://localhost:9999/websocket');
    const socket = Stomp.over(SOCKET_HOST);

    // 메시지를 입력할 때마다 메시지를 업데이트
    const handleChange = (e) => {
        console.log(e);
        setSendMessage(e.target.value);
    };
    const WEBSOCKLOGIN = `/app/${channelId}/message`;


    // 엔터키 눌렀을 때 메시지 전송
    const enter_event = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            console.log('엔터 키 눌림');
            e.preventDefault();

            console.log('메시지 전송:', sendMessage);
            // 메시지를 전송한 후에 메시지를 초기화
            setSendMessage('');
            console.log(sendMessage);

        }
    }

    // 이미지 전송
    const imageSend = () => {
        // 이미지 전송 이벤트 추가 예정
        console.log('imageSend');
    }


    const fetchChatData = async () => {
        try {
            const response = await axios.get(`http://localhost:9999/channel/chat/${channelId}`);
            setData(response.data.data);
            console.log("===================================== response " + response)
        } catch (error) {
            console.error("채팅 리스트 뽑아보기 에러", error);
        }
    }

    useEffect(() => {
        fetchChatData();
    }, []);

    console.log(data);

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

    // stomp 옵션 설정
    useEffect(() => {

        const sock = new SockJS(SOCKET_HOST); // 소켓 연결 'http://localhost:9999/websocket'
        const stompClient = Stomp.over(sock, { debug: false});
    
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
    
            stompClient.subscribe(`/topic/msg/${channelId}`, function (msg) {
                console.log(msg);
                const result = JSON.parse(msg.body);
                console.log(result);
                // setMessages((prevMessages) => [...prevMessages, newMessage]);
                // stompClient.disconnect();
            });
    
            stompClient.send(`/app/${channelId}/message`, JSON.stringify({ message : '안녕하세요', 'sender':userId, language: 'en', channelId}));
        });
    }, [])

    const onMessage = (msg) => {
        console.log('onMessage =====================================: ' + msg)
        // return JSON.stringify({
        //     message: sendMessage,
        //     'sender': userId,
        //     language: 'en',
        //     channelId
        // });
    }

    const onError= (e) => {
        const error = e.body;
        console.log('Alarm Websocket - Error: ', error)
        throw error;
    }

    const USERREPLY = `/topic/msg/${channelId}`;

    const onConnection = () => {
        console.log('onConnected =====================================: ' + socket)

        socket.subscribe(USERREPLY, onMessage);
        socket.send(WEBSOCKLOGIN, sendMessage);
    }

    socket.connect({}, onConnection, onError);   // 소켓 연결

    if (!channelId) return null;

    return (
        data.length === 0 ? <ChatEmpty/> : (
            <div className="flex w-full flex-col h-full">
                {/* 채널명 */}
                <div
                    className="h-[50px] font-bold text-xl flex pl-5 items-center bg-[#D9D9D9] border-y-[1px] border-black justify-between">
                    <div>
                        서브방 이름
                    </div>
                    {/* 우측 사이드 닫힘 / 열림 */}
                    <Button variant={"icon"} onClick={() => setOpen(prev => !prev)}>
                        {isOpen ? <ChevronsRight/> : <ChevronsLeft/>}
                    </Button>

                </div>
                {/* 채팅방 스크롤 바 구역 */}
                <div className="h-3/4 flex items-end ml-3 overflow-y-auto scrollbar-hidden">
                    <div className="h-full w-full">
                        {data.map((chat) => (
                            <ChatItem
                                key={chat.chatId}
                                content={chat.message}
                                member={chat.sender}
                                timestamp={"20200"}
                            />
                        ))}
                    </div>
                </div>
                {/* 메시지 입력 */}
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
                            checked={enabled}
                            onChange={setEnabled}
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
                    <Textarea className="w-full h-full resize-none top-3 outline outline-zinc-300"
                              maxLength="500"
                              onChange={handleChange}
                              onKeyPress={enter_event}
                              value={sendMessage}
                              placeholder="메시지를 입력하세요."/>
                    <div className="absolute right-[5%] bottom-[10%] ">
                        {/* 사진 전송 버튼 */}
                        <Button
                            className="place-self-center"
                            onClick={() => onOpen('imageSend')}>
                            <ImagePlus/>
                        </Button>
                        {/* 메시지 전송 버튼 */}
                        <Button className="h-8 bg-sky-600 text-white">Send</Button>
                    </div>
                </div>
            </div>
        )
    );
}


export default Chat;