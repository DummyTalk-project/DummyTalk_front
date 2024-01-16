import axios from "axios";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useUrlQuery } from "src/components/hooks/use-url-query";
import { Button } from "../ui/button";

const ChatHeader = ({isOpen, setOpen}) => {

    const [channelName, setChannelName] = useState("");
    const query = useUrlQuery();
    const channelId = query.get("channel");

    const getChannelName = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/channel/${channelId}`
            );
            setChannelName(response.data.data.channelName);
        } catch (error) {
            console.error(`채널 이름 조회 실패: ${error}`);
        }
    }
    console.log("채널 아이디  : ", channelName);

    useEffect(() => {
        getChannelName();
    }, [channelId]);

    return channelName && (
        <div
            className="h-[60px] min-h-[60px] font-bold text-md flex pl-5 items-center border-b-[1px] border-black justify-between text-zinc-400">
            <div>{channelName}</div>
            {/* 우측 사이드 닫힘 / 열림 */}
            <Button
                variant={"icon"}
                onClick={() => setOpen((prev) => !prev)}
            >
                {isOpen ? <ChevronsRight/> : <ChevronsLeft/>}
            </Button>
        </div>
    );
};
export default ChatHeader;
