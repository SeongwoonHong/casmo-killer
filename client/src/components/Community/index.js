import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Route, Switch } from 'react-router-dom';
import { postListRequest } from '../../actions/post';
import PostsNew from './post_new';
import PostsShow from './post_show';
import PostList from './PostList';

class PostsIndex extends Component {
  componentDidMount() {
    this.props.postListRequest(true, undefined, undefined, this.props.username).then(

    );
  }

  render() {
    return (
      <div>
        <Switch>
          <Route
            exact
            path={this.props.match.url}
            render={() => (
              <div>
                <Link className="btn-floating btn-large teal" to={`${this.props.match.url}/new`}>
                  <i className="large material-icons">mode_edit</i>
                </Link>
                <h3>Posts</h3>
                <PostList
                  data={this.props.postData}
                  url={this.props.match.url}
                />
              </div>
            )}
          />
          <Route path={`${this.props.match.url}/new`} component={PostsNew} />
          <Route path={`${this.props.match.url}/:id`} component={PostsShow} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    postStatus: state.posts.post,
    postData: state.posts.list.data,
  };
};

export default connect(mapStateToProps, { postListRequest })(PostsIndex);
