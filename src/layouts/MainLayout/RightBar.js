import {useEffect, useRef, useState} from "react";
import {useUrlQuery} from "src/components/hooks/use-url-query";
import CellComponent from "src/layouts/RightSide/component/CellComponent";
import TextSearchComponent from "src/layouts/RightSide/component/text-search-component";
import SummaryComponent from "src/layouts/RightSide/component/summary-component";
import {useSocket} from "src/components/hooks/use-socket";

const RightBar = () => {
    const [activeTab, setActiveTab] = useState('image');

    const tabStyle = {
        borderColor: '#52CBB6',
        borderBottom: '2px solid #52CBB6',
        color: 'white',
        padding: '5px 10px',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        border: 'none',
        outline: 'none'
    };

    const activeTabStyle = {
        ...tabStyle,
        borderBottom: '4px solid #52CBB6'
    };

    const TabContent = () => {
        switch (activeTab) {
            case 'image':
                return <CellComponent />;
            case 'text':
                return <TextSearchComponent />;
            case 'summary':
                return <SummaryComponent />;
            default:
                return null;
        }
    };

    return (
        <div className="h-full w-[45%] flex flex-col">
            <div className="h-[60px] min-h-[60px] w-full font-bold text-md flex pl-5 items-center border-b-[1px] border-black justify-between text-zinc-400 bg-[your-color]">
                <div>보관함</div>
            </div>
            <div className="flex justify-center items-center mt-2">
                <button style={activeTab === 'image' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('image')}>
                    이미지
                </button>
                <button style={activeTab === 'text' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('text')}>
                    텍스트
                </button>
                <button style={activeTab === 'summary' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('summary')}>
                    요약
                </button>
            </div>
            <div className="w-full flex-grow mt-5 overflow-y-auto scrollbar-hidden relative">
                <TabContent />
            </div>
        </div>
    );
};

export default RightBar;