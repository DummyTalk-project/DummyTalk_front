import axios from "axios";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useModal} from "src/components/hooks/use-modal";
import {Label} from "src/components/ui/label";
import {decodeJwt} from "src/lib/tokenUtils";
import {useSocket} from "../hooks/use-socket";
import {Loader, Loader2} from "lucide-react";

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
            const formData = new FormData();
            formData.append("userId", sub);
            formData.append("nickname", nickname);
            formData.append("channelId", channelId);

            if (fileInput.current && fileInput.current.files) {
                const files = fileInput.current.files;


                for (let i = 0; i < files.length; i++) {
                    formData.append("fileInfo", files[i]);
                }

                setEnabled(enabled);

                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/img/save`,
                    formData,
                    {"Content-Type": "multipart/form-data"}
                );

                console.log("업로드 성공:", response);

                if (response?.status === 200) {
                    if (!isConnected || !response) return;

                    response.data.data.map((chat) => (
                        socket.send(`/app/${channelId}/message`
                            , JSON.stringify({
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


    console.log(isConnected)
    return (
        <div
            className={`fixed top-0 left-0 w-full h-full ${
                isModalOpen ? "block" : "hidden"
            } bg-[rgba(0,0,0,0.4)] z-10`}
        >
            <div
                className="rounded-2xl bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-20 py-10 border-1 border-gray-800 w-1/2">
                <span
                    className="text-gray-700 float-right text-2xl font-extrabold cursor-pointer"
                    onClick={onCloseHandler}
                >
                    &times;
                </span>
                <h2 className="text-center my-5">파일 선택하기</h2>
                <label
                    htmlFor="image_files"
                    onChange={handleAddImage}
                    className="text-center my-5"
                >
                    <input
                        type="file"
                        id="image_files"
                        name="image_files"
                        ref={fileInput}
                        className="my-2"
                        multiple={true}
                    />
                </label>
                <Label className="">사진 전송 10개 이하</Label>
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
                { !enabled ?
                    <button
                        type="submit"
                        onClick={() => onSubmit(true)}
                        className="w-full h-auto p-1 my-2 bg-green-500 text-white border-none rounded-md cursor-pointer"
                    > 전송 </button>
                    :
                    <button type="button" className="flex fw-full h-5 bg-indigo-500 hover:" disabled>
                        <svg className="animate-spin h-full w-5 mr-3 text-amber-50" viewBox="0 0 24 24">
                            <Loader2 />
                        </svg>
                        <a>Processing...</a>
                    </button>}
            </div>
        </div>
    );
};

export default ImageSendModal;
