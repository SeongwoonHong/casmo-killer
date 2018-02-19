import React, { Component } from 'react';
import './Search.scss';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: ''
    };
  }

  handleSearch = (event) => {
    event.preventDefault();
    this.props.onSearch(this.state.search);
  }

  handleChange = (e) => {
    this.setState({
      search: e.target.value
    });
  }

  render() {
    return (
      <div className="search-box">
        <form onSubmit={this.handleSearch}>
          <input
            type="text"
            id="search"
            placeholder="Search..."
            className=""
            value={this.state.search}
            onChange={this.handleChange}
          />
          <button type="submit">
            <img src="/search.svg" alt="search button" />
          </button>
        </form>
      </div>
    );
  }
}

export default Search;
