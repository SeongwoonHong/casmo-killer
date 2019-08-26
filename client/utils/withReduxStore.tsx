import React from 'react';
import { initializeStore } from '../store';

const isServer = typeof window === 'undefined';
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__';

function getOrCreateStore (initialState = {}) {
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) {
    return initializeStore(undefined);
  }

  // Create store if unavailable on the client and set it on the window object
  if (!window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = initializeStore(initialState as any);
  }
  return window[__NEXT_REDUX_STORE__]
}

export default App => {
  return class AppWithRedux extends React.Component {
    static async getInitialProps (appContext) {
      const reduxStore = getOrCreateStore();
      
      appContext.ctx.reduxStore = reduxStore;
      
      let appProps = {};
      if (typeof App.getInitialProps === 'function') {
        appProps = await App.getInitialProps(appContext);
      }

      return {
        ...appProps,
        initialReduxState: reduxStore.getState(),
      }
    }
    
    constructor (props) {
      super(props);

      // @ts-ignore
      this.reduxStore = getOrCreateStore(props.initialReduxState);
    }

    render () {
      // @ts-ignore
      return <App {...this.props} reduxStore={this.reduxStore} />;
    }
  }
}
