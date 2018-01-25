import React, { Component } from 'react';
import './Sort.scss';

class Sort extends Component {
  constructor(props) {
    super(props);
    this.handleSort = this.handleSort.bind(this);
  }

  handleSort(value) {
    this.props.onSort(value);
  }

  render() {
    const { sortInfo, selected } = this.props;
    const renderSortList = (data) => {
      return data.map((sort, index) => {
        return (
          <li key={sort}>
            <a
              className={selected === index ? 'active' : ''}
              onClick={() => this.handleSort(index)}
              onKeyDown={() => this.handleSort(index)}
              tabIndex={0}
              role="button"
              >{sort}
            </a>
          </li>
        );
      });
    };
    return (
      <div className="sort_wrapper">
        <ul className="sort_list">
          {renderSortList(sortInfo)}
        </ul>
      </div>
    );
  }
}

export default Sort;
