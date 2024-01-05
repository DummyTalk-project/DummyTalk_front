import {Button} from "src/components/ui/button";
import {Search} from "lucide-react";
import {useRef, useState} from "react";
import axios from "axios";
import {useUrlQuery} from "src/components/hooks/use-url-query";


const TextSearchComponent = () => {
    const [searchText, setSearchText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [updateData, setUpdateData] = useState([]);
    const query = useUrlQuery()
    const channelId = query.get("channel")
    const topRef = useRef()


    const textSearchRequest = async () => {
        console.log("searchQuery", searchQuery);
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_FASTAPI_URL}/api/search/text/${channelId}/${searchQuery}`// FastAPI 엔드포인트로 변경
            );
            console.log("Response from FastAPI: ", response);
            if (response.status === 200) {
                setUpdateData(response.data.chat); // 데이터 설정
                setSearchQuery(""); // 검색창 초기화
            }
        } catch (error) {
            console.error("Error in fetching data", error);
        }
    }
    const enter_event = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            textSearchRequest();
        }
    };

    return (
        <>
            <div className="relative h-10 w-full">
                <input
                    type="text"
                    value={searchQuery}
                    onKeyDown={enter_event}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="검색어를 입력하세요."
                    className="text-amber-50 border-2 border-[#8F969F] rounded-md p-2 mb-10 mx-5 w-[90%] bg-[#1C2835] bg-opacity-[10] bg-right-8 bg-center bg-no-repeat bg-contain"
                    ref={topRef}
                />
                <Button
                    className="text-[#8F969F] border-none absolute right-[5%] bottom-[10%] top-[5%]"
                    onClick={textSearchRequest}
                >
                    <Search/>
                </ Button>
            </div>
            <div className="pt-6 text-amber-400 px-4 py-3 flex flex-col items-end w-full ">
                {updateData && updateData.map((chat) => (
                    <div className="mb-1 rounded-[3px] bg-[#b5bac1] bg-opacity-10 ounded-[3px] flex flex-col w-full  px-4 py-2 bg-black/5 mt-1 transition hover:bg-gray-200 hover:bg-opacity-10">
                        <div className="flex items-end gap-x-2 text-sm text-[#B5BAC1] w-full">
                            <div className={"flex items-center"}>
                                <span className="font-semibold mr-2 ">{chat.nickname}</span>
                            </div>
                            <span className="text-xs">{chat.createdAt}</span>
                        </div>
                        <div className="text-[#DBDEE1] py-1 text-sm font-semibold border-amber-200 w-full">
                            <span>{chat.message}</span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default TextSearchComponent;