import axios from "axios";
import { useEffect } from "react";
import Channels from "src/components/channel/Channel";
import Friends from "src/components/channel/Friends";
import ChannelHeader from "src/components/channel/channel-header";
import UserSetting from "src/components/channel/user-settings";
import { useServerData } from "src/components/hooks/use-server-data";
import { useUrlQuery } from "src/components/hooks/use-url-query";
import { Separator } from "src/components/ui/separator";

function ServerSideBar() {
    const query = useUrlQuery();
    const serverId = query.get("server");
    const { data, setData } = useServerData()

    useEffect(() => {
        const fetchServerDetail = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/server/${serverId}`
                );

                setData(response.data);
            } catch (error) {
                console.log("서버 불러오기 실패", error);
            }
        };

        fetchServerDetail();
    }, [serverId, setData]);

    if (!serverId || !data) return null;

    return (
        <section className="w-60 min-w-[240px] h-full bg-[#112233] flex flex-col">
            <ChannelHeader server={data} />
            <Channels server={data} />
            <Separator className="my-4 bg-black" />
            <Friends />
            <Separator className="my-4 bg-black" />
            <UserSetting />
        </section>
    );
}

export default ServerSideBar;
