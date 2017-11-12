import { connect } from 'react-redux';
import { fetchReply, fetchReplySuccess, fetchReplyFailure } from '../../actions/post';
import ReplyList from './ReplyList';

const mapStateToProps = (state) => {
  return {
    postsList: state.posts.postsList,
    pagination: state.posts.pagination
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPosts: () => {
      // if (page === null || page === undefined) {
      //   page = 1;
      // } else {
      //   page += 1;
      // }
      dispatch(fetchReply()).then((response) => {
        console.log(response);
        !response.error ?
          dispatch(fetchReplySuccess(response.payload.data)) :
          dispatch(fetchReplyFailure(response.payload.data));
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReplyList);
