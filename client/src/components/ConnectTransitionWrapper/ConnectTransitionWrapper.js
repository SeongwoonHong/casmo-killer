/* eslint-disable no-shadow, max-len */
import React, { Component } from 'react';
import invariant from 'invariant';

function getDisplayName(component) {
  return component.displayName || component.name || 'Component';
}

export default function ConnectTransitionWrapper() {
  return function wrapConnectedComponent(ConnectedComponent) {
    invariant(ConnectedComponent.WrappedComponent, 'You are trying to wrap a wrong component. check the ConnectTransitionWrapper component :)');
    class ConnectTransitionWrapper extends Component {
      static displayName = `ConnectTransitionWrapper(${getDisplayName(ConnectedComponent.WrappedComponent)})`;
      static WrappedComponent = ConnectedComponent.WrappedComponent;

      componentWillAppear(callback) {
        const { wrappedInstance } = this.component;
        if (wrappedInstance.componentWillAppear || wrappedInstance.wrappedInstance.componentWillAppear) {
          wrappedInstance.wrappedInstance.componentWillAppear(callback);
        } else {
          callback();
        }
      }

      componentDidAppear() {
        const { wrappedInstance } = this.component;

        if (wrappedInstance.componentWillAppear || wrappedInstance.wrappedInstance.componentDidAppear) {
          wrappedInstance.wrappedInstance.componentDidAppear();
        }
      }

      componentWillEnter(callback) {
        const { wrappedInstance } = this.component;

        if (wrappedInstance.componentWillAppear || wrappedInstance.wrappedInstance.componentWillEnter) {
          wrappedInstance.wrappedInstance.componentWillEnter(callback);
        } else {
          callback();
        }
      }

      componentDidEnter() {
        const { wrappedInstance } = this.component;

        if (wrappedInstance.componentWillAppear || wrappedInstance.wrappedInstance.componentDidEnter) {
          wrappedInstance.wrappedInstance.componentDidEnter();
        }
      }

      componentWillLeave(callback) {
        const { wrappedInstance } = this.component;

        if (wrappedInstance.componentWillAppear || wrappedInstance.wrappedInstance.componentWillLeave) {
          wrappedInstance.wrappedInstance.componentWillLeave(callback);
        } else {
          callback();
        }
      }

      componentDidLeave() {
        const { wrappedInstance } = this.component;
        this.isLeaving = false;
        if (wrappedInstance.componentWillAppear || wrappedInstance.wrappedInstance.componentDidLeave) {
          wrappedInstance.wrappedInstance.componentDidLeave();
        }
      }

      render() {
        return <ConnectedComponent {...this.props} ref={el => this.component = el } />;
      }
    }

    return ConnectTransitionWrapper;
  };
}
