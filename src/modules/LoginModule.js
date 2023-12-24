import { handleActions } from 'redux-actions';

//초기값
const initialState = {
    data: [],
    pageInfo: {}
};

//액션
export const POST_LOGIN = 'login/POST_LOGIN';
export const POST_GOOGLE_LOGIN = 'login/POST_GOOGLE_LOGIN';
export const POST_SIGN_UP = 'sign/POST_SIGN_UP';
export const POST_CHECK = 'sign/POST_CHECK';
export const POST_MAIL = 'test/POST_MAIL';
export const POST_FIND_EMAIL = "login/POST_FIND_EMAIL"


//리듀서
export const signUpReducer = handleActions(
    {
        [POST_SIGN_UP] : (state, { payload }) =>{
            return payload
        },
    },
    initialState
);

export const checkReducer = handleActions(
    {
        [POST_CHECK] : (state, { payload }) =>{
            return payload
        },
    },
    initialState
);

export const loginReducer = handleActions(
    {
        [POST_LOGIN] : (state, { payload }) =>{
            return payload
        },
    },
    initialState
);

export const googleLoginReducer = handleActions(
    {
        [POST_GOOGLE_LOGIN] : (state, { payload }) =>{
            return payload
        },
    },
    initialState
);


export const mailReducer = handleActions(
    {
        [POST_MAIL] : (state, { payload }) =>{
            return payload
        },
    },
    initialState
);

export const findEmailReducer = handleActions(
    {
        [POST_FIND_EMAIL] : (state, { payload }) =>{
            return payload
        },
    },
    initialState
);