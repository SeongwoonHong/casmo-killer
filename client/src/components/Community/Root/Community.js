import React, { Component } from 'react';
import Materialize from 'materialize-css';
import { Link } from 'react-router-dom';
import LoadingCircle from '../../Loading/LoadingCircle';
import BreadCrumbs from '../../BreadCrumbs/BreadCrumbs';
import Button from '../../Button/Button';
import './Community.scss';

class Community extends Component {
  constructor(props) {
    super(props);
    const pathName = this.props.location.pathname;
    const baseUrl = pathName.substring(0, pathName.lastIndexOf('/'));
    this.state = {
      baseUrl
    };
  }
  componentDidMount() {
    this.props.fetchBoardsRequest();
  }

  render() {
    const { data, loading, error } = this.props.boardList;
    const mapToComponents = (boardData) => {
      return boardData.map((board) => {
        return (
          <div className="col s12 m6 l4" key={board.boardId}>
            <div className="card teal darken-3">
              <div className="card-content white-text board-card">
                <span className="card-title">{board.boardId}</span>
                <p>{board.description}</p>
              </div>
              <div className="card-action">
                <Link to={{
                  pathname: `${this.state.baseUrl}/${board.boardId}`,
                  state: { page: 0, selected: 0 }
                  }}>들어가기
                </Link>
              </div>
            </div>
          </div>
        );
      });
    };

    if (loading) {
      return (
        <div className="community">
          <LoadingCircle />
        </div>
      );
    } else if (error) {
      Materialize.toast($(`<span style="color: #00c853">Error: ${error.message}</span>`), 3000);
      return (
        <div className="community">
          {error.message}
        </div>
      );
    }
    return (
      <div className="community">
        <BreadCrumbs url={this.state.baseUrl} />
        <Button
          className="btn waves-effect teal waves-light newBoard"
          name="action"
          to={`${this.state.baseUrl}/newBoard`}
          text="New Board"
          style={{ display: 'inline-block', width: '40%' }}
        />
        <div className="row">
          {mapToComponents(data)}
        </div>
      </div>
    );
  }
}

export default Community;
