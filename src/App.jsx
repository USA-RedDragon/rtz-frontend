import React, { Component, lazy, Suspense, createContext } from 'react';
import { Provider } from 'react-redux';
import { Route, Navigate, Routes } from 'react-router';
import { BrowserRouter as Router } from "react-router-dom";
import qs from 'query-string';
import localforage from 'localforage';

import { CircularProgress, Grid } from '@mui/material';

import MyCommaAuth, { config as AuthConfig, storage as AuthStorage } from '@commaai/my-comma-auth';
import { athena as Athena, auth as Auth, billing as Billing, request as Request } from '@commaai/api';

import { getZoom, getSegmentRange } from './url';
import { store, history } from './store';

const Explorer = lazy(() => import('./components/explorer'));
const AnonymousLanding = lazy(() => import('./components/anonymous'));

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initialized: false,
    };

    let pairToken;
    if (window.location) {
      pairToken = qs.parse(window.location.search).pair;
    }

    if (pairToken) {
      try {
        localforage.setItem('pairToken', pairToken);
      } catch (err) {
        console.error(err);
      }
    }
  }

  apiErrorResponseCallback(resp) {
    if (resp.status === 401) {
      MyCommaAuth.logOut();
    }
  }

  async componentDidMount() {
    console.log("Component mount", window.location)
    if (window.location) {
      if (window.location.pathname === AuthConfig.AUTH_PATH) {
        console.log("Auth path")
        try {
          const { code, provider } = qs.parse(window.location.search);
          console.log("Code", code)
          console.log("Provider", provider)
          const token = await Auth.refreshAccessToken(code, provider);
          console.log("Token", token)
          if (token) {
            AuthStorage.setCommaAccessToken(token);
          }
        } catch (err) {
          console.error(err);
        }
      }
    }

    const token = await MyCommaAuth.init();
    if (token) {
      Request.configure(token, this.apiErrorResponseCallback);
      Billing.configure(token, this.apiErrorResponseCallback);
      Athena.configure(token, this.apiErrorResponseCallback);
    }

    this.setState({ initialized: true });
  }

  redirectLink() {
    let url = '/';
    if (typeof window.sessionStorage !== 'undefined' && sessionStorage.getItem('redirectURL') !== null) {
      url = sessionStorage.getItem('redirectURL');
      sessionStorage.removeItem('redirectURL');
    }
    return url;
  }

  authRoutes() {
    return (
      <Routes>
        <Route path="/auth/*" element={<Navigate replace to={this.redirectLink()} />} />
        <Route path="/*" element={<Explorer />} />
      </Routes>
    );
  }

  anonymousRoutes() {
    return (
      <Routes>
        <Route path="/auth/*" element={<Navigate replace to="/" />} />
        <Route path="/*" element={<AnonymousLanding />} />
      </Routes>
    );
  }

  renderLoading() {
    return (
      <Grid container alignItems="center" style={{ width: '100%', height: '100vh' }}>
        <Grid item align="center" xs={12}>
          <CircularProgress size="10vh" style={{ color: '#525E66' }} />
        </Grid>
      </Grid>
    );
  }

  render() {
    if (!this.state.initialized) {
      return this.renderLoading();
    }

    const showLogin = !MyCommaAuth.isAuthenticated() && !getZoom(window.location.pathname) && !getSegmentRange(window.location.pathname);
    let content = (
      <Suspense fallback={this.renderLoading()}>
        { showLogin ? this.anonymousRoutes() : this.authRoutes() }
      </Suspense>
    );

    return (
      <Provider store={store}>
        <Router history={history}>
          {content}
        </Router>
      </Provider>
    );
  }
}

export default App;
