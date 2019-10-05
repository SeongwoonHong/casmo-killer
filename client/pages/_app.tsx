import App, { Container } from 'next/app';
import React from 'react';
import { CookiesProvider } from 'react-cookie';
import { withReduxStore } from 'utils';
import { Provider } from 'react-redux';
import { initialize, tokenRefresh } from 'store/modules/auth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/scss/main.scss'

class MyApp extends App {
  async componentDidMount() {
    // @ts-ignore
    const { reduxStore } = this.props;

    await initialize();
    await reduxStore.dispatch(tokenRefresh());
  }
  
  public render(): JSX.Element {
    // @ts-ignore
    const { Component, pageProps, reduxStore } = this.props;
    
    return (
      <Container>
        <Provider store={reduxStore}>
          <CookiesProvider>
            <Component {...pageProps} />
            <ToastContainer />
          </CookiesProvider>
        </Provider>
      </Container>
    )
  }
}

export default withReduxStore(MyApp);
