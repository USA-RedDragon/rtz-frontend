import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, MuiThemeProvider } from '@material-ui/core';

import './index.css';
import App from './App';
import Theme from './theme';

console.info('mode:', import.meta.env.MODE || 'unknown');
console.info('connect version:', import.meta.env.VITE_APP_GIT_SHA || 'dev');
if (import.meta.env.VITE_APP_GIT_COMMIT_TIMESTAMP) {
  console.info('commit date:', import.meta.env.VITE_APP_GIT_COMMIT_TIMESTAMP || 'unknown');
}

ReactDOM.createRoot(document.getElementById('root')).render((
  <MuiThemeProvider theme={Theme}>
    <CssBaseline />
    <App />
  </MuiThemeProvider>
));
