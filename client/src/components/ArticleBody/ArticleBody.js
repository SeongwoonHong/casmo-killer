/* eslint-disable no-useless-escape */
import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import krStrings from 'react-timeago/lib/language-strings/ko';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import animate from 'gsap-promise';
import { toast } from 'react-toastify';

import LikeDislike from '../LikeDislike/LikeDislike';
import TextButton from '../Button/TextButton/TextButton';
import Iframe from '../Iframe/Iframe';
import ArticleForm from '../ArticleForm/ArticleForm';
import './ArticleBody.scss';

const formatter = buildFormatter(krStrings);
class ArticleBody extends Component {
  constructor(props) {
    super(props);
    this.component = [];
    this.state = {
      editMode: false
    };
  }
  componentDidMount = () => {
    animate.set(this.component, { autoAlpha: 0, y: '-10px' });
    animate.staggerTo(this.component, 0.3, { autoAlpha: 1, y: '0px' }, 0.15);
  }
  componentWillUnmount = () => {
    TweenMax.killTweensOf(this.component);
  }
  tagsSearch = (tag) => {
    this.props.tagsSearchRequest(tag).then((res) => {
      this.props.openUserInfoModal(res.payload, 'tag');
    });
  }
  deletePostRequest = () => {
    return this.props.deletePostRequest().then(() => {
      if (this.props.deletePost.status === 'SUCCESS') {
        toast.info('Success!', {
          position: toast.POSITION_TOP_RIGHT
        });
        this.props.history.push(`/articles/${this.props.activePost.boardId}`);
      } else {
        toast.error('Something went wrong', {
          position: toast.POSITION_TOP_RIGHT
        });
      }
    });
  }
  validateAndEditPost = (values) => {
    const id = this.props.activePost._id;
    return this.props.editPostRequest(id, values).then(() => {
      if (this.props.editPost.status === 'SUCCESS' || this.props.editPost.status === 'INIT') {
        toast.info('Success!', {
          position: toast.POSITION_TOP_RIGHT
        });
        this.toggleEdit();
      } else {
        console.log(this.props.editPost.status);
        toast.error('Something went wrong', {
          position: toast.POSITION_TOP_RIGHT
        });
      }
    }
    );
  }
  toggleEdit = () => {
    this.setState({
      editMode: !this.state.editMode
    });
  }
  render() {
    const { activePost, user } = this.props;
    const detailView = (
      <div>
        <div className="header" ref={el => this.component[0] = el} >
          <img src={activePost.author.avatar} alt="" className="circle avatar-circle" />
          <div className="header-info">
            <div className="writer">
              <div className="user-btn">
                <Link
                  to={`/user/info/${activePost.author._id}`}
                  >
                  {activePost.author.displayName}
                </Link>
              </div>
            </div>
            <div className="created">Created : <TimeAgo date={activePost.date} formatter={formatter} />{ activePost.updated.length > 0 && <span> (edited)</span>}</div>
          </div>
        </div>
        <div className="title" ref={el => this.component[1] = el}>
          <div className="info">
            #{ activePost.postNum }
            { !!activePost.tags && activePost.tags.trim() && activePost.tags.trim().split(' ').map((tag) => {
              return (
                <span
                  key={tag}
                  className="tags"
                  role="presentation"
                  onKeyDown={() => {}}
                  onClick={() => this.tagsSearch(tag)}
                >
                  {tag}
                </span>
              );
            })}
          </div>
          <span className="card-title">{activePost.title}</span>
        </div>
        <div className="contents" ref={el => this.component[2] = el}>
          <Iframe
            content={activePost.contents}
          />
          <div className="like-dislike-wrapper">
            <LikeDislike
              onLikesHandler={this.props.giveLikesRequest}
              onDislikesHandler={this.props.giveDisLikesRequest}
              likes={activePost.likes.length}
              disLikes={activePost.disLikes.length}
            />
          </div>
        </div>
      </div>
    );
    const editView = (
      <ArticleForm
        formType="edit"
        validateAndCreatePost={this.validateAndEditPost}
        toggleEdit={this.toggleEdit}
      />
    );
    const footerButtons = (
      [
        <TextButton
          onClick={this.toggleEdit}
          onKeyDown={() => {}}
          className=""
          key="edit"
        >
          Edit
        </TextButton>,
        <TextButton
          onClick={this.deletePostRequest}
          onKeyDown={() => {}}
          className=""
          key="delete"
        >
          Delete
        </TextButton>
      ]
    );
    return (
      <div className="article-body">
        { this.state.editMode ? editView : detailView}
        <div className="article-footer">
          {
            user.displayName === activePost.author.displayName && !this.state.editMode && footerButtons
          }
        </div>
      </div>
    );
  }
}

ArticleBody.defaultProps = {
  activePost: {
    title: 'title',
    author: {
      avatar: 'https://res.cloudinary.com/duk5vdxcc/image/upload/c_fill,h_100,w_100/v1516672455/5a6695c692f53405fa3c2990.png',
      _id: '_id',
      displayName: 'displayName'
    },
    tags: 'pilot asdf zxcv 1234 asef toronto vancouver ',
    postNum: 'postNum',
    contents: '<div data-contents=\"true\"><div class=\"RichTextEditor__block___2Vs_D RichTextEditor__paragraph___3NTf9\" data-block=\"true\" data-editor=\"elbt7\" data-offset-key=\"6dks4-0-0\"><div data-offset-key=\"6dks4-0-0\" class=\"public-DraftStyleDefault-block public-DraftStyleDefault-ltr\"><span data-offset-key=\"6dks4-0-0\"><span data-text=\"true\">fff<\/span><\/span><\/div><\/div><div class=\"RichTextEditor__block___2Vs_D RichTextEditor__paragraph___3NTf9\" data-block=\"true\" data-editor=\"elbt7\" data-offset-key=\"4bfpc-0-0\"><div data-offset-key=\"4bfpc-0-0\" class=\"public-DraftStyleDefault-block public-DraftStyleDefault-ltr\"><span data-offset-key=\"4bfpc-0-0\" style=\"font-weight: bold;\"><span data-text=\"true\">sad<\/span><\/span><\/div><\/div><div class=\"RichTextEditor__block___2Vs_D RichTextEditor__paragraph___3NTf9\" data-block=\"true\" data-editor=\"elbt7\" data-offset-key=\"h0ob-0-0\"><div data-offset-key=\"h0ob-0-0\" class=\"public-DraftStyleDefault-block public-DraftStyleDefault-ltr\"><span data-offset-key=\"h0ob-0-0\" style=\"font-weight: bold;\"><span data-text=\"true\">qwe<\/span><\/span><\/div><\/div><div class=\"RichTextEditor__block___2Vs_D RichTextEditor__paragraph___3NTf9\" data-block=\"true\" data-editor=\"elbt7\" data-offset-key=\"cn38a-0-0\"><div data-offset-key=\"cn38a-0-0\" class=\"public-DraftStyleDefault-block public-DraftStyleDefault-ltr\"><span data-offset-key=\"cn38a-0-0\"><br data-text=\"true\"><\/span><\/div><\/div><\/div>',
    updated: [],
    date: '2018-01-19T02:02:52.065Z'
  },
};

ArticleBody.propTypes = {
  activePost: PropTypes.object,
};

export default withRouter(ArticleBody);
