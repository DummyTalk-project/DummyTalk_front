import { useEffect, useState } from "react";
import FriendsModal from "src/components/modals/FriendsModal";
import CreateChannelModal from "src/components/modals/create-channel-modal";
import CreateServerModal from "src/components/modals/create-server-modal";
import LogOutModal from "src/components/modals/logout-modal";
import SettingsModal from "src/components/modals/settings-modal";
import UserModal from "src/components/modals/user-modal";
import ImageSendModal from "src/components/modals/image-send-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)
    
    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) {
        return null;
    }
    
    return (
        <>
            <UserModal />
            <LogOutModal />
            <SettingsModal />
            <CreateChannelModal />
            <CreateServerModal />
            <FriendsModal />
            <ImageSendModal />
        </>
    )
}