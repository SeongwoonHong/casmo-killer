import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ArticleList.scss';
import Board from '../Board/Board';

class ArticleList extends Component {
  render() {
    const { articleListData } = this.props;

    const mapToComponents = (listData) => {
      return listData.map((data) => {
        return (
          <Board
            id={data._id}
            toURL={`/article/${data._id}`}
            managerInfo={['작성자', data.author.avatar, data.author.displayName, data.author._id]}
            statsFirst={`${data.comments.length} replies`}
            statsSecond={`${data.count} views`}
            title={data.title}
            description=""
            date={data.date}
            key={data._id}
            boardIcon="false"
            closeAndRedirect={this.props.closeAndRedirect}
            closeUserInfoModal={this.props.closeUserInfoModal}
          />
        );
      });
    };

    return (
      <ol className="dataList">
        {mapToComponents(articleListData)}
      </ol>
    );
  }
}

ArticleList.defaultProps = {
  closeAndRedirect: false,
  closeUserInfoModal: () => {}
};
ArticleList.propTypes = {
  closeAndRedirect: PropTypes.bool,
  closeUserInfoModal: PropTypes.func
};

export default ArticleList;
