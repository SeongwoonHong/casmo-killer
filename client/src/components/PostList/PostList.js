import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactLoading from 'react-loading';
import ReactPaginate from 'react-paginate';
import Post from './Post/Post';
import Search from '../Search/Search';
// import Pagination from '../Pagination/Pagination';

class PostList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0
    };
  }
  componentDidMount() {
    this.props.fetchPosts(this.state.page);
  }

  handlePageClick = (data) => {
    const { selected } = data;
    // const offset = Math.ceil(selected * this.state.perPage);
    console.log(data);
    this.setState({ page: selected }, () => {
      this.props.fetchPosts(this.state.page);
    });
  };

  render() {
    const { posts, loading, error } = this.props.postsList;
    const { pageCount } = this.props.pagination;
    const mapToComponents = (data) => {
      return data.map((post) => {
        return (
          <Post
            id={post._id}
            postNum={post.postNum}
            authorName={post.authorName}
            categories={post.categories}
            title={post.title}
            count={post.count}
            key={post._id}
          />
        );
      });
    };

    if (loading) {
      return (
        <div className="container">
          <ReactLoading type="spin" color="#008081" />
        </div>
      );
    } else if (error) {
      return (
        <div className="container">
          <div className="alert alert-danger">Error: {error.message}</div>
        </div>
      );
    }
    return (
      <div className="container">
        <h1>Posts</h1>
        <ul className="nav  nav-pills navbar-right">
          <li role="presentation">
            <Link to="/community/post/new">
              New Post
            </Link>
          </li>
        </ul>
        <ul className="collection">
          {mapToComponents(posts)}
        </ul>
        <Search onSearch={this.props.searchPosts} />
        <ReactPaginate
          previousLabel="previous"
          nextLabel="next"
          breakLabel={<a href="">...</a>}
          breakClassName="break-me"
          pageCount={pageCount}
          marginPagesDisplayed={2}
          forcePage={this.state.page}
          pageRangeDisplayed={5}
          onPageChange={this.handlePageClick}
          containerClassName="pagination"
          subContainerClassName="pages pagination"
          activeClassName="active"
        />
      </div>
    );
  }
}

export default PostList;
