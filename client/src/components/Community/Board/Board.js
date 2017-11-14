import React, { Component } from 'react';
import ReactPaginate from 'react-paginate';
import Materialize from 'materialize-css';
import Search from '../../Search/Search';
import PostList from '../../PostList/PostList';
import Button from '../../Button/Button';
import LoadingCircle from '../../Loading/LoadingCircle';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      boardId: props.match.params.boardId,
      baseUrl: props.location.pathname
    };
  }
  componentDidMount() {
    this.props.fetchPosts(this.state.boardId, this.state.page);
  }

  handlePageClick = (data) => {
    const { selected } = data;
    // const offset = Math.ceil(selected * this.state.perPage);
    this.setState({ page: selected }, () => {
      this.props.fetchPosts(this.state.boardId, this.state.page);
    });
  };

  render() {
    const { posts, loading, error } = this.props.postsList;
    const { pageCount } = this.props.pagination;

    if (loading) {
      return (
        <div className="board">
          <LoadingCircle />
        </div>
      );
    } else if (error) {
      return (
        <div className="board">
          {Materialize.toast($(`<span style="color: #00c853">Error: ${error.message}</span>`), 3000)}
        </div>
      );
    }
    return (
      <div className="board">
        <h1>{this.state.boardId}</h1>
        <Button to={`${this.props.match.url}/new`} text="New Post" />
        <PostList
          postsList={posts}
          baseUrl={this.state.baseUrl}
        />
        <Search
          onSearch={this.props.searchPosts}
          boardId={this.state.boardId}
        />
        <ReactPaginate
          previousLabel="previous"
          nextLabel="next"
          breakLabel={<a href="">...</a>}
          breakClassName="break-me"
          pageCount={pageCount}
          marginPagesDisplayed={2}
          forcePage={this.state.page}
          pageRangeDisplayed={5}
          onPageChange={this.handlePageClick}
          containerClassName="pagination"
          subContainerClassName="pages pagination"
          activeClassName="active"
        />
      </div>
    );
  }
}

export default Board;
