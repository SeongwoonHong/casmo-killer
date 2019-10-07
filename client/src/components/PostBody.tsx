import React, { useState } from 'react';
import cx from 'classnames';
import { Button, CloseButton } from '~components';

const PostBody = (props) => {
  const isViewMode = props.mode === 'view';
  const [title, setTitle] = useState(props.title || '');
  const [content, setContent] = useState(props.content || '');
  const [thumbnail, setThumbnail] = useState();

  function onTitleChange(e) {
    return setTitle(e.target.value);
  }

  function onContentChange(e) {
    return setContent(e.target.value);
  }


  function resetThumbnail() {
    return setThumbnail('');
  }

  function imgUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      if (!input.files) return;
      const file = input.files[0];
      const reader = new FileReader();

      reader.readAsDataURL(file);

      return reader.onload = () => {
        return setThumbnail(reader.result);
      };
    }
    input.click();
  }

  return (
    <div className={cx('PostBody', { viewMode: isViewMode })}>
      {
        !isViewMode && (
          <div className="postbody-row postbody-header">
            <Button
              className="main-picture-input"
              onClick={imgUpload}
            >
              Thumbnail
            </Button>
            <Button
              className="post-write-post-button"
            >
              POST
            </Button>
          </div>
        )
      }
      <div className="postbody-row main-picture-row">
        {
          !isViewMode && thumbnail && (
            <CloseButton
              onClick={resetThumbnail}
              className="reset-thumbnail"
            />
          )
        }
        <img
          src={thumbnail}
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
