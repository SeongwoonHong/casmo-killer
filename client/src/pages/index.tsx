import React, { FunctionComponent } from 'react';
import { Container } from '~components';
import { IPageIndex } from '~interfaces';

const Index: FunctionComponent<IPageIndex.IProps> = (props) => (
  <div>HELLO WORLD</div>
);

// Index.getInitialProps = async function(props) {
//   const { authStore } = props.mobxStore;

//   return {
//     data
//   }
// };

export default Container('seong', 'landing')(Index);
