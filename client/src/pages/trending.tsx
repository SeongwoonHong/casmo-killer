import React, { useEffect } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import { getPosts } from '~store/modules/post';
import Router from 'next/router';
import { Container, PostCardList, Loader, Button } from '~components';

const trending = () => {
  const post = useSelector(state => state.post);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPosts());
  }, []);

  function renderPostCardList() {
    if (post.isLoading) {
      return <Loader />
    }

    return (
      <PostCardList
        data={post.posts}
      />
    )
  }

  function goToNewPost() {
    return Router.push('/post-write');
  }

  return (
    <>
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
    </>
  );
};

export default Container('Damso - Trending', 'trending')(trending);
