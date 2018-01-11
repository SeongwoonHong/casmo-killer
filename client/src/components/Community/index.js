import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import RequireAuthentication from 'sharedComponents/RequireAuthentication';
import CommunityHome from './Root';
import Board from './Board';
import PostNew from './PostNew';
import BoardNew from './BoardNew';
import PostDetail from './PostDetail';


class CommunityWrapper extends Component {

  render() {
    const loginCheckAndLoading = (props, type) => {
      if (this.props.user.isLoggedIn) {
        return (<CommunityHome type={type} {...props} />);
      }
      return (<Redirect to="/community/communityAll" />);
    };
    return (
      <div className="community">
        <Switch>
          <Route path="/community/communityAll" component={ CommunityHome } />
          <Route path="/community/favourites" render={props => loginCheckAndLoading(props, 'bookmark')} />
          <Route path="/community/myCommunity" render={props => loginCheckAndLoading(props, 'my')} />
          <Route path="/community/newboard" component={BoardNew} />
          <Route path="/community/:boardId/new" component={RequireAuthentication(PostNew, '/community/communityAll')} />
          <Route path="/community/:boardId/:postId" component={PostDetail} />
          <Route path="/community/:boardId" component={Board} />
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

export default connect(mapStateToProps)(CommunityWrapper);
