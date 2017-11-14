import React, { Component } from 'react';
import Materialize from 'materialize-css';
import { Link } from 'react-router-dom';
import LoadingCircle from '../Loading/LoadingCircle';

class Community extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseUrl: this.props.location.pathname
    };
  }
  componentDidMount() {
    this.props.fetchBoards();
  }

  render() {
    const { boards, loading, error } = this.props.boardsList;
    const mapToComponents = (data) => {
      return data.map((board) => {
        return (
          <div className="card" key={board}>
            <div className="card-content">
              <Link to={`${this.state.baseUrl}/${board}/board`}>{board}</Link>
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
      return (
        <div className="community">
          {Materialize.toast($(`<span style="color: #00c853">Error: ${error.message}</span>`), 3000)}
        </div>
      );
    }
    return (
      <div className="community">
        {mapToComponents(boards)}
      </div>
    );
  }
}

export default Community;
