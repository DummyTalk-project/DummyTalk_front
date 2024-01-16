import axios from 'axios';
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from 'react-router-dom';
import { useModal } from "src/components/hooks/use-modal";
import { Button } from "src/components/ui/button";
import { UserAvatar } from "src/components/user-avatar";
import { decodeJwt } from "src/lib/tokenUtils";
import { callGetFriendRequest, callGetNickname, callPostApproval, callPostRefusal } from "../../api/MainAPICalls";
import AddFriendModal from "../../components/modals/Add-Friend-modal";

function Header() {
  const accessToken = localStorage.getItem("accessToken");
  const userInfo = useMemo(() => decodeJwt(accessToken), [accessToken]);
  const userId = userInfo.sub;

    const { onOpen } = useModal();
    const imageUrl = "./test.png";
    const [serverList, setServerList] = useState([]);
    const [onRequest, setOnRequest] = useState(false);
    const { state } = useLocation()
    const dispatch =  useDispatch()

    const data = useSelector(state => state.userReducer);
    const FriendData = useSelector(state => state.requestReducer);

  /* 서버 리스트 가져오기 */
  useEffect(() => {
    const fetchServers = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/server/list/${userId}`
        );
        setServerList(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("서버 리스트 가져오기 실패", error);
        setServerList([]); // 오류 발생 시 빈 배열로 설정
      }
    };

    fetchServers();
  }, [state]);
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
        dispatch( callGetNickname() )
        dispatch( callGetFriendRequest() )
    }, []);

  const [page, setPage] = useState(0);
  const validServerList = Array.isArray(serverList) ? serverList : [];
  const slicedData =
    validServerList.length > 6
      ? validServerList.slice(page, 6 + page)
      : validServerList;

  /* 서버 접속  */
  const navigate = useNavigate();
  const handleServerClick = (serverId) => {
    navigate(`/main?server=${serverId}`);
  };

    const onClickApproval = (friendId) =>{
        dispatch(callPostApproval(friendId))
    }



    const onClickRefusal = (friendId) =>{
        dispatch(callPostRefusal(friendId))
    }

    const onClickRequest = () =>{
        setOnRequest(prev => !prev);
    }

    const onClickTest = () =>{
        console.log(data)
    }

    return (
    
        <>
            <header className="text-md font-semibold px-3 flex items-center h-[60px] bg-[#0A192E]">
                <div onClick={() => onOpen("settings")} className="w-[200px]">
                    <img className="h-full w-[150px] min-w-[150px] flex items-center" src="/logo.svg" alt=""></img>
                </div>
                <div className="flex">
                    <div onClick={() => onOpen("createServer")}>
                        <Button className="#52cbb6 border-2 border-teal-300 text-teal-300" size="icon">
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
                            <Button className="overflow-hidden text-lg font-bold" size="icon" variant="serverLink">
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
                <Button
                    onClick={ onClickRequest }
                    className="w-[80px] h-[30px] bg-yellow-400 hover:bg-yellow-500 font-bold"
                >
                    친구요청
                </Button>
                <div style={onRequest ? {width:"400px", height:"500px", top:"33%" ,left:"87%", border:"1px solid black", background:"whitesmoke", transform: "translate(-50%, -50%)", position: "absolute", overflow: "auto", zIndex:"1"} : {display : "none"}}>
                    <div style={{width: "395px", height:"50px", alignItems:"center", display:"flex"}}>
                        {FriendData.length > 0 && FriendData.map(friend =>(
                            <>
                                <div style={{margin:"0px 20px"}}>
                                    {friend.name}
                                </div>
                                <div>
                                    {friend.userEmail}
                                </div>
                                <button onClick={() => onClickApproval({friendId: friend.userId})} style={{margin:"0px 0px 0px auto"}}>
                                    수락
                                </button>
                                <button onClick={() => onClickRefusal({friendId: friend.userId})}style={{margin:"0px 20px"}}>
                                    삭제
                                </button>
                            </>
                        ))}
                    </div>
                </div>
                <div
                    style={{ cursor: "pointer" }}
                    className="h-8 w-8 md:h-8 md:w-8 mr-2"
                    onClick={() => onOpen("members")}
                >
                    {data.userImgPath ? <UserAvatar src={data.userImgPath} />  : <UserAvatar src={imageUrl} />}
                </div>
                <div onClick={onClickTest} style={{ margin: "0px 20px 0px 10px" }} className="text-zinc-300">{data.nickname}</div>
                <Button onClick={() => onOpen("logout")} className="w-[80px] h-[30px] bg-[#51CBB6] hover:bg-[#45B2A5] font-bold">
                    로그아웃
                </Button>
            </header>
        </>
    );
}

export { Header };

