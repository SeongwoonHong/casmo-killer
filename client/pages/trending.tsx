import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import Router from 'next/router';
import { Container, PostCardList, Loader, Button } from 'components';

const trending = ({ postCardStore }) => {
  useEffect(() => {
    postCardStore.getPostCards();
  }, []);

  function renderPostCardList() {
    if (postCardStore.isLoading) {
      return <Loader />
    }

    return (
      <PostCardList
        data={toJS(postCardStore.postCards)}
      />
    )
  }

  function goToNewPost() {
    return Router.push('/post-write');
  }

  return (
    <Container title="Damso - Trending" id="trending">
      <div className="heading">
        <div className="trending-header">Trending</div>
        <Button
          className="trending-new-post-button"
          onClick={goToNewPost}
        >
          New Post
        </Button>
      </div>
      {renderPostCardList()}
    </Container>
  );
};

export default inject('postCardStore')(observer(trending));
