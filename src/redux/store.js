import { createStore, combineReducers } from 'redux';
import { applyMiddleware } from 'redux';
import { authReducer } from './reducers/authReducer';
import {thunk,withExtraArgument} from 'redux-thunk';


const rootReducer = combineReducers({
    auth:authReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;