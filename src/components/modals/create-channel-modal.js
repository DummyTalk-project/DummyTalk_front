import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "src/components/hooks/use-modal";
import { useServerData } from "../hooks/use-server-data";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import "./css/ChannelModal.css";

const CreateChannelModal = () => {
    const navigate = useNavigate();
    const { data, isOpen, onClose, type } = useModal();
    const { updateChannelListData } = useServerData()
    const { serverId } = data;
    const isModalOpen = isOpen && type === "createChannel";
    const [channelName, setChannelName] = useState("");

    const handleInputChange = (e) => {
        setChannelName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/channel/writePro1`,
                formData
            );

            updateChannelListData(response.data)
            setChannelName('')
            onClose();
        } catch (error) {
            console.log("채널 생성 실패");
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
                        <DialogTitle className="text-2xl text-center font-bold">
                            채널 생성
                        </DialogTitle>
                        <DialogDescription className="text-center text-zinc-500 ">
                            새로운 채널에서 사용할 이름과 <br /> 형식을
                            설정해주세요
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        className="gap-1 flex flex-col p-6"
                        onSubmit={handleSubmit}
                    >
                        <label
                            htmlFor="channelName"
                            className="font-semibold text-zinc-400 text-left p-2"
                        >
                            채널 이름
                        </label>
                        <input
                            id="channelName"
                            name="channelName"
                            className="bg-[#1C2835] border-2 border-zinc-400 rounded-lg p-2 w-full"
                            type="text"
                            value={channelName}
                            placeholder={"채널 이름을 입력해주세요."}
                            onChange={handleInputChange}
                        />
                        <br />

                        <div className="font-semibold text-zinc-400 text-left p-2">형식</div>
                        <select
                            name="channelType"
                            className="bg-[#1C2835] border-2 border-zinc-400 rounded-lg p-2 w-full"
                            defaultValue="TEXT"
                        >
                            <option value="TEXT">텍스트</option>
                            <option value="VOICE">1대1 음성</option>
                        </select>
                        <input type="hidden" name="serverId" value={serverId} />
                        <br />

                        <DialogFooter className="sm:justify-center gap-10">

                            <Button className="bg-[#204771] text-white hover:bg-indigo-500/90">
                                생성
                            </Button>

                            <Button
                                onClick={onClose}
                                className="bg-white text-[#1C2835] hover:bg-teal-700 font-bold"
                            >
                                취소
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CreateChannelModal;
