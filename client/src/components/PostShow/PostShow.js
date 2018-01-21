import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import krStrings from 'react-timeago/lib/language-strings/ko';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import animate from 'gsap-promise';
import PlainBtn from 'sharedComponents/PlainBtn';
import PreferencesPanel from '../PreferencesPanel';
import Iframe from '../Iframe/Iframe';
import './PostShow.scss';

import axios from 'axios'; // 테스트 임시용. 나중에 액션크리에이터에서 호출할거임 지금은 귀찮아서 여기서 테스트중!

const formatter = buildFormatter(krStrings);
class PostShow extends Component {
  constructor(props) {
    super(props);
    this.component = [];
  }
  componentDidMount = () => {
    animate.set(this.component, { autoAlpha: 0, y: '-10px' });
    animate.staggerTo(this.component, 0.3, { autoAlpha: 1, y: '0px' }, 0.15);
  }
  tagsSearch = (tag) => {
    this.props.tagsSearchRequest(tag).then((res) => {
      this.props.openUserInfoModal(res.payload, 'tag');
    });
  }
  render() {
    const { activePost } = this.props;
    return (
      <div className="postShow">
        <div className="header" ref={el => this.component[0] = el} >
          <img src={activePost.author.avatar} alt="" className="circle avartar_circle" />
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
            stylesheets='<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css">'
          />
          <div className="preferences">
            <PreferencesPanel
              onLikesHandler={this.props.onLikesHandler}
              onDislikesHandler={this.props.onDislikesHandler}
              delay={0.3}
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
