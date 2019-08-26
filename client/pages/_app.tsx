import App, { Container } from 'next/app';
import React from 'react';
import { CookiesProvider, Cookies } from 'react-cookie';
import { withReduxStore } from 'utils';
import { Provider } from 'react-redux';
import { initialize, tokenRefresh, tokenVerify } from 'store/modules/auth';

class MyApp extends App {
  async componentDidMount() {
    // @ts-ignore
    const { reduxStore } = this.props;
    const cookies = new Cookies();
    const xAuthToken = cookies.get('x-auth-token');

    await initialize();
    await tokenRefresh();
    
    if (xAuthToken) {
      await reduxStore.dispatch(tokenVerify(xAuthToken));
    }
  }
  
  public render(): JSX.Element {
    // @ts-ignore
    const { Component, pageProps, reduxStore } = this.props;
    
    return (
      <Container>
        <Provider store={reduxStore}>
          <CookiesProvider>
            <Component {...pageProps} />
          </CookiesProvider>
        </Provider>
      </Container>
    )
  }
}

export default withReduxStore(MyApp);
