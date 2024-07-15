import { configureStore } from '@reduxjs/toolkit'
import { createReduxHistoryContext } from "redux-first-history";
import { thunk } from 'redux-thunk';
import { combineReducers } from 'redux';
import { createBrowserHistory } from 'history';
import reduceReducers from 'reduce-reducers';

import reducers from './reducers';
import initialState from './initialState';
import { onHistoryMiddleware } from './actions/history';

const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
  history: createBrowserHistory()
});

export const store = configureStore({
  reducer: combineReducers({
    router: routerReducer,
    app: reduceReducers(initialState, ...reducers),
  }),
  middleware: () => [thunk, onHistoryMiddleware, routerMiddleware],
  devTools: true,
});

export const history = createReduxHistory(store);
