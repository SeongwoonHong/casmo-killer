import React, { Component } from 'react';
import './BoardList.scss';
import Board from '../Board/Board';

class BoardList extends Component {

  static isMobileDevice() {

    return navigator.userAgent.match(/Android/i)
           || navigator.userAgent.match(/webOS/i)
           || navigator.userAgent.match(/iPhone/i)
           || navigator.userAgent.match(/iPad/i)
           || navigator.userAgent.match(/iPod/i)
           || navigator.userAgent.match(/BlackBerry/i)
           || navigator.userAgent.match(/Windows Phone/i);

  }

  render() {

    const { boardListData, className } = this.props;

    const mapToComponents = (listData) => {
      return listData.map((data) => {
        return (
          <Board
            id={ data._id }
            toURL={ `/articles/${data.boardId}` }
            managerInfo={ ['관리자', data.author.avatar, data.author.displayName, data.author._id] }
            statsFirst={ data.postsCount }
            statsSecond="posts"
            title={ data.boardId }
            description={ data.description }
            date={ data.date }
            key={ data._id }
            boardIcon="true"
            page="0"
            selected="0"
            mobile={ BoardList.isMobileDevice() }
          />
        );
      });
    };

    return (
      <div className={ className }>
        { mapToComponents(boardListData) }
      </div>
    );

  }

}

export default BoardList;
