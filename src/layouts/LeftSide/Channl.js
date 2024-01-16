// Channels.js
import axios from "axios";
import {useEffect, useMemo, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import { useModal } from "src/components/hooks/use-modal";
import { useUrlQuery } from "src/components/hooks/use-url-query";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";
import "./css/Channels.css";
import { ChevronDown } from "lucide-react";
import {decodeJwt} from "src/lib/tokenUtils";

const Channels = () => {
    const [channels, setChannels] = useState([]);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const { onOpen, onClose, data } = useModal();
    const query = useUrlQuery();
    const { state } = useLocation();
    const serverId = query.get("server");
    const channelId = query.get("channel");

    const navigate = useNavigate();
    const accessToken = localStorage.getItem("accessToken");
    const userInfo = useMemo(() => decodeJwt(accessToken), [accessToken]);
    const userId = userInfo.sub;

    /* 채널 리스트 함수 */
    useEffect(() => {
        const channelList = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/server/${serverId}/channel/list/${userId}`
                );
                setChannels(response.data);
            } catch (error) {
                console.log("채널 리스트 실패 >>>>>>>> : ", error.message);
                if(error.message == "Request failed with status code 404"){
                    navigate(-1);
                }
            }
        };
        channelList();
    }, [serverId, state]);

    const handleChannelClick = () => {
        const selectedChannel = channels;
        // setChannelId(selectedChannel);
    };

    const handleJoinChannel = () => {
        setChannels((prevChannels) => {
            const updatedChannels = prevChannels.map((channel) => ({
                ...channel,
                connectedUsers:
                    channel === channelId
                        ? connectedUsers
                        : channel.connectedUsers,
            }));
            return updatedChannels;
        });
    };

    return (
        <>
            {/* 채널 리스트 */}
            {/* 채널 리스트 렌더링 */}
            {/* <div className="h-[80px] font-bold text-xl border-b-[1px] border-black text-teal-300 flex items-center p-4">
            </div> */}
            <DropdownMenu>
                <DropdownMenuTrigger
                    asChild
                    className="focus:outline-none"
                >
                    <button className="w-full h-[80px] text-md text-teal-300 font-semibold px-3 flex items-center border-b-[1px] border-black hover:bg-zinc-700/10 transition">
                        서버 이름
                        <ChevronDown className="h-5 w-5 ml-auto" />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56 text-teal-300 bg-[#112033]">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex flex-col text-teal-300 font-thin p-4 overflow-y-scroll">
                {channels.map((channel, index) => (
                    <Link
                        to={`/main?server=${serverId}&channel=${channel.channelId}`}
                        key={channel.channelId}
                        onClick={handleChannelClick}
                    >
                        {channel.channelName}
                    </Link>
                ))}
            </div>
        </>
    );
};

export default Channels;
