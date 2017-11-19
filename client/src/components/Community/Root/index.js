import { connect } from 'react-redux';
import * as actions from '../../../actions/post';
import Community from './Community';

const mapStateToProps = (state) => {
  return {
    boardList: state.posts.boardList
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchBoardsRequest: () => {
      dispatch(actions.fetchBoardsRequest());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Community);
