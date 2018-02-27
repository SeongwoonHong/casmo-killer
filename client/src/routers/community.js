import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
// import RequireAuthentication from '@sharedComponents/RequireAuthentication';
import CommunityAll from '../containers/CommunityAll';
// import Articles from '../containers/Articles';
// import PostNew from './PostNew';
// import BoardNew from './BoardNew';
// import PostDetail from './PostDetail';


class Community extends Component {

  render() {
    const loginCheckAndLoading = (props, type) => {
      if (this.props.user.isLoggedIn) {
        return (<CommunityAll type={type} {...props} />);
      }
      return (<Redirect to="/community/communityAll" />);
    };
    return (
      <div className="community">
        <Switch>
          <Route path="/community/communityAll" component={ CommunityAll } />
          <Route path="/community/favourites" render={props => loginCheckAndLoading(props, 'bookmark')} />
          <Route path="/community/myCommunity" render={props => loginCheckAndLoading(props, 'my')} />
          {/* <Route path="/community/newboard" component={BoardNew} /> */}
          {/* <Route path="/articles/:boardId/new" component={RequireAuthentication(PostNew, '/community/communityAll')} /> */}
          {/* <Route path="/article/:postId" component={PostDetail} /> */}
          {/* <Route path="/articles/:boardId" component={Articles} /> */}
          {/* <Route path="/" component="" /> */}
        </Switch>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(Community);
