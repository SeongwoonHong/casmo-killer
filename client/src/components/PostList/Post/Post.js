import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import RenderCategories from './Categories/RenderCategories';

export default class Post extends Component {
  render() {
    const {
      id, postNum, title, authorName, categories, count
    } = this.props;

    return (
      <li className="collection-item avatar" key={id}>
        <p>
          <span className="number">#{postNum}</span><br />
          <Link to={`/community/post/${id}`}><span className="title">{title}</span></Link><span>View {count}</span>
        </p>
        <a href="#!" className="secondary-content">{authorName}</a>
        <RenderCategories categories={categories} />
      </li>
    );
  }
}
