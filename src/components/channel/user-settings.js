// src/layouts/LeftSide/Settings.js

import { Headphones, Mic, MicOff, Settings } from "lucide-react";
import { useSelector } from "react-redux";
import { Button } from "src/components/ui/button";
import { ReactComponent as HeadphonesOff } from "./headphones-off.svg";
import "../../components/modals/VideoModal.css";
import { useModal } from "../hooks/use-modal"; // Update the path
import { UserAvatar } from "../user-avatar";
import "./css/Settings.css";
import {User} from "lucide-react";

function UserSetting() {
    const { onOpen } = useModal();
    const { nickname, userImgPath } = useSelector((state) => state.userReducer);
    return (
        <div className="mt-auto h-[60px] w-full bg-[#141b24] flex items-center pl-2 gap-2">
            <div
                className="transition cursor-pointer hover:drop-shadow-md"
                onClick={() => onOpen("members")}
            >
                { userImgPath ?
                    <UserAvatar src={ userImgPath } />
                    :
                    <User className={"text-teal-300 border-none"}/>
                }
            </div>
            <div className="flex flex-col w-full">
                <div className="flex items-center justify-between">
                    <div className="flex items-center" onClick={() => onOpen("members")} >
                        <p className="text-sm font-semibold cursor-pointer text-zinc-400 hover:underline">
                            { nickname }
                        </p>
                    </div>
                    {/*<Mic className="text-teal-400 hover:text-teal-300" />*/}
                    {/*<MicOff className=" text-rose-500 hover:text-rose-400" />*/}
                    {/*<Headphones className="text-teal-400 hover:text-teal-300 " />*/}
                    {/*<HeadphonesOff className="w-6 h-6 text-rose-500 hover:text-rose-400" />*/}
                    <Button
                        className="text-teal-400 hover:text-teal-300"
                        variant="ghost"
                        size="icon"
                        onClick={() => onOpen("members")}
                    >
                        <Settings />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default UserSetting;
