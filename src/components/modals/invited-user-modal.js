import axios from "axios";
import {useMemo, useState} from 'react';
import {useModal} from "src/components/hooks/use-modal";
import {Ban, ChevronDown, LogOut, PlusCircle, Settings, TrashIcon, UserPlus, Users} from "lucide-react";
import { decodeJwt } from "src/lib/tokenUtils";
import { useUrlQuery } from 'src/components/hooks/use-url-query';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";



function InvitedUserModal() {
    const accessToken = localStorage.getItem("accessToken");
    const userInfo = useMemo(() => decodeJwt(accessToken), [accessToken]);
    const [userEmail, setUserEmail] = useState('');
    const [resignUserEmail, setResignUserEmail] = useState('');
    const {isOpen, onClose, type, data} = useModal();
    const { serverId } = data
    const userId = userInfo.sub;    const query = useUrlQuery();
    const serverIds = query.get("server");



    const isModalOpen = isOpen && type === "invitedUser";

    const handleInviteUser = async () => {
        if (userEmail) {
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/server/invitedUser`, {
                    userEmail: userEmail,
                    serverId: serverIds
                });
                // 초대 성공 후 처리 로직
                onClose();
            } catch (error) {
                console.error('초대 실패:', error);
                // 초대 실패 처리 로직
            }
        }
    };

    const handleKickUser = async () => {
        if (resignUserEmail) {
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/server/resignUser/${serverIds}`, {
                    userEmail: resignUserEmail,
                    userId:userId
                });
                // 강퇴 성공 후 처리 로직
                onClose();

            } catch (error) {
                console.error('강퇴 실패:', error);
                // 강퇴 실패 처리 로직
            }
            console.log("강퇴 >>>>> ","강퇴할email : ",resignUserEmail,"강퇴하는 사람의 Id", userId,"서버의 Id",serverId )
        }
    };

    const modalStyle = {
        display: isModalOpen ? 'block' : 'none',
    };

    return (



         <Dialog
                open={isModalOpen}
                onOpenChange={onClose}
            >
                <DialogContent className="bg-[#0A192E] text-white overflow-hidden">

                    <DialogHeader className="px-6">
                        <DialogTitle className="text-2xl text-white text-center font-bold">
                            초대 / 강퇴
                        </DialogTitle>

                        <DialogDescription className="text-center text-zinc-500 ">
                            서버에 초대할 유저의 이메일을 입력하세요.
                        </DialogDescription>


                        <input
                            className="bg-[#1C2835] border-2 border-zinc-400 rounded-lg p-2 w-full"
                            type="text"
                            placeholder={"User Email"}
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                        />

                         <button className="px-4 py-2 bg-[#204771] text-white rounded-lg" onClick={handleInviteUser}>
                            사용자 초대
                        </button>

                         <DialogDescription className="text-center text-zinc-500 pt-4 ">
                            서버에 강퇴할 유저의 이메일을 입력하세요.
                         </DialogDescription>

                          <input
                            className="bg-[#1C2835] border-2 border-zinc-400 rounded-lg p-2 w-full"
                            type="text"
                            placeholder={"User Email"}
                            value={resignUserEmail}
                            onChange={(e) => setResignUserEmail(e.target.value)}
                        />

                        <button className="px-4 py-2 font-semibold bg-white text-[#1C2835] rounded-lg" onClick={handleKickUser}>
                             사용자 강퇴
                        </button>
                    </DialogHeader>


                </DialogContent>
            </Dialog>





    );
}

export default InvitedUserModal;