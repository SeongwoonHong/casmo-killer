import React, { Component } from 'react';
import './Bookmark.scss';

class Bookmark extends Component {

  handleBookmark = () => {
    this.props.onBookmark();
  }

  render() {
    return (
      <div className="bookmark-box">
        {this.props.bookmarkStat ?
          <div
            role="presentation"
            onClick={this.handleBookmark}
            onKeyDown={() => {}}
            >
            <img
              src="/filled_star.svg"
              alt="bookmarked"
            />
          </div> :
          <div
            role="presentation"
            onClick={this.handleBookmark}
            onKeyDown={() => {}}
            >
            <img
              src="/star.svg"
              alt="bookmarked"
            />
          </div>}
      </div>
    );
  }
}

export default Bookmark;
