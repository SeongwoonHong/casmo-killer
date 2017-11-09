import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import RenderCategories from './Categories/RenderCategories';

export default class RenderPosts extends Component {
  render() {
    const { posts } = this.props;

    return posts.map((post) => {
      return (
        <li className="collection-item avatar" key={post._id}>
          <p>
            <span className="number">#{post.postNum}</span><br />
            <Link to={`/community/post/${post._id}`}><span className="title">{post.title}</span></Link>
          </p>
          <a href="#!" className="secondary-content">{post.authorName}</a>
          <RenderCategories categories={post.categories} />
        </li>
      );
    });
  }
}
