import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import krStrings from 'react-timeago/lib/language-strings/ko';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import animate from 'gsap-promise';
import PreferencesPanel from '../PreferencesPanel';
import Iframe from '../Iframe/Iframe';
import './PostShow.scss';

const formatter = buildFormatter(krStrings);
const tags = [ // 지금은 하드코딩으로..
  { name: 'toronto', link: '#' },
  { name: 'casmo', link: '#' },
  { name: 'killer', link: '#' }
];
class PostShow extends Component {
  constructor(props) {
    super(props);
    this.component = [];
  }
  componentDidMount = () => {
    animate.set(this.component, { autoAlpha: 0, y: '-10px' });
    animate.staggerTo(this.component, 0.3, { autoAlpha: 1, y: '0px' }, 0.15);
  }
  render() {
    const { activePost } = this.props;
    return (
      <div className="postShow">
        <div className="header" ref={el => this.component[0] = el} >
          <Link to={`/userPage/${activePost.authorId}`}><img src={activePost.avatar} alt="" className="circle avartar_circle" /></Link>
          <div className="header-info">
            <div className="writer">{activePost.authorName}</div>
            <div className="created">Created : <TimeAgo date={activePost.date} formatter={formatter} /></div>
          </div>
        </div>
        <div className="title" ref={el => this.component[1] = el}>
          <div className="info">
            #{ activePost.postNum }
            { tags.map((tag) => {
              return <Link to={`${tag.link}`} key={tag.name} className="tags">{tag.name}</Link>;
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
