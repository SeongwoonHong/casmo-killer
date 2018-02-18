import React, { Component } from 'react';

import './ModalContainer.scss';

class ModalContainer extends Component {

  constructor(props) {

    super(props);

    this.onModalClose = this.onModalClose.bind(this);

  }

  componentDidMount() {

    document.addEventListener('keydown', this.onModalClose, false);

  }

  componentWillUnmount() {

    document.removeEventListener('keydown', this.onModalClose, false);

  }

  onModalClose(e) {

    if (e.keyCode === 27) {
      this.props.onClose();
    }

  }

  render() {

    const { children, onClose } = this.props;

    return (
      <div className="modal-container">
        <div
          role="button"
          tabIndex="0"
          className="modal-toggler"
          onKeyDown={ () => {} }
          onClick={ onClose } />
        { children }
      </div>
    );
  }

}

export default ModalContainer;
