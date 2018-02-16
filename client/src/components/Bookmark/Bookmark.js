import React, { Component } from 'react';
import './Bookmark.scss';

class Bookmark extends Component {
  constructor(props) {
    super(props);
    const bookmarked = props.bookmarkStat;

    this.state = {
      bookmarked
    };
  }

  handleBookmark = () => {
    this.setState({ bookmarked: !this.state.bookmarked });
    this.props.onBookmark();
  }

  render() {
    return (
      <div className="bookmark-box">
        {this.state.bookmarked ?
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
