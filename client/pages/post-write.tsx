import React from 'react';
import { Container, PostBody, Button, CloseButton } from 'components';
import Router from 'next/router';

const postWrite = props => {
  function closePostWrite() {
    Router.back();
  }

  return (
    <Container title="Damso - Write a post" id="post-write">
      <div className="post-write-footer">
        <CloseButton
          className="post-write-close-button"
          onClick={closePostWrite}
        />
        <Button
          className="post-write-post-button"
        >
          POST
        </Button>
      </div>
      <PostBody />
    </Container>
  );
};

export default postWrite;
