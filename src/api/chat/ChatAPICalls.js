import axios from "axios";
import {POST_REFUSAL} from "modules/MainModule";
import {callGetFriendRequest} from "api/MainAPICalls";


    // 메시지 리스트
const fetchChatData = async () => {
    // const { id } = useParams();

    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/channel/chat/1`);
        return response.data;
    }catch (error) {
        console.error("채팅 리스트 뽑아보기 에러", error);
    }
}

const chatEmbedding = (friendId) => {
    const requestURL = `${process.env.REACT_APP_FAST_API_URL}/chat/${decodedToken.sub}`;
    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            },body: JSON.stringify(friendId)
        }).then(response => response.json());
        alert(result.message)
        dispatch(callGetFriendRequest())
        dispatch({ type: POST_REFUSAL, payload: result.data });
    }
}





export default fetchChatData;