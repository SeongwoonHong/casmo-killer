import { connect } from 'react-redux';
import * as actions from '@actions';

import Info from './Info';

function mapStateToProps(state) {
  return {
    user: state.user.user,
    activityList: state.activity.list,
    listStatus: state.activity.list.status,
    isLast: state.activity.list.isLast
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchActivityRequest: (isInitial, listType, id, userId) => {
      return dispatch(actions.fetchActivityRequest(isInitial, listType, id, userId));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Info);
