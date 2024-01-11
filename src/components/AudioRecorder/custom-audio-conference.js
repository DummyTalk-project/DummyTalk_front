import {
    AudioTrack,
    AudioVisualizer,
    ControlBar,
    LayoutContextProvider,
    useTracks,
} from "@livekit/components-react";
import { RemoteTrackPublication, Track } from "livekit-client";
import { useLayoutEffect, useState } from "react";
import AudioRecorderTest from "./AudioRecorderTest";

const CustomAudioConference = ({ ...props }) => {
    const [mediaStream, setMediaStream] = useState(null);
    const tracks = useTracks(
        [
            Track.Source.Microphone,
            Track.Source.ScreenShareAudio,
            Track.Source.Unknown,
        ],
        {
            updateOnlyOn: [],
            onlySubscribed: false,
        }
    );

    useLayoutEffect(() => {
        // if (mediaStream) return;

        
        for (const track of tracks) {
            if (!(track.publication instanceof RemoteTrackPublication))
                continue;

            track.publication.setSubscribed(true);
            if (track.publication.audioTrack?.mediaStreamTrack) {
                const mediaStreamTrack =
                    track.publication.audioTrack?.mediaStreamTrack;
                const newMediaStream = new MediaStream([mediaStreamTrack]);
                
                setMediaStream(newMediaStream);
            }
        }
    }, [tracks]);

    // TODO: Layout 수정
    return (
        <LayoutContextProvider>
            <div className="flex flex-col h-full">
                <div className="flex justify-center">
                    <ControlBar
                        variation={"minimal"}
                        controls={{
                            microphone: true,
                            screenShare: false,
                            camera: false,
                            chat: false,
                            leave: false,
                        }}
                    />
                    {mediaStream && <AudioRecorderTest stream={mediaStream} />}
                </div>

                <div
                    className="lk-audio-conference"
                    {...props}
                >
                    <div className="grid w-full h-full grid-cols-2 gap-3 p-3">
                        {tracks?.map((trackRef) => (
                            <>
                                <AudioTrack trackRef={trackRef} />
                                <div className="flex flex-col items-center justify-center w-full h-1/2">
                                    <AudioVisualizer trackRef={trackRef} />
                                    <span>{trackRef.participant.name}</span>
                                </div>
                            </>
                        ))}
                    </div>
                </div>
            </div>
        </LayoutContextProvider>
    );
};

export default CustomAudioConference;
