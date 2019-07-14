import React, { FunctionComponent } from 'react';
import Link from 'next/link';
import { Container } from 'components';
import AuthStore from 'stores/AuthStore';
import { inject, observer } from 'mobx-react';
import { IPageIndex } from 'interfaces';

const Index: FunctionComponent<IPageIndex.IProps> = (props) => (
  <Container title="seong">
    <div className="Landing">test class</div>
    <Link href="/test1">
      <a>go to test</a>
    </Link>
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
