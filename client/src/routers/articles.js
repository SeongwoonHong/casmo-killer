import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import ArticlesPage from '../containers/Articles';
import ArticleNew from '../containers/ArticleNew';
// import PostNew from './PostNew';
// import BoardNew from './BoardNew';
// import PostDetail from './PostDetail';
import Article from '../containers/Article';

class Articles extends Component {

  render() {
    return (
      <div className="articles">
        <Switch>
          {/* <Route path="/articles/:boardId/new" component={RequireAuthentication(PostNew, '/community/communityAll')} />
          <Route path="/article/:postId" component={PostDetail} /> */}
          <Route exact path="/article/:id" component={Article} />
          <Route exact path="/articles/:id/new" component={ArticleNew} />
          <Route path="/articles/:boardId" component={ArticlesPage} />
          {/* <Route path="/" component="" /> */}
        </Switch>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user.user
  };
}

export default connect(mapStateToProps)(Articles);
