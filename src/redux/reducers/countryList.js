import { ActionTypes } from "../constants/action-types";

const initialState ={
    countryList:{},
    languagesList:[]
}
export const countryListReducer = (state = initialState,{ type, payload })=>{
    switch(type){
        case ActionTypes.SET_COUNTRY_LIST:
            return {...state, countryList:payload };
        // break;
        case ActionTypes.SET_LANGUAGES_LIST:
            return {...state, languagesList:payload };
        // break;
        default:
            return state;
    }
}