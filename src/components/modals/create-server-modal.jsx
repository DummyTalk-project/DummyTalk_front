import axios from "axios";
import {useMemo, useRef, useState} from "react";
import { useModal } from "src/components/hooks/use-modal";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { useNavigate } from "react-router-dom";
import { decodeJwt } from "src/lib/tokenUtils";

function CreateServerModal() {
    const navigate = useNavigate();
    const { isOpen, onClose, type } = useModal();
    const [serverName, setServerName] = useState(""); // 서버 이름 상태
    const isModalOpen = isOpen && type === "createServer";
    const accessToken = localStorage.getItem("accessToken");
    const userInfo = useMemo(() => decodeJwt(accessToken), [accessToken]);
    const userName = userInfo.userName;
    const fileInputRef = useRef();
    const userId = userInfo.sub;


    const handleCreateServer = async () => {
        const formData = new FormData();
        formData.append("serverName", serverName);
        formData.append("userName", userName);
        formData.append("userId", userId);
        if (fileInputRef.current && fileInputRef.current.files[0]) {
            formData.append("file", fileInputRef.current.files[0]);
        }

        try {
            const {
                data: { data },
            } = await axios.post(
                `${process.env.REACT_APP_API_URL}/server/writePro`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const serverId = data.id;
            navigate(`/main?server=${serverId}`, {
                replace: true,
                state: serverId,
            });
        } catch (error) {
            console.error("서버 생성 실패: ", error);
        } finally {
            onClose();
        }
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
                            서버 생성하기
                        </DialogTitle>
                        <DialogDescription className="text-center text-zinc-500 ">
                            새로운 서버에서 사용할 이름과 <br /> 아이콘을
                            설정해주세요
                        </DialogDescription>
                    </DialogHeader>
                    <div className="gap-1 flex flex-col p-6">
                        <label
                            htmlFor="file"
                            className="flex justify-center"
                        >
                            <img src="./image_29.png"></img>
                        </label>
                        <input
                            hidden
                            type="file"
                            id="file"
                            ref={fileInputRef}
                        />

                        <div className="font-semibold text-white text-left p-2">
                            서버 이름
                        </div>
                        <input
                            className="bg-[#1C2835] border-2 border-zinc-400 rounded-lg p-2 w-full"
                            type="text"
                            placeholder={"서버이름을 입력하세요."}
                            value={serverName}
                            onChange={(e) => setServerName(e.target.value)}
                        />
                    </div>
                    <DialogFooter className="gap-5 sm:justify-center">
                        <Button
                            onClick={handleCreateServer}
                            className="border-none bg-[#204771] text-white hover:bg-teal-500 font-bold"
                        >
                            생성
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

export default CreateServerModal;
