import React, { FunctionComponent } from 'react';
import Link from 'next/link';
import { Container } from 'components';
import AuthStore from 'stores/AuthStore';
import { inject, observer } from 'mobx-react';
import { IPageIndex } from 'interfaces';

const Index: FunctionComponent<IPageIndex.IProps> = (props) => (
  <Container title="seong" id="landing">
    <div>HELLO WORLD</div>
  </Container>
);

// Index.getInitialProps = async function(props) {
//   const { authStore } = props.mobxStore;

//   const data = await authStore.getUser();

//   return {
//     data
//   }
// };

export default Index;
