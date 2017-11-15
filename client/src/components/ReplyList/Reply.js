import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';

export default class Reply extends Component {
  render() {
    const {
      id, name, comment, date
    } = this.props;

    return (
      <div className="card">
        <div className="card-content" key={id}>
          <p>{name}</p>
          <p>{comment}</p>
          <p><TimeAgo date={date} /></p>
        </div>
      </div>
    );
  }
}

Reply.defaultProps = {
  id: '',
  name: '',
  comment: '',
  date: '',
};

Reply.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  comment: PropTypes.string,
  date: PropTypes.string,
};
