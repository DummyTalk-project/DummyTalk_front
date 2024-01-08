// Channels.js
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUrlQuery } from "src/components/hooks/use-url-query";
import { ScrollArea } from "../ui/scroll-area";
import ChannelItem from "./channel-item";
import ChannelSection from "./channel-section";
import "./css/Channels.css";

export const ChannelType = {
    VOICE: "VOICE",
    TEXT: "TEXT",
};

const Channels = ({ server }) => {
    const [connectedUsers, setConnectedUsers] = useState([]);
    const query = useUrlQuery();
    const { state } = useLocation();
    const channelId = query.get("channel");

    const navigate = useNavigate();

    /* 채널 리스트 함수 */
    // useEffect(() => {
    //     const channelList = async () => {
    //         try {
    //             const response = await axios.get(
    //                 `${process.env.REACT_APP_API_URL}/server/${server.id}/channel/list/${userId}`
    //             );
    //             console.log("channel list: ", response);
    //             setChannels(response.data);
    //         } catch (error) {
    //             if (error.message == "Request failed with status code 404") {
    //                 navigate(-1);
    //             }
    //         }
    //     };
    //     channelList();
    // }, [server.id, state]);

    // const handleChannelClick = () => {
    //     const selectedChannel = channels;
    //     // setChannelId(selectedChannel);
    // };

    // const handleJoinChannel = () => {
    //     setChannels((prevChannels) => {
    //         const updatedChannels = prevChannels.map((channel) => ({
    //             ...channel,
    //             connectedUsers:
    //                 channel === channelId
    //                     ? connectedUsers
    //                     : channel.connectedUsers,
    //         }));
    //         console.log(`Joining Channel: ${channelId.name}`);
    //         console.log(`Connected Users: ${connectedUsers.length}`);
    //         return updatedChannels;
    //     });
    // };

    const textChannels = server.channelDtoList.filter(
        (channel) => channel.channelType === ChannelType.TEXT
    );
    const audioChannels = server.channelDtoList.filter(
        (channel) => channel.channelType === ChannelType.VOICE
    );

    return (
        <>
            {/* 채널 리스트 */}
            {/* 채널 리스트 렌더링 */}
            {/* <div className="h-[80px] font-bold text-xl border-b-[1px] border-black text-teal-300 flex items-center p-4">
            </div> */}
            <div className="flex flex-col overflow-y-scroll font-thin text-zinc-300 scrollbar-hidden">
                <ScrollArea className="flex-1 pt-1 pl-3">
                    {!!textChannels?.length && (
                        <div className="mb-2">
                            <ChannelSection
                                channelType={ChannelType.TEXT}
                                label="텍스트 채널"
                            />
                            {textChannels.map((channel) => (
                                <ChannelItem
                                    key={channel.channelId}
                                    server={server}
                                    serverId={server.id}
                                    channel={channel}
                                />
                            ))}
                        </div>
                    )}
                    {!!audioChannels?.length && (
                        <div className="mb-2">
                            <ChannelSection
                                channelType={ChannelType.TEXT}
                                label="음성 채널"
                            />
                            {audioChannels.map((channel) => (
                                <ChannelItem
                                    key={channel.channelId}
                                    server={server}
                                    serverId={server.id}
                                    channel={channel}
                                />
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </div>
        </>
    );
};

export default Channels;
