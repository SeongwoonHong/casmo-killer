import { useStaticRendering } from 'mobx-react';
import {enableLogging} from 'mobx-logger';
import AuthStore from './AuthStore';
import PostStore from './PostStore';

const isServer = typeof window === 'undefined';
useStaticRendering(isServer);
process.env.NODE_ENV !== 'production' && enableLogging();

let store;

const initialData = {
  authStore: {
  },
  postStore: []
}

export default function initializeStore(data = initialData) {
  if (isServer) {
    return {
      authStore: new AuthStore(data.authStore),
      postStore: new PostStore(data.postStore),
    };
  }
  if (!store) {
    store = {
      authStore: new AuthStore(data.authStore),
      postStore: new PostStore(data.postStore),
    };
  }

  return store;
}
