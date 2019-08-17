import React from 'react';
import { Container, PostBody } from 'components';

const title = props => {
  return (
    <PostBody
      mode="view"
      title={props.title}
      content={props.content}
    />
  );
};

title.getInitialProps = async function(props) {
  const { id, title } = props.query;
  // call post store to get data from api
  await new Promise((resolve) => setTimeout(resolve, 4000));
  return {
    title,
    content: 'test content'
  }
};

export default Container('aaa', 'blog-post')(title);
