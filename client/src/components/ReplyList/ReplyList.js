import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Reply from './Reply';

class ReplyList extends Component {

  render() {
    const { comments } = this.props;
    const mapToComponents = (data) => {
      return data.map((comment) => {
        return (
          <Reply
            name={comment.name}
            comment={comment.memo}
            date={comment.date}
            id={comment.date}
            key={comment.date}
          />
        );
      });
    };

    return (
      <div>
        {mapToComponents(comments)}
      </div>
    );
  }
}

ReplyList.defaultProps = {
  comments: []
};

ReplyList.propTypes = {
  comments: PropTypes.array,
};

export default ReplyList;
