import { connect } from 'react-redux';
import { fetchBoardsRequest } from '../../actions/post';
import Community from './Community';

const mapStateToProps = (state) => {
  return {
    boardsList: state.posts.boardList
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchBoardsRequest: () => {
      dispatch(fetchBoardsRequest());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Community);
