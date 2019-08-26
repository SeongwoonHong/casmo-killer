import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ isOpened, onClose, children }) => isOpened && ReactDOM.createPortal(
  <div
    id="Modal"
  >
    <div className="modal-content">
      <div
        className="modal-close"
        onClick={onClose}
      >
        Close
      </div>
      {children}
    </div>
  </div>, document.body
)

export { Modal };
