import { useModal } from "../../components/hooks/use-modal";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "src/components/ui/dialog";
import { Button } from "../../components/ui/button";
import {useEffect, useState} from "react";
import { useDispatch } from "react-redux";
import {callGetFriendRequest, callPostFriend} from "../../api/MainAPICalls";
import {useSocket} from "src/components/hooks/use-socket";
import {jwtDecode} from "jwt-decode";

import axios from "axios";


const AddFriendModal = () => {

    const [email, setEmail] = useState("");
    const { isOpen, onOpen, onClose, type, data } = useModal();
    const dispatch = useDispatch();

    const { socket, isConnected } = useSocket();
    const isModalOpen = isOpen && type === "addFriend";

    const accessToken = window.localStorage.getItem('accessToken');
    const decodedToken = accessToken ? jwtDecode(accessToken) : null;


    useEffect(() => {
        if (!isConnected ) return;
        socket.subscribe(`/topic/friend`, (msg) => {
            dispatch(callGetFriendRequest())
            }
        );
        socket.subscribe(`/topic/friend/${decodedToken.sub}`, (msg) => {
            alert(msg.body)
            }
        );

    }, [isConnected]);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const onClickAddFriend = () => {
        // dispatch(
        //     callPostFriend({
        //         email: email,
        //     })
        // );
        socket.send(`/app/friend/${decodedToken.sub}`, JSON.stringify({email : email}), {})
        onClose();
    };

    return (
        <Dialog
            open={isModalOpen}
            onOpenChange={onClose}
        >
            <DialogContent className="bg-[#0A192E] text-white overflow-hidden w-[480px]">
                <DialogHeader className="px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        친구추가
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        이메일을 입력하여 상대방을 친구 목록에 추가할 수 있습니다!
                    </DialogDescription>
                </DialogHeader>
                {/* 정보 수정*/}
                <div className="gap-1 flex flex-col p-6 mt-[-15px]">
                    <input
                        onChange={handleEmailChange}
                        className="bg-[#1C2835] border-2 border-zinc-400 rounded-lg p-2 w-full"
                        placeholder={ "이메일을 입력해주세요"}
                    />
                </div>
                <DialogFooter className="gap-10 sm:justify-center mt-[-15px]">
                    <Button
                        onClick={onClickAddFriend}
                        className="border-none bg-[#204771] text-white hover:bg-teal-500 font-bold"
                    >
                        추가
                    </Button>
                    <Button
                        onClick={onClose}
                        className="bg-white text-[#204771] border-none font-bold"
                    >
                        취소
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddFriendModal;
