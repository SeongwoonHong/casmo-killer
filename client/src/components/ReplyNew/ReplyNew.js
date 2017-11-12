import React, { Component } from 'react';

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
          <label htmlFor="reply">댓글</label>
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
          >Save
          </a>
        </div>
      </div>
    );
  }
}

export default ReplyNew;
