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
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    callGetFriendRequest,
    callGetNickname,
    callPostChageUser,
} from "src/api/MainAPICalls";

function UserModal() {
    const { isOpen, onOpen, onClose, type, data } = useModal();

    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [check, setCheck] = useState("");
    const [language, setLanguage] = useState("");
    const [equals, setEquals] = useState(true);
    const [pwValid, setPwValid] = useState(false);
    const [chValid, setChValid] = useState(false);
    const fileInputRef = useRef();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.userReducer);

    useEffect(() => {
        dispatch(callGetNickname());
    }, []);

    const isModalOpen = isOpen && type === "members";

    const onChangeNickname = (e) => {
        setNickname(e.target.value);
    };
    const onChangePassword = (e) => {
        setPassword(e.target.value);
        const regex =
            /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
        if (e.target.value == check) {
            setEquals(true);
        } else {
            setEquals(false);
        }
        if (regex.test(e.target.value)) {
            setPwValid(true);
        } else {
            setPwValid(false);
        }
    };
    const onChangeCheck = (e) => {
        setCheck(e.target.value);
        const regex =
            /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
        if (e.target.value == password) {
            setEquals(true);
        } else {
            setEquals(false);
        }
        if (regex.test(e.target.value)) {
            setChValid(true);
        } else {
            setChValid(false);
        }
    };

    const onChangeLanguage = (e) => {
        setLanguage(e.target.value);
    };

    const onClickChange = () => {
        if (equals == true && !password && !check) {
            const formData = new FormData();
            formData.append("nickname", nickname);
            formData.append("password", password);
            formData.append("language", language);
            if (fileInputRef.current && fileInputRef.current.files[0]) {
                formData.append("file", fileInputRef.current.files[0]);
            }
            dispatch(callPostChageUser(formData));
        } else if (
            (equals == false && !password == "") ||
            (!pwValid && password.length > 0) ||
            (!chValid && check.length > 0)
        ) {
            alert("비밀번호를 확인해주시길 바랍니다.");
        }
    };

    const onClickTet = () => {
        console.log(userData);
    };
    return (
        <Dialog
            open={isModalOpen}
            onOpenChange={onClose}
        >
            <DialogContent className="bg-[#0A192E] text-white overflow-hidden">
                <DialogHeader className="px-6">
                    <DialogTitle
                        onClick={onClickTet}
                        className="text-2xl text-center font-bold"
                    >
                        회원정보 수정
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500 ">
                        새롭게 변경하고 싶은 이름과 <br /> 아이콘을 설정해주세요
                    </DialogDescription>
                    <DialogDescription className="text-center text-zinc-500">
                        <div className="flex gap-1 justify-between items-center">
                            {/* 정보 수정*/}
                            <div className="flex flex-col gap-5 w-4/5 justify-between items-center">
                                <input
                                    onChange={onChangeNickname}
                                    value={nickname}
                                    type={"text"}
                                    placeholder={"변경할 닉네임"}
                                    className="bg-[#1C2835] border-2 border-zinc-400 rounded-lg p-2 w-full"
                                />
                                {!userData.credential && (
                                    <>
                                        <input
                                            onChange={onChangePassword}
                                            value={password}
                                            type={"password"}
                                            placeholder={"변경할 비밀번호"}
                                            className="bg-[#1C2835] border-2 border-zinc-400 rounded-lg p-2 w-full"
                                        />
                                        {!pwValid && password.length > 0 && (
                                            <div>
                                                영문, 숫자, 특수문자 포함 <br />{" "}
                                                8자 이상 입력해주세요.
                                            </div>
                                        )}
                                        <input
                                            onChange={onChangeCheck}
                                            value={check}
                                            type={"password"}
                                            placeholder={"변경할 비밀번호 확인"}
                                            className="bg-[#1C2835] border-2 border-zinc-400 rounded-lg p-2 w-full"
                                        />
                                    </>
                                )}
                                {/*{!chValid && check.length > 0 && <div>영문, 숫자, 특수문자 포함 <br/> 8자 이상 입력해주세요.</div>}*/}
                                <div
                                    style={
                                        check == ""
                                            ? { display: "none" }
                                            : { display: "block" }
                                    }
                                >
                                    {check && check == password ? (
                                        <div style={{ color: "green" }}>
                                            일치합니다
                                        </div>
                                    ) : (
                                        <div style={{ color: "red" }}>
                                            불일치합니다.
                                        </div>
                                    )}
                                </div>
                                <select
                                    placeholder={"언어선택"}
                                    className="pl-1 border border-[#F1F1F1] w-[250px] h-[30px]  rounded-md"
                                    onChange={onChangeLanguage}
                                    className="bg-[#1C2835] border-2 border-zinc-400 rounded-lg p-2 w-full"
                                >
                                    <option
                                        value="언어선택"
                                        disabled
                                        selected
                                        hidden
                                    >
                                        언어선택
                                    </option>
                                    <option value="kor_Hang">Korean</option>
                                    <option value="eng_Latn">English</option>
                                    <option value="jpn_Jpan">Japanese</option>
                                </select>
                            </div>
                            {/* 이미지 등록 및 확인 버튼*/}
                            <div className="flex flex-col justify-between ml-[20px]">
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
                                <Button
                                    onClick={onClickChange}
                                    className="border-none bg-[#204771] text-white hover:bg-teal-500 font-bold mt-4"
                                >
                                    수정
                                </Button>
                                <Button
                                    className="bg-white text-[#204771] border-none font-bold mt-3"
                                    onClick={onClose}
                                >
                                    취소
                                </Button>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default UserModal;
