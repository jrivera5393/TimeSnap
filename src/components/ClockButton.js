import React from "react";
import PropTypes from "prop-types";

const ClockButton = props => {
  return (
    <a
      ref={props.elementRef}
      onClick={props.onClick}
      style={props.style}
      className={props.className}
    >
      <i className={props.iconClass} />
    </a>
  );
};

ClockButton.propTypes = {
  elementRef: PropTypes.any.isRequired,
  onClick: PropTypes.func.isRequired,
  iconClass: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string
};

export default ClockButton;
