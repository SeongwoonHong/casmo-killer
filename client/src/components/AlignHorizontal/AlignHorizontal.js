import React, { Component } from 'react';
import './AlignHorizontal.scss';

class AlignHorizontal extends Component {
  render() {
    const { children } = this.props;
    return (
      <div className={ `alignHorizontal ${this.props.className}`}>
        {React.Children.map(children, (child) => {
          return child;
        })}
      </div>
    );
  }
}

export default AlignHorizontal;
