/* eslint-disable no-useless-escape */
import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import krStrings from 'react-timeago/lib/language-strings/ko';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import animate from 'gsap-promise';
import LikeDislike from '../../components/LikeDislike/LikeDislike';
import Iframe from '../../components/Iframe/Iframe';
import './ArticleBody.scss';


const formatter = buildFormatter(krStrings);
class ArticleBody extends Component {
  constructor(props) {
    super(props);
    this.component = [];
  }
  componentDidMount = () => {
    animate.set(this.component, { autoAlpha: 0, y: '-10px' });
    animate.staggerTo(this.component, 0.3, { autoAlpha: 1, y: '0px' }, 0.15);
  }
  tagsSearch = (tag) => {
    // this.props.tagsSearchRequest(tag).then((res) => {
    //   this.props.openUserInfoModal(res.payload, 'tag');
    // });
  }
  render() {
    const { activePost } = this.props;
    return (
      <div className="article-body">
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
            // stylesheets='<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css">'
          />
          <div className="like-dislike-wrapper">
            <LikeDislike
              // onLikesHandler={this.props.onLikesHandler}
              // onDislikesHandler={this.props.onDislikesHandler}
              // delay={0.3}
            />
          </div>
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
