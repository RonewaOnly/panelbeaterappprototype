import { createStore, combineReducers } from 'redux';
import { applyMiddleware } from 'redux';
import { authReducer } from './reducers/authReducer';
import { thunk } from 'redux-thunk';
import { fileReducer } from './reducers/fileReducer';
import { reportReducer } from './reducers/reportReducer';


const rootReducer = combineReducers({
    auth:authReducer,
    files: fileReducer,
    report: reportReducer,

});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;