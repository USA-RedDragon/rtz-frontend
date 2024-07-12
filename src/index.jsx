import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import './index.css';
import App from './App';
import Theme from './theme';

console.info('mode:', import.meta.env.MODE || 'unknown');
console.info('RTZ version:', import.meta.env.VITE_APP_GIT_SHA || 'dev');
if (import.meta.env.VITE_APP_GIT_COMMIT_TIMESTAMP) {
  console.info('commit date:', import.meta.env.VITE_APP_GIT_COMMIT_TIMESTAMP || 'unknown');
}

ReactDOM.createRoot(document.getElementById('root')).render((
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StyledEngineProvider>
));
