import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      boardId: props.boardId
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(event) {
    event.preventDefault();
    this.props.onSearch(this.state.search, this.state.boardId);
  }

  handleChange(e) {
    this.setState({
      search: e.target.value
    });
  }

  render() {
    return (
      <div className="search center row">
        <div className="col s12">
          <div className="row">
            <div className="input-field col s6 s12">
              <form onSubmit={this.handleSearch}>
                <i className="material-icons prefix">search</i>
                <input
                  type="text"
                  id="search"
                  className="validate"
                  value={this.state.search}
                  onChange={this.handleChange}
                />
                <label htmlFor="search">Search</label>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Search.defaultProps = {
  boardId: 'general',
  onSearch: () => {}
};

Search.propTypes = {
  boardId: PropTypes.string,
  onSearch: PropTypes.func
};

export default Search;
