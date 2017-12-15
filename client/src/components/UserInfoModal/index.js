import { connect } from 'react-redux';
import * as actions from 'actions';

import UserInfoModal from './UserInfoModal';

function mapStateToProps(state) {
  return {
    userInfo: state.user.userModalInfo,
    userPostsList: state.posts.userList,
    userPagination: state.posts.userPagination
  };
}

function mapDispatchToProps(dispatch) {
  return {
    closeUserInfoModal: () => dispatch(actions.closeUserInfoModal()),
    searchPostsRequest: (searchWord, page) => {
      if (page === null || page === undefined) {
        page = 1;
      } else {
        page += 1;
      }
      dispatch(actions.searchPostsRequest(searchWord, null, page));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInfoModal);
