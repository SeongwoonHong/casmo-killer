import App, { Container } from 'next/app';
import React from 'react';
import { CookiesProvider } from 'react-cookie';
import { withReduxStore } from 'utils';
import { Provider } from 'react-redux';
import { initialize, tokenRefresh } from 'store/modules/auth';

class MyApp extends App {
  componentDidMount() {
    // @ts-ignore
    const { reduxStore } = this.props;

    // Should this be triggered everytime a user refreshses or goes to other pages?
    reduxStore.dispatch(initialize());
  }

  public render(): JSX.Element {
    // @ts-ignore
    const { Component, pageProps, reduxStore } = this.props;

    reduxStore.dispatch(tokenRefresh());

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
