import React, { Component } from 'react';
import TransitionGroup from 'react-transition-group-plus';

import Activity from 'components/Activity/Activity';

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
        <TransitionGroup>
          {mapToComponents(this.props.data)}
        </TransitionGroup>
      </div>
    );
  }
}

export default ActivityList;
