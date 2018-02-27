import React, { Component } from 'react';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
// import LoadingCircle from 'sharedComponents/LoadingCircle';
import Sort from '../../components/Sort/Sort';
import Search from '../../components/Search/Search';
import ArticleList from '../../components/ArticleList/ArticleList';
import Bookmark from '../../components/Bookmark/Bookmark';
import './Articles.scss';

class Articles extends Component {
  constructor(props) {
    super(props);
    // const baseUrl = props.location.pathname;
    const page = props.location.state === undefined ? 0 : parseInt(props.location.state.page, 10);
    const selected = props.location.state === undefined ? 0 : parseInt(props.location.state.selected, 10);
    const boardOId = props.location.state === undefined ? '' : props.location.state.boardOId;
    const bookmarked = props.user.isLoggedIn ? props.user.bookmarked.includes(boardOId) : false;
    console.log(props.user);

    this.state = {
      page,
      boardId: props.match.params.boardId,
      boardOId,
      // baseUrl,
      bookmarked,
      sortInfo: {
        selected,
        listKor: ['최신순', '댓글순', '조회순'],
        listEng: ['date', 'comments', 'count']
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

  handleSearchPosts = (searchWord) => {
    const { sortInfo } = this.state;

    this.props.searchPostsRequest(searchWord, this.state.boardId, this.state.page, sortInfo.listEng[sortInfo.selected]);
  }

  handleBookmark = () => {
    this.props.bookmarkRequest(this.state.boardOId, this.props.user);
  }

  render() {
    const { data, status, error } = this.props.postsList;
    const { pageCount } = this.props.pagination;
    const { boardAuthor } = this.props;

    if (status === 'WAITING' || boardAuthor.author === null) {
      return (
        <div className="board_loading">
          {/* <LoadingCircle /> */}
        </div>
      );
    } else if (status === 'FAILURE') {
      // Materialize.toast($(`<span style="color: #00c853">Error: ${error.message}</span>`), 3000);
      return (
        <div className="board">
          {error.message}
        </div>
      );
    }

    return (
      <div className="board">
        <div className="row">
          <div className="board-bookmark">
            {
              this.props.user.isLoggedIn ?
                <Bookmark
                  onBookmark={this.handleBookmark}
                  bookmarkStat={this.state.bookmarked}
                />
               : ''
            }
          </div>
        </div>
        <div className="row">
          <div className="board-header">
            <div className="board-header-manager">
              관리자:
              <div className="user-btn">
                <Link
                  to={`/user/info/${this.props.boardAuthor.author._id}`}
                  >
                  {this.props.boardAuthor.author.displayName}
                </Link>
              </div>
            </div>
            {
              this.props.user.isLoggedIn &&
              <Link
                className="btn-newboard"
                name="action"
                // to={`${this.props.location.pathname}/newBoard`}
                to=""
                text="New Board"
                style={{ display: 'inline-block', width: '40%' }}
              >
                <img className="btn-newboard" src="/new.svg" alt="new board button" />
              </Link>
            }
          </div>
        </div>
        <div className="board-side row">
          <div className="board-side-sort">
            <Sort
              selected={this.state.sortInfo.selected}
              sortInfo={this.state.sortInfo.listKor}
              onSort={this.handleSortPosts} />
          </div>
          <div className="board-side-searchbar">
            <Search
              onSearch={this.handleSearchPosts}
            />
          </div>
        </div>
        <div className="row">
          <ArticleList
            articleListData={data}
          />
        </div>
        {/* <div className="board_postList">
          <PostList
            postsList={data}
            page={this.state.page}
            selected={this.state.sortInfo.selected}
            openUserInfoModal={this.props.openUserInfoModal}
          />
        </div> */}
        <div className="board-page">
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
            pageClassName="pagination-page"
            subContainerClassName="pages pagination"
            activeClassName="active"
          />
        </div>
      </div>
    );
  }
}

export default Articles;
