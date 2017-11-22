import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';

class ReplyNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleReply = this.handleReply.bind(this);
  }

  handleChange(e) {
    this.setState({
      comment: e.target.value
    });
  }

  handleReply() {
    if (this.state.comment.trim() !== '') {
      this.props.onReply(this.state.comment, this.props.postId);
      this.setState({
        comment: ''
      });
    }
  }

  render() {
    return (
      <div className="card">
        <div className="card-content">
          <label htmlFor="reply">{this.props.title}</label>
          <textarea
            id="reply"
            className="materialize-textarea"
            value={this.state.comment}
            onChange={this.handleChange}
          />
        </div>
        <div className="card-action">
          <Button
            onClick={this.handleReply}
            onKeyDown={this.handleReply}
            className="btn waves-effect teal waves-light"
            role="button"
            tabIndex={0}
            text={this.props.btnName}
            isLink={false}
          />
        </div>
      </div>
    );
  }
}

ReplyNew.defaultProps = {
  postId: '',
  title: '',
  btnName: 'Save',
  onReply: () => {}
};

ReplyNew.propTypes = {
  postId: PropTypes.string,
  title: PropTypes.string,
  btnName: PropTypes.string,
  onReply: PropTypes.func
};

export default ReplyNew;
