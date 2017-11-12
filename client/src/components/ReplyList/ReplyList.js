import React, { Component } from 'react';
// import ReactLoading from 'react-loading';
import Reply from './Reply';
// import ReactPaginate from 'react-paginate';

class ReplyList extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     page: 0
  //   };
  // }
  componentDidMount() {
    // this.props.fetchPosts(this.state.page);
  }

  // handlePageClick = (data) => {
  //   const { selected } = data;
  //   // const offset = Math.ceil(selected * this.state.perPage);
  //   this.setState({ page: selected }, () => {
  //     this.props.fetchPosts(this.state.page);
  //   });
  // };

  render() {
    const { comments } = this.props;
    // const { pageCount } = this.props.pagination;
    const mapToComponents = (data) => {
      return data.map((comment) => {
        return (
          <Reply
            name={comment.name}
            comment={comment.memo}
            date={comment.date}
            id={comment._id}
          />
        );
      });
    };

    // if (loading) {
    //   return (
    //     <div className="container">
    //       <ReactLoading type="spin" color="#008081" />
    //     </div>
    //   );
    // } else if (error) {
    //   return (
    //     <div className="container">
    //       <div className="alert alert-danger">Error: {error.message}</div>
    //     </div>
    //   );
    // }
    return (
      <div>
        {mapToComponents(comments)}
      </div>
      // {/* <ReactPaginate
      //   previousLabel="previous"
      //   nextLabel="next"
      //   breakLabel={<a href="">...</a>}
      //   breakClassName="break-me"
      //   pageCount={pageCount}
      //   marginPagesDisplayed={2}
      //   forcePage={this.state.page}
      //   pageRangeDisplayed={5}
      //   onPageChange={this.handlePageClick}
      //   containerClassName="pagination"
      //   subContainerClassName="pages pagination"
      //   activeClassName="active"
      // /> */}
    );
  }
}

export default ReplyList;
