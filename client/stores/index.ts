import { useStaticRendering } from 'mobx-react';
import {enableLogging} from 'mobx-logger';
import AuthStore from './AuthStore';
import PostCardStore from './PostCardStore';

const isServer = typeof window === 'undefined';
useStaticRendering(isServer);
process.env.NODE_ENV !== 'production' && enableLogging();

let store;

const initialData = {
  authStore: {
  },
  postCardStore: []
}

export default function initializeStore(data = initialData) {
  if (isServer) {
    return {
      authStore: new AuthStore(data.authStore),
      postCardStore: new PostCardStore(data.postCardStore),
    };
  }
  if (!store) {
    store = {
      authStore: new AuthStore(data.authStore),
      postCardStore: new PostCardStore(data.postCardStore),
    };
  }

  return store;
}
