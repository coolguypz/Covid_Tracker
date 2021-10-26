
import React from 'react';
import ReactDOM from 'react-dom';

const Modal = (props) => props.isShowing ? ReactDOM.createPortal(
  <React.Fragment  >
    <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
      <div className="modal">
        <button type="button" className="modal-close-button"  onClick={props.toggleElement}>
          <span aria-hidden="true">&times;</span>
        </button>
        <div className="modal-header">
          <h3>Covid 19 Tracker Friendly Reminder</h3>
        </div>
        <hr/>
        <div className="modal-body">
          {/* <h4>{props.message}</h4> */}
          <p>This country has not update last 2 months</p>
        </div>
      </div>
    </div>
  </React.Fragment >, document.body
) : null;


export default Modal;