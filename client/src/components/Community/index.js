import { connect } from 'react-redux';
import { fetchBoards, fetchBoardsSuccess, fetchBoardsFailure } from '../../actions/post';
import Community from './Community';

const mapStateToProps = (state) => {
  return {
    boardsList: state.posts.boardsList
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchBoards: () => {
      dispatch(fetchBoards()).then((response) => {
        !response.error ?
          dispatch(fetchBoardsSuccess(response.payload.data)) :
          dispatch(fetchBoardsFailure(response.payload.data));
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Community);
