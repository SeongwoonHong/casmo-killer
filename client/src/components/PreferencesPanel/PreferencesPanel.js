import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './PreferencesPanel.scss';

class PreferencesPanel extends Component {
  likesHandler = () => {
    //
    this.props.onLikesHandler();
  }
  disLikesHandler = () => {
    //
  }
  render() {
    const { likes, disLikes } = this.props;
    return (
      <div className="preferences-panel">
        <i
          className="material-icons"
          onClick={this.likesHandler}
          role="presentation"
          onKeyDown={() => {}}
        >
          sentiment_very_satisfied
        </i>
        <span className="likes">{ likes }</span>
        <i
          className="material-icons"
          onClick={this.disLikesHandler}
          role="presentation"
          onKeyDown={() => {}}
        >
          sentiment_very_dissatisfied
        </i>
        <span className="dislikes">{ disLikes }</span>
      </div>
    );
  }
}
PreferencesPanel.defaultProps = {
  likes: 0,
  disLikes: 0
};

PreferencesPanel.propTypes = {
  likes: PropTypes.number,
  disLikes: PropTypes.number
};
export default PreferencesPanel;
