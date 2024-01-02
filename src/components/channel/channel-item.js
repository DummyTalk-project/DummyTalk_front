import { Edit, Hash, Lock, Mic, Trash } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "src/lib/utils";
import ActionTooltip from "../action-tooltip";
import { useModal } from "../hooks/use-modal";
import { useUrlQuery } from "../hooks/use-url-query";
import { ChannelType } from "./Channel";

const ChannelItem = ({ channel, serverId }) => {
    const generalList = ["일반", "1:1 음성 번역"];
    const iconMap = {
        [ChannelType.TEXT]: Hash,
        [ChannelType.VOICE]: Mic,
    };

    const { onOpen } = useModal();
    const Icon = iconMap[channel.channelType];
    const query = useUrlQuery();
    const channelId = query.get("channel");
    const navigate = useNavigate()

    const onClick = () => {
        navigate(`/main?server=${serverId}&channel=${channel.channelId}`)
    }

    const onAction = (action) => (e) => {
        e.stopPropagation();
        onOpen(action, { channel, serverId });
    };

    return (
        <button
            onClick={onClick}
            className={cn(
                "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                channelId === channel.channelId.toString() &&
                    "bg-zinc-700/20 dark:bg-zinc-700"
            )}
        >
            <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
            <p
                className={cn(
                    "line-clamp-1 font-semibold text-xs text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                    channelId === channel.channelId.toString() &&
                        " dark:text-zinc-200 dark:group-hover:text-white"
                )}
            >
                {channel.channelName}
            </p>

            {!generalList.includes(channel.channelName) && (
                <div className="ml-auto flex items-center gap-x-2">
                    <ActionTooltip label="Edit">
                        <Edit
                            onClick={onAction("editChannel")}
                            className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                        />
                    </ActionTooltip>
                    <ActionTooltip label="Delete">
                        <Trash
                            onClick={onAction("deleteChannel")}
                            className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
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