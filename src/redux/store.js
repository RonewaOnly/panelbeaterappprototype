import { createStore, combineReducers } from 'redux';
import { applyMiddleware } from 'redux';
import { authReducer } from './reducers/authReducer';
import {thunk,withExtraArgument} from 'redux-thunk';
import { fileReducer } from './reducers/fileReducer';


const rootReducer = combineReducers({
    auth:authReducer,
    files: fileReducer,

});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;