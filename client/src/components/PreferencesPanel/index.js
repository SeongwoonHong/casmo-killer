import { connect } from 'react-redux';
import PreferencesPanel from './PreferencesPanel';
// import * as actions from '../../actions';
//
function mapStateToProps(state) {
  return {
    likes: state.posts.activePost.data.likes.length,
    disLikes: state.posts.activePost.data.disLikes.length
  };
}
// function mapDispatchToProps(dispatch) {
//   return {
//
//   };
// }
export default connect(mapStateToProps, null)(PreferencesPanel);
