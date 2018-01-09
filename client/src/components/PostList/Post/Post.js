import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import krStrings from 'react-timeago/lib/language-strings/ko';
import PlainBtn from 'sharedComponents/PlainBtn';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import './Post.scss';

const formatter = buildFormatter(krStrings);

export default class Post extends Component {
  render() {
    const {
      id, postNum, title, authorName, count, comments, date, page, selected
    } = this.props;

    return (
      <li className="post_row collection-item row" key={id}>
        <div className="post_list_title_wrapper col s8 m7 l7">
          <div className="post_num"><span className="number">#{postNum} </span></div>
          <h6 className="post_title">
            <Link to={{
              pathname: `${this.props.baseUrl}/${id}`,
              state: { page, selected }
            }}>{title}
            </Link>
          </h6>
        </div>
        <div className="post_list_side_wrapper col s4 m5 l5">
          <div className="post_detail_item_author">
            <div className="collection-item avatar">
              <div className="avartar_info">
                <img src={authorName.avatar} alt="" className="circle avartar_circle" />
                <span className="authorName">
                  <div className="user-btn">
                    <PlainBtn
                      onClick={
                        () => { this.props.openUserInfoModal(authorName); }
                      }
                    >
                      <a href="#">{authorName.username}</a>
                    </PlainBtn>
                  </div>
                </span>
                <p><TimeAgo date={date} formatter={formatter} /></p>
              </div>
            </div>
          </div>
          <div className="post_detail_item_summary_wrapper">
            <div className="post_detail_item_summary">
              <ul className="hide-on-small-only">
                <li><i className="tiny material-icons">visibility</i> {count}</li>
                <li><i className="tiny material-icons">chat_bubble</i> {comments}</li>
              </ul>
            </div>
          </div>
        </div>
      </li>
    );
  }
}

Post.defaultProps = {
  id: '',
  postNum: 0,
  title: '',
  authorName: {},
  count: 0,
  page: 0,
  selected: 0
};

Post.propTypes = {
  id: PropTypes.string,
  postNum: PropTypes.number,
  title: PropTypes.string,
  authorName: PropTypes.object,
  count: PropTypes.number,
  page: PropTypes.number,
  selected: PropTypes.number
};
