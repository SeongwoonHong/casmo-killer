import React, { Component } from 'react';

export default class Post extends Component {
  render() {
    const {
      id, name, comment, date
    } = this.props;

    return (
      <div className="card">
        <div className="card-content" key={id}>
          <p>{name}</p>
          <p>{comment}</p>
          <p>{date}</p>
        </div>
      </div>
    );
  }
}
