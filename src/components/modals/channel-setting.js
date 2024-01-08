import { useState, useEffect, useMemo } from 'react';
import { useModal } from 'src/components/hooks/use-modal';
import axios from 'axios';
import { useUrlQuery } from 'src/components/hooks/use-url-query';
import { useLocation } from 'react-router-dom';

function ChannelSetting() {
    const { isOpen, onClose, type } = useModal();
    const isModalOpen = isOpen && type === "channelSettingModal";
    const [channels, setChannels] = useState([]);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const query = useUrlQuery();
    const { state } = useLocation();
    const serverId = query.get("server");
    const channelId = query.get("channel");
    const currentChannel = useMemo(() => channels.find(channel => channel.channelId === channelId), [channels, channelId]);


    const addChannel = (newChannelName) => {
        if (channels.length <= 10 && !channels.some(channel => channel.name === newChannelName)) {
            setChannels(prev => [...prev, { name: newChannelName, connectedUsers: [] }]);
        } else {
            alert("Cannot add more channels or channel already exists.");
        }
    };

    const handleJoinChannel = () => {
        setChannels(prevChannels => prevChannels.map(channel =>
            channel.channelId === channelId
                ? { ...channel, connectedUsers: [...connectedUsers] }
                : channel
        ));
    };

    // const channelDelete = async () => {
    //     if (channelId) {
    //         try {
    //             const response = await axios.delete(`${process.env.REACT_APP_API_URL}/server/${serverId}/channel/${channelId}/delete`);
    //             setChannels(channels.filter(channel => channel.channelId !== channelId));
    //         } catch (error) {
    //             console.error("Error deleting channel:", error);
    //         }
    //     } else {
    //         console.log("No channel selected for deletion.");
    //     }
    // };

    const modalStyle = {
        display: isModalOpen ? 'block' : 'none',
    };

    return (
        <div className="modal" style={{...modalStyle}}>
            {isModalOpen && (
                <div>
                    <button className="join-channel-btn" onClick={handleJoinChannel}>
                        채널 이름: {currentChannel?.channelName}
                        <br />
                        채널 유저 : {connectedUsers.length}
                    </button>
                </div>
            )}
        </div>
    );
}

export default ChannelSetting;
