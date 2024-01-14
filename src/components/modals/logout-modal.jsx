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
import { useNavigate } from "react-router-dom";

function LogOutModal() {
  const { isOpen, onClose, type } = useModal();

  const isModalOpen = isOpen && type === "logout";

  const navigate = useNavigate();

  const onClickLogout = () => {
    alert("로그아웃이 되었습니다~");
    window.localStorage.removeItem("accessToken");
    navigate("/");
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0A192E] text-white overflow-hidden">
        <DialogHeader className="px-6 flex flex-col">
          <DialogTitle className="text-2xl text-center font-bold">
            로그아웃
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            정말로 로그아웃하시겠어요?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-10 sm:justify-center">
          <Button
            onClick={onClose}
            className="border-none bg-[#204771] text-white hover:bg-teal-500 font-bold"
          >
            취소
          </Button>
          <Button
            onClick={onClickLogout}
            className="bg-white text-[#204771] border-none font-bold"
          >
            로그아웃
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default LogOutModal;
