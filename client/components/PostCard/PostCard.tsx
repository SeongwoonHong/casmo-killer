import React, { FunctionComponent } from 'react';
import { IPostCard } from 'interfaces';
import Link from 'next/link';
import cx from 'classnames'

const PostCard: FunctionComponent<IPostCard.IProps> = ({
  img,
  title,
  author,
  comments,
  username
}) => {
  return (
    <Link href={`/${username}/${title}`}>
      <div className={cx('PostCard', { noImg: !img })}>
        <div className="postcard-left">
          <img src={img} />
        </div>
        <div className="postcard-right">
          <div className="postcard-title">{title}</div>
          <div className="postcard-author">by {author}</div>
          <div className="postcard-footer">
            <span>365 views</span>
            <span>{comments} Comments</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
