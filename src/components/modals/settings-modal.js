import axios from 'axios';
import {useMemo, useState} from 'react';
import {useModal} from "src/components/hooks/use-modal";
import "./css/SettingsModal.css";
import {decodeJwt} from "src/lib/tokenUtils";
import {useUrlQuery} from "src/components/hooks/use-url-query";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

const SettingsModal = () => {
    const {isOpen, onClose, type, data} = useModal();
    const [newServerName, setNewServerName] = useState('');
    const [imgFile, setImgFile] = useState(null);
    const [invitedUser, setInvitedUser] = useState('');
    const [resignUser, setReSignUser] = useState('');
    const accessToken = localStorage.getItem("accessToken");
    const userInfo = useMemo(() => decodeJwt(accessToken), [accessToken]);
    const userId = userInfo.sub;
    const query = useUrlQuery();
    const serverId = query.get("server");

    const isModalOpen = isOpen && type === "settings";


    const handleServerNameChange = (e) => {
        setNewServerName(e.target.value);
    };

    const handleImgChange = (e) => {
        setImgFile(e.target.files[0]);
    };


    const handleSaveSettings = async () => {
        const formData = new FormData();
        if (newServerName) formData.append('serverName', newServerName);
        if (imgFile) formData.append('imgFile', imgFile);
        if (invitedUser) formData.append('invitedUser', invitedUser);
        if (resignUser) formData.append('resignUser', resignUser);
        if (serverId) formData.append("serverId", serverId)
        if (userId) formData.append("userId", userId)

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/server/setting?id=${serverId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                data: formData
            });
        } catch (error) {
            console.error('서버 수정 실패:', error);
        }
        resetForm();
        onClose();
    };

    // const handleDelete = async () => {
    //   try {
    //     const response = await axios.delete(`${process.env.REACT_APP_API_URL}/server/delete?id=${serverId}&userId=${userId}`);
    //     onClose();
    //   } catch (error) {
    //     console.error('서버 삭제 실패:', error);
    //   }
    // };

    const resetForm = () => {
        setNewServerName('');
        setImgFile('');
        setInvitedUser('');
        setReSignUser('');
    };

    const modalStyle = {
        display: isModalOpen ? 'block' : 'none',
    };

    return (

        <>
            <Dialog
                open={isModalOpen}
                onOpenChange={onClose}
            >
                <DialogContent className="bg-[#0A192E] text-white overflow-hidden">
                    <DialogHeader className="px-6">
                        <DialogTitle className="text-2xl text-white text-center font-bold">
                            서버 수정
                        </DialogTitle>
                        <DialogDescription className="text-center text-zinc-500 ">
                            새로운 서버의 이름을 입력해주세요.
                        </DialogDescription>

                    </DialogHeader>
                    <div className="font-semibold text-white text-left p-2">
                        서버 이름 변경
                    </div>
                    <input
                        className="bg-[#1C2835] border-2 border-zinc-400 rounded-lg p-2 w-full"
                        type="text"
                        placeholder={"서버이름을 입력하세요."}
                        value={newServerName}
                        onChange={handleServerNameChange}
                    />

                    <DialogFooter className="gap-5 sm:justify-center">

                        <Button
                            onClick={handleSaveSettings}
                            className="border-none bg-[#204771] text-white hover:bg-teal-500 font-bold"
                        >
                            확인
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
        </>

    );
}

export default SettingsModal;
