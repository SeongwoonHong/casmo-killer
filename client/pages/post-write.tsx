import React from 'react';
import { Container, PostBody, Button, CloseButton } from 'components';
import Router from 'next/router';

const postWrite = props => {
  function closePostWrite() {
    Router.back();
  }

  return (
    <>
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
    </>
  );
};

export default Container('Damso - Write a post', 'post-write')(postWrite);
