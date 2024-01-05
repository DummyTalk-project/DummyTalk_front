import axios from "axios";
import {useEffect, useState} from "react";
import {useUrlQuery} from "src/components/hooks/use-url-query";


const SummaryComponent = () => {
    const [summaries, setSummaries] = useState([]); // 요약 데이터 상태
    const query = useUrlQuery()
    const channelId = query.get("channel")

    // 요약 파일 목록을 가져오는 함수
    const fetchSummaryFiles = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_FASTAPI_URL}/${channelId}/summaryFile`
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
    }, [channelId])


    return (
        <div className="w-full">
            {/* 요약  */}
            <div id="summary-display">
                <h2 className="text-white text-center text-lg">요약 목록</h2>
                <div className="text-teal-300">Click Download!!</div>
                <ul>
                    {summaries.map((summary) => (
                        <li className="text-white bg-blue-1000 font-bold text-lg mt-5 " key={summary.summary_id}> -> {summary.summary_text}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default SummaryComponent;