// Friends.js
import { Switch } from "@headlessui/react";
import axios from "axios";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { callGetFriend } from "src/api/MainAPICalls";
import { useModal } from "src/components/hooks/use-modal";
import { useUrlQuery } from "src/components/hooks/use-url-query";
import './css/Friends.css';

function Friends() {
  const [accessUser, setAccessUser] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { onOpen, isOpen } = useModal()
  const query = useUrlQuery()
  const serverId = query.get("server")
  const dispatch =  useDispatch()
  const data = useSelector(state => state.friendReducer);
    const [enabled, setEnabled] = useState(false); // 채팅번역 기능


  // 서버 초대된 유저 리스트
  useEffect(() => {
      axios.get(`${process.env.REACT_APP_API_URL}/server/access/${serverId}`)
          .then(response => {
              setAccessUser(Array.isArray(response.data) ? response.data : []);
          })
  }, [serverId]);


    useEffect(() => {
        // Mock data
        dispatch(callGetFriend());
    }, []);

  const handleFriendClick = (friend) => {
    setSelectedFriend(friend);
  };

  const handleInviteClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  return (
    <div className="friends-container scrollbar-hidden">
        <div style={{display:"flex"}} className="text-zinc-300 gap-5">
            { enabled ?
                <h2>서버 접속자</h2>:
                <h2>친구 목록</h2>
            }
            <Switch
                id={"airplane-mode"}
                checked={enabled}
                onClick={() => {
                    setEnabled((prev) => !prev);
                }}
                className={`${
                    enabled ? "bg-yellow-400 mr-1" : "bg-gray-400 mr-1"
                } relative inline-flex h-[25px] w-[50px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
            >
                <span className="sr-only">Use setting</span>
                <span
                    aria-hidden="true"
                    className={`${
                        enabled ? "translate-x-6" : "translate-x-0"
                    } pointer-events-none inline-block h-[21px] w-[21px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                />
            </Switch>
        </div>
        { enabled ? <ul className="access-list">
            {accessUser.map((user) => (
                <li
                    key={user.id}
                    className={user === selectedFriend ? 'selected-friend' : ''}
                    onClick={() => handleFriendClick(user)}
                >
                    {user.nickname} ({user.userEmail})
                </li>
            ))}
        </ul> :
        <ul className="friends-list">
            {data && data.length > 0 && data.map((friend) => (
            <li
                key={friend.userId}
                className={friend === selectedFriend ? 'selected-friend' : ''}
                onClick={() => handleFriendClick(friend)}
            >
                {friend.nickname}
            </li>
            ))}
        </ul>
        }

      
    </div>
  );
}

export default Friends;
