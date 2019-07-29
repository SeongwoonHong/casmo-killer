import { useStaticRendering } from 'mobx-react';
import {enableLogging} from 'mobx-logger';
import AuthStore from './AuthStore';

const isServer = typeof window === 'undefined';
useStaticRendering(isServer);
process.env.NODE_ENV !== 'production' && enableLogging();

let store;

const initialData = {
  authStore: {
  }
}

export default function initializeStore(data = initialData) {
  if (isServer) {
    return {
      authStore: new AuthStore(data.authStore),
    };
  }
  if (!store) {
    store = {
      authStore: new AuthStore(data.authStore),
    };
  }

  return store;
}
