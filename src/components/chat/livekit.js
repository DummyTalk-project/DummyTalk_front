import { LiveKitRoom } from "@livekit/components-react";
import "@livekit/components-styles";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { decodeJwt } from "src/lib/tokenUtils";
import CustomAudioConference from "../AudioRecorder/custom-audio-conference";
import { useUrlQuery } from "../hooks/use-url-query";

const LiveKit = () => {
    const serverUrl = "wss://dummytalk-9099k81s.livekit.cloud";
    const [token, setToken] = useState(null);
    const query = useUrlQuery();
    const channelId = query.get("channel");
    const {nickname} = useSelector(state => state.userReducer)
    const accessToken = localStorage.getItem("accessToken");
    const userInfo = decodeJwt(accessToken);

    useEffect(() => {
        (async () => {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/livekit/getTokens?room=${channelId}&userId=${userInfo?.sub}&nickname=${nickname}`
            );

            setToken(response.data);
        })();
    }, [channelId, userInfo?.sub]);

    if (!token) {
        return (
            <div className="flex flex-col items-center justify-center flex-1">
                <Loader2 className="my-4 h-7 w-7 text-zinc-200 animate-spin" />
                <p className="text-xs text-zinc-400">
                    Loading...
                </p>
            </div>
        );
    }

    return (
        <LiveKitRoom
            video={false}
            audio={{ echoCancellation: true, noiseSuppression: true }}
            token={token}
            serverUrl={serverUrl}
            connect={true}
            // Use the default LiveKit theme for nice styles.
            data-lk-theme="default"
        >
            <CustomAudioConference />
            {/* <RoomAudioRenderer /> */}
            {/* <ControlBar /> */}
        </LiveKitRoom>
    );
};

export default LiveKit;
