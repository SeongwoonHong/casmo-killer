import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import RequireAuthentication from 'sharedComponents/RequireAuthentication/RequireAuthentication';
import CommunityHome from './Root';
import Board from './Board';
import PostNew from './PostNew';
import BoardNew from './BoardNew';
import PostDetail from './PostDetail';


class CommunityWrapper extends Component {

  render() {
    return (
      <div className="community">
        <Switch>
          <Route path="/community/communityAll" component={ CommunityHome } />
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

export default CommunityWrapper;
