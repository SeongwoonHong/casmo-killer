import React, { Component } from 'react';
import ReactPaginate from 'react-paginate';
import Materialize from 'materialize-css';
import { Link } from 'react-router-dom';
import LoadingCircle from 'sharedComponents/LoadingCircle';
import PlainBtn from 'sharedComponents/PlainBtn';
import Search from '../../Search/Search';
import PostList from '../../PostList/PostList';
import BreadCrumbs from '../../BreadCrumbs/BreadCrumbs';
import Sort from '../../Sort/Sort';
import './Board.scss';

class Board extends Component {
  constructor(props) {
    super(props);
    console.log(props.user);
    const baseUrl = props.location.pathname;
    const page = props.location.state === undefined ? 0 : props.location.state.page;
    const selected = props.location.state === undefined ? 0 : props.location.state.selected;
    const boardOId = props.location.state === undefined ? '' : props.location.state.boardOId;
    const bookmarked = props.user.isLoggedIn ? props.user.bookmarked.includes(boardOId) : false;

    this.state = {
      page,
      boardId: props.match.params.boardId,
      boardOId,
      baseUrl,
      bookmarked,
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

  bookmarkClick = () => {
    this.setState({ bookmarked: !this.state.bookmarked });
    this.props.bookmarkRequest(this.state.boardOId, this.props.user);
  }

  render() {
    const { data, status, error } = this.props.postsList;
    const { pageCount } = this.props.pagination;
    const { boardAuthor } = this.props;

    if (status === 'WAITING' || boardAuthor.author === null) {
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
          <div className="col s12">
            <div className="board_breadcrumbs col s10 m11 l11">
              <BreadCrumbs url={this.state.baseUrl} />
            </div>
            <div className="col s2 m1 l1">
              {
                this.props.user.isLoggedIn ?
                  <i
                    className="material-icons bookmark"
                    role="presentation"
                    onClick={this.bookmarkClick}
                    onKeyDown={ () => {} }> {this.state.bookmarked ? 'bookmark' : 'bookmark_border'}
                  </i>
                : ''
              }
            </div>
          </div>
          <div className="board_header">
            <div className="board_newPost col s12">
              <div className="board_header_manager">
                관리자:
                <div className="user-btn">
                  <PlainBtn
                    onClick={
                      () => { this.props.openUserInfoModal(this.props.boardAuthor.author); }
                    }
                  >
                    <a href="#">{this.props.boardAuthor.author ? this.props.boardAuthor.author.displayName : null}</a>
                  </PlainBtn>
                </div>
              </div>
              {
                this.props.user.isLoggedIn &&
                <Link
                  className="btn-floating btn-large teal right"
                  to={`${this.state.baseUrl}/new`}>
                  <i className="large material-icons">mode_edit</i>
                </Link>
              }
            </div>
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
            openUserInfoModal={this.props.openUserInfoModal}
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
