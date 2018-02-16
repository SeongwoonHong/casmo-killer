import React, { Component } from 'react';
import './BoardList.scss';
import Board from '../Board/Board';

class BoardList extends Component {
  render() {
    const { boardListData } = this.props;

    const mapToComponents = (listData) => {
      return listData.map((data) => {
        return (
          <Board
            id={data._id}
            toURL={`/articles/${data.boardId}`}
            managerInfo={['관리자', data.author[0].avatar, data.author[0].displayName]}
            statsFirst={data.postsCount}
            statsSecond="posts"
            title={data.boardId}
            description={data.description}
            date={data.date}
            key={data._id}
            boardIcon="true"
          />
        );
      });
    };

    return (
      <ol className="dataList">
        {mapToComponents(boardListData)}
      </ol>
    );
  }
}

export default BoardList;
