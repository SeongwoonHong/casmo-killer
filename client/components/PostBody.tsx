import React, { useState } from 'react';
import cx from 'classnames';

const PostBody = (props) => {
  const isViewMode = props.mode === 'view';
  const [title, setTitle] = useState(props.title || '');
  const [content, setContent] = useState(props.content || '');
  const [mainPicture, setMainPicture] = useState();

  function onTitleChange(e) {
    return setTitle(e.target.value);
  }

  function onContentChange(e) {
    return setContent(e.target.value);
  }

  function onFileChange(e) {
    const profilePicture = e.target.files[0];
    const form = new FormData();
    const reader = new FileReader();

    form.append('file', profilePicture);
    reader.readAsDataURL(profilePicture);

    return reader.onload = () => {
      return setMainPicture(reader.result);
    };
  }

  return (
    <div className={cx('PostBody', { viewMode: isViewMode })}>
      <div className="postbody-row">
        <input
          type="file"
          onChange={onFileChange}
          className="main-picture-input"
        />
      </div>
      <div className="postbody-row main-picture-row">
        <img
          src={mainPicture}
          className="main-picture"
          alt=""
        />
        <textarea
          placeholder="Title"
          value={title}
          onChange={onTitleChange}
          className="title-textarea"
          disabled={isViewMode}
        ></textarea>
      </div>
      <div className="postbody-row">
      </div>
      <hr />
      <div className="postbody-row">
        <textarea
          onChange={onContentChange}
          value={content}
          className="content-textarea"
          placeholder="Content"
          disabled={isViewMode}
        >
          {content}
        </textarea>
      </div>
      <hr />
    </div>
  );
};

export { PostBody };
