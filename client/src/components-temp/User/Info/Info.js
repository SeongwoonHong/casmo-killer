import React, { Component } from 'react';
import Materialize from 'materialize-css';
import ActivityList from '../../ActivityList/ActivityList';
import './Info.scss';

class Info extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingState: false
    };
  }

  componentDidMount() {

    const loadUntilScrollable = () => {
      // IF THE SCROLLBAR DOES NOT EXIST,
      if ((document.getElementsByClassName('component-container')[0].offsetHeight) < window.innerHeight) {
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

    this.props.fetchActivityRequest(true, undefined, undefined, this.props.match.params.userId).then(
      () => {
        setTimeout(loadUntilScrollable, 1000);
      }
    );

    document.getElementsByClassName('app-wrapper')[0].addEventListener('scroll', () => {
      // WHEN HEIGHT UNDER SCROLLBOTTOM IS LESS THEN 250

      // if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight)
      if ((document.getElementsByClassName('app-wrapper')[0].scrollTop) + 100 >= (document.getElementsByClassName('component-container')[0].offsetHeight - window.innerHeight)) {
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
    });
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

    // REMOVE WINDOWS SCROLL LISTENER
    $(window).unbind();
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
    console.log(this.props.activityList);
    const lastId = this.props.activityList.data[this.props.activityList.data.length - 1]._id;

    // START REQUEST
    return this.props.fetchActivityRequest(false, 'old', lastId, this.props.match.params.userId).then(() => {
      // IF IT IS LAST PAGE, NOTIFY
      if (this.props.isLast) {
        Materialize.toast('You are reading the last page', 2000);
      }
    });
  }

  render() {
    const { data } = this.props.activityList;

    return (
      <div className="wrapper">
        <ActivityList
          data={data} />
      </div>
    );
  }
}

export default Info;
