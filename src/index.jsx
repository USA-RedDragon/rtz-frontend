import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import './index.css';
import App from './App';
import Theme from './theme';

console.info('mode:', import.meta.env.MODE || 'unknown');
console.info('RTZ version:', __GIT_SHA__ || 'dev');
if (__GIT_TIMESTAMP__) {
  console.info('commit date:', __GIT_TIMESTAMP__ || 'unknown');
}

ReactDOM.createRoot(document.getElementById('root')).render((
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StyledEngineProvider>
));
