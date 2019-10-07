import React from 'react';
import { Container, PostBody, Button, CloseButton } from '~components';
import Router from 'next/router';

const postWrite = props => {
  function closePostWrite() {
    Router.back();
  }

  return (
    <div className="postWrite">
      <PostBody />
    </div>
  );
};

export default Container('Damso - Write a post', 'post-write')(postWrite);
