import {
    GET_FETCH_CHAT,
    GET_FRIEND,
    GET_FRIEND_REQUEST,
    GET_USER,
    POST_ADD_FRIEND,
    POST_APPROVAL,
    POST_CHANGE_USER, POST_REFUSAL
} from "../modules/MainModule";
import {jwtDecode} from "jwt-decode";
import axios from "axios";


const accessToken = window.localStorage.getItem('accessToken');
const decodedToken = accessToken ? jwtDecode(accessToken) : null;

export const callGetNickname = () => {
    const requestURL = `${process.env.REACT_APP_API_URL}/user/${decodedToken.sub}`;
    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            },
        }).then(response => response.json());
        dispatch({ type: GET_USER, payload: result.data });
    }
}

export const callGetFriend = () => {
    const requestURL = `${process.env.REACT_APP_API_URL}/friend/${decodedToken.sub}`;
    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            },
        }).then(response => response.json());
        dispatch({ type: GET_FRIEND, payload: result.data });
    }
}

export const callGetFriendRequest = () => {
    const requestURL = `${process.env.REACT_APP_API_URL}/friendRequest/${decodedToken.sub}`;
    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            },
        }).then(response => response.json());
        dispatch({ type: GET_FRIEND_REQUEST, payload: result.data });
    }
}



export const callPostFriend = (email) => {
    const requestURL = `${process.env.REACT_APP_API_URL}/friend/${decodedToken.sub}`;
    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            },body: JSON.stringify(email)
        }).then(response => response.json());
        alert(result.message)
        dispatch({ type: POST_ADD_FRIEND, payload: result.data });
    }
}

export const callPostChageUser = (data) => {
    const requestURL = `${process.env.REACT_APP_API_URL}/change/${decodedToken.sub}`;
    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'POST',
            headers: {
                'Accept': '*/*'
            },body: data
        }).then(response => response.json());
        alert(result.message)
        window.location.reload();
        if(result.status == 200){
            dispatch({ type: POST_CHANGE_USER, payload: result.data });
        }
    }
}

export const callPostApproval = (friendId) => {
    const requestURL = `${process.env.REACT_APP_API_URL}/approval/${decodedToken.sub}`;
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
        dispatch(callGetFriend())
        dispatch({ type: POST_APPROVAL, payload: result.data });
    }
}

export const callPostRefusal = (friendId) => {
    const requestURL = `${process.env.REACT_APP_API_URL}/refusal/${decodedToken.sub}`;
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

export const callFetchChatData = (channelId) => {
    const requestURL = `${process.env.REACT_APP_API_URL}/chat/${channelId}/${decodedToken.sub}`
    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            },
        }).then(response => response.json());
        dispatch({ type: GET_FETCH_CHAT, payload: result.data });
    }
}

export const callSearchData = () =>{
    const requestURL = `${process.env.REACT_APP_FAST_API_URL}/search}`
    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            },
        }).then(response => response.json());
        dispatch({ type: " 임시테스트 ", payload: result.data });
    }
}

