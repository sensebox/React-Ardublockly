import { GET_USERS, GET_USERS_SUCCESS, GET_USERS_FAIL, UPDATE_USER_ROLE, UPDATE_USER_ROLE_SUCCESS, UPDATE_USER_ROLE_FAIL } from '../actions/types';

const initialState = {
    users: [],
    loading: false,
    error: null,
    };

export default function foo(state = initialState, action) {
    switch (action.type) {
        case GET_USERS:
            return {
                ...state,
                loading: true,
            };
        case GET_USERS_SUCCESS:
            return {
                ...state,
                users: action.payload,
                loading: false,
            };
        case GET_USERS_FAIL:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        case UPDATE_USER_ROLE:
            return {
                ...state,
                loading: true,
            };
        case UPDATE_USER_ROLE_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case UPDATE_USER_ROLE_FAIL:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        default:
            return state;
    }
}