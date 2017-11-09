import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class RenderCategories extends Component {
  render() {
    const { categories } = this.props;
    return categories.map((c) => {
      c = c.trim();
      return (
        <Link to={`filter/${c}`} key={c} className="list-group-item-text">{` ${c} `}</Link>
      );
    });
  }
}
