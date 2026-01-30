import { ActionTypes } from "../constants/action-types";

const initialState ={
    userDetails:{},
    activeTab:'step1',
    loader:false,
    isEdit:false
}
export const userReducer = (state = initialState,{ type, payload })=>{
    switch(type){
        case ActionTypes.SET_USER:
            return {...state, userDetails:payload };
        // break;
        case ActionTypes.SET_ACTIVE_TAB:
            return {...state, activeTab:payload };
        // break;
        case ActionTypes.SET_LOADER:
            return {...state, loader:payload };
        // break;
        case ActionTypes.SET_EDIT_FLAG:
            return {...state, isEdit:payload };
        // break;
        case ActionTypes.RESET_STORE:
            return {...state};
        // break;
        case ActionTypes.SET_IN_PROGRESS_PUBLISH:
            return {...state, inProgressPublish:payload };
        // break;
        default:
            return state;
    }
}