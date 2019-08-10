import React from 'react';
import PostCard from './PostCard';

const PostCardList = ({ data }) => {
  if (!data) return null;

  return (
    <div className="PostCardList">
      {
        data.map((item) => {
          return (
            <PostCard
              key={item.id}
              img={item.img}
              title={item.title}
              author={item.author}
              comments={item.comments}
              username={item.username}
            />
          );
        })
      }
    </div>
  );
};

export { PostCardList };
