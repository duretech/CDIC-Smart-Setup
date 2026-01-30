import { ActionTypes } from "../constants/action-types"
export const setUser = (user)=>{
    return {
        type:ActionTypes.SET_USER,
        payload:user
    }
}

export const setCountryList = (list)=>{
    return {
        type:ActionTypes.SET_COUNTRY_LIST,
        payload:list
    }
}

export const setActiveTab = (tabname)=>{
    return {
        type:ActionTypes.SET_ACTIVE_TAB,
        payload:tabname
    }
}

export const setLanguagesList = (list)=>{
    return {
        type:ActionTypes.SET_LANGUAGES_LIST,
        payload:list
    }
}

export const setUserTemplate = (userTemplate)=>{
    return {
        type:ActionTypes.SET_USER_TEMPLATE,
        payload:userTemplate
    }
}
export const setLoader = (loader)=>{
    return {
        type:ActionTypes.SET_LOADER,
        payload:loader
    }
}
export const setEditFlag= (flag)=>{
    return {
        type:ActionTypes.SET_EDIT_FLAG,
        payload:flag
    }
}
export const setResetStore= ()=>{
    return {
        type:ActionTypes.RESET_STORE,
        payload:{}
    }
}

export const setInProgressPublish = (progress)=>{
    return {
        type:ActionTypes.SET_IN_PROGRESS_PUBLISH,
        payload:progress
    }
}
