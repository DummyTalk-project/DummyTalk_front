import { Switch } from "@headlessui/react";
import { ChevronsLeft, ChevronsRight, ImagePlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import SockJS from 'sockjs-client';
import ChatItem from "src/components/chat/chat-item";
import { useModal } from "src/components/hooks/use-modal";
import { useUrlQuery } from "src/components/hooks/use-url-query";
import { Button } from "src/components/ui/button";
import { Label } from "src/components/ui/label";
import { Textarea } from "src/components/ui/textarea";
import { decodeJwt } from "src/util/tokenUtils";
import Stomp from 'webstomp-client';

function Chat({ isOpen, setOpen }) {
    const query = useUrlQuery()
    const channelId = query.get("channel")
    const accessToken = localStorage.getItem("accessToken")

    const userId = useMemo(() => decodeJwt(accessToken).sub , [accessToken])

    // isOpen, setOpen 오른쪽 사이드바

    const [enabled, setEnabled] = useState(false); // 채팅번역 기능
    const [message, setMessage] = useState(''); // 메시지 입력
    const { onOpen, onClose } = useModal()

    const members = [   // 채팅방 임시 멤버
        {
            id: 1,
            profile: {
                name: "John Doe",
                imageUrl: "./test.png",
            },
            role: "admin",
            content: "hello, My name is John Doe. What's your name?",
        },
        {
            id: 2,
            profile: {
                name: "Jane Smith",
                imageUrl: "./logo192.png",
            },
            role: "member",
            content: "John Smith",
        },
        {
            id: 3,
            profile: {
                name: "John Doe",
                imageUrl: "./test.png",
            },
            role: "admin",
            content:
                "TEST, TEST, TEST, TEST, TEST, TEST, TEST, TEST, TEST, TEST, TEST, TEST, TEST, TEST, TEST, TEST, TEST, TEST, TEST, TEST, TEST, TEST, TEST, TEST, TEST, TEST, ",
        },
    ];

    // 메시지를 입력할 때마다 메시지를 업데이트
    const handleChange = (e) => {
        console.log(message);
        setMessage(e.target.value);
    };

    // 엔터키 눌렀을 때 메시지 전송
    const enter_event = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            console.log('엔터 키 눌림');
            e.preventDefault();
            // 메세지 전송 이벤트 추가 예정
            
            console.log('메시지 전송:', message);
            // 메시지를 전송한 후에 메시지를 초기화
            setMessage('');
            console.log(message);
        }
    }

    useEffect(() => {
        // 메시지 전송 후
    },[])

    // 채팅번역 기능 활성화 / 비활성화


    // 이미지 전송
    const imageSend = () => {
        // 이미지 전송 이벤트 추가 예정
        console.log('imageSend');
    }


    //********************* 소켓 통신 *********************//
    // const [subscribe, setubscribe] = useState([]);

    // stomp 옵션 설정
    const SOCKET_HOST = 'http://localhost:9999/websocket';
    // const options = {
    //     protocols : ['v12.stomp', 'v11.stomp'],
    //     binary : false,             // true : 바이너리 값 사용 가능
    //     heartbeat : [10000, 10000], // [서버->클라이언트, 클라이언트->서버] ms
    //     debug : true               // true : 디버깅 모드
    // }

    // let subscribe = null;

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


    if (!channelId) return null;

        return (

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
                        {members.map((mem) => (
                            <ChatItem
                                key={mem.id}
                                member={mem}
                                content={mem.content}
                                timestamp={"2022"}
                            />
                        ))}
                        {members.map((mem) => (
                            <ChatItem
                                key={mem.id}
                                member={mem}
                                content={mem.content}
                                timestamp={"2022"}
                            />
                        ))}
                        {members.map((mem) => (
                            <ChatItem
                                key={mem.id}
                                member={mem}
                                content={mem.content}
                                timestamp={"2022"}
                            />
                        ))}
                        {members.map((mem) => (
                            <ChatItem
                                key={mem.id}
                                member={mem}
                                content={mem.content}
                                timestamp={"2022"}
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
                              value={message}
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
        );

}

export default Chat;
