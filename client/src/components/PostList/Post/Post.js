import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
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
          <Link to={`${this.props.baseUrl}/show/${id}`}><span className="title">{title}</span></Link><span> View {count}</span>
        </p>
        <a href="#!" className="secondary-content">{authorName}</a>
        <RenderCategories categories={categories} />
      </li>
    );
  }
}

Post.defaultProps = {
  id: '',
  postNum: 0,
  title: '',
  authorName: '',
  categories: [],
  count: 0
};

Post.propTypes = {
  id: PropTypes.string,
  postNum: PropTypes.number,
  title: PropTypes.string,
  authorName: PropTypes.string,
  categories: PropTypes.array,
  count: PropTypes.number
};
