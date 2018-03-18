import React, { Component } from 'react';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingCircle from '@sharedComponents/LoadingCircle';
import Sort from 'components/Sort/Sort';
import Search from 'components/Search/Search';
import ArticleList from 'components/ArticleList/ArticleList';
import Bookmark from 'components/Bookmark/Bookmark';
import TextButton from 'components/Button/TextButton/TextButton';
import AlignHorizontal from 'components/AlignHorizontal/AlignHorizontal';
import AlignVertical from 'components/AlignVertical/AlignVertical';
import DisplayManager from 'components/DisplayManager/DisplayManager';
import './Articles.scss';

class Articles extends Component {
  constructor(props) {
    super(props);
    // const baseUrl = props.location.pathname;
    const page = props.location.state === undefined ? 0 : parseInt(props.location.state.page, 10);
    const selected = props.location.state === undefined ? 0 : parseInt(props.location.state.selected, 10);
    const boardOId = null;
    const bookmarked = props.user.isLoggedIn ? props.user.bookmarked.includes(boardOId) : false;

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

    return this.props.fetchPostsRequest(
      this.state.boardId,
      this.state.page,
      sortInfo.listEng[sortInfo.selected]).then(() => {
      this.setState({
        boardOId: this.props.boardInfo.board,
        bookmarked: this.props.user.isLoggedIn ? this.props.user.bookmarked.includes(this.props.boardInfo.board) : false
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    this.setState({
      bookmarked: nextProps.user.isLoggedIn && nextProps.user.bookmarked.includes(this.state.boardOId),
    });
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
    this.props.bookmarkRequest(this.state.boardOId, this.props.user).then(() => {
      this.setState({
        bookmarked: !this.state.bookmarked
      });
    });
  }

  render() {
    const { data, status, error } = this.props.postsList;
    const { pageCount } = this.props.pagination;
    const { boardAuthor } = this.props;

    if (status === 'WAITING' || boardAuthor.author === null) {
      return (
        <div className="board_loading">
          <LoadingCircle color="#515151" />
        </div>
      );
    } else if (status === 'FAILURE') {
      toast.error(`${error.message}`, {
        position: toast.POSITION_TOP_RIGHT
      });
      return (
        <div className="board">
          {error.message}
        </div>
      );
    }

    return (
      <AlignVertical className="board">
        {
          this.props.user.isLoggedIn ?
            <Bookmark
              onBookmark={this.handleBookmark}
              bookmarkStat={this.state.bookmarked}
            />
           : ''
        }
        <AlignHorizontal className="board-header-first">
          <DisplayManager
            className="board-header-manager"
            authorId={this.props.boardAuthor.author._id}
            authorDisplayName={this.props.boardAuthor.author.displayName}
            authorAvatar={this.props.boardAuthor.author.avatar}
          />
          {
            this.props.user.isLoggedIn &&
            <Link
              to={`/articles/${this.state.boardId}/new`}
              className="btn-newBoard"
            >
              <TextButton>
                새 글쓰기
              </TextButton>
            </Link>
          }
        </AlignHorizontal>
        <AlignHorizontal className="board-header-second row">
          <Sort
            selected={this.state.sortInfo.selected}
            sortInfo={this.state.sortInfo.listKor}
            onSort={this.handleSortPosts} />
          <Search
            onSearch={this.handleSearchPosts}
          />
        </AlignHorizontal>
        <ArticleList
          articleListData={data}
        />
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
      </AlignVertical>
    );
  }
}

export default Articles;
