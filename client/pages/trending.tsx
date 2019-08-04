import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import { Container, PostCardList, Loader } from 'components';

const trending = ({ postCardStore }) => {
  useEffect(() => {
    postCardStore.getPostCards();
  }, []);

  function render() {
    if (postCardStore.isLoading) {
      return <Loader />
    }

    return (
      <PostCardList
        data={toJS(postCardStore.postCards)}
      />
    )
  }

  return (
    <Container title="Damso Trending" id="trending">
      <div className="trending-header">Trending</div>
      {render()}
    </Container>
  );
};

export default inject('postCardStore')(observer(trending));
