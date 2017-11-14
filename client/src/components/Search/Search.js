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

  handleChange(e) {
    this.setState({
      search: e.target.value
    });
  }

  handleSearch() {
    this.props.onSearch(this.state.search, this.state.boardId);
  }

  render() {
    return (
      <div className="center row">
        <div className="col s12">
          <div className="row">
            <div className="input-field col s6 s12">
              <i className="material-icons prefix">
                <a
                  onClick={this.handleSearch}
                  onKeyDown={this.handleSearch}
                  role="button"
                  tabIndex={0}
                >search
                </a>
              </i>
              <input
                type="text"
                className="validate"
                placeholder="Write down your search word"
                value={this.state.search}
                onChange={this.handleChange}
              />
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
