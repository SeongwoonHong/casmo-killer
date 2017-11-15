import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
    this.props.onReply(this.state.comment, this.props.postId);
    this.setState({
      comment: ''
    });
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
          <a
            onClick={this.handleReply}
            onKeyDown={this.handleReply}
            role="button"
            tabIndex={0}
          >{this.props.btnName}
          </a>
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
