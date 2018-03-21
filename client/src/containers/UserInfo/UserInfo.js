import React, { Component } from 'react';
import { toast } from 'react-toastify';
import ActivityList from '../../components/ActivityList/ActivityList';
import AlignHorizontal from '../../components/AlignHorizontal/AlignHorizontal';
import AlignVertical from '../../components/AlignVertical/AlignVertical';
import UserInfoHeader from '../../components/UserInfoHeader/UserInfoHeader';
import './UserInfo.scss';

class UserInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingState: false
    };
    this.scrollFunc = this.scrollEvent.bind(this);
  }

  componentDidMount() {

    this.props.fetchActivityRequest(true, undefined, undefined, this.props.match.params.userId).then(
      () => {
        this.loadUntilScrollable();
      }
    );

    (window.outerWidth < 990 && document.querySelector('.app-container').addEventListener('scroll', this.scrollFunc))
    || (window.outerWidth > 990 && document.querySelector('.root-container').addEventListener('scroll', this.scrollFunc));
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params !== prevProps.match.params) {
      this.componentWillUnmount();
      this.componentDidMount();
    }
  }

  componentWillUnmount() {
    // STOPS THE loadMemoLoop
    clearTimeout(this.memoLoaderTimeoutId);
    clearTimeout(this.loadUntilScrollableTimeoutId);

    // REMOVE WINDOWS SCROLL LISTENER
    (window.outerWidth < 990 && document.querySelector('.app-container').removeEventListener('scroll', this.scrollFunc))
    || (window.outerWidth > 990 && document.querySelector('.root-container').removeEventListener('scroll', this.scrollFunc));
  }

  loadUntilScrollable = () => {
    // IF THE SCROLLBAR DOES NOT EXIST,
    if ((document.querySelector('.User').scrollHeight) < window.innerHeight) {
      this.loadOldMemo().then(
        () => {
          // DO THIS RECURSIVELY UNLESS IT'S LAST PAGE
          if (!this.props.isLast) {
            loadUntilScrollable();
          }
        }
      );
    }
  };
  scrollEvent() {
    if ((window.outerWidth < 990 && (window.innerHeight + (document.querySelector('.app-container').scrollTop) > (document.querySelector('.User').scrollHeight - 50)))
      || (window.outerWidth > 990 && (window.innerHeight + (document.querySelector('.root-container').scrollTop) > (document.querySelector('.User').scrollHeight - 50)))) {
      if (!this.state.loadingState) {
        this.loadOldMemo();
        this.setState({
          loadingState: true
        });
      }
    } else if (this.state.loadingState) {
      this.setState({
        loadingState: false
      });
    }
  }

  loadOldMemo() {
    // CANCEL IF USER IS READING THE LAST PAGE
    if (this.props.isLast) {
      return new Promise(
        (resolve) => {
          resolve();
        }
      );
    }
    // GET ID OF THE ACTIVITY AT THE BOTTOM
    const lastId = this.props.activityList.data[this.props.activityList.data.length - 1]._id;

    // START REQUEST
    return this.props.fetchActivityRequest(false, 'old', lastId, this.props.match.params.userId).then(() => {
      // IF IT IS LAST PAGE, NOTIFY
      if (this.props.isLast) {
        toast.info('You are reading the last page!', {
          position: toast.POSITION_TOP_RIGHT
        });
      }
    });
  }

  render() {
    const { data } = this.props.activityList;
    return (
      <AlignVertical className="User-Info">
        <AlignHorizontal className="User-Info-Header">
          <UserInfoHeader
            userName={this.props.location.state.userName}
            avatar={this.props.location.state.avatar}
          />
        </AlignHorizontal>
        <ActivityList
          className="User-Info-ActivityList"
          data={data} />
      </AlignVertical>
    );
  }
}

export default UserInfo;
