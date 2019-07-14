import App, { Container } from 'next/app';
import React from 'react';
import { Provider } from 'mobx-react';
import initializeStore from 'stores/index.ts';

class MyMobxApp extends App {
  mobxStore;

  static async getInitialProps(appContext) {
    const mobxStore = initializeStore();

    appContext.ctx.mobxStore = mobxStore;

    let appProps = await App.getInitialProps(appContext);

    return {
      ...appProps,
      initialMobxState: mobxStore,
    }
  }

  constructor(props) {
    super(props);
    const isServer = typeof window === 'undefined';

    this.mobxStore = isServer
      ? props.initialMobxState
      : initializeStore(props.initialMobxState);
  }

  public render(): JSX.Element {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Provider {...this.mobxStore}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    )
  }
}

export default MyMobxApp;
