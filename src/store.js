import { configureStore } from '@reduxjs/toolkit'
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { thunk } from 'redux-thunk';
import { combineReducers } from 'redux';
import { createBrowserHistory } from 'history';
import reduceReducers from 'reduce-reducers';

import reducers from './reducers';
import initialState from './initialState';
import { onHistoryMiddleware } from './actions/history';

export const history = createBrowserHistory();

const rootReducer = (providedHistory) => combineReducers({
  router: connectRouter(providedHistory),
  app: reduceReducers(initialState, ...reducers),
});

const store = configureStore({
  reducer: rootReducer(history),
  middleware: () => [thunk, onHistoryMiddleware, routerMiddleware(history)],
  devTools: true,
});

export default store;
