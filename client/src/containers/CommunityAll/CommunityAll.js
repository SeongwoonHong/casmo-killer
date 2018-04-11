import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { Link, withRouter } from 'react-router-dom';
import LoadingCircle from '@sharedComponents/LoadingCircle';
import BoardList from '../../components/BoardList/BoardList';
import Search from '../../components/Search/Search';
import AlignHorizontal from '../../components/AlignHorizontal/AlignHorizontal';
import AlignVertical from '../../components/AlignVertical/AlignVertical';
import TextButton from '../../components/Button/TextButton/TextButton';
import './CommunityAll.scss';

class CommunityAll extends Component {

  componentDidMount() {
    this.props.fetchBoardsRequest(this.props.user._id, this.props.type);
  }

  shouldComponentUpdate(nextProps) {
    const update = JSON.stringify(this.props) !== JSON.stringify(nextProps);
    return update;
  }

  componentDidUpdate(prevProps) {
    if (prevProps === undefined) {
      return false;
    }
    if (this.props.match.path !== prevProps.match.path) {
      this.props.fetchBoardsRequest(this.props.user._id, this.props.type);
    }
  }

  componentWillUnmount() {
    this.props.resetBoardList();
  }

  handleSearchBoards = (searchWord) => {
    this.props.searchBoardsRequest(this.props.user._id, this.props.type, searchWord);
    // const { sortInfo } = this.state;

    // this.props.searchPostsRequest(searchWord, boardId, page, sortInfo.listEng[sortInfo.selected]);
  }

  render() {
    const { data, status, error } = this.props.boardList;

    if (status === 'WAITING' || status === 'INIT') {
      return (
        <div className="community">
          <LoadingCircle />
        </div>
      );
    } else if (error) {
      toast.error(`${error.message}`, {
        position: toast.POSITION_TOP_RIGHT
      });
      return (
        <div className="community">
          {error.message}
        </div>
      );
    }
    return (
      <AlignVertical className="community">
        <AlignHorizontal className="community-horizontal-block">
          {
            this.props.user.isLoggedIn &&
            <Link
              to="/community/new"
              className="btn newBoard"
            >
              <TextButton>
                새 게시판
              </TextButton>
            </Link>
          }
          <Search
            className="community-searchbar"
            onSearch={this.handleSearchBoards}
          />
        </AlignHorizontal>
        <BoardList
          className="boardList"
          boardListData={data}
        />
      </AlignVertical>
    );
  }
}

export default withRouter(CommunityAll);
