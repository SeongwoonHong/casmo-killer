import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import './ArticlesNew.scss';

import ArticlesForm from '../../components/ArticlesForm/ArticlesForm';

class ArticlesNew extends Component {

  validateAndCreateBoard = (values) => {

    this.props.createBoardRequest(values).then(() => {

      if (this.props.newBoard.status === 'SUCCESS') {

        this.props.history.push({
          pathname: `/articles/${this.props.newBoard.data.boardId}`
        });

        toast.info('Success!', {
          position: toast.POSITION_TOP_RIGHT
        });

      } else {

        toast.error(`${this.props.newBoard.error.message}`, {
          position: toast.POSITION_TOP_RIGHT
        });

      }

    });

  };

  render() {
    return (
      <ArticlesForm
        className="articles-new"
        validateAndCreateBoard={ this.validateAndCreateBoard }
        formType="write"
        cancelUrl="/community/communityAll" />
    );
  }
}

ArticlesNew.defaultProps = {
  data: {
    tags: ''
  }
};

ArticlesNew.propTypes = {
  data: PropTypes.object
};

export default ArticlesNew;
