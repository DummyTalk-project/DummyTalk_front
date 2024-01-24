import axios from "axios";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useModal} from "src/components/hooks/use-modal";
import {Label} from "src/components/ui/label";
import {decodeJwt} from "src/lib/tokenUtils";
import {useSocket} from "../hooks/use-socket";
import {Loader, Loader2} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "src/components/ui/dialog";

const ImageSendModal = () => {
    const [enabled, setEnabled] = useState(false);
    const {data, isOpen, onClose, type} = useModal();
    const {channelId, socket, isConnected} = data
    const isModalOpen = isOpen && type === "imageSend";
    const accessToken = localStorage.getItem("accessToken");
    const {sub, nickname} = useMemo(() => decodeJwt(accessToken), [accessToken]);
    const fileInput = useRef();
    const [showImages, setShowImages] = useState([]);
    const [response, setResponse] = useState([]);


    const onCloseHandler = () => {
        onClose();
        fileInput.current.value = "";
        setShowImages([]);
    }


    const handleAddImage = (e) => {

        if (fileInput.current && fileInput.current.files) {
            let showImgList = [...showImages];

            // 10개 이상의 파일은 업로드 불가
            for (let i = 0; i < e.target.files.length; i++) {
                showImgList.push(URL.createObjectURL(e.target.files[i]));   // 요것이 문제 !!
            }

            if (showImgList.length > 10) {
                showImgList = showImgList.slice(0, 10);
            }
            setShowImages(showImgList);
        }
    };

    const onSubmit = async (enabled) => {

        try {

            if (fileInput.current && fileInput.current.files.length > 0) {
                const files = fileInput.current.files;

                const formData = new FormData();
                formData.append("userId", sub);
                formData.append("nickname", nickname);
                formData.append("channelId", channelId);

                for (let i = 0; i < files.length; i++) {
                    formData.append("fileInfo", files[i]);
                }

                setEnabled(enabled);

                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/img/save`,
                    formData,
                    {"Content-Type": "multipart/form-data"}
                );

                if (response?.status === 200) {
                    if (!isConnected || !response) return;

                    response.data.data.map((chat) => (
                        socket.send(`/app/${channelId}/message`
                            , JSON.stringify({
                                sender: {
                                    userId: sub
                                },
                                chatId: chat.chatId,
                                channelId: channelId,
                                nickname: chat.nickname,
                                message: chat.message,
                                timestamp: chat.timestamp,
                                type: chat.type,
                                profileImage: chat.profileImage
                            })
                        )
                    ));
                }

                setShowImages([]);
                fileInput.current.value = "";

                setEnabled(false);

                onClose();
            }
        } catch (error) {
            console.error("업로드 실패:", error);
        }
    };

    return (
        <Dialog
            open={isModalOpen}
            onOpenChange={onCloseHandler}
        >
            <DialogContent className="text-zinc-400 rounded-2xl bg-[#0A192E] flex flex-col items-center">
                <DialogHeader className="text-zinc-300 float-right text-2xl font-extrabold">
                    <DialogTitle className="text-center my-5">파일 선택하기</DialogTitle>
                </DialogHeader>
                <label
                    htmlFor="image_files"
                    className="h-12 w-48 rounded flex items-center justify-center my-5 hover:text-teal-300 border-[1.5px] border-dashed"
                >
                        파일 선택
                </label>
                <input
                    type="file"
                    id="image_files"
                    name="image_files"
                    ref={fileInput}
                    onChange={handleAddImage}
                    className="my-2"
                    multiple={true}
                    hidden={true}
                />
                <Label className="place-self-auto">사진 전송 10개 이하</Label>
                <div className="w-100 h-100 grid grid-cols-4 gap-4 ">
                    {showImages.map((image, id) => (
                        <img
                            // 이미지 2x5로 나열 크기 고정
                            key={id}
                            src={image}
                            alt={`${image}-${id}`}
                            className="w-full h-full object-cover object-center rounded-md"
                        />
                    ))}
                </div>
                {!enabled ?
                    <button
                        type="submit"
                        onClick={() => onSubmit(true)}
                        className="w-full h-auto p-1 my-2 bg-[#204771] text-white border-none rounded-md cursor-pointer"
                    > 전송 </button>
                    :
                    <button type="button"
                            className="pl-[180px] rounded-[3px] flex flex-row items-center w-full h-8 bg-indigo-500 hover:"
                            disabled>
                        <svg className="animate-spin h-6 mr-3 text-amber-50" viewBox="0 0 24 24">
                            <Loader2/>
                        </svg>
                        <a className={"text-white"}>전송중...</a>
                    </button>
                }
            </DialogContent>
        </Dialog>
    );
};

export default ImageSendModal;
