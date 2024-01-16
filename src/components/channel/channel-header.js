import {
    ChevronDown,
    LogOut,
    PlusCircle,
    Settings,
    TrashIcon,
    UserPlus,
    Users,
} from "lucide-react";
import { decodeJwt } from "src/lib/tokenUtils";
import { useModal } from "../hooks/use-modal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import axios from "axios";
import {useMemo, useState} from "react";

const ChannelHeader = ({ server }) => {
    const { isOpen, onClose, type, data, onOpen } = useModal();
    const accessToken = localStorage.getItem("accessToken");
    const userInfo = decodeJwt(accessToken);
    const ADMIN = server.userId.toString()

    const [resignUser, setReSignUser] = useState('');
    const userId = userInfo.sub;

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/server/delete?id=${server.id}&userId=${userId}`);
            onClose();
        } catch (error) {
            console.error('서버 삭제 실패:', error);
        }
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                asChild
                className="focus:outline-none"
            >
                <button className="w-full h-[60px] text-md text-zinc-400 font-semibold px-3 flex items-center border-b-[1px] border-black hover:bg-zinc-700/10 transition">
                    {server.serverName}
                    <ChevronDown className="h-5 w-5 ml-auto" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 text-xs font-medium text-neutral-400 space-y-[2px] bg-[#112033]">
                <DropdownMenuItem
                    onClick={() => onOpen("invitedUser")}
                    className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
                >
                    초대 / 강퇴
                    <UserPlus className="h-4 w-4 ml-auto" />
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => onOpen("settings")}
                    className="px-3 py-2 text-sm cursor-pointer"
                >
                    서버 수정
                    <Settings className="h-4 w-4 ml-auto" />
                </DropdownMenuItem>

                {userInfo.sub === ADMIN && (
                <DropdownMenuItem
                    onClick={() =>
                        onOpen("createChannel", { serverId: server.id })
                    }
                    className="px-3 py-2 text-sm cursor-pointer"
                >
                    채널 생성
                    <PlusCircle className="h-4 w-4 ml-auto" />
                </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {userInfo.sub === ADMIN && (
                    <DropdownMenuItem
                        // onClick={() => onOpen("deleteServer")}
                        onClick={handleDelete}
                        className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
                    >
                        서버 삭제
                        <TrashIcon className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {userInfo.sub !== ADMIN && (
                    <DropdownMenuItem
                        onClick={() => onOpen("leaveServer")}
                        className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
                    >
                        서버 나가기
                        <LogOut className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
export default ChannelHeader;
