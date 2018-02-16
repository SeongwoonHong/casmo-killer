import React, { Component } from 'react';
import Materialize from 'materialize-css';
import { Link, withRouter } from 'react-router-dom';
import BoardList from '../../components/BoardList/BoardList';
import Search from '../../components/Search/Search';
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

    // const mapToComponents = (boardData) => {
    //   return boardData.map((board) => {
    //     return (
    //       <div className="col s12 m6 l4" key={board.boardId}>
    //         <div className="card teal darken-3">
    //           <div className="card-content white-text board-card">
    //             <span className="card-title">{board.boardId}</span>
    //             <p>{board.description}</p>
    //           </div>
    //           <div className="card-action">
    //             <Link to={{
    //               pathname: `/articles/${board.boardId}`,
    //               state: { page: 0, selected: 0, boardOId: board._id }
    //               }}>들어가기
    //             </Link>
    //           </div>
    //         </div>
    //       </div>
    //     );
    //   });
    // };

    if (status === 'WAITING' || status === 'INIT') {
      return (
        <div className="community">
          Loading
        </div>
      );
    } else if (error) {
      Materialize.toast($(`<span style="color: #00c853">Error: ${error.message}</span>`), 3000);
      return (
        <div className="community">
          {error.message}
        </div>
      );
    }

    return (
      <div className="community">
        {
          // this.props.user.isLoggedIn &&
          <Link
            className="btn waves-effect teal waves-light newBoard"
            name="action"
            to={`${this.props.location.pathname}/newBoard`}
            text="New Board"
            style={{ display: 'inline-block', width: '40%' }}
          >
            <img className="btn-newboard" src="/new.svg" alt="new board button" />
          </Link>
        }
        <div className="community-searchbar">
          <Search
            onSearch={this.handleSearchBoards}
          />
        </div>
        <div className="row">
          {/* {mapToComponents(data)} */}
          <BoardList boardListData={data} />
        </div>
      </div>
    );
  }
}

export default withRouter(CommunityAll);
