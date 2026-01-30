import { combineReducers ,createStore  } from "redux";
import { userReducer } from "./userReducer";
import { countryListReducer } from "./countryList";
import {createProgramReducer} from "./createProgramReducer"

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' 

import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

const reducers = combineReducers({
    user:userReducer,
    countries: countryListReducer,
    programDetails: createProgramReducer
});

const persistConfig = {
    key: 'root',
    storage,
    stateReconciler: autoMergeLevel2,
}

const persistedReducer = persistReducer(persistConfig, reducers)

const store = createStore(persistedReducer)
const persistor = persistStore(store)

export { store, persistor };
// () => {
//     console.log("initialState", store.getState(),persistor.getState());
//     return { store, persistor }
//   };