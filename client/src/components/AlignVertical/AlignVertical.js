import React, { Component } from 'react';
import './AlignVertical.scss';

class AlignVertical extends Component {
  render() {
    const { children } = this.props;
    return (
      <div className={ `alignVertical ${this.props.className}`}>
        {React.Children.map(children, (child) => {
          return child;
        })}
      </div>
    );
  }
}

export default AlignVertical;
