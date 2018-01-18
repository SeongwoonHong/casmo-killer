import React, { Component } from 'react';
import { Activity } from 'Activity';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class ActivityList extends Component {

  shouldComponentUpdate(nextProps) {
    const update = JSON.stringify(this.props) !== JSON.stringify(nextProps);
    return update;
  }

  render() {
    const mapToComponents = (data) => {
      return data.map((activity, i) => {
        return (
          <Activity
            data={activity}
            key={activity._id}
            index={i}
          />
        );
      });
    };
    return (
      <div>
        <ReactCSSTransitionGroup
          transitionName="activity"
          transitionEnterTimeout={2000}
          transitionLeaveTimeout={1000}>
          {mapToComponents(this.props.data)}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default ActivityList;
