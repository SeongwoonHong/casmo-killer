import { connect } from 'react-redux';
import PreferencesPanel from './PreferencesPanel';

function mapStateToProps(state) {
  return {
    likes: state.posts.activePost.data.likes.length,
    disLikes: state.posts.activePost.data.disLikes.length
  };
}

export default connect(mapStateToProps, null)(PreferencesPanel);
