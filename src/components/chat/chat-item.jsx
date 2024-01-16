import {cn} from "src/lib/utils";
import {UserAvatar} from "../user-avatar";
import moment from "moment";
import {useMemo, useState} from "react";
import {decodeJwt} from "src/lib/tokenUtils";
import {Button} from "src/components/ui/button";
import axios from "axios";
import {Trash2, User} from "lucide-react"; // Import css

const ChatItem = ({chat, channel, name}) => {
    const accessToken = localStorage.getItem("accessToken");
    const {sub, national_language} = useMemo(
        () => decodeJwt(accessToken),
        [accessToken]
    );

    const [context, setContext] = useState(false);
    const [xyPosition, setxyPosition] = useState({x: 0, y: 0});

    const deleteRequest = (chosen) => {
        axios
            .post(
                `${process.env.REACT_APP_API_URL}/chat/del/${channel}/${chat.chatId}`
            )
            .then((res) => {
                if (res.status === 200) {
                    setChosen(chosen);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const showNav = (e) => {
        e.preventDefault();
        setContext(true);

        if (chat.sender.sender !== +sub) return;

        const {clientX, clientY} = e;
        setxyPosition({x: clientX, y: clientY});
        setContext(false);
    };

    const hideContext = (event) => {
        setContext(false);
    };

    const [chosen, setChosen] = useState();

    const timestamp =
        chat && moment(chat.timestamp).format("YYYY.MM.DD HH:mm:ss");

    if (chat?.type === "DELETE") return null;

    // FIXME: 같은 국가의 사용자라도 서로 다른 채팅이 보이도록 수정해야함
    if (chat?.translatedTextList?.length) {
        const translated_list = [...chat.translatedTextList].filter(item => item.national_language_code === national_language)

        translated_list.length && (chat.message = translated_list[0].translated_text)
    }

    return (
        chat && (
            <div
                className={`${parseInt(sub, 10) === (chat?.sender?.userId || chat?.sender) ? "border-2 border-[#B5BAC1] border-opacity-40" : null} 
                            group flex items-center bg-black/5 p-2 mt-1 transition w-full hover:bg-gray-200 hover:bg-opacity-10 rounded-[3px] text-[#B5BAC1]`}
                onContextMenu={showNav}
                onClick={hideContext}
            >

                {context && !chosen && (
                    <Button
                        onClick={() => deleteRequest(true)}
                        className="border-none"
                    >
                        <Trash2
                            className={`relative absolute top-[${ xyPosition.y }px] left-[${ xyPosition.x }px] z-10`}
                        />
                    </Button>
                )}

                <div className="group flex gap-x-2 items-start w-full">
                    <div className="hover:drop-shadow-md transition mt-2 mx-2">
                        {chat.sender.userImgPath ?
                            <UserAvatar src={ chat.sender.userImgPath }/>
                            :
                            <div >
                                <User className={"text-teal-300 border-none"}/>
                            </div>
                        }
                    </div>
                    <div className="flex flex-col w-full">
                        <div className="flex items-center gap-x-2">
                            <div className="flex items-center">
                                <p className="font-semibold text-base">
                                    { chat.sender.nickname || name }
                                </p>
                            </div>
                            <span className="text-xs text-[#B5BAC1]">
                                { chat?.createdAt }
                            </span>
                        </div>
                        { chat?.type === "TEXT" && (
                            <p className={cn("text-sm font-semibold text-[#DBDEE1] whitespace-pre-wrap")}>
                                { chosen ? "메세지가 삭제되었습니다." : chat.message }
                            </p>
                        )}
                        { chat.type === "IMAGE" && (
                            <div>
                                { chosen ? (
                                    <p>메세지가 삭제되었습니다.</p>
                                ) : (
                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
                                    >
                                        <img
                                            alt={ chat.message }
                                            src={ chat.message }
                                            className="w-full h-full object-cover"
                                        />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    );
};

export default ChatItem;
