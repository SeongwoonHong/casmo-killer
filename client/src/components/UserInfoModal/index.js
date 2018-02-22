import { connect } from 'react-redux';
import * as actions from '@actions';

import UserInfoModal from './UserInfoModal';

function mapStateToProps(state) {
  return {
    userInfo: state.user.userModalInfo,
    userPostsList: state.posts.userList,
    userPostsListByTag: state.user.tagsList.data,
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
    },
    openUserInfoModal: (userInfo) => {
      dispatch(actions.openUserInfoModal(userInfo));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInfoModal);
