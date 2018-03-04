import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
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
        toast.success('Success!', {
          position: toast.POSITION_TOP_RIGHT
        });
        this.props.history.replace(`/article/${this.props.newPost.data._id}`);
      } else {
        toast.error('Something went wrong', {
          position: toast.POSITION_TOP_RIGHT
        });
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
