import React, { Component } from 'react';
import TimeAgo from 'react-timeago';
import { NavLink } from 'react-router-dom';
import krStrings from 'react-timeago/lib/language-strings/ko';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import './SimplePost.scss';

const formatter = buildFormatter(krStrings);

class SimplePost extends Component {
  render() {
    const {
      title, author, number, date, to = '#'
    } = this.props;
    return (
      <div className="simple-post">
        <div className="post">
          <NavLink to={to} className="simple-post-top">{ title }</NavLink>
          <div className="simple-post-bottom">
            <div className="author">{author}</div>
            <div className="number">{number}</div>
            <TimeAgo date={date} formatter={formatter} />
          </div>
        </div>
      </div>
    );
  }
}

export default SimplePost;
