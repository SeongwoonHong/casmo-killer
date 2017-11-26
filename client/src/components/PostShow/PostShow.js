import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import krStrings from 'react-timeago/lib/language-strings/ko';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import PreferencesPanel from '../PreferencesPanel';
import './PostShow.scss';

const formatter = buildFormatter(krStrings);
const tags = [ // 지금은 하드코딩으로..
  { name: 'toronto', link: '#' },
  { name: 'casmo', link: '#' },
  { name: 'killer', link: '#' }
];
class PostShow extends Component {

  render() {
    const { activePost } = this.props;

    return (
      <div className="postShow">
        <div className="header">
          <Link to="/"><img src="/testIcon.png" alt="" className="circle avartar_circle" /></Link>
          <div className="header-info">
            <div className="writer">{activePost.authorName}</div>
            <div className="created">Created : <TimeAgo date={activePost.date} formatter={formatter} /></div>
          </div>
        </div>
        <div className="title">
          <div className="info">
            #{ activePost.postNum }
            { tags.map((tag) => {
              return <Link to={`${tag.link}`} key={tag.name} className="tags">{tag.name}</Link>;
            })}
          </div>
          <span className="card-title">{activePost.title}</span>
        </div>
        <div className="contents">
          {activePost.contents}
          <div className="preferences">
            <PreferencesPanel
              postId={activePost._id}
              onLikesHandler={this.props.onLikesHandler}
              onDislikesHandler={this.props.onDislikesHandler}
            />
          </div>
        </div>
      </div>
    );
  }
}

PostShow.defaultProps = {
  activePost: {},
};

PostShow.propTypes = {
  activePost: PropTypes.object,
};

export default withRouter(PostShow);
