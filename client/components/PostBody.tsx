import React, { useState } from 'react';

const PostBody = props => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  function onChangeTitle(e) {
    return setTitle(e.target.value);
  }

  function onChangeContent(e) {
    return setContent(e.target.value);
  }

  return (
    <div className="PostBody">
      <div className="postbody-row">
        <input
          placeholder="Title"
          value={title}
          onChange={onChangeTitle}
          className="title-input"
        />
      </div>
      <hr />
      <div className="postbody-row">
        <textarea
          onChange={onChangeContent}
          value={content}
          className="content-textarea"
          placeholder="Content"
        >
          {content}
        </textarea>
      </div>
      <hr />
    </div>
  );
};

export { PostBody };
