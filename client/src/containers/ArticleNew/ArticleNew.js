import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ArticleForm from '../../components/ArticleForm/ArticleForm';
import './ArticleNew.scss';

class ArticleNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boardId: props.match.params.id
    };
    this.cancelUrl = `/articles/${this.state.boardId}`;
  }
  validateAndCreatePost= (values) => {
    return this.props.createPostRequest(values, this.state.boardId).then(() => {
      if (this.props.newPost.status === 'SUCCESS') {
        this.props.history.push(`/article/${this.props.newPost.data._id}`).then(
          () => {
            // Materialize.toast('Success!', 2000);
          }
        );
      } else {
        // Materialize.toast($(`<span style="color: #00c853">Error: ${this.props.newPost.error.message}</span>`), 3000);
      }
    });
  }
  render() {
    return (
      <div id="article-new">
        <ArticleForm
          validateAndCreatePost={this.validateAndCreatePost}
          formType="write"
          cancelUrl={this.cancelUrl}
        />
      </div>
    );
  }
}
ArticleNew.defaultProps = {
  data: {
    tags: ''
  }
};

ArticleNew.propTypes = {
  data: PropTypes.object,
};
export default ArticleNew;
