import { connect } from 'react-redux';
import * as actions from '@actions';
import ArticlesNew from './ArticlesNew';

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    newBoard: state.boards.newBoard
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createBoardRequest: (values) => {
      return dispatch(actions.createBoardRequest(values));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticlesNew);
