import React from 'react';
import Head from 'next/head';
import 'styles/_main.scss';
import { Header } from 'components';

const Container = (title, id) => (WrappedComponent) => {
  return class withContainerClass extends React.Component {
    static async getInitialProps(ctx) {
      let pageProps;

      if (WrappedComponent.getInitialProps) {
        pageProps = await WrappedComponent.getInitialProps(ctx);
      }

      return {...pageProps};
    }

    render() {
      return (
        <>
          <Head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link rel="icon" type="image/x-icon" href="/static/images/damso-logo.png" />
            <title>{title}</title>
            <style>
              {`
                @font-face {
                  font-family: 'Quicksand';
                  src: url('./static/fonts/Quicksand-SemiBold.ttf');
                }

                body {
                  font-family: 'Quicksand';
                }
              `}
            </style>
          </Head>
          <div id={id}>
            <Header />
            <WrappedComponent
              {...this.props}
            />
          </div>
        </>
      );
    }
  }
}

export { Container };
