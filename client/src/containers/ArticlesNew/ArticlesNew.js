import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ArticlesForm from '../../components/ArticlesForm/ArticlesForm';
import './ArticlesNew.scss';

class ArticlesNew extends Component {

  validateAndCreateBoard= (values) => {
    return this.props.createBoardRequest(values).then(() => {
      if (this.props.newBoard.status === 'SUCCESS') {
        this.props.history.push({ pathname: `/articles/${this.props.newBoard.data.boardId}` }).then(
          () => {
            // Materialize.toast('Success!', 2000);
          }
        );

      } else {
        // Materialize.toast($(`<span style="color: #00c853">Error: ${this.props.newBoard.error.message}</span>`), 3000);
      }
    });
  }
  render() {
    return (
      <ArticlesForm
        className="articles-new"
        validateAndCreateBoard={this.validateAndCreateBoard}
        formType="write"
        cancelUrl="/community/communityAll"
      />
    );
  }
}
ArticlesNew.defaultProps = {
  data: {
    tags: ''
  }
};

ArticlesNew.propTypes = {
  data: PropTypes.object,
};
export default ArticlesNew;
