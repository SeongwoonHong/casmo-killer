import React, { Component } from 'react';
// import { Link } from 'react-router-dom';

class Pagination extends Component {
  renderPages = (data) => {
    for (let i = 0; data > i; i += 1) {
      return (
        <li className={this.props.currentPage === i ? 'active' : 'waves-effect'}><a href="#!">{i + 1}</a></li>
      );
    }
  }

  render() {
    console.log(this.props.totalpage);
    return (
      <ul className="pagination">
        <li className="disabled"><a href="#!"><i className="material-icons">chevron_left</i></a></li>
        {this.renderPages(this.props.totalpage)}
        <li className="waves-effect"><a href="#!"><i className="material-icons">chevron_right</i></a></li>
      </ul>
    );
  }
}

export default Pagination;
