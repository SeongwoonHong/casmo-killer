import React, { FunctionComponent } from 'react';
import { Container } from 'components';
import { IPageIndex } from 'interfaces';

const Index: FunctionComponent<IPageIndex.IProps> = (props) => (
  <Container title="seong" id="landing">
    <div>HELLO WORLD</div>
  </Container>
);

// Index.getInitialProps = async function(props) {
//   const { authStore } = props.mobxStore;

//   return {
//     data
//   }
// };

export default Index;
