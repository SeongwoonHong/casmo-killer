import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import krStrings from 'react-timeago/lib/language-strings/ko';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';

const formatter = buildFormatter(krStrings);

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
          <p><TimeAgo date={date} formatter={formatter} /></p>
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
