import axios from "axios";
import {useEffect, useState} from "react";
import {useUrlQuery} from "src/components/hooks/use-url-query";


const SummaryComponent = () => {
    const [summaries, setSummaries] = useState([]); // 요약 데이터 상태
    const query = useUrlQuery();
    const channelId = query.get("channel");

    // 요약 파일 목록을 가져오는 함수
    const fetchSummaryFiles = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_FASTAPI_URL}/api/summary/${channelId}/summaryFile`
            );
            const summaryData = response.data;
            console.error("요약 파일 목록 불러오기 성공: ", summaryData);
            setSummaries(summaryData); // 요약 데이터 상태 업데이트
        } catch (error) {
            console.error("요약 파일 목록 불러오기 실패: ", error);
        }
    };

    useEffect(() => {
        if (!channelId) return null;
        fetchSummaryFiles();
    }, [channelId]);

    return (
        <div className="w-full">
            {/* 요약 목록 */}
            <div id="summary-display">
{/*
                <h2 className="text-white text-center text-lg">요약 목록</h2>
*/}
        <ul>
            {summaries.map((summary) => (
            <li className="bg-blue-1000 text-lg mt-5 ml-4 mr-4 text-zinc-100 " key={summary.summary_id}>
             {summary.summary_text}
            </li>
        ))}
        </ul>
            </div>
            {/* 큰 사각형 */}
            {/* <div style={{ backgroundColor: "#2D4058", width: "100%", height: "600px", marginTop: "20px" }}> */}
            </div>
       
    );
}

export default SummaryComponent;