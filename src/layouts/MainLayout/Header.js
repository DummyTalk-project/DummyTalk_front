import axios from 'axios';
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { useModal } from "src/components/hooks/use-modal";
import { Button } from "src/components/ui/button";
import { UserAvatar } from "src/components/user-avatar";
import { useDispatch, useSelector } from "react-redux";
import { callGetNickname } from "../../api/MainAPICalls";
import AddFriendModal from "../../components/modals/Add-Friend-modal";
import { decodeJwt } from "src/lib/tokenUtils";

function Header() {
    const accessToken = localStorage.getItem("accessToken");
    const userInfo = useMemo(() => decodeJwt(accessToken), [accessToken]);
    const userId = userInfo.sub;

    const { onOpen } = useModal();
    const imageUrl = "./test.png";
    const [serverList, setServerList] = useState([]);
    const { state } = useLocation();
    const dispatch = useDispatch();

    const data = useSelector(state => state.userReducer);

    useEffect(() => {
        const fetchServers = async () => {
            if (!userId) return;
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/server/list/${userId}`);
                setServerList(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('서버 리스트 가져오기 실패', error);
                setServerList([]); // 오류 발생 시 빈 배열로 설정
            }
        };
        fetchServers();
    }, [userId, state]);

    useEffect(() => {
        dispatch(callGetNickname());
    }, [dispatch]);

    const [page, setPage] = useState(0);
    const validServerList = Array.isArray(serverList) ? serverList : [];
    const slicedData = validServerList.length > 6 ? validServerList.slice(page, 6 + page) : validServerList;

    const navigate = useNavigate();
    const handleServerClick = (serverId) => {
        navigate(`/main?server=${serverId}`);
    };

    return (
        <>
            <header className="text-md font-semibold px-3 flex items-center h-[60px] bg-[#0A192E]">
                <div onClick={() => onOpen("settings")} className="w-[200px]">
                    <img className="h-full w-[150px] min-w-[150px] flex items-center" src="/logo.svg" alt=""></img>
                </div>
                <div className="flex">
                    <div onClick={() => onOpen("createServer")}>
                        <Button className="#52cbb6 border-2 border-[#52cbb6]" size="icon">
                            <Plus />
                        </Button>
                    </div>
                    <button
                        onClick={() => setPage((pre) => (pre > 0 ? pre - 1 : pre))}
                        className="border-2 border-[#52cbb6]" // Updated border color
                        style={serverList.length > 6 ? { display: "block", margin: "0px 5px 0px 20px" } : { display: "none" }}
                    >
                        <ChevronLeft className={"text-yellow-600"} />
                    </button>
                    {slicedData.map((data, index) => (
                        <div key={index} style={{ marginLeft: "10px" }} onClick={() => handleServerClick(data.id)}>
                            <Button className="overflow-hidden text-lg font-bold" size="serverIcon" variant="serverLink">
                                {data.serverName ? data.serverName.slice(0, 2) : "???"}
                            </Button>
                        </div>
                    ))}
                    <AddFriendModal />
                    <button
                        onClick={() => setPage((prev) => prev + 1)}
                        className="border-2 border-[#52cbb6]" // Updated border color
                        style={serverList.length > 6 && page + 6 !== serverList.length ? { display: "block", marginLeft: "15px" } : { display: "none" }}
                    >
                        <ChevronRight className={"text-yellow-600"} />
                    </button>
                </div>
                <Button
                onClick={() => onOpen("addFriend")}
                className="w-[80px] h-[30px] bg-[#51CBB6] hover:bg-[#45B2A5] font-bold ml-auto"
                >
                친구추가
                </Button>
                <div style={{ cursor: "pointer" }} className="h-8 w-8 md:h-8 md:w-8 mr-2" onClick={() => onOpen("members")}>
                    <UserAvatar src={imageUrl} />
                </div>
                <div style={{ margin: "0px 20px 0px 10px" }}>{data.nickname}</div>
                <Button onClick={() => onOpen("logout")} className="w-[80px] h-[30px] bg-[#51CBB6] hover:bg-[#45B2A5] font-bold">
                    로그아웃
                </Button>
            </header>
        </>
    );
}

export { Header };