import React, { Component } from 'react';
import ReactPaginate from 'react-paginate';
import Materialize from 'materialize-css';
import { Link } from 'react-router-dom';
import Search from '../../Search/Search';
import PostList from '../../PostList/PostList';
import LoadingCircle from '../../Loading/LoadingCircle';
import BreadCrumbs from '../../BreadCrumbs/BreadCrumbs';
import Sort from '../../Sort/Sort';
import './Board.scss';

class Board extends Component {
  constructor(props) {
    super(props);
    const baseUrl = props.location.pathname;
    const page = props.location.state === undefined ? 0 : props.location.state.page;
    const selected = props.location.state === undefined ? 0 : props.location.state.selected;

    this.state = {
      page,
      boardId: props.match.params.boardId,
      baseUrl,
      sortInfo: {
        selected,
        listKor: ['최신순', '댓글순', '조회순'],
        listEng: ['date', 'commentsCount', 'count']
      }
    };
  }

  componentDidMount() {
    const { sortInfo } = this.state;

    this.props.fetchPostsRequest(
      this.state.boardId,
      this.state.page,
      sortInfo.listEng[sortInfo.selected]);
  }

  shouldComponentUpdate(nextProps) {
    const update = JSON.stringify(this.props) !== JSON.stringify(nextProps);
    return update;
  }

  handlePageClick = (data) => {
    const { selected } = data;
    const { sortInfo } = this.state;

    this.setState({ page: selected }, () => {
      this.props.fetchPostsRequest(
        this.state.boardId,
        this.state.page,
        sortInfo.listEng[sortInfo.selected]);
    });
  };

  handleSortPosts = (index) => {
    this.setState({ sortInfo: { ...this.state.sortInfo, selected: index }, page: 0 });
    this.props.fetchPostsRequest(
      this.state.boardId,
      0,
      this.state.sortInfo.listEng[index]);
  };

  handleSearchPosts = (searchWord, boardId, page) => {
    const { sortInfo } = this.state;

    this.props.searchPostsRequest(searchWord, boardId, page, sortInfo.listEng[sortInfo.selected]);
  }

  render() {
    const { data, status, error } = this.props.postsList;
    const { pageCount } = this.props.pagination;

    if (status === 'WAITING') {
      return (
        <div className="board_loading">
          <LoadingCircle />
        </div>
      );
    } else if (status === 'FAILURE') {
      Materialize.toast($(`<span style="color: #00c853">Error: ${error.message}</span>`), 3000);
      return (
        <div className="board">
          {error.message}
        </div>
      );
    }

    return (
      <div className="board">
        <div className="row">
          <div className="board_breadcrumbs">
            <BreadCrumbs url={this.state.baseUrl} />
          </div>
          <div className="board_newPost col s12">
            <Link
              className="btn-floating btn-large teal right"
              to={`${this.state.baseUrl}/new`}>
              <i className="large material-icons">mode_edit</i>
            </Link>
          </div>
        </div>
        <div className="board_side row valign-wrapper">
          <div className="board_sort col s12">
            <Sort
              selected={this.state.sortInfo.selected}
              sortInfo={this.state.sortInfo.listKor}
              onSort={this.handleSortPosts} />
          </div>
          <div className="board_search col s12">
            <Search
              onSearch={this.props.searchPostsRequest}
              boardId={this.state.boardId}
            />
          </div>
        </div>
        <div className="board_postList">
          <PostList
            postsList={data}
            baseUrl={this.state.baseUrl}
            page={this.state.page}
            selected={this.state.sortInfo.selected}
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
