import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class postList extends Component {
  shouldComponentUpdate(nextProps) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps);
  }

  render() {
    const mapToComponents = (data) => {
      return _.map(data, (post) => {
        return (
          <li className="collection-item avatar" key={post._id}>
            <p>
              <span className="number">#{post.postNum}</span><br />
              <Link to={`${this.props.url}/${post._id}`}><span className="title">{post.title}</span></Link>
            </p>
            <a href="#!" className="secondary-content">{post.writer}</a>
          </li>
        );
      });
    };
    return (
      <ul className="collection">
        {mapToComponents(this.props.data)}
      </ul>
    );
  }
}

export default postList;
