import { useModal } from "src/components/hooks/use-modal";
import { Button } from "src/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "src/components/ui/dialog";

function UserModal() {
    const { isOpen, onOpen, onClose, type, data } = useModal();

    const isModalOpen = isOpen && type === "members";

    return (
        <Dialog
            open={isModalOpen}
            onOpenChange={onClose}
        >
            <DialogContent className="bg-white text-black overflow-hidden">
                <DialogHeader className="px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        회원정보 수정
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        <div className='flex gap-1 justify-between'>
                            {/* 정보 수정*/}
                            <div className="flex flex-col gap-2 w-4/5 justify-between items-center">
                                <input
                                    type={"text"}
                                    placeholder={"변경할 닉네임"}
                                    
                                />
                                <input
                                    type={"text"}
                                    placeholder={"변경할 비밀번호"}
                                />
                                <input
                                    type={"text"}
                                    placeholder={"변경할 비밀번호 확인"}
                                />
                                <select
                                    placeholder={"국가선택"}
                                    className="pl-1 border border-[#F1F1F1] w-[250px] h-[30px]  rounded-md"
                                >
                                    <option
                                        value="국가선택"
                                        disabled
                                        selected
                                        hidden
                                    >
                                        국가선택
                                    </option>
                                    <option value="국가1">국가1</option>
                                    <option value="국가2">국가2</option>
                                    <option value="국가3">국가3</option>
                                </select>
                            </div>
                            {/* 이미지 등록 및 확인 버튼*/}
                            <div className='flex flex-col justify-between'>
                                <img src="./image 29.png"></img>
                                <Button className='hover:bg-amber-500 bg-amber-400 font-semibold text-sm text-black'>
                                    수정
                                </Button>
                                <Button className='bg-red-400 hover:bg-red-500 font-semibold text-sm text-black' onClick={onClose}>
                                    취소
                                </Button>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default UserModal;
