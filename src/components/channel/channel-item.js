import { Edit, Hash, Lock, Mic, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "src/lib/utils";
import ActionTooltip from "../action-tooltip";
import { useModal } from "../hooks/use-modal";
import { useUrlQuery } from "../hooks/use-url-query";
import { ChannelType } from "./Channel";
import { decodeJwt } from "src/lib/tokenUtils";
import {useMemo, useState} from "react";
import axios from "axios";

const ChannelItem = ({ channel, serverId, server }) => {
    const generalList = ["일반", "1:1 음성 번역"];
    const iconMap = {
        [ChannelType.TEXT]: Hash,
        [ChannelType.VOICE]: Mic,
    };

    const accessToken = localStorage.getItem("accessToken");
    const userInfo = useMemo(() => decodeJwt(accessToken), [accessToken]);
    const userId = userInfo.sub;
    const ADMIN = server.userId.toString()

    const { onOpen } = useModal();
    const Icon = iconMap[channel.channelType];
    const query = useUrlQuery();
    const channelId = query.get("channel");
    const navigate = useNavigate()
    const [channels, setChannels] = useState([]);

    const currentChannel = useMemo(() => channels.find(channel => channel.channelId === channelId), [channels, channelId]);


    const onClick = () => {
        navigate(`/main?server=${serverId}&channel=${channel.channelId}`)
    }

    const onAction = (action) => (e) => {
        e.stopPropagation();
        onOpen(action, { channel, serverId });
    };


    /* 채널 삭제 */
    const channelDelete = async () => {
        if (channelId) {
            try {
                const response = await axios.delete(`${process.env.REACT_APP_API_URL}/server/${serverId}/channel/${channelId}/delete`);
                setChannels(channels.filter(channel => channel.channelId !== channelId));
            } catch (error) {
                console.error("Error deleting channel:", error);
            }
        } else {
        }
    };

    return (
        <button
            onClick={onClick}
            className={cn(
                "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/50 transition mb-1",
                channelId === channel.channelId.toString() &&
                    "bg-zinc-700/50"
            )}
        >
            <Icon className="flex-shrink-0 w-4 h-4 text-zinc-400" />
            <p
                className={cn(
                    "line-clamp-1 font-semibold text-xs text-zinc-400 group-hover:text-zinc-300 transition",
                    channelId === channel.channelId.toString() &&
                        " text-zinc-200 group-hover:text-white"
                )}
            >
                {channel.channelName}
            </p>

            {!(generalList.includes(channel.channelName) || ADMIN !== userId) && (
                <div className="ml-auto flex items-center gap-x-2">
                    <ActionTooltip label="수정">
                        <Edit
                            onClick={() => onOpen("#swae")}
                            className="hidden group-hover:block w-4 h-4 text-zinc-400 hover:text-zinc-300 transition"
                        />
                    </ActionTooltip>
                    <ActionTooltip label="삭제">
                        <Trash
                            onClick={channelDelete}
                            className="hidden group-hover:block w-4 h-4 text-zinc-400 hover:text-zinc-300 transition"
                        />
                    </ActionTooltip>
                </div>
            )}
            {generalList.includes(channel.channelName) && (
                <Lock className="w-4 h-4 ml-auto text-zinc-500 dark:text-zinc-400" />
            )}
        </button>
    );
};
export default ChannelItem;
