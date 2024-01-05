import {useEffect, useRef, useState} from "react";
import {useUrlQuery} from "src/components/hooks/use-url-query";
import CellComponent from "src/layouts/RightSide/component/CellComponent";
import TextSearchComponent from "src/layouts/RightSide/component/text-search-component";
import SummaryComponent from "src/layouts/RightSide/component/summary-component";
import {useSocket} from "src/components/hooks/use-socket";


const RightBar = ({isOpen}) => {

    const bottomRef = useRef(null);
    const [summaries, setSummaries] = useState([]); // 요약 데이터 상태

    const [chose, setChose] = useState('image');

    const { socket } = useSocket()

    const components = {
        image: <CellComponent mponent />,
        text: <TextSearchComponent />,
        summary: <SummaryComponent />
    }

    // useEffect(() => {
    //     const topDiv = topRef?.current;
    //     const bottomDiv = bottomRef?.current;
    //
    //     const shouldAutoScroll = () => {
    //         if (!hasInitialized && bottomDiv) {
    //             setHasInitialized(true);
    //             return true;
    //         }
    //
    //         if (!topDiv) {
    //             return false;
    //         }
    //
    //         const distanceFromBottom =
    //             topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
    //         return distanceFromBottom <= 100;
    //     };
    //
    //     if (shouldAutoScroll()) {
    //         setTimeout(() => {
    //             bottomRef.current?.scrollIntoView({
    //                 behavior: "smooth",
    //             });
    //         }, 100);
    //     }
    // }, [topRef, hasInitialized]);
    //
    //
    // const imageSearchRequest = async () => {
    //     console.log("searchQuery", searchQuery);
    //
    //     try {
    //         const response = await axios.get(
    //             `http://localhost:8000/api/search/text/${channelId}/${searchQuery}`// FastAPI 엔드포인트로 변경
    //         );
    //         console.log("Response from FastAPI: ", response);
    //         if (response.status === 200) {
    //             setUpdateData(response.data.similar_images); // 데이터 설정
    //             setSearchQuery(""); // 검색창 초기화
    //         }
    //     } catch (error) {
    //         console.error("Error in fetching data", error);
    //     }
    // }
    //
    //
    // const enter_event = (e) => {
    //     if (e.key === "Enter" && !e.shiftKey) {
    //         e.preventDefault();
    //         imageSearchRequest();
    //     }
    // };

    return (
        <div className="h-full w-[45%] flex flex-col">
            <div
                className="h-[60px] min-h-[60px] w-full font-bold text-md flex pl-5 items-center border-b-[1px] border-black justify-between text-zinc-400 bg-[your-color]">
                <div>보관함</div>
            </div>
            <div className="flex justify-center items-center mt-2 ">
                <input
                    onClick={() => setChose("image")} type="radio" id={"image"} value="이미지" name="searchOption" defaultChecked={true}
                    className="mr-2"
                />
                <label className="mr-4 text-white" htmlFor="image">
                    이미지
                </label>
                <input
                    onClick={() => setChose("text")} type="radio" id={"text"} name="searchOption"
                    className="mr-2"
                />
                <label className="mr-4 text-white" htmlFor="text">
                    텍스트
                </label>

                <input onClick={() => setChose("summary")} type="radio" id={"summary"} value="요약" name="searchOption"
                       className="mr-2"/>
                <label style={{ color: "white" }} htmlFor="summary">
                    요약
                </label>
            </div>
            <div className="w-full flex-grow mt-5 overflow-y-auto scrollbar-hidden relative">
                {components[chose]}
            </div>
            <div ref={bottomRef}></div>
        </div>
    );
}

export default RightBar;