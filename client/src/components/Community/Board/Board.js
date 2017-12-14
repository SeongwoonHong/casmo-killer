import React, { Component } from 'react';
import ReactPaginate from 'react-paginate';
import Materialize from 'materialize-css';
import { Link } from 'react-router-dom';
import Search from '../../Search/Search';
import PostList from '../../PostList/PostList';
import LoadingCircle from '../../Loading/LoadingCircle';
import BreadCrumbs from '../../BreadCrumbs/BreadCrumbs';
import './Board.scss';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      boardId: props.match.params.boardId,
      currentUrl: props.location.pathname
    };
  }

  componentDidMount() {
    this.props.fetchPostsRequest(this.state.boardId, this.state.page);
  }

  shouldComponentUpdate(nextProps) {
    const update = JSON.stringify(this.props) !== JSON.stringify(nextProps);
    return update;
  }

  handlePageClick = (data) => {
    const { selected } = data;

    this.setState({ page: selected }, () => {
      this.props.fetchPostsRequest(this.state.boardId, this.state.page);
    });
  };

  render() {
    const { data, status, error } = this.props.postsList;
    const { pageCount } = this.props.pagination;

    if (status === 'WAITING') {
      return (
        <div className="board_loading">
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
        <BreadCrumbs url={this.state.currentUrl} />
        <div className="board_newPost right">
          <Link className="btn-floating btn-large teal" to={this.props.user.isLoggedIn ? `${this.props.match.url}/new` : `${this.props.match.url}`}>
            <i className="large material-icons">mode_edit</i>
          </Link>
        </div>
        <div className="row">
          <div className="board_search col s12 m12 l5 offset-l7">
            <Search
              onSearch={this.props.searchPostsRequest}
              boardId={this.state.boardId}
            />
          </div>
        </div>
        <div className="board_postList">
          <PostList
            postsList={data}
            baseUrl={this.state.currentUrl}
          />
        </div>
        <div className="board_page center">
          <ReactPaginate
            previousLabel="<"
            nextLabel=">"
            breakLabel="..."
            breakClassName="break-me"
            pageCount={pageCount}
            marginPagesDisplayed={2}
            forcePage={this.state.page}
            pageRangeDisplayed={5}
            onPageChange={this.handlePageClick}
            containerClassName="pagination"
            pageClassName="waves-effect"
            subContainerClassName="pages pagination"
            activeClassName="active"
          />
        </div>
      </div>
    );
  }
}

export default Board;
