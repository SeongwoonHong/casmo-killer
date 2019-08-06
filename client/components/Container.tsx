import React, { FunctionComponent } from 'react';
import Head from 'next/head';
import { IContainer } from 'interfaces';
import 'styles/_main.scss';
import { Header } from 'components';

const Container: FunctionComponent<IContainer.IProps> = props => (
  <>
    <Head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <title>{props.title}</title>
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
    <div id={props.id}>
      <Header />
      {props.children}
    </div>
  </>
);

export { Container };
