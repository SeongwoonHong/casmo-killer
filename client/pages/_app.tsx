import App, { Container } from 'next/app';
import React from 'react';
import { CookiesProvider, Cookies } from 'react-cookie';
import { withReduxStore } from 'utils';
import { Provider } from 'react-redux';

class MyApp extends App {
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
