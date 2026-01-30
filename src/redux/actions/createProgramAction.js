import { ActionTypes } from "../constants/action-types"
export const setProgramDetails = (details)=>{
    return {
        type:ActionTypes.SET_PROGRAM_DETAILS,
        payload:details
    }
}
