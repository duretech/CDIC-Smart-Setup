import { ActionTypes } from "../constants/action-types";
import programJson from '../../assets/data/usertemplate.json'

const initialState ={
    details: programJson,
    userTemplate: {
        programstages : []
    }
}
export const createProgramReducer = (state = initialState,{ type, payload })=>{
    switch(type){
        case ActionTypes.SET_PROGRAM_DETAILS:
            return { ...state, details: payload };
        case ActionTypes.SET_USER_TEMPLATE:
            return {...state, userTemplate:payload };
        // break;
        
        default:
            return state;
    }
}